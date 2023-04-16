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

const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  TransferTransaction,
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

const newAccountPrivateKey = PrivateKey.generateED25519();
const newAccountPublicKey = newAccountPrivateKey.publicKey;

//Create a new account with 1,000 tinybar starting balance
async function gg() {
  const client = Client.forTestnet();

  client.setOperator(myAccountId, myPrivateKey);
  const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(0))
    .execute(client);

  // Get the new account ID
  const getReceipt = await newAccount.getReceipt(client);
  const newAccountId = getReceipt.accountId;

  console.log("The new account ID is: " + newAccountId);

  //Verify the account balance
  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);

  console.log(
    "The new account balance is: " +
      accountBalance.hbars.toTinybars() +
      " tinybar."
  );
}
gg();
app.post("/balance", async (request, response) => {
  try {
    const client = Client.forTestnet();

    const ownerAddress = request.body.address;
    const privateKey = request.body.pvtkey;
    client.setOperator(myAccountId, privateKey);
    const accountBalance = await new AccountBalanceQuery()
      .setAccountId(ownerAddress)
      .execute(client);

    let log = accountBalance.hbars._valueInTinybar;
    response.status(200).send({ message: log });
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "Server Error" });
  }
});

async function decreaseHbars() {
  const amount = 100;
  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);
  const newAccountId = "0.0.4151996";
  const sendHbar = await new TransferTransaction()
    .addHbarTransfer(myAccountId, Hbar.fromTinybars(-amount)) //Sending account
    .addHbarTransfer(newAccountId, Hbar.fromTinybars(amount)) //Receiving account
    .execute(client);
}
// the amount of hbars to decrease
app.post("/updateMain", async (request, response) => {
  try {
    const toAccountId = request.body.toAccountId;
    const fromAccountId = request.body.fromAccountId;
    const fromPrivateKey = request.body.fromPrivateKey;
    // console.log(fromAccountId, fromPrivateKey);
    const amount = request.body.amount;
    const client = Client.forTestnet();
    client.setOperator(fromAccountId, fromPrivateKey);

    const sendHbar = await new TransferTransaction()
      .addHbarTransfer(fromAccountId, Hbar.fromTinybars(-amount)) //Sending account
      .addHbarTransfer(toAccountId, Hbar.fromTinybars(amount)) //Receiving account
      .execute(client);
    response.status(200).send({ message: " transaction success" });
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "Server Error" });
  }
});

app.post("/buyHBAR", async (request, response) => {
  try {
    // console.log(fromAccountId, fromPrivateKey);
    const toAccountId = request.body.toAccountId;
    const amount = request.body.amount;
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    const sendHbar = await new TransferTransaction()
      .addHbarTransfer(myAccountId, Hbar.fromTinybars(-amount)) //Sending account
      .addHbarTransfer(toAccountId, Hbar.fromTinybars(amount)) //Receiving account
      .execute(client);
    response.status(200).send({ message: " transaction success" });
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "Server Error" });
  }
});
// decreaseHbars();

app.listen(3002, () => {
  // app.listen(9002, () => {
  console.log("Backend started at port 3002");
});
