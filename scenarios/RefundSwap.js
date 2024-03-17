window.render('?', `{{history}}`)

const { request } = await window.publicLineaClient.simulateContract({
  account,
  address: HTLCContractAddress,
  abi: HTLCContractAbi,
  functionName: 'refundSwap',
  parameters: [_swapID]
})
await walletLineaClient.writeContract(request)
