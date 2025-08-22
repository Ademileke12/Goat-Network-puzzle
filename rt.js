const tweetURL = "https://x.com/anakincoco/status/1958900306731032588";

function retweetToUnlock() {
  // Open Twitter retweet intent
  window.open(
    `https://twitter.com/intent/retweet?tweet_id=1958900306731032588`,
    "_blank"
  );

  // After opening Twitter, immediately unlock solution
  // (⚠️ Note: you can't verify if they *actually* retweeted without API access)
  setTimeout(() => {
    document.getElementById("solutionBtn").innerText = "Show Solution";
    document.getElementById("solutionBtn").onclick = animateSolve;
  }, 3000); // wait 3s to simulate check
}
