import styled from "styled-components";

import { getAssetInfo } from "utils/assetInfoData";
import { useNode } from "utils/hooks";
import Tooltip from "./tooltip";
import SymbolLink from "./symbolLink";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  text-decoration: none;
  color: #ffffff;
`;

export default function SymbolOnly({ symbol, assetId }) {
  return (
    <SymbolLink assetId={assetId}>
      <Wrapper>{symbol}</Wrapper>
    </SymbolLink>
  );
}
