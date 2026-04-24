// Parse gold prices from various text formats
function parseGoldPrices(text) {
  const lines = text.split('\n');
  const prices = [];
  let label = '';

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

    // If no pattern matched, check if it's a label line
    if (!matched && /^[a-z\s]+$/i.test(trimmed) && trimmed.length < 40) {
      label = trimmed;
    }
  });

  return { prices, label: label || 'Harga Emas' };
}

// Format gram display with Indonesian number format
function formatGram(g) {
  if (Number.isInteger(g)) {
    return `${g} gr`;
  }
  return `${g.toString().replace('.', ',')} gr`;
}

// Generate the flyer
function generateFlyer() {
  const priceText = document.getElementById('priceListInput').value.trim();
  
  if (!priceText) {
    setStatus('Masukkan data harga terlebih dahulu', 'error');
    return;
  }

  const { prices, label } = parseGoldPrices(priceText);
  
  if (prices.length === 0) {
    setStatus('Format tidak terbaca. Gunakan: "0.5gr = 1700" atau "1gr | 3125"', 'error');
    return;
  }

  // Show preview
  const preview = document.getElementById('parsedPreview');
  if (preview) {
    document.getElementById('parsedCount').textContent = `✓ ${prices.length} harga terdeteksi`;
    document.getElementById('parsedList').innerHTML = prices.map(p =>
      `<div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <span style="color: #aaa">${formatGram(p.gram)}</span>
        <span style="color: #d4a843">Rp ${p.formatted}</span>
      </div>`
    ).join('');
    preview.classList.add('show');
  }

  // Build the flyer
  buildFlyerHTML(prices, label);
  setStatus(`Flyer berhasil dibuat dengan ${prices.length} harga`, 'success');
}

