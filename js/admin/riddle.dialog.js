let RIDDLE_DIALOG_ROOM_ID = null;
const OPEN_DOOR_INPUT_REGEX = new RegExp("^[^\\*]*\\*[^,;]\\*[^\\*]*$"); // Check if the input is "Some word with one letter between *s*tars"
const OPEN_DOOR_CHAR_TO_NUMBERS = {
  "A" : "2",
  "B" : "22",
  "C" : "222",
  "D" : "3",
  "E" : "33",
  "F" : "333",
  "G" : "4",
  "H" : "44",
  "I" : "444",
  "J" : "5",
  "K" : "55",
  "L" : "555",
  "M" : "6",
  "N" : "66",
  "O" : "666",
  "P" : "7",
  "Q" : "77",
  "R" : "777",
  "S" : "7777",
  "T" : "8",
  "U" : "88",
  "V" : "888",
  "W" : "9",
  "X" : "99",
  "Y" : "999",
  "Z" : "9999",
};


const updateRiddleId = (roomId, id, riddleId) => {
  $.ajax({
    url: SERVER_URL + "riddle/" + id + "/riddleId",
    type: "PATCH",
    data: JSON.stringify({riddleId}),
    contentType: "application/json",
    success: () => {
      const roomData = ROOMS.find(r => r.id === roomId).roomData;
      const riddleIndex = roomData.riddles.findIndex(r => r.id === id);
      roomData.riddles[riddleIndex].riddleId = riddleId;
    },
    error: (xmlHttpRequest, textStatus, errorThrown) => {
      console.error("xmlHttpRequest: ", xmlHttpRequest);
      console.error("Status: ", textStatus);
      console.error("Error: ", errorThrown);
      errorDialog("Erreur lors de la mise à jour de l'énigme " + id + " : " + xmlHttpRequest.responseText);
    }
  });
};

const updateRiddlePassword = (roomId, id, riddlePassword) => {
  $.ajax({
    url: SERVER_URL + "riddle/" + id + "/riddlePassword",
    type: "PATCH",
    data: JSON.stringify({riddlePassword}),
    contentType: "application/json",
    success: () => {
      const roomData = ROOMS.find(r => r.id === roomId).roomData;
      const riddleIndex = roomData.riddles.findIndex(r => r.id === id);
      roomData.riddles[riddleIndex].riddlePassword = riddlePassword;
    },
    error: (xmlHttpRequest, textStatus, errorThrown) => {
      console.error("xmlHttpRequest: ", xmlHttpRequest);
      console.error("Status: ", textStatus);
      console.error("Error: ", errorThrown);
      errorDialog("Erreur lors de la mise à jour de l'énigme " + id + " : " + xmlHttpRequest.responseText);
    }
  });
};

const newRiddle = () => {
  $.ajax({
    url: SERVER_URL + "riddle",
    type: "PUT",
    data: JSON.stringify({roomId : RIDDLE_DIALOG_ROOM_ID}),
    contentType: "application/json",
    success: (newRiddle) => {
      const roomData = ROOMS.find(r => r.id === RIDDLE_DIALOG_ROOM_ID).roomData;
      roomData.riddles.push(newRiddle);
      renderRiddleDialog(roomData);
    },
    error: (xmlHttpRequest, textStatus, errorThrown) => {
      console.error("xmlHttpRequest: ", xmlHttpRequest);
      console.error("Status: ", textStatus);
      console.error("Error: ", errorThrown);
      errorDialog("Erreur lors de la création d'une nouvelle énigme : " + xmlHttpRequest.responseText);
    }
  });
};

const deleteRiddle = (id) => {
  confirmDialog("Etes-vous sûr de vouloir supprimer cette énigme ?", () => deleteRiddleCallback(id));
};
const deleteRiddleCallback = (id) => {
  $.ajax({
    url: SERVER_URL + "riddle/" + id,
    type: "DELETE",
    success: () => {
      const roomData = ROOMS.find(r => r.id === RIDDLE_DIALOG_ROOM_ID).roomData;
      roomData.riddles = roomData.riddles.filter(r => r.id !== id);
      renderRiddleDialog(roomData);
    },
    error: (xmlHttpRequest, textStatus, errorThrown) => {
      console.error("xmlHttpRequest: ", xmlHttpRequest);
      console.error("Status: ", textStatus);
      console.error("Error: ", errorThrown);
      errorDialog("Erreur lors de la suppression de l'énigme " + id + " : " + xmlHttpRequest.responseText);
    }
  });
};


