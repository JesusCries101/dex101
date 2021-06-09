import React from 'react';
import {
  clientCustomer as wsClient
} from '../ws';
import {
  toolbelt as T,
  ramda as R,
  node as N
} from '../@jacob/core';
import {
  Cookies
} from '../local-storage'

class QueryVerificationLevel extends React.Component<any, QueryVerificationLevel.State> {
  user = null as Cookies['cryptosx-user'] | null;
  constructor(props) {
    super(props);
    this.state = {
      verificationLevel: null as T.Nullable<T.Number>
    };
  }
  componentDidMount() {
    let p = this;
    p.user = (() => {
      let user = T.nullifyError(() => JSON.parse(window.localStorage.getItem('cryptosx-user') || '') as Cookies['cryptosx-user'])();
      return user as any;
    })();
    return (
      !p.user ? undefined : (
        T.Promise.resolve(p.user)
          .then(user => (
            wsClient.dispatch(wsClient.makeAction('AuthenticateUser', {
              'UserName': user['User']['UserName'],
              'Password': user['Password']
            }))
              .then(() => (
                N.promise.waitFor(1e3)
                  .then(() => (
                    wsClient.dispatch(wsClient.makeAction('GetUserAccountInfos', {
                      ...T.json.pick(user['User'], 'OMSId', 'UserId', 'UserName')
                    }))
                  ))
                  .then(resAction => (
                    !resAction.payload || resAction.payload.error ? 
                    undefined as void : (
                      p.setState({
                        verificationLevel: resAction.payload['VerificationLevel']
                      }),
                      undefined as void
                    )
                ))
              ))
              .catch(console.error)
          ))
      )
    );
  }
  render() {
    function recursiveMap(children: React.ReactNode, fn: (child: React.ReactNode) => React.ReactNode) {
      return React.Children.map(children, child => {
        if (!React.isValidElement(child)) {
          return child;
        }
        if (child.props['children']) {
          child = React.cloneElement(child as React.ReactElement<any>, {
            children: recursiveMap(child.props['children'] as any, fn)
          });
        }
        return fn(child);
      });
    }
    let modify = (
      (elem: React.Component) => (
        recursiveMap(elem.props.children, (child) => React.cloneElement(child as React.ReactElement<any>, (
          R.isNil(this.state.verificationLevel) ? {} : {
            verificationLevel: this.state.verificationLevel
          }
        ) as QueryVerificationLevel.ForwardedProps))
      )
    );
    return (
      <React.Fragment>
        {modify(this)}
      </React.Fragment>
    );
  }
}
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace QueryVerificationLevel {
  export interface State {
    verificationLevel: T.Nullable<T.Number>;
  }
  export interface ForwardedProps {
    verificationLevel?: T.Number;
  }
}
export default QueryVerificationLevel;