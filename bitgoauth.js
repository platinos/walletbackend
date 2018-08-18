var BitGo = require('bitgo');
const token = 'v2x077634d02fa892b425ad83d4ea1e78ce99a63136b2ee317dbe26821cdcbc46cb'
var bitgo = new BitGo.BitGo({ accessToken:token}); // defaults to testnet. add env: 'prod' if you want to go against mainnet
let coin = bitgo.coin('tbtc');
bitgo.unlock({otp:'0000000'}).then(function(unlockRes){
console.log(unlockRes);
}); 
module.exports=bitgo;

