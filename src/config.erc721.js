let erc721Tokens = {
  mainnet: [
    {address: '0xd07dc4262bcdbf85190c01c996b4c06a461d2430', tokenID: '38225'},
    {address: '0x495f947276749ce646f68ac8c248420045cb7b5e', tokenID: '55575360221028374465659771733000318579577403829328624053715756076024584994817'},
    //{address: '0xce53b468d40a5208e7fcc8a4b589ebe0309ba030', tokenID: '175'},
    //{address: '0x495f947276749ce646f68ac8c248420045cb7b5e', tokenID: '55575360221028374465659771733000318579577403829328624053715756138696747778049'},
    {address: '0x495f947276749ce646f68ac8c248420045cb7b5e', tokenID: '4061275012750776197303071881557643107989821222626926439542223688294798983169'}
  ],
  rinkeby: [
    //{address: '0x5a1d45900261584135ad86a7c70f6b60bdf0ea41', tokenID: '1'},
    {address: '0x99c13b7c602a8272383407e1f34ca044e2ceea55', tokenID: '1'},
    {address: '0x7a00df57b7999e5846ba61b645c79ed28a4e75fd', tokenID: '4'},
    {address: '0xf73d9cb3f357891606c51ca8a89266b8a59d02b3', tokenID: '14'},
    {address: '0x22227cebbb38959940a4e5bf2e3968acd019689f', tokenID: '6000008'}, 
    {address: '0x663378bfc54ad95005358392d1e35bd1265e9d12', tokenID: '105576367156117131783521697443906301610038582350817799201628741183554981986308'},

  ]
};
let selectedErc721Tokens = erc721Tokens['rinkeby'];
let getTokenAddressByID = (
  (dict => (
    tokenID => dict[tokenID]
  ))(selectedErc721Tokens.reduce((acc, {address,tokenID}) => Object.assign(acc, {[tokenID]: address}), {}))
);
export {
  erc721Tokens,
  selectedErc721Tokens,
  getTokenAddressByID,
}