const renderRiddleLine = (riddle) => {
  const icon = riddle.type === "OPEN_DOOR" ? "exit_to_app" : "lock_outline";
  return `<tr>
            <td>
              <a id="edit_riddle_icon_${riddle.id}"
                title="Type : ${riddle.type}" 
                class="material-icons riddle-icon">
                ${icon}
              </a>
            </td>
            <td>
              <div class="input-field">
                ${riddle.type === "OPEN_DOOR" ?
                    riddle.riddleId :
                    `<input type="text"
                        id="edit_riddle_id_${ riddle.id }" 
                        value="${ riddle.riddleId }"
                        placeholder="Id obligatoire"
                        onChange="updateRiddleId(${RIDDLE_DIALOG_ROOM_ID}, ${riddle.id}, this.value)" />`
                  }
							</div>
            </td>
            <td>
              <div class="input-field">
								<input type="text"
										id="edit_riddle_pwd_${ riddle.id }" 
										value="${ riddle.riddlePassword || "" }"
										placeholder="Mot de passe obligatoire"
										onChange="updateRiddlePassword(${RIDDLE_DIALOG_ROOM_ID}, ${riddle.id}, this.value)" />
							</div>
            </td>
            <td>
                ${ riddle.type === "OPEN_DOOR" ? "" :
                    `<a onClick="deleteRiddle(${riddle.id})" title="Supprimer l'énigme">
                    <i class="material-icons delete-button full_button">delete_forever</i>
                  </a>`
                }
            </td>
          </tr>
          `;
};

const updateOpenDoorProfile = (id, value) => {
  if (updateOpenDoorProfileClasses(id, value)) {
    updatePlayerProfilesData(id, value);
    generateCode();
  } else {
    $("#open_riddle_suggested_password").val("ERROR");
  }
};

const updateOpenDoorProfileClasses = (id, value) => {
  const input = $('#open_door_input_' + id);
  const letterTd = $('#open_door_letter_' + id);
  const positionTd = $('#open_door_position_' + id);
  const copyButton = $('#open_riddle_copy_suggested_password');
  if (!OPEN_DOOR_INPUT_REGEX.test(value)) {
    input.addClass("error");
    letterTd.html("?");
    positionTd.html("?");
    copyButton.attr("disabled", true);
    return false;
  }
  input.removeClass("error");
  letterTd.html(value.substring(value.indexOf("*") + 1, value.lastIndexOf("*")).toUpperCase());
  positionTd.html(value.indexOf("*") + 1);
  copyButton.attr("disabled", false);

  return true;
};

const getOpenDoorInputLetter = value => {
  return value.substring(value.indexOf("*") + 1, value.lastIndexOf("*")).toUpperCase();
};

const getOpenDoorInputPosition = value => {
  return value.indexOf("*") + 1;
};

const updatePlayerProfilesData = (id, value) => {
  formatPlayerProfile(ROOMS.find(r => r.id === RIDDLE_DIALOG_ROOM_ID).roomData, { id, name : value });
};

const formatPlayerProfile = (roomData, profile) => {
  // TODO Appel Ajax
  const profileIndex = roomData.playerProfiles.findIndex(p => p.id === profile.id);
  roomData.playerProfiles[profileIndex].name = profile.name;
  roomData.playerProfiles[profileIndex].letter = getOpenDoorInputLetter(profile.name);
  roomData.playerProfiles[profileIndex].position = getOpenDoorInputPosition(profile.name);
};

const generateCode = () => {
  const roomData = ROOMS.find(r => r.id === RIDDLE_DIALOG_ROOM_ID).roomData;
  const playerProfiles = roomData.playerProfiles;
  const code = playerProfiles.sort((a, b) => a.position - b.position)
    .map(profile => OPEN_DOOR_CHAR_TO_NUMBERS[profile.letter])
    .join("");
  $("#open_riddle_suggested_password").val(code);
};

const copyCode = () => {
  if ($("#open_riddle_copy_suggested_password").attr("disabled")) {
    return;
  }
  $("#open_riddle_password").val($("#open_riddle_suggested_password").val());
};

