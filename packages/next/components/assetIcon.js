import styled from "styled-components";

import { getAssetInfo } from "utils/assetInfoData";
import { useNode } from "utils/hooks";
import Tooltip from "./tooltip";
import SymbolLink from "./symbolLink";

const Img = styled.img`
  margin-right: 8px;
  display: initial !important;
  border-radius: 50%;
`;

export default function AssetIcon({ assetId, destroyedAt, size = 24 }) {
  const node = useNode();
  let iconSrc = getAssetInfo(node, assetId)?.icon ?? `/imgs/icons/default.svg`;
  let Icon = <Img src={iconSrc} width={size} height={size} />;
  if (destroyedAt) {
    iconSrc = `/imgs/icons/destroyed.svg`;
    Icon = (
      <Tooltip content={"Asset has been destroyed"}>
        <Img
          src={iconSrc}
          width={size}
          height={size}
          style={{ marginTop: 4 }}
        />
      </Tooltip>
    );
  }
  return <SymbolLink assetId={assetId}>{Icon}</SymbolLink>;
}
