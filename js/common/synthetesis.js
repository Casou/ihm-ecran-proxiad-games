let ALL_VOICES = [];
const DEFAULT_VOICE = "French Female";

const readMessage = (message, voice = DEFAULT_VOICE, options = {}) => {
  return new Promise((resolve, reject) => {
    responsiveVoice.speak(message, getVoice(voice), {
      pitch : 0.5,
      ...options,
      onerror: (event) => reject(event),
      onend: () => resolve(),
    });
  });
};

const getVoice = (name) => {
  return ALL_VOICES.find(voice => voice.name === name) ? name : DEFAULT_VOICE;
};

const retrieveAllVoices = () => {
  return new Promise((resolve) => {
    responsiveVoice.OnVoiceReady = function() {
      ALL_VOICES = responsiveVoice.getVoices();
      resolve();
    };
  });
};
