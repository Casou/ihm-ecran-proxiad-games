const receiveTroll = ({ reduceTime, message, videoName }, sendRequest) => {
	return new Promise(resolve => {
		$('#video video').fadeOut(500, () => {
			$('#video video').each((index, video) => { video.pause(); });
		});

		displayAndSynthesizeMessage([ message ], 0).then(() => {
			const jqTrollVideo = $('#video video');
			jqTrollVideo.attr("src", "resources/videos/" + videoName);
			jqTrollVideo[0].currentTime = 0;
			jqTrollVideo.show();
			jqTrollVideo[0].play();
			sendRequest();
			COMPTEUR.animateReduceTime(reduceTime)
				.then(resolve);
		});
	});
};

const trollEnd = () => {
	const messages = ["Il est trop tard pour vous.", "J'ai totalement effacé votre existence numérique et la police est là.", "Merci de nous avoir presque amusé."];
	readAllMessages(messages);
};