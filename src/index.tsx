import React, { Suspense, lazy } from 'react';
import { ConnectedRouter } from 'connected-react-router';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { ERC20_APP_BASE_PATH, LOGGER_ID } from './common/constants';
import { Switch as Toggle } from '@material-ui/core';
import { MetaMaskProvider } from 'metamask-react';
import { AppContainer } from './components/app';
import * as serviceWorker from './serviceWorker';
import { history, store } from './store';
import Navbar from './components/layout/Navbar'

import {
	createMuiTheme,
	ThemeProvider
} from '@material-ui/core/styles';
import './i18n';
import 'sanitize.css';
import './index.css';

const LoginPage = lazy(() => import('./components/login/PageSignin'));
const SignupPage = lazy(() => import('./components/signup/PageSignup'));
const DigitalAssets = lazy(() => import('./components/digitalAssets/DigitalAssets'));
const ProfileFS = lazy(() => import('./components/profiles/fs/ProfileFS'));
const Portfolio = lazy(() => import('./components/portfolio/index'));
const MyAccount = lazy(() => import('./components/myaccount/Dashboard'));
const Erc20App = lazy(() => import('./components/erc20/erc20_app'));

if (['development', 'production'].includes(process.env.NODE_ENV) && !window.localStorage.debug) {
	// Log only the app constant id to the console
	window.localStorage.debug = `${LOGGER_ID}*`;
}
const RedirectToHome = () => <Redirect to={'/digital-assets'} />; // destination if logged in

const Web3WrappedApp = () => {
	const [darkState, setDarkState] = React.useState(true);
	const customTheme = createMuiTheme({
		palette: {
			primary: {
				main: '#4283fc'
			}
		}
	})

	const palletType = "light";
	const darkTheme = createMuiTheme(darkState ? {
		palette: {
			type: palletType,
		}
	} : undefined);
	let withThemeToggle = (
		(Component: React.ComponentType<any>) => (
			class WithThemeToggle extends React.Component {
				render() {
					return (
						<Component
							{...this.props}
							setDarkTheme={() => setDarkState(true)}
							ThemeToggle={() => (
								<Toggle
									onClick={() => setDarkState(!darkState)}
									checked={darkState}
								/>
							)}
						/>
					);
				}
			}
		)
	);

	return (
		<MetaMaskProvider>
			<Provider store={store}>
				<ConnectedRouter history={history}>
					<ThemeProvider theme={customTheme}>
						<AppContainer>
							{store.getState().login.authorized ? <Navbar /> : <></>}
							<Suspense fallback={(<div>Loading...</div>)} >
								<Switch>
									<Route path={'/signup'} component={withThemeToggle(SignupPage)} />
									<Route path={'/login'} component={() => (
										store.getState().login.authorized ?
											RedirectToHome() :
											(Login => <Login />)(withThemeToggle(LoginPage))
									)} />
									<Route>
										<Switch>
											<Route exact path={ERC20_APP_BASE_PATH}>{
												store.getState().login.authorized ?
												<Erc20App /> :
												<Redirect to={'/login'} />
											}</Route>
											<Route exact path={'/digital-assets'}>{
												store.getState().login.authorized ?
												(DigitalAssets => <DigitalAssets />)(withThemeToggle(DigitalAssets)) :
												<Redirect to={'/login'} />
											}</Route>
											<Route exact path={'/accreditation'}>{
												store.getState().login.authorized ?
												(MyAccount => <MyAccount />)(withThemeToggle(MyAccount)) :
												<Redirect to={'/login'} />
											}</Route>
											<Route exact path={'/digital-assets/FS'}>{
												store.getState().login.authorized ?
												(ProfileFS => <ProfileFS />)(withThemeToggle(ProfileFS)) :
												<Redirect to={'/login'} />
											}</Route>
											<Route exact path={'/portfolio'}>{
												store.getState().login.authorized ?
												(Portfolio => <Portfolio />)(withThemeToggle(Portfolio)) :
												<Redirect to={'/login'} />
											}</Route>
											<Route component={RedirectToHome} />
										</Switch> 
										{/**<Switch>{
											([
												{ path: ERC20_APP_BASE_PATH, component: Erc20App },
												{ path: '/digital-assets', component: withThemeToggle(DigitalAssets) },
												{ path: '/accreditation', component: withThemeToggle(MyAccount) },
												{ path: '/digital-assets/FS', component: withThemeToggle(ProfileFS) },
												{ path: '/portfolio', component: withThemeToggle(Portfolio) },
											] as { path: string, component: React.ComponentType<any>; }[])
												.map(({ path, component: Component }, i) => (
													<Route key={i} exact path={path} component={() => (
														store.getState().login.authorized ?
															<Component /> :
															<Redirect to={'/login'} />
													)} />
												))
												.concat([
													<Route component={RedirectToHome} />
												])
										}</Switch> */}
									</Route>
								</Switch>
							</ Suspense>
						</AppContainer>
					</ThemeProvider>
				</ConnectedRouter>
			</Provider>
		</MetaMaskProvider>
	);
	return (
		<Suspense fallback={(<div>Loading...</div>)} >
			<MetaMaskProvider>
				<Provider store={store}>
					<ConnectedRouter history={history}>
						<ThemeProvider theme={customTheme}>
							<AppContainer>
								<Switch>
									<Route path={'/signup'} component={SignupPage} />
									<Route path={'/login'} component={() => (
										store.getState().login.authorized ?
											RedirectToHome() :
											(() => {
												let Login = withThemeToggle(LoginPage);
												return <Login />;
											})()
									)} />
									<Route>
										<Switch>{
											([
												{ path: ERC20_APP_BASE_PATH, component: Erc20App },
												{ path: '/digital-assets', component: withThemeToggle(DigitalAssets) },
												{ path: '/accreditation', component: withThemeToggle(MyAccount) },
												{ path: '/digital-assets/FS', component: withThemeToggle(ProfileFS) },
												{ path: '/portfolio', component: withThemeToggle(Portfolio) },
											] as { path: string, component: React.ComponentType<any>; }[])
												.map(({ path, component: Component }, i) => (
													<Route key={i} exact path={path} component={() => (
														store.getState().login.authorized ?
															<Component /> :
															<Redirect to={'/login'} />
													)} />
												))
												.concat([
													<Route component={RedirectToHome} />
												])
										}</Switch>
									</Route>
								</Switch>
							</AppContainer>
						</ThemeProvider>
					</ConnectedRouter>
				</Provider>
			</MetaMaskProvider>
		</Suspense>
	);
};

ReactDOM.render(<Web3WrappedApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
