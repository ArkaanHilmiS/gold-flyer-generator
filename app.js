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

  const DEFAULTS = {
    headline: "HARGA EMAS HARI INI\nANTAM + UBS\nUPDATE TERBARU",
    currency: "Rp ",
    priceList: [
      "ANTAM 0.5 gr = 1.050.000",
      "ANTAM 1 gr = 1.985.000",
      "ANTAM 2 gr = 3.910.000",
      "UBS 0.5 gr = 1.027.000",
      "UBS 1 gr = 1.924.000",
      "UBS 2 gr = 3.785.000",
      "BUYBACK ANTAM = 1.760.000",
      "Stok terbatas, chat admin dulu"
    ].join("\n"),
    footer: "Order cepat: WhatsApp 08xx-xxxx-xxxx"
  };

  function toInputDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatDate(value) {
    let parsed = new Date();

    if (value) {
      const maybe = new Date(`${value}T00:00:00`);
      if (!Number.isNaN(maybe.getTime())) {
        parsed = maybe;
      }
    }

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(parsed);
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

  function parseRows(priceText, prefix) {
    const lines = priceText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      return [{ type: "note", note: "Tambahkan baris: ANTAM 1 gr = 1.985.000" }];
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

  function buildState() {
    const headlineLines = headlineInput.value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 4);

    const safeHeadline =
      headlineLines.length > 0
        ? headlineLines
        : ["HARGA EMAS", "UPDATE HARI INI"];

    const footer = footerInput.value.trim();

    return {
      headlineLines: safeHeadline,
      dateLabel: formatDate(dateInput.value),
      currencyPrefix: currencyInput.value || "",
      rows: parseRows(priceListInput.value, currencyInput.value || ""),
      footerLine:
        footer.length > 0
          ? footer
          : "Hubungi admin untuk update stok dan harga buyback"
    };
  }

  function drawBackground(drawCtx) {
    const width = canvas.width;
    const height = canvas.height;

    const bg = drawCtx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, "#0e2f27");
    bg.addColorStop(0.5, "#154337");
    bg.addColorStop(1, "#1d5443");
    drawCtx.fillStyle = bg;
    drawCtx.fillRect(0, 0, width, height);

    const glowTop = drawCtx.createRadialGradient(width * 0.5, 180, 40, width * 0.5, 180, 560);
    glowTop.addColorStop(0, "rgba(245, 216, 147, 0.42)");
    glowTop.addColorStop(1, "rgba(245, 216, 147, 0)");
    drawCtx.fillStyle = glowTop;
    drawCtx.fillRect(0, 0, width, 700);

    const glowBottom = drawCtx.createRadialGradient(width * 0.5, height, 100, width * 0.5, height, 780);
    glowBottom.addColorStop(0, "rgba(245, 216, 147, 0.25)");
    glowBottom.addColorStop(1, "rgba(245, 216, 147, 0)");
    drawCtx.fillStyle = glowBottom;
    drawCtx.fillRect(0, height - 700, width, 700);

    drawCtx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    drawCtx.lineWidth = 1;
    for (let i = 0; i < 20; i += 1) {
      const y = 100 + i * 90;
      drawCtx.beginPath();
      drawCtx.moveTo(0, y);
      drawCtx.lineTo(width, y - 22);
      drawCtx.stroke();
    }

    const sparkles = [
      [130, 210],
      [940, 250],
      [190, 540],
      [900, 700],
      [220, 1450],
      [880, 1660]
    ];

    sparkles.forEach(([x, y]) => {
      drawCtx.strokeStyle = "rgba(248, 222, 157, 0.65)";
      drawCtx.lineWidth = 2;
      drawCtx.beginPath();
      drawCtx.moveTo(x - 14, y);
      drawCtx.lineTo(x + 14, y);
      drawCtx.stroke();

      drawCtx.beginPath();
      drawCtx.moveTo(x, y - 14);
      drawCtx.lineTo(x, y + 14);
      drawCtx.stroke();
    });
  }

  function drawOuterFrame(drawCtx) {
    const frameX = 48;
    const frameY = 48;
    const frameWidth = canvas.width - frameX * 2;
    const frameHeight = canvas.height - frameY * 2;

    const frameFill = drawCtx.createLinearGradient(0, frameY, 0, frameY + frameHeight);
    frameFill.addColorStop(0, "rgba(8, 28, 23, 0.22)");
    frameFill.addColorStop(1, "rgba(8, 28, 23, 0.08)");

    roundedRectPath(drawCtx, frameX, frameY, frameWidth, frameHeight, 44);
    drawCtx.fillStyle = frameFill;
    drawCtx.fill();

    const frameStroke = drawCtx.createLinearGradient(0, frameY, 0, frameY + frameHeight);
    frameStroke.addColorStop(0, "#f4db9e");
    frameStroke.addColorStop(0.45, "#cea450");
    frameStroke.addColorStop(1, "#f3d68f");

    roundedRectPath(drawCtx, frameX, frameY, frameWidth, frameHeight, 44);
    drawCtx.strokeStyle = frameStroke;
    drawCtx.lineWidth = 6;
    drawCtx.stroke();
  }

  function drawHeader(drawCtx, state) {
    const box = { x: 92, y: 110, width: 896, height: 332 };

    const panelFill = drawCtx.createLinearGradient(0, box.y, 0, box.y + box.height);
    panelFill.addColorStop(0, "rgba(14, 43, 36, 0.95)");
    panelFill.addColorStop(1, "rgba(22, 63, 51, 0.95)");

    roundedRectPath(drawCtx, box.x, box.y, box.width, box.height, 30);
    drawCtx.fillStyle = panelFill;
    drawCtx.fill();

    roundedRectPath(drawCtx, box.x, box.y, box.width, box.height, 30);
    drawCtx.strokeStyle = "rgba(241, 213, 147, 0.9)";
    drawCtx.lineWidth = 3;
    drawCtx.stroke();

    const lineWidth = box.width - 130;
    const lineHeight = (() => {
      const widest = Math.max(...state.headlineLines.map((line) => line.length));
      if (widest > 22) {
        return 60;
      }
      if (state.headlineLines.length >= 4) {
        return 66;
      }
      return 72;
    })();

    const headlineFamily = '"Fraunces", serif';
    let headlineSize = 78;

    for (let i = 0; i < state.headlineLines.length; i += 1) {
      headlineSize = Math.min(
        headlineSize,
        fitFontSize(
          drawCtx,
          state.headlineLines[i],
          lineWidth,
          headlineSize,
          46,
          "700",
          headlineFamily
        )
      );
    }

    const usedLineHeight = Math.max(52, Math.floor(lineHeight * (headlineSize / 74)));
    const blockHeight = usedLineHeight * state.headlineLines.length;
    const textTop = box.y + 44 + Math.max(0, (160 - blockHeight) / 2);

    drawCtx.fillStyle = "#f7e7b7";
    drawCtx.textAlign = "center";
    drawCtx.textBaseline = "top";
    drawCtx.shadowColor = "rgba(0, 0, 0, 0.32)";
    drawCtx.shadowBlur = 14;

    state.headlineLines.forEach((line, index) => {
      drawCtx.font = `700 ${headlineSize}px ${headlineFamily}`;
      drawCtx.fillText(line, box.x + box.width / 2, textTop + index * usedLineHeight);
    });

    drawCtx.shadowBlur = 0;

    const dateLabel = `Update: ${state.dateLabel}`;
    drawCtx.font = '700 33px "Plus Jakarta Sans", sans-serif';
    const pillWidth = drawCtx.measureText(dateLabel).width + 84;
    const pillX = box.x + (box.width - pillWidth) / 2;
    const pillY = box.y + box.height - 96;

    roundedRectPath(drawCtx, pillX, pillY, pillWidth, 58, 28);
    drawCtx.fillStyle = "#f4deaa";
    drawCtx.fill();

    roundedRectPath(drawCtx, pillX, pillY, pillWidth, 58, 28);
    drawCtx.strokeStyle = "#b88a35";
    drawCtx.lineWidth = 2;
    drawCtx.stroke();

    drawCtx.fillStyle = "#1b3d32";
    drawCtx.textAlign = "center";
    drawCtx.textBaseline = "middle";
    drawCtx.fillText(dateLabel, pillX + pillWidth / 2, pillY + 30);
  }

  function drawRows(drawCtx, rows, x, y, width, height) {
    const minRowHeight = 40;
    const maxRowHeight = 76;

    const rawRowHeight = Math.floor(height / Math.max(rows.length, 9));
    const rowHeight = Math.min(maxRowHeight, Math.max(minRowHeight, rawRowHeight));

    const capacity = Math.max(1, Math.floor(height / rowHeight));

    let visibleRows = rows;
    if (rows.length > capacity) {
      const visibleCount = Math.max(1, capacity - 1);
      const hiddenCount = rows.length - visibleCount;
      visibleRows = rows.slice(0, visibleCount);
      visibleRows.push({ type: "note", note: `+${hiddenCount} baris lainnya` });
    }

    visibleRows.forEach((row, index) => {
      const rowY = y + index * rowHeight;
      const rowX = x + 18;
      const rowWidth = width - 36;
      const rowRadius = Math.min(15, rowHeight * 0.3);

      if (row.type === "price") {
        roundedRectPath(drawCtx, rowX, rowY + 4, rowWidth, rowHeight - 8, rowRadius);
        drawCtx.fillStyle = index % 2 === 0 ? "#f9efd8" : "#f5e8cd";
        drawCtx.fill();

        const labelMaxWidth = rowWidth * 0.54;
        const valueMaxWidth = rowWidth * 0.32;

        const labelSize = fitFontSize(
          drawCtx,
          row.label,
          labelMaxWidth,
          Math.min(34, Math.floor(rowHeight * 0.56)),
          20,
          "700",
          '"Plus Jakarta Sans", sans-serif'
        );

        const valueSize = fitFontSize(
          drawCtx,
          row.value,
          valueMaxWidth,
          Math.min(36, Math.floor(rowHeight * 0.62)),
          20,
          "800",
          '"Plus Jakarta Sans", sans-serif'
        );

        const labelX = rowX + 24;
        const valueX = rowX + rowWidth - 24;
        const textY = rowY + rowHeight / 2;

        drawCtx.textBaseline = "middle";
        drawCtx.textAlign = "left";
        drawCtx.fillStyle = "#1a3b30";
        drawCtx.font = `700 ${labelSize}px "Plus Jakarta Sans", sans-serif`;
        const safeLabel = trimToWidth(drawCtx, row.label, labelMaxWidth);
        drawCtx.fillText(safeLabel, labelX, textY);

        drawCtx.textAlign = "right";
        drawCtx.fillStyle = "#0f3a2d";
        drawCtx.font = `800 ${valueSize}px "Plus Jakarta Sans", sans-serif`;
        const safeValue = trimToWidth(drawCtx, row.value, valueMaxWidth);
        drawCtx.fillText(safeValue, valueX, textY);

        const start = labelX + drawCtx.measureText(safeLabel).width + 16;
        const end = valueX - drawCtx.measureText(safeValue).width - 16;

        if (end > start + 8) {
          drawCtx.beginPath();
          drawCtx.setLineDash([5, 7]);
          drawCtx.strokeStyle = "rgba(148, 120, 62, 0.55)";
          drawCtx.lineWidth = 1.5;
          drawCtx.moveTo(start, textY);
          drawCtx.lineTo(end, textY);
          drawCtx.stroke();
          drawCtx.setLineDash([]);
        }
      } else {
        roundedRectPath(drawCtx, rowX, rowY + 5, rowWidth, rowHeight - 10, rowRadius);
        drawCtx.fillStyle = "rgba(245, 218, 152, 0.24)";
        drawCtx.fill();

        drawCtx.textAlign = "center";
        drawCtx.textBaseline = "middle";
        const noteSize = fitFontSize(
          drawCtx,
          row.note,
          rowWidth - 32,
          Math.min(30, Math.floor(rowHeight * 0.5)),
          18,
          "700",
          '"Plus Jakarta Sans", sans-serif'
        );
        drawCtx.font = `700 ${noteSize}px "Plus Jakarta Sans", sans-serif`;
        drawCtx.fillStyle = "#7f5f27";
        const safeNote = trimToWidth(drawCtx, row.note, rowWidth - 32);
        drawCtx.fillText(safeNote, rowX + rowWidth / 2, rowY + rowHeight / 2);
      }
    });
  }

  function drawPriceBoard(drawCtx, state) {
    const box = { x: 92, y: 500, width: 896, height: 1140 };

    roundedRectPath(drawCtx, box.x, box.y, box.width, box.height, 30);
    drawCtx.fillStyle = "#fff8e5";
    drawCtx.fill();

    roundedRectPath(drawCtx, box.x, box.y, box.width, box.height, 30);
    drawCtx.strokeStyle = "#cb9f4a";
    drawCtx.lineWidth = 4;
    drawCtx.stroke();

    const ribbon = {
      x: box.x + 22,
      y: box.y + 20,
      width: box.width - 44,
      height: 90
    };

    const ribbonFill = drawCtx.createLinearGradient(0, ribbon.y, 0, ribbon.y + ribbon.height);
    ribbonFill.addColorStop(0, "#204c3d");
    ribbonFill.addColorStop(1, "#163a30");

    roundedRectPath(drawCtx, ribbon.x, ribbon.y, ribbon.width, ribbon.height, 22);
    drawCtx.fillStyle = ribbonFill;
    drawCtx.fill();

    roundedRectPath(drawCtx, ribbon.x, ribbon.y, ribbon.width, ribbon.height, 22);
    drawCtx.strokeStyle = "rgba(243, 218, 156, 0.95)";
    drawCtx.lineWidth = 2;
    drawCtx.stroke();

    drawCtx.fillStyle = "#f4deb0";
    drawCtx.textAlign = "left";
    drawCtx.textBaseline = "middle";
    drawCtx.font = '800 40px "Fraunces", serif';
    drawCtx.fillText("LIST HARGA", ribbon.x + 30, ribbon.y + ribbon.height / 2);

    drawCtx.fillStyle = "rgba(244, 222, 176, 0.85)";
    drawCtx.textAlign = "right";
    drawCtx.font = '700 26px "Plus Jakarta Sans", sans-serif';
    drawCtx.fillText("Ready to Post", ribbon.x + ribbon.width - 28, ribbon.y + ribbon.height / 2 + 1);

    const rowsY = box.y + 128;
    const rowsHeight = box.height - 174;
    drawRows(drawCtx, state.rows, box.x, rowsY, box.width, rowsHeight);
  }

  function drawFooter(drawCtx, state) {
    const baseline = canvas.height - 195;

    drawCtx.beginPath();
    drawCtx.moveTo(150, baseline);
    drawCtx.lineTo(canvas.width - 150, baseline);
    drawCtx.strokeStyle = "rgba(245, 220, 158, 0.6)";
    drawCtx.lineWidth = 2;
    drawCtx.stroke();

    drawCtx.textAlign = "center";
    drawCtx.textBaseline = "middle";
    drawCtx.font = '700 36px "Plus Jakarta Sans", sans-serif';
    drawCtx.fillStyle = "#f7e8bf";
    const safeFooter = trimToWidth(drawCtx, state.footerLine, canvas.width - 220);
    drawCtx.fillText(safeFooter, canvas.width / 2, baseline + 56);

    drawCtx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    drawCtx.fillStyle = "rgba(247, 232, 191, 0.72)";
    drawCtx.fillText("Gold Flyer Builder", canvas.width / 2, canvas.height - 72);
  }

  function renderFlyer() {
    const state = buildState();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx);
    drawOuterFrame(ctx);
    drawHeader(ctx, state);
    drawPriceBoard(ctx, state);
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
    const fileName = `gold-flyer-${nameDate}.png`;
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
