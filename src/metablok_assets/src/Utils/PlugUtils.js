import {Principal} from "@dfinity/principal";

export async function RequestPlugConnect(cbIndex, unityContext) { // unused
    let data = {};
    data.cbIndex = cbIndex;

    try {
        if (typeof window.ic === 'undefined' || typeof window.ic.plug === 'undefined') {
            throw new Error("We cannot detect a Plug Wallet in your browser extensions");
        }

        const host = "https://mainnet.dfinity.network";

        const result = await window.ic.plug.requestConnect({
            host,
        });

        data.result = result ? "allowed" : "denied";
        unityContext.send("ReactApi", "HandleCallback", JSON.stringify(data));
    } catch (e) {
        console.error(e);
        data.error = e.message;
        unityContext.send("ReactApi", "HandleCallback", JSON.stringify(data));
    }
}

export async function CheckPlugConnection(cbIndex, unityContext) {
    let data = {};
    data.cbIndex = cbIndex;

    try {
        if (typeof window.ic === 'undefined' || typeof window.ic.plug === 'undefined') {
            throw new Error("We cannot detect a Plug Wallet in your browser extensions");
        }

        let result = await window.ic.plug.isConnected();
        data.result = result ? "true" : "false";
        unityContext.send("ReactApi", "HandleCallback", JSON.stringify(data));
    } catch (e) {
        console.error(e);
        data.error = e.message;
        unityContext.send("ReactApi", "HandleCallback", JSON.stringify(data));
    }
}

export async function Pay(cbIndex, unityContext, to, amount) {
  let data = {};
  data.cbIndex = cbIndex; 

  var hasAllowed = await window.ic?.plug?.isConnected();
  if (!hasAllowed) {
    hasAllowed = await window.ic?.plug?.requestConnect();
  }
  if (hasAllowed) {
    console.log("Plug wallet is connected");

    const balance = await window.ic?.plug?.requestBalance();

    if (true) {
      console.log("Plug wallet has enough balance");

      const requestTransferArg = {
        to: to,
        amount: 10000000,
      };
      const transfer = await window.ic?.plug?.requestTransfer(
        requestTransferArg
      );

      data.result = `Plug wallet transferred 10000000 e8s`;
      unityContext.send("ReactApi", "HandleCallback", JSON.stringify(data));
      return;

      const transferStatus = transfer?.transactions?.transactions[0]?.status;

      if (transferStatus === "COMPLETED") {
        data.result = `Plug wallet transferred ${amount} e8s`;
        unityContext.send("ReactApi", "HandleCallback", JSON.stringify(data));
        return;
      } else if (transferStatus === "PENDING") {
        console.log("Plug wallet is pending.");
        data.result = `Plug wallet transferred ${amount} e8s`;
        unityContext.send("ReactApi", "HandleCallback", JSON.stringify(data));
        return;
      } else {
        console.log(transfer);
        data.error = "Plug wallet failed to transfer";
        unityContext.send("ReactApi", "HandleCallback", JSON.stringify(data));
        return;
      }
      
    } else {
      data.error = "Plug wallet doesn't have enough balance";
      unityContext.send("ReactApi", "HandleCallback", JSON.stringify(data));
      return;
    }
  } else {
    data.error = "Plug wallet connection was refused";
    unityContext.send("ReactApi", "HandleCallback", JSON.stringify(data));
    return;
  }

  setTimeout(() => {
    data.error = "Timeout";
    unityContext.send("ReactApi", "HandleCallback", JSON.stringify(data));
    return;
  }, 5000);
}