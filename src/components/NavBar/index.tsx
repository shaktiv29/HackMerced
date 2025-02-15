import React, { FC, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import DarkModeToggle from "react-dark-mode-toggle";

import MLH_BANNER from "../../assets/images/mlh-badge.svg";
import "./styles.scss";

const Navbar: FC<{ backgroundColor?: string; textColor?: string; breakLineColor?: string; showBanner?: boolean }> = ({
    backgroundColor,
    textColor,
    breakLineColor,
    showBanner = true,
}): JSX.Element => {
    const [openDrawer, toggleDrawer] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState(() =>
        localStorage.getItem("theme") ? localStorage.getItem("theme") === "dark" : false,
    );
    const [theme, setTheme] = useState<boolean>(
        localStorage.getItem("theme") ? localStorage.getItem("theme") === "dark" : false,
    );
    const drawerRef = useRef(null);
    const { pathname } = useLocation();

    document.documentElement.setAttribute("data-theme", theme ? "dark" : "light");
    // document.getElementsByClassName('dark-mode-toggle')[0].children[0].children[0].children[0].children[1].children[1].children[0].children[0].style.fill = "orange";

    // handles updates to the navbar UI prior to rendering to support mobile view
    useEffect(() => {
        const closeDrawer = (event: { target: any }) => {
            if (drawerRef.current && (drawerRef?.current as any).contains(event.target)) {
                return;
            }

            toggleDrawer(false);
        };

        document.addEventListener("mousedown", closeDrawer);
        return () => document.removeEventListener("mousedown", closeDrawer);
    }, []);

    const NavbarItemsProps = {
        openDrawer: openDrawer,
    };

    // create a break line
    const BreakLine = (): JSX.Element => {
        return <div className="break-line" style={{ borderColor: breakLineColor }}></div>;
    };

    const themeSwitcher = () => {
        document.documentElement.setAttribute("data-theme", theme ? "dark" : "light");
        setTheme(!theme);
        localStorage.setItem("theme", !theme ? "dark" : "light");
        setIsDarkMode(() => !isDarkMode);
    };

    return (
        <Styles.Wrapper style={{ backgroundColor, color: textColor }}>
            <Menu.Wrapper>
                <Menu.Logo>
                    {showBanner ? (
                        <img className="MLH" src={MLH_BANNER} width="100" height="175" alt="MLH BANNER" />
                    ) : (
                        <div className="hm-text">HackMerced</div>
                    )}
                </Menu.Logo>

                <HamburgerButton.Wrapper onClick={() => toggleDrawer(true)}>
                    <HamburgerButton.Lines breakLineColor={breakLineColor} />
                </HamburgerButton.Wrapper>

                <Menu.Items ref={drawerRef} {...NavbarItemsProps} style={{ backgroundColor }}>
                    <Menu.Item>
                        <Link to="/">Home</Link>
                        {pathname === "/" ? BreakLine() : null}
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/past-hackathons">Past Hackathons</Link>
                        {pathname === "/past-hackathons" ? BreakLine() : null}
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/sponsors">Sponsors</Link>
                        {pathname === "/sponsors" ? BreakLine() : null}
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/contact-us">Contact Us</Link>
                        {pathname === "/contact-us" ? BreakLine() : null}
                    </Menu.Item>
                    <Menu.Item>
                        <div className="nav-toggle-switch">
                            <DarkModeToggle className="dark-mode-toggle" onChange={themeSwitcher} checked={isDarkMode} size={80} />
                        </div>
                    </Menu.Item>
                </Menu.Items>
            </Menu.Wrapper>
        </Styles.Wrapper>
    );
};

const Styles = {
    Wrapper: styled.header`
      display: flex;
      background-color: var(--orange);
      height: auto;
      color: white;
      max-height: 80px;

      @media only screen and (max-width: 40em) {
          height: ${(): string => {
              const { pathname } = useLocation();
              return pathname !== "/" ? "13vw" : "auto";
          }};

      @media only screen and (max-height: 400px) {
          height: ${(): string => {
              const { pathname } = useLocation();
              return pathname !== "/" ? "9vw" : "auto";
          }};
  `,
};

const Menu = {
    Wrapper: styled.nav`
        flex: 1;
        align-self: flex-start;
        padding: 1rem 3rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        @media only screen and (max-width: 910px) {
            padding: 0 2% 0 5%;
        }

        @media only screen and (max-height: 400px) {
            padding-top: 1%;
        }
    `,
    Logo: styled.h1`
        padding: 0.5rem 1rem;
    `,
    Items: styled.ul`
        display: flex;
        list-style: none;
        font-weight: 700;
        text-transform: uppercase;
        z-index: 30;

        @media only screen and (max-width: 910px) {
            position: fixed;
            right: 0;
            top: 0;
            height: 100%;
            flex-direction: column;
            padding: 0 2rem 1rem 2rem;
            margin-top: 0;
            transition: 0.2s ease-out;
            background-color: #ffb181;
            z-index: 101;
            transform: ${({ openDrawer }: { openDrawer: any }) => (openDrawer ? `translateX(0)` : `translateX(100%)`)};
        }
    `,
    Item: styled.li`
        padding: 0 1rem;
        cursor: pointer;

        @media only screen and (max-width: 910px) {
            padding: 1rem 0;
        }
    `,
};

const HamburgerButton = {
    Wrapper: styled.button`
        height: 3rem;
        width: 3rem;
        position: relative;
        font-size: 12px;
        display: none;
        border: none;
        background: transparent;
        outline: none;
        cursor: pointer;

        &:after {
            content: "";
            display: block;
            position: absolute;
            width: 150%;
        }

        @media only screen and (max-width: 910px) {
            display: block;
            margin-right: 1rem;
        }
    `,
    Lines: styled.div`
        top: 50%;
        margin-top: -0.125em;

        &,
        &:after,
        &:before {
            /* Create lines */
            height: 2px;
            pointer-events: none;
            display: block;
            content: "";
            width: 100%;
            background-color: white;
            position: absolute;
            background-color: ${({ breakLineColor }: { breakLineColor: any }) => breakLineColor};
        }

        &:after {
            /* Move bottom line below center line */
            top: -0.8rem;
        }

        &:before {
            /* Move top line on top of center line */
            top: 0.8rem;
        }
    `,
};

export default Navbar;
