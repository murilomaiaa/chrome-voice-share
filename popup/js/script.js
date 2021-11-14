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
      changeTextStatus('Gravando')
    })
    
    stopButton.addEventListener('click', function(e) {
      mediaRecorder.stop()
      changeTextStatus('Salvando...')
    })

    mediaRecorder.onstop = function(e) {
      const blob = new Blob(chunks, { type: 'audio/ogg' })
      chunks = []
      fetchAudio(blob).then(id => {
        changeTextStatus('Parado')
        addAudioPlayer(blob)

        const url = getListenRecordUrl(id)
        const card = document.getElementById('card')

        const tooltip = addTooltip(card, splitUrl(url))
        copyUrlToClipboard(card, url)
        setTimeout(() => card.removeChild(tooltip), 5000)
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

function splitUrl(url = '') {
  const sorted = []

  for (let i = url.length - 1;  i >= 0; i--) {
    sorted.push(url[i])
  }

  const slashIndex = sorted.indexOf('/')

  const splittedUrl = {
    first: ['\n',...sorted.slice(slashIndex)].sort(()=> -1).join(''),
    second: sorted.slice(0, slashIndex).sort(()=> -1).join(''), 
  }

  return splittedUrl.first + splittedUrl.second
}

const addTooltip = (card, url) => {
  const message = document.createElement('span')
  message.setAttribute('class', 'message')
  message.textContent = 'Link copiado para a área de transferência'

  const br = document.createElement('br')

  const urlSpan = document.createElement('span')
  urlSpan.setAttribute('class', 'url')
  urlSpan.setAttribute('id', 'url')
  urlSpan.textContent = url

  const tooltip = document.createElement('div')
  tooltip.setAttribute('class', 'tooltip')
  tooltip.append(message, br, urlSpan)

  card.append(tooltip)

  return tooltip
}

function copyUrlToClipboard(card, url) {
  const button = document.createElement('button')
  button.setAttribute('id', 'clip')
  button.setAttribute('data-clipboard-action', 'copy')
  button.setAttribute('data-clipboard-text', url)
  button.textContent = 'Copiar'

  card.append(button)

  new ClipboardJS('#clip')
  button.click()
  card.removeChild(button)
}

async function fetchAudio(blob) {
  const endpoint = getEndpoint()
  const formData = new FormData()
  formData.append('audio', blob, 'audio' + Math.random() + '.ogg')

  const response = await fetch(endpoint, { body: formData, method: 'POST' })
  const data = await response.json()

  return data.id
}

function changeTextStatus(status) {
  const p = document.getElementById('recordingStatus')
  p.textContent = status
}

function addAudioPlayer(blob) {
  const card = document.querySelector('div.card')
  let audio = document.querySelector('audio')

  if(!audio) {
    audio = document.createElement('audio')
    audio.controls = true

    card.appendChild(audio)
  }

  const player = document.querySelector('audio')
  const audioUrl = window.URL.createObjectURL(blob)
  player.src = audioUrl
}
