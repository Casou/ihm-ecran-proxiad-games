let VOICE = null;
window.speechSynthesis.onvoiceschanged = function() {
    let googleVoiceArray = window.speechSynthesis.getVoices().filter(voice => voice.voiceURI === "Google français");
    if (googleVoiceArray) {
        VOICE = googleVoiceArray[0];
        console.log(VOICE);
    }
};

const readMessage = (message) => {
    const enonciation = new SpeechSynthesisUtterance(message);
    enonciation.pitch = 0.1;
    enonciation.voice = VOICE;
    window.speechSynthesis.speak(enonciation);
};