const changeRiddleDialogTab = (tabName) => {
  $(`#riddleDialog header li[tab=${tabName}]`).addClass("selected");
  $(`#riddleDialog header li:not([tab=${tabName}])`).removeClass("selected");
  $('.riddle_dialog_tab').addClass("hidden");
  $(`#riddle_dialog_${tabName}`).removeClass("hidden");
};

const renderPlayerLine = (playerProfile) => {
  return `<tr>
            <td>
              <div class="input-field">
                <input id="open_door_input_${playerProfile.id}"
                       type="text"
                       value="${playerProfile.name}"
                       onChange="updateOpenDoorProfile(${playerProfile.id}, this.value)"
                        />
              </div>
            </td>
            <td id="open_door_letter_${playerProfile.id}" class="open_door_letter"></td>
            <td id="open_door_position_${playerProfile.id}" class="open_door_position"></td>
          </tr>
          `;
};

const renderRiddleDialog = (roomData) => {
  const open_door_riddle = roomData.riddles.find(r => r.type === "OPEN_DOOR");
  changeRiddleDialogTab('open_door_tab');

  const roomIndex = ROOMS.findIndex(r => r.id === roomData.id);
  roomData.playerProfiles = [
    { id: 354351534, name : 'Testeur *f*ou' },
    { id: 83743654, name : 'Coach agile Wa*t*erfall' },
    { id: 5735438, name : 'Dévelop*p*eur novice' },
    { id: 64341350, name : 'PO drog*u*é au café' },
    { id: 5435035, name : 'Chef de proj*e*t paniqué' },
    { id: 254214235, name : 'Scrum M*y*stère' }
  ];
  ROOMS[roomIndex].roomData = roomData;
  $('#riddle_dialog_open_door_tab')
    .html(
    `
      <div id="riddle_dialog_open_door_code_div">
        <div class="input-field">
            <input type="text"
                   id="open_riddle_password"
                   value="${ open_door_riddle.riddlePassword }"
                   placeholder="Password porte (chiffres uniquement)"
                   onChange=""
                    />
        </div>
        <div class="input-field">
            <input type="text"id="open_riddle_suggested_password"
                    readonly="readonly" 
                    placeholder="Code généré"
                    class="materialize-textarea"/>
            <i id="open_riddle_copy_suggested_password"
                title="Copier le code généré" 
                class="material-icons prefix"
                onClick="copyCode()"
                >
              vertical_align_top
            </i>
        </div>
      </div>
      <table>
        <thead>
          <tr>
              <th>Job</th>
              <th class="open_door_letter">Lettre</th>
              <th class="open_door_position">Position</th>
          </tr>
        </thead>
        <tbody>
          ${ roomData.playerProfiles.map(renderPlayerLine).join("") }
        </tbody>
    </table>
    `
  );
  $('#riddle_dialog_game_tab')
    .html(
    `<table>
        <thead>
          <tr>
              <th>Type</th>
              <th>Id</th>
              <th>Password</th>
              <th> </th>
          </tr>
        </thead>
        <tbody>
          ${ roomData.riddles && 
              roomData.riddles
                .filter(r => r.type === "GAME")
                .sort((a, b) => a.id - b.id)
                .map(renderRiddleLine).join("") }
        </tbody>
      </table>`
  );

  roomData.playerProfiles.forEach(profile => {
    updateOpenDoorProfileClasses(profile.id, profile.name);
    formatPlayerProfile(roomData, profile);
  });
  generateCode();
};

const openRiddles = (roomId) => {
  RIDDLE_DIALOG_ROOM_ID = roomId;
  const roomData = ROOMS.find(r => r.id === RIDDLE_DIALOG_ROOM_ID).roomData;

  renderRiddleDialog(roomData);

  $('#riddleDialog').dialog({
    resizable: false,
    height: "auto",
    minHeight: 450,
    width: 600,
    modal: true,
    autoOpen: true,
    dialogClass: "riddles-dialog",
    close: () => {
      renderRoomTab();
    },
    buttons: [
      {
        text: "Ajouter une énigme",
        click: newRiddle
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
      $(this).parent().children(".ui-dialog-titlebar").hide();
      $(this).parent()
        .children(".ui-dialog-buttonpane")
        .children(".ui-dialog-buttonset")
        .children("button:last-of-type")
        .focus();
    }
  });
};