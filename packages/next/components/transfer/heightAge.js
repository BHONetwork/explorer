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
  width: 160px;
`;

const Link = styled.span`
  font-weight: 600;
`;

export default function HeightAge({
  age,
  isEvent,
  blockHeight,
  extrinsicIndex,
}) {
  return (
    <Wrapper>
      <FlexWrapper>
        {isEvent ? (
          <InLink to={`/block/${blockHeight}`}>
            <Link>{blockHeight.toLocaleString()}</Link>
          </InLink>
        ) : (
          <InLink to={`/extrinsic/${blockHeight}-${extrinsicIndex}`}>
            <Link>{`${blockHeight.toLocaleString()}-${extrinsicIndex}`}</Link>
          </InLink>
        )}
        <FlexWrapper style={{ marginTop: 8 }}>
          <img
            src="/imgs/icons/check-success.svg"
            alt=""
            style={{ marginRight: 6 }}
          />
          <MinorText>{timeDuration(age)}</MinorText>
        </FlexWrapper>
      </FlexWrapper>
    </Wrapper>
  );
}
