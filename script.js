const html = document.querySelector('html');

const playBt = document.querySelector('.app__card-primary-button');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const buttons = document.querySelectorAll('.app__card-button');
const startBt = document.querySelector('#start-pause');
const startText = document.querySelector('#start-pause span');
const startImg = document.querySelector('#start-pause img');

const imgs = document.querySelector(".app__image");
const text = document.querySelector('.app__title');
const timer = document.querySelector('#timer');

const musicaInput = document.querySelector('#alternar-musica');
const musica = new Audio('sons/luna-rise-part-one.mp3');
musica.loop = true;

const musicaPlay = new Audio('sons/play.wav');
const musicaPause = new Audio('sons/pause.mp3');
const musicaFinal = new Audio('sons/beep.mp3');

const duracaoFoco = 1500; 
const duracaoDescansoCurto = 300; 
const duracaoDescansoLongo = 900; 
let tempoDecorrido = 1500;
let intervaloId = null;

musicaInput.addEventListener('change', () => {
    if(musica.paused){
        musica.play();

    }else{
        musica.pause();
    }
});

focoBt.addEventListener('click', () => {
    alterarContexto('foco');
});

curtoBt.addEventListener('click', () => {
    alterarContexto('descanso-curto');
});

longoBt.addEventListener('click', () => {
    alterarContexto('descanso-longo');
});


function alterarContexto(contexto){
    html.setAttribute('data-contexto', contexto);
    imgs.setAttribute('src', `imagens/${contexto}.png`);

    buttons.forEach((contexto) =>{
        contexto.classList.remove('active');
    });

    switch (contexto) {
        case 'foco':
            text.innerHTML = 'Otimize sua produtividade <strong class="app__title-strong">mergulhe no que importa.</strong>';
            focoBt.classList.add('active');
            tempoDecorrido = 1500;
            break;

        case 'descanso-curto':
            text.innerHTML = 'Que tal dar uma respirada <strong class="app__title-strong">faça uma pausa curta.</strong>';
            curtoBt.classList.add('active');
            tempoDecorrido = 300;
            break;

        case 'descanso-longo':
            text.innerHTML = 'Hora de voltar à superfice <strong class="app__title-strong">faça uma pausa longa.</strong>';
            longoBt.classList.add('active');
            tempoDecorrido = 900;
            break;
    
        default:
            break;
    }

    mostrarTempo();
}

const contagemRegressiva = () => {
    if(tempoDecorrido <= 0){
        musicaFinal.play();
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if(focoAtivo){
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        }
        zerar();
        return
    }

    tempoDecorrido--;
    mostrarTempo();
    
}

startBt.addEventListener('click', iniciar);

function iniciar(){

    if(intervaloId){
        musicaPause.play();
        startText.textContent = 'Começar';
        startImg.setAttribute('src', 'imagens/play_arrow.png');
        zerar();
        return  
    }

    startText .textContent = 'Pausar';
    startImg.setAttribute('src', 'imagens/pause.png');
    
    musicaPlay.play();

    intervaloId = setInterval(contagemRegressiva, 1000);
}

function zerar(){
    clearInterval(intervaloId);
    intervaloId = null;
}

function mostrarTempo(){
    const tempo = new Date(tempoDecorrido * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
    timer.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();