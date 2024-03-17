# HTLC Smart Contract

## Testnet Deployment

### Linea

### Polygon zkEVM


## Overview

This is a Hashed TimeLock Contract (HTLC) implemented in Solidity for the Ethereum blockchain. The HTLC enables secure peer-to-peer transactions by using cryptographic hash functions and time-bound conditions. It's a key component in implementing trustless atomic swaps between parties. This is particularly useful for cross-chain exchanges, for example, swapping native coins between Linea and Polygon zkEVM chains.

## Contract Structure

The contract is structured around a `Swap` struct, which holds the details of each swap transaction. This includes the amount being swapped, the hashlock (a hash of the secret that the receiver must provide to claim the funds), the timelock (the time by which the swap must be completed), and the addresses of the sender and receiver.

These swaps are stored in a mapping, with the swap ID (a hash of the swap details) as the key.

The contract emits events when a swap is initiated, completed, or refunded.

## Functions

### initiateSwap

This function is used to initiate a new swap. The sender must provide the receiver's address, the hashlock, and the timelock, and must send some amount of ether with the transaction. The function checks that the amount is greater than 0 and that the timelock is in the future, then creates a new swap and stores it in the mapping. For example, if you're swapping Linea coins for Polygon zkEVM coins, you'd initiate the swap on the Linea chain.

### completeSwap

This function is used by the receiver to complete a swap. The receiver must provide the swap ID and the preimage of the hashlock (the original secret that was hashed). The function checks that the sender is the receiver, that the preimage hashes to the hashlock, and that the timelock has not expired, then transfers the funds to the receiver and deletes the swap. In our example, the receiver would complete the swap on the Polygon zkEVM chain.

### refundSwap

This function is used by the sender to refund a swap. The sender must provide the swap ID. The function checks that the sender is the sender and that the timelock has expired, then transfers the funds back to the sender and deletes the swap. If the receiver doesn't complete the swap in time, you can get your Linea coins back.

## Usage

To use this contract, first deploy it to the Ethereum network. Then, to initiate a swap, call the `initiateSwap` function with the appropriate parameters and send some ether. The receiver can then call `completeSwap` with the swap ID and the preimage to claim the funds. If the receiver does not do this before the timelock expires, the sender can call `refundSwap` to get their funds back. It's a pretty straightforward process, but make sure you keep track of your swap IDs and preimages!
