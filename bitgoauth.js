var BitGo = require('bitgo');

const token = '' //Bitgo token
var bitgo = new BitGo.BitGo({ accessToken: token, env: 'prod'}); // defaults to testnet. add env: 'prod' if you want to go against mainnet
let coin = bitgo.coin('btc');
// bitgo.unlock({otp:'0000000'}).then(function(unlockRes){
// console.log(unlockRes);
// }); 
module.exports=bitgo;
