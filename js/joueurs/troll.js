const TROLL_LIST = [
	{ idVideo : "rickroll", messages : [ "Merci d'avoir connecté ma clef USB à un PC connecté à internet.", "Cela va me faire gagner environ 2 minutes." ] },
	{ idVideo : "nyancat", messages : [ "Encore une clef USB verrollée ?", "J'en aurai bientôt fini avec vous !"] },
	{ idVideo : "prairieDog", messages : [ "Un virus de plus en ma possession.", "Et deux minutes en moins pour vous."] },
	{ idVideo : "saxGuy", messages : [ "Vous tenez vraiment à ce que je termine plus vite ?", "Donnez-moi vos identifiants ça ira plus vite !"] },
];
let TROLL_LIST_INDEX = localStorage.getItem("trollIndex") || 0;

const troll = () => {
	return new Promise(resolve => {
		$('#video video').fadeOut(500, () => {
			$('#video video').each((index, video) => { video.pause(); });
		});

		const troll = TROLL_LIST[TROLL_LIST_INDEX];
		displayAndSynthesizeMessage(troll.messages, 0).then(() => {
			TROLL_LIST_INDEX = (TROLL_LIST_INDEX + 1) % TROLL_LIST.length;
			localStorage.setItem("trollIndex", TROLL_LIST_INDEX);
			const jqTrollVideo = $('#video #' + troll.idVideo);
			jqTrollVideo[0].currentTime = 0;
			jqTrollVideo.show();
			jqTrollVideo[0].play();
			COMPTEUR.animateReduceTime(120).then(resolve);
		});
	});
};