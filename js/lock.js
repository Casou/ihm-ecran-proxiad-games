let CODE = "";
let BLINK_COUNT = null;
let ROOM_NAME = localStorage.getItem("roomName") || "";
let ROOM_ID = null;

const addNumber = (number) => {
  CODE += number;
  refreshDisplay();
};

const backSpace = () => {
  CODE = CODE.substring(0, CODE.length - 1)
  refreshDisplay();
};

const validateCode = () => {
  return $.ajax({
    url: SERVER_URL + "open-door",
    type: "POST",
    data: JSON.stringify({roomId: ROOM_ID, riddlePassword: CODE}),
    contentType: "application/json",
    success: () => {
      successCode();
    },
    error: () => {
      failedCode();
    }
  });
};

document.onkeydown = e => {
  if (BLINK_COUNT) {
    return;
  }
  const key = e.key;
  if (key >= '0' && key <= '9') {
    addNumber(parseInt(key));
    return;
  }
  if (key === 'Backspace') {
    backSpace();
    return;
  }
  if (key === 'Enter') {
    validateCode();
    return;
  }
};

const refreshDisplay = () => {
  $('#digital_screen_lcd')
    .toggleClass('placeholder', !CODE)
    .html(CODE || 'Enter code');
};

const failedCode = () => {
  CODE = 'Wrong code';
  BLINK_COUNT = 0;
  blinkRedLight();
  refreshDisplay();
};

const blinkRedLight = () => {
  BLINK_COUNT++;
  document.querySelectorAll('.red_led').forEach(img => img.src = 'resources/images/light-black.png');
  setTimeout(() => {
    document.querySelectorAll('.red_led').forEach(img => img.src = 'resources/images/light-red.png');
    if (BLINK_COUNT < 30) {
      setTimeout(blinkRedLight, 150);
    } else {
      BLINK_COUNT = null;
      CODE = '';
      refreshDisplay();
    }
  }, 150);
};

const successCode = () => {
  CODE = 'Access granted';
  BLINK_COUNT = 99999;
  document.querySelectorAll('.red_led').forEach(img => img.src = 'resources/images/light-black.png');
  document.querySelectorAll('.green_led').forEach(img => img.src = 'resources/images/light-green.png');
  refreshDisplay();
};

const testSettings = () => {
  SERVER_URL = $('#server_url_input').val();
  localStorage.setItem("serverUrl", SERVER_URL);
  ROOM_NAME = $('#room_name_input').val();
  localStorage.setItem("roomName", ROOM_NAME);
  ping()
    .then(() => {
      retrieveRoomsData().then(rooms => {
        const roomName = $('#room_name_input').val();
        const room = rooms.find(r => r.name.toLowerCase() === roomName.toLowerCase());
        if (room) {
          ROOM_ID = room.id;
          $('label[for=room_name_input]').removeClass("error");
          $('label[for=server_url_input]').removeClass("error");
          toggleSettings(true);
        } else {
          console.error("Error : no room with name.");
          $('label[for=room_name_input]').addClass("error");
          toggleSettings(false);
        }
      })
        .catch(() => {
          console.error("Error while retrieving rooms.");
          $('label[for=server_url_input]').addClass("error");
          toggleSettings(false);
        })
    })
    .catch(() => {
      console.error("Ping failed. You should update the server url.");
      $('label[for=server_url_input]').addClass("error");
      toggleSettings(false);
    });
};

const toggleSettings = settingsOk => {
  $('#settings').toggleClass("hidden", settingsOk);
  $('#digital_pad').toggleClass("hidden", !settingsOk);
};

refreshDisplay();
$('#server_url_input').val(SERVER_URL);
$('#room_name_input').val(ROOM_NAME);

testSettings();

