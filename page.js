if (navigator.mediaDevices) {
  console.log('getUserMedia supported.');

  var constraints = { audio: true };
  var chunks = [];

  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    const mediaRecorder = new MediaRecorder(stream);
    const startButton = document.getElementById('startButton')
    const stopButton = document.getElementById('stopButton')
    let chunks = []
    
    startButton.addEventListener('click', function(e) {
      mediaRecorder.start()
      changeTextStatus()
      console.log('mediaRecorder.state: ', mediaRecorder.state)
    })
    
    stopButton.addEventListener('click', function(e) {
      mediaRecorder.stop()
      changeTextStatus()
      addAudioPlayer()
      console.log('mediaRecorder.state: ', mediaRecorder.state)
    })

    mediaRecorder.onstop = function(e) {
      const blob = new Blob(chunks, { type: 'audio/ogg' })
      chunks = []
      let audioUrl = window.URL.createObjectURL(blob)
      const player = document.querySelector('audio')
      player.src = audioUrl
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  })
  .catch(function(err) {
    console.log('The following error occurred: ' + err.stack);
  })
}

function changeTextStatus() {
  const isRecordingText = { [true]: 'Recording', [false]: 'Stopped' }
  const p = document.getElementById('recordingStatus')

  if(p.textContent === isRecordingText[true]) {
    p.textContent = isRecordingText[false]
  } else {
    p.textContent = isRecordingText[true]
  }
}

function addAudioPlayer() {
  const card = document.querySelector('div.card')
  let audio = document.querySelector('audio')

  if(!audio) {
    audio = document.createElement('audio')
    audio.controls = true
  
    card.appendChild(audio)
  }
}