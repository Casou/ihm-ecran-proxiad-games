const glitchize = () => {
	scheduleGlitches();
};

const INIT_TOP = $(".glitch").css("top");
const INIT_LEFT = $(".glitch").css("left");

const scheduleGlitches = () => {
	const selector = ".glitch.stade" + NB_UNLOCKED_RIDDLES;
	const nbGlitches = NB_UNLOCKED_RIDDLES;

	const nextStepTime = (Math.random() * 5000 + 4000) / Math.min(3, (nbGlitches + 1));
	setTimeout(() => {
		initGlitch(selector, nbGlitches)
			.then(() => scheduleGlitches(selector, nbGlitches));
	}, nextStepTime);
};

async function initGlitch (selector, nbGlitches){
	for (let countGlitches = 0; countGlitches <= nbGlitches; countGlitches++) {
		const newTop = Math.random() * $(window).height();
		const newLeft = Math.random() * $(window).width();
		await doGlitch(selector, newTop, newLeft);
	}

	return new Promise(resolve => {
		setTimeout(() => {
			$(selector).css("top", INIT_TOP).css("left", INIT_LEFT);
			resolve();
		}, 100);
	});
}

async function doGlitch (selector, newTop, newLeft) {
	return new Promise(resolve => {
		setTimeout(() => {
			$(selector).css("top", newTop + "px").css("left", newLeft + "px");
			resolve();
		}, 20);
	});
}