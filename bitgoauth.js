var BitGo = require('bitgo');
const token =  'v2x850744f346dc25a04a4057f2fcefd2905116e4825f43c34351b4fb01ff88ff24'
var bitgo = new BitGo.BitGo({ accessToken:token}); // defaults to testnet. add env: 'prod' if you want to go against mainnet
let coin = bitgo.coin('tbtc');
module.exports=bitgo;

