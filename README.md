# Concept

Our project revolves around the idea of using AI to interpret voice commands from users and execute predefined scenarios on a 2D whiteboard canvas. These scenarios are specifically designed to visualize blockchain smart contract transactions, providing a unique and interactive way to understand and engage with blockchain technology.

## How it Works

1. **Voice Recognition:** The first step involves voice recognition. Our system is designed to understand natural language, allowing you to interact with it as you would with a human. We use vector embeddings to approximate the meaning of user voice replicas, ensuring accurate interpretation of your commands.

2. **Predefined AI Scenarios:** Once the system understands your command, it triggers a predefined AI scenario. These scenarios are not generated on-the-fly but are pre-programmed to correspond to specific user intentions related to blockchain smart contract transactions.

3. **Integrated Spatial Environment:** The triggered scenario is visualized on a 2D whiteboard canvas, which serves as the integrated spatial environment. This interactive platform allows you to see your blockchain transactions come to life.

4. **Visually Guided Transaction Execution:** The system provides a visually guided transaction execution on the canvas. It offers visual cues and prompts to guide you through the process, making it an intuitive way to understand the intricacies of your transactions.

# HTLC Smart Contract

## Testnet Deployment

### Linea
[0x82322b23Dcd8a9dfB721e2c7DF367a86BAdF6D76](https://explorer.goerli.linea.build/address/0x82322b23Dcd8a9dfB721e2c7DF367a86BAdF6D76)

### Polygon zkEVM
[0x25422Ad58119BC756343B13295BB8CA0F274c8ba](https://testnet-zkevm.polygonscan.com/address/0x25422Ad58119BC756343B13295BB8CA0F274c8ba)

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

# Setup/Contribute

### 1. Initialize Spatial Environment

It should expose render function like this:

```
window.render = (anchorText: string, value: string) => {
  const ea = window.ea as ExcalidrawAPI;

  const { id: anchorElId, groupIds } = ea.getSceneElements().find(it => it.text == anchorText)

  const { id: targetElId } = ea.getSceneElements().find(it => it.type == 'text' && it.id != anchorElId && it.groupIds.some((vit) => groupIds.includes(vit)))

  ea.updateScene({
    elements: ea.getSceneElements().map((it) => {
      if (it.id == targetElId) {
        it.text = value.toString()
        it.originalText = value.toString()
        it.rawText = value.toString()
        it.version++

        const metrics = window.measureText(
          it.text,
          getFontString(it),
          it.lineHeight,
        );
        it.width = metrics.width;
        it.height = metrics.height;
        it.baseline = metrics.baseline;
      }
      return {
        ...it
      }
    })
  })
}
```

### 2. Initialize Wallets

```
import { mainnet, lineaTestnet, polygonZkEvmTestnet } from 'viem/chains'
import { formatEther, formatGwei, formatUnits, parseEther, parseGwei, createWalletClient, custom, createPublicClient, http } from 'viem'
import { eip712WalletActions } from 'viem/zksync'
import { publicActionReverseMirage, amountToNumber } from 'reverse-mirage'
import { publicActionCovalent } from '@covalenthq/client-viem-sdk'

const apiKey = ""

window.publicLineaClient = createPublicClient({
  chain: lineaTestnet,
  transport: http(),
}).extend(publicActionReverseMirage).extend(publicActionCovalent(apiKey))

window.publicPolygonClient = createPublicClient({
  chain: polygonZkEvmTestnet,
  transport: http(),
}).extend(publicActionReverseMirage).extend(publicActionCovalent(apiKey))

window.publicEthClient = createPublicClient({
  chain: mainnet,
  transport: http()
}).extend(publicActionReverseMirage).extend(publicActionCovalent(apiKey))

window.walletLineaClient = createWalletClient({
  chain: lineaTestnet,
  transport: custom(window.ethereum!)
}).extend(publicActionReverseMirage).extend(publicActionCovalent(apiKey))

window.walletPolygonClient = createWalletClient({
  chain: polygonZkEvmTestnet,
  transport: custom(window.ethereum!),
}).extend(eip712WalletActions()).extend(publicActionReverseMirage).extend(publicActionCovalent(apiKey))

window.utils = { formatEther, formatGwei, formatUnits, parseEther, parseGwei, amountToNumber }
```

### Add Scenario Scripts
Each method in smart contract should have corresponding scenario like [InitiateSwap](./scenarios/InitiateSwap.js)

It can leverage methods exposed by Spatial Environment:

*window.render* accepts text/image for rendering in position determined by provided anchor

*window.publicClient* allows to query RPC nodes

*window.walletClient* allows to trigger Metamask transactions

### Add Message Embeddings
[config.yml](./scenarios/config.yml)

Note, that Embeddings Server is implemented in Python and acts as a Proxy in between of voice command being triggered in Spatial Environment and Scenario actually starting its execution. It derives corresponding scenario from user intention as shown in following algorithm:

```
    similarities = {}
    for message in scenario.message_to_intent.keys():
        similarity = cosine_similarity(
            user_msg_embedding, scenario.category_embeddings[message]
        )
        intent = scenario.message_to_intent[message]
        if intent in similarities:
            similarities[intent]["sum"] += similarity
            similarities[intent]["count"] += 1
        else:
            similarities[intent] = {"sum": similarity, "count": 1}

    average_similarities = [
        (intent, similarities[intent]["sum"] / similarities[intent]["count"])
        for intent in similarities
    ]

    sorted_intents = sorted(
        average_similarities, key=lambda x: x[1], reverse=True
    )
```
