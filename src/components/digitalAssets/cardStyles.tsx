import styled from 'styled-components'

export const AssetCard = styled.button`
    border-radius: 24px;
    width: 100%;
    padding: 24px;
    background-color: #fff;
    border: 1px solid #A0C1FD;
    text-align: left;

    &:hover {
        border: 1px solid #4283fc;
    }
`
export const AssetCard__head = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
`

export const AssetCard__img = styled.div`
    display: block;
    height: 48px;
    width: 48px;
    border-radius: 48px;
`

export const AssetCard__label = styled.div`
    background-color: #A0C1FD;
    color: #4283fc;
    font-size: 12px;
    line-height: 18px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    padding: 4px 8px;
    border-radius: 50px;
    margin-left: auto;
`

export const AssetCard__coin = styled.div``

export const AssetCard__coin__name = styled.h2`
    font-size: 28px;
    line-height: 34px;
    font-weight: 600;
    margin: 0;
    margin-bottom: 16px;
`

export const AssetCard__title = styled.p`
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    margin: 0;
    margin-bottom: 4px;
`

export const AssetCard__ratio = styled.h2`
    font-size: 28px;
    line-height: 34px;
    font-weight: 400;
    text-transform: uppercase;
    margin: 0;
    margin-bottom: 16px;
`

export const AssetCard__footer = styled.div`
    display: grid;
    grid-template-columns: repeat(2,1fr);
    grid-gap: 16px;
`
export const AssetCard__title__small = styled.p`
    color: #212121;
    font-size: 12px;
    line-height: 18px;
    font-weight: 600;
    margin: 0;
    margin-bottom: 4px;
`
export const AssetCard__info = styled.h3`
    color: #4283fc;
    font-size: 22px;
    line-height: 28px;
    font-weight: 600;
    margin: 0;
`
