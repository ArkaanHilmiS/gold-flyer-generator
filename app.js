// ============================================
// GOLD FLYER GENERATOR — Main Application
// ============================================

let selectedTheme = 'normal';
let selectedCaptionStyle = 'elegant';

// Theme configurations
const THEMES = {
  normal: {
    label: 'Normal', emoji: '📊',
    greeting: 'Update Harga Emas Hari Ini',
    bg: 'linear-gradient(150deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
    accent: '#d4a843', accentDark: '#0a0a18',
    titleColor: '#e8d5a0', subtitleColor: 'rgba(212,168,67,0.7)',
    pillBg: 'rgba(212,168,67,0.15)', pillColor: '#d4a843',
    typePillBg: '#d4a843', typePillColor: '#1a1a2e',
    headerBg: 'rgba(212,168,67,0.08)', tableHeaderBg: 'rgba(212,168,67,0.12)',
    rowEven: 'rgba(255,255,255,0.05)', rowOdd: 'rgba(255,255,255,0.02)',
    divider: 'rgba(212,168,67,0.25)', footerColor: 'rgba(212,168,67,0.5)',
    contactColor: 'rgba(212,168,67,0.7)', priceColor: '#d4a843', gramColor: 'rgba(230,220,200,0.85)',
    decoHTML: '<div style="position:absolute;top:15px;right:20px;font-size:3rem;opacity:0.08">📊</div>'
  },
  weekend: {
    label: 'Weekend', emoji: '🌤️',
    greeting: 'Happy Weekend! ☀️',
    bg: 'linear-gradient(150deg, #1a3c5e 0%, #2d6a9f 40%, #1a4975 100%)',
    accent: '#f0c040', accentDark: '#0d2035',
    titleColor: '#fff', subtitleColor: 'rgba(240,192,64,0.8)',
    pillBg: 'rgba(240,192,64,0.9)', pillColor: '#1a3c5e',
    typePillBg: '#f0c040', typePillColor: '#1a3c5e',
    headerBg: 'rgba(255,255,255,0.08)', tableHeaderBg: 'rgba(240,192,64,0.12)',
    rowEven: 'rgba(255,255,255,0.06)', rowOdd: 'rgba(255,255,255,0.03)',
    divider: 'rgba(240,192,64,0.25)', footerColor: 'rgba(255,255,255,0.5)',
    contactColor: 'rgba(255,255,255,0.7)', priceColor: '#f0c040', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:15px;right:20px;font-size:3rem;opacity:0.12">🌤️</div><div style="position:absolute;bottom:15px;left:20px;font-size:2rem;opacity:0.08">☕</div>'
  },
  'long-weekend': {
    label: 'Long Weekend', emoji: '🏝️',
    greeting: 'Promo Long Weekend!',
    bg: 'linear-gradient(150deg, #0d4f4f 0%, #0a7070 40%, #085858 100%)',
    accent: '#f8d347', accentDark: '#052e2e',
    titleColor: '#fff', subtitleColor: 'rgba(248,211,71,0.8)',
    pillBg: 'rgba(248,211,71,0.9)', pillColor: '#0d4f4f',
    typePillBg: '#f8d347', typePillColor: '#0d4f4f',
    headerBg: 'rgba(255,255,255,0.08)', tableHeaderBg: 'rgba(248,211,71,0.12)',
    rowEven: 'rgba(255,255,255,0.06)', rowOdd: 'rgba(255,255,255,0.03)',
    divider: 'rgba(248,211,71,0.25)', footerColor: 'rgba(255,255,255,0.5)',
    contactColor: 'rgba(255,255,255,0.7)', priceColor: '#f8d347', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:12px;right:18px;font-size:3rem;opacity:0.12">🏝️</div><div style="position:absolute;bottom:12px;left:18px;font-size:2rem;opacity:0.08">🌴</div>'
  },
  kemerdekaan: {
    label: 'Kemerdekaan', emoji: '🇮🇩',
    greeting: 'Dirgahayu Republik Indonesia!',
    bg: 'linear-gradient(150deg, #c62828 0%, #e53935 30%, #ffffff 50%, #ffffff 70%, #c62828 100%)',
    accent: '#c62828', accentDark: '#4a0a0a',
    titleColor: '#c62828', subtitleColor: 'rgba(198,40,40,0.7)',
    pillBg: 'rgba(198,40,40,0.9)', pillColor: '#fff',
    typePillBg: '#c62828', typePillColor: '#fff',
    headerBg: 'rgba(198,40,40,0.08)', tableHeaderBg: 'rgba(198,40,40,0.12)',
    rowEven: 'rgba(198,40,40,0.06)', rowOdd: 'rgba(198,40,40,0.03)',
    divider: 'rgba(198,40,40,0.25)', footerColor: 'rgba(198,40,40,0.5)',
    contactColor: 'rgba(198,40,40,0.7)', priceColor: '#c62828', gramColor: 'rgba(60,60,60,0.85)',
    decoHTML: '<div style="position:absolute;top:12px;right:18px;font-size:3rem;opacity:0.15">🇮🇩</div><div style="position:absolute;bottom:12px;left:18px;font-size:2rem;opacity:0.1">🦅</div>'
  },
  kartini: {
    label: 'Hari Kartini', emoji: '👩',
    greeting: 'Selamat Hari Kartini',
    bg: 'linear-gradient(150deg, #880e4f 0%, #ad1457 40%, #6a0e3e 100%)',
    accent: '#f8bbd0', accentDark: '#3a0520',
    titleColor: '#fff', subtitleColor: 'rgba(248,187,208,0.8)',
    pillBg: 'rgba(248,187,208,0.9)', pillColor: '#880e4f',
    typePillBg: '#f8bbd0', typePillColor: '#880e4f',
    headerBg: 'rgba(248,187,208,0.1)', tableHeaderBg: 'rgba(248,187,208,0.15)',
    rowEven: 'rgba(255,255,255,0.07)', rowOdd: 'rgba(255,255,255,0.03)',
    divider: 'rgba(248,187,208,0.3)', footerColor: 'rgba(255,255,255,0.5)',
    contactColor: 'rgba(255,255,255,0.7)', priceColor: '#f8bbd0', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:12px;right:18px;font-size:3rem;opacity:0.15">👩</div><div style="position:absolute;bottom:12px;left:18px;font-size:2rem;opacity:0.1">🌸</div>'
  },
  pendidikan: {
    label: 'Hari Pendidikan', emoji: '📚',
    greeting: 'Selamat Hari Pendidikan Nasional',
    bg: 'linear-gradient(150deg, #1565c0 0%, #1e88e5 40%, #0d47a1 100%)',
    accent: '#ffca28', accentDark: '#0a2a55',
    titleColor: '#fff', subtitleColor: 'rgba(255,202,40,0.8)',
    pillBg: 'rgba(255,202,40,0.9)', pillColor: '#0d47a1',
    typePillBg: '#ffca28', typePillColor: '#0d47a1',
    headerBg: 'rgba(255,255,255,0.08)', tableHeaderBg: 'rgba(255,202,40,0.12)',
    rowEven: 'rgba(255,255,255,0.06)', rowOdd: 'rgba(255,255,255,0.03)',
    divider: 'rgba(255,202,40,0.25)', footerColor: 'rgba(255,255,255,0.5)',
    contactColor: 'rgba(255,255,255,0.7)', priceColor: '#ffca28', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:12px;right:18px;font-size:3rem;opacity:0.12">📚</div><div style="position:absolute;bottom:12px;left:18px;font-size:2rem;opacity:0.08">🎓</div>'
  },
  guru: {
    label: 'Hari Guru', emoji: '👨‍🏫',
    greeting: 'Selamat Hari Guru Nasional',
    bg: 'linear-gradient(150deg, #2e7d32 0%, #43a047 40%, #1b5e20 100%)',
    accent: '#fff176', accentDark: '#0a2e0d',
    titleColor: '#fff', subtitleColor: 'rgba(255,241,118,0.8)',
    pillBg: 'rgba(255,241,118,0.9)', pillColor: '#1b5e20',
    typePillBg: '#fff176', typePillColor: '#1b5e20',
    headerBg: 'rgba(255,255,255,0.08)', tableHeaderBg: 'rgba(255,241,118,0.12)',
    rowEven: 'rgba(255,255,255,0.06)', rowOdd: 'rgba(255,255,255,0.03)',
    divider: 'rgba(255,241,118,0.25)', footerColor: 'rgba(255,255,255,0.5)',
    contactColor: 'rgba(255,255,255,0.7)', priceColor: '#fff176', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:12px;right:18px;font-size:3rem;opacity:0.12">👨‍🏫</div><div style="position:absolute;bottom:12px;left:18px;font-size:2rem;opacity:0.08">📖</div>'
  },
  pancasila: {
    label: 'Hari Pancasila', emoji: '🦅',
    greeting: 'Selamat Hari Lahir Pancasila',
    bg: 'linear-gradient(150deg, #b71c1c 0%, #d32f2f 40%, #8e1414 100%)',
    accent: '#ffd54f', accentDark: '#4a0a0a',
    titleColor: '#fff', subtitleColor: 'rgba(255,213,79,0.8)',
    pillBg: 'rgba(255,213,79,0.9)', pillColor: '#b71c1c',
    typePillBg: '#ffd54f', typePillColor: '#b71c1c',
    headerBg: 'rgba(255,255,255,0.08)', tableHeaderBg: 'rgba(255,213,79,0.12)',
    rowEven: 'rgba(255,255,255,0.06)', rowOdd: 'rgba(255,255,255,0.03)',
    divider: 'rgba(255,213,79,0.25)', footerColor: 'rgba(255,255,255,0.5)',
    contactColor: 'rgba(255,255,255,0.7)', priceColor: '#ffd54f', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:12px;right:18px;font-size:3rem;opacity:0.12">🦅</div><div style="position:absolute;bottom:12px;left:18px;font-size:2rem;opacity:0.08">⭐</div>'
  },
  'sumpah-pemuda': {
    label: 'Sumpah Pemuda', emoji: '🤝',
    greeting: 'Selamat Hari Sumpah Pemuda',
    bg: 'linear-gradient(150deg, #e65100 0%, #f57c00 40%, #bf360c 100%)',
    accent: '#fff8e1', accentDark: '#4a1e00',
    titleColor: '#fff', subtitleColor: 'rgba(255,248,225,0.8)',
    pillBg: 'rgba(255,248,225,0.9)', pillColor: '#e65100',
    typePillBg: '#fff8e1', typePillColor: '#e65100',
    headerBg: 'rgba(255,255,255,0.08)', tableHeaderBg: 'rgba(255,248,225,0.12)',
    rowEven: 'rgba(255,255,255,0.06)', rowOdd: 'rgba(255,255,255,0.03)',
    divider: 'rgba(255,248,225,0.25)', footerColor: 'rgba(255,255,255,0.5)',
    contactColor: 'rgba(255,255,255,0.7)', priceColor: '#fff8e1', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:12px;right:18px;font-size:3rem;opacity:0.12">🤝</div><div style="position:absolute;bottom:12px;left:18px;font-size:2rem;opacity:0.08">🇮🇩</div>'
  },
  'isra-miraj': {
    label: "Isra Mi'raj", emoji: '✨',
    greeting: "Selamat Memperingati Isra Mi'raj",
    bg: 'linear-gradient(150deg, #1a237e 0%, #283593 40%, #0d1257 100%)',
    accent: '#e8c860', accentDark: '#0a0d3a',
    titleColor: '#fff', subtitleColor: 'rgba(232,200,96,0.8)',
    pillBg: 'rgba(232,200,96,0.9)', pillColor: '#1a237e',
    typePillBg: '#e8c860', typePillColor: '#1a237e',
    headerBg: 'rgba(232,200,96,0.08)', tableHeaderBg: 'rgba(232,200,96,0.12)',
    rowEven: 'rgba(255,255,255,0.05)', rowOdd: 'rgba(255,255,255,0.02)',
    divider: 'rgba(232,200,96,0.25)', footerColor: 'rgba(255,255,255,0.5)',
    contactColor: 'rgba(255,255,255,0.7)', priceColor: '#e8c860', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:12px;right:18px;font-size:3rem;opacity:0.12">✨</div><div style="position:absolute;bottom:12px;left:18px;font-size:2rem;opacity:0.08">🕌</div>'
  },
  waisak: {
    label: 'Waisak', emoji: '🪷',
    greeting: 'Selamat Hari Raya Waisak',
    bg: 'linear-gradient(150deg, #f57f17 0%, #f9a825 40%, #e65100 100%)',
    accent: '#fff8e1', accentDark: '#4a2800',
    titleColor: '#fff', subtitleColor: 'rgba(255,248,225,0.8)',
    pillBg: 'rgba(255,248,225,0.9)', pillColor: '#e65100',
    typePillBg: '#fff8e1', typePillColor: '#e65100',
    headerBg: 'rgba(255,255,255,0.08)', tableHeaderBg: 'rgba(255,248,225,0.12)',
    rowEven: 'rgba(255,255,255,0.06)', rowOdd: 'rgba(255,255,255,0.03)',
    divider: 'rgba(255,248,225,0.25)', footerColor: 'rgba(255,255,255,0.5)',
    contactColor: 'rgba(255,255,255,0.7)', priceColor: '#fff8e1', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:12px;right:18px;font-size:3rem;opacity:0.12">🪷</div><div style="position:absolute;bottom:12px;left:18px;font-size:2rem;opacity:0.08">☸️</div>'
  },
  'tahun-baru': {
    label: 'Tahun Baru', emoji: '🎆',
    greeting: 'Selamat Tahun Baru!',
    bg: 'linear-gradient(150deg, #0d0d2b 0%, #1a1a4e 40%, #0a0a20 100%)',
    accent: '#ffd700', accentDark: '#050510',
    titleColor: '#ffd700', subtitleColor: 'rgba(255,215,0,0.7)',
    pillBg: 'rgba(255,215,0,0.15)', pillColor: '#ffd700',
    typePillBg: '#ffd700', typePillColor: '#0d0d2b',
    headerBg: 'rgba(255,215,0,0.08)', tableHeaderBg: 'rgba(255,215,0,0.12)',
    rowEven: 'rgba(255,255,255,0.05)', rowOdd: 'rgba(255,255,255,0.02)',
    divider: 'rgba(255,215,0,0.25)', footerColor: 'rgba(255,215,0,0.5)',
    contactColor: 'rgba(255,215,0,0.7)', priceColor: '#ffd700', gramColor: 'rgba(230,220,200,0.85)',
    decoHTML: '<div style="position:absolute;top:12px;right:18px;font-size:3rem;opacity:0.12">🎆</div><div style="position:absolute;bottom:12px;left:18px;font-size:2rem;opacity:0.08">🎊</div>'
  },
  lebaran: {
    label: 'Lebaran', emoji: '🌙',
    greeting: 'Selamat Hari Raya Idul Fitri',
    bg: 'linear-gradient(150deg, #0d5a3a 0%, #0f6b45 40%, #0a4e30 100%)',
    accent: '#d4a843', accentDark: '#1a3a2a',
    titleColor: '#fff', subtitleColor: 'rgba(255,255,255,0.7)',
    pillBg: 'rgba(255,255,255,0.9)', pillColor: '#0d5a3a',
    typePillBg: '#d4a843', typePillColor: '#1a3a2a',
    headerBg: 'rgba(255,255,255,0.1)', tableHeaderBg: 'rgba(255,255,255,0.15)',
    rowEven: 'rgba(255,255,255,0.06)', rowOdd: 'rgba(255,255,255,0.03)',
    divider: 'rgba(255,255,255,0.2)', footerColor: 'rgba(255,255,255,0.5)',
    contactColor: 'rgba(255,255,255,0.7)', priceColor: '#fff', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:15px;right:20px;font-size:3rem;opacity:0.15">🌙</div><div style="position:absolute;bottom:15px;left:20px;font-size:2.5rem;opacity:0.12">⭐</div><div style="position:absolute;top:50%;left:10px;font-size:2rem;opacity:0.08">✨</div>'
  },
  'idul-adha': {
    label: 'Idul Adha', emoji: '🐪',
    greeting: 'Selamat Hari Raya Idul Adha',
    bg: 'linear-gradient(150deg, #5c3a1e 0%, #7a4d28 40%, #4a2e15 100%)',
    accent: '#f0d070', accentDark: '#3a2210',
    titleColor: '#fff', subtitleColor: 'rgba(255,255,255,0.7)',
    pillBg: 'rgba(240,208,112,0.9)', pillColor: '#4a2e15',
    typePillBg: '#f0d070', typePillColor: '#3a2210',
    headerBg: 'rgba(240,208,112,0.1)', tableHeaderBg: 'rgba(240,208,112,0.15)',
    rowEven: 'rgba(255,255,255,0.06)', rowOdd: 'rgba(255,255,255,0.03)',
    divider: 'rgba(240,208,112,0.25)', footerColor: 'rgba(255,255,255,0.5)',
    contactColor: 'rgba(255,255,255,0.7)', priceColor: '#f0d070', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:15px;right:20px;font-size:3rem;opacity:0.15">🐪</div><div style="position:absolute;bottom:15px;left:20px;font-size:2rem;opacity:0.1">🕌</div>'
  },
  natal: {
    label: 'Natal', emoji: '🎄',
    greeting: 'Selamat Hari Natal',
    bg: 'linear-gradient(150deg, #8b1a1a 0%, #a52525 40%, #6e1515 100%)',
    accent: '#ffd700', accentDark: '#3a0a0a',
    titleColor: '#fff', subtitleColor: 'rgba(255,255,255,0.75)',
    pillBg: 'rgba(255,215,0,0.9)', pillColor: '#6e1515',
    typePillBg: '#ffd700', typePillColor: '#3a0a0a',
    headerBg: 'rgba(255,255,255,0.1)', tableHeaderBg: 'rgba(255,215,0,0.15)',
    rowEven: 'rgba(255,255,255,0.07)', rowOdd: 'rgba(255,255,255,0.03)',
    divider: 'rgba(255,215,0,0.3)', footerColor: 'rgba(255,255,255,0.5)',
    contactColor: 'rgba(255,255,255,0.7)', priceColor: '#ffd700', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:12px;right:18px;font-size:3rem;opacity:0.18">🎄</div><div style="position:absolute;bottom:12px;left:18px;font-size:2.5rem;opacity:0.12">🎁</div><div style="position:absolute;top:40%;right:15px;font-size:1.5rem;opacity:0.1">⭐</div>'
  },
  nyepi: {
    label: 'Nyepi', emoji: '🕯️',
    greeting: 'Selamat Hari Raya Nyepi',
    bg: 'linear-gradient(150deg, #1a1a2e 0%, #252545 40%, #12122a 100%)',
    accent: '#c0a060', accentDark: '#0a0a18',
    titleColor: '#e8dcc8', subtitleColor: 'rgba(192,160,96,0.7)',
    pillBg: 'rgba(192,160,96,0.15)', pillColor: '#c0a060',
    typePillBg: '#c0a060', typePillColor: '#1a1a2e',
    headerBg: 'rgba(192,160,96,0.08)', tableHeaderBg: 'rgba(192,160,96,0.12)',
    rowEven: 'rgba(255,255,255,0.04)', rowOdd: 'rgba(255,255,255,0.02)',
    divider: 'rgba(192,160,96,0.25)', footerColor: 'rgba(192,160,96,0.5)',
    contactColor: 'rgba(192,160,96,0.7)', priceColor: '#c0a060', gramColor: 'rgba(230,220,200,0.8)',
    decoHTML: '<div style="position:absolute;top:15px;right:20px;font-size:3rem;opacity:0.12">🕯️</div><div style="position:absolute;bottom:15px;left:20px;font-size:2rem;opacity:0.1">🙏</div>'
  },
  imlek: {
    label: 'Imlek', emoji: '🏮',
    greeting: 'Gong Xi Fa Cai',
    bg: 'linear-gradient(150deg, #c41e1e 0%, #d42a2a 40%, #a51818 100%)',
    accent: '#ffd700', accentDark: '#4a0808',
    titleColor: '#ffd700', subtitleColor: 'rgba(255,215,0,0.8)',
    pillBg: 'rgba(255,215,0,0.9)', pillColor: '#a51818',
    typePillBg: '#ffd700', typePillColor: '#7a1010',
    headerBg: 'rgba(255,215,0,0.1)', tableHeaderBg: 'rgba(255,215,0,0.15)',
    rowEven: 'rgba(255,255,255,0.07)', rowOdd: 'rgba(255,255,255,0.03)',
    divider: 'rgba(255,215,0,0.3)', footerColor: 'rgba(255,215,0,0.5)',
    contactColor: 'rgba(255,215,0,0.8)', priceColor: '#ffd700', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:12px;right:18px;font-size:3rem;opacity:0.18">🏮</div><div style="position:absolute;top:12px;left:18px;font-size:2.5rem;opacity:0.15">🧧</div><div style="position:absolute;bottom:15px;right:20px;font-size:2rem;opacity:0.1">🐉</div>'
  },
  liburan: {
    label: 'Liburan Sekolah', emoji: '🏖️',
    greeting: 'Promo Liburan Sekolah!',
    bg: 'linear-gradient(150deg, #0077b6 0%, #0096c7 40%, #005f8a 100%)',
    accent: '#f8d347', accentDark: '#003d5c',
    titleColor: '#fff', subtitleColor: 'rgba(255,255,255,0.75)',
    pillBg: 'rgba(248,211,71,0.9)', pillColor: '#005f8a',
    typePillBg: '#f8d347', typePillColor: '#003d5c',
    headerBg: 'rgba(255,255,255,0.1)', tableHeaderBg: 'rgba(248,211,71,0.15)',
    rowEven: 'rgba(255,255,255,0.07)', rowOdd: 'rgba(255,255,255,0.03)',
    divider: 'rgba(248,211,71,0.25)', footerColor: 'rgba(255,255,255,0.5)',
    contactColor: 'rgba(255,255,255,0.7)', priceColor: '#f8d347', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:12px;right:18px;font-size:3rem;opacity:0.15">🏖️</div><div style="position:absolute;bottom:12px;left:18px;font-size:2.5rem;opacity:0.12">☀️</div><div style="position:absolute;top:45%;right:12px;font-size:1.8rem;opacity:0.08">🌴</div>'
  },
  'ulang-tahun': {
    label: 'Ulang Tahun', emoji: '🎂',
    greeting: 'Promo Spesial Ulang Tahun!',
    bg: 'linear-gradient(150deg, #6a1b9a 0%, #8e24aa 40%, #4a148c 100%)',
    accent: '#ffb300', accentDark: '#2a0a45',
    titleColor: '#fff', subtitleColor: 'rgba(255,255,255,0.75)',
    pillBg: 'rgba(255,179,0,0.9)', pillColor: '#4a148c',
    typePillBg: '#ffb300', typePillColor: '#2a0a45',
    headerBg: 'rgba(255,255,255,0.1)', tableHeaderBg: 'rgba(255,179,0,0.15)',
    rowEven: 'rgba(255,255,255,0.07)', rowOdd: 'rgba(255,255,255,0.03)',
    divider: 'rgba(255,179,0,0.3)', footerColor: 'rgba(255,255,255,0.5)',
    contactColor: 'rgba(255,255,255,0.7)', priceColor: '#ffb300', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:12px;right:18px;font-size:3rem;opacity:0.15">🎂</div><div style="position:absolute;bottom:12px;left:18px;font-size:2.5rem;opacity:0.12">🎉</div><div style="position:absolute;top:35%;left:10px;font-size:1.5rem;opacity:0.08">🎈</div>'
  },
  maulid: {
    label: 'Maulid Nabi', emoji: '🕌',
    greeting: 'Maulid Nabi Muhammad SAW',
    bg: 'linear-gradient(150deg, #1b5e20 0%, #2e7d32 40%, #145218 100%)',
    accent: '#e8c860', accentDark: '#0a2e0d',
    titleColor: '#fff', subtitleColor: 'rgba(255,255,255,0.7)',
    pillBg: 'rgba(232,200,96,0.9)', pillColor: '#1b5e20',
    typePillBg: '#e8c860', typePillColor: '#0a2e0d',
    headerBg: 'rgba(232,200,96,0.08)', tableHeaderBg: 'rgba(232,200,96,0.15)',
    rowEven: 'rgba(255,255,255,0.06)', rowOdd: 'rgba(255,255,255,0.03)',
    divider: 'rgba(232,200,96,0.25)', footerColor: 'rgba(255,255,255,0.5)',
    contactColor: 'rgba(255,255,255,0.7)', priceColor: '#e8c860', gramColor: 'rgba(255,255,255,0.85)',
    decoHTML: '<div style="position:absolute;top:15px;right:20px;font-size:3rem;opacity:0.12">🕌</div><div style="position:absolute;bottom:15px;left:20px;font-size:2.5rem;opacity:0.1">☪️</div>'
  },
  anniversary: {
    label: 'Anniversary', emoji: '💎',
    greeting: 'Promo Anniversary Spesial!',
    bg: 'linear-gradient(150deg, #0d0d0d 0%, #1a1a1a 40%, #0d0d0d 100%)',
    accent: '#d4a843', accentDark: '#0a0a0a',
    titleColor: '#e8d5a0', subtitleColor: 'rgba(212,168,67,0.7)',
    pillBg: 'rgba(212,168,67,0.15)', pillColor: '#d4a843',
    typePillBg: '#d4a843', typePillColor: '#0d0d0d',
    headerBg: 'rgba(212,168,67,0.08)', tableHeaderBg: 'rgba(212,168,67,0.15)',
    rowEven: 'rgba(255,255,255,0.04)', rowOdd: 'rgba(255,255,255,0.02)',
    divider: 'rgba(212,168,67,0.3)', footerColor: 'rgba(212,168,67,0.5)',
    contactColor: 'rgba(212,168,67,0.7)', priceColor: '#d4a843', gramColor: 'rgba(232,213,160,0.85)',
    decoHTML: '<div style="position:absolute;top:15px;right:20px;font-size:3rem;opacity:0.1">💎</div><div style="position:absolute;bottom:15px;left:20px;font-size:2.5rem;opacity:0.08">✨</div>'
  }
};

