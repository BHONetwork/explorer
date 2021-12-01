import { useState, useEffect, useRef, Fragment } from "react";
import styled, { css } from "styled-components";
import { useRouter } from "next/router";
import Link from "next/link";

import ArrowDown from "./arrow-down.svg";
import { useWindowSize } from "utils/hooks";
import { useTheme } from "utils/hooks";
import { card_border } from "styles/textStyles";
import BlockchainIcon from "./blockchain.svg";
const Wrapper = styled.div`
  padding: 11px 0;
  position: relative;
  :not(:first-child) {
    margin-left: 40px;
  }
  @media screen and (max-width: 900px) {
    :not(:first-child) {
      margin-left: 0;
    }
  }
  ${(p) =>
    p.active &&
    css`
      border-radius: 8px;
      background: linear-gradient(360deg, #3186fd 2.73%, #3065fe 100%);
      padding: 11px;
      @media screen and (max-width: 900px) {
        background: transparent;
      }
    `}
`;

const TitleWrapper = styled.div`
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  text-decoration: none;
  color: #808191;
  cursor: pointer;
  display: flex;
  align-items: center;
  > :first-child {
    margin-right: 12px;
  }
  svg {
    > * {
      fill: #808191;
    }
  }
  ${(p) =>
    p.active &&
    css`
      color: #ffffff;
      svg {
        > * {
          fill: #ffffff;
        }
      }
      @media screen and (max-width: 900px) {
        background: linear-gradient(360deg, #3186fd 2.73%, #3065fe 100%);
      }
    `}

  @media screen and (max-width: 900px) {
    padding: 6px 12px;
    cursor: auto;
    > svg {
      display: none;
    }
  }
`;

const MouseWrapper = styled.div`
  z-index: 99;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 10px;
  @media screen and (max-width: 900px) {
    position: static;
    left: 0;
    transform: none;
  }
`;

const MenuWrapper = styled.div`
  min-width: 136px;
  color: #808191;
  background-color: #ffffff;
  ${card_border};
  padding: 8px 0;
  @media screen and (max-width: 900px) {
    position: static;
    box-shadow: none;
    transform: none;
    padding: 0;
  }
`;

const MenuItem = styled.div`
  cursor: pointer;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  @media screen and (max-width: 900px) {
    padding: 8px 12px 8px 24px;
  }
  ${(p) =>
    p.active &&
    css`
      color: #3186fd;
    `}
`;

const Divider = styled.div`
  margin: 8px 0;
  height: 1px;
  background: #808191;
  @media screen and (max-width: 900px) {
    display: none;
  }
`;

const menus = [
  {
    name: "Blocks",
    value: "blocks",
  },
  {
    name: "Extrinsics",
    value: "extrinsics",
  },
  {
    name: "Events",
    value: "events",
  },
  {
    name: "Transfers",
    value: "transfers",
  },
  // {
  //   name: "Teleports",
  //   value: "teleports",
  // },
  {
    name: "Accounts",
    value: "accounts",
  },
];

export default function SubMenu({ closeMenu }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const { width } = useWindowSize();
  const ref = useRef();
  const theme = useTheme();

  useEffect(() => {
    if (width <= 900) {
      setIsActive(false);
    }
  }, [width]);

  const onMouseOver = () => {
    if (width > 900) {
      setIsActive(true);
    }
  };

  const onMouseLeave = () => {
    if (width > 900) {
      setIsActive(false);
    }
  };

  return (
    <Wrapper
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      active={
        [
          "/blocks",
          "/extrinsics",
          "/events",
          "/transfers",
          "/accounts",
        ].indexOf(router.pathname) !== -1
      }
    >
      <TitleWrapper
        isActive={isActive}
        themecolor={theme.color}
        active={
          [
            "/blocks",
            "/extrinsics",
            "/events",
            "/transfers",
            "/accounts",
          ].indexOf(router.pathname) !== -1
        }
      >
        <BlockchainIcon />
        Blockchain
        <ArrowDown />
      </TitleWrapper>
      {(isActive || width <= 900) && (
        <MouseWrapper>
          <MenuWrapper ref={ref}>
            {menus.map((item, index) => (
              <Fragment key={index}>
                <Link href={`/${item.value}`} passHref>
                  <MenuItem
                    onClick={() => {
                      closeMenu();
                      setIsActive(false);
                    }}
                    active={router.pathname === `/${item.value}`}
                  >
                    {item.name}
                  </MenuItem>
                </Link>
                {index === 2 && <Divider />}
              </Fragment>
            ))}
          </MenuWrapper>
        </MouseWrapper>
      )}
    </Wrapper>
  );
}