// Build and render the flyer HTML
function buildFlyerHTML(prices, label) {
  const headline = document.getElementById('headlineInput').value || 'HARGA EMAS TERBARU';
  const date = document.getElementById('dateInput').value || new Date().toISOString().split('T')[0];
  const currency = document.getElementById('currencyInput').value || 'Rp ';
  const footer = document.getElementById('footerInput').value || 'Kepercayaan Anda, Komitmen Kami';

  // Format date
  const dateObj = new Date(date + 'T00:00:00');
  const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const dateLabel = dateFormatter.format(dateObj);

  // Create flyer container
  const flyerContainer = document.getElementById('flyerCanvas');
  if (!flyerContainer) return;

  flyerContainer.innerHTML = '';

  const flyer = document.createElement('div');
  flyer.style.cssText = `
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 40px;
    background: linear-gradient(135deg, #fffdf6 0%, #f8edd8 50%, #f2e2bf 100%);
    color: #5e4411;
    font-family: 'Playfair Display', serif;
    position: relative;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    border-radius: 8px;
  `;

  // Title section
  const titleSection = document.createElement('div');
  titleSection.style.cssText = `
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 2px solid rgba(212, 160, 23, 0.5);
    padding-bottom: 20px;
  `;
  
  const mainTitle = document.createElement('h1');
  mainTitle.textContent = headline;
  mainTitle.style.cssText = `
    font-size: 48px;
    font-weight: 700;
    color: #9a6b13;
    margin: 0 0 10px 0;
    font-family: 'Cinzel Decorative', serif;
  `;
  
  const subtitle = document.createElement('p');
  subtitle.textContent = dateLabel;
  subtitle.style.cssText = `
    font-size: 14px;
    color: #8f7542;
    margin: 0;
    font-family: 'Cinzel', serif;
    letter-spacing: 1px;
  `;
  
  titleSection.appendChild(mainTitle);
  titleSection.appendChild(subtitle);

  // Price grid
  const gridSection = document.createElement('div');
  gridSection.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 30px;
  `;

  prices.slice(0, 6).forEach((price, idx) => {
    const card = document.createElement('div');
    card.style.cssText = `
      background: rgba(255, 255, 255, 0.7);
      padding: 15px;
      border-radius: 6px;
      border: 1px solid rgba(173, 125, 27, 0.3);
      text-align: center;
    `;

    const gramLabel = document.createElement('div');
    gramLabel.textContent = formatGram(price.gram);
    gramLabel.style.cssText = `
      font-size: 14px;
      color: #8e6415;
      font-family: 'Cinzel', serif;
      margin-bottom: 8px;
      font-weight: 600;
    `;

    const priceLabel = document.createElement('div');
    priceLabel.textContent = currency + price.formatted;
    priceLabel.style.cssText = `
      font-size: 18px;
      color: #6f4f14;
      font-weight: 700;
      font-family: 'Playfair Display', serif;
    `;

    card.appendChild(gramLabel);
    card.appendChild(priceLabel);
    gridSection.appendChild(card);
  });

  // Footer section
  const footerSection = document.createElement('div');
  footerSection.style.cssText = `
    text-align: center;
    border-top: 2px solid rgba(212, 160, 23, 0.5);
    padding-top: 20px;
    margin-top: 20px;
  `;

  const footerText = document.createElement('p');
  footerText.textContent = footer;
  footerText.style.cssText = `
    font-size: 14px;
    color: #8f7542;
    font-family: 'EB Garamond', serif;
    margin: 0;
    font-style: italic;
  `;

  footerSection.appendChild(footerText);

  // Assemble flyer
  flyer.appendChild(titleSection);
  flyer.appendChild(gridSection);
  flyer.appendChild(footerSection);

  flyerContainer.appendChild(flyer);
  flyerContainer.style.display = 'block';
}

// Set status message
function setStatus(message, type = 'info') {
  const statusEl = document.getElementById('status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  statusEl.style.opacity = '1';

  if (type === 'success') {
    setTimeout(() => {
      statusEl.style.opacity = '0';
    }, 3000);
  }
}

// Download flyer as image
async function downloadFlyer() {
  const flyerCanvas = document.getElementById('flyerCanvas');
  if (!flyerCanvas || !flyerCanvas.firstChild) {
    setStatus('Buat flyer terlebih dahulu', 'error');
    return;
  }

  try {
    // Check if html2canvas is loaded
    if (typeof html2canvas === 'undefined') {
      setStatus('Library html2canvas tidak tersedia', 'error');
      return;
    }

    const canvas = await html2canvas(flyerCanvas.firstChild, {
      scale: 2,
      backgroundColor: null,
      logging: false
    });

    const link = document.createElement('a');
    const date = document.getElementById('dateInput').value || new Date().toISOString().split('T')[0];
    link.download = `gold-flyer-${date}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    link.remove();

    setStatus('Flyer berhasil diunduh', 'success');
  } catch (error) {
    console.error('Download error:', error);
    setStatus('Gagal mengunduh flyer', 'error');
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const headlineInput = document.getElementById('headlineInput');
  const dateInput = document.getElementById('dateInput');
  const currencyInput = document.getElementById('currencyInput');
  const priceListInput = document.getElementById('priceListInput');
  const footerInput = document.getElementById('footerInput');
  const renderBtn = document.getElementById('renderBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Set default date
  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }

  // Render button
  if (renderBtn) {
    renderBtn.addEventListener('click', generateFlyer);
  }

  // Download button
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadFlyer);
  }

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      headlineInput.value = 'HARGA EMAS TERBARU';
      dateInput.value = new Date().toISOString().split('T')[0];
      currencyInput.value = 'Rp ';
      priceListInput.value = '0,5gr = 1.700\n1gr = 3.400\n2gr = 6.800\n5gr = 17.000\n10gr = 34.000\n25gr = 85.000';
      footerInput.value = 'Kepercayaan Anda, Komitmen Kami';
      generateFlyer();
    });
  }

  // Live preview with debounce
  let debounceTimer = null;
  const updatePreview = () => {
    const priceText = priceListInput.value.trim();
    if (priceText.length > 5) {
      const { prices } = parseGoldPrices(priceText);
      if (prices.length > 0) {
        const preview = document.getElementById('parsedPreview');
        if (preview) {
          document.getElementById('parsedCount').textContent = `✓ ${prices.length} harga terdeteksi`;
          document.getElementById('parsedList').innerHTML = prices.map(p =>
            `<div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px;">
              <span style="color: #aaa">${formatGram(p.gram)}</span>
              <span style="color: #d4a843">Rp ${p.formatted}</span>
            </div>`
          ).join('');
          preview.classList.add('show');
        }
      }
    }
  };

  if (priceListInput) {
    priceListInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updatePreview, 400);
    });
  }

  // Initial render
  generateFlyer();
});
