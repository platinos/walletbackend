var BitGo = require('bitgo');

const token = 'v2xfe1fd5b53ec7aebb87517c49661cd1b3a66b649ddee56292400479c367c79d24'
var bitgo = new BitGo.BitGo({ accessToken:token}); // defaults to testnet. add env: 'prod' if you want to go against mainnet
let coin = bitgo.coin('tbtc');
bitgo.unlock({otp:'0000000'}).then(function(unlockRes){
console.log(unlockRes);
}); 
module.exports=bitgo;
