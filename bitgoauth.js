var BitGo = require('bitgo');
const token = 'v2xf00ba76308887238dba55f554be48327c5eb1c6715700936b2e1c2395a0746e0'
var bitgo = new BitGo.BitGo({ accessToken:token}); // defaults to testnet. add env: 'prod' if you want to go against mainnet
let coin = bitgo.coin('tbtc');
module.exports=bitgo;

