/**
 * BoonBox - Reward Pool and Generation Logic
 * Multi-tier rewards with online imagery, lore, rarity, and weighted probability
 */

const BOON_REWARDS = [
  // ==================== LEGENDARY TIER (10% Chance) ====================
  {
    id: 'phoenix-reborn',
    name: 'Astral Solar Phoenix',
    category: 'Mythical Familiar',
    rarity: 'legendary',
    icon: '🔥',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    tagline: 'Guardian of Eternal Flames',
    quote: '"From every ending springs an incandescent new beginning. Your strength shines through every shadow today."',
    statLabel: 'Daily Boon Power',
    statValue: '+100% Rejuvenation'
  },
  {
    id: 'philosophers-stone',
    name: 'The Philosopher’s Stone',
    category: 'Ancient Treasure',
    rarity: 'legendary',
    icon: '💎',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    tagline: 'Heart of the Alchemical Cosmos',
    quote: '"Transmute the lead of doubt into pure golden courage. Extraordinary prosperity seeks you out today."',
    statLabel: 'Daily Boon Power',
    statValue: 'Infinite Fortune'
  },
  {
    id: 'chronos-warp',
    name: 'Aura of Chronos',
    category: 'Mystic Power',
    rarity: 'legendary',
    icon: '⏳',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    tagline: 'Mastery Over Time and Destiny',
    quote: '"Time slows down to bend to your focus. You will accomplish in moments what once seemed impossible."',
    statLabel: 'Daily Boon Power',
    statValue: 'Temporal Focus +10x'
  },

  // ==================== EPIC TIER (25% Chance) ====================
  {
    id: 'celestial-kitsune',
    name: 'Nine-Tailed Kitsune',
    category: 'Mythical Familiar',
    rarity: 'epic',
    icon: '🦊',
    image: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?w=800&auto=format&fit=crop&q=80',
    tagline: 'Spirit Guide of Intuition',
    quote: '"Trust the quiet whispers of your instincts. Hidden opportunities will reveal their secret paths to you."',
    statLabel: 'Daily Boon Power',
    statValue: '+85% Insight & Charm'
  },
  {
    id: 'atlantis-gold',
    name: 'Sunken Vault of Atlantis',
    category: 'Ancient Treasure',
    rarity: 'epic',
    icon: '👑',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    tagline: 'Sunken Wealth of Forgotten Oceans',
    quote: '"Great treasures lay beneath the surface. Today brings unexpected windfalls and deep fulfillment."',
    statLabel: 'Daily Boon Power',
    statValue: '+75% Abundance Flow'
  },
  {
    id: 'quantum-shield',
    name: 'Prismatic Quantum Shield',
    category: 'Mystic Power',
    rarity: 'epic',
    icon: '🛡️',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80',
    tagline: 'Impervious Barrier of Pure Will',
    quote: '"Negative energies and distractions deflect effortlessly. Your inner calm remains untouchable."',
    statLabel: 'Daily Boon Power',
    statValue: '+90% Resilience'
  },
  {
    id: 'cosmic-insight',
    name: 'The Third Eye of Seraph',
    category: 'Daily Oracle',
    rarity: 'epic',
    icon: '👁️',
    image: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&auto=format&fit=crop&q=80',
    tagline: 'Illuminator of Truth',
    quote: '"Clarity pierces through complexity today. What was once puzzling will suddenly make total sense."',
    statLabel: 'Daily Boon Power',
    statValue: '+80% Deep Perception'
  },

  // ==================== RARE TIER (35% Chance) ====================
  {
    id: 'moon-owl',
    name: 'Lunar Starlight Owl',
    category: 'Mythical Familiar',
    rarity: 'rare',
    icon: '🦉',
    image: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=800&auto=format&fit=crop&q=80',
    tagline: 'Keeper of Midnight Wisdom',
    quote: '"Wisdom is seeing in the dark what others miss in broad daylight. A clever idea will blossom today."',
    statLabel: 'Daily Boon Power',
    statValue: '+50% Wisdom Spark'
  },
  {
    id: 'dragon-chalice',
    name: 'Gilded Dragon Chalice',
    category: 'Ancient Treasure',
    rarity: 'rare',
    icon: '🏆',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    tagline: 'Vessel of Vitality and Nobility',
    quote: '"Drink deeply from your own confidence. You have the nobility and passion to lead where others follow."',
    statLabel: 'Daily Boon Power',
    statValue: '+60% Vital Energy'
  },
  {
    id: 'mind-blossom',
    name: 'Aura of the Mind Blossom',
    category: 'Mystic Power',
    rarity: 'rare',
    icon: '🌸',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80',
    tagline: 'Harmonious Flow of Creativity',
    quote: '"Creativity is blooming within your thoughts. Express your authentic voice with boldness and grace."',
    statLabel: 'Daily Boon Power',
    statValue: '+65% Creative Wave'
  },
  {
    id: 'fortuna-dice',
    name: 'Astral Luck Catalyst',
    category: 'Daily Oracle',
    rarity: 'rare',
    icon: '🎲',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    tagline: 'Magnet for Favorable Coincidence',
    quote: '"The odds tilt heavily in your favor. Take that modest leap of faith you have been contemplating."',
    statLabel: 'Daily Boon Power',
    statValue: '+55% Serendipity'
  },

  // ==================== COMMON TIER (30% Chance) ====================
  {
    id: 'golden-talisman',
    name: 'Golden Solar Talisman',
    category: 'Ancient Treasure',
    rarity: 'common',
    icon: '🪙',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop&q=80',
    tagline: 'Warmth and Grounding Charm',
    quote: '"A steady flame burns brightest. Today brings peace of mind and satisfaction in small victories."',
    statLabel: 'Daily Boon Power',
    statValue: '+35% Harmony'
  },
  {
    id: 'forest-whisperer',
    name: 'Emerald Forest Stag',
    category: 'Mythical Familiar',
    rarity: 'common',
    icon: '🦌',
    image: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=800&auto=format&fit=crop&q=80',
    tagline: 'Quiet Guardian of Nature',
    quote: '"Walk gently and breathe deeply. Harmony with your surroundings brings enduring strength."',
    statLabel: 'Daily Boon Power',
    statValue: '+30% Grounding Energy'
  },
  {
    id: 'clover-blessing',
    name: 'Verdant Clover Rune',
    category: 'Daily Oracle',
    rarity: 'common',
    icon: '🍀',
    image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format&fit=crop&q=80',
    tagline: 'Gentle Breeze of Good Fortune',
    quote: '"Smile at the day and the world smiles back. A pleasant surprise awaits you before sunset."',
    statLabel: 'Daily Boon Power',
    statValue: '+25% Daily Fortune'
  }
];

class BoonRewardSystem {
  static getRandomReward() {
    const roll = Math.random() * 100;
    let targetRarity = 'common';

    if (roll < 10) {
      targetRarity = 'legendary'; // 10%
    } else if (roll < 35) {
      targetRarity = 'epic';      // 25%
    } else if (roll < 70) {
      targetRarity = 'rare';      // 35%
    } else {
      targetRarity = 'common';    // 30%
    }

    const tierRewards = BOON_REWARDS.filter(r => r.rarity === targetRarity);
    const selected = tierRewards[Math.floor(Math.random() * tierRewards.length)];
    return selected;
  }
}

window.BoonRewardSystem = BoonRewardSystem;
window.BOON_REWARDS = BOON_REWARDS;

