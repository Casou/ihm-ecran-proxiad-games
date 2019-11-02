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

const updateProfileName = (id, value) => {
  updateProfile(id, value).then(() => {
    formatPlayerProfile(ROOMS.find(r => r.id === RIDDLE_DIALOG_ROOM_ID).roomData, { id, name : value });
    checkErrorsForAllProfiles();
    generateCode();
    renderOpenDoorProfileTable();
  });
};
const getOpenDoorInputLetter = value => {
  if (!OPEN_DOOR_INPUT_REGEX.test(value)) {
    return null;
  }
  return value.substring(value.indexOf("*") + 1, value.lastIndexOf("*")).toUpperCase();
};

const getOpenDoorInputPosition = value => {
  if (!OPEN_DOOR_INPUT_REGEX.test(value)) {
    return null;
  }
  return value.replace(" ", "").indexOf("*") + 1;
};

const formatPlayerProfile = (roomData, newProfile) => {
  const profile = roomData.playerProfiles.find(p => p.id === newProfile.id);

  profile.name = newProfile.name;
  profile.letter = getOpenDoorInputLetter(newProfile.name);
  profile.code = profile.letter ? OPEN_DOOR_CHAR_TO_NUMBERS[profile.letter] : null;
  profile.position = getOpenDoorInputPosition(newProfile.name);
};

const checkErrorsForAllProfiles = () => {
  const roomData = ROOMS.find(r => r.id === RIDDLE_DIALOG_ROOM_ID).roomData;
  roomData.playerProfiles.forEach(profile => {
    profile.errorLetter = !OPEN_DOOR_INPUT_REGEX.test(profile.name);
    profile.errorPosition = !profile.position;
    const hasSamePositionProfiles = roomData.playerProfiles.find(p => profile.id !== p.id && profile.position && profile.position === p.position);
    if (hasSamePositionProfiles) {
      profile.errorPosition = true;
    }
  });
};

const generateCode = () => {
  const roomData = ROOMS.find(r => r.id === RIDDLE_DIALOG_ROOM_ID).roomData;
  const playerProfiles = roomData.playerProfiles;
  if (!playerProfiles) {
    return;
  }
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
  $("#open_riddle_password").change();
};

const renderPlayerLine = (playerProfile) => {
  return `<tr>
            <td>
              <div class="input-field">
                <input id="open_door_input_${playerProfile.id}"
                       type="text"
                       value="${playerProfile.name}"
                       onChange="updateProfileName(${playerProfile.id}, this.value)"
                        />
              </div>
            </td>
            <td id="open_door_letter_${playerProfile.id}" class="open_door_letter ${playerProfile.errorLetter && "error"}">
              ${playerProfile.letter || "?"}
            </td>
            <td id="open_door_code_${playerProfile.id}" class="open_door_code ${playerProfile.errorLetter && "error"}">
              ${playerProfile.code || "?"}
            </td>
            <td id="open_door_position_${playerProfile.id}" class="open_door_position ${playerProfile.errorPosition && "error"}">
              ${playerProfile.position || "?"}
            </td>
            <td id="open_door_delete_${playerProfile.id}">
              <a onClick="deleteProfile(${playerProfile.id})" title="Supprimer le profil">
                <i class="material-icons delete-button full_button">delete_forever</i>
              </a>
            </td>
          </tr>
          `;
};

const sortProfiles = () => {
  const roomData = ROOMS.find(r => r.id === RIDDLE_DIALOG_ROOM_ID).roomData;
  roomData.playerProfiles = roomData.playerProfiles.sort((a, b) => a.position - b.position);
};

const renderOpenDoorProfileTable = () => {
  const roomData = ROOMS.find(r => r.id === RIDDLE_DIALOG_ROOM_ID).roomData;
  $('#riddle_dialog_open_door_tab table tbody').html(roomData.playerProfiles.map(renderPlayerLine).join(""))
};

