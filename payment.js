let web3;
let provider;
let userPaid = false;

// Setup Web3Modal
const providerOptions = {
  walletconnect: {
    package: window.WalletConnectProvider.default,
    options: {
      infuraId: "77e1a47effd041d99775d7483b5d921b", // you need a free Infura key
    },
  },
};

const web3Modal = new window.Web3Modal.default({
  cacheProvider: false,
  providerOptions,
});

// Connect Wallet
async function connectWallet() {
  try {
    provider = await web3Modal.connect();
    web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();
    alert("✅ Connected: " + accounts[0]);
  } catch (err) {
    console.error("⚠️ Wallet connection failed", err);
  }
}

// Pay $1 in ETH
async function payToUnlock() {
  if (!web3) return alert("⚠️ Connect wallet first!");

  const accounts = await web3.eth.getAccounts();
  const from = accounts[0];
  const to = "0xf95F2865C05b5a8cd39fb8E55804b9916f7DC314";

  const value = web3.utils.toWei("0.0005", "ether"); // ~$1 (adjust for price)

  try {
    await web3.eth.sendTransaction({ from, to, value });
    userPaid = true;
    alert("✅ Payment successful! You can now view the solution.");
    document.getElementById("solutionBtn").innerText = "Show Solution";
  } catch (err) {
    alert("❌ Payment failed: " + err.message);
  }
}

function handleSolutionClick() {
  if (!userPaid) {
    payToUnlock();
  } else {
    animateSolve();
  }
}
