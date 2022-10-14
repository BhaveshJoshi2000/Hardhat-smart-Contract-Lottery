const { ethers, network } = require("hardhat");
const fs = require("fs");

const FRONT_END_ADDRESSES_FILE =
  "../Raffle-Frontend/constants/contractAddresses.json";
const FRONT_END_ABI_FILE = "../Raffle-Frontend/constants/abi.json";
module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log("updating frontend...");
    await updateAbi();
    await updateContractAddresses();
  }
};

async function updateAbi() {
  const raffle = await ethers.getContract("Raffle");
  fs.writeFileSync(
    FRONT_END_ABI_FILE,
    raffle.interface.format(ethers.utils.FormatTypes.json)
  );
}
async function updateContractAddresses() {
  const raffle = await ethers.getContract("Raffle");
  console.log(raffle);
  const chainId = network.config.chainId.toString();
  console.log(chainId);
  const currentAddresses = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8")
  );
  console.log(currentAddresses);
  if (chainId in currentAddresses) {
    if (!currentAddresses[chainId].includes(raffle.address)) {
      console.log("updating contract address");
      currentAddresses[chainId].push(raffle.address);
    }
  } else {
    console.log("adding new address...");
    currentAddresses[chainId] = [raffle.address];
  }

  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses));
}

module.exports.tags = ["all", "frontend"];
