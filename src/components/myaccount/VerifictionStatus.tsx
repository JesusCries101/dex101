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
import {
  toolbelt as T,
  ramda as R,
  node as N
} from '../../util/@jacob/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import QueryVerificationLevel from '../../util/ws/QueryVerificationLevel';
import { Translation } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import Jumio from './Jumio';

const styles = createStyles({
  depositContext: {
    flex: 1,
  },
  underReview: {
    color: 'orange',
    borderColor: 'orange',
    position: 'relative',
    width: '80%',
  },
  bottomBtn: {
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
class VerificationStatus extends React.Component<Props> {
  render() {
    let { classes, verificationLevel } = this.props;
    return (
      <React.Fragment>
        <Container className={classes.container}>
          <Grid container spacing={2}>
            <Grid className={classes.center} item xs={12} md={12} lg={4}>
              <Translation>
                {
                  (t, { i18n }) => <Title><AccountCircleIcon style={{ fontSize: '40px', color: '#3f51b5', margin: '0 10 0 0'}}/>{t('ID Verification')}</Title>
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
                  (t, { i18n }) => <li>{t('MyAccount.VRList1')}</li>
                }
              </Translation>
              <Translation>
                {
                  (t, { i18n }) => <li>{t('MyAccount.VRList2')}</li>
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
                  (t, { i18n }) => <li>{t('MyAccount.VSList1')}</li>
                }
              </Translation>
              <Translation>
                {
                  (t, { i18n }) => <li>{t('MyAccount.VSList2')}</li>
                }
              </Translation>
            </Grid>
            <Grid className={classes.center} item xs={12} md={12} lg={2}>
              {
                  R.isNil(verificationLevel) ?
                  <CircularProgress size={24} /> : (
                    verificationLevel < 1 ? (<Jumio />
                      /*<Translation>{ (t, {i18n}) =>
                      <Jumio />
                      <Button variant="outlined" color="primary" className={classes.underReview}>
                        {t('MyAccount.UnderReview')}
                  </Button>}</Translation>*/
                    ) : (<Translation>{ (t, {i18n}) => 
                      <Button variant="outlined" color="primary" className={classes.approved}>
                        {t('MyAccount.Verified')}
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
export default withStyles(styles)(VerificationStatus);