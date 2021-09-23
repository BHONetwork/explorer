import Identity from "./identity";
import CopyText from "../copyText";
import BreakText from "../breakText";
import MinorText from "../minorText";
import MonoText from "../monoText";
import Source from "./source";
import { useEffect, useState } from "react";
import { nodes } from "../../utils/constants";
import _ from "lodash";

function Address({ address }) {
  const [identity, setIdentity] = useState(null);
  const node = process.env.NEXT_PUBLIC_CHAIN;
  const relayChain =
    nodes.find((item) => item.value === node)?.sub?.toLowerCase() || "kusama";
  const headers = {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json;charset=UTF-8",
  };
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_IDENTITY_SERVER_HOST}/${relayChain}/short-ids`,
      {
        headers,
        method: "POST",
        body: JSON.stringify({ addresses: [address] }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        !_.isEmpty(res) && setIdentity(res[0]);
      })
      .catch(() => null);
  }, []);

  if (!identity) {
    return (
      <CopyText text={address}>
        <BreakText>
          <MinorText>
            <MonoText>{address}</MonoText>
          </MinorText>
        </BreakText>
      </CopyText>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      <Identity identity={identity} />
      <CopyText text={address}>
        <BreakText>
          <MinorText>
            <MonoText>{address}</MonoText>
          </MinorText>
        </BreakText>
      </CopyText>
      <Source relayChain={relayChain} address={address} />
    </div>
  );
}

export default Address;