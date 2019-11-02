const retrieveAllRooms = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: SERVER_URL + "room",
      type: "GET",
      success: (rooms) => {
        ALL_ROOMS = rooms;

        $("#configuration_select").html("<option value=''>Choisir une salle</option>");

        const room = rooms.find(r => r.id === ROOM_ID);

        $("#configuration_select")
          .append(rooms.map(room => `<option value="${ room.id }" ${ room.id === ROOM_ID && "selected" }>${ room.name }</option>`)
            .join("")
          );

        if (!room) {
          ROOM_ID = null;
          showRoomConfiguration();
        } else {
          updateWithRoom(room);
        }

        resolve(rooms);
      },
      error: (xmlHttpRequest, textStatus, errorThrown) => {
        console.error("Status: " + textStatus);
        console.error("Error: " + errorThrown);
        reject(textStatus);
      }
    });
  });
};

const chooseRoom = (value) => {
  ROOM_ID = parseInt(value);

  const room = ALL_ROOMS.find(r => r.id === ROOM_ID);
  if (!room) {
    ROOM_ID = null;
    showRoomConfiguration();
    WEBSOCKET_CLIENT.headers = {"Room": ROOM_ID};
    localStorage.removeItem("roomId");
    return;
  }
  WEBSOCKET_CLIENT.headers = {"Room": ROOM_ID};
  localStorage.setItem("roomId", ROOM_ID);

  updateWithRoom(room);

  WEBSOCKET_CLIENT.restart();
};

const updateWithRoom = (room) => {
  $("#room_name").html(room.name);
  AUDIO_BACKGROUND_VOLUME = room.audioBackgroundVolume;
  updateGlitch(room.riddles.filter(r => r.type === 'GAME' && r.resolved).length);
};

$(document).keydown(function (e) {
  if (!MANDATORY_OK) return;
  // Any letter
  if (e.keyCode >= 65 && e.keyCode <= 90) showRoomConfiguration();
  // Escape
  if (e.keyCode === 27) hideRoomConfiguration();
});

const showRoomConfiguration = () => {
  $('body').addClass("show_cursor");
  $('#configuration')[0].show();
};
const hideRoomConfiguration = () => {
  $('body').removeClass("show_cursor");
  $('#configuration')[0].close();
};

const updateCurrentRoomData = () => {
  if (!ROOM_ID) {
    COMPTEUR.stopTime();
    return;
  }

  const room = ALL_ROOMS.filter(r => r.id === ROOM_ID)[0];
  if (room.startTime) {
    if (room.statusTime === "STARTED") {
      // let startTimeDate = parseJavaLocalDateTimeToJsDate(room.startTime);
      let startTimeDate = new Date(room.startTime);
      const remainingTime = calculateRemainingTime(startTimeDate, room.remainingTime);
      COMPTEUR.initTimer(remainingTime, room.remainingTime, startTimeDate);
      COMPTEUR.startTime();
    } else if (room.statusTime === "PAUSED") {
      COMPTEUR.isStarted = true;
      COMPTEUR.initTimer(room.remainingTime);
      COMPTEUR.pauseTime();
    }
    COMPTEUR.render();
  }
};

const reinitRoom = () => {
  const savedServerUrl = localStorage.getItem("serverUrl");
  localStorage.clear();
  localStorage.setItem("roomId", ROOM_ID);
  localStorage.setItem("serverUrl", savedServerUrl);
  window.location.reload(false);
};