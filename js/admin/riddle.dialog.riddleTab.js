const updateRiddleId = (roomId, id, riddleId) => {
  $('.ui-dialog-buttonset button').attr('disabled', true);
  return $.ajax({
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
    },
    complete: () => {
      $('.ui-dialog-buttonset button').attr('disabled', false);
    }
  });
};

const updateRiddlePassword = (roomId, id, riddlePassword) => {
  $('.ui-dialog-buttonset button').attr('disabled', true);
  return $.ajax({
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
    },
    complete: () => {
      $('.ui-dialog-buttonset button').attr('disabled', false);
    }
  });
};

const newRiddle = (roomId) => {
  return $.ajax({
    url: SERVER_URL + "riddle",
    type: "PUT",
    data: JSON.stringify({roomId}),
    contentType: "application/json",
    success: (newRiddle) => {
      const roomData = ROOMS.find(r => r.id === RIDDLE_DIALOG_ROOM_ID).roomData;
      roomData.riddles.push(newRiddle);
      renderRiddleTab(roomData);
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
      renderRiddleTab(roomData);
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
              <a onClick="deleteRiddle(${riddle.id})" title="Supprimer l'énigme">
                <i class="material-icons delete-button full_button">delete_forever</i>
              </a>
            </td>
          </tr>
          `;
};

const renderRiddleTab = (roomData) => {
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
};
