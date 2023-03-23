import { contractABI, contractAddress } from "@/constants";
import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";

function EnterLottery() {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex} = useMoralis();

  const [players, setPlayers] = useState(0);
  const [entranceFee, setEntranceFee] = useState(0);
  const [recentWinner, setRecentWinner] = useState("");
  const [prize,setPrize] = useState("")

  const chainId = parseInt(chainIdHex);
  const LotteryAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;

  const {
    runContractFunction: enterLottery,
    data: enterTxResponse,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    contractAddress: LotteryAddress,
    abi: contractABI,
    functionName: "enterLottery",
    msgValue: entranceFee,
    params: {},
  });

  const { runContractFunction: getlotteryEntranceFee } = useWeb3Contract({
    functionName: "getlotteryEntranceFee",
    contractAddress: LotteryAddress,
    abi: contractABI,
    params: {},
  });

  const {runContractFunction:getRecentWinner} = useWeb3Contract({
    contractAddress:LotteryAddress,
    abi:contractABI,
    functionName:"getRecentWinner",
    params:{}
  })

  const {runContractFunction:getNumOfPlayers} = useWeb3Contract({
    functionName:"getNumOfPlayers",
    abi:contractABI,
    contractAddress:LotteryAddress,
    params:{}
  })
  const {runContractFunction:getContractBalance} = useWeb3Contract({
    functionName:"getContractBalance",
    abi:contractABI,
    contractAddress:LotteryAddress,
    params:{}
  })
  const {runContractFunction:checkUpkeep} = useWeb3Contract({
    functionName:"checkUpkeep",
    contractAddress:LotteryAddress,
    abi:contractABI,
    params:{}
  })

  const successListener = async (tx) => {
    try {
      await tx.wait(1);
      updateUIValues();
      alert("Success");
    } catch (error) {
      console.log(error);
    }
  };
  const updateUIValues = async () => {
    const fee = await getlotteryEntranceFee();
    const winner = await getRecentWinner()
    const numOfPlayer = await getNumOfPlayers()
    const balance = await getContractBalance()
    await checkUpkeep()
    console.log(fee)
    setEntranceFee(fee?.toString());
    setRecentWinner(winner)
    setPlayers(numOfPlayer.toString())
    setPrize(balance.toString())
  
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled]);
  return (
    <>
      {LotteryAddress ? (
        <div className="border">
          <button
            onClick={async () => {
              await enterLottery({
                onSuccess: successListener,
                onError: (error) => console.log(error),
              });
            }}
            disabled={isFetching || isLoading}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              `Enter Lottery, Fees ${Moralis.web3Library.utils.formatUnits(entranceFee && entranceFee)}`
            )}
          </button>

          <div>
            <h2>{recentWinner}</h2>
          </div>
          <div>
            <h2>{players}</h2>
          </div>
          <div>
            {/* <h2>Prize Pool :{Moralis.web3Library.utils.formatUnits(prize.toString())}</h2> */}
            <h2>Prize Pool :{prize.toString()}</h2>
          </div>

        </div>
      ) : (
        <div>
          <h2>Please connect to a supported chain</h2>
        </div>
      )}
    </>
  );
}

export default EnterLottery;