// ---- PARSER ----
function parseGoldPrices(text) {
  const lines = text.split('\n');
  const prices = [];
  const patterns = [
    /^([^=]*?)\s*=\s*([0-9.,]+)/,
    /^([^-]*?)\s*[-–]\s*([0-9.,]+)/,
    /^([^|]*?)\s*\|\s*([0-9.,]+)/
  ];
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match) {
        const gramPart = match[1].trim();
        const pricePart = match[2].trim();
        if (gramPart && pricePart) {
          const priceNum = parseFloat(pricePart.replace(/[^0-9]/g, ''));
          const gramMatch = gramPart.match(/(\d+[.,]?\d*)/);
          if (gramMatch && !isNaN(priceNum)) {
            const gram = parseFloat(gramMatch[1].replace(',', '.'));
            prices.push({
              gram,
              gramText: gramPart,
              price: priceNum,
              formatted: new Intl.NumberFormat('id-ID').format(priceNum)
            });
            break;
          }
        }
      }
    }
  });
  return { prices };
}

function formatGram(g) {
  return Number.isInteger(g) ? `${g} gr` : `${g.toString().replace('.', ',')} gr`;
}

// ---- THEME SELECTION ----
function initThemeGrid() {
  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedTheme = card.dataset.theme;
      // Update greeting placeholder
      const t = THEMES[selectedTheme];
      if (t) {
        document.getElementById('greetingText').placeholder = t.greeting;
      }
    });
  });
}

