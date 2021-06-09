import styled from 'styled-components';

export const MainContent = styled.div`
    height: 100vh;
    overflow: auto;
    flex-grow: 1;
`

export const MainContainer = styled.div`
    padding: 32px;
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
`

export const CardBlock = styled.div`
    height: 188px;
    padding: 25px;
    border-radius: 16px;
    background-color: #eeeeee;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    box-shadow: 0 13.4px 26.8px rgb(0 0 0 / 4%);
`

export const CardLabel = styled.div`
    white-space: pre;
    color: #565a69;
    font-size: 16px;
`

export const CardFiat = styled.div`
    font-size: 28px;
    color: #000;
    font-weight: 500;
`

export const CardCrypto = styled.div`
    color: #565a69;
    display: -webkit-flex;
    display: flex;
`

export const CardCount = styled.div`
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
`

export const CardCountIn = styled.div`
    background: rgba(0,0,0,.4);
    color: #fff;
    padding: 5px 8px;
    color: #000;
    background-color: #f5f5f9;
    border-radius: 6px;
    font-weight: 500;
`

export const CardWalletBlock = styled.div`
    padding: 25px 30px 10px 25px;
    padding: 25px;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 13.4px 26.8px rgb(0 0 0 / 4%);
`

export const TableHeader = styled.div`
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    padding: 16px 0;
    font-size: 12px;
    color: #565a69;
    border-bottom: 1px solid #f5f5f9;
`
export const TableAsset = styled.div`
    width: 160px;
    text-align: left;
`

export const TableBalance = styled.div`
    width: calc(100% - 320px);
    text-align: right;
`

export const TableValue = styled.div`
    width: 160px;
    text-align: right;
`
export const TableContent = styled.div``

export const TableItem = styled.div`
    padding: 18px 0;
    position: relative;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: space-between;
    justify-content: space-between;
`

export const TableItemAsset = styled.div`
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
    width: 160px;
    text-align: left;
`
 
export const TokenLogo = styled.div`
    width: 36px;
`

export const TokenSymbol = styled.div`
    margin-left: 8px;
    font-size: 16px;
    font-weight: 500;
`

export const TableItemBalance = styled.div`
    font-size: 14px;
    font-weight: 500;
    width: calc(100% - 320px);
    text-align: right;
`

export const TableItemValue = styled.div`
    font-size: 14px;
    font-weight: 500;
    width: 160px;
    text-align: right;
`