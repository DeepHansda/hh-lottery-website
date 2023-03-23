import React, { use, useEffect } from "react";
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

  useEffect(() => {
    if (
      !isWeb3Enabled &&
      typeof window !== undefined &&
      localStorage.getItem("connected")
    ) {
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log("New Account " + account);
      if (account == null) {
        localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null Account Found");
      }
    });
  }, []);

  const connectWallet = async () => {
    const res = await enableWeb3();
    if (typeof res != undefined) {
      if (typeof window != undefined) {
        localStorage.setItem("connected", "injected");
      }
    }
  };
  return (
    <div>
      <div>
        <h2>Lottery Website</h2>
      </div>
      <div>
        <div>
          <button onClick={() => connectWallet()}>
            {!isWeb3EnableLoading
              ? isWeb3Enabled
                ? `Connected to ${account.slice(0, 6)}...
                            ${account.slice(account.length - 4)}`
                : "Connect"
              : "Loading....."}
          </button>
        </div>

        {/* {isWeb3Enabled && <div>
          <button onClick={()=>deactivateWeb3()}>
            Disconnect Account
          </button>
        </div>} */}
      </div>
    </div>
  );
}

export default Header;
