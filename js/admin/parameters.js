let PARAMETERS = [];
let PARAMETERS_COMPONENT = null;

const setParameters = (serverParameters) => {
	PARAMETERS_COMPONENT = new Pamameters("#params", serverParameters);
	PARAMETERS_COMPONENT.renderAndApply();
};

const updateServerURL = (newValue) => {
	SERVER_URL = newValue;
	localStorage.setItem("serverUrl", SERVER_URL);

	let iconStatus = $("#local_params__server_url .icon.status");
	iconStatus.removeClass("ok").removeClass("ko");
	ping()
		.then(() => {
			iconStatus.addClass("ok").html("check");
			$("#local_params__server_url input").addClass("valid").removeClass("invalid");
		})
		.catch(() => {
			iconStatus.addClass("ko").html("close");
			$("#local_params__server_url input").removeClass("valid").addClass("invalid");
		});
};


const retrieveServerParameters = () => {
	return new Promise(resolve => {
		$.ajax({
			url: SERVER_URL + "parametre",
			type: "GET",
			success: (parametres) => {
				PARAMETERS = [];
				parametres.forEach(p => PARAMETERS[p.key] = p);
				resolve(parametres);
			},
			error: (xmlHttpRequest, textStatus, errorThrown) => {
				console.error("Status: " + textStatus);
				console.error("Error: " + errorThrown);
				reject(textStatus);
			}
		});
	});
};

const updateParameter = (id, value) => {
	$.ajax({
		url: SERVER_URL + "parametre",
		type: "PATCH",
		data : JSON.stringify({ id, value }),
		contentType: "application/json",
		success: () => {
			const key = Object.values(PARAMETERS).find(p => p.id === id).key;
			PARAMETERS[key].value = value;

			IA_PARAMETERS.renderAndApply();
		},
		error: (xmlHttpRequest, textStatus, errorThrown) => {
			console.error("Status: " + textStatus);
			console.error("Error: " + errorThrown);
			errorDialog(textStatus);
		}
	});
};