let web3Modal;
let provider;
let web3;
let userAddress;

const providerOptions = {
  walletconnect: {
    package: window.WalletConnectProvider.default,
    options: {
      infuraId: "77e1a47effd041d99775d7483b5d921b",
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "GOAT Puzzle",
      infuraId: "77e1a47effd041d99775d7483b5d921b",
    },
  },
};

web3Modal = new Web3Modal.default({
  cacheProvider: true, // auto-reconnect on refresh
  providerOptions,
});

async function connectWallet() {
  try {
    provider = await web3Modal.connect();
    web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      userAddress = accounts[0];
      updateWalletUI();
    }

    // watch for account changes
    provider.on("accountsChanged", (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        userAddress = accounts[0];
        updateWalletUI();
      }
    });

    // watch for disconnect
    provider.on("disconnect", () => {
      disconnectWallet();
    });
  } catch (err) {
    console.error("Wallet connection failed:", err);
    document.getElementById("walletInfo").innerText = "❌ Connection failed";
  }
}

function updateWalletUI() {
  if (userAddress) {
    const shortAddr = userAddress.slice(0, 6) + "..." + userAddress.slice(-4);
    document.getElementById(
      "walletInfo"
    ).innerText = `🟢 Connected: ${shortAddr}`;
    document.getElementById("connectBtn").style.display = "none";
    document.getElementById("disconnectBtn").style.display = "inline-block";
  } else {
    document.getElementById("walletInfo").innerText = "🔴 Not Connected";
    document.getElementById("connectBtn").style.display = "inline-block";
    document.getElementById("disconnectBtn").style.display = "none";
  }
}

async function disconnectWallet() {
  if (provider?.close) {
    await provider.close();
  }
  await web3Modal.clearCachedProvider();

  provider = null;
  userAddress = null;
  updateWalletUI();
}

// 🔄 auto-reconnect if cached
window.addEventListener("load", async () => {
  if (web3Modal.cachedProvider) {
    await connectWallet();
  }
});
