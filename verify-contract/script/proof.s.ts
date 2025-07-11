import { acvm } from "@noir-lang/noir_js";
import { generateProof } from "../util/generateProof";
import { ethers } from "hardhat";

const BEER_SHOP = "0x7995A26E8e335db0032Dc99e220AAa9B4D214A97";

const AGE = 21;
const SHA256_INIT_STATE = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
  0x1f83d9ab, 0x5be0cd19,
];

async function main() {
  const beerShop = await ethers.getContractAt("BeerShop", BEER_SHOP);

  const preimage = new Uint32Array(16).fill(0);
  preimage[0] = AGE;
  const nonceArray = new Uint32Array(8);
  for (let i = 0; i < 8; i++) {
    const nonceElement = Math.floor(Math.random() * 0xffffffff);
    nonceArray[i] = nonceElement;
    preimage[i + 1] = nonceElement;
  }
  const commitment = acvm.sha256_compression(
    preimage,
    new Uint32Array(SHA256_INIT_STATE)
  );

  const { proof, verify, publicInputs } = await generateProof({
    age: AGE,
    nonce: [...nonceArray],
    commitment: [...commitment],
    min_age: Number(await beerShop.minAge()),
  });
  const commitmentPP = publicInputs.slice(0, publicInputs.length - 1);

  console.log("proof: ", ethers.hexlify(proof));
  console.log("commitmentPP: ", commitmentPP);

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
