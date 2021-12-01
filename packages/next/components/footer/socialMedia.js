import styled from "styled-components";

import Github from "../../public/imgs/icons/sns/github.svg";
import Twitter from "../../public/imgs/icons/sns/twitter.svg";
import Mail from "../../public/imgs/icons/sns/mail.svg";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const Link = styled.a`
  cursor: pointer;
  text-decoration: none;
  svg {
    * {
      fill-opacity: 0.8 !important;
      fill: #bcbcbc !important;
    }
  }
  &:hover {
    svg {
      * {
        fill-opacity: 1 !important;
      }
    }
  }
`;

export default function SocialMedia() {
  return (
    <Wrapper>
      <Link
        href="https://github.com/bholdus/"
        target="_blank"
        referrerPolicy="no-referrer"
      >
        <Github />
      </Link>
      <Link
        href="https://twitter.com/bholdus"
        target="_blank"
        referrerPolicy="no-referrer"
      >
        <Twitter />
      </Link>
      <Link href="mailto:support@bholdus.com" target="_blank">
        <Mail />
      </Link>
    </Wrapper>
  );
}
