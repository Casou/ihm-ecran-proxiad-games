const receiveTroll = ({ reduceTime, message, voice, videoName }, sendRequestCallback) => {
	return new Promise(resolve => {
		muteAudioBackground();
		$('#video video').fadeOut(500, () => {
			$('#video video').each((index, video) => { video.pause(); });
		});

		incomingMessage({ message, voice }, 0)
			.finally(() => {
				hideProgressBar();

				const jqTrollVideo = $('#video video#troll');
				jqTrollVideo.attr("src", "resources/videos/" + videoName + "?" + makeid());
				jqTrollVideo[0].currentTime = 0;
				jqTrollVideo.show();
				jqTrollVideo[0].play();
				jqTrollVideo[0].onended = () => {
					$('#video video#troll').hide();
					startAudioBackground();
					showProgressBar();
				};
				sendRequestCallback();
				COMPTEUR.animateReduceTime(reduceTime)
					.then(resolve);
		});
	});
};

let TROLL_END = null;
const trollEndOfGame = () => {
	readAllMessages([ TROLL_END.text ]);
};