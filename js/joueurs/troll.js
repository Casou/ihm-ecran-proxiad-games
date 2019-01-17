const TROLL_LIST = [
	{ idVideo : "rickroll", message : "Merci d'avoir connecté ma clef USB à internet. Cela va me faire gagner environ 2 minutes." },
	{ idVideo : "nyancat", message : "Encore une clef USB verrollée ? J'en aurai bientôt fini avec vous !" },
];
let TROLL_LIST_INDEX = 0;

const troll = () => {
	$('#video video').hide();

	const troll = TROLL_LIST[TROLL_LIST_INDEX];
	displayAndSynthesizeMessage(troll.message, 0).then(() => {
		const jqTrollVideo = $('#video #' + troll.idVideo);
		jqTrollVideo[0].currentTime = 0;
		jqTrollVideo.show();
		jqTrollVideo[0].play();
		COMPTEUR.animateReduceTime(120);
	});

	TROLL_LIST_INDEX = (TROLL_LIST_INDEX + 1) % TROLL_LIST.length;
};