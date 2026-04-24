// Parse gold prices from various text formats
function parseGoldPrices(text) {
  const lines = text.split('\n');
  const prices = [];

  // Regex patterns for different formats
  const patterns = [
    /^([^=]*?)\s*=\s*([0-9.,]+)/,        // Format: "0.5gr = 1.700"
    /^([^-]*?)\s*[-–]\s*([0-9.,]+)/,     // Format: "0.5gr - 1.700"
    /^([^|]*?)\s*\|\s*([0-9.,]+)/        // Format: "0.5 gr | 1.640.000"
  ];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Try to match patterns
    let matched = false;
    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match) {
        const gramPart = match[1].trim();
        const pricePart = match[2].trim();
        
        if (gramPart && pricePart) {
          const gramNum = parseFloat(gramPart.replace(/[^0-9.]/g, ''));
          const priceNum = parseFloat(pricePart.replace(/[^0-9]/g, ''));
          
          if (!isNaN(gramNum) && !isNaN(priceNum)) {
            // Extract gram value
            const gramMatch = gramPart.match(/(\d+[.,]?\d*)/);
            if (gramMatch) {
              const gram = parseFloat(gramMatch[1].replace(',', '.'));
              const formatted = new Intl.NumberFormat('id-ID').format(priceNum);
              
              prices.push({
                gram: gram,
                gramText: gramPart,
                price: priceNum,
                formatted: formatted
              });
              
              matched = true;
              break;
            }
          }
        }
      }
    }
  });

  return { prices };
}

// Format gram display with Indonesian number format
function formatGram(g) {
  if (Number.isInteger(g)) {
    return `${g} gr`;
  }
  return `${g.toString().replace('.', ',')} gr`;
}

// Get color theme CSS
function getThemeColors(theme) {
  const themes = {
    teal: {
      bg: 'linear-gradient(135deg, #0a3d3a 0%, #0d5a57 50%, #104a47 100%)',
      title: '#ffffff',
      subtitle: '#d4af37',
      card: 'rgba(212, 175, 55, 0.15)',
      cardBorder: 'rgba(212, 175, 55, 0.4)',
      price: '#d4af37'
    },
    dark: {
      bg: 'linear-gradient(135deg, #fffdf6 0%, #f8edd8 50%, #f2e2bf 100%)',
      title: '#5e4411',
      subtitle: '#9a6b13',
      card: 'rgba(255, 255, 255, 0.7)',
      cardBorder: 'rgba(173, 125, 27, 0.3)',
      price: '#6f4f14'
    },
    royal: {
      bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      title: '#ffffff',
      subtitle: '#e94560',
      card: 'rgba(233, 69, 96, 0.15)',
      cardBorder: 'rgba(233, 69, 96, 0.4)',
      price: '#e94560'
    }
  };
  return themes[theme] || themes.teal;
}

// Generate the flyer
function generateFlyer() {
  const inputText = document.getElementById('inputText').value.trim();
  const brandName = document.getElementById('brandName').value || 'TOKO EMAS';
  const customerType = document.getElementById('customerType').value || 'CUSTOMER';
  const flyerDate = document.getElementById('flyerDate').value || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const contactInfo = document.getElementById('contactInfo').value || '';
  const colorTheme = document.getElementById('colorTheme').value || 'teal';
  
  if (!inputText) {
    setStatus('Masukkan data harga terlebih dahulu', 'error');
    return;
  }

  const { prices } = parseGoldPrices(inputText);
  
  if (prices.length === 0) {
    setStatus('Format tidak terbaca. Gunakan: "0.5gr = 1700" atau "1gr | 3125"', 'error');
    return;
  }

  // Show live preview
  const preview = document.getElementById('parsedPreview');
  if (preview) {
    document.getElementById('parsedCount').textContent = `✓ ${prices.length} harga terdeteksi`;
    document.getElementById('parsedList').innerHTML = prices.map(p =>
      `<div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid rgba(212,175,55,0.2); font-size: 13px;">
        <span style="color: #aaa">${formatGram(p.gram)}</span>
        <span style="color: #d4af37">Rp ${p.formatted}</span>
      </div>`
    ).join('');
    preview.classList.add('show');
  }

  // Build and render flyer
  buildFlyer(prices, brandName, customerType, flyerDate, contactInfo, colorTheme);
  setStatus(`Flyer berhasil dibuat dengan ${prices.length} harga`, 'success');
}

