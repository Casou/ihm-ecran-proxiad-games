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