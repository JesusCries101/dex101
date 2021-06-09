import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Logo from '../../assets/logo/cryptosx-logo.png';
import { MainListItems, SecondaryListItems } from './newlist';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { useTranslation } from 'react-i18next';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  logo: {
    width: '200px',
    padding: '10px 0 10px 20px',
  },
  whiteLabel: {
    color: 'black',
  },
  formControl: {
    marginLeft: '50px',
    marginTop: '10px',
    minWidth: 120,
  },
}));

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function TemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const { t, i18n } = useTranslation();

  const handleLangChange = (e) => {
    i18n.changeLanguage(e.target.value);
  }

  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
       <img src={Logo} alt="logo" className={classes.logo} />
          <IconButton onClick={toggleDrawer(anchor, false)}>
            <ChevronLeftIcon />
          </IconButton>
        <Divider />
        <List>
          <MainListItems />
        </List>
        <Divider />
        {/*
        <List>
          <SecondaryListItems />
        </List>
        */}
        <Divider />
        <List>
        <FormControl className={classes.formControl}>
            <InputLabel className={classes.whiteLabel} id="demo-simple-select-label">Language 🌏</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="language-select"
              defaultValue=""              
              className={classes.whiteLabel}
              onChange={handleLangChange}
            >
              <MenuItem value="">Language:</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="zh">中文</MenuItem>
            </Select>
          </FormControl>
        </List>
    </div>
  );

  const left = 'left';

  return (
    <div>
        <React.Fragment key={left}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon onClick={toggleDrawer(left, true)} />
          </IconButton>
          <Drawer anchor={left} open={state[left]} onClose={toggleDrawer(left, false)}>
            {list(left)}
          </Drawer>
        </React.Fragment>
    </div>
  );
}