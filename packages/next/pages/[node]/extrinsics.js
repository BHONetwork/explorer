import Layout from "components/layout";
import { ssrNextApi as nextApi } from "services/nextApi";
import { extrinsicsHead, EmptyQuery } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import HashEllipsis from "components/hashEllipsis";
import Result from "components/result";
import BreakText from "components/breakText";

export default function Extrinsics({ node, extrinsics }) {
  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Extrinsics" }]} node={node} />
        <Table
          head={extrinsicsHead}
          body={(extrinsics?.items || []).map((item) => [
            <InLink
              to={`/${node}/extrinsic/${item?.indexer?.blockHeight}-${item?.indexer?.index}`}
            >
              {item?.indexer?.blockHeight}-{item?.indexer?.index}
            </InLink>,
            <InLink to={`/${node}/block/${item?.indexer?.blockHeight}`}>
              {item?.indexer?.blockHeight}
            </InLink>,
            item?.indexer?.blockTime,
            <HashEllipsis
              hash={item?.hash}
              to={`/${node}/extrinsic/${item?.hash}`}
            />,
            <Result isSuccess={item?.isSuccess} />,
            <BreakText>{`${item?.section}(${item?.name})`}</BreakText>,
            item?.args,
          ])}
          foot={
            <Pagination
              page={extrinsics?.page}
              pageSize={extrinsics?.pageSize}
              total={extrinsics?.total}
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

  const { result: extrinsics } = await nextApi.fetch(`${node}/extrinsics`, {
    page: nPage - 1,
  });

  return {
    props: {
      node,
      extrinsics: extrinsics ?? EmptyQuery,
    },
  };
}
