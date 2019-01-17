const ACTION_PILE = [];
let IS_ACTION_STARTED = false;

const addAction = (promiseFunction) => {
	ACTION_PILE.push(promiseFunction);
	treatActionsPile();
};

const treatActionsPile = () => {
	if (IS_ACTION_STARTED || !ACTION_PILE.length) {
		IS_ACTION_STARTED = false;
		return;
	}
	IS_ACTION_STARTED = true;
	ACTION_PILE[0]().finally(() => {
		ACTION_PILE.shift();
		treatActionsPile();
	});
};