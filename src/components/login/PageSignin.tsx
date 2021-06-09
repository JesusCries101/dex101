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
//import { Action } from '../../redux/action'
import { RootAction as Action } from '../../store/reducers'
import { StoreState as State } from '../../util/types'
import Logo from './favicon-256.png'
import {
  clientCustomer as wsClient
} from '../../util/ws';
import {
  Detypify,
  SetComplement
} from '../../util/ts-toolbet'
import {
  toolbelt as T,
  ramda as R
} from '../../util/@jacob/core';
import {
  Cookies
} from '../../util/local-storage';
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
    img: {display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
    }},
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
  onSubmit: (payload: {
    email: string;
    password: string;
  }) => (
    verify: (credentials: {
      email: string;
      password: string;
    }) => Promise<boolean>
  ) => void;
}
type Props = OwnProps & DispatchProps & StateProps;
function PageSignin(props: Props) {
  let { onSubmit } = props;
  let nodeInputEmail: HTMLInputElement;
  let nodeInputPassword: HTMLInputElement;
  const classes = useStyles();
  props.setDarkTheme();
  return (
    <React.Fragment>
      <NavbarOut />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h4">
            Sign in
          </Typography>
          <Typography component="h1" variant="h6">
            Decentralized STO Exchange
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Cryptosx Username"
              name="email"
              autoComplete="email"
              autoFocus
              inputRef={node => nodeInputEmail = node}
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
              autoComplete="current-password"
              inputRef={node => nodeInputPassword = node}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={(event) => (
                event.preventDefault(),
                onSubmit({
                  email: nodeInputEmail.value,
                  password: nodeInputPassword.value
                })(({ email, password }) => (
                  wsClient != null ? (
                    wsClient.dispatch(wsClient.makeAction('AuthenticateUser', {
                      'UserName': email,
                      'Password': password
                    }))
                      .then(({ payload, type }) => (
                        R.isNil(payload) ?
                        false : (
                          payload.error ?
                          false : (
                            payload.Authenticated && (
                              window.localStorage.setItem('cryptosx-user', JSON.stringify({
                                ...payload,
                                'Password': password
                              } as Cookies['cryptosx-user']))
                            ),
                            payload.Authenticated
                          )
                        )
                      ))
                  ) : (
                    Promise.resolve(false)
                  )
                ))
              )}
            >
              Sign In
              </Button>
            <Grid container>
              <Grid item xs>
                <Link href="https://app.cryptosx.io/problem-logging-in" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/#/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
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
  onSubmit: payload => verify => dispatch((dispatch, getState) => (
    verify(payload)
      .then(verified => verified && (
        dispatch({
          type: 'login',
          payload: {
            ...payload,
            authorized: true
          }
        }),
        window.location.href = '/#/dashboard',
        true
      ))
      .then(verified => (
        verified ? (
          undefined as void
        ) : (
          alert('login credential invalid')
        )
      ))
  ))
});
let PageSigninContainer = connect(null, mapDispatch)(PageSignin);
export default PageSigninContainer
export {
  PageSignin,
  PageSigninContainer
}