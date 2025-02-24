import styled, { css } from "styled-components";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { useTheme, useNode } from "utils/hooks";
import InnerDataTable from "./table/innerDataTable";
import {
  convertArgsForJsonView,
  convertArgsForTableView,
} from "utils/dataWrapper";
import { makeEventArgs } from "utils/eventArgs";

const JsonView = dynamic(
  () => import("components/jsonView").catch((e) => console.error(e)),
  { ssr: false }
);

const Wrapper = styled.div`
  padding: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 14px;
  line-height: 20px;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-family: "Inter";
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

const Button = styled.div`
  background: #eeeeee;
  border-radius: 4px;
  padding: 2px 4px;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;
  min-width: 48px;
  text-align: center;
  color: rgba(0, 0, 0, 0.8);
  /* color: rgba(255, 255, 255, 0.65); */
  :not(:first-child) {
    margin-left: 8px;
  }
  ${(p) =>
    p.active &&
    css`
      color: ${p.color};
      background-color: ${p.background};
    `}
`;

export default function JsonDisplay({ data, type }) {
  const [displayType, setDisplayType] = useState("table");
  const [tableData, setTableData] = useState();
  const [jsonData, setJsonData] = useState();
  const theme = useTheme();
  const node = useNode();

  useEffect(() => {
    const item = window.localStorage.getItem("displayType");
    if (item) {
      setDisplayType(JSON.parse(item));
    }
  }, []);

  useEffect(() => {
    if (type === "extrinsic") {
      setTableData(convertArgsForTableView(data));
      setJsonData(convertArgsForJsonView(data));
    } else if (type === "event") {
      setTableData(makeEventArgs(node, data));
      setJsonData(data.data);
    } else {
      setTableData(data);
    }
  }, [type, data, node]);

  const onClick = (value) => {
    window.localStorage.setItem("displayType", JSON.stringify(value));
    setDisplayType(value);
  };

  return (
    <Wrapper colSpan="100%">
      <ActionWrapper>
        {tableData && (
          <Button
            color={theme?.color}
            background={theme?.colorSecondary}
            active={displayType === "table" || !jsonData}
            onClick={() => onClick("table")}
          >
            Table
          </Button>
        )}
        {jsonData && (
          <Button
            color={theme?.color}
            background={theme?.colorSecondary}
            active={displayType === "json"}
            onClick={() => onClick("json")}
          >
            Json
          </Button>
        )}
      </ActionWrapper>
      <div>
        {(displayType === "table" || !jsonData) && (
          <InnerDataTable data={tableData} />
        )}
        {displayType === "json" && jsonData && <JsonView src={jsonData} />}
      </div>
    </Wrapper>
  );
}
