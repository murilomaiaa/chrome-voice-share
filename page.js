if (navigator.mediaDevices) {
  console.log('getUserMedia supported.');

  var constraints = { audio: true };
  var chunks = [];

  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    const mediaRecorder = new MediaRecorder(stream);
    const startButton = document.getElementById('startButton')
    const stopButton = document.getElementById('stopButton')
    const audioPlayer = document.getElementById('audioPlayer')
    let chunks = []
    
    startButton.addEventListener('click', function(e) {
      mediaRecorder.start()
      console.log('mediaRecorder.state: ', mediaRecorder.state)
    })
    
    stopButton.addEventListener('click', function(e) {
      mediaRecorder.stop()
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

// function changeButtonAttributes() {
//   const imagesUrl = { [true]:'assets/start.png', [false]: 'assets/stop.png' }
//   const image = document.getElementById('buttonImage')
//   const imageUrl = image.getAttribute('src')

//   if(imageUrl === imagesUrl[true]) {
//     image.setAttribute('src', imagesUrl[false])
//   } else {
//     image.setAttribute('src', imagesUrl[true])
//   }
// }
