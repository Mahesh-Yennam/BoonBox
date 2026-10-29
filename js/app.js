/**
 * BoonBox - Core Application Controller
 * Handles user interactions, daily cooldown persistence, timers, and modal displays
 */

(function () {
  'use strict';

  // DOM Elements
  const chestWrapper = document.getElementById('chest-wrapper');
  const mainPrompt = document.getElementById('main-prompt');
  const hintPill = document.getElementById('hint-pill');
  const cooldownPanel = document.getElementById('cooldown-panel');
  const countdownTimer = document.getElementById('countdown-timer');
  const viewTodayBtn = document.getElementById('view-today-btn');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const testResetBtn = document.getElementById('test-reset-btn');

  // Reward Modal Elements
  const rewardModal = document.getElementById('reward-modal');
  const rewardCard = document.getElementById('reward-card');
  const cardRarity = document.getElementById('card-rarity');
  const cardCategory = document.getElementById('card-category');
  const cardImage = document.getElementById('card-image');
  const cardIcon = document.getElementById('card-icon');
  const cardTitle = document.getElementById('card-title');
  const cardTagline = document.getElementById('card-tagline');
  const cardQuote = document.getElementById('card-quote');
  const cardStatLabel = document.getElementById('card-stat-label');
  const cardStatValue = document.getElementById('card-stat-value');
  const claimBtn = document.getElementById('claim-btn');

  // App State
  let isOpening = false;
  let countdownInterval = null;

  /**
   * Returns current calendar date in 'YYYY-MM-DD' format based on user's local timezone
   */
  function getLocalDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Check if user has already opened the box today
   */
  function isAlreadyOpenedToday() {
    const lastOpened = localStorage.getItem('boonbox_last_opened_date');
    return lastOpened === getLocalDateString();
  }

  /**
   * Get today's saved reward object if available
   */
  function getSavedTodayReward() {
    try {
      const data = localStorage.getItem('boonbox_today_reward');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Format milliseconds into HH:MM:SS string
   */
  function formatCountdown(ms) {
    if (ms <= 0) return '00:00:00';
    const totalSecs = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSecs % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  /**
   * Start live countdown timer to the upcoming midnight
   */
  function startCountdownTimer() {
    if (countdownInterval) clearInterval(countdownInterval);

    function update() {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(countdownInterval);
        resetToActiveState();
      } else {
        countdownTimer.textContent = formatCountdown(diff);
      }
    }

    update();
    countdownInterval = setInterval(update, 1000);
  }

  /**
   * Set UI to Cooldown (Sleeping) State
   */
  function applyCooldownState() {
    chestWrapper.classList.add('sleeping');
    chestWrapper.classList.remove('opened', 'shaking');
    chestWrapper.setAttribute('aria-disabled', 'true');
    cooldownPanel.classList.remove('hidden');
    hintPill.classList.add('hidden');
    mainPrompt.textContent = "Today's Boon has been unlocked";
    startCountdownTimer();
  }

  /**
   * Reset UI to Ready / Active State
   */
  function resetToActiveState() {
    if (countdownInterval) clearInterval(countdownInterval);
    chestWrapper.classList.remove('sleeping', 'opened', 'shaking');
    chestWrapper.removeAttribute('aria-disabled');
    cooldownPanel.classList.add('hidden');
    hintPill.classList.remove('hidden');
    mainPrompt.textContent = "Tap the BoonBox to claim today's fortune";
    isOpening = false;
  }

  /**
   * Populate and display the reward card modal
   */
  function displayRewardModal(reward) {
    if (!reward) return;

    // Reset rarity classes
    rewardCard.classList.remove('rarity-common', 'rarity-rare', 'rarity-epic', 'rarity-legendary');
    rewardCard.classList.add(`rarity-${reward.rarity}`);

    cardRarity.textContent = reward.rarity.toUpperCase();
    cardCategory.textContent = reward.category;
    cardTitle.textContent = reward.name;
    cardTagline.textContent = reward.tagline;
    cardQuote.textContent = reward.quote;
    cardStatLabel.textContent = reward.statLabel;
    cardStatValue.textContent = reward.statValue;
    cardIcon.textContent = reward.icon;

    // Set image with gentle fallback
    cardImage.src = reward.image;
    cardImage.alt = reward.name;

    rewardModal.classList.remove('hidden');
  }

  /**
   * Close the reward modal
   */
  function closeRewardModal() {
    rewardModal.classList.add('hidden');
    if (isAlreadyOpenedToday()) {
      applyCooldownState();
    }
  }

  /**
   * Handle the main box click / open sequence
   */
  function openBoonBox() {
    if (isOpening || isAlreadyOpenedToday()) return;

    isOpening = true;
    mainPrompt.textContent = 'The cosmic seals are awakening...';

    // 1. Play anticipation sound & trigger shake
    if (window.boonAudio) {
      window.boonAudio.playRattle();
    }
    chestWrapper.classList.add('shaking');

    // 2. Open chest after shake duration
    setTimeout(() => {
      chestWrapper.classList.remove('shaking');
      chestWrapper.classList.add('opened');
      mainPrompt.textContent = 'A celestial boon emerges!';

      // Choose reward
      const reward = window.BoonRewardSystem.getRandomReward();

      // Save to localStorage
      localStorage.setItem('boonbox_last_opened_date', getLocalDateString());
      localStorage.setItem('boonbox_today_reward', JSON.stringify(reward));

      // 3. Audio & Particle effects
      const rect = chestWrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      if (window.boonParticles) {
        window.boonParticles.triggerBurst(centerX, centerY, reward.rarity);
      }

      if (window.boonAudio) {
        window.boonAudio.playOpen();
        window.boonAudio.playFanfare(reward.rarity);
      }

      // 4. Reveal reward modal
      setTimeout(() => {
        displayRewardModal(reward);
      }, 750);

    }, 1300);
  }

  /**
   * Initialize event handlers
   */
  function initEvents() {
    // Chest click & keydown (accessibility)
    chestWrapper.addEventListener('click', () => {
      if (!isAlreadyOpenedToday()) {
        openBoonBox();
      }
    });

    chestWrapper.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !isAlreadyOpenedToday()) {
        e.preventDefault();
        openBoonBox();
      }
    });

    // Hover audio feedback
    chestWrapper.addEventListener('pointerenter', () => {
      if (!isAlreadyOpenedToday() && !isOpening && window.boonAudio) {
        window.boonAudio.playHover();
      }
    });

    // View Today's Reward button
    viewTodayBtn.addEventListener('click', () => {
      const todayReward = getSavedTodayReward();
      if (todayReward) {
        displayRewardModal(todayReward);
      }
    });

    // Claim / Close modal buttons
    claimBtn.addEventListener('click', closeRewardModal);
    rewardModal.querySelector('.reward-modal-backdrop').addEventListener('click', closeRewardModal);

    // Escape key to close modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !rewardModal.classList.contains('hidden')) {
        closeRewardModal();
      }
    });

    // Sound toggle
    function updateSoundIcon(isMuted) {
      soundIcon.textContent = isMuted ? '🔇' : '🔊';
      soundToggleBtn.setAttribute('title', isMuted ? 'Unmute Sound' : 'Mute Sound');
    }

    if (window.boonAudio) {
      updateSoundIcon(window.boonAudio.isMuted);
    }

    soundToggleBtn.addEventListener('click', () => {
      if (window.boonAudio) {
        const isMuted = window.boonAudio.toggleMute();
        updateSoundIcon(isMuted);
      }
    });

    // Test Reset Button
    testResetBtn.addEventListener('click', () => {
      localStorage.removeItem('boonbox_last_opened_date');
      localStorage.removeItem('boonbox_today_reward');
      resetToActiveState();
      
      const originalText = testResetBtn.textContent;
      testResetBtn.textContent = '✓ Cooldown Reset!';
      testResetBtn.style.color = '#34d399';
      setTimeout(() => {
        testResetBtn.textContent = originalText;
        testResetBtn.style.color = '';
      }, 1500);
    });
  }

  /**
   * Initial Setup
   */
  function init() {
    initEvents();

    if (isAlreadyOpenedToday()) {
      applyCooldownState();
    } else {
      resetToActiveState();
    }
  }

  // Run on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

