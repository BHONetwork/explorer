import styled from "styled-components";
import { ssrNextApi as nextApi } from "services/nextApi";
import Layout from "components/layout";
import Section from "components/section";
import Nav from "components/nav";
import DetailTable from "components/detailTable";
import MinorText from "components/minorText";
import InLink from "components/inLink";
import {
  timeDuration,
  time,
  fromAssetUnit,
  fromSymbolUnit,
  bigNumber2Locale,
} from "utils";
import { eventHead } from "utils/constants";
import PageNotFound from "components/pageNotFound";
import JsonAttributes from "components/jsonAttributes";
import { getSymbol } from "utils/hooks";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;

  > :not(:first-child) {
    margin-left: 16px;
  }
`;

const AccessoryText = styled.div`
  color: rgba(255, 255, 255, 0.8);
`;

export default function Block({ node, id, eventDetail }) {
  const symbol = getSymbol(node);

  if (!eventDetail) {
    return (
      <Layout node={node}>
        <PageNotFound />
      </Layout>
    );
  }

  return (
    <Layout node={node}>
      <Section>
        <div>
          <Nav data={[{ name: "Event" }, { name: id }]} node={node} />
          <DetailTable
            head={eventHead}
            body={[
              <FlexWrapper key="1">
                <MinorText>{time(eventDetail?.indexer?.blockTime)}</MinorText>
                <AccessoryText>
                  {eventDetail?.indexer?.blockTime &&
                    timeDuration(eventDetail?.indexer?.blockTime)}
                </AccessoryText>
              </FlexWrapper>,
              <InLink
                key="2"
                to={`/block/${eventDetail?.indexer?.blockHeight}`}
              >
                {eventDetail?.indexer?.blockHeight.toLocaleString()}
              </InLink>,
              eventDetail?.phase?.value ? (
                <InLink
                  to={`/extrinsic/${eventDetail?.indexer?.blockHeight}-${eventDetail?.phase?.value}`}
                >
                  {`${eventDetail?.indexer?.blockHeight.toLocaleString()}-${
                    eventDetail?.phase?.value
                  }`}
                </InLink>
              ) : (
                "-"
              ),
              eventDetail?.sort,
              eventDetail?.section,
              eventDetail?.method,
              (eventDetail?.meta?.docs || eventDetail?.meta?.documentation)
                ?.join("")
                .trim() || "",
              eventDetail?.transfer
                ? eventDetail.transfer.assetSymbol
                  ? `${bigNumber2Locale(
                      fromAssetUnit(
                        eventDetail.transfer.balance,
                        eventDetail.transfer.assetDecimals
                      )
                    )} ${eventDetail.transfer.assetSymbol}`
                  : `${bigNumber2Locale(
                      fromSymbolUnit(eventDetail.transfer.balance, symbol)
                    )} ${symbol}`
                : "-",
            ]}
            foot={
              <JsonAttributes
                title={"Attributes"}
                data={eventDetail}
                type="event"
              />
            }
          />
        </div>
      </Section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const node = process.env.NEXT_PUBLIC_CHAIN;
  const { id } = context.params;
  const { result: eventDetail } = await nextApi.fetch(`events/${id}`);

  return {
    props: {
      node,
      id,
      eventDetail: eventDetail ?? null,
    },
  };
}
