import React from "react";
import { useMoralis } from "react-moralis";

function Header() {
  const {
    enableWeb3,
    account,
    isWeb3EnableLoading,
    isWeb3Enabled,
    deactivateWeb3,
    Moralis,
  } = useMoralis();

  const connectWallet = async( )=>{
    const res = await enableWeb3()
    if(typeof res != undefined){
        if(typeof window != undefined){
            localStorage.setItem("connected","injected")
        }
    }
  }
  return (
    <div>
      <div>
        <h2>Lottery Website</h2>
      </div>
      <div>
        <button onClick={()=>connectWallet()}>
          {!isWeb3EnableLoading
            ? isWeb3Enabled
              ? `Connected to ${account.slice(0, 6)}...
                            ${account.slice(account.length - 4)}`
              : "Connect"
            : "Loading....."}
        </button>
      </div>
    </div>
  );
}

export default Header;
