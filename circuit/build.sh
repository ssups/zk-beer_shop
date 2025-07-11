# !/bin/bash

set -e

rm -rf ./target/beer_shop.json
rm -rf ./target/vk

echo "Compiling circuit..."
if ! nargo compile; then
    echo "Compilation failed. Exiting..."
    exit 1
fi

echo "Generating vkey..."
bb write_vk -b ./target/beer_shop.json -o ./target --oracle_hash keccak


echo "Generating solidity verifier..."
bb write_solidity_verifier -k ./target/vk -o ../verify-contract/contracts/Verifier.sol

echo "Done"