import {
    toolbelt as T
  } from './@jacob/core';
  import {
    PayloadByType
  } from './ws';
  export interface Cookies {
    // 'cryptosx-user': (
    //   T.Pick<T.UnionToIntersection<PayloadByType['AuthenticateUser']['res']>,('Authenticated')> & {
    //     'Password': T.String;
    //   }
    // );
    'cryptosx-user': (
      T.Pick<T.UnionToIntersection<PayloadByType['AuthenticateUser']['res']>, (
        'Authenticated' | 'User' | 'errormsg' | 'error'
      )> & {
        'Password': T.String;
      }
    );
  } 