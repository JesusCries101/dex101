import React from 'react';
import Link from '@material-ui/core/Link';
import {
  withStyles,
  WithStyles,
  createStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Title from './Title';
import Button from '@material-ui/core/Button';
import { green, purple, } from '@material-ui/core/colors';
import { Grid, Container } from '@material-ui/core';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Translation } from 'react-i18next';
import { useTranslation } from 'react-i18next';

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

const styles = createStyles({
  depositContext: {
    flex: 1,
  },
  underReview: {
    color: 'orange',
    marginTop: '40px',
    borderColor: 'orange',
    position: 'absolute',
    bottom: '20px',
    width: '80%',
  },
  start: {
    position: 'relative',
    width: '80%',
  },
  approved: {
    color: '#3cb34f',
    borderColor: '#3cb34f',
    position: 'relative',
    width: '80%',
  },
  listTitle: {
    marginTop: '1rem',
    marginBottom: '0.5rem',
    fontWeight: 700
  },
  container: {
    textAlign: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  }
});
type Props = WithStyles<typeof styles> & QueryVerificationLevel.ForwardedProps;
class AccreditationStatus extends React.Component<Props, AccreditationStatus.State> {
  render() {
    let { classes, verificationLevel } = this.props;
    return (
      <React.Fragment>
        <Container className={classes.container}>
          <Grid container spacing={2}>
            <Grid className={classes.center} item xs={12} md={12} lg={4}>
              <Translation>
                {
                  (t, {i18n}) => <Title><InsertDriveFileOutlinedIcon style={{ fontSize: '40px', color: '#3f51b5', margin: '10 0 20 0' }} />
                  {t('MyAccount.ASTitle')}</Title>
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
                  (t, { i18n }) => <li>{t('MyAccount.ACList1')}</li>
                }
              </Translation>
              <Translation>
                {
                  (t, { i18n }) => <li>{t('MyAccount.ACList2')}</li>
                }
              </Translation>
              <Translation>
                {
                  (t, { i18n }) => <li>{t('MyAccount.ACList3')}</li>
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
                (t, {i18n}) => <li>{t('MyAccount.ASList1')}<strong><a href="https://investorportal.cryptosx.io" target="_blank">investorportal.cryptosx.io</a></strong></li>
                }
              </Translation>
              <Translation>
                {
                  (t, {i18n}) => <li>{t('MyAccount.ASList2')}</li>
                }
              </Translation>
            </Grid>
            <Grid className={classes.center} item xs={12} md={12} lg={2}>
        { R.isNil(verificationLevel) ? <CircularProgress size={24} /> : (
          verificationLevel < 11 ? ( <Translation>
            { (t, {i18n}) => 
            <Button href="javascript:void( window.open( 'https://form.jotform.com/201410455004437', 'blank', 'scrollbars=yes, toolbar=no, width=1000, height=800' ) ) " variant="outlined" color="primary" className={classes.start}>
              {t('MyAccount.Start')}
            </Button>
            }
            </Translation>
          ) : (<div></div>)
        )
        }
        {
            R.isNil(verificationLevel) ?
            <CircularProgress size={24} /> : (
              verificationLevel < 11 ? ( <Translation>
                { (t, {i18n}) => 
                <Button variant="outlined" color="primary" className={classes.underReview}>
                  {t('MyAccount.UnderReview')}
                  {verificationLevel}
                </Button>
                }
                </Translation>
              ) : (<Translation>{ (t, {i18n}) => 
                <Button variant="outlined" color="primary" className={classes.approved}>
                  {t('MyAccount.Accredited')}
              </Button>}</Translation>
              )
            )
          }
          </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace AccreditationStatus {
  export interface State {
    verificationLevel: T.Nullable<T.Number>;
  }
}
export default withStyles(styles)(AccreditationStatus);