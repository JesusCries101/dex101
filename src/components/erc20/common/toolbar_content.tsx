import React from 'react';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';
import { separatorTopbar, ToolbarContainer } from '../../../components/common/toolbar';
import { NotificationsDropdownContainer } from '../../../components/notifications/notifications_dropdown';
import { goToHome, goToWallet } from '../../../store/actions';
import { Theme, themeBreakPoints } from '../../../themes/commons';
import { WalletConnectionContentContainer } from '../account/wallet_connection_content';
import { MarketsDropdownContainer } from './markets_dropdown';

interface DispatchProps {
    onGoToHome: () => any;
    onGoToWallet: () => any;
    onLogout: () => any;
}

interface OwnProps {
    theme: Theme;
}

type Props = DispatchProps & OwnProps;

const NavBarLink = styled.a`
    align-items: center;
    color: ${props => props.theme.componentsTheme.navBarLinkColor};
    display: flex;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }

    ${separatorTopbar}
`;

const MarketsDropdownHeader = styled<any>(MarketsDropdownContainer)`
    align-items: center;
    display: flex;

    ${separatorTopbar}
`;

const WalletDropdown = styled(WalletConnectionContentContainer)`
    display: none;

    @media (min-width: ${themeBreakPoints.sm}) {
        align-items: center;
        display: flex;

        ${separatorTopbar}
    }
`;

const ToolbarContent = (props: Props) => {
    const handleLogoClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.onGoToHome();
    };
    const startContent = (
        <>
          <MarketsDropdownHeader shouldCloseDropdownBodyOnClick={false} />
        </>
    );

    const handleMyWalletClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.onGoToWallet();
    };
        
    const endContent = (
        <>
            <NavBarLink href="/" onClick={handleLogoClick}>
                MarketPlace
            </NavBarLink>
            <NavBarLink href="/my-wallet" onClick={handleMyWalletClick}>
                My Wallet
            </NavBarLink>
            <WalletDropdown />
            <NotificationsDropdownContainer />
        </>
    );

    return <ToolbarContainer startContent={startContent} endContent={endContent} />;
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onGoToHome: () => dispatch(goToHome()),
        onGoToWallet: () => dispatch(goToWallet()),
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

const ToolbarContentContainer = withTheme(
    connect(
        null,
        mapDispatchToProps,
    )(ToolbarContent),
);

export { ToolbarContent, ToolbarContentContainer };
