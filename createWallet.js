
const bitgo = require('./bitgoauth')
let coin = 'tbtc'
const label='my_wallet_one'
const passphrase ='sheq_wallet_one'
 
     
          const walletOptions = {
              label,
              passphrase
            };
           
            bitgo.coin('tltc').wallets()
            .generateWallet({ label: 'My Test Wallet', passphrase: 'secretpassphrase1a5df8380e0e30' })
            .then(function(wallet) {
              // print the new wallet
              console.dir(wallet);
              consle.log(wallet.userKeychain);
            });
            
