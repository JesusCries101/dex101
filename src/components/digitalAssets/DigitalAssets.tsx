import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import {useHistory} from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {getWeb3Wrapper} from '../../services/web3_wrapper';
import fetch from 'cross-fetch';
// @ts-ignore
import OfferCard from './Card';

import {
  Detypify
} from '../../util/ts-toolbet'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;
const useStyles = makeStyles((theme) => {
  let styles = {
    root: {
      display: 'flex',
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    button: {
      marginRight: '0.5rem',
      color: 'white',
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
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
    logo: {
      width: '200px',
      padding: '0 0 0 20px',
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
  };
  return styles as Detypify<typeof styles>;
});
interface DispatchProps {
  onLogout: () => any;
}
interface OwnProps {}
type Props = DispatchProps & OwnProps & {
  ThemeToggle: React.ComponentType;
};
const DigitalAssets = (props: Props) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  function handleClick(language) {
  i18n.changeLanguage(language);
  }

  const history = useHistory();

  getWeb3Wrapper()
    .then(web3 => (
      fetch(`https://kovan.api.0x.org/swap/v0/quote?${'sellToken=ETH&buyToken=DAI&buyAmount=1000000000000000000'}`)
        .then(res => res.json())
        /*
        .then(payload => (
          window.web3.eth.sendTransaction(payload, () => {})
        ))
        */
       /*
        .then(payload => web3.sendTransactionAsync({
          from: '0x0490cb080aFbC798C0882B65e3cAF02C73f82B26',
          to: payload['to'],
          value: payload['value'],
          gas: payload['gas'],
          gasPrice: payload['gasPrice'],
          data: payload
        }))
        */
        .then(e => console.log(JSON.stringify(e, null, 2)))
    ))
  return (
    <React.Fragment>
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
        <Typography style={{textAlign: 'center'}} variant="h4">
          Our Selection of Digital Asset Token Offerings
          </Typography>
          <div className={classes.appBarSpacer} />
          <Grid container spacing={10}>
          <Grid item xs={12} md={6} lg={4}>
            <OfferCard name="FirstShot Centers" symbol="FS" app="Cryptosx DEX" amount="$100M USD" price="$1.00 USDT"/>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <OfferCard name="HCS Whisky Fund" symbol="HCS" app="STO Exchange" amount="$25M USD" price="$1.00 USDT"/>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <OfferCard name="Cyber Credit Token" symbol="CCT" app="STO Exchange" amount="$5M USD" price="$5.25 USDT"/>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <OfferCard name="AGARWOOD" symbol="AGWD" app="STO Exchange" amount="$3M USD" price="$0.21 USDT"/>
          </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
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
)(DigitalAssets);
export default DashboardContainer;
