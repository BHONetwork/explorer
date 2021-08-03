import Layout from "components/layout";
import { ssrNextApi as nextApi } from "services/nextApi";
import { teleportsHead, EmptyQuery, nodes } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import AddressEllipsis from "components/addressEllipsis";
import Filter from "components/filter";
import { bigNumber2Locale, fromSymbolUnit } from "utils";
import TeleportDirection from "components/teleportDirection";
import { getSymbol } from "utils/hooks";
import BigNumber from "bignumber.js";
import Result from "components/result";

function getTeleportSourceAndTarget(node, direction) {
  const chain = nodes.find(item => item.value === node);
  if (direction === "in") {
    return { source: chain.sub, target: chain.name };
  } else {
    return { source: chain.name, target: chain.sub };
  }
}

export default function Events({ node, teleports, filter }) {
  const symbol = getSymbol(node);
  const teleportSourceAndTarget = (direction) => getTeleportSourceAndTarget(node, direction);

  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Teleports" }]} node={node} />
        <Filter total={`All ${teleports?.total} teleports`} data={filter} />
        <Table
          head={teleportsHead}
          body={(teleports?.items || []).map((item) => [
            <InLink to={`/${node}/extrinsic/${item.indexer.blockHeight}-${item.indexer.index}`}>
              {`${item.indexer.blockHeight}-${item.indexer.index}`}
            </InLink>,
            item.indexer.blockTime,
            <TeleportDirection
              from={teleportSourceAndTarget(item.teleportDirection).source}
              to={teleportSourceAndTarget(item.teleportDirection).target}
            />,
            item.beneficiary
              ? <AddressEllipsis
                  address={item.beneficiary}
                  to={`/${node}/account/${item.beneficiary}`}
                />
              : "-",
            item.teleportDirection === "in"
              ? <Result isSuccess={item.complete} noText={true} />
              : "-",
            !item.complete || item.amount === null || item.amount === undefined
              ? "-"
              : `${bigNumber2Locale(fromSymbolUnit(
                    new BigNumber(item.amount).minus(item.fee || 0).toString(),
                    symbol
                  ))} ${symbol}`,
            item.fee === null || item.fee === undefined
              ? "-"
              : `${bigNumber2Locale(fromSymbolUnit(item.fee, symbol))} ${symbol}`,
            item.amount === null || item.amount === undefined
              ? "-"
              : `${bigNumber2Locale(fromSymbolUnit(item.amount, symbol))} ${symbol}`,
          ])}
          foot={
            <Pagination
              page={teleports?.page}
              pageSize={teleports?.pageSize}
              total={teleports?.total}
            />
          }
          collapse={900}
        />
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { node } = context.params;
  const { page } = context.query;

  const nPage = parseInt(page) || 1;

  const { result: teleports } = await nextApi.fetch(`${node}/teleports`, {
    page: nPage - 1,
    pageSize: 25,
  });

  const filter = [
    {
      value: "",
      name: "Type",
      query: "type",
      options: [{ text: "All", value: "" }],
    },
  ];

  return {
    props: {
      node,
      teleports: teleports ?? EmptyQuery,
      filter,
    },
  };
}