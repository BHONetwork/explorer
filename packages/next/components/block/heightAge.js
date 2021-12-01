import InLink from "../inLink";
import MinorText from "../minorText";
import { timeDuration } from "../../utils";
import styled from "styled-components";
import Image from "next/image";

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
  width: 160px;
`;

const Link = styled.span`
  font-weight: 600;
`;

export default function HeightAge({ node, height, age, isFinalized = true }) {
  const imgUrl = `/imgs/icons/${
    isFinalized ? "check-success" : "check-pending"
  }.svg`;

  return (
    <Wrapper>
      <FlexWrapper>
        <InLink to={`/block/${height}`}>
          <Link>{height.toLocaleString()}</Link>
        </InLink>
        <FlexWrapper style={{ marginTop: 8 }}>
          <img src={imgUrl} alt="" style={{ marginRight: 6 }} />
          <MinorText>{timeDuration(age)}</MinorText>
        </FlexWrapper>
      </FlexWrapper>
    </Wrapper>
  );
}
