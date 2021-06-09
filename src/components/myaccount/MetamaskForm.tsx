import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import MetaMask from '../../assets/images/metamaskchrome.png';
import MetaMaskNav from '../../assets/images/metamasknav.png';
import MetaMaskLogin from '../../assets/images/metamasklogin.png';
import { makeStyles } from '@material-ui/core/styles';
import LinearBuffer from './LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import Securitize from '../../assets/images/securitize-square.png';
import * as ethersUtils from '@0x/utils';
import * as securitizeApiProxy from '../../proxy/securitizeApiProxy'
import {
  Cookies
} from '../../util/local-storage';
import {
  alphapointDispatch,
  parseKeyValuePairs,
} from '../../util/alphapointWsApi';
import { setTokenBalances } from '../../store/actions';

interface RegistrationPayload {
  firstName: string;
  lastName: string;
  birthdate: string;
  countryCode: string;
  documentNumber: string;
  documentType: string
}

let withCookie = (
  <TProps extends WithCookie.Props>(Component: React.ComponentType<TProps>) => (
    class WithCookie extends React.Component<WithCookie.Props.Trim<TProps>> {
      render() {
        return ( 
          <Component 
            {...this.props as unknown as TProps}
            getCookie={() => (
              Promise.resolve()
                .then(() => JSON.parse(window.localStorage.getItem('cryptosx-user') || '{}') as Cookies['cryptosx-user'])
            )}
          />
        );
      }
    } as unknown as React.ComponentType<WithCookie.Props.Trim<TProps>>
  )
);
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace WithCookie {
  export interface Props {
    getCookie: () => Promise<Cookies['cryptosx-user']>;
  }
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Props {
    export type Trim<TProps> = TProps extends ((infer UProps) & Props) ? (
      unknown extends UProps ? {} : UProps
    ) : never;
  }
}

type User = Cookies['cryptosx-user']['User'];

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
  logo: {
    display: 'block',
    width: '20px',
  },
  underReview: {
    color: 'orange',
    marginTop: '40px',
    borderColor: 'orange',
    display: 'relative',
  },
  approved: {
    color: '#3cb34f',
    marginTop: '40px',
    borderColor: '#3cb34f',
    display: 'relative',
  },
  container: {
    textAlign: 'center',
  },
  listTitle: {
    marginTop: '1rem',
  },
  start: {
    position: 'relative',
    width: '80%',
  }
});

interface OwnProps {
  walletAddress: string | null;
  status: securitizeApiProxy.VerificationStatus;
  registration: securitizeApiProxy.Registration | null;
}

type Props = OwnProps & WithCookie.Props;

