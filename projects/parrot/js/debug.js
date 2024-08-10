


function ListDevices() {
  navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    devices.forEach(device => {
      if (device.kind === 'audiooutput' || device.kind === 'audioinput')  {
        Log(JSON.stringify(device));
      }
    });
  })
  .catch(err => {
    Log('Error enumerating devices:', err);
  });
}

function TestMicrophone() {
  let recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-us";
  recognition.onstart = function () {
    Log("Mic Started");  
    recognition.stop();
  };
  recognition.onend = function () {
    Log("Mic Ended");  
  };
  recognition.start();
}

function TestTTS() {
  let utterance = new SpeechSynthesisUtterance("Rock! Rock!");
  utterance.volume = 50;
  utterance.pitch = 2;
  utterance.rate = 1.25;
  utterance.voice = GetVoiceByUri("com.apple.eloquence.en-US.Shelley");
  utterance.pitch = 2;
  speechSynthesis.speak(utterance);
}

function TestSpeaker() {
  navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    devices.forEach(device => {
      if (device.kind === 'audiooutput' || device.kind === 'audioinput')  {
        Log(JSON.stringify(device));
      }
    });
  })
  .catch(err => {
    Log('Error enumerating devices:', err);
  });
}

function SelectOutput() {
  navigator.mediaDevices
    .selectAudioOutput()
    .then((device) => {
      Log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
    })
    .catch((err) => {
      Log(`Error: ${err.name}: ${err.message}`);
    });
}

function TestAudioOutput() {
  let audioEl = document.querySelector("#debug-test-audio");
  audioEl.play();
}

async function TestGetUserMedia() {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    Log(`${stream.id} - active: ${stream.active}`);
    /* use the stream */
  } catch (err) {
    Log("TestGetUserMedia error");
    Log(err);
    /* handle the error */
  }
}

function GetDevicesAndTestMic() {
  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      devices.forEach(device => {
        if (device.kind === 'audiooutput' || device.kind === 'audioinput')  {
          Log(JSON.stringify(device));
          if( device.label="Parrot" ) {
            
          }
        }
      });
    })
    .catch(err => {
      Log('Error enumerating devices:', err);
    });
  /*
  try {
                // Request the browser to access the audio input device
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.addEventListener('dataavailable', event => {
                    audioChunks.push(event.data);
                });

                mediaRecorder.addEventListener('stop', () => {
                    // Combine all chunks to create a Blob
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    document.getElementById('audioPlayback').src = audioUrl;
                    audioChunks = [];  // Reset the chunks array for the next recording
                });

                mediaRecorder.start();
                document.getElementById('startRecording').disabled = true;
                document.getElementById('stopRecording').disabled = false;
            } catch (error) {
                console.error('Error accessing audio devices:', error);
            }
        });
  */
}