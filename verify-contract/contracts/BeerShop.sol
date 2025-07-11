// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {HonkVerifier} from "./Verifier.sol";

contract BeerShop is ERC20 {
    address public owner;
    uint256 public beerPrice;
    uint256 public minAge;
    HonkVerifier public verifier;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() ERC20("BEER", "BEER") {
        owner = msg.sender;
        beerPrice = 0.000001 ether;
        minAge = 20;
        verifier = new HonkVerifier();
    }

    function buyBeer(bytes calldata proof, bytes32[8] calldata commitment) external payable {
        require(msg.value >= beerPrice, "Not enough money");

        bytes32[] memory pp = new bytes32[](9);
        pp[0] = commitment[0];
        pp[1] = commitment[1];
        pp[2] = commitment[2];
        pp[3] = commitment[3];
        pp[4] = commitment[4];
        pp[5] = commitment[5];
        pp[6] = commitment[6];
        pp[7] = commitment[7];
        pp[8] = bytes32(uint256(minAge));
        require(verifier.verify(proof, pp), "Invalid proof");

        _mint(msg.sender, 1e18);
    }

    function setBeerPrice(uint256 newPrice) external onlyOwner {
        beerPrice = newPrice;
    }

    function setMinAge(uint256 newMinAge) external onlyOwner {
        minAge = newMinAge;
    }
}
