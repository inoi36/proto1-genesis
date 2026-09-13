// ==============================================================================
// Proto1: Genesis — Interactive Engine & Theme Switcher
// ==============================================================================

const VALID_FLAGS = {
    user: "HVM{us3r_f00th0ld_c0mm4nd_1nj3ct10n_941a}",
    root: "HVM{r00t_gtf0b1ns_pr1v3sc_m4st3r_882f}"
};

// 1. Live IST Clock
function updateLiveClock() {
    const clockEl = document.getElementById("live-ist-clock");
    if (!clockEl) return;
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const hours = String(istTime.getHours()).padStart(2, "0");
    const minutes = String(istTime.getMinutes()).padStart(2, "0");
    const seconds = String(istTime.getSeconds()).padStart(2, "0");
    clockEl.textContent = `${hours}:${minutes}:${seconds} IST`;
}
setInterval(updateLiveClock, 1000);
updateLiveClock();

// 2. Dark / Light Theme Toggle
const themeBtn = document.getElementById("theme-btn");
const themeIcon = document.getElementById("theme-icon");
const htmlEl = document.documentElement;

const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") {
    htmlEl.classList.remove("dark");
    htmlEl.classList.add("light");
    updateThemeIcon(true);
} else {
    htmlEl.classList.remove("light");
    htmlEl.classList.add("dark");
    updateThemeIcon(false);
}

function updateThemeIcon(isLight) {
    if (!themeIcon) return;
    if (isLight) {
        themeIcon.innerHTML = `<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>`;
    } else {
        themeIcon.innerHTML = `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>`;
    }
}

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const isCurrentlyLight = htmlEl.classList.contains("light");
        if (isCurrentlyLight) {
            htmlEl.classList.remove("light");
            htmlEl.classList.add("dark");
            localStorage.setItem("theme", "dark");
            updateThemeIcon(false);
            showToast("Dark theme enabled 🌙");
        } else {
            htmlEl.classList.remove("dark");
            htmlEl.classList.add("light");
            localStorage.setItem("theme", "light");
            updateThemeIcon(true);
            showToast("Light theme enabled ☀️");
        }
    });
}

// 3. Toast Notifications
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2400);
}

// 4. Copy Recon Command
function copyReconCommand() {
    const cmd = "sudo arp-scan -l";
    navigator.clipboard.writeText(cmd).then(() => {
        const copyBadge = document.getElementById("copy-badge");
        if (copyBadge) {
            copyBadge.textContent = "COPIED!";
            setTimeout(() => {
                copyBadge.textContent = "COPY";
            }, 2000);
        }
        showToast("Copied command: " + cmd + " 📋");
    }).catch(() => {
        showToast("Command: " + cmd);
    });
}

// 5. Victory Sound Synthesizer
function playVictoryAudio() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
            gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.1);
            osc.stop(ctx.currentTime + idx * 0.1 + 0.4);
        });
    } catch (e) {
        console.log("Audio requires user interaction");
    }
}

// 6. Confetti Explosion
function fireMoreConfetti() {
    if (typeof confetti !== "function") return;
    confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 }
    });

    setTimeout(() => {
        confetti({
            particleCount: 70,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.65 }
        });
        confetti({
            particleCount: 70,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.65 }
        });
    }, 200);

    playVictoryAudio();
}

// 7. Flag Submission Logic (Always Resets on Page Refresh)
document.addEventListener("DOMContentLoaded", () => {
    const flagForm = document.getElementById("flag-form");
    const userInput = document.getElementById("user-flag");
    const rootInput = document.getElementById("root-flag");
    const feedbackBox = document.getElementById("status-feedback");
    const userHint = document.getElementById("user-hint");
    const rootHint = document.getElementById("root-hint");

    const victoryModal = document.getElementById("victory-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");

    if (flagForm) {
        flagForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const userVal = userInput.value.trim();
            const rootVal = rootInput.value.trim();

            const isUserOk = userVal.toLowerCase() === VALID_FLAGS.user.toLowerCase() || userVal.toLowerCase() === VALID_FLAGS.user.replace("HVM", "HMV").toLowerCase();
            const isRootOk = rootVal.toLowerCase() === VALID_FLAGS.root.toLowerCase() || rootVal.toLowerCase() === VALID_FLAGS.root.replace("HVM", "HMV").toLowerCase();

            feedbackBox.classList.remove("hidden", "error", "info");

            // Both Correct -> SHOW CAT MEME & CELEBRATION!
            if (isUserOk && isRootOk) {
                userHint.textContent = "✓ Correct User Flag (+50 XP)";
                userHint.style.color = "#22c55e";
                rootHint.textContent = "✓ Correct Root Flag (+50 XP)";
                rootHint.style.color = "#22c55e";

                feedbackBox.classList.add("hidden");

                victoryModal.classList.remove("hidden");
                fireMoreConfetti();
                playVictoryAudio();
                return;
            }

            // Partial Matches
            if (isUserOk && !isRootOk) {
                userHint.textContent = "✓ Correct User Flag";
                userHint.style.color = "#22c55e";
                rootHint.textContent = "❌ Incorrect or Missing Root Flag";
                rootHint.style.color = "#f87171";

                feedbackBox.className = "status-feedback info font-mono";
                feedbackBox.innerHTML = `<strong>[+] User Flag Valid!</strong> Now escalate to root to retrieve the root flag and claim full victory!`;
                return;
            }

            if (!isUserOk && isRootOk) {
                userHint.textContent = "❌ Incorrect or Missing User Flag";
                userHint.style.color = "#f87171";
                rootHint.textContent = "✓ Correct Root Flag";
                rootHint.style.color = "#22c55e";

                feedbackBox.className = "status-feedback info font-mono";
                feedbackBox.innerHTML = `<strong>[+] Root Flag Valid!</strong> Please also submit the initial user flag to complete the challenge.`;
                return;
            }

            // Both Wrong
            userHint.textContent = "❌ Incorrect flag";
            userHint.style.color = "#f87171";
            rootHint.textContent = "❌ Incorrect flag";
            rootHint.style.color = "#f87171";

            feedbackBox.className = "status-feedback error font-mono";
            feedbackBox.innerHTML = `<strong>[!] Access Denied:</strong> Both flags are incorrect. Review the walkthrough accordion below if you need hints!`;
        });
    }

    // Modal Close Handlers
    function closeModal() {
        if (victoryModal) victoryModal.classList.add("hidden");
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (victoryModal) {
        victoryModal.addEventListener("click", (e) => {
            if (e.target === victoryModal) closeModal();
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && victoryModal && !victoryModal.classList.contains("hidden")) {
            closeModal();
        }
    });
});
