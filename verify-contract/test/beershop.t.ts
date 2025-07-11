import { BeerShop } from "../typechain-types";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";

import proof from "../../circuit/target/proof_fields.json";
import pp from "../../circuit/target/public_inputs_fields.json";
import { acvm } from "@noir-lang/noir_js";
import { generateProof } from "../util/generateProof";

const SHA256_INIT_STATE = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
  0x1f83d9ab, 0x5be0cd19,
];

describe("BeerShop contract", () => {
  let beerShop: BeerShop;
  let owner: SignerWithAddress;
  let users: SignerWithAddress[];

  beforeEach(async () => {
    const factory = await ethers.getContractFactory("BeerShop");
    beerShop = await factory.deploy();
    await beerShop.waitForDeployment();

    [owner, ...users] = await ethers.getSigners();
  });

  it.skip("Should be able to buy beer with a valid proof(generated with cli)", async () => {
    const price = await beerShop.beerPrice();
    const proofData = ethers.concat([...proof]);
    const commitment = pp.slice(0, pp.length - 1);

    const tx = await beerShop.connect(users[0]).buyBeer(proofData, commitment, {
      value: price,
    });
    await tx.wait();

    const balance = await beerShop.balanceOf(users[0].address);
    expect(balance).to.equal(ethers.parseEther("1"));
  });

  it("Should be able to buy beer with a valid proof(generated with noirJs)", async () => {
    const age = 21;
    const minAge = await beerShop.minAge();

    const preimage = new Uint32Array(16).fill(0);
    preimage[0] = age;
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
      age: age,
      nonce: [...nonceArray],
      commitment: [...commitment],
      min_age: Number(minAge),
    });
    expect(await verify).to.be.true;

    const commitmentPP = publicInputs.slice(0, publicInputs.length - 1);
    const tx = await beerShop.connect(users[0]).buyBeer(proof, commitmentPP, {
      value: await beerShop.beerPrice(),
    });
    await tx.wait();

    const balance = await beerShop.balanceOf(users[0].address);
    expect(balance).to.equal(ethers.parseEther("1"));
  });

  it("Should revert if the min_age is not unproper", async () => {
    const age = 14;
    const minAge = 11;

    const preimage = new Uint32Array(16).fill(0);
    preimage[0] = age;
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
      age: age,
      nonce: [...nonceArray],
      commitment: [...commitment],
      min_age: Number(minAge),
    });
    expect(await verify).to.be.true;

    const commitmentPP = publicInputs.slice(0, publicInputs.length - 1);
    await expect(
      beerShop.connect(users[0]).buyBeer(proof, commitmentPP, {
        value: await beerShop.beerPrice(),
      })
    ).to.be.revertedWith("Invalid proof");
  });
});
