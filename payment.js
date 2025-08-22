let userPaid = false;

async function connectWallet() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    alert("✅ Wallet connected!");
  } else {
    alert("⚠️ Please install MetaMask!");
  }
}

async function payToUnlock() {
  if (!window.web3) return alert("⚠️ Connect wallet first!");

  const accounts = await web3.eth.getAccounts();
  const from = accounts[0];
  const to = "0xf95F2865C05b5a8cd39fb8E55804b9916f7DC314"; // your wallet

  const value = web3.utils.toWei("0.0005", "ether"); // ~ $1 ETH (update as needed)

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