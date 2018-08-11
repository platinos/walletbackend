var BitGo = require('bitgo');
const token = 'v2x160802f7786dfa3ddbfbff32c0e3e4cab39b4df538f8a074298ee08624038047'
var bitgo = new BitGo.BitGo({ accessToken:token}); // defaults to testnet. add env: 'prod' if you want to go against mainnet
let coin = bitgo.coin('tbtc');
bitgo.unlock({otp:'0000000'}).then(function(unlockRes){
console.log(unlockRes);

}); 
module.exports=bitgo;

