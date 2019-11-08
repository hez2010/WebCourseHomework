/*
  Author: Steven He
  School: Sun Yat-sen University
  Student Number: 17364025
  Date: 10/24/2019
*/

window.onload = () => {
  const moles = document.querySelectorAll('.mole span');
  const start = document.querySelector('#start');
  const stop = document.querySelector('#stop');
  const result = document.querySelector('#result');
  const time = document.querySelector('#time');
  const score = document.querySelector('#score');

  let lastActive = -1;
  let timer = 0;
  let currentScore = 0;
  let currentTime = 30;
  let clicked = true;

  let stopGame = () => {
    result.value = 'Game Over'
    if (lastActive !== -1) {
      moles[lastActive].removeAttribute('active');
      moles[lastActive].removeAttribute('touched');
    }
    clearInterval(timer);
    timer = 0;
    clicked = true;
    lastActive = -1
  }

  let startGame = () => {
    if (timer) return;
    currentTime = 30;
    currentScore = 0;
    time.value = currentTime.toString();
    score.value = currentScore.toString();
    result.value = '';
    timer = setInterval(() => {
      if (!clicked && currentScore > 0) {
        currentScore--;
        score.value = currentScore.toString();
      }
      if (currentTime <= 0) {
        stopGame();
        return;
      }
      currentTime--;
      clicked = false;
      if (lastActive !== -1) {
        moles[lastActive].removeAttribute('active');
        moles[lastActive].removeAttribute('touched');
      }
      lastActive = parseInt(Math.random() * moles.length);
      moles[lastActive].setAttribute('active', '');
      time.value = currentTime.toString();
    }, 1000);
  }

  moles.forEach((v, i) => {
    v.setAttribute('index', i.toString());
    v.addEventListener('click', () => {
      if (!clicked && parseInt(v.getAttribute('index')) === lastActive) {
        v.removeAttribute('active');
        v.setAttribute('touched', '');
        currentScore++;
        score.value = currentScore.toString();
        clicked = true;
      }
    })
  })

  start.addEventListener('click', startGame);
  stop.addEventListener('click', stopGame);
};