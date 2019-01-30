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
			url: SERVER_URL + "parametres",
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
			<td>${ param.key }</td>
			<td>${ param.description }</td>
			<td>
				<div class="input-field">
					<input type="text" value="${ param.value }" onchange="updateParameter(${ param.id }, this.value);" />
				</div>
			</td>
		</tr>`)
	});
};

const updateParameter = (id, value) => {
	$.ajax({
		url: SERVER_URL + "parametres",
		type: "POST",
		data : JSON.stringify({ id, value }),
		contentType: "application/json",
		error: (xmlHttpRequest, textStatus, errorThrown) => {
			console.error("Status: " + textStatus);
			console.error("Error: " + errorThrown);
			alertDialog(textStatus);
		}
	});
};