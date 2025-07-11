import { ethers } from "hardhat";

// 0x427c6F7437f5cbF0685f9843A745019556271960

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
