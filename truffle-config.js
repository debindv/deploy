const HDwalletProvider = require('@truffle/hdwallet-provider');
var Web3 = require("web3");
var privateKey = '0x8f847e2154968add423a3455598c5dd9fd30a62bc62d79a736a87c2f520bd67a';
module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // for more about customizing your Truffle configuration!
    networks: {
    //   development: {
    //     host: "127.0.0.1",
    //     port: 8545,
    //     network_id: "*", // Match any network id
    //     gas: 6000000
    //   },
      rinkeby: {
        provider: () => new HDwalletProvider(
          privateKey,
          'https://ropsten.infura.io/v3/24b49cc800a04404ae669233b6931097'
        ),
      }

      // develop: {
      //   port: 7545
      //}
    },
    
  };

  