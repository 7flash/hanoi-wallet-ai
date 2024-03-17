// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract HTLC {
    
    struct Swap {
        uint256 amount;
        bytes32 hashlock;
        uint256 timelock;
        address payable sender;
        address payable receiver;
    }

    mapping(bytes32 => Swap) public swaps;

    event SwapInitiated(bytes32 _swapID, address _sender, address _receiver, uint256 _amount, bytes32 _hashlock, uint256 _timelock);
    event SwapCompleted(bytes32 _swapID, bytes32 _preimage);
    event SwapRefunded(bytes32 _swapID);

    function initiateSwap(address payable _receiver, bytes32 _hashlock, uint256 _timelock) external payable {
        require(msg.value > 0, "Swap amount must be greater than 0");
        require(_timelock > block.timestamp, "Timelock must be in the future");

        bytes32 swapID = keccak256(abi.encodePacked(msg.sender, _receiver, msg.value, _hashlock, _timelock));

        swaps[swapID] = Swap({
            amount: msg.value,
            hashlock: _hashlock,
            timelock: _timelock,
            sender: payable(msg.sender),
            receiver: _receiver
        });

        emit SwapInitiated(swapID, msg.sender, _receiver, msg.value, _hashlock, _timelock);
    }

    function completeSwap(bytes32 _swapID, bytes32 _preimage) external {
        Swap storage swap = swaps[_swapID];

        require(swap.receiver == msg.sender, "Only the receiver can complete the swap");
        require(keccak256(abi.encodePacked(_preimage)) == swap.hashlock, "Invalid preimage");
        require(block.timestamp <= swap.timelock, "The swap has expired");

        swap.receiver.transfer(swap.amount);
        delete swaps[_swapID];

        emit SwapCompleted(_swapID, _preimage);
    }

    function refundSwap(bytes32 _swapID) external {
        Swap storage swap = swaps[_swapID];

        require(swap.sender == msg.sender, "Only the sender can refund the swap");
        require(block.timestamp > swap.timelock, "The swap has not expired yet");

        swap.sender.transfer(swap.amount);
        delete swaps[_swapID];

        emit SwapRefunded(_swapID);
    }
}
