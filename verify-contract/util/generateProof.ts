import { ErrorWithPayload, InputMap, Noir, acvm } from "@noir-lang/noir_js";
import { UltraHonkBackend } from "@aztec/bb.js";
import circuit from "../../circuit/target/beer_shop.json";

export async function generateProof(inputs: InputMap) {
  const noir = new Noir(circuit as any);
  const honk = new UltraHonkBackend(circuit.bytecode, { threads: 5 });
  let witness = new Uint8Array();
  try {
    const circuitRet = await noir.execute(inputs);
    witness = circuitRet.witness;
  } catch (error: any) {
    throw new Error((error as ErrorWithPayload).message);
  }

  const proofData = await honk.generateProof(witness, {
    keccak: true,
  });

  return {
    ...proofData,
    witness,
    verify: honk.verifyProof(proofData, { keccak: true }),
  };
}
