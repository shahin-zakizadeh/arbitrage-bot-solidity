const { ethers } = require("hardhat");
const axios = require("axios");
require('dotenv').config();

async function main() {
  const sniperBotAddress = "0x25Ce446a08597cb2a741Dfb079078c67C430832B"; // Replace with your deployed SniperBot address
  const sniperBotABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_aggregatorRouter",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "EtherWithdrawn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokensApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "fromToken",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "toToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountOutMin",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "TokensSwapped",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokensWithdrawn",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "aggregatorRouter",
      "outputs": [
        {
          "internalType": "contract IAggregationRouterV4",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approveRouter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "srcToken",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "dstToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "minReturnAmount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "snipe",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "token",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawEther",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "withdrawTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:9545");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const sniperBot = new ethers.Contract(sniperBotAddress, sniperBotABI, wallet);

  // Example: Approve tokens for the router
  const amountToApprove = ethers.utils.parseUnits('1000', 18);
  const approveTx = await sniperBot.approveRouter(amountToApprove);
  await approveTx.wait();
  console.log("Tokens approved for router");

  // Example: Perform a snipe
  const srcToken = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DAI Token Address
  const dstToken = "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // USDC Token Address
  const amountIn = ethers.utils.parseUnits('1', 18);
  const minReturnAmount = ethers.utils.parseUnits('0.9', 18);
  
  async function getSwapData() {
    const url = "https://api.1inch.dev/swap/v6.0/1/swap";
    const config = {
      headers: {
        "Authorization": "Bearer Esw0KeiDI85n97R2IHmr49J0gYjuiZ38"
      },
      params: {
        fromTokenAddress: srcToken,
        toTokenAddress: dstToken,
        amount: amountIn.toString(),
        fromAddress: wallet.address,
        slippage: 1,
        disableEstimate: true
      }
    };

    try {
      const response = await axios.get(url, config);
      console.log("API Response:", response.data); // Log the entire response

      if (response.data && response.data.tx && response.data.tx.data) {
        return response.data.tx.data;
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error fetching swap data:", error);
      throw error;
    }
  }

  const data = await getSwapData();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
  const snipeTx = await sniperBot.snipe(srcToken, dstToken, amountIn, minReturnAmount, data, deadline);
  await snipeTx.wait();
  console.log("Snipe performed");

  // Example: Withdraw tokens
  const tokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DAI Token Address
  const amountToWithdraw = ethers.utils.parseUnits('100', 18);
  const withdrawTx = await sniperBot.withdrawTokens(tokenAddress, amountToWithdraw);
  await withdrawTx.wait();
  console.log("Tokens withdrawn");

  // Example: Withdraw Ether
  const withdrawEtherTx = await sniperBot.withdrawEther();
  await withdrawEtherTx.wait();
  console.log("Ether withdrawn");
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});