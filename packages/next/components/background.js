import styled from "styled-components";

import { useHomePage } from "utils/hooks";

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 320px;
  background: #161e32;
`;

const Masked = styled.div`
  margin-top: 64px;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  position: relative;
  background-image: url("/imgs/background.png");
  background-repeat: no-repeat;
  background-color: #161e32;
  background-size: contain;
`;

export default function Background() {
  const isHomePage = useHomePage();

  return (
    <Wrapper isHomePage={isHomePage}>
      <Masked />
    </Wrapper>
  );
}
