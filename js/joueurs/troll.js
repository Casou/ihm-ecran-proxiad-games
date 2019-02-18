const receiveTroll = ({ reduceTime, message, voice, videoName }, sendRequest) => {
	console.log("troll", message, voice);
	return new Promise(resolve => {
		muteAudioBackground();
		$('#video video').fadeOut(500, () => {
			$('#video video').each((index, video) => { video.pause(); });
		});

		displayAndSynthesizeMessage({ message, voice }, 0)
			.finally(() => {
				const jqTrollVideo = $('#video video#troll');
				jqTrollVideo.attr("src", "resources/videos/" + videoName);
				jqTrollVideo[0].currentTime = 0;
				jqTrollVideo.show();
				jqTrollVideo[0].play();
				jqTrollVideo[0].onended = () => {
					$('#video video#troll').hide();
					startAudioBackground();
				};
				sendRequest();
				COMPTEUR.animateReduceTime(reduceTime)
					.then(resolve);
		});
	});
};

let TROLL_END = null;
const trollEnd = () => {
	muteAudioBackground();
	readAllMessages([ TROLL_END.text ]);
};