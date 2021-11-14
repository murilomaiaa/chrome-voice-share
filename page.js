if (navigator.mediaDevices) {
  console.log('getUserMedia supported.')

  const constraints = { audio: true }

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
      console.log('mediaRecorder.state: ', mediaRecorder.state)
    })

    mediaRecorder.onstop = function(e) {
      const blob = new Blob(chunks, { type: 'audio/ogg' })
      chunks = []
      let audioUrl = window.URL.createObjectURL(blob)
      fetchAudio(blob).then(id=>{
        addAudioPlayer(audioUrl)

        showShareLink(id)
      })
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  })
  .catch(function(err) {
    console.log('The following error occurred: ' + err.stack)
  })
}

function showShareLink(id) {
  const card = document.getElementById('card')
  let div = document.getElementById('clipContainer')

  if(!div) {
    div = document.createElement('div')
    div.setAttribute('id', 'clipContainer')
  
    const p = document.createElement('p')
    p.textContent='Compartilhe esse audio:'
    div.appendChild(p)

    div.appendChild(document.createElement('a'))
  
    const button = document.createElement('button')
    button.setAttribute('class', 'button')
    button.setAttribute('id', 'clip')
    button.setAttribute('data-clipboard-action', 'copy')
    button.setAttribute('data-clipboard-target', 'a')
    button.textContent = 'Copiar'
    div.appendChild(button)
  
    card.appendChild(div)
  }

  const url = getListenRecordUrl(id)
  
  const htmlAudioUrl = document.querySelector('a')
  htmlAudioUrl.setAttribute('href', url)
  htmlAudioUrl.textContent = url

  const clipboard = new ClipboardJS('#clip')
  clipboard.on('success', function(e) {
    const  oldBtnClass = button.getAttribute('class')
    const btnClass = oldBtnClass + ' tooltipped tooltipped-s'
    button.setAttribute('class', btnClass)
    button.setAttribute('aria-label', 'Copiado!')
    e.clearSelection();
    setTimeout(()=> removeTooltipClass(button, oldBtnClass), 5000)
});
}

function removeTooltipClass(button, className) {
  button.setAttribute('class', className)
}

async function fetchAudio(blob) {
  const endpoint = getEndpoint()
  const formData = new FormData()
  formData.append('audio', blob, 'audio' + Math.random() + '.ogg')

  const response = await fetch(endpoint, { body: formData, method: 'POST' })
  const data = await response.json()

  let id = ''

  if (data.id) {
    id = data.id
  }

  return id
}

function changeTextStatus() {
  const isRecordingText = { [true]: 'Gravando', [false]: 'Parado' }
  const p = document.getElementById('recordingStatus')

  if(p.textContent === isRecordingText[true]) {
    p.textContent = isRecordingText[false]
  } else {
    p.textContent = isRecordingText[true]
  }
}

function addAudioPlayer(audioUrl = '') {
  const card = document.querySelector('div.card')
  let audio = document.querySelector('audio')

  if(!audio) {
    audio = document.createElement('audio')
    audio.controls = true
  
    card.appendChild(audio)
  }

  const player = document.querySelector('audio')
  player.src = audioUrl
}