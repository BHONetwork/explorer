const { HttpError } = require("../../exc");
const { extractPage } = require("../../utils");
const {
  getNftClassCollection,
  getClassAttributeCollection,
  getClassTimelineCollection,
  getIpfsMetadataCollection,
}  = require("../../mongo");

async function getIpfsData(nftObj) {
  if (!nftObj?.metadata?.data) {
    return undefined;
  }

  const ipfsMetadataCol = await getIpfsMetadataCollection();
  const ipfsMetadata = await ipfsMetadataCol.findOne({
    dataId: nftObj.metadata.data,
  });

  return ipfsMetadata;
}

async function queryAllClasses(statusQuery, page, pageSize) {
  const col = await getNftClassCollection();

  const [result] = await col.aggregate([
    { $match: statusQuery },
    {
      $facet: {
        items: [
          { $sort: { classId: 1 } },
          { $skip: page * pageSize },
          { $limit: pageSize },
          {
            $lookup: {
              from: "ipfsMetadata",
              localField: "metadata.data",
              foreignField: "dataId",
              as: "ipfsMetadata",
            }
          },
          {
            $addFields: {
              ipfsMetadata: {
                $arrayElemAt: ["$ipfsMetadata", 0]
              }
            }
          }
        ],
        total: [
          { $count: "count" }
        ],
      }
    },
  ]).toArray();

  return result;
}

async function queryRecognizedClasses(statusQuery, page, pageSize)  {
  const col = await getNftClassCollection();

  const [result] = await col.aggregate([
    { $match: statusQuery },
    {
      $lookup: {
        from: "ipfsMetadata",
        localField: "metadata.data",
        foreignField: "dataId",
        as: "ipfsMetadata",
      }
    },
    {
      $addFields: {
        ipfsMetadata: {
          $arrayElemAt: ["$ipfsMetadata", 0]
        }
      }
    },
    {
      $match: {
        "ipfsMetadata.recognized": true
      }
    },
    {
      $facet: {
        items: [
          { $sort: { classId: 1 } },
          { $skip: page * pageSize },
          { $limit: pageSize },
        ],
        total: [
          { $count: "count" }
        ],
      },
    },
  ]).toArray();

  return result;
}

async function queryUnrecognizedClasses(statusQuery, page, pageSize) {
  const col = await getNftClassCollection();

  const [result] = await col.aggregate([
    { $match: statusQuery },
    {
      $lookup: {
        from: "ipfsMetadata",
        localField: "metadata.data",
        foreignField: "dataId",
        as: "ipfsMetadata",
      }
    },
    {
      $addFields: {
        ipfsMetadata: {
          $arrayElemAt: ["$ipfsMetadata", 0]
        }
      }
    },
    {
      $match: {
        $or: [
          { "ipfsMetadata.recognized": false },
          { "ipfsMetadata.recognized": { $exists: false } },
        ]
      }
    },
    {
      $facet: {
        items: [
          { $sort: { classId: 1 } },
          { $skip: page * pageSize },
          { $limit: pageSize },
        ],
        total: [
          { $count: "count" }
        ],
      },
    },
  ]).toArray();

  return result;
}

async function getNftClasses(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { recognized, status } = ctx.query;

  const statusQuery = { isDestroyed: false };
  if (status === "destroyed") {
    statusQuery.isDestroyed = true;
  }
  else if (status === "frozen") {
    statusQuery["details.isFrozen"] = true;
  }

  if (recognized === "true" || recognized === "1") {
    const result = await queryRecognizedClasses(statusQuery, page, pageSize);

    ctx.body = {
      items: result.items,
      page,
      pageSize,
      total: result.total[0]?.count || 0,
    };
  } else if (recognized === "false" || recognized === "0") {
    const result = await queryUnrecognizedClasses(statusQuery, page, pageSize);

    ctx.body = {
      items: result.items,
      page,
      pageSize,
      total: result.total[0]?.count || 0,
    };
  } else {
    const result = await queryAllClasses(statusQuery, page, pageSize);

    ctx.body = {
      items: result.items,
      page,
      pageSize,
      total: result.total[0]?.count || 0,
    };
  }
}

async function getNftClassById(ctx) {
  const { classId } = ctx.params;
  const col = await getNftClassCollection();
  const option = { sort: { "createdAt.blockHeight": -1 } };
  const item = await col.findOne({ classId: parseInt(classId) }, option);

  if (!item) {
    throw new HttpError(400, "Class not found");
  }

  const timelineCol = await getClassTimelineCollection();
  const timeline = await timelineCol.find({
    classId: item.classId,
    classHeight: item.indexer.blockHeight,
  }).toArray();

  const attrCol = await getClassAttributeCollection();
  const attributes = await attrCol.find({
    classId: item.classId,
    classHeight: item.indexer.blockHeight,
  }).toArray();

  const ipfsMetadata = await getIpfsData(item);

  ctx.body = {
    ...item,
    timeline,
    attributes,
    ipfsMetadata,
  };
}

async function getNftClass(ctx) {
  const { blockHeight, classId } = ctx.params;
  const col = await getNftClassCollection();
  const item = await col.findOne({
    classId: parseInt(classId),
    "indexer.blockHeight": parseInt(blockHeight),
  });

  if (!item) {
    throw new HttpError(400, "Class not found");
  }

  const timelineCol = await getClassTimelineCollection();
  const timeline = await timelineCol.find({
    classId: item.classId,
    classHeight: item.indexer.blockHeight,
  }).toArray();

  const attrCol = await getClassAttributeCollection();
  const attributes = await attrCol.find({
    classId: item.classId,
    classHeight: item.indexer.blockHeight,
  }).toArray();

  const ipfsMetadata = await getIpfsData(item);

  ctx.body = {
    ...item,
    timeline,
    attributes,
    ipfsMetadata,
  };
}

module.exports = {
  getNftClasses,
  getNftClassById,
  getNftClass,
};