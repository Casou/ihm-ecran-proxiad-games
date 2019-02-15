const receiveTroll = ({ reduceTime, message, videoName }, sendRequest) => {
	return new Promise(resolve => {
		$('#video video').fadeOut(500, () => {
			$('#video video').each((index, video) => { video.pause(); });
		});

		displayAndSynthesizeMessage([ message ], 0)
			.finally(() => {
			const jqTrollVideo = $('#video video#troll');
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

let TROLL_END = null;
const trollEnd = () => {
	readAllMessages([ TROLL_END.text ]);
};