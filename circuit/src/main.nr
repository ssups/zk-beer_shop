global SHA256_INIT_STATE: [u32; 8] = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
];

fn main(age: u32, nonce: [u32; 8], commitment: pub [u32; 8], min_age: pub u32) {
    let mut preimage: [u32; 16] = [0; 16];
    preimage[0] = age;
    for i in 1..9 {
        preimage[i] = nonce[i - 1];
    }
    let expected_commitment = (std::hash::sha256_compression(preimage, SHA256_INIT_STATE));
    assert(
        expected_commitment == commitment,
        f"commitment mismatch, \nexpected: {expected_commitment} \ngot: {commitment}",
    );

    assert(age >= min_age, f"age {age} is less than minimum required age {min_age}");
}