const renderOpenDoorTab = (roomData) => {
  const open_door_riddle = roomData.riddles.find(r => r.type === "OPEN_DOOR");

  if (!roomData.playerProfiles) {
    errorDialog("Erreur : la salle ne contient pas de profil de joueurs (playerProfiles). La liste est nulle");
    return;
  }

  $('#riddle_dialog_open_door_tab')
    .html(
    `
      <div id="riddle_dialog_open_door_code_div">
        <div class="input-field">
            <input type="text"
                   id="open_riddle_password"
                   value="${ open_door_riddle.riddlePassword || ''}"
                   placeholder="Password porte (chiffres uniquement)"
                   onChange="updateOpenDoorCode(this.value)"
                    />
            <a id="open_riddle_go_to_badges"
                title="Aller à page de génération des badges" 
                class="material-icons prefix"
                href="/badge?roomId=${roomData.id}"
                target="__blank"
                >
              open_in_new
            </a>
        </div>
        <div class="input-field">
            <input type="text"
                   id="open_riddle_suggested_password"
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
              <th>Profil</th>
              <th class="open_door_letter">Lettre</th>
              <th class="open_door_code">Code</th>
              <th class="open_door_position">Position</th>
              <th> </th>
          </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    `
  );
  roomData.playerProfiles.forEach(profile => {
    formatPlayerProfile(roomData, profile);
  });
  sortProfiles();
  checkErrorsForAllProfiles();
  generateCode();

  renderOpenDoorProfileTable();
};

const newProfile = (roomId) => {
  $.ajax({
    url: SERVER_URL + "player-profile",
    type: "PUT",
    data: JSON.stringify({roomId}),
    contentType: "application/json",
    success: (newRiddle) => {
      const roomData = ROOMS.find(r => r.id === RIDDLE_DIALOG_ROOM_ID).roomData;
      roomData.playerProfiles.push(newRiddle);
      renderOpenDoorTab(roomData);
    },
    error: (xmlHttpRequest, textStatus, errorThrown) => {
      console.error("xmlHttpRequest: ", xmlHttpRequest);
      console.error("Status: ", textStatus);
      console.error("Error: ", errorThrown);
      errorDialog("Erreur lors de la création d'un nouveau profil : " + xmlHttpRequest.responseText);
    }
  });
};

const updateProfile = (id, name) => {
  $('.ui-dialog-buttonset button').attr('disabled', true);
  return $.ajax({
    url: SERVER_URL + "player-profile/" + id,
    type: "PATCH",
    data: JSON.stringify({name}),
    contentType: "application/json",
    success: () => {
      const roomData = ROOMS.find(r => r.id === RIDDLE_DIALOG_ROOM_ID).roomData;
      const profileIndex = roomData.playerProfiles.findIndex(r => r.id === id);
      roomData.playerProfiles[profileIndex].name = name;
    },
    error: (xmlHttpRequest, textStatus, errorThrown) => {
      console.error("xmlHttpRequest: ", xmlHttpRequest);
      console.error("Status: ", textStatus);
      console.error("Error: ", errorThrown);
      errorDialog("Erreur lors de la mise à jour du profil " + id + " : " + xmlHttpRequest.responseText);
    },
    complete: () => {
      $('.ui-dialog-buttonset button').attr('disabled', false);
    }
  });
};


const deleteProfile = (id) => {
  confirmDialog("Etes-vous sûr de vouloir supprimer ce profil ?", () => deleteProfileCallback(id));
};

const deleteProfileCallback = (id) => {
  $.ajax({
    url: SERVER_URL + "player-profile/" + id,
    type: "DELETE",
    success: () => {
      const roomData = ROOMS.find(r => r.id === RIDDLE_DIALOG_ROOM_ID).roomData;
      roomData.playerProfiles = roomData.playerProfiles.filter(r => r.id !== id);
      renderOpenDoorTab(roomData);
    },
    error: (xmlHttpRequest, textStatus, errorThrown) => {
      console.error("xmlHttpRequest: ", xmlHttpRequest);
      console.error("Status: ", textStatus);
      console.error("Error: ", errorThrown);
      errorDialog("Erreur lors de la suppression du profil " + id + " : " + xmlHttpRequest.responseText);
    }
  });
};

const updateOpenDoorCode = (value) => {
  const roomData = ROOMS.find(r => r.id === RIDDLE_DIALOG_ROOM_ID).roomData;
  const open_door_riddle = roomData.riddles.find(r => r.type === "OPEN_DOOR");
  updateRiddlePassword(RIDDLE_DIALOG_ROOM_ID, open_door_riddle.id, value);
};
