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

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-right: 24px;
  justify-content: flex-end;

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
  transform: translateX(-60%);
  background-color: #fafafa;
  border: 1px solid #eeeeee;
  border-radius: 5px;
  padding: 1rem;
  overflow: hidden;
`;
export const Dropdown2 = styled.div`
  position: absolute;
  top: 80px;
  width: 300px;
  transform: translateX(-43%);
  background-color: #fafafa;
  border: 1px solid #eeeeee;
  border-radius: 5px;
  padding: 1rem;
  overflow: hidden;
`;
export const Dropdown3 = styled.div`
  position: absolute;
  top: 80px;
  width: 300px;
  transform: translateX(-28%);
  background-color: #fafafa;
  border: 1px solid #eeeeee;
  border-radius: 5px;
  padding: 1rem;
  overflow: hidden;
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
  color: #fafafa;
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
