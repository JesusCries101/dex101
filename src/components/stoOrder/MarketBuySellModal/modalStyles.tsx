import styled from 'styled-components';
import { MdClose } from 'react-icons/md';


export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: cetner;
    height: 200vh;
    
`
export const SwapButton = styled.button`
    display: block;
    min-width: 250px;
    padding: 16px 32px;
    border-radius: 20px;
    border: none;
    font-size: 24px;
    margin: auto;
    margin-top: 30px;
    background: #4283fc;
    color: #fff;

    &:hover {
        background: #3B75E2;
        transition: 0.2s ease-in-out;
    }
`
export const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

export const ModalWrapper = styled.div`
  width: 800px;
  height: 800px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  display: grid;
  position: relative;
  z-index: 101;
  border-radius: 10px;
  margin-top: -20%;
`;

export const SwapperContainer = styled.div`
    border-radius: 24px;
    width: 80%;
    padding: 24px;
    background-color: #fff;
    border: 1px solid #eeeeee;
    text-align: center;
`

export const SwapperField = styled.div`
    border-radius: 20px;
    border: 1px solid rgb(247, 248, 250);
    background-color: rgb(255, 255, 255);
`

export const SwapperFieldTopRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    -webkit-box-align: center;
    align-items: center;
    color: rgb(0, 0, 0);
    font-size: 0.75rem;
    line-height: 1rem;
    padding: 0.75rem 1rem 0px;
`

export const SwapperFieldTopRowIn = styled.div`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    width: 100%;
    display: flex;
    padding: 0px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
`
export const SwapperFieldTopRowInItem = styled.div`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    font-weight: 500;
    font-size: 14px;
    color: rgb(86, 90, 105);
`

export const SwapperFieldBottomRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    -webkit-box-align: center;
    align-items: center;
    padding: 0.75rem 0.75rem 0.75rem 1rem;
`
export const SwapperBottomRowLeft = styled.input`
    color: rgb(0, 0, 0);
    width: 0px;
    position: relative;
    font-weight: 500;
    outline: none;
    border: none;
    flex: 1 1 auto;
    background-color: rgb(255, 255, 255);
    font-size: 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0px;
    appearance: textfield;
`

export const SwapperBottomRowMiddle = styled.button`
    height: 28px;
    background-color: #a0c1fd;
    border: 1px solid #a0c1fd;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    margin-right: 0.5rem;
    color: #4283fc;
`
export const SwapperBottomRowRight = styled.button`
    -webkit-box-align: center;
    align-items: center;
    height: 2.2rem;
    font-size: 20px;
    font-weight: 500;
    background-color: rgb(255, 255, 255);
    color: rgb(0, 0, 0);
    border-radius: 12px;
    box-shadow: none;
    outline: none;
    cursor: pointer;
    user-select: none;
    border: none;
    padding: 0px 0.5rem;
`

export const SwapperBottomRowRightSpan = styled.span`
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
`

export const SwapperBottomRowRightSpanImg = styled.img`
    width: 24px;
    height: 24px;
    box-shadow: rgb(0 0 0 / 8%) 0px 6px 10px;
    border-radius: 24px;
`

export const SwapperBottomRowRightSpanSymbol = styled.span`
    margin: 0px 0.25rem 0px 0.75rem;
    font-size: 20px;
`

export const SwapperPriceRow = styled.div`
    position: relative;
    box-sizing: border-box;
    margin: 10px 20px;
    min-width: 0px;
    width: 100%;
    padding: 0px;
    border-radius: 20px;
`

export const SwapperPriceRowGrid = styled.div`
    display: grid;
    grid-auto-rows: auto;
    row-gap: 8px;
`

export const SwapperPriceRowInFlex = styled.div`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    width: 94%;
    display: flex;
    padding: 0px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
`

export const SwapperPriceRowInItem = styled.div`
box-sizing: border-box;
margin: 0px;
min-width: 0px;
font-weight: 500;
font-size: 14px;
color: rgb(86, 90, 105);
`


export const ModalImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px 0 0 10px;
  background: #000;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
`;

export const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;