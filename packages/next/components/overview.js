import styled from "styled-components";
import LineChart from "components/charts/lineChart";
import { useEffect, useRef, useState } from "react";
import { card_border } from "styles/textStyles";

const Wrapper = styled.div`
  background: #113162;
  border-radius: 12px;
  padding: 24px 48px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  /* flex-wrap: wrap; */
  @media screen and (max-width: 640px) {
    padding: 24px 24px;
    flex-direction: column;
    > :first-child {
      margin-bottom: 26px;
    }
  }
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  @media screen and (max-width: 640px) {
  }
`;

const ItemWrapper = styled.div`
  min-width: 130px;
  text-align: center;
  img {
    width: 43px;
    height: 48px;
    margin-bottom: 16px;
    @media screen and (max-width: 640px) {
      margin-bottom: 8px;
    }
  }
  @media screen and (max-width: 900px) {
    width: 130px;
  }
`;

const Title = styled.p`
  font-size: 14px;
  line-height: 16px;
  color: #bcbcbc;
  margin: 0 0 8px;
`;

const Text = styled.p`
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  color: #ffffff;
  margin: 0;
`;

const Divider = styled.div`
  width: 1px;
  background: #f4f4f4;
  @media screen and (max-width: 900px) {
    width: 100%;
    height: 1px;
  }
`;

const ChartWrapper = styled.div`
  width: 227px;
  height: 48px;
  @media screen and (max-width: 900px) {
    width: 100%;
  }
`;

const easeOutQuart = (t, b, c, d) => {
  return -c * ((t = t / d - 1) * t * t * t - 1) + b;
};

export default function Overview({ node, overviewData, price }) {
  const blocksHeightData = overviewData?.latestBlocks[0]?.header.number;
  // const tokenMap = new Map([
  //   ["westmint", "WND"],
  //   ["statemine", "KSM"],
  //   ["polkadot", "DOT"],
  // ]);

  // const colorMap = new Map([
  //   ["KSM", "#0f0f0f"],
  //   ["WND", "#F22279"],
  // ]);

  // const token = tokenMap.get(node) ?? "";

  // const color = colorMap.get(token) ?? "#ddd";

  // const chartData = price ?? [];

  const [blocksHeightDynamic, setBlocksHeightDynamic] = useState(0);
  const [assetsCountDynamic, setAssetsCountDynamic] = useState(0);
  const [transfersCountDynamic, setTransfersCountDynamic] = useState(0);
  const [holdersCountDynamic, setHolderCountDynamic] = useState(0);

  const requestRef = useRef();
  const previousTimeRef = useRef();
  const animationDuration = 500;

  useEffect(() => {
    if (overviewData && blocksHeightData) {
      if (
        blocksHeightData === blocksHeightDynamic &&
        overviewData.assetsCount === assetsCountDynamic &&
        overviewData.transfersCount === transfersCountDynamic &&
        overviewData.holdersCount === holdersCountDynamic
      ) {
        return;
      }

      const diffBlocksHeight = blocksHeightData - blocksHeightDynamic;
      const diffAssetsCount = overviewData.assetsCount - assetsCountDynamic;
      const diffTransfersCount =
        overviewData.transfersCount - transfersCountDynamic;
      const diffHoldersCount = overviewData.holdersCount - holdersCountDynamic;

      const tick = (now) => {
        const elapsed = now - previousTimeRef.current;
        if (elapsed >= 0) {
          const progress = easeOutQuart(elapsed, 0, 1, animationDuration);

          setBlocksHeightDynamic(
            blocksHeightDynamic + Math.round(progress * diffBlocksHeight)
          );
          setAssetsCountDynamic(
            assetsCountDynamic + Math.round(progress * diffAssetsCount)
          );
          setTransfersCountDynamic(
            transfersCountDynamic + Math.round(progress * diffTransfersCount)
          );
          setHolderCountDynamic(
            holdersCountDynamic + Math.round(progress * diffHoldersCount)
          );
        }

        if (elapsed < animationDuration) {
          requestRef.current = requestAnimationFrame(tick);
        } else {
          setBlocksHeightDynamic(blocksHeightData);
          setAssetsCountDynamic(overviewData.assetsCount);
          setTransfersCountDynamic(overviewData.transfersCount);
          setHolderCountDynamic(overviewData.holdersCount);
        }
      };

      previousTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(requestRef.current);
    }
    /*eslint-disable */
  }, [blocksHeightData, overviewData]);
  /*eslint-enable */

  return (
    <Wrapper>
      <ColumnWrapper>
        <ItemWrapper>
          <img src="/imgs/icons/overview/blocks.svg" alt="block height" />
          <Title>Block Height</Title>
          <Text>{blocksHeightDynamic?.toLocaleString()}</Text>
        </ItemWrapper>
        <ItemWrapper>
          <img src="/imgs/icons/overview/transfers.svg" alt="block height" />
          <Title>Transfers</Title>
          <Text>{transfersCountDynamic?.toLocaleString()}</Text>
        </ItemWrapper>
      </ColumnWrapper>
      <ColumnWrapper>
        <ItemWrapper>
          <img src="/imgs/icons/overview/assets.svg" alt="block height" />
          <Title>Assets</Title>
          <Text>{assetsCountDynamic?.toLocaleString()}</Text>
        </ItemWrapper>
        <ItemWrapper>
          <img src="/imgs/icons/overview/holders.svg" alt="block height" />
          <Title>Holders</Title>
          <Text>{holdersCountDynamic?.toLocaleString()}</Text>
        </ItemWrapper>
      </ColumnWrapper>
      {/* <Divider /> */}
      {/* <div /> */}
      {/* <ChartWrapper>
        <LineChart token={token} data={chartData} color={color} />
      </ChartWrapper> */}
    </Wrapper>
  );
}
