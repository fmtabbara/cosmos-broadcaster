import { coins, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {
  GasPrice,
  makeMultisignedTx,
  SigningStargateClient,
} from "@cosmjs/stargate";
import { createNymMixnetClient } from "@nymproject/sdk";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { createAddress, createAndAppendLi } from "./UI";

export const nyxOptions = {
  httpUrl: "https://validator.nymtech.net/api",
  networkId: "nymnet",
  bech32prefix: "n",
  feeToken: "unym",
  fees: {
    upload: 2500000,
    init: 1000000,
    exec: 500000,
  },
  gasPrice: GasPrice.fromString("0.25unym"),
};
makeMultisignedTx;
async function main() {
  const { client: nymClient, events } = await createNymMixnetClient();
  let gatewayAddress;

  nymClient.start({
    nymApiUrl: nyxOptions.httpUrl,
    clientId: "nym-broadcaster",
  });

  await events.subscribeToConnected((e) => {
    if (e.args.address) {
      gatewayAddress = e.args.address;
      createAndAppendLi("Connected to Mixnet");
      createAndAppendLi("Mixnet address aquired");
      createAddress(`Address is : ${e.args.address}`);
    }
  });

  events.subscribeToTextMessageReceivedEvent(async (e) => {
    createAndAppendLi("Message received from mixnet");

    const parsed = JSON.parse(e.args.payload);
    const Uint8Arr: unknown = Object.values(parsed);
    const result = await signingClient.broadcastTx(Uint8Arr as Uint8Array);

    createAndAppendLi(`Raw tx is ${JSON.stringify(e.args.payloadRaw)}`);
    createAndAppendLi("Broadcasting tx");
    createAndAppendLi("Broadcast complete");
    createAndAppendLi(`Tx hash is: ${result.transactionHash}`);
  });

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    "surround vanish solution insect filter coach announce enrich business topple phrase mirror father vessel immune dilemma three chief snap child exist gadget amateur spike",
    { prefix: nyxOptions.bech32prefix }
  );

  const [account] = await wallet.getAccounts();
  const signingClient = await SigningStargateClient.connectWithSigner(
    "https://qwerty-validator.qa.nymte.ch",
    wallet
  );

  const msgSend = {
    fromAddress: account.address,
    toAddress: account.address,
    amount: coins(100000, "unym"),
  };

  signingClient.broadcastTx;

  const signed = await signingClient.sign(
    account.address,
    [
      {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: msgSend,
      },
    ],
    { amount: [{ amount: "100000", denom: "unym" }], gas: "100000" },
    `signed cosmos tx from address: ${account.address}`
  );

  const encoded = Uint8Array.from(TxRaw.encode(signed).finish());
  const json = { message: JSON.stringify(encoded), mimeType: "text/plain" };

  createAndAppendLi("Created signed tx");
  createAndAppendLi(`Signed tx is: ${JSON.stringify(signed)}}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  createAndAppendLi("Sending signed tx through the mixnet");
  nymClient.send({
    payload: json,
    recipient: gatewayAddress || "",
  });
}

main();
