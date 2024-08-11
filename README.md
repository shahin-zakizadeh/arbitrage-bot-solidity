This project is an advanced Ethereum-based SniperBot that interacts with the 1inch Aggregator. The SniperBot automatically identifies and executes optimal token swaps on decentralized exchanges (DEXs) using the 1inch API. The bot is designed to maximize profit by swiftly executing trades when specific market conditions are met.

# Features

Automated Trading: The bot automatically executes token swaps based on predefined criteria, ensuring fast and efficient trades.
1inch Aggregator Integration: Utilizes the 1inch Aggregator API for routing and executing trades, leveraging its deep liquidity and gas optimization.
Token Approval: Automatically handles token approvals, ensuring the bot is ready to execute trades without manual intervention.
Flexible Configuration: Easily configurable to support various ERC20 tokens and adjust slippage tolerance.
Safety Mechanisms: Includes functions for withdrawing tokens and Ether to ensure funds are securely managed.

# Project Structure
Smart Contracts: The core logic is implemented in Solidity, with contracts deployed on the Ethereum blockchain.
Interaction Script: A Node.js script using Hardhat, Ethers.js, and Axios to interact with the deployed smart contracts and the 1inch API.
Deployment: The bot can be deployed on both testnets and the Ethereum mainnet, with configurations provided for different environments.

# Usage
Setup: Clone the repository, install dependencies, and configure environment variables for your private key and Infura project ID.
Deployment: Deploy the smart contract using Hardhat.
Interaction: Run the interaction script to approve tokens, fetch swap data, and execute trades.
Monitoring: Monitor the bot's activity and withdraw tokens or Ether as needed.
