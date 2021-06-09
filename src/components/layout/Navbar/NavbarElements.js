import styled from 'styled-components';
import { NavLink as Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { FaCaretDown } from 'react-icons/fa';
import { FaQuestionCircle } from 'react-icons/fa';
import { FaTh } from 'react-icons/fa';

export const Nav = styled.nav`
  background: #fafafa;
  height: 100px;
  display: flex;
  justify-content: space-between;
  padding: 25px calc((100vw - 2000px) / 2);
  z-index: 10;
  border-bottom: 2px solid #eeeeee;

  justify-content: flex-start;
`;

export const Image = styled.a`
  display: flex;
  align-items: center;
  margin-left: 24px;
`;

export const NavLink = styled(Link)`
  color: #000;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 2rem;
  height: 100%;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  text-decoration: none !important;
  flex-shrink: 0;

  &.active {
    color: #4283fc;
    transition: all 0.2s ease-in-out;
  }

  &:hover {
    color: #4283fc;
    transition: all 0.2s ease-in-out;
  }
`;

export const IconButtonMb = styled.a`
  display: none;

  &:hover {
    transition: all 0.3s ease-in-out;
    background: #898989;
  }
  @media screen and (max-width: 768px) {
    display: flex;
    position: absolute;
    top: 25px;
    right: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    padding: 5px;
    margin: 5px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    background: #454545;
    transition: filter 300ms;
    transition: all 0.3s ease-in-out;
    color: #fff;
  }
`;

export const Bars = styled(FaBars)`
  font-size: 20px;
  color: #fff;
`;

export const Caret = styled(FaCaretDown)`
  font-size: 16px;
  color: #fafafa;
`;

export const Help = styled(FaQuestionCircle)`
  font-size: 16px;
  color: #fafafa;
`;

export const App = styled(FaTh)`
  font-size: 16px;
  color: #fafafa;
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: -24px;

  width: 100vw;
  white-space: nowrap;
  
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-right: 24px;
  
  justify-content: flex-end;
  width: 100vw;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtnLink = styled(Link)`
  font-size: 16px;
  letter-spacing: 0.5px;
  border-radius: 6px;
  font-weight: 600;
  background: #256ce1;
  padding: 10px 20px;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  -webkit-transition: all 0.3s;
  text-decoration: none;
  outline: none;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #007bff;
    color: #010606;
  }
`;

export const NavBtnLinkPrimary = styled(Link)`
  font-size: 16px;
  letter-spacing: 0.5px;
  border-radius: 6px;
  font-weight: 600;
  background: #256ce1;
  padding: 10px 20px;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  -webkit-transition: all 0.3s;
  text-decoration: none;
  outline: none;
  border: 1px solid #4283fc;
  color: #4283fc;
  background-color: transparent;

  margin-right: 10px;

  &:hover {
    background-color: #4283fc;
    transition: all 0.2s ease-in-out;
    background: #4283fc;
    color: #fff;
  }
`;

export const NavItem = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconButton = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 5px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #454545;
  transition: filter 300ms;
  transition: all 0.3s ease-in-out;

  &:hover {
    transition: all 0.3s ease-in-out;
    background: #898989;
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 80px;
  width: 300px;
  transform: translateX(-28%);
  background-color: #fafafa;
  border: 1px solid #eeeeee;
  border-radius: 5px;
  padding: 1rem;
  overflow: hidden;

  z-index: 100;
`;
export const Dropdown2 = styled.div`
  position: absolute;
  top: 80px;
  width: 300px;
  transform: translateX(-15%);
  background-color: #fafafa;
  border: 1px solid #eeeeee;
  border-radius: 5px;
  padding: 1rem;
  overflow: hidden;

  z-index: 100;
`;
export const Dropdown3 = styled.div`
  position: absolute;
  top: 80px;
  width: 300px;
  transform: translateX(-0%);
  background-color: #fafafa;
  border: 1px solid #eeeeee;
  border-radius: 5px;
  padding: 1rem;
  overflow: hidden;

  z-index: 100;
`;

export const DropdownMb = styled.div`
  position: absolute;
  top: 80px;
  right: 5px;
  width: 90%;
  height: 400px;
  background-color: #fafafa;
  border: 1px solid #eeeeee;
  border-radius: 5px;
  padding: 1.5rem;
  overflow: scroll;
  z-index: 100;
`;

export const DropdownMenuItem = styled.a`
  height: 50px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  transition: background 0.3s;
  padding: 0.5rem;
  color: #282828;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none !important;

  &:hover {
    background: #4283fc;
    color: #454545;
  }
`;

export const DropdownMenuItemLink = styled(Link)`
  height: 50px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  transition: background 0.3s;
  padding: 0.5rem;
  color: #282828;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none !important;

  &:hover {
    background: #898989;
  }
`;

export const DropdownMenuIcon = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 5px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eeeeee;
  transition: filter 300ms;
  transition: all 0.3s ease-in-out;
  font-size: 16px;
  margin-right: auto;
`;

export const DropdownMenuIconRight = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 5px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 300ms;
  transition: all 0.3s ease-in-out;
  font-size: 16px;
  margin-left: auto;
`;

export const MetamaskDisplay = styled.div`
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #fff;
  border-radius: 4px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding: 10px 15px;
  width: 200px;
  justify-content: space-between;

  margin-right: 5px;
`

export const MetamaskBtn = styled.button`
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #FAF4EF;
  border-radius: 4px;
  border: 1px solid #F39E4B;
  color: #F68C24;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 16px;
  line-height: 1.2;
  padding: 10px 15px;
  width: 200px;
  overflow: hidden;
  justify-content: space-between;

  margin-right: 5px;
`

export const MetamaskMsgRight = styled.span`
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const MetamaskMsgConnected = styled.span`
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  color: #000000;
  letter-spacing: 0.7px;
  font-size: 16px;
  line-height: 1.2;
  font-feature-settings: 'calt' 0;
  font-weight: 500;
`

export const ConnectedDot = styled.div`
  margin-right: 10px;
  background-color: #55BC65;
  border-radius: 50%;
  height: 10px;
  width: 10px;
`
