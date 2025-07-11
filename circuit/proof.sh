# !/bin/bash

set -e

rm -rf ./target/witness.gz
rm -rf ./target/public_inputs
rm -rf ./target/proof
rm -rf ./target/proof_fields.json
rm -rf ./target/public_inputs_fields.json

echo "Generating witness..."
nargo execute witness

echo "Generating proof..."
bb prove -b ./target/beer_shop.json -w ./target/witness.gz -o target --oracle_hash keccak --output_format bytes_and_fields