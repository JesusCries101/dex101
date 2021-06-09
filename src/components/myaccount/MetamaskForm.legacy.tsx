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
import fetch from 'cross-fetch';
import Securitize from '../../assets/images/securitize-square.png';
import {
  toolbelt as T,
  ramda as R
} from '../../util/@jacob/core'
import {
  Cookies
} from '../../util/local-storage';
import * as ethersUtils from '@0x/utils';
let Number = (
  <T extends T.Number>(val: T): T => val
);
let Tuple = (
  <TTuple extends any[]>(...vals: TTuple): TTuple => vals
);
let withCookie = (
  <TProps extends WithCookie.Props>(Component: React.ComponentType<TProps>) => (
    class WithCookie extends React.Component<WithCookie.Props.Trim<TProps>> {
      render() {
        return ( 
          <Component 
            {...this.props as unknown as TProps}
            getCookie={() => (
              T.Promise.resolve()
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
    getCookie: () => T.Promise<Cookies['cryptosx-user']>;
  }
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Props {
    export type Trim<TProps> = TProps extends ((infer UProps) & Props) ? (
      unknown extends UProps ? {} : UProps
    ) : never;
  }
}
interface User {
  userid: T.String;
  address: T.String;
  state: 'pending' | 'approved' | 'rejected' | 'duplicate';
}
type WithMongo<TComponentType> = (
  TComponentType extends React.ComponentType<infer TProps & WithMongo.Props> ?
  React.ComponentType<TProps & WithMongo.Props> :
  never
);
let withMongo = (
  <TProps extends WithMongo.Props>(Component: React.ComponentType<TProps>) => (
    class WithMongo extends React.Component<WithMongo.Props.Trim<TProps>> {
      render() {
        return (
          <Component 
            {...this.props as unknown as TProps}
            queryUser={(userid) => (
              fetch(`https://cryptosx-initiate.herokuapp.com/?url=https://jacob-mongo-express-api.herokuapp.com/metamask/${userid}`)
                .then(res => res.json())
                .then(json => json as User[])
                .then(users => users.length > 0 ? users[0] : null)
            )}
            addUser={user => (
              fetch(`https://cryptosx-initiate.herokuapp.com/?url=https://jacob-mongo-express-api.herokuapp.com/metamask/${user.userid}`, {
                method: 'Delete'
              })
                .then(() => (
                  fetch(`https://cryptosx-initiate.herokuapp.com/?url=https://jacob-mongo-express-api.herokuapp.com/metamask`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      nodes: [user]
                    })
                  })
                ))
                .then(res => undefined as unknown as void)
            )}
          />
        );
      }
    } as React.ComponentType<WithMongo.Props.Trim<TProps>>
  )
);
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace WithMongo {
  export interface Props {
    queryUser: (userid: T.String) => T.Promise<T.Nullable<User>>;
    addUser: (user: User) => T.Promise<void>;
  }
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Props {
    export type Trim<TProps> = TProps extends infer UProps & Props ? (
      unknown extends UProps ? {} : UProps
    ) : never;
  }
}
let withDSProtocol = (
  <TProps extends WithDSProtocol.Props>(Component: React.ComponentType<TProps>) => (
    class WithDSProtocol extends React.Component<WithDSProtocol.Props.Trim<TProps>> {
      render() {
        return ( 
          <Component 
            {...this.props as unknown as TProps}
            registerInvestor={(userid, addrWallet) => (
              fetch(`https://cryptosx-initiate.herokuapp.com/?url=https://express-ethers-dsprotocol.herokuapp.com/investor?addrWallet=${addrWallet}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  payload: {
                    'UserId': userid
                  }
                })
              })
                .then(res => res.json())
                .then(res => res as WithDSProtocol.Response)
            )}
          />
        );
      }
    } as unknown as React.ComponentType<WithDSProtocol.Props.Trim<TProps>>
  )
);
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace WithDSProtocol {
  export interface Props {
    registerInvestor: (userId: T.String, addrWallet: T.String) => (
      T.Promise<Response>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Props {
    export type Trim<TProps> = TProps extends ((infer UProps) & Props) ? (
      unknown extends UProps ? {} : UProps
    ) : never;
  }
  export type Response = (
    {
      error: true;
      res: any;
    } | {
      error: false;
      res: {
        blockchainId: T.String;
      }
    }
  );
}
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

let MetamaskForm: React.ComponentType<{} & WithCookie.Props & WithMongo.Props & WithDSProtocol.Props> = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  let [open4, setOpen4] = React.useState(false);
  let [user, setUser] = React.useState<T.Nullable<User>>(undefined);
  let [cookie, setCookie] = React.useState<T.Nullable<Cookies['cryptosx-user']>>(null);
  let [inputAddress, setInputAddress] = React.useState<T.Nullable<T.String>>(null);
  let [fgLinearBuffer, setFgLinearBuffer] = React.useState(true);
  let indexByInputName = {
    'address': Number(0)
  };
  let arrayThunkVerifyInput = Tuple(
    () => (
      inputAddress != null && ethersUtils.addressUtils.isAddress(inputAddress)
    )
  );
  
  useEffect(() => {
    T.Promise.resolve()
      .then(() => (
        props.getCookie()
          .then(cookie => (setCookie(cookie), cookie))
          .then(cookie => (
            cookie === null ?
            T.Promise.resolve(null) : 
            props.queryUser((cookie["User"]['UserId'] as unknown as Number).toString())
          ))
          .then(setUser)
      )) 
  }, []);
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpen2 = () => {
    setOpen2(true);
    setOpen(false);
  };

  const handleClickOpen3 = () => {
    setOpen3(true);
    setOpen2(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = () => {
    setOpen(false);
    setOpen2(false);
  };

  const handleClose3 = () => {
    setOpen(false);
    setOpen2(false);
    setOpen3(false);
    setFgLinearBuffer(true);
  };

  let state = user ? user.state : null;
  let userid = cookie ? (cookie["User"]['UserId'] as unknown as Number).toString() : '';
  let fg0 = true;
  
  return (
  <React.Fragment> 
      {user === undefined ? (
        <CircularProgress size={24} />
      ) : (
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleClickOpen}
          disabled={!(state == null || state === 'rejected'|| state === 'duplicate')}
          className={classes.start}
        >
          <img src={Securitize} alt="logo" className={classes.logo} />
          {state == null || state === 'rejected' || state === 'duplicate' ? (
            'Start On-Chain Registration'
          ) :
          state === 'approved' ? (
            'Verified User'
          ) : (
            'Your submission is being processed'
          )}
        </Button>
      )}
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
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
          <Button onClick={handleClose} color="primary">
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
            fullWidth
            error={!arrayThunkVerifyInput[indexByInputName['address']]()}
            onChange={event => (
              setInputAddress(event.target.value)
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClickOpen3} color="primary" disabled={!arrayThunkVerifyInput.every(thunk => thunk())}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open3} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Securitze On-Chain Registration (Step 2 of 2)</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {
              fgLinearBuffer ? (
                <LinearBuffer
                  onProgressComplete={() => (
                    !fg0 ? undefined : (
                      fg0 = false,
                      setFgLinearBuffer(false),
                      props.addUser({
                        address: inputAddress!,
                        userid,
                        state: 'pending'
                      })
                        .then(() => props.queryUser(userid))
                        .then(setUser)
                        .then(() => (
                          props.getCookie()
                            .then(cookie => cookie['User']['UserId'])
                            .then(userId => (userId as unknown as number).toString())
                            .then(userId => (
                              props.registerInvestor(userId, inputAddress!)
                                .then(res => (
                                  props.queryUser(userId)
                                    .then(user => (
                                      user ? (
                                        user.state = res.error ? (
                                          'data' in res.res ?
                                          'duplicate' :
                                          'rejected'
                                        ) : (
                                          res.res.blockchainId !== '' ?
                                          'approved' :
                                          'rejected'
                                        ),
                                        user
                                      ) : user
                                    ))
                                    .then(user => (
                                      T.Promise.resolve()
                                        .then(() => (
                                          user ? (
                                            props.addUser(user)
                                              .then(() => setUser(user))
                                              .then(() => handleClose3())
                                              .then(() => setOpen4(true))
                                          ) : undefined
                                        ))
                                    ))
                                ))
                            ))
                        ))
                    )
                  )}
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
                state === 'rejected' ? (
                  'Unsuccessful registration - insufficient user information, please complete Identity Verification and become a VERIFIED USER first.'
                ) :
                state === 'duplicate' ? (
                  'Your identity/wallet has already been registered, please contact support at \"suport@cryptosx.io\" if you wish register a new wallet.'
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
let Container = (
  withDSProtocol(
    withCookie(
      withMongo(
        MetamaskForm
      )
    )
  )
);
export {
  Container as MetamaskForm
}; 