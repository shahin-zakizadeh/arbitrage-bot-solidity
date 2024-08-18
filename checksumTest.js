const { ethers } = require("ethers");

// Original address (non-checksummed)
const address = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // Lowercase

// Manually convert it to checksummed address
const checksummedAddress = ethers.utils.getAddress(address);
console.log("Correct Checksummed Address:", checksummedAddress);
