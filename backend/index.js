const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const Web3 = require("web3");
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
// Setup
const { Network, Alchemy, Utils, Wallet } = require("alchemy-sdk");
// import { Network, Alchemy } from "a
const settings = {
  apiKey: "w4EirLUt-b5cyzm6xa1In_mz5yKIxIc7",
  network: Network.ETH_SEPOLIA,
};
let userAddress = "";

let contractAddress = "0x706a71B837D9c8B1dae73a55aF1d63726dD7B8A1";

const alchemy = new Alchemy(settings);

// const latestBlock = alchemy.core.getBlockNumber();

// alchemy.core
//   .getTokenBalances("0xf71A2627063a876460AEc4C342d72fD7D29910D6")
//   .then(console.log);

// const nfts = alchemy.nft.getNftsForOwner(
//   "0xf71A2627063a876460AEc4C342d72fD7D29910D6"
// );

// alchemy.ws.on(
//   {
//     method: "alchemy_pendingTransactions",
//     fromAddress: "0xf71A2627063a876460AEc4C342d72fD7D29910D6",
//   },
//   (res) => console.log(res)
// );

// const contractAddress = "0x4284890d4AcD0bcb017eCE481B96fD4Cb457CAc8";
// const tokenSymbol = "DAI";
// const accountAddress = "0xb7c0f8cb79f3a6099a453eb000964ad5510a1e8b";

// async function getTokenBalance() {
//   const contract = await alchemy.loadContract(contractAddress);
//   const balance = await contract.methods.balanceOf(accountAddress).call();
//   const decimals = await contract.methods.decimals().call();
//   const formattedBalance = balance / 10 ** decimals;
//   console.log(`Token balance of ${accountAddress} is ${formattedBalance} ${tokenSymbol}`);
// }

// getTokenBalance();

app.get("/", async (request, response) => {
  response.json("Server running");
});
app.post("/balance", async (request, response) => {
  userAddress = request.body.address;
  //   let balanceJSON = await alchemy.core.getTokenBalances(userAddress, [
  //     contractAddress,
  //   ]);
  //   response.status(200).send({ message: balanceJSON });

  let balance = await alchemy.core.getBalance(userAddress, "latest");
  balance = Utils.formatEther(balance);
  //   console.log(`Balance of ${address}: ${balance} ETH`);
  response.status(200).send({ message: balance });
});

// const main = async () => {
//   //Initialize variables for the parameters
//   let userAddress = "0x301daF80D468510939d4dEd583b323dC29759186";
//   let contractAddress = "0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0";

//   //Call the method to return the token balances for this address
//   let response = await alchemy.core.getTokenBalances(userAddress, [
//     contractAddress,
//   ]);

//   //Logging the response to the console
//   console.log(response);
// };

// main();
//
app.post("/transfer", async (request, response) => {
  const PRIVATE_KEY =
    "056cb6b3a8f2cc317afd6d425ca8cde2ca867c32f1b372227b4f538101f5bce9";
  // Creating a wallet instance to send the transaction
  const wallet = new Wallet(PRIVATE_KEY, alchemy);

  // Replace with the address you want to send the tokens to
  const toAddress = "0x1c04b77e5e6803FE956EE92bf7A335B4084406dB";

  // USDC contract address on Goerli testnet
  const usdcContractAddress = contractAddress;

  // Using `getFeeData` method of Alchemy SDK to get the fee data (maxFeePerGas & maxPriorityFeePerGas) that will be used in the transaction object
  const feeData = await alchemy.core.getFeeData();

  // ABI for the transfer function of ERC20 token
  // Every ERC20 contract has this function and we are going to use it to transfer the tokens
  const abi = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_initialSupply",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "_owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_value",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "success",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_value",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "success",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "_from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_from",
          type: "address",
        },
        {
          internalType: "address",
          name: "_to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_value",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "success",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "standard",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  // Amount of tokens to send: Here we will send 2 USDC tokens
  const amountToSend = 2;

  // Decimals for USDC token: 6
  const decimals = 1;

  // Convert the amount to send to decimals (6 decimals for USDC)
  const amountToSendInDecimals = amountToSend * 10 ** decimals;

  // Create the data for the transaction -> data that tells the transaction what to do (which function of the contract to call, what parameters to pass etc.)
  // Create an interface object from the ABI to encode the data
  const iface = new Utils.Interface(abi);
  // Encoding the data -> Call transfer function and pass the amount to send and the address to send the tokens to
  const data = iface.encodeFunctionData("transfer", [
    toAddress,
    Utils.parseUnits(amountToSendInDecimals.toString(), "wei"),
  ]);

  // Make the transaction object to send the transaction
  const transaction = {
    to: usdcContractAddress, // The transaction will be sent to the USDC contract address
    nonce: await alchemy.core.getTransactionCount(wallet.getAddress()), // Get the nonce of the wallet
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas, // This is the fee that the miner will get
    maxFeePerGas: feeData.maxFeePerGas, // This is the maximum fee that you are willing to pay
    type: 2, // EIP-1559 transaction type
    chainId: 11155111, // Corresponds to ETH_GOERLI
    data: data, // encoded data for the transaction
    gasLimit: Utils.parseUnits("250000", "wei"), // gas limit for the transaction (250000 gas) -> For sending ERC20 tokens, the gas limit is usually around 200,000-250,000 gas
  };

  // Send the transaction and log it.
  const sentTx = await wallet.sendTransaction(transaction);
  console.log(sentTx);
  response.status(200).send({ message: "jji" });
});

// const PRIVATE_KEY =
//   "056cb6b3a8f2cc317afd6d425ca8cde2ca867c32f1b372227b4f538101f5bce9";
// let wallet = new Wallet(PRIVATE_KEY);
// async function main() {
//   //   const nonce = await alchemy.core.getTransactionCount(
//   //     wallet.address,
//   //     "latest"
//   //   );

//   //   let transaction = {
//   //     to: "0x1c04b77e5e6803FE956EE92bf7A335B4084406dB",
//   //     value: Utils.parseEther("0.001"),
//   //     gasLimit: "21000",
//   //     maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
//   //     maxFeePerGas: Utils.parseUnits("20", "gwei"),
//   //     nonce: nonce,
//   //     type: 2,
//   //     chainId: 5,
//   //   };

//   //   let rawTransaction = await wallet.signTransaction(transaction);
//   //   let tx = await alchemy.core.sendTransaction(rawTransaction);
//   //   console.log("Sent transaction", tx);
//   const transaction = {
//     to: "0x1c04b77e5e6803FE956EE92bf7A335B4084406dB",
//     value: Utils.parseEther("0.001"),
//     gasLimit: "21000",
//     maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
//     maxFeePerGas: Utils.parseUnits("20", "gwei"),
//     nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
//     type: 2,
//     chainId: 5, // Corresponds to ETH_GOERLI
//   };

//   const rawTransaction = await wallet.signTransaction(transaction);
//   const response = await alchemy.transact.sendTransaction(rawTransaction);

//   //Logging the response to the console
//   console.log(response);
// }

// main();

app.listen(3002, () => {
  // app.listen(9002, () => {
  console.log("Backend started at port 3002");
});
