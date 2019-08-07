let PARAMETERS = [];

const retrieveLocalParameters = () => {
	return new Promise(resolve => {
		$('#local_params table tbody').html("");

		$('#local_params table tbody').append(`
		<tr id="local_params__server_url">
			<td>URL du serveur</td>
			<td>
				<div class="input-field">
					<input type="text" value="${ SERVER_URL }" onChange="updateServerURL(this.value);" />
					<i class="material-icons icon status"></i>
				</div>
			</td>
		</tr>`);
		updateServerURL(SERVER_URL);

		resolve();
	});
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

const renderParameters = (parameters) => {
	$("#server_params table tbody").html("");

	parameters.forEach((param) => {
		$("#server_params table tbody").append(`
		<tr>
			<td class="parameter_id tooltip" title="${ param.key }">${ param.key }</td>
			<td class="parameter_description">${ param.description }</td>
			<td class="parameter_value">
				<div class="input-field">
					${ renderInput(param) }
				</div>
			</td>
		</tr>`)
	});

	$("#server_params .tooltip").tooltipster();
};

const renderInput = (parameter) => {
	if (parameter.type === 'FIELDSET') {
		const css = parameter.optionals === 'terminal-style' ? 'terminal' : "";

		return `<textarea onchange="updateParameter(${ parameter.id }, this.value);"
											class="${ css }"
						>${ parameter.value }</textarea>`;
	}
	if (parameter.type === 'NUMBER') {
		return `<input type="number" value="${ parameter.value }" onchange="updateParameter(${ parameter.id }, this.value);" />`;
	}
	return `<input type="text" value="${ parameter.value }" onchange="updateParameter(${ parameter.id }, this.value);" />`;
};

const updateParameter = (id, value) => {
	$.ajax({
		url: SERVER_URL + "parametre",
		type: "PATCH",
		data : JSON.stringify({ id, value }),
		contentType: "application/json",
		success: () => {
			const key = Object.values(PARAMETERS).find(p => p.id === 1).key;
			PARAMETERS[key].value = value;
		},
		error: (xmlHttpRequest, textStatus, errorThrown) => {
			console.error("Status: " + textStatus);
			console.error("Error: " + errorThrown);
			errorDialog(textStatus);
		}
	});
};