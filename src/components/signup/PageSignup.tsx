import * as React from 'react';
import {
  Dispatch
} from 'redux'
import {
  ThunkDispatch
} from 'redux-thunk'
import { 
  connect
} from 'react-redux'
import NavbarOut from '../layout/NavbarOut'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
//import { Action } from '../../redux/action';
import { RootAction as Action } from '../../store/reducers';
import { StoreState as State } from '../../util/types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Logo from './favicon-256.png';
import MailIcon from '@material-ui/icons/Mail';
import {
  Detypify
} from '../../util/ts-toolbet'
import wsClient from '../../util/ws';
import {
  toolbelt as T,
  ramda as R
} from '../../util/@jacob/core';
let Number = (
  <T extends T.Number>(val: T): T => val
);
let Tuple = (
  <TTuple extends any[]>(...vals: TTuple): TTuple => vals
);
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

const useStyles = makeStyles((theme) => {
  let styles = {
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    img: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      }
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  };
  return styles as Detypify<typeof styles>;
});

interface OwnProps {
  setDarkTheme: () => {};
}
interface StateProps {
}
interface DispatchProps {
}
type Props = OwnProps & DispatchProps & StateProps;
function PageSignin(props: Props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  let [inputFirstName, setInputFirstName] = React.useState<T.Nullable<T.String>>(null);
  let [inputLastName, setInputLastName] = React.useState<T.Nullable<T.String>>(null);
  let [inputUsername, setInputUsername] = React.useState<T.Nullable<T.String>>(null);
  let [inputEmail, setInputEmail] = React.useState<T.Nullable<T.String>>(null);
  let [inputPassword, setInputPassword] = React.useState<T.Nullable<T.String>>(null);
  let [inputPassword0, setInputPassword0] = React.useState<T.Nullable<T.String>>(null);
  let [inputPhone, setInputPhone] = React.useState<T.Nullable<T.String>>(null);
  let [inputCheckbox, setInputCheckbox] = React.useState<T.Nullable<T.Boolean>>(null);
  let f = Tuple(
    React.useState<-1 | 0 | 1>(-1),
    React.useState<-1 | 0 | 1>(-1),
    React.useState<-1 | 0 | 1>(-1),
    React.useState<-1 | 0 | 1>(-1),
    React.useState<-1 | 0 | 1>(-1),
    React.useState<-1 | 0 | 1>(-1),
    React.useState<-1 | 0 | 1>(-1)
  );
  let indexByInputName = {
    'firstName': Number(0),
    'lastName': Number(1),
    'Username': Number(2),
    'email': Number(3),
    'password': Number(4),
    'password0': Number(5),
    'phone': Number(6),
    'checkbox': Number(7)
  };
  let arrayThunkVerifyInput = Tuple(
    () => (
      inputFirstName != null && inputFirstName.length > 0
    ),
    () => (
      inputLastName != null && inputLastName.length > 0
    ),
    () => (
      inputUsername != null && inputUsername.length > 3
    ),
    () => (
      inputEmail != null && /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(inputEmail)
    ),
    () => (
      inputPassword != null && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}$/.test(inputPassword)
    ),
    () => (
      inputPassword0 != null && inputPassword0 === inputPassword
    ),
    () => (
      inputPhone != null && /^(?=.*\d)[\d]{1,}$/.test(inputPhone)
    ),
    () => (
      inputCheckbox != null && inputCheckbox
    )
  );

  const handleClickOpen = () => {
    //setOpen(true);
    if (
      inputEmail &&
      inputUsername &&
      inputFirstName &&
      inputLastName &&
      inputPassword &&
      inputPhone
    ) {
      wsClient.dispatch(wsClient.makeAction('RegisterNewUser', {
        'UserInfo': {
          'Email': inputEmail,
          'UserName': inputUsername,
          'passwordHash': inputPassword
        },
        'UserConfig': [{
          'Name': 'fullName',
          'Value': `${inputFirstName}${inputLastName}`
        }, {
          'Name': 'phoneNumber',
          'Value': inputPhone
        }],
        'OperatorId': 1
      }))
        .then(res => (
          // alert(JSON.stringify(res.payload, null, 2)),
          res.payload && !res.payload.error ? (
            setOpen(true)
            // alert(`you have been assigned userid ${res.payload['UserId']}`)
          ) : (
            res.payload && alert(res.payload.errormsg)
          )
        ))
        // .then(() => window.location.reload())
    }
  };

  const handleClose = () => {
    setOpen(false);
    window.location.href = '/#/login';
  };
  props.setDarkTheme();
  return (
    <React.Fragment>
      <NavbarOut />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h4">
            Sign up
          </Typography>
          <Typography component="h1" variant="h6">
          Decentralized STO Exchange
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  error={f[0][0] != -1 && !arrayThunkVerifyInput[indexByInputName['firstName']]()}
                  onClick={() => (
                    f[0][1](f[0][0] == -1 ? 0 : (1 - f[0][0]) as typeof f[0][0])
                  )}
                  onChange={event => (
                    setInputFirstName(event.target.value)
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  error={f[1][0] != -1 && !arrayThunkVerifyInput[indexByInputName['lastName']]()}
                  onClick={() => (
                    f[1][1](f[1][0] == -1 ? 0 : (1 - f[1][0]) as typeof f[1][0])
                  )}
                  onChange={event => (
                    setInputLastName(event.target.value)
                  )}
                />
              </Grid>
            </Grid>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username"
              name="email"
              autoComplete="email"
              autoFocus
              error={f[2][0] != -1 && !arrayThunkVerifyInput[indexByInputName['Username']]()}
              onClick={() => (
                f[2][1](f[2][0] == -1 ? 0 : (1 - f[2][0]) as typeof f[2][0])
              )}
              onChange={event => (
                setInputUsername(event.target.value)
              )}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Valid Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={f[3][0] != -1 && !arrayThunkVerifyInput[indexByInputName['email']]()}
              onClick={() => (
                f[3][1](f[3][0] == -1 ? 0 : (1 - f[3][0]) as typeof f[3][0])
              )}
              onChange={event => (
                setInputEmail(event.target.value)
              )}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Valid Phone Number"
              name="phone"
              autoComplete="phone"
              autoFocus
              error={f[4][0] != -1 && !arrayThunkVerifyInput[indexByInputName['phone']]()}
              onClick={() => (
                f[4][1](f[4][0] == -1 ? 0 : (1 - f[4][0]) as typeof f[4][0])
              )}
              onChange={event => (
                setInputPhone(event.target.value)
              )}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              helperText="Must contain at least 8 characters, 1 number, 1 capital letter"
              autoComplete="current-password"
              error={f[5][0] != -1 && !arrayThunkVerifyInput[indexByInputName['password']]()}
              onClick={() => (
                f[5][1](f[5][0] == -1 ? 0 : (1 - f[5][0]) as typeof f[5][0])
              )}
              onChange={event => (
                setInputPassword(event.target.value)
              )}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Confirm Password"
              type="password"
              id="conf-password"
              autoComplete="current-password"
              error={f[6][0] != -1 && !arrayThunkVerifyInput[indexByInputName['password0']]()}
              onClick={() => (
                f[6][1](f[6][0] == -1 ? 0 : (1 - f[6][0]) as typeof f[6][0])
              )}
              onChange={event => (
                setInputPassword0(event.target.value)
              )}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="You accept our Terms and Conditions and Privacy Policy"
              onChange={(event, checked) => (
                setInputCheckbox(checked)
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={(event) => (
                event.preventDefault(),
                handleClickOpen()
              )}
              children={'Sign Up'}
              disabled={!arrayThunkVerifyInput.every(thunk => thunk())}
            />
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Check your Email for Activation Link  "}<MailIcon fontSize="large" /></DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  If you did not receive an email from us, check your "Spam" folder before contacting us at support@cryptosx.io
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary" autoFocus>
                  Login
                </Button>
              </DialogActions>
            </Dialog>

            <Grid container>
              <Grid item xs>
                <Link href="/#/login" variant="body2">
                  {"Terms and Confitions"}
                </Link><br></br>
                <Link href="/#/login" variant="body2">
                  {"Privacy Policy"}
                </Link>
              </Grid>
              <Grid item>
                <Link href="/#/login" variant="body2">
                  {"Already have an account? Sign in"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </React.Fragment>
  );
}
let mapDispatch: (dispatch: ThunkDispatch<State, undefined, Action>) => DispatchProps = (dispatch) => ({
});
let PageSigninContainer = (
  R.pipe(
    connect(null, mapDispatch)
  )(PageSignin)
);
export default PageSigninContainer
export {
  PageSignin,
  PageSigninContainer
}