let VOICE = null;
window.speechSynthesis.onvoiceschanged = function() {
    let googleVoiceArray = window.speechSynthesis.getVoices().filter(voice => voice.voiceURI === "Google français");
    if (googleVoiceArray) {
        VOICE = googleVoiceArray[0];
    }
};

const readMessage = (message, callback) => {
	window.utterances = []; // To fix the "onend not firing" bug

    const utterance = new SpeechSynthesisUtterance(message);
	utterance.pitch = 0.5;
	utterance.voice = VOICE;
	utterance.lang = "fr-FR";
    if (callback) {
		utterance.onend = () => {
		    callback();
		}
    }
	utterances.push( utterance ); // To fix the "onend not firing" bug
    window.speechSynthesis.speak(utterance);
};