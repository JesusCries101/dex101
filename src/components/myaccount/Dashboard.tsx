import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import VerificationStatus from './VerifictionStatus';
import AccreditationStatus from './AccreditationStatus';
import SecuritizeRFE from './SecuritizeRFE';
import { connect } from 'react-redux';
import QueryVerificationLevel from '../../util/ws/QueryVerificationLevel';
import { useTranslation } from 'react-i18next';
import { Translation } from 'react-i18next';

import {
	Detypify
} from '../../util/ts-toolbet'
function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://cryptosx.io/">
				Cryptosx
      </Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}


const drawerWidth = 240;
const useStyles = makeStyles((theme) => {
	let styles = {
		root: {
			display: 'flex',
		},
		button: {
			marginRight: '0.5rem',
			color: 'white',
		},
		toolbar: {
			paddingRight: 24, // keep right padding when drawer closed
		},
		toolbarIcon: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'flex-end',
			padding: '0 8px',
			...theme.mixins.toolbar,
		},
		logo: {
			width: '200px',
			padding: '0 0 0 20px',
		},
		appBar: {
			zIndex: theme.zIndex.drawer + 1,
			transition: theme.transitions.create(['width', 'margin'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
		},
		appBarShift: {
			marginLeft: drawerWidth,
			width: `calc(100% - ${drawerWidth}px)`,
			transition: theme.transitions.create(['width', 'margin'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
		},
		menuButton: {
			marginRight: 36,
		},
		menuButtonHidden: {
			display: 'none',
		},
		title: {
			flexGrow: 1,
		},
		drawerPaper: {
			position: 'relative',
			whiteSpace: 'nowrap',
			width: drawerWidth,
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
		},
		drawerPaperClose: {
			overflowX: 'hidden',
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			width: theme.spacing(7),
			[theme.breakpoints.up('sm')]: {
				width: theme.spacing(9),
			},
		},
		appBarSpacer: theme.mixins.toolbar,
		content: {
			flexGrow: 1,
			height: '100vh',
			overflow: 'auto',
		},
		container: {
			paddingTop: theme.spacing(4),
			paddingBottom: theme.spacing(4),
		},
		paper: {
			padding: theme.spacing(2),
			display: 'flex',
			overflow: 'auto',
			flexDirection: 'column',
		},
		fixedHeight: {
			height: 270,
		},
		fixedHeight2: {
			height: 330,
		},
		fixedHeight3: {
			height: 'auto',
			alignItems: 'center',
			position: 'relative',
		},
		gridList: {
			flexWrap: 'nowrap',
			// Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
			transform: 'translateZ(0)',
		},
		titleBar: {
			background:
				'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
		},
	};
	return styles as Detypify<typeof styles>;
});
interface DispatchProps {
	onLogout: () => any;
}
interface OwnProps {
	ThemeToggle: React.ComponentType;
}
type Props = DispatchProps & OwnProps;

function Dashboard(props: Props) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(true);
	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
	const fixedHeight2Paper = clsx(classes.paper, classes.fixedHeight2);
	const fixedHeight3Paper = clsx(classes.paper, classes.fixedHeight3);

	const { t, i18n } = useTranslation();
	
	function handleClick(language) {
		i18n.changeLanguage(language);
	}
	return (
		<React.Fragment>
			<div className={classes.root}>
				<main className={classes.content}>
					{/*
        <div className={classes.appBarSpacer} />
        */}
					<Container maxWidth="lg" className={classes.container}>
						<Translation>
							{
								(t, i18n) => <Typography variant="h6">{t('Step 1. Complete KYC and User Accreditation')}</Typography>
							}
						</Translation>
						<br></br>
						<Divider /><br></br>
						<QueryVerificationLevel>
							<Grid container spacing={2}>
								{/* Profile Title 
              <Grid item xs={12} md={12} lg={12}>
                <Paper className={fixedHeightPaper}>
                  <ProfileTitle />
                </Paper>
              </Grid>*/}
								{/* Verification Status */}
								<Grid item xs={12} md={12} lg={12}>
									<Paper className={fixedHeight3Paper}>
										<VerificationStatus />
									</Paper>
								</Grid>
								{/* Accreditation Status */}
								<Grid item xs={12} md={12} lg={12}>
									<Paper className={fixedHeight3Paper}>
										<AccreditationStatus />
									</Paper>
								</Grid>
							</Grid>
						</QueryVerificationLevel>
						<div className={classes.appBarSpacer} />
						<Translation>
							{
								(t, i18n) => <Typography variant="h6">{t('Step 2. Securitize On-Chain Registration (Token Specific)')}</Typography>
							}
						</Translation>
						<br></br>
						<Divider /><br></br>
						<QueryVerificationLevel>
							<Grid container spacing={2}>
								{/* Securtizie RFE */}
								<Grid item xs={12} md={12} lg={12}>
									<Paper className={fixedHeight3Paper}>
										<SecuritizeRFE />
									</Paper>
								</Grid>
							</Grid>
						</QueryVerificationLevel>
						<Box pt={4}>
							<Copyright />
						</Box>
					</Container>
				</main>
			</div>
		</React.Fragment>
	);
}
const mapDispatchToProps = (dispatch: any): DispatchProps => {
	return {
		onLogout: () => (
			dispatch({
				type: 'login',
				payload: {
					authorized: false
				}
			}),
			window.localStorage.removeItem('cryptosx-user'),
			window.location.href = '/#/login'
		)
	};
};
const DashboardContainer = connect(
	null,
	mapDispatchToProps,
)(Dashboard);
export default DashboardContainer;