console.log('load')
if (navigator.mediaDevices) {
  console.log('getUserMedia supported.')

  const constraints = { audio: true }

  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    console.log('success')
  })
  .catch(function(err) {
    console.log('The following error occurred: ' + err.stack ?? err)
  })
}
