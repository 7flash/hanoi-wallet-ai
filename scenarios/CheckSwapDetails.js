window.render('?', `{{history}}`)

publicLineaClient.BaseService.getSwapDetails(HTLCContractAddress, _swapID).then(result => {
  console.log(result)

  const data = result.data

  let output = '';
  output += 'Swap ID: ' + data.swapID + ', Amount: ' + data.amount + ', Hashlock: ' + data.hashlock + ', Timelock: ' + data.timelock + ', Sender: ' + data.sender + ', Receiver: ' + data.receiver;

  window.render('>', output)

  return output
})
