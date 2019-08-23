let ALL_VOICES = [];
const DEFAULT_VOICE_NAME = "French Female";

const readMessage = (message, voice = getVoice(DEFAULT_VOICE_NAME)) => {
  return new Promise((resolve, reject) => {
    responsiveVoice.speak(message, voice.name, {
      ...voice,
      onerror: (event) => reject(event),
      onend: () => resolve(),
    });
  });
};

const getVoice = (name) => {
  return ALL_VOICES.find(voice => voice.name === name)
    || ALL_VOICES.find(voice => voice.name === DEFAULT_VOICE_NAME);
};

const retrieveAllVoices = () => {
  return new Promise((resolve) => {
    responsiveVoice.OnVoiceReady = function() {
      ALL_VOICES = responsiveVoice.getVoices();

      $.ajax({
        url: SERVER_URL + "voice",
        type: "GET",
        success: (voices_in_bdd) => {
          ALL_VOICES = ALL_VOICES.map(voice => {
            const index = voices_in_bdd.findIndex(v => v.name === voice.name);
            if (index >= 0) {
              return { ...voice, ...voices_in_bdd[index] };
            } else {
              return { ...voice, pitch : 1, rate : 1, volume : 1 };
            }
          });
        },
        error: (xmlHttpRequest, textStatus, errorThrown) => {
          console.error("Status: " + textStatus);
          console.error("Error: " + errorThrown);
        },
        complete:() => {
          resolve(ALL_VOICES);
        }
      });
    };
  });
};
