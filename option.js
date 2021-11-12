if (navigator.mediaDevices) {
  console.log('getUserMedia supported.')

  const constraints = { audio: true }

  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    console.log('allowed')
    const mediaRecorder = new MediaRecorder(stream);
    let chunks = []
    
    mediaRecorder.onstop = function(e) {
      const blob = new Blob(chunks, { type: 'audio/ogg' })
      chunks = []
      fetchAudio(blob).then(console.log)
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  })
  .catch(function(err) {
    console.log('The following error occurred: ' + err.stack)
  })
}

async function fetchAudio(blob) {
  const endpoint = getEndpoint()
  const formData = new FormData()
  formData.append('audio', blob, 'audio' + Math.random() + '.ogg')

  const { data } = await axios.post(endpoint, formData)

  return data.id
}
