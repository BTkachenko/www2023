const words = ['komputer', 'javascript', 'programowanie', 'kodowanie', 'internet'];
let word;
let hiddenWord;
let wrongGuesses;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const wordEl = document.getElementById('slowo');
const inputLetter = document.getElementById('inputLetter');
const submitLetterBtn = document.getElementById('submitLetter');
const resetBtn = document.getElementById('reset');

document.addEventListener('DOMContentLoaded', init);

function init() {
  const gameState = localStorage.getItem('gameState');

  if (gameState) {
    const { savedWord, savedHiddenWord, savedWrongGuesses } = JSON.parse(gameState);
    word = savedWord;
    hiddenWord = savedHiddenWord;
    wrongGuesses = savedWrongGuesses;
  } else {
    word = words[Math.floor(Math.random() * words.length)];
    hiddenWord = word.replace(/./g, '_');
    wrongGuesses = 0;
  }

  wordEl.textContent = hiddenWord;
  drawHangman();
  resetBtn.addEventListener('click', init);
  submitLetterBtn.addEventListener('click', guessLetter);
  inputLetter.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') guessLetter();
  });
}

function drawHangman() {
  ctx.clearRect(
    0, 0, canvas.width, canvas.height);

    // Rysuj szubienicę
    ctx.beginPath();
    ctx.moveTo(50, 280);
    ctx.lineTo(150, 280);
    ctx.lineTo(100, 250);
    ctx.closePath();
    ctx.stroke();
  
    if (wrongGuesses >= 1) {
      // Rysuj pionowy słup
      ctx.beginPath();
      ctx.moveTo(100, 50);
      ctx.lineTo(100, 250);
      ctx.stroke();
    }
  
    if (wrongGuesses >= 2) {
      // Rysuj poziomy słup
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.lineTo(200, 100);
      ctx.stroke();
    }
  
    if (wrongGuesses >= 3) {
      // Rysuj linę
      ctx.beginPath();
      ctx.moveTo(200, 100);
      ctx.lineTo(200, 130);
      ctx.stroke();
    }
  
    if (wrongGuesses >= 4) {
      // Rysuj głowę
      ctx.beginPath();
      ctx.arc(200, 150, 20, 0, Math.PI * 2, true);
      ctx.stroke();
    }
  
    if (wrongGuesses >= 5) {
      // Rysuj tułów
      ctx.beginPath();
      ctx.moveTo(200, 170);
      ctx.lineTo(200, 230);
      ctx.stroke();
    }
  
    if (wrongGuesses >= 6) {
      // Rysuj ręce i nogi
      ctx.beginPath();
      ctx.moveTo(200, 190);
      ctx.lineTo(170, 210);
      ctx.moveTo(200, 190);
      ctx.lineTo(230, 210);
      ctx.moveTo(200, 230);
      ctx.lineTo(170, 260);
      ctx.moveTo(200, 230);
      ctx.lineTo(230, 260);
      ctx.stroke();
    }
  }
  
  function guessLetter() {
    const letter = inputLetter.value.toLowerCase();
    inputLetter.value = '';
  
    if (!letter || letter.length !== 1 || !/[a-ząćęłńóśźż]/.test(letter)) {
      return;
    }
  
    const index = word.indexOf(letter);
  
    if (index > -1) {
      let temp = hiddenWord.split('');
      for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
          temp[i] = letter;
        }
      }
      hiddenWord = temp.join('');
      wordEl.textContent = hiddenWord;
    } else {
      wrongGuesses++;
      drawHangman();
    }
  
    saveGameState();
    checkGameStatus();
  }
  
  function checkGameStatus() {
    if (hiddenWord === word) {
      alert('Gratulacje! Wygrałeś!');
      localStorage.removeItem('gameState');
      resetBtn.textContent = 'Zagraj jeszcze raz';
    } else if (wrongGuesses >= 6) {
      alert('Niestety, przegrałeś. Szukane słowo to: ' + word);
      localStorage.removeItem('gameState');
      resetBtn.textContent = 'Spróbuj jeszcze raz';
    }
  }
  
  function saveGameState() {
    const gameState = {
      savedWord: word,
      savedHiddenWord: hiddenWord,
      savedWrongGuesses: wrongGuesses,
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }
  
  init();
  

 
