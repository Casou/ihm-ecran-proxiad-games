// let VOICE = null;
// window.speechSynthesis.onvoiceschanged = function() {
//     let googleVoiceArray = getVoice("Google français");
//     if (googleVoiceArray) {
//         VOICE = googleVoiceArray[0];
//     }
// };

let ALL_VOICES = [];
const retrieveAllVoices = () => {
	return new Promise(resolve => {
		window.speechSynthesis.onvoiceschanged = function() {
			ALL_VOICES = window.speechSynthesis.getVoices();
			resolve();
		};
	});
};


const getVoice = (name) => {
	return window.speechSynthesis.getVoices().filter(voice => voice.voiceURI === name)[0];
};

const readMessage = (message, voice = "Google français") => {
	return new Promise(resolve => {
		window.utterances = []; // To fix the "onend not firing" bug

		const utterance = new SpeechSynthesisUtterance(message);
		utterance.pitch = 0.5;
		utterance.voice = getVoice(voice);
		utterance.lang = "fr-FR";
		utterance.onend = () => {
			resolve();
		};

		utterances.push( utterance ); // To fix the "onend not firing" bug
		window.speechSynthesis.speak(utterance);
	});
};