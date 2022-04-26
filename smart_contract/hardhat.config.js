require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/1KlLOP8tL6zf_wim0ce4x8j0XkKFRWA2',     // from alchemy dashboard - Crypto Ropsten
      accounts: ['d433c1a48e5984f43de6243271b2409d1f378fcd6922faf41352358d29fd5d16'],   // from Metamask account - Account 1
    },
  },
};