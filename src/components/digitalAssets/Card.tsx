import React from 'react';
import { useHistory } from 'react-router-dom';
import { 
  AssetCard,
  AssetCard__head,
  AssetCard__img,
  AssetCard__label, 
  AssetCard__coin,
  AssetCard__coin__name,
  AssetCard__title,
  AssetCard__ratio,
  AssetCard__footer,
  AssetCard__title__small,
  AssetCard__info
} from './cardStyles';
import FS from '../../assets/images/FS.png'
import HCS from '../../assets/images/HCS.svg'
import CCT from '../../assets/images/CCT.svg'
import AGWD from '../../assets/images/AGWD.svg'

// 

export default function OfferCard(props) {  
  const renderImg = (symbol) => {
    switch(symbol) {
      case 'FS': {
        return FS
      }
      case 'HCS': {
        return HCS
      }
      case 'CCT': {
        return CCT
      }
      case 'AGWD': {
        return AGWD
      }
    }
  }
  const history = useHistory();
  const handleOnClick = (app, symbol) => {
    if (app.includes('STO')) {
      window.open('https://investorportal.cryptosx.io')
    } else {
      history.push(`/digital-assets/${symbol}`)};
    }
  return (
    <AssetCard onClick={() => handleOnClick(props.app, props.symbol)}>
      <AssetCard__head>
        <AssetCard__img><img src={renderImg(props.symbol)} style={{maxWidth: '48px'}} /></AssetCard__img>
        <AssetCard__label>{props.app}</AssetCard__label>
      </AssetCard__head>
      <AssetCard__coin>
        <AssetCard__coin__name>{props.name}</AssetCard__coin__name>
        <AssetCard__title>Total Raise</AssetCard__title>
        <AssetCard__ratio>{props.amount}</AssetCard__ratio>
      </AssetCard__coin>
      <AssetCard__footer>
        <div>
          <AssetCard__title__small>Price:</AssetCard__title__small>
          <AssetCard__info>{props.price}</AssetCard__info>
        </div>
        <div>
          <AssetCard__title__small>Traded on:</AssetCard__title__small>
          <AssetCard__info>{props.app}</AssetCard__info>
        </div>
      </AssetCard__footer>
    </AssetCard>
  );
}