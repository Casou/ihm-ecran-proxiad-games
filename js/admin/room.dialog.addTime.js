const ADD_TIME_REGEX = /^-?\d{2}:\d{2}:\d{2}$/;

const openAddTimeDialog = roomId => {
  $('#roomAddTimeDialog select').html(ALL_VOICES.map(voice =>
    `<option ${voice.name === "French Female" && "selected"} value="${voice.name}">${voice.name}</option>`
  ));

  $('#roomAddTimeDialog').dialog({
    resizable: false,
    height: "auto",
    minHeight: 300,
    width: 400,
    modal: true,
    autoOpen: true,
    dialogClass: "room-add-time-dialog",
    close: () => {
      renderRoomTab();
    },
    buttons: [
      {
        text: "Ajouter du temps",
        click: () => addTimeToRoom(roomId)
      },
      {
        text: "Fermer",
        'class': "default-button",
        click: function () {
          $(this).dialog("close");
        }
      }
    ],
    open: function () {
      $(this).parent()
        .children(".ui-dialog-buttonpane")
        .children(".ui-dialog-buttonset")
        .children("button:last-of-type")
        .focus();
    }
  });
};

const getAdditionalTimeValue = timeString => {
  const timeSplit = timeString.split(":");
  let coeff = 1;
  if (timeSplit[0].startsWith("-")) {
    timeSplit[0] = timeSplit[0].substring(1);
    coeff = -1;
  }
  return (parseInt(timeSplit[0]) * 60 * 60 + parseInt(timeSplit[1]) * 60 + parseInt(timeSplit[2])) * coeff;
};

const addTimeToRoom = (roomId) => {
  const timeString = $("#addTimeValue").val();
  const match = timeString.match(ADD_TIME_REGEX);
  if (!match) {
    errorDialog("La saisie du temps à ajouter est incorrecte.");
    return;
  }

  const time = getAdditionalTimeValue(timeString);
  if (!time) {
    errorDialog("Saisissez un temps.");
    return;
  }

  const message = $('#addTimeMessage').val();
  const voice = getVoice($("#roomAddTimeDialog .selectVoice").val());
  $.ajax({
    url: SERVER_URL + "room/modifyTime",
    type: "POST",
    data: JSON.stringify({roomId, time, message, voice}),
    contentType: "application/json",
    error: (xmlHttpRequest, textStatus, errorThrown) => {
      console.error("Status: " + textStatus);
      console.error("Error: " + errorThrown);
      reject(textStatus);
    }
  });
  $('#roomAddTimeDialog').dialog("close");
};

const checkAddTimeValue = value => {
  const match = value.match(ADD_TIME_REGEX);
  $("#addTimeValue").toggleClass("error", !match);
};

const testAddTimeMessage = () => {
  readMessage($('#addTimeMessage').val(), getVoice($("#roomAddTimeDialog .selectVoice").val()));
};
