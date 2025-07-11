import { ethers } from "hardhat";

// 0x7995A26E8e335db0032Dc99e220AAa9B4D214A97

async function main() {
  const factory = await ethers.getContractFactory("BeerShop");
  const beerShop = await factory.deploy();
  await beerShop.waitForDeployment();
  console.log("BeerShop deployed to:", beerShop.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
