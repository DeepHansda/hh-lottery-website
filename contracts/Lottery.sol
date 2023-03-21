//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";

error Lottery__SendMoreToEnterLottery();
error Lottery__LotteryNotOpen();
error Lottery__UpkeepNotNeeded(
    uint256 currentBalance,
    uint256 numPlayers,
    uint256 lotteryState
);
error Raffle__TransferFailed();

contract Lottery is VRFConsumerBaseV2, AutomationCompatibleInterface {
    enum LotteryState {
        OPEN,
        CALCULATING
    }

    VRFConsumerBaseV2 private immutable i_vrfCordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    uint256 private immutable i_entraceFee;
    address payable[] private s_players;
    LotteryState private s_lotteryState;
    uint256 private i_interval;
    uint256 private s_lastTimeStamp;
    address private s_recentWinner;

    event EnterLottery(address indexed player);
    event WinnerPicked(address indexed player);
    event RequestedLotteryWinner(uint256 indexed request_id);

    constructor(
        address vrfCordinatorV2,
        uint256 entraceFee,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCordinatorV2) {
        i_vrfCordinator = VRFConsumerBaseV2(vrfCordinatorV2);
        i_entraceFee = entraceFee;
        i_interval = interval;
        s_lastTimeStamp = block.timestamp;
    }

    function enterLottery() public payable {
        if (msg.value < i_entraceFee) {
            revert Lottery__SendMoreToEnterLottery();
        }
        if (s_lotteryState != LotteryState.OPEN) {
            revert Lottery__LotteryNotOpen();
        }
        s_players.push(payable(msg.sender));
        emit EnterLottery(msg.sender);
    }

    function checkUpKeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (
            bool upKeepNeeded,
            bytes memory /*performData*/
        )
    {
        bool isOpened = LotteryState.OPEN == s_lotteryState;
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = s_players.length > 0;
        bool hasBalance = address(this).balance > 0;
        upKeepNeeded = (isOpened && timePassed && hasPlayers && hasBalance);
    }

    function performUpkeep(
        bytes calldata /*performData*/
    ) external override {
        (bool upKeepNeeded, ) = checkUpKeep("");
        if (!upKeepNeeded) {
            revert Lottery__UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_lotteryState)
            );
        }

        s_lotteryState = LotteryState.CALCULATING;
        uint256 request_id = i_vrfCordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        emit RequestedLotteryWinner(request_id);
    }

    function performRandomWords(
        uint256,
        /* requestId */
        uint256[] memory randomWords
    ) internal override {
        uint256 winnerIndex = randomWords[0] % s_players.lenght;
        address payable recentWinner = s_players[winnerIndex];
        s_recentWinner = recentWinner;
        s_players = new address payable[](0);
        s_lotteryState = LotteryState.OPEN;
        s_lastTimeStamp = block.timestamp;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");

        if (!success) {
            revert Raffle__TransferFailed();
        }

        emit WinnerPicked(recentWinner);
    }

    function getEntraceFee() public view returns (uint256) {
        return i_entraceFee;
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getNumOfPlayers() public view returns (uint256) {
        return s_players.lenght;
    }
}
