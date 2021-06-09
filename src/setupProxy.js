const {createProxyMiddleware} = require('http-proxy-middleware');

const context = '/api'

const options = {
  // By default, this is configured to proxy http://localhost:3000/api requests
  // to a running instance in localhost:3000, unless
  // process.env.LAUNCH_KIT_BACKEND_URL specify another thing (restart
  // create-react-app development server to read env var value)
  target: process.env.LAUNCH_KIT_BACKEND_URL
    ? process.env.LAUNCH_KIT_BACKEND_URL
    : 'http://localhost:3000',
  // rewrite paths
  pathRewrite: {
    '^/api': ''
  },
  changeOrigin: true
}

const apiProxy = createProxyMiddleware(context, options)

const coinMarketCapProxy = createProxyMiddleware('/coinmarketcap', {
  target: "https://api.coinmarketcap.com",
  pathRewrite: {
    '^/coinmarketcap': ''
  },
  changeOrigin: true
})

const etherscanProxy = createProxyMiddleware('/etherscan', {
  target: "https://api.etherscan.io",
  pathRewrite: {
    '^/etherscan': ''
  },
  changeOrigin: true
})

const api0xtrackerProxy = createProxyMiddleware('/0xtracker', {
  target: "https://api.0xtracker.com",
  pathRewrite: {
    '^/0xtracker': ''
  },
  changeOrigin: true
})

let chartApiProxy = createProxyMiddleware('/api/v1', {
  target: process.env.REACT_APP_CHART_API_URL || 'http://13.229.207.143:8080',
  //target: "https://markets.cryptosx.io/",
  pathRewrite: {
    '^/api/v1': '/api/v1'
  },
  changeOrigin: true
});

let securitizeApiProxy = createProxyMiddleware('/dsprotocol/api/v1', {
  target: "https://dsprotocol-api.herokuapp.com/",
  pathRewrite: {
    '^/dsprotocol/api/v1': '/dsprotocol/api/v1'
  },
  changeOrigin: true
});

module.exports = (app) => { 
  // app.use(apiProxy) 
  app
    .use(coinMarketCapProxy)
    .use(etherscanProxy)
    .use(api0xtrackerProxy)
    .use(chartApiProxy)
    .use(securitizeApiProxy);
}
