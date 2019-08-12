const confirmDialog = (text, confirmCallback) => {
  alertDialog(text, "Confirmation", "info-dialog", [
      {
        text: "Annuler",
        click: function () {
          $(this).dialog("close").dialog("destroy");
        }
      },
      {
        text: "OK",
        'class': "default-button",
        click: function () {
          confirmCallback();
          $(this).dialog("close").dialog("destroy");
        }
      }
    ]
  );
};

const errorDialog = (text) => {
  alertDialog(text, "Erreur", "error-dialog", [{
      text: "OK",
      click: function () {
        $(this).dialog("close").dialog("destroy");
      }
    }]
  );
};


const alertDialog = (text, title = "Information", dialogClass = "info", buttons = []) => {
  $("#confirmDialog").attr("title", title).html(text).dialog({
    resizable: false,
    height: "auto",
    minHeight: 250,
    width: 600,
    modal: true,
    autoOpen: true,
    dialogClass: "custom-dialog " + dialogClass,
    buttons,
    open: function () {
      $(this).parent()
        .children(".ui-dialog-buttonpane")
        .children(".ui-dialog-buttonset")
        .children("button:last-of-type")
        .focus();
    }
  });
};

