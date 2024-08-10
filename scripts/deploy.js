async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Assuming you are using the same contract and mock addresses as previously discussed.
  const OneInchSniperBot = await ethers.getContractFactory("OneInchSniperBot");
  const aggregatorRouterAddress = "0x1111111254EEB25477B68fb85Ed929f73A960582"; // 1inch Aggregation Router v4 on Mainnet (forked)
  const tokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // Example: DAI on Mainnet (forked)

  const sniperBot = await OneInchSniperBot.deploy(aggregatorRouterAddress, tokenAddress);
  await sniperBot.deployed();
  console.log("SniperBot deployed to:", sniperBot.address);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
