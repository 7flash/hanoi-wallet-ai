window.render('?', `{{history}}`)

publicLineaClient.BaseService.getAllSwaps(HTLCContractAddress).then(result => {
  console.log(result)

  const data = result.data

  let output = '';
  for (let i = 0; i < data.length; i++) {
    output += 'Swap ID: ' + data[i].swapID + ', Amount: ' + data[i].amount + ', Hashlock: ' + data[i].hashlock + ', Timelock: ' + data[i].timelock + ', Sender: ' + data[i].sender + ', Receiver: ' + data[i].receiver + '\n';
  }

  window.render('>', output)

  return output
})
