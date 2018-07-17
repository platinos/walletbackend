var BitGo = require('bitgo');
const token =  'v2x0df1d25b47c8576cc9df96ee2fe65f682ece33a61cdc422bf609085d8e8ea48e'
var bitgo = new BitGo.BitGo({ accessToken:token}); // defaults to testnet. add env: 'prod' if you want to go against mainnet
let coin = bitgo.coin('tbtc');
module.exports=bitgo;