// ---- GENERATE FLYER ----
function generateFlyer() {
  const inputText = document.getElementById('inputText').value.trim();
  const brandName = document.getElementById('brandName').value || 'TOKO EMAS';
  const customerType = document.getElementById('customerType').value || 'CUSTOMER';
  const flyerDate = document.getElementById('flyerDate').value || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const contactInfo = document.getElementById('contactInfo').value || '';
  const greetingText = document.getElementById('greetingText').value || '';

  if (!inputText) {
    setStatus('Masukkan data harga terlebih dahulu', 'error');
    return;
  }
  const { prices } = parseGoldPrices(inputText);
  if (prices.length === 0) {
    setStatus('Format tidak terbaca. Gunakan: "0.5gr = 1700"', 'error');
    return;
  }

  // Update parsed preview
  showParsedPreview(prices);
  buildFlyer(prices, brandName, customerType, flyerDate, contactInfo, greetingText);
  setStatus(`Flyer berhasil dibuat dengan ${prices.length} harga`, 'success');
}

function showParsedPreview(prices) {
  const preview = document.getElementById('parsedPreview');
  if (!preview) return;
  document.getElementById('parsedCount').textContent = `${prices.length} harga terdeteksi`;
  document.getElementById('parsedList').innerHTML = prices.map(p =>
    `<div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;">
      <span style="color:#aaa">${formatGram(p.gram)}</span>
      <span style="color:#d4a843;font-weight:600">Rp ${p.formatted}</span>
    </div>`
  ).join('');
  preview.classList.add('show');
}

