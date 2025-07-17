const { getNamedAccounts, ethers, network, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let fundMe;
      let deployer;
      let signer;
      const sendValue = ethers.parseEther("0.1");
      beforeEach(async function () {
        [deployer, signer] = await ethers.getSigners();
        fundMe = await ethers.getContractAt(
          "FundMe",
          (
            await deployments.get("FundMe")
          ).address,
          signer
        );
      });

      it("it allows people to fund and withdraw", async function () {
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();
        const endingBalance = await ethers.provider.getBalance(fundMe.target);
        assert(endingBalance.toString(), "0");
      });
    });
