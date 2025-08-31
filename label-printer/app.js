const $ = (id) => document.getElementById(id);

const PRESETS = {
  A4: { widthMm: 210, heightMm: 297 },
  Letter: { widthMm: 216, heightMm: 279 },
  "4x6": { widthMm: 101.6, heightMm: 152.4 },
};

const DEFAULT_STATE = {
  page: { size: "A4", widthMm: 210, heightMm: 297, marginXMm: 10, marginYMm: 10 },
  label: { widthMm: 70, heightMm: 35, gutterXMm: 2, gutterYMm: 2, paddingMm: 2, border: true },
  typography: { fontSizePx: 12, textAlign: "left" },
  codes: { barcodeHeightPx: 40, qrScalePercent: 40 },
  data: { format: "csv", raw: "", rows: [] },
  show: { title: true, subtitle: false, text: true, barcode: false, qrcode: false },
};

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem("labelPrinterState");
    if (!raw) return structuredClone(DEFAULT_STATE);
    const saved = JSON.parse(raw);
    return mergeDeep(structuredClone(DEFAULT_STATE), saved);
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  localStorage.setItem("labelPrinterState", JSON.stringify(state));
}

function mergeDeep(target, source) {
  if (typeof source !== "object" || source === null) return target;
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      target[key] = mergeDeep(target[key] ?? {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function mm(value) {
  return `${value}mm`;
}

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function setupInputs() {
  $("page-size").value = state.page.size;
  $("page-width").value = state.page.widthMm;
  $("page-height").value = state.page.heightMm;
  $("margin-x").value = state.page.marginXMm;
  $("margin-y").value = state.page.marginYMm;

  $("label-width").value = state.label.widthMm;
  $("label-height").value = state.label.heightMm;
  $("gutter-x").value = state.label.gutterXMm;
  $("gutter-y").value = state.label.gutterYMm;
  $("label-padding").value = state.label.paddingMm;
  $("label-border").checked = state.label.border;

  $("font-size").value = state.typography.fontSizePx;
  $("text-align").value = state.typography.textAlign;

  $("barcode-height").value = state.codes.barcodeHeightPx;
  $("qr-scale").value = state.codes.qrScalePercent;

  $("input-format").value = state.data.format;
  $("data-input").value = state.data.raw;

  $("show-title").checked = state.show.title;
  $("show-subtitle").checked = state.show.subtitle;
  $("show-text").checked = state.show.text;
  $("show-barcode").checked = state.show.barcode;
  $("show-qrcode").checked = state.show.qrcode;
}

function bindEvents() {
  $("page-size").addEventListener("change", (e) => {
    state.page.size = e.target.value;
    if (state.page.size !== "Custom") {
      const p = PRESETS[state.page.size];
      state.page.widthMm = p.widthMm;
      state.page.heightMm = p.heightMm;
      $("page-width").value = state.page.widthMm;
      $("page-height").value = state.page.heightMm;
    }
    saveState();
    render();
  });

  ["page-width","page-height","margin-x","margin-y"].forEach((id) => {
    $(id).addEventListener("input", () => {
      state.page.widthMm = Number($("page-width").value) || state.page.widthMm;
      state.page.heightMm = Number($("page-height").value) || state.page.heightMm;
      state.page.marginXMm = clamp(Number($("margin-x").value) || 0, 0, 100);
      state.page.marginYMm = clamp(Number($("margin-y").value) || 0, 0, 100);
      state.page.size = "Custom";
      $("page-size").value = "Custom";
      saveState();
      render();
    });
  });

  ["label-width","label-height","gutter-x","gutter-y","label-padding"].forEach((id) => {
    $(id).addEventListener("input", () => {
      state.label.widthMm = Math.max(1, Number($("label-width").value) || state.label.widthMm);
      state.label.heightMm = Math.max(1, Number($("label-height").value) || state.label.heightMm);
      state.label.gutterXMm = clamp(Number($("gutter-x").value) || 0, 0, 50);
      state.label.gutterYMm = clamp(Number($("gutter-y").value) || 0, 0, 50);
      state.label.paddingMm = clamp(Number($("label-padding").value) || 0, 0, 50);
      saveState();
      render();
    });
  });

  $("label-border").addEventListener("change", (e) => {
    state.label.border = e.target.checked;
    saveState();
    render();
  });

  $("font-size").addEventListener("input", () => {
    state.typography.fontSizePx = clamp(Number($("font-size").value) || state.typography.fontSizePx, 6, 64);
    saveState();
    render();
  });
  $("text-align").addEventListener("change", (e) => {
    state.typography.textAlign = e.target.value;
    saveState();
    render();
  });

  $("barcode-height").addEventListener("input", () => {
    state.codes.barcodeHeightPx = clamp(Number($("barcode-height").value) || state.codes.barcodeHeightPx, 20, 200);
    saveState();
    render();
  });
  $("qr-scale").addEventListener("input", () => {
    state.codes.qrScalePercent = clamp(Number($("qr-scale").value) || state.codes.qrScalePercent, 10, 100);
    saveState();
    render();
  });

  $("input-format").addEventListener("change", (e) => {
    state.data.format = e.target.value;
    saveState();
    parseData();
    render();
  });

  $("data-input").addEventListener("input", (e) => {
    state.data.raw = e.target.value;
    saveState();
    parseData();
    render();
  });

  ["show-title","show-subtitle","show-text","show-barcode","show-qrcode"].forEach((id) => {
    $(id).addEventListener("change", () => {
      state.show.title = $("show-title").checked;
      state.show.subtitle = $("show-subtitle").checked;
      state.show.text = $("show-text").checked;
      state.show.barcode = $("show-barcode").checked;
      state.show.qrcode = $("show-qrcode").checked;
      saveState();
      render();
    });
  });

  $("btn-print").addEventListener("click", () => window.print());
  $("btn-clear").addEventListener("click", () => {
    $("data-input").value = "";
    state.data.raw = "";
    state.data.rows = [];
    saveState();
    render();
  });
  $("btn-load-demo").addEventListener("click", () => loadDemo());
}

function parseData() {
  const raw = state.data.raw || "";
  if (!raw.trim()) {
    state.data.rows = [];
    return;
  }
  if (state.data.format === "csv") {
    try {
      const result = Papa.parse(raw, { header: true, skipEmptyLines: true });
      const records = Array.isArray(result.data) ? result.data : [];
      const rows = [];
      for (const rec of records) {
        const copies = Number(rec.copies || 1) || 1;
        const row = {
          title: rec.title?.toString() || "",
          subtitle: rec.subtitle?.toString() || "",
          text: rec.text?.toString() || "",
          barcode: rec.barcode?.toString() || "",
          qrcode: rec.qrcode?.toString() || "",
        };
        for (let i = 0; i < copies; i++) rows.push(row);
      }
      state.data.rows = rows;
    } catch {
      state.data.rows = [];
    }
  } else {
    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    state.data.rows = lines.map((line) => ({ title: line, subtitle: "", text: "", barcode: "", qrcode: "" }));
  }
}

function computeLayout() {
  const pageInnerWidth = Math.max(0, state.page.widthMm - state.page.marginXMm * 2);
  const pageInnerHeight = Math.max(0, state.page.heightMm - state.page.marginYMm * 2);
  const slotWidth = state.label.widthMm + (state.label.gutterXMm || 0);
  const slotHeight = state.label.heightMm + (state.label.gutterYMm || 0);
  const cols = Math.max(1, Math.floor((pageInnerWidth + state.label.gutterXMm) / slotWidth));
  const rows = Math.max(1, Math.floor((pageInnerHeight + state.label.gutterYMm) / slotHeight));
  const perPage = cols * rows;
  return { cols, rows, perPage, pageInnerWidth, pageInnerHeight };
}

function render() {
  const preview = $("preview");
  preview.innerHTML = "";

  const { cols, rows, perPage } = computeLayout();
  const items = state.data.rows;
  const totalPages = Math.max(1, Math.ceil((items.length || 0) / perPage));

  for (let p = 0; p < totalPages; p++) {
    const page = document.createElement("div");
    page.className = "page";
    page.style.width = mm(state.page.widthMm);
    page.style.height = mm(state.page.heightMm);

    const inner = document.createElement("div");
    inner.className = "page-inner";
    inner.style.padding = `${mm(state.page.marginYMm)} ${mm(state.page.marginXMm)}`;
    inner.style.gridTemplateColumns = `repeat(${cols}, ${mm(state.label.widthMm)})`;
    inner.style.gridAutoRows = mm(state.label.heightMm);
    inner.style.gap = `${mm(state.label.gutterYMm)} ${mm(state.label.gutterXMm)}`;

    const slice = items.slice(p * perPage, p * perPage + perPage);
    for (const data of slice) {
      inner.appendChild(renderLabel(data));
    }
    page.appendChild(inner);
    preview.appendChild(page);
  }
}

function renderLabel(data) {
  const label = document.createElement("div");
  label.className = "label";
  label.style.padding = mm(state.label.paddingMm);
  label.style.border = state.label.border ? "1px dashed #c7ccd1" : "none";
  label.style.fontSize = `${state.typography.fontSizePx}px`;
  label.style.textAlign = state.typography.textAlign;

  const contentStack = document.createElement("div");
  contentStack.className = "stack";

  if (state.show.title && data.title) {
    const el = document.createElement("div");
    el.className = "title";
    el.textContent = data.title;
    contentStack.appendChild(el);
  }
  if (state.show.subtitle && data.subtitle) {
    const el = document.createElement("div");
    el.className = "subtitle";
    el.textContent = data.subtitle;
    contentStack.appendChild(el);
  }
  if (state.show.text && data.text) {
    const el = document.createElement("div");
    el.className = "text";
    el.textContent = data.text;
    contentStack.appendChild(el);
  }

  label.appendChild(contentStack);

  if (state.show.barcode && data.barcode) {
    const holder = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    holder.classList.add("barcode");
    try {
      JsBarcode(holder, data.barcode, {
        format: "CODE128",
        width: 1.6,
        height: state.codes.barcodeHeightPx,
        displayValue: false,
        margin: 0,
      });
      label.appendChild(holder);
    } catch {}
  }

  if (state.show.qrcode && data.qrcode) {
    const holder = document.createElement("div");
    holder.className = "qrcode";
    holder.style.width = `${state.codes.qrScalePercent}%`;
    holder.style.aspectRatio = "1/1";
    const qrContainer = document.createElement("div");
    qrContainer.style.width = "100%";
    qrContainer.style.height = "100%";
    holder.appendChild(qrContainer);
    try {
      new QRCode(qrContainer, { text: data.qrcode, width: 256, height: 256, correctLevel: QRCode.CorrectLevel.M });
      label.appendChild(holder);
    } catch {}
  }

  return label;
}

function loadDemo() {
  state = structuredClone(DEFAULT_STATE);
  state.page.size = "Letter";
  state.page.widthMm = PRESETS.Letter.widthMm;
  state.page.heightMm = PRESETS.Letter.heightMm;
  state.page.marginXMm = 8;
  state.page.marginYMm = 10;
  state.label.widthMm = 66;
  state.label.heightMm = 33.9;
  state.label.gutterXMm = 3;
  state.label.gutterYMm = 3;
  state.label.paddingMm = 2;
  state.label.border = true;
  state.typography.fontSizePx = 12;
  state.typography.textAlign = "left";
  state.codes.barcodeHeightPx = 38;
  state.codes.qrScalePercent = 40;
  state.show = { title: true, subtitle: true, text: true, barcode: true, qrcode: true };
  state.data.format = "csv";
  state.data.raw = `title,subtitle,text,barcode,qrcode,copies\nWidget A,Blue,SKU 1001,1001,https://example.com/a,2\nWidget B,Green,SKU 1002,1002,https://example.com/b,1\nWidget C,Red,SKU 1003,1003,https://example.com/c,3`;
  saveState();
  setupInputs();
  parseData();
  render();
}

function init() {
  setupInputs();
  bindEvents();
  parseData();
  render();
}

document.addEventListener("DOMContentLoaded", init);

