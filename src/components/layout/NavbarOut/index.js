import React, { useState } from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
  NavBtnLinkPrimary,
  Image,
  NavItem,
  IconButton,
  IconButtonMb,
  Caret,
  Help,
  App,
  Dropdown,
  Dropdown2,
  Dropdown3,
  DropdownMb,
  DropdownMenuItem,
  DropdownMenuItemLink,
  DropdownMenuIcon,
  DropdownMenuIconRight
} from './NavbarElements';
import Logo from '../../../assets/logo/cryptosx-logo.png';
import { FaChartBar, FaRegChartBar } from 'react-icons/fa';
import { FaLandmark } from 'react-icons/fa';
import { FaLayerGroup } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { FaShareSquare } from 'react-icons/fa';
import { FaUserShield } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { FaMoneyBill } from 'react-icons/fa';

const NavbarOut = () => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [openMb, setOpenMb] = useState(false);

  return (
    <React.Fragment>
      <Nav>
        <Image href="https://cryptosx.io/investorportal.html" activeStyle>
          <img src={Logo} style={{ width: '200px' }} alt="logo" />
        </Image>
        <IconButtonMb activeStyle onClick={() => setOpenMb(!openMb)}>
          <Bars />
        </IconButtonMb>
        <NavMenu />
        <NavBtn>
          <NavItem activeStyle>
            <IconButton
              activeStyle
              onClick={() => {
                setOpen(!open);
                setOpen2(false);
                setOpen3(false);
              }}>
              <App />
            </IconButton>
            <IconButton
              activeStyle
              onClick={() => {
                setOpen2(!open2);
                setOpen(false);
                setOpen3(false);
              }}>
              <Help />
            </IconButton>
            {/*
            <IconButton
              activeStyle
              onClick={() => {
                setOpen3(!open3);
                setOpen(false);
                setOpen2(false);
              }}>
              <Caret />
            </IconButton>*/}
            <NavBtnLinkPrimary to="/login">Log in</NavBtnLinkPrimary>
            <NavBtnLink to="/signup">Sign Up</NavBtnLink>
            {open ? <DropdownMenu /> : ''}
            {open2 ? <DropdownMenu2 /> : ''}
          </NavItem>
          {/* <NavBtnLink to="/settings">Settings</NavBtnLink> */}
        </NavBtn>
        {openMb ? <DropdownMenuMb closeMenu={() => setOpenMb(!openMb)} /> : ''}
      </Nav>
    </React.Fragment>
  );
};

const DropdownMenu = () => {
  const DropdownItem = props => {
    return (
      <DropdownMenuItem href={props.link}>
        <DropdownMenuIcon>{props.leftIcon}</DropdownMenuIcon>
        {props.children}
        <DropdownMenuIconRight>{props.rightIcon}</DropdownMenuIconRight>
      </DropdownMenuItem>
    );
  };
  return (
    <Dropdown activeStyle>
      <DropdownItem leftIcon={<FaChartBar />} link="https://app.cryptosx.io">
        Crypto Exchange
      </DropdownItem>
      <DropdownItem
        leftIcon={<FaLandmark />}
        link="https://investorportal.cryptosx.io">
        STO Exchange
      </DropdownItem>
      <DropdownItem leftIcon={<FaLayerGroup />} link="https://dex.cryptosx.io">
        DEX
      </DropdownItem>
    </Dropdown>
  );
};

const DropdownMenu2 = () => {
  const DropdownItem = props => {
    return (
      <DropdownMenuItem href={props.link} target="_blank">
        <DropdownMenuIcon>{props.leftIcon}</DropdownMenuIcon>
        {props.children}
        <DropdownMenuIconRight>{props.rightIcon}</DropdownMenuIconRight>
      </DropdownMenuItem>
    );
  };
  return (
    <Dropdown2 activeStyle>
      <DropdownItem
        leftIcon={<FaUserShield />}
        link="https://cryptosx.freshdesk.com/en/support/tickets/new">
        Support Center
      </DropdownItem>
      <DropdownItem
        leftIcon={<FaSearch />}
        link="https://cryptosx.freshdesk.com/en/support/solutions">
        FAQs and Guides
      </DropdownItem>
      <DropdownItem
        leftIcon={<FaMoneyBill />}
        link="https://cryptosx.freshdesk.com/en/support/solutions/articles/44001340353-unified-fee-schedule">
        Fee Schedule
      </DropdownItem>
    </Dropdown2>
  );
};

const DropdownMenuMb = props => {
  const DropdownItem = props => {
    return (
      <DropdownMenuItem href={props.link}>
        <DropdownMenuIcon>{props.leftIcon}</DropdownMenuIcon>
        {props.children}
        <DropdownMenuIconRight>{props.rightIcon}</DropdownMenuIconRight>
      </DropdownMenuItem>
    );
  };

  const DropdownItemLink = props => {
    return (
      <DropdownMenuItemLink to={props.to} onClick={() => props.closeMenu()}>
        <DropdownMenuIcon>{props.leftIcon}</DropdownMenuIcon>
        {props.children}
        <DropdownMenuIconRight>{props.rightIcon}</DropdownMenuIconRight>
      </DropdownMenuItemLink>
    );
  };

  return (
    <DropdownMb activeStyle>
      <NavBtnLinkPrimary to="/login">Log in</NavBtnLinkPrimary>
      <NavBtnLink to="/signup">Sign Up</NavBtnLink>
      <h2
        style={{
          marginTop: '20px',
          textAlign: 'center',
          padding: '10px 0',
          background: '#eeeeee',
          borderRadius: '5px'
        }}>
        Other Apps
      </h2>
      <DropdownItem
        leftIcon={<FaChartBar />}
        link="https://investorportal.cryptosx.io">
        Crypto Exchange
      </DropdownItem>
      <DropdownItem
        leftIcon={<FaLandmark />}
        link="https://investorportal.cryptosx.io">
        STO Exchange
      </DropdownItem>
      <DropdownItem leftIcon={<FaLayerGroup />} link="https://dex.cryptosx.io">
        DEX
      </DropdownItem>
      <DropdownItem
        leftIcon={<FaUserShield />}
        link="https://cryptosx.freshdesk.com/en/support/tickets/new">
        Support Center
      </DropdownItem>
      <DropdownItem
        leftIcon={<FaSearch />}
        link="https://cryptosx.freshdesk.com/en/support/solutions">
        FAQs and Guides
      </DropdownItem>
      <DropdownItem
        leftIcon={<FaMoneyBill />}
        link="https://cryptosx.freshdesk.com/en/support/solutions/articles/44001340353-unified-fee-schedule">
        Fee Schedule
      </DropdownItem>
    </DropdownMb>
  );
};

export default NavbarOut;