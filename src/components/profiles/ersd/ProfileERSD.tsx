import React from 'react';
import clsx from 'clsx';
import Navbar from '../../layout/Navbar'
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import FolderIcon from '@material-ui/icons/Folder';
import Avatar from '@material-ui/core/Avatar';
import GetAppIcon from '@material-ui/icons/GetApp';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Deposits from './Deposits';
import ProfileStats from './ProfileStats';
import ProfileDetails from './ProfileDetails';
import Trades from './Trades';
import image from '../../../assets/images/securitize-square.png';
import image2 from '../../../assets/images/SR_Securitize-ID.svg';
import image3 from '../../../assets/images/securitize-ready.png';
import image4 from '../../../assets/images/logo-securitize.png';
import { connect } from 'react-redux';
import Logo from '../../assets/logo/cryptosx-logo.png';
import { useTranslation } from 'react-i18next';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Termsheet from './Termsheet';
import Chart from './Chart';

import {
  Detypify
} from '../../../util/ts-toolbet'
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://cryptosx.io">
        Cryptosx
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const tileData = [
  {
    img: image4,
    title: 'Image',
    author: 'author',
  },
  {
    img: image2,
    title: 'Image2',
    author: 'author',
  },
  {
    img: image3,
    title: 'Image3',
    author: 'author',
  },
  {
    img: image,
    title: 'Image4',
    author: 'author',
  },
];

const useStyles = makeStyles((theme) => {
  let styles = {
    root: {
      display: 'flex',
    },
    button: {
      marginRight: '0.5rem',
      color: 'white',
    },
    menuButtonHidden: {
      display: 'none',
    },
    title: {
      flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: 240,
    },
    gridList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    logo: {
      width: '200px',
      padding: '0 0 0 20px',
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
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
    depositContext: {
      flex: 1,
    },
  };
  return styles as Detypify<typeof styles>;
});
interface DispatchProps {
  onLogout: () => any;
}
interface OwnProps {}
type Props = DispatchProps & OwnProps;
function ProfileHCS(props: Props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const { t, i18n } = useTranslation();

  function handleClick(language) {
  i18n.changeLanguage(language);
  }

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  }

  return (
    <React.Fragment>
      <Navbar />
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Grid List */}
            <Grid item xs={12} md={12} lg={12}>
                <GridList className={classes.gridList} cols={2.5}>
                {tileData.map((tile) => (
                  <GridListTile key={tile.img}>
                    <img src={tile.img} alt={tile.title} />
                    <GridListTileBar
                      title={tile.title}
                      classes={{
                        root: classes.titleBar,
                        title: classes.title,
                      }}
                      actionIcon={
                        <IconButton aria-label={`star ${tile.title}`}>
                          <StarBorderIcon className={classes.title} />
                        </IconButton>
                      }
                    />
                  </GridListTile>
                ))}
              </GridList>
            </Grid>
            {/* Profile Title */}
            <Grid item xs={12} md={8} lg={9}>
            <Typography component="p" variant="h4">
                Securitize Demo - ERSD
              </Typography>
              <br></br>
              <Divider />
              <br></br>
              <Typography color="textSecondary" className={classes.depositContext}>
              ERSD is Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Typography>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Deposits />
              </Paper>
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
            <Typography component="p" variant="h5">
                Tokenized Securities Industry in Europe
              </Typography>
              <br></br>
              <Divider variant="middle" />
              <br></br>
              <Typography color="textSecondary" className={classes.depositContext}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,              </Typography>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <ProfileStats />
            </Grid>
            {/* Investment Detail */}
            <Grid item xs={12} md={6} lg={6}>
            <Paper className={fixedHeightPaper}>
              <Chart />
            </Paper><br></br>
            <Typography component="p" variant="h5">
                Investment Detail
              </Typography><br></br>
              <Divider variant="middle" /><br></br>
              <Typography color="textSecondary" className={classes.depositContext}>
              The Fund is designed to achieve the following:
              <br></br>
              <ul>
                <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor</li>
                <li>ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.</li>
                <li>Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae</li>
                <li>Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue.</li>
                <li>sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar</li>
                <li>Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus.</li>
                <li>Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. </li>
                <li>Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat</li>
                <li>leo eget bibendum sodales, augue velit cursus nunc,</li>
              </ul><br></br>
              </Typography>
              <Typography component="p" variant="h5">
                Document Downloads
              </Typography><br></br>
              <Divider variant="middle" /><br></br>
            <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <GetAppIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    Audited Financial Statement
                    </ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <GetAppIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <GetAppIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                  Private Placement Memorandum
                    </ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <GetAppIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <GetAppIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                  Valuation Report
                    </ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <GetAppIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <GetAppIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                  CEZA DATO Approval Certification
                    </ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <GetAppIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <GetAppIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    Subscription Agreement
                    </ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <GetAppIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
            </List>
            </Grid>
            {/* Chart 
            <Grid item xs={12} md={12} lg={6}>
              <Paper className={fixedHeightPaper}>
                <Chart />
              </Paper>
            </Grid>*/}
            {/* Term sheet */}
            <Grid item xs={12} md={6} lg={6}>
            <Typography component="p" variant="h5">
                Term Sheet
              </Typography>
              <br></br>
              <Divider variant="middle" />
              <br></br>
                <Termsheet />
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Trades title={'Recent Trades'} />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
    </React.Fragment>
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
const DashboardContainer = connect(
  null,
  mapDispatchToProps,
)(ProfileHCS);
export default DashboardContainer;
