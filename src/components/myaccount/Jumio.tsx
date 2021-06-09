import React from 'react';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';
import {
  toolbelt as T
} from '../../util/@jacob/core';
import {
  btoa
} from '../../util/ts-toolbet';
import {
  Cookies
} from '../../util/local-storage';
const apiTokena = process.env.REACT_APP_API_TOKEN;
const apiSecreta = process.env.REACT_APP_API_SECRET;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    bottomBtn: {
    position: 'absolute',
    bottom: '20px',
    width: '80%',
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
let hrefRedirect = null as string | null;
function CustomizedDialogs(props: WithStyles<typeof styles>) {
  const classes = props.classes;
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    console.log(apiTokena); 
    setOpen(true);
    setLoading(true);
    Promise.resolve({
      apiToken: apiTokena,
      apiSecret: apiSecreta,
      user: T.nullifyError(() => JSON.parse(window.localStorage.getItem('cryptosx-user') || '{}') as Cookies['cryptosx-user'])()
    })
      .then(_ => (console.log(JSON.stringify(_.user)), _))
      .then(_ => (
        _.user == null ?
          undefined as void : (
            fetch('https://cryptosx-initiate.herokuapp.com/?url=https://netverify.com/api/v4/initiate/', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Cryptosx test/1.0.1',
                'Authorization': `Basic ${btoa(`${_.apiToken}:${_.apiSecret}`)}`
              },
              body: JSON.stringify({
                'customerInternalReference': 'Cryptosx-DEX',
                'userReference': _.user['User']['UserId'],
                'successUrl': 'https://investorportalpreview.s3.amazonaws.com/Jumio/animation.gif',
                'errorUrl': 'https://cryptosx.io/tokenize.html'
              })
            })
              .then(res => res.json())
              .then(res => hrefRedirect = res['redirectUrl'] || null)
              .catch(alert)
              .finally(() => setLoading(false))
          )
      ))
  };
  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };
  const { t , i18n } = useTranslation();


  return (
    <React.Fragment>
      <Button className={classes.bottomBtn} variant="outlined" color="primary" onClick={handleClickOpen}>
        {t('Accreditation.StartVerification')}
      </Button><br></br><br></br>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Jumio ID Verification
        </DialogTitle>
        <DialogContent dividers>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <iframe src={hrefRedirect || 'https://www.google.com'}
            width="550px"
            height="550px"
            id="myId"
            className="myClassname"
            allowFullScreen
            allow="camera"/>
        )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
export default withStyles(styles)(CustomizedDialogs);