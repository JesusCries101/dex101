import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Translation } from 'react-i18next';
import { useTranslation, withTranslation, WithTranslation } from 'react-i18next';

class MainListItems extends React.Component<WithTranslation> {
  render() {
    return (
  <div>
    <Link to="/dashboard">
    <ListItem button >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary={this.props.t('DigitalAssets.Title')} />
    </ListItem>
    </Link>
    <Link to="/erc20">
    <ListItem button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary={this.props.t('Exchange.Title')} />
    </ListItem>
    </ Link>
    <Link to="/myaccount">
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary={this.props.t('MyAccount.Title')} />
    </ListItem>
    </ Link>
    <Link to="/accreditation">
      <ListItem button>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary={this.props.t('Accreditation.Title')} />
      </ListItem>
    </ Link>
    <Link to="/dex-chart">
      <ListItem button>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary={this.props.t('Chart.Title')} />
      </ListItem>
    </ Link>
  </div>
    )
  };
}

class SecondaryListItems extends React.Component {
  render() {
    return (
      <div>
      <ListSubheader inset>中文菜单</ListSubheader>
      <Link to="/dashboard">
    <ListItem button > 
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="数字资产" />
    </ListItem>
    </Link>
    <Link to="/erc20">
    <ListItem button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="交易所" />
    </ListItem>
    </ Link>
      <Link to="/myaccount">
        <ListItem button>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="我的账户" />
        </ListItem>
        </ Link>
      <Link to="/accreditation">
      <ListItem button>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="数字资产审核" />
      </ListItem>
      </ Link>
    </div>
    )
  };
}
let MainListItemsContainer = withTranslation()(MainListItems);
export { MainListItemsContainer as MainListItems, SecondaryListItems };
