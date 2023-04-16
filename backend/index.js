const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const Web3 = require("web3");
const dotenv = require("dotenv");

dotenv.config();
const { API_KEY, PRIVATE_KEY, abi, CONTRACT_ADDRESS } = process.env;
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
// // Setup
// const { Network, Alchemy, Utils, Wallet } = require("alchemy-sdk");
// // import { Network, Alchemy } from "a
// const settings = {
//   apiKey: "w4EirLUt-b5cyzm6xa1In_mz5yKIxIc7",
//   network: Network.ETH_SEPOLIA,
// };
// let userAddress = "";

// let contractAddress = "0x706a71B837D9c8B1dae73a55aF1d63726dD7B8A1";

// const alchemy = new Alchemy(settings);

// // const latestBlock = alchemy.core.getBlockNumber();

// // alchemy.core
// //   .getTokenBalances("0xf71A2627063a876460AEc4C342d72fD7D29910D6")
// //   .then(console.log);

// // const nfts = alchemy.nft.getNftsForOwner(
// //   "0xf71A2627063a876460AEc4C342d72fD7D29910D6"
// // );

// // alchemy.ws.on(
// //   {
// //     method: "alchemy_pendingTransactions",
// //     fromAddress: "0xf71A2627063a876460AEc4C342d72fD7D29910D6",
// //   },
// //   (res) => console.log(res)
// // );

// // const contractAddress = "0x4284890d4AcD0bcb017eCE481B96fD4Cb457CAc8";
// // const tokenSymbol = "DAI";
// // const accountAddress = "0xb7c0f8cb79f3a6099a453eb000964ad5510a1e8b";

// // async function getTokenBalance() {
// //   const contract = await alchemy.loadContract(contractAddress);
// //   const balance = await contract.methods.balanceOf(accountAddress).call();
// //   const decimals = await contract.methods.decimals().call();
// //   const formattedBalance = balance / 10 ** decimals;
// //   console.log(`Token balance of ${accountAddress} is ${formattedBalance} ${tokenSymbol}`);
// // }

// // getTokenBalance();

// app.get("/", async (request, response) => {
//   response.json("Server running");
// });
// app.post("/balance", async (request, response) => {
//   const ownerAddress = request.body.address;

//   //The below token contract address corresponds to USDT
//   const tokenContractAddresses = CONTRACT_ADDRESS;

//   const data = await alchemy.core.getTokenBalances(
//     ownerAddress,
//     tokenContractAddresses
//   );

//   console.log("Token balance for Address");
//   console.log(data);
//   response.status(200).send({ message: data });
// });

// // const main = async () => {
// //   //Initialize variables for the parameters
// //   let userAddress = "0x301daF80D468510939d4dEd583b323dC29759186";
// //   let contractAddress = "0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0";

// //   //Call the method to return the token balances for this address
// //   let response = await alchemy.core.getTokenBalances(userAddress, [
// //     contractAddress,
// //   ]);

// //   //Logging the response to the console
// //   console.log(response);
// // };

// // main();
// //

// app.post('/create_wallet', async (request, response) => {

//     const web3 = createAlchemyWeb3(
//         "https://eth-mainnet.alchemyapi.io/v2/<api-key>",
//       );

//     const accounts = web3.eth.getAccounts();

//     const acc = web3.eth.accounts.create();

//     console.log(acc)
// });

// app.post("/transfer", async (request, response) => {
//   const PRIVATE_KEY =
//     "056cb6b3a8f2cc317afd6d425ca8cde2ca867c32f1b372227b4f538101f5bce9";
//   // Creating a wallet instance to send the transaction
//   const wallet = new Wallet(PRIVATE_KEY, alchemy);

//   // Replace with the address you want to send the tokens to
//   const toAddress = "0x1c04b77e5e6803FE956EE92bf7A335B4084406dB";

//   // USDC contract address on Goerli testnet
//   const usdcContractAddress = contractAddress;

//   // Using `getFeeData` method of Alchemy SDK to get the fee data (maxFeePerGas & maxPriorityFeePerGas) that will be used in the transaction object
//   const feeData = await alchemy.core.getFeeData();

//   // ABI for the transfer function of ERC20 token
//   // Every ERC20 contract has this function and we are going to use it to transfer the tokens

//   // Amount of tokens to send: Here we will send 2 USDC tokens
//   const amountToSend = 2;

//   // Decimals for USDC token: 6
//   const decimals = 1;

//   // Convert the amount to send to decimals (6 decimals for USDC)
//   const amountToSendInDecimals = amountToSend * 10 ** decimals;

//   // Create the data for the transaction -> data that tells the transaction what to do (which function of the contract to call, what parameters to pass etc.)
//   // Create an interface object from the ABI to encode the data
//   const iface = new Utils.Interface(abi);
//   // Encoding the data -> Call transfer function and pass the amount to send and the address to send the tokens to
//   const data = iface.encodeFunctionData("transfer", [
//     toAddress,
//     Utils.parseUnits(amountToSendInDecimals.toString(), "wei"),
//   ]);

