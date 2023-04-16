const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const Web3 = require("web3");
const dotenv = require("dotenv");

dotenv.config();
const { API_KEY, PRIVATE_KEY, abi, CONTRACT_ADDRESS } = process.env;
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

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;

if (myAccountId == null || myPrivateKey == null) {
  throw new Error(
    "Environment variables myAccountId and myPrivateKey must be present"
  );
}

app.post("/createAccount", async (request, response) => {
  try {
    const newAccountPrivateKey = PrivateKey.generateECDSA();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);
    const newAccount = await new AccountCreateTransaction()
      .setKey(newAccountPublicKey)
      .setInitialBalance(Hbar.fromTinybars(0))
      .execute(client);
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    console.log("The new account ID is: " + newAccountId);
    response.status(200).json({
      message: {
        accountId: newAccountId.toString(),
        publicKey: newAccountPublicKey.toString(),
        privateKey: myPrivateKey.toString(),
      },
    });
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "Server Error" });
  }
});

app.post("/balance", async (request, response) => {
  try {
    const client = Client.forTestnet();

    const ownerAddress = request.body.address;
    const privateKey = request.body.pvtkey;
    client.setOperator(myAccountId, privateKey);
    const accountBalance = await new AccountBalanceQuery()
      .setAccountId(ownerAddress)
      .execute(client);

    let balance = accountBalance.hbars._valueInTinybar;
    response.status(200).send({ message: balance });
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello from backend");
});
// the amount of hbars to decrease
app.post("/updateMain", async (request, response) => {
  try {
    const toAccountId = request.body.toAccountId;
    const fromAccountId = request.body.fromAccountId;
    const fromPrivateKey = request.body.fromPrivateKey;
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

app.listen(process.env.PORT || 3002, () => {
  console.log("Backend started at port 3002");
});
