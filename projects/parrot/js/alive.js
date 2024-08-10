

// State loop
/*
    Sleep
    Listen
    Play
    Sleep Long/Short


*/
let currentState = "listening"

let recognition = null;
let wordsHeard = [];
let speechEndTimeout = null;
let listenPhraseTimeout = null;
let endSpeech = false;
let isAbort;
function DoListen() {
    document.querySelector("#live-state").src = './images/live-state-listen.png';

    wordsHeard = [];
    if (listenPhraseTimeout) clearTimeout(listenPhraseTimeout);
    if (speechEndTimeout) clearTimeout(speechEndTimeout);

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-us";

    recognition.onstart = function () {
        Log("Listen: start");
    };

    recognition.onerror = function (event) {
        if (!event.error == "aborted") {
            Log("Listen: error:");
            Log(event);
        } else {
            Log("Listen: abort");
        }
    };

    recognition.onend = function () {
        Log("Listen: end");
    };

    recognition.onresult = function (event) {
        var interim_transcript = '';
        if (typeof (event.results) == 'undefined') {
            recognition.onend = null;
            recognition.stop();
            Log("Listen: On results error:", event);
            return;
        }

        for (var i = event.resultIndex; i < event.results.length; ++i) {
            wordsHeard = event.results[i][0].transcript;
            wordsHeard = wordsHeard.split(" ");

            Log(`Listen: Listening [${wordsHeard.join(" ")}]`);

            // Use final results if it comes in
            if (event.results[i].isFinal) {
                Log(`Listen: Final Results`);
                if (speechEndTimeout) clearTimeout(speechEndTimeout);
                speechEndTimeout = window.setTimeout(DoSpeak, 10);
            }
        }

        if (wordsHeard.length > 5) {
            if (speechEndTimeout) clearTimeout(speechEndTimeout);
            speechEndTimeout = window.setTimeout(DoSpeak, 1500);
        }

    };

    recognition.start();
}

// This makes sure all 3 words were heard withing a time window
function PhraseTimeout() {
    Log(`Listen: Phrase timeout`);
    wordsHeard = [];
}

function DoSpeak() {
    recognition.abort()
    let words = Math.floor(Math.random() * 4) + 2;
    let phrase = wordsHeard.slice(-1 * words).join(" ");
    
    
    let audioEl = document.querySelector("#debug-test-audio");
    audioEl.onended = function() {
        Log("dummy audio end");
        DoSquak(phrase);
    }
    Log("dummy audio start");
    audioEl.play();
}

function MakeUtterance2(str) {
    let utterance = new SpeechSynthesisUtterance(str);
    utterance.volume = 1;
    utterance.pitch = 2;
    utterance.rate = 1.1;
    utterance.voice = GetVoiceByUri("com.apple.eloquence.en-US.Shelley");
    return utterance;
}

function DoSquak(phrase) {
    document.querySelector("#live-state").src = './images/live-state-talk.png';
    speechSynthesis.cancel();
    Log(`Speak: ${phrase}`);

    let squak = MakeUtterance2("Rock! Rock!");
    squak.rate = 1.25;
    squak.addEventListener('end', () => {
        let utterance = MakeUtterance2(phrase);
        utterance.addEventListener('end', () => {
            DoSleep();
        });

        speechSynthesis.speak(utterance);
    });
    speechSynthesis.speak(squak);
}

function DoSleep() {
    let delay = 5000;
    Log(`Sleep: ${delay / 1000}`);
    document.querySelector("#live-state").src = './images/live-state-sleep.png';

    window.setTimeout(DoListen, delay);
}