


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