import React from 'react'

export let useAlertDialog = () => {
	let [alertMsg, setAlertMsg] = React.useState<string | null>(null);
	let [shouldShowAlert, setShouldShowAlert] = React.useState(false);
	let toggleShowAlert = () => setShouldShowAlert(!shouldShowAlert);
	let showAlert = (msg: string) => (
		setAlertMsg(msg),
		toggleShowAlert()
	);
	React.useEffect(() => {
		if (alertMsg) {
			//alert(alertMsg);
		}
	}, [shouldShowAlert]);

	return {
		showAlert
	};
};