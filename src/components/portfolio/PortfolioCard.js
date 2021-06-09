import React from 'react';
import {
    CardBlock,
    CardCount,
    CardCountIn,
    CardCrypto,
    CardFiat,
    CardLabel
} from './portfolioElements';

function PortfolioCard(props) {
    return (
        <React.Fragment>
            <CardBlock>
                <CardLabel>Total Balance</CardLabel>
                <CardFiat>$2156.88</CardFiat>
                <CardCrypto>0.576892</CardCrypto>
                <CardCount>
                    <CardCountIn>5 Assets</CardCountIn>
                </CardCount>
            </CardBlock>
        </React.Fragment>
    )
}

export default PortfolioCard;