// Build and render the flyer HTML
function buildFlyer(prices, brandName, customerType, flyerDate, contactInfo, colorTheme) {
  const theme = getThemeColors(colorTheme);
  const output = document.getElementById('flyerOutput');
  if (!output) return;

  output.innerHTML = '';

  const flyer = document.createElement('div');
  flyer.style.cssText = `
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 40px;
    background: ${theme.bg};
    color: ${theme.title};
    font-family: 'Playfair Display', serif;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    position: relative;
    min-height: 800px;
    display: flex;
    flex-direction: column;
  `;

  // Header section
  const header = document.createElement('div');
  header.style.cssText = `
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid ${theme.subtitle};
  `;

  const storeName = document.createElement('h1');
  storeName.textContent = brandName;
  storeName.style.cssText = `
    font-size: 36px;
    font-weight: 700;
    color: ${theme.title};
    margin: 0 0 5px 0;
    font-family: 'Cinzel', serif;
    letter-spacing: 2px;
  `;

  const typeLabel = document.createElement('p');
  typeLabel.textContent = customerType;
  typeLabel.style.cssText = `
    font-size: 12px;
    color: ${theme.subtitle};
    margin: 5px 0;
    letter-spacing: 1px;
    font-family: 'Cinzel', serif;
  `;

  const dateLabel = document.createElement('p');
  dateLabel.textContent = flyerDate;
  dateLabel.style.cssText = `
    font-size: 11px;
    color: ${theme.subtitle};
    margin: 5px 0 0 0;
    opacity: 0.9;
  `;

  header.appendChild(storeName);
  header.appendChild(typeLabel);
  header.appendChild(dateLabel);

  // Price grid
  const gridSection = document.createElement('div');
  gridSection.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 30px;
    flex: 1;
  `;

  prices.slice(0, 12).forEach(price => {
    const card = document.createElement('div');
    card.style.cssText = `
      background: ${theme.card};
      border: 1px solid ${theme.cardBorder};
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      backdrop-filter: blur(10px);
    `;

    const gramLabel = document.createElement('div');
    gramLabel.textContent = formatGram(price.gram);
    gramLabel.style.cssText = `
      font-size: 13px;
      color: ${theme.subtitle};
      font-family: 'Cinzel', serif;
      margin-bottom: 8px;
      font-weight: 600;
      letter-spacing: 0.5px;
    `;

    const priceLabel = document.createElement('div');
    priceLabel.textContent = `Rp ${price.formatted}`;
    priceLabel.style.cssText = `
      font-size: 18px;
      color: ${theme.price};
      font-weight: 700;
      font-family: 'Playfair Display', serif;
    `;

    card.appendChild(gramLabel);
    card.appendChild(priceLabel);
    gridSection.appendChild(card);
  });

  // Footer section
  const footer = document.createElement('div');
  footer.style.cssText = `
    text-align: center;
    border-top: 2px solid ${theme.subtitle};
    padding-top: 20px;
  `;

  if (contactInfo) {
    const contact = document.createElement('p');
    contact.textContent = contactInfo;
    contact.style.cssText = `
      font-size: 13px;
      color: ${theme.subtitle};
      margin: 0;
      letter-spacing: 0.5px;
      font-family: 'Cinzel', serif;
    `;
    footer.appendChild(contact);
  }

  const tagline = document.createElement('p');
  tagline.textContent = '✦ Kepercayaan Anda, Komitmen Kami ✦';
  tagline.style.cssText = `
    font-size: 12px;
    color: ${theme.subtitle};
    margin: ${contactInfo ? '8px 0 0 0' : '0'};
    font-style: italic;
    letter-spacing: 1px;
  `;
  footer.appendChild(tagline);

  // Assemble flyer
  flyer.appendChild(header);
  flyer.appendChild(gridSection);
  flyer.appendChild(footer);

  output.appendChild(flyer);
}

// Set status message
function setStatus(message, type = 'info') {
  const statusEl = document.getElementById('statusMsg');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `status-msg ${type}`;
  statusEl.style.opacity = '1';

  if (type === 'success') {
    setTimeout(() => {
      statusEl.style.opacity = '0';
    }, 3000);
  }
}

// Download flyer as image
async function downloadFlyer() {
  const flyerOutput = document.getElementById('flyerOutput');
  if (!flyerOutput || !flyerOutput.firstChild) {
    setStatus('Buat flyer terlebih dahulu', 'error');
    return;
  }

  try {
    // Check if html2canvas is loaded
    if (typeof html2canvas === 'undefined') {
      setStatus('Library html2canvas tidak tersedia', 'error');
      return;
    }

    const canvas = await html2canvas(flyerOutput.firstChild, {
      scale: 2,
      backgroundColor: null,
      logging: false,
      useCORS: true
    });

    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `gold-flyer-${timestamp}.png`;
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const brandName = document.getElementById('brandName');
  const flyerDate = document.getElementById('flyerDate');

  // Otomatis set tanggal ke hari ini setiap kali page load
  if (flyerDate) {
    flyerDate.value = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // Live preview with debounce
  let debounceTimer = null;
  if (inputText) {
    inputText.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const text = inputText.value.trim();
        if (text.length > 5) {
          const { prices } = parseGoldPrices(text);
          if (prices.length > 0) {
            const preview = document.getElementById('parsedPreview');
            if (preview) {
              document.getElementById('parsedCount').textContent = `✓ ${prices.length} harga terdeteksi`;
              document.getElementById('parsedList').innerHTML = prices.map(p =>
                `<div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px;">
                  <span style="color: #aaa">${formatGram(p.gram)}</span>
                  <span style="color: #d4af37">Rp ${p.formatted}</span>
                </div>`
              ).join('');
              preview.classList.add('show');
            }
          }
        }
      }, 400);
    });
  }

  // Auto-generate on load with default values
  generateFlyer();
});
