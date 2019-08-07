const confirmDialog = (text, confirmCallback) => {
  $("#confirmDialog").attr("title", "Confirmation").html(text).dialog({
    resizable: false,
    height: "auto",
    minHeight: 250,
    width: 600,
    modal: true,
    autoOpen: true,
    buttons: {
      "Cancel": function () {
        $(this).dialog("close").dialog("destroy");
      },
      "OK": function () {
        confirmCallback();
        $(this).dialog("close").dialog("destroy");
      }
    }
  });
};

const errorDialog = (text) => {
  alertDialog(text, "Erreur", "error-dialog")
};


const alertDialog = (text, title = "Information", dialogClass = "info") => {
  $("#confirmDialog").attr("title", title).html(text).dialog({
    resizable: false,
    height: "auto",
    minHeight: 250,
    width: 600,
    modal: true,
    autoOpen: true,
    dialogClass,
    buttons: {
      "OK": function () {
        $(this).dialog("close").dialog("destroy");
      }
    }
  });
};

