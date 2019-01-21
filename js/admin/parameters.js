const retrieveLocalParameters = () => {
	return new Promise(resolve => {
		$('#local_params table tbody').html("");

		$('#local_params table tbody').append(`
		<tr id="local_params__server_url">
			<td>URL du serveur</td>
			<td>
				<input type="text" value="${ SERVER_URL }" onChange="updateServerURL(this.value);" />
				<span class="icon status"></span>
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
	ping().then(() => iconStatus.addClass("ok"))
		.catch(() => iconStatus.addClass("ko"));
};


const retrieveServerParameters = () => {
	return new Promise(resolve => {
		$.ajax({
			url: SERVER_URL + "parametres",
			type: "GET",
			success: (parametres) => {
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
			<td><input type="text" value="${ param.value }" onchange="updateParameter(${ param.id }, this.value);" /></td>
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