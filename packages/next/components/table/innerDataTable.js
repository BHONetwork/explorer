import React from "react";
import styled, { css } from "styled-components";
import BreakText from "components/breakText";

const Wrapper = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-spacing: 0px;
  border-radius: 4px;

  tbody {
    ::before,
    ::after {
      display: none !important;
    }
  }
`;

const StyledTr = styled.tr`
  ${(p) =>
    p.nested
      ? css`
          :first-child {
            > td {
              border-width: 0 0 0 1px;
              :first-child {
                border-width: 0;
              }
            }
          }
          :not(:first-child) {
            > td {
              border-width: 1px 0 0 1px;
              :first-child {
                border-width: 1px 0 0 0;
              }
            }
          }
        `
      : css`
          :last-child {
            > td {
              border-width: 1px 0 1px 1px;
              :last-child {
                border-width: 1px 1px 1px 1px;
              }
            }
          }
        `}
`;

const StyledTd = styled.td`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;

  height: 40px;
  border-style: solid;
  border-width: 1px 0 0 1px;
  border-color: #eeeeee;
  background-color: #ffffff;
  color: rgba(0, 0, 0, 0.8) !important;
  span {
    color: rgba(0, 0, 0, 0.8) !important;
  }
  :last-child {
    border-width: 1px 1px 0 1px;
  }
`;

export default function InnerDataTable({ data, nested = false }) {
  if (React.isValidElement(data)) {
    return data;
  }

  const formatValue = (fieldValue) =>
    Array.isArray(fieldValue) ? (
      <StyledTd style={{ padding: 0 }}>
        <InnerDataTable data={fieldValue} nested />
      </StyledTd>
    ) : typeof fieldValue === "object" ? (
      fieldValue === null ? (
        <StyledTd style={{ minWidth: 320, padding: "10px 24px" }}>
          null
        </StyledTd>
      ) : React.isValidElement(fieldValue) ? (
        <StyledTd style={{ minWidth: 320, padding: "10px 24px" }}>
          {fieldValue}
        </StyledTd>
      ) : (
        <StyledTd style={{ padding: 0 }}>
          <InnerDataTable data={fieldValue} nested />
        </StyledTd>
      )
    ) : (
      <StyledTd style={{ minWidth: 320, padding: "10px 24px" }}>
        <BreakText>{fieldValue.toString()}</BreakText>
      </StyledTd>
    );

  if (Array.isArray(data) && data.length < 2) {
    return (
      data.length > 0 && (
        <StyledTable>
          <tbody>
            {data.map((item, index) => (
              <StyledTr key={index} nested={nested}>
                {formatValue(item)}
              </StyledTr>
            ))}
          </tbody>
        </StyledTable>
      )
    );
  }

  if (typeof data === "object") {
    let entries = [];
    if (data.object_type === "table_pairs" && data.object_data !== undefined) {
      entries = data.object_data;
    } else {
      entries = Object.entries(data);
    }

    const width = Array.isArray(data) ? 40 : 160;

    return (
      entries.length > 0 && (
        <Wrapper>
          <StyledTable>
            <tbody>
              {entries.map(([fieldName, fieldValue], index) => {
                return (
                  <StyledTr key={index} nested={nested}>
                    <StyledTd
                      style={{
                        whiteSpace: "nowrap",
                        width,
                        minWidth: width,
                        padding: "10px 24px",
                      }}
                    >
                      {fieldName}
                    </StyledTd>
                    {formatValue(fieldValue)}
                  </StyledTr>
                );
              })}
            </tbody>
          </StyledTable>
        </Wrapper>
      )
    );
  }

  return <span>{JSON.stringify(data)}</span>;
}
