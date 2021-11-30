import styled from "styled-components";
import Image from "next/image";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

  > :not(:first-child) {
    margin-left: 8px;
  }

  @media screen and (max-width: 600px) {
    justify-content: center;
    flex-wrap: wrap;
    div {
      flex-wrap: nowrap;
    }
  }
`;

const Text = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: #bcbcbc;
`;

export default function Producer() {
  return (
    <Wrapper>
      <Wrapper>
        <Text>{`© ${new Date().getFullYear()} Bholdus. All Rights Reserved`}</Text>
      </Wrapper>
    </Wrapper>
  );
}