// ---- BUILD FLYER HTML ----
function buildFlyer(prices, brandName, customerType, flyerDate, contactInfo, greetingText) {
  const t = THEMES[selectedTheme];
  if (!t) return;
  const output = document.getElementById('flyerOutput');
  if (!output) return;
  output.innerHTML = '';

  const greeting = greetingText || t.greeting;

  // Build price rows
  const priceRows = prices.slice(0, 12).map((p, i) =>
    `<div class="price-row" style="background:${i % 2 === 0 ? t.rowEven : t.rowOdd}">
      <span class="gram-label" style="color:${t.gramColor}">${formatGram(p.gram)}</span>
      <span class="price-label" style="color:${t.priceColor}">Rp ${p.formatted}</span>
    </div>`
  ).join('');

  // Gold bars
  const bars = Array(5).fill('<div class="gold-bar-mini"></div>').join('');

  const flyerHTML = `
    <div class="flyer" id="flyerCanvas">
      <div class="flyer-bg" style="background:${t.bg}"></div>
      <div class="flyer-decorations">
        ${t.decoHTML}
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 60%),radial-gradient(ellipse at 10% 80%, rgba(255,255,255,0.04) 0%, transparent 50%)"></div>
      </div>
      <div class="flyer-inner">
        <!-- Header -->
        <div class="flyer-header" style="background:${t.headerBg};border-radius:14px;padding:20px 22px 16px;margin-bottom:16px;">
          <div class="flyer-greeting" style="color:${t.subtitleColor}">${greeting}</div>
          <div class="flyer-brand-name" style="color:${t.titleColor}">${brandName}</div>
          <div class="flyer-customer-type" style="color:${t.subtitleColor}">${customerType}</div>
        </div>

        <!-- Pills -->
        <div class="flyer-pills">
          <span class="flyer-pill" style="background:${t.pillBg};color:${t.pillColor}">${flyerDate}</span>
          <span class="flyer-pill" style="background:${t.typePillBg};color:${t.typePillColor}">EMAS ANTAM</span>
        </div>

        <!-- Price Table -->
        <div class="flyer-price-table" style="border-radius:14px;overflow:hidden;">
          <div class="price-table-header" style="background:${t.tableHeaderBg}">
            <span style="color:rgba(255,255,255,0.9)">GRAM</span>
            <span style="color:rgba(255,255,255,0.9)">HARGA</span>
          </div>
          <div class="price-table-body">${priceRows}</div>
        </div>

        <!-- Gold Bars -->
        <div class="gold-bars-row">${bars}</div>

        <!-- Divider -->
        <div class="flyer-divider" style="background:${t.divider}"></div>

        <!-- Footer -->
        <div class="flyer-footer">
          <div class="flyer-footer-note" style="color:${t.footerColor}">Harga Sewaktu-waktu Dapat Berubah</div>
          ${contactInfo ? `<div class="flyer-contact" style="color:${t.contactColor}">${contactInfo}</div>` : ''}
          <div class="flyer-tagline" style="color:${t.footerColor}">✦ Kepercayaan Anda, Komitmen Kami ✦</div>
        </div>
      </div>
    </div>
  `;

  output.innerHTML = flyerHTML;
}

