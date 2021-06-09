import * as Ws from './@jacob/ws';
import {
  toolbelt as T,
  ramda as R
} from './@jacob/core';
import {
  UnionToIntersection
} from './ts-toolbet';
export type PayloadByType = {
  'AuthenticateUser': {
    res: {
      error: false;
      'Authenticated': T.Boolean;
      'User': {
        'UserId': T.Number;
        'UserName': T.String;
        'Email': T.String;
        'EmailVerified': T.Boolean;
        'AccountId': T.Number;
        'OMSId': T.Number;
        'Use2FA': T.Boolean;
      };
    } | {
      error: true;
      'errormsg': T.String;
    };
    req: { 
      'UserName': T.String;
      'Password': T.String;
    };
  };
  'RegisterNewUser': {
    res: {
      error: false;
      'UserId': T.Number;
    } | {
      error: true;
      'errormsg': T.String;
    };
    req: {
      'UserInfo': {
        'UserName': T.String;
        'passwordHash': T.String;
        'Email': T.String;
      };
      'UserConfig': [{
        'Name': 'fullName';
        'Value': T.String;
      }, {
        'Name': 'phoneNumber';
        'Value': T.String;
      }];
      'OperatorId': T.Number;
    }
  };
  'GetUserAccountInfos': {
    res: {
      error: false;
      "OMSID": T.Number;
      "AccountId": T.Number;
      "AccountName": T.String;
      "AccountHandle": T.String;
      "FirmId": T.String;
      "FirmName": T.String;
      "AccountType": "Asset";
      "FeeGroupID": T.Number;
      "ParentID": T.Number;
      "RiskType": "Normal";
      "VerificationLevel": T.Number;
      "CreditTier": T.Number;
      "FeeProductType": "BaseProduct";
      "FeeProduct": T.Number;
      "RefererId": T.Number;
      "LoyaltyProductId": T.Number;
      "LoyaltyEnabled": T.Boolean;
    } | {
      error: true;
      'errormsg': T.String;
    };
    req: {
      'OMSId': T.Number;
      'UserId': T.Number;
      'UserName': T.String;
    };
  };
};
let makeClient = () => {
  let client = null as T.Nullable<Ws.Client<PayloadByType>>;
  while (R.isNil(client)) {
    client = (
      T.nullifyError(() => (
        new Ws.Client<PayloadByType>({
          address: 'wss://api.cryptosx.io/WSGateway/',
          reqActionToData: (action) => (
            JSON.stringify({
              ['m']: 0,
              ['i']: 0,
              ['n']: action.type,
              ['o']: JSON.stringify(action.payload)
            })
          ),
          dataToResAction: (data) => (
            console.log(data),
            Promise.resolve({
              json: (
                T.nullifyError(() => (
                  JSON.parse(data) as Record<string, any>
                ))() || {}
              )
            })
              .then(_ => ({
                ..._,
                type: _.json['n'] as keyof PayloadByType
              }))
              .then(_ => ({
                ..._,
                resAction: (
                  _.type === 'AuthenticateUser' ? ({
                    type: _.type,
                    payload: (
                      T.nullifyError(() => (
                        T.json.pick(JSON.parse(_.json['o']) as UnionToIntersection<PayloadByType['AuthenticateUser']['res']>,
                          'Authenticated', 'User', 'errormsg', 'error'
                        )
                      ))()
                    )
                  }) :
                  _.type === 'RegisterNewUser' ? ({
                    type: _.type,
                    payload: (
                      T.nullifyError(() => (
                        T.json.pick(JSON.parse(_.json['o']) as UnionToIntersection<PayloadByType['RegisterNewUser']['res']>, 
                          'UserId', 'errormsg', 'error'
                        )
                      ))()
                    )
                  }) : 
                  _.type === 'GetUserAccountInfos' ? ({
                    type: _.type,
                    payload: (
                      T.nullifyError(() => (
                        JSON.parse(_.json['o'])[0] as T.UnionToIntersection<PayloadByType['GetUserAccountInfos']['res']>
                      ))()
                    )
                  }) : null
                )
              }))
              .then(_ => (
                R.isNil(_.resAction) || R.isNil(_.resAction.type) || R.isNil(_.resAction.payload) ?
                Promise.reject(new Error('data cannot be parsed')) : (
                  Promise.resolve(_.resAction as T.NonNullify<T.NonNullable<typeof _.resAction>>)
                    .then(resAction => resAction as unknown as {
                      [K in keyof PayloadByType]: Ws.Client.Common.Action<K, PayloadByType[K]['res']>;
                    }[keyof PayloadByType])
                )
              ))
              .catch(err => (
                console.error(err),
                T.Promise.reject(err)
              ))
          )
        })
      ))()
    );
  }
  return client;
};
let client = makeClient();
let clientCustomer = makeClient();
export default client;
export {
  client,
  clientCustomer
}