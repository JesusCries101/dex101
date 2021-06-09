import React, {useState} from 'react';
import clsx from 'clsx';
import Title from './Title';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
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
import ProfileStats from './ProfileStats';
import image from '../../../assets/images/FirstShotCenter1.jpg';
import image2 from '../../../assets/images/fs-mall.jpg';
import image3 from '../../../assets/images/FirstShotCenter3.jpg';
import image4 from '../../../assets/images/image4.jpg';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Termsheet from './Termsheet';
import {
  Detypify
} from '../../../util/ts-toolbet'
import { CoinSymbol } from '../../stoOrder/erc20Token';
import { MarketBuySellModal } from '../../stoOrder/MarketBuySellModal';
import { LimitBuySellModal } from '../../stoOrder/LimitBuySellModal';
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
    img: image,
    author: 'author',
  },
  {
    img: image2,
    author: 'author',
  },
  {
    img: image3,
    author: 'author',
  }
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
      height: '100%',
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

  const [showMarketBuySellModal, setShowMarketBuySellModal ] = useState(false);

  const openMarketBuySellModal = () => {
    setShowMarketBuySellModal(prev => !prev);
  }

  const [showLimitBuySellModal, setShowLimitBuySellModal ] = useState(false);
  const openLimitBuySellModal = () => {
    setShowLimitBuySellModal(prev => !prev);
  }

  const classes = useStyles();
  // const [open, setOpen] = React.useState(true);

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
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <MarketBuySellModal 
          showModal={showMarketBuySellModal} 
          setShowModal={setShowMarketBuySellModal}
          baseAssetSymbol = {CoinSymbol.FST}
          quoteAssetSymbol = {CoinSymbol.USDT}
        />
        <LimitBuySellModal 
          showModal={showLimitBuySellModal} 
          setShowModal={setShowLimitBuySellModal}
          baseAssetSymbol = {CoinSymbol.FST}
          quoteAssetSymbol = {CoinSymbol.USDT}
        />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Grid List */}
            <Grid item xs={12} md={12} lg={12}>
                <GridList className={classes.gridList} cols={2.5}>
                {tileData.map((tile) => (
                  <GridListTile key={tile.img}>
                    <img src={tile.img} />
                  </GridListTile>
                ))}
              </GridList>
            </Grid>
            {/* Profile Title */}
            <Grid item xs={12} md={8} lg={9}>
            <Typography component="p" variant="h4">
                FirstShot Centers, LLC
              </Typography>
              <br></br>
              <Divider />
              <br></br>
              <Typography color="textSecondary" className={classes.depositContext}>
              FirstShot Centers, LLC (FirstShot) initiated a specialty use concept in 2018 to acquire and repurpose vacant shopping malls and big box stores throughout the United States.
              <br></br>
              <br></br>
              Online shopping is a multi-billion dollar industry resulting in change in American retail. Empty shopping malls, big box stores and superstores are scattered across the American landscape. Prices are a fraction of replacement costs. Nationally more than a billion square feet of retail space sits empty, the equivalent of more than 14,000 shopping malls. Stores can be repurposed for a specific targeted industry. Each center can house a variety of national tenants that have been identified.
              </Typography>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
              <Title>Total Capital Raise</Title>
                <Typography component= "p" variant="h4">
                  $100,000,000 
                </Typography>
                <Divider variant="middle" />
                <Typography component="p" variant="h6">
                  1 FST = 1 USDT
                </Typography>
                {/*
                <Typography color="textSecondary" className={classes.depositContext}>
                  Min. Investment $50,000 USD
                </Typography>
                */}
                <div style={{marginTop: '50px'}}>
                  <Button variant="outlined" color="primary" style={{marginRight: '5px'}} onClick={openMarketBuySellModal}>
                    Buy Now
                  </Button>
                  <Button variant="outlined" color="primary" onClick={openLimitBuySellModal}>
                    Limit Orders
                  </Button>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
            <Typography component="p" variant="h5">
                About FirstShot's Token Offering
              </Typography>
              <br></br>
              <Divider variant="middle" />
              <br></br>
              <Typography color="textSecondary" className={classes.depositContext}>
              The concept is to have shopping center properties that can be themed destination sites where goods and services are not generally available on the internet or in conventional malls.
              <br></br>
              <br></br>
              FirstShot has created a Digital Asset Division platform and compliance solution for the financing of acquisitions and repurposing of empty and undervalued big box retail properties, located in the United States.
              <br></br>
              <br></br>
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <ProfileStats />
            </Grid>
            {/* Investment Detail */}
            <Grid item xs={12} md={6} lg={6}>
            <Typography component="p" variant="h5">
                Investment Detail
              </Typography><br></br>
              <Divider variant="middle" /><br></br>
              <Typography color="textSecondary" className={classes.depositContext}>
                The offering documentation is for $100 million USD. Additional tranches are being prepared for a total issuance of 400 million FirstShot tokens at $1 USD per token for a total of $400 million USD. Tokens are currently trading on Cryptosx and are intended to trade on at least one other digital asset exchange in the coming year.
              {/* <ul>
                <li>Exposure to Fine Scottish Single Cask Whisky as an asset class</li>
                <li>Lower barriers to entry through “Fractionalized” ownership (vs. whole barrels)</li>
                <li>Diversification by investing in multi-barrel portfolio (vs. single barrels)</li>
                <li>Liquidity via secondary market trading</li>
                <li>Stable funding source for long term “buy and hold” strategy via closed-end
                structure</li>
                <li>Expertise of the region’s leading independent bottler (IB), Howard Cai.</li>
                <li>Maximize ultimate selling price of assets through use of Howard Cai® Selected brand and existing distribution network of high-end restaurants, casino hotels & duty free shops such as The Whisky Dungeon by Howard Cai®</li>
                <li>Enhanced security and transparency via Fintech atop traditional, proven
                Cayman SPC structure.</li>
                <li>Best-in-class compliance and integrity enhanced by best-in-class advisors</li>
              </ul>*/}
              <br></br>
              <br></br>
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
            {/* Recent Orders 
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Trades title={'Recent Trades'} />
              </Paper>
            </Grid>
            */}
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
