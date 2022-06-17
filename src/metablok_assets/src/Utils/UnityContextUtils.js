import * as PlugUtils from "./PlugUtils";

export function AddUnityListeners(unityContext) {
    unityContext.on("RequestPlugConnect", async function (cbIndex) {
        await PlugUtils.RequestPlugConnect(cbIndex, unityContext);
    });

    unityContext.on("CheckPlugConnection", async function (cbIndex) {
        await PlugUtils.CheckPlugConnection(cbIndex, unityContext);
    });

    unityContext.on("Pay", async function (cbIndex,account,amount) {
        await PlugUtils.Pay(cbIndex, unityContext, account, amount);
    });

}
