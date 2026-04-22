(() => {
  const canvas = document.getElementById("flyerCanvas");
  const headlineInput = document.getElementById("headlineInput");
  const dateInput = document.getElementById("dateInput");
  const currencyInput = document.getElementById("currencyInput");
  const priceListInput = document.getElementById("priceListInput");
  const footerInput = document.getElementById("footerInput");
  const resetBtn = document.getElementById("resetBtn");
  const renderBtn = document.getElementById("renderBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  if (
    !(canvas instanceof HTMLCanvasElement) ||
    !(headlineInput instanceof HTMLTextAreaElement) ||
    !(dateInput instanceof HTMLInputElement) ||
    !(currencyInput instanceof HTMLInputElement) ||
    !(priceListInput instanceof HTMLTextAreaElement) ||
    !(footerInput instanceof HTMLInputElement) ||
    !(resetBtn instanceof HTMLButtonElement) ||
    !(renderBtn instanceof HTMLButtonElement) ||
    !(downloadBtn instanceof HTMLButtonElement)
  ) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const BUSINESS_INFO = {
    storeName: "FOUZA MINI GOLD",
    region: "TUBAN",
    address: "Perumahan Tuban Akbar",
    hours: "Buka setiap hari, 06.00-20.00 WIB",
    whatsapp: "+62 822-3040-5090",
    instagram: "fouza_minigold"
  };

  const DEFAULT_SERVICES = [
    "Jual Emas Batangan",
    "Jual Perhiasan",
    "Beli Kembali (Buyback)",
    "Tukar Tambah",
    "Gadai Emas",
    "Sertifikasi Emas",
    "Konsultasi Investasi",
    "Custom Perhiasan"
  ];

  const MARKET_DATA = [
    { value: "$3.328", label: "XAU / USD", sub: "Spot Price" },
    { value: "15.980", label: "USD / IDR", sub: "Kurs BI" },
    { value: "▲ 0,4%", label: "Perubahan", sub: "vs kemarin" }
  ];

  const DEFAULTS = {
    headline: "HARGA EMAS\nFOUZA MINI GOLD\nBismillah. Ready 2026",
    currency: "Rp ",
    priceList: [
      "Bismillah.",
      "Ready 2026",
      "0.5gr = 1.700",
      "1gr = 3.125",
      "3gr = 8.850",
      "5gr = 14.350",
      "10gr = 28.050",
      "Min 2pcs",
      "25gr = 69.600",
      "50gr = 138.825 (ready malam)",
      "100gr = 277.500"
    ].join("\n"),
    footer: "Harga dapat berubah sewaktu-waktu mengikuti harga pasar global"
  };

  function toInputDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseInputDate(value) {
    if (!value) {
      return new Date();
    }

    const candidate = new Date(`${value}T00:00:00`);
    if (Number.isNaN(candidate.getTime())) {
      return new Date();
    }

    return candidate;
  }

  function formatDateLabel(date) {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function formatDateParts(date) {
    const dayMonth = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long"
    }).format(date);

    return {
      dayMonth,
      yearLine: `${date.getFullYear()} - Update 08.00 WIB`
    };
  }

  function roundedRectPath(drawCtx, x, y, width, height, radius) {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));

    drawCtx.beginPath();
    drawCtx.moveTo(x + r, y);
    drawCtx.lineTo(x + width - r, y);
    drawCtx.quadraticCurveTo(x + width, y, x + width, y + r);
    drawCtx.lineTo(x + width, y + height - r);
    drawCtx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    drawCtx.lineTo(x + r, y + height);
    drawCtx.quadraticCurveTo(x, y + height, x, y + height - r);
    drawCtx.lineTo(x, y + r);
    drawCtx.quadraticCurveTo(x, y, x + r, y);
    drawCtx.closePath();
  }

  function fitFontSize(drawCtx, text, maxWidth, baseSize, minSize, weight, family) {
    let size = baseSize;

    while (size > minSize) {
      drawCtx.font = `${weight} ${size}px ${family}`;
      if (drawCtx.measureText(text).width <= maxWidth) {
        break;
      }
      size -= 1;
    }

    return size;
  }

  function trimToWidth(drawCtx, text, maxWidth) {
    if (drawCtx.measureText(text).width <= maxWidth) {
      return text;
    }

    const ellipsis = "...";
    let trimmed = text;

    while (trimmed.length > 0) {
      trimmed = trimmed.slice(0, -1);
      if (drawCtx.measureText(`${trimmed}${ellipsis}`).width <= maxWidth) {
        return `${trimmed}${ellipsis}`;
      }
    }

    return ellipsis;
  }

  function ensureCurrencyPrefix(value, prefix) {
    const cleanValue = value.trim();
    const cleanPrefix = prefix.trim();

    if (!cleanValue || !cleanPrefix) {
      return cleanValue;
    }

    const compactValue = cleanValue.replace(/\s+/g, "").toLowerCase();
    const compactPrefix = cleanPrefix.replace(/\s+/g, "").toLowerCase();

    if (compactValue.startsWith(compactPrefix)) {
      return cleanValue;
    }

    const divider = cleanPrefix.endsWith(" ") ? "" : " ";
    return `${cleanPrefix}${divider}${cleanValue}`;
  }

  function parseNumericValue(value) {
    const digits = value.replace(/[^0-9]/g, "");
    if (!digits) {
      return null;
    }

    const parsed = Number.parseInt(digits, 10);
    if (Number.isNaN(parsed)) {
      return null;
    }

    return parsed;
  }

  function formatNumericPrice(numberValue, prefix) {
    const normalizedPrefix = prefix.trim() || "Rp";
    return `${normalizedPrefix} ${new Intl.NumberFormat("id-ID").format(numberValue)}`;
  }

  function splitCurrencyAndAmount(value, prefix) {
    const clean = value.trim();
    const amountMatch = clean.match(/[0-9][0-9.,]*/);

    if (!amountMatch || typeof amountMatch.index !== "number") {
      return {
        prefix: prefix.trim() || "Rp",
        amount: clean
      };
    }

    const beforeAmount = clean.slice(0, amountMatch.index).trim();
    return {
      prefix: beforeAmount || prefix.trim() || "Rp",
      amount: amountMatch[0]
    };
  }

  function buildChangeData(featuredPriceValue) {
    const base = featuredPriceValue || 1700000;
    const step = Math.max(1000, Math.round((base * 0.004) / 500) * 500);
    const percent = ((step / base) * 100).toFixed(1).replace(".", ",");

    return {
      direction: "up",
      text: `+${new Intl.NumberFormat("id-ID").format(step)} (+${percent}%)`
    };
  }

  function karatDescription(label) {
    const lower = label.toLowerCase();

    if (lower.includes("24")) {
      return "Emas murni";
    }
    if (lower.includes("22")) {
      return "Perhiasan premium";
    }
    if (lower.includes("18") && lower.includes("putih")) {
      return "White gold";
    }
    if (lower.includes("18")) {
      return "Perhiasan fashion";
    }
    if (lower.includes("17")) {
      return "Standar perhiasan";
    }
    if (lower.includes("buyback")) {
      return "Harga beli kembali";
    }

    return "Harga per gram";
  }

  function parseRows(priceText, prefix) {
    const lines = priceText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      return [{ type: "note", note: "Tambahkan baris: 0.5gr = 1.700" }];
    }

    return lines.map((line) => {
      const separator = line.indexOf("=");

      if (separator === -1) {
        return { type: "note", note: line };
      }

      const label = line.slice(0, separator).trim();
      const amount = line.slice(separator + 1).trim();

      if (!label || !amount) {
        return { type: "note", note: line };
      }

      return {
        type: "price",
        label,
        value: ensureCurrencyPrefix(amount, prefix)
      };
    });
  }

  function pickFeaturedAndGrid(priceRows, prefix) {
    const fallbackFeatured = {
      label: "Emas 24 Karat",
      value: ensureCurrencyPrefix("1.742.000", prefix)
    };

    const fallbackBuyback = {
      label: "Buyback 24 Karat",
      value: ensureCurrencyPrefix("1.698.000", prefix)
    };

    const featured = priceRows[0] || fallbackFeatured;

    const explicitBuyback = priceRows.find((row) => row.label.toLowerCase().includes("buyback"));
    let buyback = explicitBuyback || null;

    if (!buyback) {
      const featuredNumeric = parseNumericValue(featured.value);
      if (featuredNumeric) {
        buyback = {
          label: "Buyback",
          value: formatNumericPrice(Math.round(featuredNumeric * 0.975), prefix)
        };
      } else {
        buyback = fallbackBuyback;
      }
    }

    const filteredGrid = priceRows.filter((row, index) => {
      if (index === 0) {
        return false;
      }

      if (row === buyback) {
        return false;
      }

      return true;
    });

    const fallbackGrid = [
      { label: "Emas 22 Karat", value: ensureCurrencyPrefix("1.594.000", prefix) },
      { label: "Emas 18 Karat", value: ensureCurrencyPrefix("1.305.000", prefix) },
      { label: "Emas 17 Karat", value: ensureCurrencyPrefix("1.232.000", prefix) },
      { label: "Emas Putih 18K", value: ensureCurrencyPrefix("1.360.000", prefix) }
    ];

    const gridRows = filteredGrid.slice(0, 4);
    while (gridRows.length < 4) {
      gridRows.push(fallbackGrid[gridRows.length]);
    }

    return {
      featured,
      buyback,
      gridRows
    };
  }

  function buildState() {
    const dateObj = parseInputDate(dateInput.value);
    const currencyPrefix = currencyInput.value || "Rp ";

    const headlineLines = headlineInput.value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 3);

    const mainTitle = headlineLines[0] || "HARGA EMAS";
    const storeName = headlineLines[1] || BUSINESS_INFO.storeName;
    const eyebrow = headlineLines[2] || "Bismillah. Ready 2026";

    const rows = parseRows(priceListInput.value, currencyPrefix);
    const priceRows = rows.filter((row) => row.type === "price");
    const noteRows = rows.filter((row) => row.type === "note").map((row) => row.note);

    const picks = pickFeaturedAndGrid(priceRows, currencyPrefix);

    const featuredNumeric = parseNumericValue(picks.featured.value);
    const changeData = buildChangeData(featuredNumeric);

    const services = noteRows.length > 0 ? noteRows.slice(0, 8) : DEFAULT_SERVICES;
    const servicesTitle = noteRows.length > 0 ? "Catatan" : "Layanan Kami";

    const footerLine = footerInput.value.trim() || DEFAULTS.footer;

    return {
      mainTitle,
      storeName,
      eyebrow,
      dateLabel: formatDateLabel(dateObj),
      dateParts: formatDateParts(dateObj),
      region: BUSINESS_INFO.region,
      featured: picks.featured,
      buyback: picks.buyback,
      changeData,
      gridRows: picks.gridRows,
      services,
      servicesTitle,
      address: BUSINESS_INFO.address,
      hours: BUSINESS_INFO.hours,
      whatsapp: BUSINESS_INFO.whatsapp,
      instagram: BUSINESS_INFO.instagram,
      footerLine,
      market: MARKET_DATA,
      currencyPrefix
    };
  }

  function drawBackground(drawCtx) {
    const width = canvas.width;
    const height = canvas.height;

    const bg = drawCtx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, "#0d0b08");
    bg.addColorStop(0.52, "#151208");
    bg.addColorStop(1, "#0a0805");
    drawCtx.fillStyle = bg;
    drawCtx.fillRect(0, 0, width, height);

    const glowTop = drawCtx.createRadialGradient(width * 0.5, 80, 40, width * 0.5, 80, 620);
    glowTop.addColorStop(0, "rgba(212, 160, 23, 0.25)");
    glowTop.addColorStop(1, "rgba(212, 160, 23, 0)");
    drawCtx.fillStyle = glowTop;
    drawCtx.fillRect(0, 0, width, 760);

    const glowBottom = drawCtx.createRadialGradient(width * 0.5, height, 80, width * 0.5, height, 760);
    glowBottom.addColorStop(0, "rgba(200, 122, 117, 0.15)");
    glowBottom.addColorStop(1, "rgba(200, 122, 117, 0)");
    drawCtx.fillStyle = glowBottom;
    drawCtx.fillRect(0, height - 760, width, 760);

    for (let i = 0; i < 40; i += 1) {
      const x = (i * 127) % width;
      const y = (i * 239) % height;
      drawCtx.fillStyle = "rgba(212, 160, 23, 0.08)";
      drawCtx.fillRect(x, y, 2, 2);
    }
  }

  function drawArtDecoCorner(drawCtx, x, y, flipX, flipY) {
    drawCtx.save();
    drawCtx.translate(x, y);
    drawCtx.scale(flipX, flipY);

    drawCtx.strokeStyle = "#a07010";
    drawCtx.lineWidth = 3;
    drawCtx.beginPath();
    drawCtx.moveTo(0, 0);
    drawCtx.lineTo(0, 52);
    drawCtx.moveTo(0, 0);
    drawCtx.lineTo(52, 0);
    drawCtx.stroke();

    drawCtx.strokeStyle = "#d4a017";
    drawCtx.lineWidth = 1.5;
    drawCtx.beginPath();
    drawCtx.moveTo(8, 8);
    drawCtx.lineTo(8, 42);
    drawCtx.moveTo(8, 8);
    drawCtx.lineTo(42, 8);
    drawCtx.stroke();

    drawCtx.fillStyle = "#d4a017";
    drawCtx.beginPath();
    drawCtx.arc(8, 8, 3.5, 0, Math.PI * 2);
    drawCtx.fill();

    drawCtx.strokeStyle = "#a07010";
    drawCtx.lineWidth = 1.2;
    drawCtx.beginPath();
    drawCtx.moveTo(16, 0);
    drawCtx.lineTo(16, 8);
    drawCtx.moveTo(0, 16);
    drawCtx.lineTo(8, 16);
    drawCtx.stroke();

    drawCtx.restore();
  }

  function drawOuterFrame(drawCtx) {
    const frame = {
      x: 52,
      y: 52,
      width: canvas.width - 104,
      height: canvas.height - 104
    };

    roundedRectPath(drawCtx, frame.x, frame.y, frame.width, frame.height, 8);
    drawCtx.strokeStyle = "rgba(212, 160, 23, 0.9)";
    drawCtx.lineWidth = 3;
    drawCtx.stroke();

    roundedRectPath(drawCtx, frame.x + 10, frame.y + 10, frame.width - 20, frame.height - 20, 6);
    drawCtx.strokeStyle = "rgba(212, 160, 23, 0.42)";
    drawCtx.lineWidth = 1;
    drawCtx.stroke();

    drawArtDecoCorner(drawCtx, frame.x + 14, frame.y + 14, 1, 1);
    drawArtDecoCorner(drawCtx, frame.x + frame.width - 14, frame.y + 14, -1, 1);
    drawArtDecoCorner(drawCtx, frame.x + 14, frame.y + frame.height - 14, 1, -1);
    drawArtDecoCorner(drawCtx, frame.x + frame.width - 14, frame.y + frame.height - 14, -1, -1);
  }

  function drawFloralSide(drawCtx, side) {
    const anchorX = side === "left" ? 115 : canvas.width - 115;
    const direction = side === "left" ? 1 : -1;

    drawCtx.save();
    drawCtx.translate(anchorX, 105);

    drawCtx.strokeStyle = "rgba(90, 122, 64, 0.7)";
    drawCtx.lineWidth = 3;
    drawCtx.beginPath();
    drawCtx.moveTo(0, 110);
    drawCtx.quadraticCurveTo(18 * direction, 70, 26 * direction, 45);
    drawCtx.quadraticCurveTo(33 * direction, 25, 42 * direction, 8);
    drawCtx.stroke();

    drawCtx.lineWidth = 2;
    drawCtx.beginPath();
    drawCtx.moveTo(14 * direction, 72);
    drawCtx.quadraticCurveTo(2 * direction, 64, -8 * direction, 54);
    drawCtx.stroke();

    const leaves = [
      [8, 54, 16, 8, -26],
      [20, 42, 14, 7, 8],
      [34, 24, 14, 6, -48],
      [43, 36, 12, 5, 14]
    ];

    leaves.forEach(([x, y, rx, ry, rotation], index) => {
      drawCtx.save();
      drawCtx.translate(x * direction, y);
      drawCtx.rotate((rotation * Math.PI) / 180);
      drawCtx.fillStyle = index % 2 === 0 ? "rgba(106, 138, 80, 0.64)" : "rgba(74, 106, 50, 0.58)";
      drawCtx.beginPath();
      drawCtx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      drawCtx.fill();
      drawCtx.restore();
    });

    const flowers = [
      [44, 10, 9],
      [18, 28, 7]
    ];

    flowers.forEach(([x, y, radius]) => {
      drawCtx.fillStyle = "rgba(200, 122, 117, 0.6)";
      drawCtx.beginPath();
      drawCtx.arc(x * direction, y, radius, 0, Math.PI * 2);
      drawCtx.fill();

      drawCtx.fillStyle = "rgba(232, 180, 173, 0.78)";
      drawCtx.beginPath();
      drawCtx.arc(x * direction, y, radius * 0.56, 0, Math.PI * 2);
      drawCtx.fill();

      drawCtx.fillStyle = "rgba(245, 200, 192, 0.88)";
      drawCtx.beginPath();
      drawCtx.arc(x * direction, y, radius * 0.28, 0, Math.PI * 2);
      drawCtx.fill();
    });

    const berries = [
      [10, 60],
      [6, 54],
      [27, 43],
      [43, 28]
    ];

    berries.forEach(([x, y], index) => {
      drawCtx.fillStyle = index % 2 === 0 ? "rgba(212, 160, 23, 0.64)" : "rgba(249, 224, 128, 0.52)";
      drawCtx.beginPath();
      drawCtx.arc(x * direction, y, index % 2 === 0 ? 2.3 : 1.8, 0, Math.PI * 2);
      drawCtx.fill();
    });

    drawCtx.restore();
  }

  function drawOrnamentDivider(drawCtx, y, centerSize) {
    const x = 94;
    const width = canvas.width - 188;
    const centerWidth = centerSize;

    drawCtx.strokeStyle = "rgba(212, 160, 23, 0.75)";
    drawCtx.lineWidth = 1;
    drawCtx.beginPath();
    drawCtx.moveTo(x, y);
    drawCtx.lineTo(x + (width - centerWidth) / 2 - 12, y);
    drawCtx.stroke();

    drawCtx.beginPath();
    drawCtx.moveTo(x + width - (width - centerWidth) / 2 + 12, y);
    drawCtx.lineTo(x + width, y);
    drawCtx.stroke();

    const centerX = x + width / 2;
    drawCtx.fillStyle = "#d4a017";
    drawCtx.save();
    drawCtx.translate(centerX - centerWidth * 0.5 + 18, y);
    drawCtx.rotate(Math.PI / 4);
    drawCtx.fillRect(-4, -4, 8, 8);
    drawCtx.restore();

    drawCtx.save();
    drawCtx.translate(centerX + centerWidth * 0.5 - 18, y);
    drawCtx.rotate(Math.PI / 4);
    drawCtx.fillRect(-4, -4, 8, 8);
    drawCtx.restore();

    drawCtx.strokeStyle = "rgba(212, 160, 23, 0.82)";
    drawCtx.lineWidth = 1.5;
    drawCtx.beginPath();
    drawCtx.moveTo(centerX - 20, y);
    drawCtx.lineTo(centerX, y - 8);
    drawCtx.lineTo(centerX + 20, y);
    drawCtx.lineTo(centerX, y + 8);
    drawCtx.closePath();
    drawCtx.stroke();
  }

  function drawHeader(drawCtx, state) {
    const panel = {
      x: 80,
      y: 78,
      width: canvas.width - 160,
      height: 230
    };

    const panelFill = drawCtx.createLinearGradient(panel.x, panel.y, panel.x + panel.width, panel.y + panel.height);
    panelFill.addColorStop(0, "#2c2215");
    panelFill.addColorStop(0.6, "#1a1508");
    panelFill.addColorStop(1, "#0d0b06");

    roundedRectPath(drawCtx, panel.x, panel.y, panel.width, panel.height, 8);
    drawCtx.fillStyle = panelFill;
    drawCtx.fill();

    drawCtx.strokeStyle = "rgba(212, 160, 23, 0.24)";
    drawCtx.lineWidth = 1;
    roundedRectPath(drawCtx, panel.x, panel.y, panel.width, panel.height, 8);
    drawCtx.stroke();

    drawFloralSide(drawCtx, "left");
    drawFloralSide(drawCtx, "right");

    drawCtx.fillStyle = "#d4a017";
    drawCtx.textAlign = "center";
    drawCtx.textBaseline = "middle";
    drawCtx.font = '600 20px "Cinzel", serif';
    drawCtx.fillText(trimToWidth(drawCtx, state.eyebrow.toUpperCase(), panel.width - 240), canvas.width / 2, panel.y + 42);

    const titleSize = fitFontSize(
      drawCtx,
      state.mainTitle,
      panel.width - 260,
      76,
      44,
      "700",
      '"Cinzel Decorative", serif'
    );
    drawCtx.font = `700 ${titleSize}px "Cinzel Decorative", serif`;
    drawCtx.fillStyle = "#f9e080";
    drawCtx.shadowColor = "rgba(212, 160, 23, 0.6)";
    drawCtx.shadowBlur = 22;
    drawCtx.fillText(trimToWidth(drawCtx, state.mainTitle, panel.width - 260), canvas.width / 2, panel.y + 110);
    drawCtx.shadowBlur = 0;

    drawCtx.font = '600 32px "Playfair Display", serif';
    drawCtx.fillStyle = "#e8b4ad";
    drawCtx.fillText(trimToWidth(drawCtx, state.storeName, panel.width - 260), canvas.width / 2, panel.y + 170);
  }

  function drawStoreStrip(drawCtx, state) {
    const strip = {
      x: 80,
      y: 346,
      width: canvas.width - 160,
      height: 94
    };

    const stripFill = drawCtx.createLinearGradient(strip.x, strip.y, strip.x + strip.width, strip.y);
    stripFill.addColorStop(0, "#1e1a0e");
    stripFill.addColorStop(0.5, "#272210");
    stripFill.addColorStop(1, "#1e1a0e");

    roundedRectPath(drawCtx, strip.x, strip.y, strip.width, strip.height, 4);
    drawCtx.fillStyle = stripFill;
    drawCtx.fill();

    drawCtx.strokeStyle = "rgba(212, 160, 23, 0.18)";
    drawCtx.lineWidth = 1;
    roundedRectPath(drawCtx, strip.x, strip.y, strip.width, strip.height, 4);
    drawCtx.stroke();

    drawCtx.textAlign = "left";
    drawCtx.textBaseline = "middle";
    drawCtx.font = '600 21px "Cinzel", serif';
    drawCtx.fillStyle = "#f9e080";
    const storeText = trimToWidth(drawCtx, `${state.storeName.toUpperCase()} - ${state.region}`, strip.width - 420);
    drawCtx.fillText(storeText, strip.x + 26, strip.y + strip.height / 2 + 1);

    drawCtx.textAlign = "right";
    drawCtx.font = '700 43px "Playfair Display", serif';
    drawCtx.fillStyle = "#f9e080";
    drawCtx.fillText(state.dateParts.dayMonth, strip.x + strip.width - 28, strip.y + 36);

    drawCtx.font = '500 16px "Raleway", sans-serif';
    drawCtx.fillStyle = "#9a8a5a";
    drawCtx.fillText(state.dateParts.yearLine.toUpperCase(), strip.x + strip.width - 28, strip.y + 70);
  }

  function drawFeaturedCard(drawCtx, state) {
    const box = {
      x: 100,
      y: 498,
      width: canvas.width - 200,
      height: 220
    };

    const fill = drawCtx.createLinearGradient(box.x, box.y, box.x + box.width, box.y + box.height);
    fill.addColorStop(0, "rgba(212, 160, 23, 0.09)");
    fill.addColorStop(1, "rgba(160, 112, 16, 0.04)");

    roundedRectPath(drawCtx, box.x, box.y, box.width, box.height, 4);
    drawCtx.fillStyle = fill;
    drawCtx.fill();

    drawCtx.strokeStyle = "rgba(212, 160, 23, 0.25)";
    drawCtx.lineWidth = 2;
    roundedRectPath(drawCtx, box.x, box.y, box.width, box.height, 4);
    drawCtx.stroke();

    drawCtx.strokeStyle = "rgba(212, 160, 23, 0.65)";
    drawCtx.lineWidth = 2;
    drawCtx.beginPath();
    drawCtx.moveTo(box.x + 12, box.y + 8);
    drawCtx.lineTo(box.x + box.width - 12, box.y + 8);
    drawCtx.stroke();

    drawCtx.textAlign = "left";
    drawCtx.textBaseline = "top";
    drawCtx.font = '600 16px "Cinzel", serif';
    drawCtx.fillStyle = "#9a8a5a";
    drawCtx.fillText("HARGA TERBARU", box.x + 20, box.y + 18);

    drawCtx.font = '600 29px "Playfair Display", serif';
    drawCtx.fillStyle = "#e8b4ad";
    drawCtx.fillText(trimToWidth(drawCtx, state.featured.label, box.width - 360), box.x + 20, box.y + 54);

    drawCtx.font = '700 73px "Playfair Display", serif';
    drawCtx.fillStyle = "#f9e080";
    const featuredPrice = trimToWidth(drawCtx, state.featured.value, box.width - 390);
    drawCtx.fillText(featuredPrice, box.x + 20, box.y + 96);

    const shineX = box.x + 160;
    const shineY = box.y + 94;
    drawCtx.save();
    drawCtx.beginPath();
    drawCtx.rect(box.x + 20, box.y + 96, box.width - 390, 88);
    drawCtx.clip();
    drawCtx.fillStyle = "rgba(255, 255, 255, 0.14)";
    drawCtx.transform(1, 0, -0.36, 1, 0, 0);
    drawCtx.fillRect(shineX, shineY, 90, 100);
    drawCtx.restore();

    drawCtx.font = '500 20px "Raleway", sans-serif';
    drawCtx.fillStyle = "#9a8a5a";
    drawCtx.fillText("update hari ini", box.x + 26, box.y + 178);

    const tagX = box.x + box.width - 300;
    const tagY = box.y + 74;
    const tagW = 262;
    const tagH = 38;

    roundedRectPath(drawCtx, tagX, tagY, tagW, tagH, 19);
    drawCtx.fillStyle = state.changeData.direction === "up" ? "rgba(74, 222, 128, 0.1)" : "rgba(248, 113, 113, 0.1)";
    drawCtx.fill();

    roundedRectPath(drawCtx, tagX, tagY, tagW, tagH, 19);
    drawCtx.strokeStyle = state.changeData.direction === "up" ? "rgba(74, 222, 128, 0.3)" : "rgba(248, 113, 113, 0.3)";
    drawCtx.lineWidth = 1.4;
    drawCtx.stroke();

    drawCtx.textAlign = "center";
    drawCtx.textBaseline = "middle";
    drawCtx.font = '600 18px "Raleway", sans-serif';
    drawCtx.fillStyle = state.changeData.direction === "up" ? "#4ade80" : "#f87171";
    drawCtx.fillText(`▲ ${state.changeData.text}`, tagX + tagW / 2, tagY + tagH / 2 + 1);

    drawCtx.textAlign = "right";
    drawCtx.textBaseline = "alphabetic";
    drawCtx.font = '500 18px "Raleway", sans-serif';
    drawCtx.fillStyle = "#9a8a5a";
    drawCtx.fillText("Buyback:", box.x + box.width - 30, box.y + 154);

    drawCtx.font = '600 24px "Playfair Display", serif';
    drawCtx.fillStyle = "#f5edd6";
    drawCtx.fillText(trimToWidth(drawCtx, state.buyback.value, 240), box.x + box.width - 30, box.y + 184);
  }

  function drawSectionTitle(drawCtx, text, y) {
    drawCtx.textAlign = "left";
    drawCtx.textBaseline = "middle";
    drawCtx.font = '600 17px "Cinzel", serif';
    drawCtx.fillStyle = "#d4a017";
    drawCtx.fillText(text.toUpperCase(), 100, y);

    const titleWidth = drawCtx.measureText(text.toUpperCase()).width;
    const lineStart = 100 + titleWidth + 14;

    drawCtx.strokeStyle = "rgba(160, 112, 16, 0.56)";
    drawCtx.lineWidth = 1;
    drawCtx.beginPath();
    drawCtx.moveTo(lineStart, y + 1);
    drawCtx.lineTo(canvas.width - 100, y + 1);
    drawCtx.stroke();
  }

  function drawPriceGrid(drawCtx, state) {
    drawSectionTitle(drawCtx, "Daftar Harga Emas", 748);

    const startX = 100;
    const startY = 774;
    const gap = 14;
    const cardW = (canvas.width - 200 - gap) / 2;
    const cardH = 168;

    state.gridRows.forEach((row, index) => {
      const col = index % 2;
      const rowIndex = Math.floor(index / 2);
      const x = startX + col * (cardW + gap);
      const y = startY + rowIndex * (cardH + gap);

      roundedRectPath(drawCtx, x, y, cardW, cardH, 4);
      drawCtx.fillStyle = "rgba(255, 255, 255, 0.02)";
      drawCtx.fill();

      roundedRectPath(drawCtx, x, y, cardW, cardH, 4);
      drawCtx.strokeStyle = "rgba(212, 160, 23, 0.16)";
      drawCtx.lineWidth = 1.2;
      drawCtx.stroke();

      drawCtx.strokeStyle = "rgba(160, 112, 16, 0.72)";
      drawCtx.lineWidth = 1;
      drawCtx.beginPath();
      drawCtx.moveTo(x + 10, y + 10);
      drawCtx.lineTo(x + cardW - 10, y + 10);
      drawCtx.stroke();

      drawCtx.textAlign = "left";
      drawCtx.textBaseline = "top";
      drawCtx.font = '600 16px "Cinzel", serif';
      drawCtx.fillStyle = "#f9e080";
      drawCtx.fillText(trimToWidth(drawCtx, row.label.toUpperCase(), cardW - 28), x + 12, y + 20);

      drawCtx.font = '600 18px "Playfair Display", serif';
      drawCtx.fillStyle = "#9a8a5a";
      drawCtx.fillText(karatDescription(row.label), x + 12, y + 48);

      const parts = splitCurrencyAndAmount(row.value, state.currencyPrefix);
      drawCtx.textBaseline = "alphabetic";
      drawCtx.font = '500 16px "Raleway", sans-serif';
      drawCtx.fillStyle = "#9a8a5a";
      drawCtx.fillText(parts.prefix, x + 12, y + 103);

      drawCtx.font = '700 39px "Playfair Display", serif';
      drawCtx.fillStyle = "#f5edd6";
      drawCtx.fillText(trimToWidth(drawCtx, parts.amount, cardW - 28), x + 12, y + 141);

      const isUp = index % 2 === 0;
      drawCtx.font = '600 16px "Raleway", sans-serif';
      drawCtx.fillStyle = isUp ? "#4ade80" : "#f87171";
      drawCtx.fillText(isUp ? "▲ +3.500" : "▼ -2.000", x + 12, y + 160);
    });
  }

  function drawMarketStrip(drawCtx, state) {
    drawSectionTitle(drawCtx, "Data Pasar Global", 1160);

    const strip = {
      x: 100,
      y: 1188,
      width: canvas.width - 200,
      height: 128
    };

    roundedRectPath(drawCtx, strip.x, strip.y, strip.width, strip.height, 4);
    drawCtx.fillStyle = "rgba(212, 160, 23, 0.05)";
    drawCtx.fill();

    roundedRectPath(drawCtx, strip.x, strip.y, strip.width, strip.height, 4);
    drawCtx.strokeStyle = "rgba(212, 160, 23, 0.17)";
    drawCtx.lineWidth = 1.1;
    drawCtx.stroke();

    const cellWidth = strip.width / state.market.length;

    state.market.forEach((item, index) => {
      const x = strip.x + index * cellWidth;

      if (index > 0) {
        drawCtx.beginPath();
        drawCtx.moveTo(x, strip.y + 12);
        drawCtx.lineTo(x, strip.y + strip.height - 12);
        drawCtx.strokeStyle = "rgba(212, 160, 23, 0.15)";
        drawCtx.lineWidth = 1;
        drawCtx.stroke();
      }

      drawCtx.textAlign = "center";
      drawCtx.textBaseline = "middle";

      drawCtx.font = '700 34px "Playfair Display", serif';
      drawCtx.fillStyle = "#f9e080";
      drawCtx.fillText(item.value, x + cellWidth / 2, strip.y + 38);

      drawCtx.font = '600 14px "Cinzel", serif';
      drawCtx.fillStyle = "#9a8a5a";
      drawCtx.fillText(item.label.toUpperCase(), x + cellWidth / 2, strip.y + 76);

      drawCtx.font = '500 14px "Raleway", sans-serif';
      drawCtx.fillStyle = "#7a6a3a";
      drawCtx.fillText(item.sub, x + cellWidth / 2, strip.y + 102);
    });
  }

  function drawServices(drawCtx, state) {
    drawSectionTitle(drawCtx, state.servicesTitle, 1360);

    const startX = 100;
    const startY = 1390;
    const colGap = 30;
    const rowGap = 8;
    const colWidth = (canvas.width - 200 - colGap) / 2;
    const itemHeight = 42;

    state.services.slice(0, 8).forEach((service, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = startX + col * (colWidth + colGap);
      const y = startY + row * (itemHeight + rowGap);

      drawCtx.beginPath();
      drawCtx.moveTo(x, y + itemHeight);
      drawCtx.lineTo(x + colWidth, y + itemHeight);
      drawCtx.strokeStyle = "rgba(212, 160, 23, 0.12)";
      drawCtx.lineWidth = 1;
      drawCtx.stroke();

      drawCtx.fillStyle = "#d4a017";
      drawCtx.beginPath();
      drawCtx.arc(x + 7, y + 21, 4, 0, Math.PI * 2);
      drawCtx.fill();

      drawCtx.textAlign = "left";
      drawCtx.textBaseline = "middle";
      drawCtx.font = '500 20px "Raleway", sans-serif';
      drawCtx.fillStyle = "#f5edd6";
      drawCtx.fillText(trimToWidth(drawCtx, service, colWidth - 28), x + 19, y + 21);
    });
  }

  function drawFooter(drawCtx, state) {
    drawOrnamentDivider(drawCtx, 1652, 98);

    drawCtx.textAlign = "left";
    drawCtx.textBaseline = "top";

    drawCtx.strokeStyle = "rgba(212, 160, 23, 0.32)";
    drawCtx.lineWidth = 1;
    drawCtx.beginPath();
    drawCtx.arc(114, 1712, 13, 0, Math.PI * 2);
    drawCtx.stroke();

    drawCtx.font = '600 13px "Raleway", sans-serif';
    drawCtx.fillStyle = "#d4a017";
    drawCtx.fillText("LOC", 103, 1706);

    drawCtx.font = '600 20px "Playfair Display", serif';
    drawCtx.fillStyle = "#f5edd6";
    drawCtx.fillText(trimToWidth(drawCtx, state.address, 440), 136, 1698);
    drawCtx.font = '500 16px "Raleway", sans-serif';
    drawCtx.fillStyle = "#9a8a5a";
    drawCtx.fillText(trimToWidth(drawCtx, state.hours, 440), 136, 1730);

    drawCtx.beginPath();
    drawCtx.arc(604, 1712, 13, 0, Math.PI * 2);
    drawCtx.strokeStyle = "rgba(212, 160, 23, 0.32)";
    drawCtx.lineWidth = 1;
    drawCtx.stroke();

    drawCtx.font = '600 13px "Raleway", sans-serif';
    drawCtx.fillStyle = "#d4a017";
    drawCtx.fillText("WA", 594, 1706);

    drawCtx.font = '600 20px "Playfair Display", serif';
    drawCtx.fillStyle = "#f5edd6";
    drawCtx.fillText(trimToWidth(drawCtx, state.whatsapp, 300), 626, 1698);
    drawCtx.font = '500 16px "Raleway", sans-serif';
    drawCtx.fillStyle = "#9a8a5a";
    drawCtx.fillText(trimToWidth(drawCtx, `Instagram: @${state.instagram}`, 300), 626, 1730);

    drawCtx.textAlign = "center";
    drawCtx.textBaseline = "middle";
    drawCtx.font = '500 20px "EB Garamond", serif';
    drawCtx.fillStyle = "#9a8a5a";
    drawCtx.fillText(trimToWidth(drawCtx, state.footerLine, canvas.width - 180), canvas.width / 2, 1858);

    drawCtx.font = '500 14px "Raleway", sans-serif';
    drawCtx.fillStyle = "rgba(154, 138, 90, 0.7)";
    drawCtx.fillText(state.dateLabel, canvas.width / 2, 1886);
  }

  function renderFlyer() {
    const state = buildState();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx);
    drawOuterFrame(ctx);
    drawHeader(ctx, state);
    drawOrnamentDivider(ctx, 326, 124);
    drawStoreStrip(ctx, state);
    drawFeaturedCard(ctx, state);
    drawPriceGrid(ctx, state);
    drawMarketStrip(ctx, state);
    drawServices(ctx, state);
    drawFooter(ctx, state);
  }

  function loadExample() {
    headlineInput.value = DEFAULTS.headline;
    dateInput.value = toInputDate(new Date());
    currencyInput.value = DEFAULTS.currency;
    priceListInput.value = DEFAULTS.priceList;
    footerInput.value = DEFAULTS.footer;
  }

  function downloadImage() {
    const nameDate = dateInput.value || toInputDate(new Date());
    const fileName = `gold-flyer-artdeco-${nameDate}.png`;
    const link = document.createElement("a");

    link.href = canvas.toDataURL("image/png");
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  resetBtn.addEventListener("click", () => {
    loadExample();
    renderFlyer();
  });

  renderBtn.addEventListener("click", renderFlyer);

  downloadBtn.addEventListener("click", () => {
    renderFlyer();
    downloadImage();
  });

  [headlineInput, dateInput, currencyInput, priceListInput, footerInput].forEach((element) => {
    element.addEventListener("input", renderFlyer);
  });

  if (!dateInput.value) {
    dateInput.value = toInputDate(new Date());
  }

  if (!headlineInput.value.trim() && !priceListInput.value.trim()) {
    loadExample();
  }

  renderFlyer();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(renderFlyer).catch(() => {
      renderFlyer();
    });
  }
})();
