import React from 'react';
import {
  withStyles,
  WithStyles,
  createStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import Button from '@material-ui/core/Button';
import { Grid, Container } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import {
  client as wsClient
} from '../../util/ws';
import {
  toolbelt as T,
  ramda as R,
  node as N
} from '../../util/@jacob/core';
import {
  Cookies
} from '../../util/local-storage'
import CircularProgress from '@material-ui/core/CircularProgress';
import QueryVerificationLevel from '../../util/ws/QueryVerificationLevel';
import { Translation } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import Securitize from '../../assets/images/securitize-square.png';
import FS from '../../assets/images/FS.png';
import detectEthereumProvider from '../../util/EthereumProvider'
import * as securitizeApiProxy from '../../proxy/securitizeApiProxy'
import {MetamaskForm} from './MetamaskForm';

const styles = createStyles({
  depositContext: {
    flex: 1,
  },
  logo: {
    width: '60px',
    padding: '0px 20px 0px 0px',
  },
  underReview: {
    color: 'orange',
    borderColor: 'orange',
    position: 'relative',
    width: '80%',
  },
  approved: {
    color: '#3cb34f',
    borderColor: '#3cb34f',
    position: 'relative',
    width: '80%',
  },
  container: {
    textAlign: 'center',
  },
  listTitle: {
    marginTop: '1rem',
    marginBottom: '0.5rem',
    fontWeight: 700
  },
  mt40: {
    marginTop: '40px',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  }
});
type Props = WithStyles<typeof styles> & QueryVerificationLevel.ForwardedProps;
let SecuritizeRFE = (props: Props) => {
  let {classes, verificationLevel} = props;
  const [dsStatus, setDsStatus] = React.useState('fetching' as securitizeApiProxy.VerificationStatus);
  const [walletAddress, setWalletAddress] = React.useState(null as string | null);
  const [registration, setRegistration] = React.useState(null as securitizeApiProxy.Registration | null);

  React.useEffect(() => {
		detectEthereumProvider()
			.then(ethereum => (
        setWalletAddress(ethereum.selectedAddress),
				Promise.all([
          securitizeApiProxy.fetch(`/investor/${ethereum.selectedAddress}/`)
            .then<securitizeApiProxy.Resps['/investor/:walletAddress/']>(res => res.json())
            .then(resp => {
              if (securitizeApiProxy.isErrorResp(resp)) {
                throw resp.err;
              }
              return resp.res;
            })
            .then(({blockchainID}) => {
              if (blockchainID === '') {
                setDsStatus('pending');
              } else {
                setDsStatus('verified');
              }
            }),
          securitizeApiProxy.fetch(`/investor/detail/FST/${ethereum.selectedAddress}/`)
            .then<securitizeApiProxy.Resps['/investor/detail/:token/:walletAddress/']>(res => res.json())
            .then(resp => {
              if (securitizeApiProxy.isErrorResp(resp)) {
                throw resp.err;
              }
              return resp.res;
            })
            .then(setRegistration)
            .catch(() => {}),
        ])
			))
			.catch(console.log)
  }, []);
  
  return (
    <React.Fragment>
      <Container className={classes.container}>
        <Grid container spacing={2}>
          <Grid className={classes.center} item xs={12} md={12} lg={4}>
            <Translation>
              {
                (t, { i18n }) => <Title><img src={FS} alt="logo" className={classes.logo} />{t('First Shot Token')}</Title>
              }
            </Translation>
          </Grid>
          <Grid style={{textAlign: 'center'}} item xs={6} md={6} lg={3}>
            <Translation>
              {
                (t, {i18n}) => <Typography className={classes.listTitle}> {t('MyAccount.Requirements')}</Typography>
              }
              </Translation>
              <Translation>
              {
                (t, { i18n }) => <li>{t('MyAccount.DSList1')} <AccountCircleIcon /></li>
              }
            </Translation>
            <Translation>
              {
                (t, { i18n }) => <li>{t('MyAccount.DSList2')} <InsertDriveFileOutlinedIcon /></li>
              }
            </Translation>
            <Translation>
              {
                (t, { i18n }) => <li>{t('MyAccount.DRList1')}</li>
              }
            </Translation>
          </Grid>
          <Grid style={{textAlign: 'center'}} item xs={6} md={6} lg={3}>
            <Translation>
              {
                (t, {i18n}) => <Typography className={classes.listTitle}> {t('MyAccount.Benefits')}</Typography>
              }
              </Translation>
              <Translation>
              {
                (t, { i18n }) => <li>{t('MyAccount.DSList3')}</li>
              }
            </Translation>
          </Grid>
          <Grid className={classes.center} item xs={12} md={12} lg={2}>
      {
          dsStatus === 'fetching' ?
          <CircularProgress size={24} /> : 
          dsStatus === 'pending' ?
          <MetamaskForm walletAddress={walletAddress} status={dsStatus} registration={registration} /> : (
          <Translation>{ (t, {i18n}) => 
            <Button variant="outlined" color="primary" className={classes.approved}>
              {t('MyAccount.Verified')}
            </Button>}
          </Translation>
        )
        }
        </Grid>
      </Grid>
      </Container>
    </React.Fragment>
  );
}
export default withStyles(styles)(SecuritizeRFE);