import { acvm, Noir } from "@noir-lang/noir_js";
import { UltraHonkBackend } from "@aztec/bb.js";

const SHA256_INIT_STATE = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
  0x1f83d9ab, 0x5be0cd19,
];
const AGE = 21;

async function main() {
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
  console.log("Commitment:", commitment);

  console.log({
    age: AGE,
    nonce: nonceArray,
    commitment: commitment,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
