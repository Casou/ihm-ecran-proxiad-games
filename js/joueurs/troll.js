const TROLL_LIST = [
	{ idVideo : "rickroll", messages : [ "Merci d'avoir branché ma clef USB à un PC connecté à internet.", "Cela va me faire gagner environ 2 minutes." ] },
	{ idVideo : "saxGuy", messages : [ "Encore une clef USB verrollée ?", "J'en aurai bientôt fini avec vous !"] },
	{ idVideo : "nyancat", messages : [ "Un virus de plus en ma possession.", "Et deux minutes en moins pour vous."] },
	{ idVideo : "saxGuy", messages : [ "Vous tenez vraiment à ce que je termine plus vite ?", "Alors donnez-moi directement vos identifiants !"] },
];
let TROLL_LIST_INDEX = localStorage.getItem("trollIndex") || 0;

const troll = (reduceTime) => {
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
			COMPTEUR.animateReduceTime(reduceTime).then(resolve);
		});
	});
};

const trollEnd = () => {
	const messages = ["Il est trop tard pour vous.", "J'ai totalement effacé votre exitence numérique.", "Vous pouvez maintenant vous diriger de votre plein gré dans l'incinérateur, un cadeau vous y attend."];
	readAllMessages(messages);
};