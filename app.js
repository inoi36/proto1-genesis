// ==============================================================================
// PROTO1: GENESIS - SHOWCASE ENGINE & VICTORY LOGIC
// ==============================================================================

const VALID_FLAGS = {
    user: "HMV{us3r_f00th0ld_c0mm4nd_1nj3ct10n_941a}",
    root: "HMV{r00t_gtf0b1ns_pr1v3sc_m4st3r_882f}"
};

// Web Audio API Victory Sound Synthesizer
function playVictorySound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);
            gain.gain.setValueAtTime(0.15, ctx.currentTime + index * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.1 + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + index * 0.1);
            osc.stop(ctx.currentTime + index * 0.1 + 0.4);
        });
    } catch (e) {
        console.log("Audio not allowed yet without user interaction");
    }
}

// Confetti Blast Effect
function triggerConfettiBlast() {
    if (typeof confetti !== "function") return;

    // Center burst
    confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
    });

    // Left cannon
    setTimeout(() => {
        confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 }
        });
    }, 200);

    // Right cannon
    setTimeout(() => {
        confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 }
        });
    }, 400);
}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    const flagForm = document.getElementById("flag-form");
    const userInput = document.getElementById("user-flag-input");
    const rootInput = document.getElementById("root-flag-input");
    const feedbackBox = document.getElementById("status-feedback-box");
    const userStatus = document.getElementById("user-status-text");
    const rootStatus = document.getElementById("root-status-text");

    const victoryModal = document.getElementById("victory-modal");
    const closeVictoryBtn = document.getElementById("close-victory-btn");
    const fireworksBtn = document.getElementById("btn-fireworks");

    // Check if previously solved
    if (localStorage.getItem("proto1_pwned") === "true") {
        userInput.value = VALID_FLAGS.user;
        rootInput.value = VALID_FLAGS.root;
        userStatus.textContent = "✓ Verified (User Flag Solved)";
        userStatus.style.color = "var(--neon-green)";
        rootStatus.textContent = "✓ Verified (Root Flag Solved)";
        rootStatus.style.color = "var(--neon-green)";
    }

    // Flag Form Submission
    flagForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const userVal = userInput.value.trim();
        const rootVal = rootInput.value.trim();

        const isUserCorrect = userVal === VALID_FLAGS.user;
        const isRootCorrect = rootVal === VALID_FLAGS.root;

        feedbackBox.classList.remove("hidden", "error", "info");

        // Both Correct -> PWNED!
        if (isUserCorrect && isRootCorrect) {
            localStorage.setItem("proto1_pwned", "true");

            userStatus.textContent = "✓ Correct User Flag (+50 pts)";
            userStatus.style.color = "var(--neon-green)";
            rootStatus.textContent = "✓ Correct Root Flag (+50 pts)";
            rootStatus.style.color = "var(--neon-green)";

            feedbackBox.classList.add("hidden");

            // Open Victory Modal & Fire Confetti!
            victoryModal.classList.remove("hidden");
            triggerConfettiBlast();
            playVictorySound();

            if (window.lucide) window.lucide.createIcons();
            return;
        }

        // Partial or Incorrect feedback
        if (isUserCorrect && !isRootCorrect) {
            userStatus.textContent = "✓ Correct User Flag";
            userStatus.style.color = "var(--neon-green)";
            rootStatus.textContent = "❌ Incorrect or Missing Root Flag";
            rootStatus.style.color = "var(--neon-red)";

            feedbackBox.className = "feedback-box info";
            feedbackBox.innerHTML = `<strong>🎯 Great Progress!</strong> User Flag is valid! Now escalate to root to capture <code>/root/root.txt</code> and complete the lab.`;
            return;
        }

        if (!isUserCorrect && isRootCorrect) {
            userStatus.textContent = "❌ Incorrect or Missing User Flag";
            userStatus.style.color = "var(--neon-red)";
            rootStatus.textContent = "✓ Correct Root Flag";
            rootStatus.style.color = "var(--neon-green)";

            feedbackBox.className = "feedback-box info";
            feedbackBox.innerHTML = `<strong>👑 Root Flag Valid!</strong> Please also submit the initial <code>/home/cadet/user.txt</code> flag to claim 100% completion.`;
            return;
        }

        // Both Incorrect
        userStatus.textContent = "❌ Incorrect User Flag";
        userStatus.style.color = "var(--neon-red)";
        rootStatus.textContent = "❌ Incorrect Root Flag";
        rootStatus.style.color = "var(--neon-red)";

        feedbackBox.className = "feedback-box error";
        feedbackBox.innerHTML = `<strong>❌ Access Denied:</strong> Both flags are incorrect. Review the mission objectives or check the walkthrough accordion below if you need hints!`;
    });

    // Close Modal
    function closeModal() {
        victoryModal.classList.add("hidden");
    }

    if (closeVictoryBtn) closeVictoryBtn.addEventListener("click", closeModal);
    if (victoryModal) {
        victoryModal.addEventListener("click", (e) => {
            if (e.target === victoryModal) closeModal();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !victoryModal.classList.contains("hidden")) {
            closeModal();
        }
    });

    // Fireworks Button
    if (fireworksBtn) {
        fireworksBtn.addEventListener("click", () => {
            triggerConfettiBlast();
            playVictorySound();
        });
    }
});
