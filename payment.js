let web3;
let provider;
let userPaid = false;

const BASE_CHAIN_ID = "0x2105"; // Base Mainnet chainId in hex
const BASE_PARAMS = {
  chainId: BASE_CHAIN_ID,
  chainName: "Base Mainnet",
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
};

// Wallet options
const providerOptions = {
  walletconnect: {
    package: window.WalletConnectProvider.default,
    options: {
      infuraId: "77e1a47effd041d99775d7483b5d921b", // your Infura key
    },
  },
};

const web3Modal = new window.Web3Modal.default({
  cacheProvider: false,
  providerOptions,
});

// 🔗 Connect wallet
async function connectWallet() {
  try {
    provider = await web3Modal.connect();
    web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();
    const shortAddr = accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4);

    document.getElementById("walletInfo").innerText = `✅ Connected: ${shortAddr}`;
  } catch (err) {
    console.error("⚠️ Wallet connection failed", err);
    document.getElementById("walletInfo").innerText = "❌ Connection failed";
  }
}

// 🔄 Ensure Base Mainnet
async function switchToBase() {
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BASE_CHAIN_ID }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [BASE_PARAMS],
      });
    } else {
      throw switchError;
    }
  }
}

// 💵 Pay $1 to unlock
async function payToUnlock() {
  if (!web3) return alert("⚠️ Connect wallet first!");

  try {
    await switchToBase();

    const accounts = await web3.eth.getAccounts();
    const from = accounts[0];
    const to = "0xf95F2865C05b5a8cd39fb8E55804b9916f7DC314"; // your wallet

    const value = web3.utils.toWei("0.0005", "ether"); // ~$1 (adjust as needed)

    const tx = await web3.eth.sendTransaction({
      from,
      to,
      value,
      gas: 21000, // fallback gas for ETH transfer
    });

    userPaid = true;
    alert("✅ Payment successful! You can now view the solution.\n\nTX: " +
          `https://basescan.org/tx/${tx.transactionHash}`);

    document.getElementById("solutionBtn").innerText = "Show Solution";
  } catch (err) {
    console.error("❌ Payment failed:", err);
    alert("❌ Payment failed: " + err.message);
  }
}

// 🔓 Handle solution button
function handleSolutionClick() {
  if (!userPaid) {
    payToUnlock();
  } else {
    animateSolve();
  }
}
