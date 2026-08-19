import { ethers } from "hardhat";

const ARC_USDC = "0x3600000000000000000000000000000000000000";

async function main() {
  const [deployer] = await ethers.getSigners();
  const treasury = process.env.TREASURY_ADDRESS || deployer.address;
  const feeBps = 500; // 5%

  console.log("Deploying with:", deployer.address);
  console.log("Treasury:", treasury);

  const Escrow = await ethers.getContractFactory("CreativeEscrow");
  const escrow = await Escrow.deploy(ARC_USDC, treasury, feeBps);
  await escrow.waitForDeployment();

  console.log("CreativeEscrow:", await escrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
