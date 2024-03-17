window.render('?', `{{history}}`)

const { request } = await window.publicLineaClient.simulateContract({
  account,
  address: HTLCContractAddress,
  abi: HTLCContractAbi,
  functionName: 'initiateSwap',
  parameters: [_receiver, _hashlock, _timelock]
})
await walletLineaClient.writeContract(request)