//   // Make the transaction object to send the transaction
//   const transaction = {
//     to: usdcContractAddress, // The transaction will be sent to the USDC contract address
//     nonce: await alchemy.core.getTransactionCount(wallet.getAddress()), // Get the nonce of the wallet
//     maxPriorityFeePerGas: feeData.maxPriorityFeePerGas, // This is the fee that the miner will get
//     maxFeePerGas: feeData.maxFeePerGas, // This is the maximum fee that you are willing to pay
//     type: 2, // EIP-1559 transaction type
//     chainId: 11155111, // Corresponds to ETH_GOERLI
//     data: data, // encoded data for the transaction
//     gasLimit: Utils.parseUnits("250000", "wei"), // gas limit for the transaction (250000 gas) -> For sending ERC20 tokens, the gas limit is usually around 200,000-250,000 gas
//   };

//   // Send the transaction and log it.
//   const sentTx = await wallet.sendTransaction(transaction);
//   console.log(sentTx);
//   response.status(200).send({ message: "jji" });
// });

// // const PRIVATE_KEY =
// //   "056cb6b3a8f2cc317afd6d425ca8cde2ca867c32f1b372227b4f538101f5bce9";
// // let wallet = new Wallet(PRIVATE_KEY);
// // async function main() {
// //   //   const nonce = await alchemy.core.getTransactionCount(
// //   //     wallet.address,
// //   //     "latest"
// //   //   );

// //   //   let transaction = {
// //   //     to: "0x1c04b77e5e6803FE956EE92bf7A335B4084406dB",
// //   //     value: Utils.parseEther("0.001"),
// //   //     gasLimit: "21000",
// //   //     maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
// //   //     maxFeePerGas: Utils.parseUnits("20", "gwei"),
// //   //     nonce: nonce,
// //   //     type: 2,
// //   //     chainId: 5,
// //   //   };

// //   //   let rawTransaction = await wallet.signTransaction(transaction);
// //   //   let tx = await alchemy.core.sendTransaction(rawTransaction);
// //   //   console.log("Sent transaction", tx);
// //   const transaction = {
// //     to: "0x1c04b77e5e6803FE956EE92bf7A335B4084406dB",
// //     value: Utils.parseEther("0.001"),
// //     gasLimit: "21000",
// //     maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
// //     maxFeePerGas: Utils.parseUnits("20", "gwei"),
// //     nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
// //     type: 2,
// //     chainId: 5, // Corresponds to ETH_GOERLI
// //   };

// //   const rawTransaction = await wallet.signTransaction(transaction);
// //   const response = await alchemy.transact.sendTransaction(rawTransaction);

// //   //Logging the response to the console
// //   console.log(response);
// // }

// // main();

// app.listen(3002, () => {
//   // app.listen(9002, () => {
//   console.log("Backend started at port 3002");
// });

const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
} = require("@hashgraph/sdk");
require("dotenv").config();

//Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;

// If we weren't able to grab it, we should throw a new error
if (myAccountId == null || myPrivateKey == null) {
  throw new Error(
    "Environment variables myAccountId and myPrivateKey must be present"
  );
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!

//Create new keys
// const newAccountPrivateKey = PrivateKey.generateED25519();
// const newAccountPublicKey = newAccountPrivateKey.publicKey;

// console.log(newAccountPrivateKey, newAccountPublicKey);

// //Create a new account with 1,000 tinybar starting balance
// async function createAccount() {
//   const newAccount = await new AccountCreateTransaction()
//     .setKey(newAccountPublicKey)
//     .setInitialBalance(Hbar.fromTinybars(1000))
//     .execute(client);
//   return newAccount;
// }
// const newAccount = createAccount();
// // // Get the new account ID
// async function getReceipt() {
//   const getReceipt = (await newAccount).getReceipt(client);
//   const newAccountId = getReceipt.accountId;
//   return newAccountId, getReceipt;
// }
// const { newAccountId, receipt } = getReceipt();
// console.log("The new account ID is: " + newAccountId + receipt);

// //Verify the account balance

// async function getBalance() {
//   const accountBalance = await new AccountBalanceQuery()
//     .setAccountId(myAccountId)
//     .execute(client);

//   console.log(
//     "The new account balance is: " +
//       accountBalance.hbars.toTinybars() +
//       " tinybar."
//   );
// }
// getBalance();

app.post("/balance", async (request, response) => {
  const client = Client.forTestnet();

  const ownerAddress = request.body.address;
  const privateKey = request.body.pvtkey;
  client.setOperator(myAccountId, privateKey);
  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(ownerAddress)
    .execute(client);

  let log = accountBalance.hbars._valueInTinybar;
  response.status(200).send({ message: log });
});

app.listen(3002, () => {
  // app.listen(9002, () => {
  console.log("Backend started at port 3002");
});
