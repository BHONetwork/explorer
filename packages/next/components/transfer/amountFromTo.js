import styled from "styled-components";
import AddressEllipsis from "../addressEllipsis";
import SymbolLink from "components/symbolLink";

const Wrapper = styled.div`
  margin-right: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  > :not(:first-child) {
    margin-top: 4px;
  }
`;

const FlexWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  img {
    margin: 0 12px;
  }
`;

const Amount = styled.div`
  font-size: 18px;
  line-height: 24px;
  color: #fff;
`;
const FontBold = styled.span`
  font-weight: 600;
`;

export default function AmountFromTo({ amount, symbol, from, to, assetId }) {
  return (
    <Wrapper>
      <FlexWrapper>
        <Amount>
          <FontBold>{amount}</FontBold>{" "}
          <SymbolLink assetId={assetId}>{symbol}</SymbolLink>
        </Amount>
      </FlexWrapper>
      <FlexWrapper>
        <AddressEllipsis address={from} to={`/account/${from}`} />
        <img src={`/imgs/arrow.svg`} alt="arrow" />
        <AddressEllipsis address={to} to={`/account/${to}`} />
      </FlexWrapper>
    </Wrapper>
  );
}
