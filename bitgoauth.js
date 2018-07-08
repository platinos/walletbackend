var BitGo = require('bitgo');
var bitgo = new BitGo.BitGo({ accessToken: 'v2x6d7c330b06bfc32ab5425c67f4ea30719fb8fe40b82638b29d7e0d3bece3c13d' }); // defaults to testnet. add env: 'prod' if you want to go against mainnet
let coin = bitgo.coin('tbtc');
module.exports=bitgo;

