require("dotenv").config();

const { disconnect, isApiConnected, getApi } = require("./api");
const { updateHeight, getLatestFinalizedHeight } = require("./chain");
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { sleep } = require("./utils/sleep");
const { getBlockIndexer } = require("./block/getBlockIndexer");
const { logger } = require("./logger");
const asyncLocalStorage = require("./asynclocalstorage");
const { withSession } = require("./mongo");
const last = require("lodash.last");
const { isUseMeta } = require("./env");
const { fetchBlocks } = require("./service/fetchBlocks");
const { initDb } = require("./mongo");
const { updateAllRawAddrs } = require("./service/updateRawAddress");
const { scanNormalizedBlock } = require("./scan");
const { makeAssetStatistics } = require("./statistic");
const { getLastBlockIndexer, isNewDay } = require("./statistic/date");
const { updateSpecs, getSpecHeights } = require("./specs");
const { updateUnFinalized } = require("./unFinalized");

const scanStep = parseInt(process.env.SCAN_STEP) || 100;

async function main() {
  await initDb();
  console.log("Init db done");
  await updateHeight();

  if (isUseMeta()) {
    console.log("Use meta");
    await updateSpecs();
    const specHeights = getSpecHeights();
    console.log(JSON.stringify(specHeights));
    if (specHeights.length <= 0 || specHeights[0] > 1) {
      console.error("No specHeights or invalid");
      return;
    }
  }

  let scanFinalizedHeight = await getNextScanHeight();
  console.log("scanFinalizedHeight height:" + scanFinalizedHeight);
  let blocks;
  let heights;
  // Cronjob to detect if process stall and kill if no change in synced block
  let last_synced_block = 0;
  setInterval(async () => {
    console.log("Interval check running...");
    const latest_block = await getNextScanHeight();
    if (latest_block === last_synced_block) {
      console.error(
        "No block scanned in the last 60 seconds. Restarting app..."
      );
      process.exit(0);
    } else {
      last_synced_block = latest_block;
    }
  }, 60000);
  // Main cronjob to sync block data
  while (true) {
    try {
      console.log("Scanning");
      await sleep(0);
      // chainHeight is the current on-chain last block height
      const finalizedHeight = getLatestFinalizedHeight();
      console.log("Finalised height:" + finalizedHeight);
      if (scanFinalizedHeight >= finalizedHeight) {
        console.log("Update unfinalised");
        await updateUnFinalized();
      }

      if (scanFinalizedHeight > finalizedHeight) {
        // Just wait if the to scan height greater than current chain height
        console.log("Wait to scan higher block");
        await sleep(3000);
        continue;
      }

      let targetHeight = finalizedHeight;
      // Retrieve & Scan no more than 100 blocks at a time
      if (scanFinalizedHeight + scanStep < finalizedHeight) {
        targetHeight = scanFinalizedHeight + scanStep;
        console.log("Target height:" + targetHeight);
      }

      const specHeights = getSpecHeights();
      console.log("Specs height:" + JSON.stringify(specHeights));
      if (targetHeight > last(specHeights)) {
        await updateSpecs();
      }

      heights = [];
      for (let i = scanFinalizedHeight; i <= targetHeight; i++) {
        heights.push(i);
      }
      // console.log(JSON.stringify(heights));
      blocks = await fetchBlocks(heights);
      // console.log('Blocks:'+JSON.stringify(blocks));
      if ((blocks || []).length <= 0) {
        await sleep(1000);
        continue;
      }

      const minHeight = blocks[0].height;
      const maxHeight = blocks[(blocks || []).length - 1].height;
      console.log("Min height:" + minHeight + ", max height:" + maxHeight);
      const updateAddrHeight = finalizedHeight - 100;
      if (minHeight <= updateAddrHeight && maxHeight >= updateAddrHeight) {
        logger.info(`To update accounts at ${updateAddrHeight}`);
        const block = (blocks || []).find((b) => b.height === updateAddrHeight);
        await updateAllRawAddrs(block.block);
        console.info(`Accounts updated at ${updateAddrHeight}`);
      } else if (maxHeight >= finalizedHeight && maxHeight % 100 === 0) {
        const block = blocks[(blocks || []).length - 1];
        await updateAllRawAddrs(block.block);
      }

      for (const block of blocks) {
        // console.log('Saving block:'+block.height);
        await withSession(async (session) => {
          session.startTransaction();
          try {
            await asyncLocalStorage.run(session, async () => {
              await scanBlock(block, session);
              await updateScanHeight(block.height);
            });

            await session.commitTransaction();
          } catch (e) {
            console.error(`Error with block scan ${block.height}`, e);
            await session.abortTransaction();
            throw e;
          }

          scanFinalizedHeight = block.height + 1;
        });
      }

      console.info(`block ${scanFinalizedHeight - 1} done`);
      blocks = null;
      heights = null;
    } catch (e) {
      if (!isApiConnected()) {
        console.log(`provider disconnected, will restart`);
        process.exit(0);
      }
    }
  }
}

async function scanBlock(blockInfo, session) {
  // console.log("Blockinfo:" + JSON.stringify(blockInfo));
  const blockIndexer = getBlockIndexer(blockInfo.block);
  if (isNewDay(blockIndexer.blockTime)) {
    await makeAssetStatistics(getLastBlockIndexer());
  }

  await scanNormalizedBlock(
    blockInfo.block,
    blockInfo.events,
    blockInfo.author,
    blockIndexer,
    session
  );
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(cleanUp);

async function cleanUp() {
  await disconnect();
}
