let expireTimeout = 10e3;

type Stringified<T> = string & {_Stringified_:T};

interface AlphapointPayload<T = any> {
    m: number;
    i: number;
    n: string;
    o: Stringified<T>;
}

let makeAlphapointPayload = (method: string, payload: any, i: number, m: number): Stringified<AlphapointPayload> => <any>(
    JSON.stringify({
        m,
        i,
        n: method,
        o: JSON.stringify(payload),
    })
);

let isError = (payload: any) => !!payload.errormsg;

export let makeAlphapointDispatch = (sock: WebSocket) => ( 
    ((promise, i = 0) => (
        (method: string, payload: any, m = 0) => (
            (i => (
                promise
                    .then(() => (
                        new Promise<any>((resolve, reject) => {
                            let isResolved = false;
                            let thisListener = (ev: MessageEvent) => false;
                            (listener => ( 
                                thisListener = listener = (
                                    (listener => (ev: MessageEvent) => {
                                        let isSuccessful = listener(ev);
                                        if (isSuccessful) {
                                            sock.removeEventListener('message', listener);
                                        }
                                        return isSuccessful;
                                    })(listener)
                                ),
                                sock.addEventListener('message', listener) 
                            ))((ev: MessageEvent) => {
                                try {
                                    let resp: AlphapointPayload = JSON.parse(ev.data);
                                    if (resp.i === i && resp.n === method) {
                                        let payload = JSON.parse(resp.o);
                                        if (isError(payload)) {
                                            reject(new Error(payload.errormsg));
                                        } else {
                                            resolve(payload);
                                            isResolved = true;
                                        }
                                        return true;
                                    }
                                } catch (err) {
                                    reject(err);
                                }
                                return false;
                            });

                            sock.send(makeAlphapointPayload(method, payload, i, m));
                            new Promise(resolve => setTimeout(resolve, expireTimeout))
                                .then(() => isResolved ? Promise.resolve() : Promise.resolve().then(reject))
                                .then(() => sock.removeEventListener('message', thisListener))
                                .catch(() => {});
                        })
                    ))
            ))(i++)
        )
    ))(
        new Promise<void>((resolve, _) => {
            (function f() {
                if (sock.readyState == sock.OPEN) {
                    resolve();
                } else {
                    setTimeout(f, 1e2);
                }
            })();
        })
    )
);

export let makePresetAlphapointDispatch = () => (
    (sock => (
        sock.addEventListener('error', (ev) => {
            console.log(JSON.stringify(ev,null,2))
        }),
        (method: string, payload: any, m = 0) => (
            makeAlphapointDispatch(sock)(method, payload, m)
        )
    ))(new WebSocket(process.env.REACT_APP_AP_WS_URL || 'wss://api.cryptosx.io/WSGateway/'))
)

export let alphapointDispatch = makePresetAlphapointDispatch();

alphapointDispatch('AuthenticateUser', {
    "APIKey": process.env.REACT_APP_AP_API_KEY,
    "Signature": process.env.REACT_APP_AP_SIGNATURE,
    "UserId": process.env.REACT_APP_AP_USER_ID,
    "Nonce":  process.env.REACT_APP_AP_NONCE
}).catch(() => alert('securitize alphapoint websocket auth failed'));

interface KeyValuePair {
    Key: string;
    Value: string;
}

export let parseKeyValuePairs = <TKey extends string>(...keys: TKey[]) => (pairs: KeyValuePair[]): Record<TKey, string | null> => (
    Object.assign(
        keys.reduce((acc, key) => Object.assign(acc, {[key]: null}), <Record<TKey, string | null>>{}),
        pairs.reduce((acc, pair) => (
            keys.some(key => pair.Key === key) ? Object.assign(acc, {[pair.Key]: pair.Value}) : acc
        ), <Record<TKey, string>>{})
    )
);