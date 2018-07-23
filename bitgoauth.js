var BitGo = require('bitgo');
const token =  'v2x01cb852266aff3350a36660b2e3edd0d81d0848f37fd2eb4ff99e5792412ee52'
var bitgo = new BitGo.BitGo({ accessToken:token}); // defaults to testnet. add env: 'prod' if you want to go against mainnet
let coin = bitgo.coin('tbtc');
module.exports=bitgo;

