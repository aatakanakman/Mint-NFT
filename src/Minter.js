import axios from "axios";
import { useEffect, useState } from "react";
import { connectWallet } from "../src/utils/interact";
import {
  getCurrentWalletConnected,
  mintNFT, //import here
} from "./utils/interact.js";

const Minter = (props) => {
  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  useEffect(async () => {
    // const { address, status } = await getCurrentWalletConnected();
    // setWallet(address);
    // setStatus(status);

    addWalletListener();

    // const res = await axios.get(
    //   "https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=0x0000000000000000000000000000000000001004&apikey=SU33I6H6CGYGE1FMIF9JAY5K79AWRPBXYG"
    // );
    // console.log(res);
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const response = await axios.get(
      "https://api-testnet.bscscan.com/api?module=account&action=balance&address=0x57d90fa440D5Fd039D183d3Ac37A4923C0F3254d&tag=latest&apikey=SU33I6H6CGYGE1FMIF9JAY5K79AWRPBXYG"
    );
    if (response.data.result < 5) {
      const { status } = await mintNFT(url, name, description);
      setStatus(status);
    } else {
      setStatus("Your BNB count not enought");
    }
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>🦊 Metamask</span>
        )}
      </button>
      <button id="walletButton">
        <span>🛡️ TrustWallet</span>
      </button>

      <br></br>
      <h1 id="title"> Atakan NFT Minter</h1>
      <p>
        Simply add your asset's link, name, and description, then press "Mint."
      </p>
      <form>
        <h2>🖼 Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>🤔 Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>✍️ Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">{status}</p>
    </div>
  );
};

export default Minter;
