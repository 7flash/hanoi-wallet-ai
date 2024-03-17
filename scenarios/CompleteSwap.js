window.render('?', `{{history}}`)

const { request } = await window.publicLineaClient.simulateContract({
  account,
  address: HTLCContractAddress,
  abi: HTLCContractAbi,
  functionName: 'completeSwap',
  parameters: [_swapID, _preimage]
})
await walletLineaClient.writeContract(request)
