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
const { Network, Alchemy, Utils } = require("alchemy-sdk");
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
app.listen(3002, () => {
  // app.listen(9002, () => {
  console.log("Backend started at port 3002");
});
