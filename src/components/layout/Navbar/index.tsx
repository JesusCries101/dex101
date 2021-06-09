import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
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
  DropdownMenuIconRight,
  MetamaskDisplay,
  MetamaskBtn,
  MetamaskMsgRight,
  MetamaskMsgConnected,
  ConnectedDot
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
import { FaEdit } from 'react-icons/fa';
import { FaCoins } from 'react-icons/fa';
import { FaUserTie } from 'react-icons/fa';
import { useMetaMask } from 'metamask-react';
import {logout} from '../../../store/login/actions'

const Navbar = props => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [openMb, setOpenMb] = useState(false);

  const closeAllMenu = () => {
    setOpen(false);
    setOpen2(false);
    setOpen3(false);
    setOpenMb(false);
  };
// Connected account: chain {parseInt(chainId as string, 16)} 
  const MetamaskContainer = () =>{
    const { status, connect, account, chainId } = useMetaMask();
    useEffect(()=>{
        console.log("status", status)
    },[status])
    switch(status){
        case "connected":
            return (
              <MetamaskDisplay>
                <ConnectedDot /><MetamaskMsgConnected>{account}</MetamaskMsgConnected>
              </ MetamaskDisplay>
            )
        case "connecting":
            return (
              <MetamaskBtn>
                <MetamaskMsgRight>Connecting...</MetamaskMsgRight>
              </ MetamaskBtn>
            )
        case "initializing":
            return (
              <MetamaskBtn>
                <MetamaskMsgRight>Synchronisation with MetaMask ongoing...</MetamaskMsgRight>
              </ MetamaskBtn>
            )
        case "notConnected":
            return (
              <MetamaskBtn onClick={connect}>
                <MetamaskMsgRight>Connect to MetaMask</MetamaskMsgRight>
              </MetamaskBtn>
            )
        case "unavailable":
            return (
              <MetamaskBtn onClick={() => window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn')}>
                <MetamaskMsgRight>Metamask not installed</MetamaskMsgRight>
              </MetamaskBtn>
            ) 
        default:
            return (
              <MetamaskBtn>
                <MetamaskMsgRight>Can not detect metamask</MetamaskMsgRight>
              </MetamaskBtn>
            )
    }
}

  return (
    <React.Fragment>
      <Nav>
        <Image href="https://cryptosx.io/investorportal.html">
          <img src={Logo} style={{ width: '200px' }} alt="logo" />
        </Image>
        <IconButtonMb onClick={() => setOpenMb(!openMb)}>
          <Bars />
        </IconButtonMb>
        <NavMenu>
          <NavLink to="/digital-aseets" onClick={closeAllMenu}>
            Digital Assets
          </NavLink>
          <NavLink to="/portfolio" onClick={closeAllMenu}>
            Portfolio
          </NavLink>
          <NavLink to="/accreditation" onClick={closeAllMenu}>
            Accreditation
          </NavLink>
          <NavLink to="/erc20" onClick={closeAllMenu}>
            Tradeview
          </NavLink>
        </NavMenu>
        <NavBtn>
          <NavItem>
              <MetamaskContainer />
            <IconButton
              onClick={() => {
                if (openMb) {
                  setOpenMb(false);
                } else {
                  setOpen(!open);
                  setOpen3(false);
                  setOpen2(false);
                }
              }}>
              <App />
            </IconButton>
            <IconButton
              onClick={() => {
                if (openMb) {
                  setOpenMb(false);
                } else {
                  setOpen2(!open2);
                  setOpen3(false);
                  setOpen(false);
                }
              }}>
              <Help />
            </IconButton>
            <IconButton
              onClick={() => {
                if (openMb) {
                  setOpenMb(false);
                } else {
                  setOpen3(!open3);
                  setOpen(false);
                  setOpen2(false);
                }
              }}>
              <Caret />
            </IconButton>
            {open ? <DropdownMenu /> : ''}
            {open2 ? <DropdownMenu2 /> : ''}
            {open3 ? <DropdownMenu3 {...props} /> : ''}
          </NavItem>
          {/* <NavBtnLink to="/settings">Settings</NavBtnLink> */}
        </NavBtn>
        {openMb ? (
          <DropdownMenuMb
            closeMenu={() => {
              open && setOpen(false);
              open2 && setOpen2(false);
              open3 && setOpen3(false);
              setOpenMb(false);
            }}
          />
        ) : (
          ''
        )}
        
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
    <Dropdown>
      <DropdownItem leftIcon={<FaChartBar />} link="https://app.cryptosx.io">
        Crypto Exchange
      </DropdownItem>{' '}
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
    <Dropdown2>
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

interface DispatchProps {
  logout: () => any;
}

const mapDispatchToProps = (dispatch: any): DispatchProps => {
  return {
      logout: () => (
          dispatch(logout()),
          window.localStorage.removeItem('cryptosx-user'),
          window.location.href = '/#/login'
      )
  };
};

let DropdownMenu3 = (
  connect(
    null,
    mapDispatchToProps,
  )((p: any) => {
    const DropdownItem = props => {
      return (
        <DropdownMenuItem href={props.link} onClick={props.onClick}>
          <DropdownMenuIcon>{props.leftIcon}</DropdownMenuIcon>
          {props.children}
        </DropdownMenuItem>
      );
    };
    const DropdownItemSpan = props => {
      return (
        <DropdownMenuItem href={props.link} onClick={props.onClick}>
          <DropdownMenuIcon>{props.leftIcon}</DropdownMenuIcon>
          {props.children}
        </DropdownMenuItem>
      );
    };
    // DropdownMenuItemSpan
    return (
      <Dropdown3>
        {// show current account
        p.selectedAccount && (
          <Link to="/settings/verification" style={{ width: '100%' }}>
            <DropdownItem leftIcon={<FaUser />}>
              {p.selectedAccount.AccountName}
            </DropdownItem>
          </Link>
        )}
        {p.selectableAccounts &&
          p.selectableAccounts.map(a => {
            return (
              <DropdownItem
                onClick={() => {
                  p.selectAccount(a);
                }}
                key={a.AccountId}>
                Switch to {a.AccountName}
              </DropdownItem>
            );
          })}
        <DropdownItem
          leftIcon={<FaShareSquare />}
          onClick={async () => {
            p.logout();
          }}>
          Logout
        </DropdownItem>
      </Dropdown3>
    );
  })
);

const DropdownMenuMb = props => {
  const DropdownItem = props => {
    return (
      <DropdownMenuItem href={props.link} onClick={props.onClick}>
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
    <DropdownMb>
      <DropdownItemLink
        leftIcon={<FaCoins />}
        to="/digital-assets"
        closeMenu={props.closeMenu}>
        Digital Assets
      </DropdownItemLink>
      <DropdownItemLink
        leftIcon={<FaUserTie />}
        to="/accreditation"
        closeMenu={props.closeMenu}>
        Accreditation
      </DropdownItemLink>
      <DropdownItemLink
        leftIcon={<FaChartBar />}
        to="/erc20"
        closeMenu={props.closeMenu}>
        Tradeview
      </DropdownItemLink>
      <DropdownItem
        leftIcon={<FaShareSquare />}
        onClick={() => {
          props.logout();
        }}
        closeMenu={props.closeMenu}>
        Logout
      </DropdownItem>
      <h2
        style={{
          textAlign: 'center',
          padding: '10px 0',
          background: '#eeeeee',
          borderRadius: '5px'
        }}>
        Other Apps
      </h2>
      <DropdownItem leftIcon={<FaChartBar />}>Crypto Exchange</DropdownItem>
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
export default Navbar;