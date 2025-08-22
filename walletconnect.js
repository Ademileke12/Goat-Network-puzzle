let userAddress = null;

async function connectWallet() {
  try {
    provider = new window.WalletConnectProvider.default({
      infuraId: "77e1a47effd041d99775d7483b5d921b",
    });

    // Enable session (triggers QR Code or mobile app)
    await provider.enable();
    web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();
    userAddress = accounts[0];

    // shorten address
    const shortAddr = userAddress.slice(0, 6) + "..." + userAddress.slice(-4);

    document.getElementById(
      "walletInfo"
    ).innerText = `✅ Connected: ${shortAddr}`;
  } catch (err) {
    console.error("Wallet connection failed:", err);
    document.getElementById("walletInfo").innerText = "❌ Connection failed";
  }
}
