const flagElement = document.getElementById("flag");
const input = document.getElementById("input");
const checkButton = document.getElementById("check");
const menuButton = document.getElementById("menuButton");
const statusText = document.getElementById("status");
const scoreText = document.getElementById("score");
const percentageText = document.getElementById("percentage");
const timerText = document.getElementById("timer");
const gameInfoText = document.getElementById("game-info");
const cerrarPopup = document.getElementById("cerrarPopup");
const flagContainer = document.querySelector('.flag-container');

let countries = [];
let currentCountry = "";
let score = 0;
let total = 0;
let attempts = 3;
let startTime;
let timerInterval;

// Obtener continente guardado
const region = localStorage.getItem("regionSeleccionada");

// Functions
function iniciarJuego() {
    iniciarTemporizador();
    nuevaBandera();
}

function nuevaBandera() {
    attempts = 3;
    const random = countries[Math.floor(Math.random() * countries.length)];
    countries.splice(countries.indexOf(random), 1);
    currentCountry = random.nombre;
    flagElement.src = random.bandera;
    input.value = "";
    statusText.textContent = "";
}

function comprobar() {
    const value = normalizar(input.value);
    const correcto = normalizar(currentCountry);

    if (value === correcto) {
        score++;
        statusText.textContent = "Correcto";
        statusText.style.color = "green";
        actualizarMarcador();
        mostrarResultado(true);
        nuevaBandera();
    } else {
        attempts--;
        if (attempts > 0) {
            statusText.textContent = `Incorrecto. Intentos restantes: ${attempts}`;
        } else {
            actualizarMarcador();
            mostrarResultado(false);
            abrirPopup();
            nuevaBandera();
        }
        statusText.style.color = "red";
    }
}

function actualizarMarcador() {
    scoreText.textContent = `${score}/${total}`;
    percentageText.textContent = `${parseFloat((score/total)*100).toFixed(0)}%`;

    if (countries.length === 0) {
        finalizarJuego();
    }
}

function iniciarTemporizador() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        let t = Math.floor((Date.now() - startTime) / 1000);
        let min = Math.floor(t / 60).toString().padStart(2, "0");
        let sec = (t % 60).toString().padStart(2, "0");
        timerText.textContent = `${min}:${sec}`;
    }, 1000);
}

function mostrarResultado(correcto) {
    if (correcto) {
        flagContainer.classList.add('correcto');
    } else {
        flagContainer.classList.add('incorrecto');
    }

    setTimeout(() => {
        flagContainer.classList.remove('correcto', 'incorrecto');
    }, 1000);
}

function paisesToString(paises){
    return paises.map(p => p.nombre).join(', ');
}

function finalizarJuego(){
    clearInterval(timerInterval);
    input.disabled = true;
    checkButton.disabled = true;
    statusText.textContent = `Juego terminado! Puntuación final: ${score}/${total} Tiempo final: ${timerText.textContent}`;
}

function volverMenu(){
    console.log("Volviendo al menú principal");
    window.location.href = "index.html";
}

function abrirPopup(){
    const dialogFallo = document.getElementById("dialogFallo");
    const mensajeFallo = document.getElementById("mensajeFallo");
    mensajeFallo.textContent = `Era ${currentCountry}`;
    dialogFallo.open = true;
}

// Main flow (fetch + event listeners)
fetch(`https://restcountries.com/v3.1/region/${region}`)
    .then(res => res.json())
    .then(data => {
        countries = data.map(p => ({
            nombre: (p.translations?.spa?.common || p.name.common),
            bandera: p.flags.svg
        }));
        document.getElementById("game").style.display = "block";
        total = countries.length;
        scoreText.textContent = `${score}/${total}`;
        percentageText.textContent = `${parseFloat((score/total)*100).toFixed(0)}%`;
        gameInfoText.textContent = `Región seleccionada: ${region.charAt(0).toUpperCase() + region.slice(1)} Paises: ${paisesToString(countries)}`;
        iniciarJuego();
    });

checkButton.addEventListener("click", comprobar);
input.addEventListener("keydown", e => { if (e.key === "Enter") comprobar(); });
menuButton.addEventListener("click", volverMenu);

cerrarPopup.addEventListener("click", () => {
    dialogFallo.close();
});

input.addEventListener('keydown', (event) => {
  // Check for Ctrl+S (Windows/Linux) or Cmd+S (Mac)
  if ((event.shiftKey) && event.key === ' ') {
    nuevaBandera();
  }
});