let MetamaskForm: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [user, setUser] = React.useState(null as User | null);
  const [regPayload, setRegPayload] = React.useState(null as RegistrationPayload | null);
  const [isSuccessful, setIsSuccessful] = React.useState(false);
  const [isLinearBufferActive, activateLinearBuffer] = React.useState(true);

  React.useEffect(() => {
    props.getCookie() 
      .then(cookie => {
        if (cookie.User) {
          setUser(cookie.User);
        }
      })
      .catch(console.log);
  }, []);

  React.useEffect(() => {
    if (user) {
      ((user: any) => {
        alphapointDispatch('GetUserConfig', {
          "UserId": user.UserId,
          "UserName": user.UserName,
        })
          .then(parseKeyValuePairs('idFirstName', 'idLastName', 'idDob', 'idCountry', 'idNumber', 'idType'))
          .then(pairs => {
            if (pairs.idCountry && pairs.idDob && pairs.idFirstName && pairs.idLastName && pairs.idNumber && pairs.idType) {
              setRegPayload({
                countryCode: pairs.idCountry,
                birthdate: pairs.idDob,
                firstName: pairs.idFirstName,
                lastName: pairs.idLastName,
                documentNumber: pairs.idNumber,
                documentType: pairs.idType,
              });
            }
          })
          .catch(console.log);
      })(user);
    }
  }, [user]);

  let registerInvestor = () => (
    Promise.resolve()
      .then(() => (
        !user || !regPayload ?
        Promise.reject('registerInvestor payload invalid') :
        securitizeApiProxy.fetch(`/investor/`, {
          method: 'POST',
          body: JSON.stringify({
            "token": "FST",
            "fullNameComposite": {
              "firstName": regPayload.firstName,
              "middleName": "",
              "lastName": regPayload.lastName
            },
            "email": (user as any).Email,
            "birthdate": regPayload.birthdate,
            "countryCode": regPayload.countryCode,
            "walletAddress": props.walletAddress,
            "documentNumber": regPayload.documentNumber,
            "documentType": regPayload.documentType,
          }),
        })
          .then<securitizeApiProxy.Resps['POST/investor/']>(res => res.json())
          .then(resp => {
            if (securitizeApiProxy.isErrorResp(resp)) {
              throw resp.err;
            }
            return resp.res;
          })
          .then(() => setIsSuccessful(true))
      ))
  );

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClickOpen2 = () => {
    setOpen2(true);
    setOpen1(false);
  };

  const handleClickOpen3 = () => {
    setOpen3(true);
    setOpen2(false);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleClose2 = () => {
    setOpen1(false);
    setOpen2(false);
  };

  const handleClose3 = () => {
    setOpen1(false);
    setOpen2(false);
    setOpen3(false);
    activateLinearBuffer(true);
  };
  
  return (
  <React.Fragment> 
      {props.status === 'fetching' ? 
      <CircularProgress size={24} /> : 
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={handleClickOpen1}
        disabled={props.status === 'verified'}
        className={classes.start}
      >
        <img src={Securitize} alt="logo" className={classes.logo} />
        {props.status === 'pending' && (!props.registration || props.registration.step === 'begin')  ? (
          'Start On-Chain Registration'
        ) :
        props.status === 'verified' ? (
          'Verified User'
        ) : 
        props.status === 'pending' && props.registration && props.registration.step === 'end' ? 
        'Your application is being processed' :
        'Your application has not been submitted'}
      </Button>
      }
      <Dialog open={open1} onClose={handleClose1} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Securitze On-Chain Registration (Step 1 of 2)</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
          <img src={MetaMask} width="550px"></img>
          <Typography>
            To begin on-chain registration, you need to be using Google Chrome or Firefox as your browser to install MetaMask Chrome Extension via this link: <a href="https://metamask.io" target="_blank">Download Metamask</a>
          </Typography><br></br>
          <img src={MetaMaskNav} width="550px"></img>
          <Typography>
            Once you have MetaMask installed. You should see the 🦊 icon at the top right of your browser ↗️
          </Typography><br></br>
          <Typography>
            Fantastic! Now you have MetaMask installed, click 'NEXT' to continue 👉🏼
          </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose1} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClickOpen2} color="primary">
            Next
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open2} onClose={handleClose2} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Securitze On-Chain Registration (Step 2 of 2)</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
          <img src={MetaMaskLogin} height="300px"></img>
          <Typography>
            Now, click on the 🦊 icon at the top right of your browser ↗️. When the tab opens up, login with your password.
          </Typography><br></br>
          <Typography>
            Once you are logged in, click on "Account 1" to copy your MetaMask wallet address and then paste it below ⬇️
          </Typography>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="MetaMask"
            label="MetaMask Wallet Address"
            type="Address"
            value={props.walletAddress}
            fullWidth
            disabled={true}
            onChange={event => {}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleClickOpen3} color="primary" 
            disabled={!(props.walletAddress && ethersUtils.addressUtils.isAddress(props.walletAddress))}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open3} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Securitze On-Chain Registration (Step 2 of 2)</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {
              isLinearBufferActive ? (
                <LinearBuffer
                  onProgressComplete={() => {
                    activateLinearBuffer(false);
                    registerInvestor().catch(() => {}).then(() => (setOpen4(true), handleClose3()));
                  }}
                />
              ) : <CircularProgress size={24} />
            }
            <br></br>
            <Typography>
              Processing your submission..... Please wait
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose3} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open4} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Securitize On-Chain Registration Result</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            <Typography>
              {
                !isSuccessful ? (
                  'Unsuccessful registration - insufficient user information, please complete Identity Verification and become a VERIFIED USER first.'
                ) :
                true ? (
                  /*'Your identity/wallet has already been registered, please contact support at \"suport@cryptosx.io\" if you wish register a new wallet.'*/
                  'Registration successful, your wallet has been successfully whitlisted for token trading! Head to \"Exchange\" page to start trading.'
                ) : 'Registration successful, your wallet has been successfully whitlisted for token trading! Head to \"Exchange\" page to start trading.'
              }
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen4(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  ); 
};
let Container = withCookie(MetamaskForm);
export default Container
export {Container as MetamaskForm}