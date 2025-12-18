/**
 * Nova Systems - Glitch & Surveillance Module
 * Ce script gère les dysfonctionnements aléatoires et l'intrusion "surveillance".
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le système de glitch
    initGlitchSystem();
});

let glitchTimeout;
const GLITCH_INTERVAL = 60000; // 60 secondes (1 minute)
const STORAGE_KEY = 'nova_next_glitch_time';

function initGlitchSystem() {
    console.log("Nova Systems Security: Monitoring initialized...");

    // Injecter le markup nécessaire s'il n'existe pas déjà
    if (!document.getElementById('glitch-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'glitch-overlay';
        document.body.appendChild(overlay);
    }

    // Suppression de la demande immédiate d'accès webcam
    // requestWebcamAccess();

    // Vérifier si un prochain glitch est déjà planifié
    let nextTime = sessionStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!nextTime) {
        // Premier lancement : dans 20s
        nextTime = now + GLITCH_INTERVAL;
        sessionStorage.setItem(STORAGE_KEY, nextTime);
        console.log("System Init: First synchronization sequence started.");
    } else {
        nextTime = parseInt(nextTime, 10);
    }

    let delay = nextTime - now;

    if (delay <= 0) {
        // Temps dépassé : déclenchement immédiat
        console.warn("System Sync: Time desynchronization detected. Triggering immediate protocol.");
        triggerGlitch();
    } else {
        // Attente du temps restant
        console.log(`System Check: Resuming sequence. T-${Math.round(delay / 1000)}s`);
        glitchTimeout = setTimeout(triggerGlitch, delay);
    }
}

function scheduleNextGlitch() {
    // Calculer le prochain timestamp
    const nextTime = Date.now() + GLITCH_INTERVAL;
    sessionStorage.setItem(STORAGE_KEY, nextTime);

    console.log(`System Check: Cycle complete. Next verification in 20s`);
    glitchTimeout = setTimeout(triggerGlitch, GLITCH_INTERVAL);
}

async function triggerGlitch() {
    console.warn("SYSTEM FAILURE: CRITICAL ANOMALY DETECTED");

    // 1. Activer les effets visuels globaux (immédiat)
    document.body.classList.add('glitch-active');

    // 2. Jouer le son de glitch
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const noiseSource = createGlitchSound(audioContext);

    // 3. Préparer la fenêtre et la webcam EN MEME TEMPS (en arrière-plan)
    // On crée l'élément mais on ne l'affiche pas encore
    const surveillanceWindow = createSurveillanceWindow();
    const videoElement = surveillanceWindow.querySelector('video');

    // On tente d'activer la webcam AVANT d'ajouter la fenêtre au DOM
    // Cela peut prendre quelques millisecondes, pendant ce temps le fond glitch déjà
    await activateWebcam(videoElement);

    // 4. Afficher la fenêtre maintenant que la vidéo (ou le signal d'erreur) est prêt(e)
    document.body.appendChild(surveillanceWindow);

    // 5. Tout arrêter après 2 secondes (2000ms)
    setTimeout(() => {
        // Stop Audio
        noiseSource.stop();
        audioContext.close();

        // Stop Video (récupérer le stream depuis l'élément)
        const stream = videoElement.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        // Remove DOM elements & classes
        if (surveillanceWindow.parentNode) {
            document.body.removeChild(surveillanceWindow);
        }
        document.body.classList.remove('glitch-active');

        console.log("System restored.");

        // Programmer le prochain glitch
        scheduleNextGlitch();

    }, 2000); // Durée du glitch : 2s
}

function createSurveillanceWindow() {
    const win = document.createElement('div');
    win.id = 'surveillance-window';

    win.innerHTML = `
        <div class="surv-header">
            <span>TERMINAL_ROOT_ACCESS</span>
            <span>[X]</span>
        </div>
        <div class="surv-content">
            <video id="surv-video" autoplay playsinline muted></video>
            <div class="crt-overlay"></div>
        </div>
    `;

    return win;
}

function createGlitchSound(audioCtx) {
    const bufferSize = audioCtx.sampleRate * 0.5; // 0.5s de buffer
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        // Bruit blanc aléatoire
        data[i] = Math.random() * 2 - 1;

        // Ajouter des "cracks" aléatoires plus forts
        if (Math.random() > 0.95) {
            data[i] *= 5;
        }
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filtre passe-bande pour rendre le son plus "agressif/électrique"
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;

    // Gain pour contrôler le volume
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.5; // Volume modéré

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noise.start();
    return noise;
}

async function activateWebcam(videoElement) {
    // Vérifier si l'utilisateur a déjà refusé explicitement
    const status = sessionStorage.getItem('nova_webcam_status');
    if (status === 'denied') {
        showNoSignal(videoElement);
        return null;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        videoElement.srcObject = stream;
        await videoElement.play();

        // Stocker le succès pour référence future (ne change pas grand chose techniquement, c'est le navigateur qui gère)
        sessionStorage.setItem('nova_webcam_status', 'granted');
        return stream;
    } catch (err) {
        console.warn("System Security: Clearance denied.", err);
        sessionStorage.setItem('nova_webcam_status', 'denied');
        showNoSignal(videoElement);
        return null;
    }
}

function showNoSignal(videoElement) {
    // Remplacer la vidéo par un message NO SIGNAL
    const parent = videoElement.parentNode;
    if (parent) { // Check if parent still exists
        const msg = document.createElement('div');
        msg.className = 'no-signal';
        msg.innerText = "NO SIGNAL";
        parent.appendChild(msg);
    }
}
