import styled, { css } from "styled-components";

const StyledTable = styled.table`
  width: 100%;
  border-spacing: 0px;
  border-radius: 4px;
`;

const StyledTr = styled.tr`
  ${(p) =>
    p.isInnerTable
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

  height: 48px;
  border-style: solid;
  border-width: 1px 0 0 1px;
  border-color: #eeeeee;
  background-color: #ffffff;

  :last-child {
    border-width: 1px 1px 0 1px;
  }
`;

export default function InnerDataTable({ data, isInnerTable = false }) {
  const formatValue = (fieldValue) =>
    Array.isArray(fieldValue) ? (
      <StyledTd style={{ padding: 0 }}>
        <InnerDataTable data={fieldValue} isInnerTable />
      </StyledTd>
    ) : typeof fieldValue === "object" ? (
      <StyledTd style={{ padding: 0 }}>
        <InnerDataTable data={fieldValue} isInnerTable />
      </StyledTd>
    ) : (
      <StyledTd style={{ minWidth: 320, padding: "14px 24px" }}>
        {fieldValue}
      </StyledTd>
    );

  if (Array.isArray(data) && data.length < 2) {
    return (
      <StyledTable>
        {data.map((item) => (
          <StyledTr isInnerTable={isInnerTable}>{formatValue(item)}</StyledTr>
        ))}
      </StyledTable>
    );
  }

  if (typeof data === "object") {
    return (
      <StyledTable>
        {Object.keys(data).map((fieldName) => {
          const width = 40;
          return (
            <StyledTr isInnerTable={isInnerTable}>
              <StyledTd
                style={{
                  whiteSpace: "nowrap",
                  width,
                  minWidth: width,
                  padding: "14px 24px",
                }}
              >
                {fieldName}
              </StyledTd>
              {formatValue(data[fieldName])}
            </StyledTr>
          );
        })}
      </StyledTable>
    );
  }

  return <span>{JSON.stringify(data)}</span>;
}
