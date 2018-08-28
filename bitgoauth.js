var BitGo = require('bitgo');

const token = 'v2x8970896c9999611cb0057f0326ee5aa95a3a49e6eefa17fdbfaaade95c3be4ae'
var bitgo = new BitGo.BitGo({ accessToken: token, env: 'prod'}); // defaults to testnet. add env: 'prod' if you want to go against mainnet
let coin = bitgo.coin('btc');
// bitgo.unlock({otp:'0000000'}).then(function(unlockRes){
// console.log(unlockRes);
// }); 
module.exports=bitgo;
