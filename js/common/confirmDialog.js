const confirmDialog = (text, confirmCallback) => {
	$("#confirmDialog").html(text).dialog({
		resizable: false,
		height: "auto",
		width: 400,
		modal: true,
		autoOpen: true,
		buttons: {
			"Cancel": function() {
				$(this).dialog("close").dialog("destroy");
			},
			"OK": function() {
				confirmCallback();
				$(this).dialog("close").dialog("destroy");
			}
		}
	});
};