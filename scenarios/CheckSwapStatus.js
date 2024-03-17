window.render('?', `{{history}}`)

publicLineaClient.BaseService.getSwapStatus(HTLCContractAddress, _swapID).then(result => {
  console.log(result)

  const data = result.data

  let output = '';
  output += 'Swap ID: ' + data.swapID + ', Status: ' + data.status;

  window.render('>', output)

  return output
})
