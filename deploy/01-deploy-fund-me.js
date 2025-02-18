// function deployFunc(hre) {
//   console.log("Deploying FundMe contract...");
// }

// module.exports.default = deployFunc;

const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    console.log("development network detected!");
    const EthUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = EthUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    console.log("ethUsdPriceFeed:", ethUsdPriceFeedAddress);
  }

  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, // put price feed address here
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    // Verify on Etherscan
    await verify(fundMe.address, args);
  }

  log("---------------------------------------");
};

module.exports.tags = ["all", "fundme"];
