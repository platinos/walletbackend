var BitGo = require('bitgo');

const token = 'v2x93895f66d34eaa9daebf37ec07a039d84f98828276602727707d40401097ea33'
var bitgo = new BitGo.BitGo({ accessToken: token, env: 'prod'}); // defaults to testnet. add env: 'prod' if you want to go against mainnet
let coin = bitgo.coin('tbtc');
bitgo.unlock({otp:'0000000'}).then(function(unlockRes){
console.log(unlockRes);
}); 
module.exports=bitgo;
