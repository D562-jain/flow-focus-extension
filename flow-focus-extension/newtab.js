// newtab.js - Fixed timer with enhanced functionality
class FlowFocusApp {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    this.totalTime = 25 * 60; // 25 minutes in seconds
    this.timeLeft = this.totalTime;
    this.timerId = null;
    this.isRunning = false;
    this.isPaused = false;
    this.sessionsCompleted = 0;
    this.totalFocusTime = 0;

    this.initializeElements();
    this.initializeEventListeners();
    this.loadSavedData();
    this.updateDisplay();
    this.setRandomQuote();
  }

  initializeElements() {
    // Timer elements
    this.timerDisplay = document.getElementById("timer");
    this.progressBar = document.getElementById("progressBar");
    this.startBtn = document.getElementById("startBtn");
    this.pauseBtn = document.getElementById("pauseBtn");
    this.resetBtn = document.getElementById("resetBtn");

    // Goal elements
    this.goalInput = document.getElementById("goalInput");
    this.saveGoalBtn = document.getElementById("saveGoalBtn");
    this.savedGoalEl = document.getElementById("savedGoal");

    // Stats elements
    this.sessionsCompletedEl = document.getElementById("sessionsCompleted");
    this.focusTimeEl = document.getElementById("focusTime");
    this.goalsAchievedEl = document.getElementById("goalsAchieved");

    // Quote element
    this.quoteEl = document.getElementById("motivationalQuote");

    // Audio element
    this.completionSound = document.getElementById("completionSound");

    // Preset buttons
    this.presetButtons = document.querySelectorAll(".preset-btn");
  }

  initializeEventListeners() {
    // Timer controls
    this.startBtn.addEventListener("click", () => this.startTimer());
    this.pauseBtn.addEventListener("click", () => this.pauseTimer());
    this.resetBtn.addEventListener("click", () => this.resetTimer());

    // Goal setting
    this.saveGoalBtn.addEventListener("click", () => this.saveGoal());
    this.goalInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.saveGoal();
    });

    // Preset buttons
    this.presetButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const time = parseInt(e.target.dataset.time);
        this.setTimer(time);
      });
    });

    // Add interactive effects
    this.addInteractiveEffects();
  }

  startTimer() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;

    this.timerId = setInterval(() => {
      this.timeLeft--;
      this.totalFocusTime++;
      this.updateDisplay();

      if (this.timeLeft <= 0) {
        this.completeSession();
      }
    }, 1000);

    this.updateButtonStates();
    this.startBtn.classList.remove("pulse");
  }

  pauseTimer() {
    if (!this.isRunning) return;

    clearInterval(this.timerId);
    this.isRunning = false;
    this.isPaused = true;
    this.updateButtonStates();
    this.startBtn.classList.add("pulse");
  }

  resetTimer() {
    clearInterval(this.timerId);
    this.isRunning = false;
    this.isPaused = false;
    this.timeLeft = this.totalTime;
    this.updateDisplay();
    this.updateButtonStates();
    this.startBtn.classList.add("pulse");
  }

  setTimer(seconds) {
    this.resetTimer();
    this.totalTime = seconds;
    this.timeLeft = seconds;
    this.updateDisplay();
  }

  completeSession() {
    clearInterval(this.timerId);
    this.isRunning = false;
    this.sessionsCompleted++;
    this.updateStats();

    // Play sound
    this.playCompletionSound();

    // Show notification
    this.showCompletionNotification();

    this.resetTimer();
  }

  playCompletionSound() {
    try {
      this.completionSound.currentTime = 0;
      this.completionSound.play().catch(() => {
        // Fallback to browser beep if audio fails
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.connect(audioContext.destination);
        oscillator.start();
        setTimeout(() => oscillator.stop(), 200);
      });
    } catch (error) {
      console.log("Audio playback failed");
    }
  }

  showCompletionNotification() {
    // Create a simple notification
    const notification = document.createElement("div");
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--secondary-gradient);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
    notification.innerHTML = `
            <strong>🎉 Time's up!</strong><br>
            Great job! Take a break.
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.timerDisplay.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    // Update progress bar
    const progressPercentage =
      ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
    this.progressBar.style.width = `${progressPercentage}%`;

    // Visual feedback
    if (this.isRunning) {
      this.timerDisplay.style.color = "#ff6b6b";
      this.timerDisplay.style.textShadow = "0 0 10px rgba(255, 107, 107, 0.5)";
    } else {
      this.timerDisplay.style.color = "white";
      this.timerDisplay.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.3)";
    }
  }

  updateButtonStates() {
    this.startBtn.disabled = this.isRunning;
    this.pauseBtn.disabled = !this.isRunning;
    this.startBtn.innerHTML = this.isPaused
      ? '<i class="fas fa-play"></i> Resume'
      : '<i class="fas fa-play"></i> Start';
  }

  updateStats() {
    this.sessionsCompletedEl.textContent = this.sessionsCompleted;
    this.focusTimeEl.textContent = `${Math.floor(this.totalFocusTime / 60)}m`;
    chrome.storage.sync.set({
      sessionsCompleted: this.sessionsCompleted,
      totalFocusTime: this.totalFocusTime,
    });
  }

  saveGoal() {
    const goal = this.goalInput.value.trim();
    if (goal) {
      chrome.storage.sync.set({ dailyGoal: goal });
      this.savedGoalEl.textContent = `"${goal}"`;
      this.savedGoalEl.style.display = "block";
      this.goalInput.value = "";

      // Update goals achieved
      const goalsAchieved = parseInt(this.goalsAchievedEl.textContent) + 1;
      this.goalsAchievedEl.textContent = goalsAchieved;
      chrome.storage.sync.set({ goalsAchieved });
    }
  }

  loadSavedData() {
    chrome.storage.sync.get(
      ["dailyGoal", "sessionsCompleted", "totalFocusTime", "goalsAchieved"],
      (data) => {
        if (data.dailyGoal) {
          this.savedGoalEl.textContent = `"${data.dailyGoal}"`;
          this.savedGoalEl.style.display = "block";
        }

        this.sessionsCompleted = data.sessionsCompleted || 0;
        this.totalFocusTime = data.totalFocusTime || 0;
        this.goalsAchievedEl.textContent = data.goalsAchieved || 0;

        this.updateStats();
      }
    );
  }

  setRandomQuote() {
    const quotes = [
      "The way to get started is to quit talking and begin doing.",
      "Your time is limited, don't waste it living someone else's life.",
      "It's not that I'm so smart, it's just that I stay with problems longer.",
      "The future depends on what you do today.",
      "Don't count the days, make the days count.",
      "Quality is not an act, it is a habit.",
      "The only way to do great work is to love what you do.",
      "Productivity is never an accident. It is always the result of commitment to excellence.",
    ];

    const authors = [
      "Walt Disney",
      "Steve Jobs",
      "Albert Einstein",
      "Mahatma Gandhi",
      "Muhammad Ali",
      "Aristotle",
      "Steve Jobs",
      "Paul J. Meyer",
    ];

    const index = Math.floor(Math.random() * quotes.length);
    this.quoteEl.innerHTML = `"${quotes[index]}"<br><small>- ${authors[index]}</small>`;
  }

  addInteractiveEffects() {
    // Add hover effects to cards
    const cards = document.querySelectorAll(
      ".goal-card, .stats-card, .quote-card"
    );
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-4px)";
        card.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.2)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "var(--shadow)";
      });
    });

    // Add pulse animation to timer
    this.timerDisplay.addEventListener("mouseenter", () => {
      if (!this.isRunning) {
        this.timerDisplay.classList.add("pulse");
      }
    });

    this.timerDisplay.addEventListener("mouseleave", () => {
      this.timerDisplay.classList.remove("pulse");
    });
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  new FlowFocusApp();
});

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

function setupQuickLinks() {
  document.querySelectorAll(".quick-link-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const url = e.target.dataset.url;
      chrome.tabs.create({ url: url });
    });
  });
}

// Call this in your initialization
this.setupQuickLinks();
