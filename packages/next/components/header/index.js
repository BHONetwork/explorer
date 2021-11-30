import { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { useRouter } from "next/router";
import Link from "next/link";

import {
  useOnClickOutside,
  useWindowSize,
  useHomePage,
  usePage,
} from "utils/hooks";
import Icon from "./icon.svg";
import IconActive from "./icon-active.svg";
import NodeSwitcher from "components/nodeSwitcher";
import Subheader from "./subheader";
import SearchS from "components/search/search-s";
import SubMenu from "./subMenu";
import { useTheme } from "utils/hooks";
import HomeIcon from "./home.svg";
import AssetIcon from "./asset.svg";
const NavContainer = styled.nav`
  position: relative;
  padding: 0 2rem;
  background-color: #fff;
  @media screen and (max-width: 1200px) {
    padding: 0 1.5rem;
  }

  .logo-s {
    display: none;
  }

  @media screen and (max-width: 900px) {
    .logo-full {
      display: none;
    }

    .logo-s {
      display: initial;
    }
  }
`;

const Container = styled.header`
  position: relative;
  padding: 0 2rem;
  @media screen and (max-width: 1200px) {
    padding: 0 1.5rem;
  }

  .logo-s {
    display: none;
  }

  @media screen and (max-width: 900px) {
    .logo-full {
      display: none;
    }

    .logo-s {
      display: initial;
    }
  }
`;

const Wrapper = styled.div`
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  ${(p) =>
    p.isHomePage &&
    css`
      height: 464px;
    `};
  @media screen and (max-width: 900px) {
    height: 68px;
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const IconWrapper = styled.div`
  display: none;
  width: 36px;
  height: 36px;
  background: #ffffff;
  border-radius: 8px;
  margin-right: 12px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: 1px solid #eeeeee;

  > svg {
    stroke: rgba(0, 0, 0, 0.65);
  }

  :hover {
    border-color: #bbbbbb;
  }
  ${(p) =>
    p.isActive &&
    css`
      border-color: #bbbbbb;
    `}

  @media screen and (max-width: 900px) {
    display: block;
  }
`;

const MenuWrapper = styled.div`
  display: flex;
  margin-left: 64px;
  @media screen and (max-width: 900px) {
    position: absolute;
    left: 24px;
    top: 60px;
    margin: 0;
    background: #ffffff;
    border: 1px solid #f8f8f8;
    box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
      0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
      0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
      0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
    border-radius: 8px;
    padding: 8px 0px;
    flex-direction: column;
    z-index: 99;
  }
`;

const MenuItem = styled.div`
  font-weight: 500;
  font-size: 15px;
  line-height: 24px;
  cursor: pointer;
  text-decoration: none;
  color: #808191;
  display: flex;
  justify-content: center;
  padding: 11px 24px;
  svg {
    margin-right: 12px;
    > * {
      fill: #808191;
    }
  }

  :not(:first-child) {
    margin-left: 40px;
  }

  @media screen and (max-width: 900px) {
    padding: 6px 12px;
    :hover {
      color: rgba(0, 0, 0, 0.8);
      /* color: inherit; */
      /* background: #fafafa; */
    }

    :not(:first-child) {
      margin-left: 0;
    }

    ${(p) =>
      p.selected &&
      css`
        background: #000;
      `}
  }

  ${(p) =>
    p.active &&
    css`
      border-radius: 8px;
      background: linear-gradient(360deg, #3186fd 2.73%, #3065fe 100%);
      padding: 11px 24px;
      color: #ffffff;
      svg {
        > * {
          fill: #ffffff;
        }
      }
    `}
  @media screen and (max-width: 900px) {
    justify-content: flex-start;
    svg {
      display: none;
    }
    ${(p) =>
      p.active &&
      css`
        border-radius: 0;
      `}
  }
`;

export default function Header({ node }) {
  const router = useRouter();
  // const isHomePage = useHomePage();
  const isPage = usePage();
  const [isActive, setIsActive] = useState(false);
  const { width } = useWindowSize();
  const ref = useRef();
  const theme = useTheme();
  useOnClickOutside(ref, () => setIsActive(false));

  useEffect(() => {
    if (width > 900) {
      setIsActive(false);
    }
  }, [width]);
  console.log(router.pathname === "/assets");
  return (
    <>
      <NavContainer>
        <Wrapper>
          <FlexWrapper>
            <IconWrapper
              isActive={isActive}
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? <IconActive /> : <Icon />}
            </IconWrapper>
            <Link href={`/`} passHref>
              <img
                className="logo-full"
                src="/imgs/logo.svg"
                alt="logo"
                style={{ cursor: "pointer" }}
              />
            </Link>
            <Link href={`/`} passHref>
              <img
                className="logo-s"
                src="/imgs/logo.svg"
                alt="logo"
                style={{ cursor: "pointer" }}
              />
            </Link>
            {(isActive || width > 900) && (
              <MenuWrapper ref={ref}>
                <Link href={`/`} passHref>
                  <MenuItem
                    themecolor={theme.color}
                    onClick={() => setIsActive(false)}
                    active={router.pathname === "/"}
                  >
                    <HomeIcon className="nav-icon" />
                    Home
                  </MenuItem>
                </Link>
                <SubMenu closeMenu={() => setIsActive(false)} />
                <Link href={`/assets`} passHref>
                  <MenuItem
                    themecolor={theme.color}
                    onClick={() => setIsActive(false)}
                    active={router.pathname === "/assets"}
                  >
                    <AssetIcon />
                    Assets
                  </MenuItem>
                </Link>
              </MenuWrapper>
            )}
          </FlexWrapper>
          {/* <FlexWrapper>
          <SearchS />
          <NodeSwitcher node={node} />
        </FlexWrapper> */}
        </Wrapper>
      </NavContainer>
      <Container>{isPage && <Subheader node={node} />}</Container>
    </>
  );
}
