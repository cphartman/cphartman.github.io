


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
      recognition.stop();
  };
  recognition.start();

}

function TestSpeaker() {
  let utterance = new SpeechSynthesisUtterance("Rock! Rock!");
  utterance.volume = 50;
  utterance.pitch = 2;
  utterance.rate = 1.25;
  utterance.voice = GetVoiceByUri("com.apple.eloquence.en-US.Shelley");
  utterance.pitch = 2;
  speechSynthesis.speak(utterance);
}