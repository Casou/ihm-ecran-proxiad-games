let VOICES_COMPONENT = null;

const setVoicesComponent = () => {
  VOICES_COMPONENT = new Voices("#voices_list");
};

const testVoice = (voiceName) => {
  readMessage($("#voices_test_input input").val(), getVoice(voiceName));
};

const updateVoiceProp = (voiceName, propName, propValue) => {
  const index = ALL_VOICES.findIndex(v => v.name === voiceName);
  const voice = ALL_VOICES[index];
  voice[propName] = parseFloat(propValue);

  $.ajax({
    url: SERVER_URL + "voice",
    type: "PATCH",
    data : JSON.stringify(voice),
    contentType: "application/json",
    error: (xmlHttpRequest, textStatus, errorThrown) => {
      console.error("xmlHttpRequest: ", xmlHttpRequest);
      console.error("Status: ", textStatus);
      console.error("Error: ", errorThrown);
      errorDialog("Erreur lors de la mise à jour de la voix " + voiceName + " : " + xmlHttpRequest.responseText);
    }
  });
};