// ---- STATUS ----
function setStatus(message, type = 'info') {
  const el = document.getElementById('statusMsg');
  if (!el) return;
  el.textContent = message;
  el.className = `status-msg ${type}`;
  el.style.opacity = '1';
  if (type === 'success') {
    setTimeout(() => { el.style.opacity = '0'; }, 3000);
  }
}

// ---- DOWNLOAD ----
async function downloadFlyer() {
  const flyerEl = document.getElementById('flyerCanvas');
  if (!flyerEl) { setStatus('Buat flyer terlebih dahulu', 'error'); return; }
  try {
    if (typeof html2canvas === 'undefined') { setStatus('Library html2canvas tidak tersedia', 'error'); return; }
    setStatus('Memproses download...', 'info');

    const t = THEMES[selectedTheme];

    const canvas = await html2canvas(flyerEl, {
      scale: 3,
      backgroundColor: null,
      logging: false,
      useCORS: true,
      allowTaint: true,
      onclone: function(clonedDoc) {
        const clonedFlyer = clonedDoc.getElementById('flyerCanvas');
        if (!clonedFlyer) return;

        // 1. Move gradient directly onto the main .flyer element
        if (t) {
          clonedFlyer.style.background = t.bg;
        }

        // 2. Hide the separate absolute-positioned background layer
        const bgEl = clonedFlyer.querySelector('.flyer-bg');
        if (bgEl) bgEl.style.display = 'none';

        // 3. Hide the decorations overlay (radial gradients cause issues)
        const decoEl = clonedFlyer.querySelector('.flyer-decorations');
        if (decoEl) decoEl.style.display = 'none';

        // 4. Remove all backdrop-filter and -webkit-backdrop-filter
        clonedFlyer.querySelectorAll('*').forEach(el => {
          const cs = el.style;
          if (cs.backdropFilter) cs.backdropFilter = 'none';
          if (cs.webkitBackdropFilter) cs.webkitBackdropFilter = 'none';
        });

        // 5. Make .flyer-inner fully opaque
        const innerEl = clonedFlyer.querySelector('.flyer-inner');
        if (innerEl) {
          innerEl.style.position = 'relative';
          innerEl.style.zIndex = '1';
        }
      }
    });
    const link = document.createElement('a');
    link.download = `gold-flyer-${selectedTheme}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    link.remove();
    setStatus('Flyer berhasil diunduh ✓', 'success');
  } catch (error) {
    console.error('Download error:', error);
    setStatus('Gagal mengunduh flyer', 'error');
  }
}

// ---- BACKGROUND PARTICLES ----
function createParticles() {
  const container = document.getElementById('bgParticles');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = (Math.random() * 6) + 's';
    p.style.animationDuration = (4 + Math.random() * 4) + 's';
    p.style.width = (2 + Math.random() * 4) + 'px';
    p.style.height = p.style.width;
    container.appendChild(p);
  }
}

// ---- CAPTION GENERATOR ----
function generateCaption() {
  const inputText = document.getElementById('inputText').value.trim();
  const brandName = document.getElementById('brandName').value || 'FOUZA MINI GOLD';
  const customerType = document.getElementById('customerType').value || 'CUSTOMER';
  const flyerDate = document.getElementById('flyerDate').value || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const contactInfo = document.getElementById('contactInfo').value || '';
  const greetingText = document.getElementById('greetingText').value || '';
  const t = THEMES[selectedTheme];

  if (!inputText) {
    setStatus('Masukkan data harga terlebih dahulu', 'error');
    return;
  }
  const { prices } = parseGoldPrices(inputText);
  if (prices.length === 0) {
    setStatus('Format tidak terbaca.', 'error');
    return;
  }

  const greeting = greetingText || (t ? t.greeting : '');
  let caption = '';

  if (selectedCaptionStyle === 'elegant') {
    caption = buildElegantCaption(prices, brandName, customerType, flyerDate, contactInfo, greeting, t);
  } else if (selectedCaptionStyle === 'clean') {
    caption = buildCleanCaption(prices, brandName, customerType, flyerDate, contactInfo, greeting, t);
  } else {
    caption = buildEmojiCaption(prices, brandName, customerType, flyerDate, contactInfo, greeting, t);
  }

  const wrapper = document.getElementById('captionOutputWrapper');
  const output = document.getElementById('captionOutput');
  if (output) output.textContent = caption;
  if (wrapper) wrapper.classList.add('show');
  setStatus('Caption berhasil dibuat ✓', 'success');
}

function formatPrice(p) {
  return p.formatted;
}

function buildElegantCaption(prices, brand, custType, date, contact, greeting, t) {
  let lines = [];
  lines.push('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم');
  lines.push('');
  if (greeting) {
    lines.push(`✨ ${greeting} ✨`);
    lines.push('');
  }
  lines.push(`━━━━━━━━━━━━━━━━━━`);
  lines.push(`   ✦ ${brand} ✦`);
  lines.push(`        ${custType}`);
  lines.push(`━━━━━━━━━━━━━━━━━━`);
  lines.push('');
  lines.push(`📅 ${date}`);
  lines.push(`🏷️ EMAS ANTAM`);
  lines.push('');
  lines.push('┌──────────────────────┐');
  lines.push('│   📊 DAFTAR HARGA     │');
  lines.push('├──────────────────────┤');
  prices.forEach(p => {
    const gram = formatGram(p.gram).padEnd(8);
    lines.push(`│  ${gram} ➜  Rp ${formatPrice(p)}`);
  });
  lines.push('└──────────────────────┘');
  lines.push('');
  lines.push('⚠️ _Harga sewaktu-waktu dapat berubah_');
  if (contact) {
    lines.push('');
    lines.push(`📞 Info & Order: *${contact}*`);
  }
  lines.push('');
  lines.push('✦ _Kepercayaan Anda, Komitmen Kami_ ✦');
  return lines.join('\n');
}

function buildCleanCaption(prices, brand, custType, date, contact, greeting, t) {
  let lines = [];
  lines.push('Bismillah.');
  lines.push('');
  if (greeting) {
    lines.push(greeting);
    lines.push('');
  }
  lines.push(`*${brand}*`);
  lines.push(`${custType}`);
  lines.push(`${date}`);
  lines.push('');
  lines.push('Ready 2026');
  lines.push('');
  prices.forEach(p => {
    lines.push(`${formatGram(p.gram)} = ${formatPrice(p)}`);
  });
  lines.push('');
  lines.push('_Harga sewaktu-waktu dapat berubah_');
  if (contact) {
    lines.push('');
    lines.push(`Order: ${contact}`);
  }
  return lines.join('\n');
}

function buildEmojiCaption(prices, brand, custType, date, contact, greeting, t) {
  const emoji = t ? t.emoji : '📊';
  let lines = [];
  lines.push('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم');
  lines.push('');
  if (greeting) {
    lines.push(`${emoji} *${greeting}* ${emoji}`);
    lines.push('');
  }
  lines.push(`🏪 *${brand}*`);
  lines.push(`👤 ${custType}`);
  lines.push(`📅 ${date}`);
  lines.push('');
  lines.push('🔥 *Ready 2026* 🔥');
  lines.push('');
  lines.push('💰 *DAFTAR HARGA EMAS ANTAM* 💰');
  lines.push('');
  prices.forEach(p => {
    lines.push(`🥇 ${formatGram(p.gram)} ▸ Rp ${formatPrice(p)}`);
  });
  lines.push('');
  lines.push('⚠️ _Harga sewaktu-waktu dapat berubah_');
  if (contact) {
    lines.push('');
    lines.push(`📱 *Info & Order:*`);
    lines.push(`📞 ${contact}`);
  }
  lines.push('');
  lines.push('✨ _Kepercayaan Anda, Komitmen Kami_ ✨');
  lines.push(`${emoji}${emoji}${emoji}`);
  return lines.join('\n');
}

function copyCaption() {
  const output = document.getElementById('captionOutput');
  if (!output || !output.textContent) return;
  navigator.clipboard.writeText(output.textContent).then(() => {
    const btn = document.getElementById('copyBtn');
    if (btn) {
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
        btn.classList.remove('copied');
      }, 2000);
    }
  });
}

// ---- THEME TABS ----
function initThemeTabs() {
  const tabs = document.querySelectorAll('.theme-tab');
  const cards = document.querySelectorAll('.theme-card');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.category;
      cards.forEach(card => {
        if (card.dataset.category === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
  // Show only 'daily' category initially
  cards.forEach(card => {
    if (card.dataset.category !== 'daily') {
      card.style.display = 'none';
    }
  });
}

// ---- CAPTION STYLE SELECTOR ----
function initCaptionStyles() {
  document.querySelectorAll('.caption-style-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.caption-style-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCaptionStyle = btn.dataset.style;
    });
  });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initThemeGrid();
  initThemeTabs();
  initCaptionStyles();

  const flyerDate = document.getElementById('flyerDate');
  if (flyerDate) {
    flyerDate.value = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Set initial greeting placeholder
  const t = THEMES[selectedTheme];
  if (t) document.getElementById('greetingText').placeholder = t.greeting;

  // Live preview debounce
  let debounceTimer = null;
  const inputText = document.getElementById('inputText');
  if (inputText) {
    inputText.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const text = inputText.value.trim();
        if (text.length > 5) {
          const { prices } = parseGoldPrices(text);
          if (prices.length > 0) showParsedPreview(prices);
        }
      }, 400);
    });
  }
});

