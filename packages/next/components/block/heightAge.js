import InLink from "../inLink";
import MinorText from "../minorText";
import { timeDuration } from "../../utils";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 240px;
  height: 72px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Link = styled.span`
  font-weight: 600;
`;

export default function HeightAge({ node, height, age }) {
  return (
    <Wrapper>
      <img src="/imgs/icons/block.svg" alt="" />
      <FlexWrapper style={{ width: 150, marginLeft: 16 }}>
        <InLink to={`/${node}/block/${height}`}>
          <Link>{height}</Link>
        </InLink>
        <FlexWrapper style={{ width: 150, marginTop: 4 }}>
          <img
            src="/imgs/icons/check-green.svg"
            alt=""
            style={{ marginRight: 6 }}
          />
          <MinorText>{timeDuration(age)}</MinorText>
        </FlexWrapper>
      </FlexWrapper>
    </Wrapper>
  );
}