let CODE = "";
let BLINK_COUNT = null;

const addNumber = (number) => {
  CODE += number;
  refreshDisplay();
};

const backSpace = () => {
  CODE = CODE.substring(0, CODE.length - 1)
  refreshDisplay();
};

const validateCode = () => {
  // TODO Check API
  if (Math.random() > 0.5) {
    successCode();
  } else {
    failedCode();
  }
};

document.onkeydown = e => {
  if (BLINK_COUNT) {
    return;
  }
  const key = e.key;
  if (key >= '0' && key <= '9') {
    addNumber(parseInt(key));
    return;
  }
  if (key === 'Backspace') {
    backSpace();
    return;
  }
  if (key === 'Enter') {
    validateCode();
    return;
  }
};

const refreshDisplay = () => {
  const screen = document.getElementById('digital_screen_lcd');
  if (!CODE) {
    screen.classList = ['placeholder'];
  } else {
    screen.classList = [];
  }
  screen.innerHTML = CODE || 'Enter code';
};

const failedCode = () => {
  CODE = 'Wrong code';
  BLINK_COUNT = 0;
  blinkRedLight();
  refreshDisplay();
};

const blinkRedLight = () => {
  BLINK_COUNT++;
  document.querySelectorAll('.red_led').forEach(img => img.src = 'resources/images/light-black.png');
  setTimeout(() => {
    document.querySelectorAll('.red_led').forEach(img => img.src = 'resources/images/light-red.png');
    if (BLINK_COUNT < 3) {
      setTimeout(blinkRedLight, 150);
    } else {
      BLINK_COUNT = null;
      CODE = '';
      refreshDisplay();
    }
  }, 150);
};

const successCode = () => {
  CODE = 'Access granted';
  BLINK_COUNT = 99999;
  document.querySelectorAll('.red_led').forEach(img => img.src = 'resources/images/light-black.png');
  document.querySelectorAll('.green_led').forEach(img => img.src = 'resources/images/light-green.png');
  refreshDisplay();
};

refreshDisplay();
