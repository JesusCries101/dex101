import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import TemporaryDrawer from './Drawer';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Logo from '../../assets/logo/cryptosx-logo.png';

import {
    Detypify
  } from '../../util/ts-toolbet'

const drawerWidth = 0;
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  logoTop: {
    width: '200px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  whiteLabel: {
    color: 'white',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

interface DispatchProps {
    onLogout: () => any;
  }
interface OwnProps {
  Component?: React.ComponentType;
}

type Props = DispatchProps & OwnProps;

function Topnav(props: Props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMyAccount = () => {
    window.location.href = '/#/myaccount';
  };

  const { t, i18n } = useTranslation();

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };
  const {Component} = props;
  return (
    <div className={classes.root}>
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar>
          
          <TemporaryDrawer />{/*
          <img src={Logo} alt="logo" className={classes.logoTop} />*/}
          {Component ? <Component /> : null}
          <Typography variant="h5" className={classes.title}>
            Cryptosx DX-Demo
          </Typography>
          {(
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleMyAccount}>My Account</MenuItem>
                <MenuItem onClick={props.onLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onLogout: () => (
            dispatch({
                type: 'login',
                payload: {
                    authorized: false
                }
            }),
            window.localStorage.removeItem('cryptosx-user'),
            window.location.href = '/#/login'
        )
    };
  };
  const TopnavContainer = connect(
    null,
    mapDispatchToProps,
  )(Topnav);
  export default TopnavContainer;