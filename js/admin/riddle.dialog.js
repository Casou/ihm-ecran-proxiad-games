const changeRiddleDialogTab = (tabName) => {
  $(`#riddleDialog header li[tab=${tabName}]`).addClass("selected");
  $(`#riddleDialog header li:not([tab=${tabName}])`).removeClass("selected");
  $('.riddle_dialog_tab').addClass("hidden");
  $(`#riddle_dialog_${tabName}`).removeClass("hidden");
};

const renderRiddleDialog = (roomData) => {
  renderOpenDoorTab(roomData);
  renderRiddleTab(roomData);
  changeRiddleDialogTab('open_door_tab');
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