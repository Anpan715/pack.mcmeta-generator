"use strict";

const $ = (id) => document.getElementById(id);
const typeSelect = $("typeSelect");
const versionSelect = $("versionSelect");
const descriptionInput = $("descriptionInput");
const authorInput = $("authorInput");
const generateBtn = $("generateBtn");
const downloadBtn = $("downloadBtn");
const outputCode = $("outputCode");
const copyBtn = $("copyBtn");
const modeToggle = $("modeToggle");
const body = document.body;

const packFormatMap = {
  resource: [
    { version: "1.6.1~1.8.9", pack_format: 1 },
    { version: "1.9~1.10.2", pack_format: 2 },
    { version: "1.11~1.12.2", pack_format: 3 },
    { version: "1.13~1.14.4", pack_format: 4 },
    { version: "1.15~1.16.1", pack_format: 5 },
    { version: "1.16.2~1.16.5", pack_format: 6 },
    { version: "1.17~1.17.1", pack_format: 7 },
    { version: "1.18~1.18.2", pack_format: 8 },
    { version: "1.19~1.19.2", pack_format: 9 },
    { version: "1.19.3", pack_format: 12 },
    { version: "1.19.4", pack_format: 13 },
    { version: "1.20~1.20.1", pack_format: 15 },
    { version: "1.20.2", pack_format: 18 },
    { version: "1.20.3~1.20.4", pack_format: 22 },
    { version: "1.20.5~1.20.6", pack_format: 32 },
    { version: "1.21~1.21.1", pack_format: 34 },
    { version: "1.21.2~1.21.3", pack_format: 42 },
    { version: "1.21.4", pack_format: 46 },
    { version: "1.21.5", pack_format: 55 },
    { version: "1.21.6", pack_format: 63 },
    { version: "1.21.7~1.21.8", pack_format: 64 },
    { version: "1.21.9~1.21.10", pack_format: 69.0 },
    { version: "1.21.11", pack_format: 75.0 }
  ],
  data: [
    { version: "1.13~1.14.4", pack_format: 4 },
    { version: "1.15~1.16.1", pack_format: 5 },
    { version: "1.16.2~1.16.5", pack_format: 6 },
    { version: "1.17~1.17.1", pack_format: 7 },
    { version: "1.18~1.18.1", pack_format: 8 },
    { version: "1.18.2", pack_format: 9 },
    { version: "1.19~1.19.3", pack_format: 10 },
    { version: "1.19.4", pack_format: 12 },
    { version: "1.20~1.20.1", pack_format: 15 },
    { version: "1.20.2", pack_format: 18 },
    { version: "1.20.3~1.20.4", pack_format: 16 },
    { version: "1.20.5~1.20.6", pack_format: 41 },
    { version: "1.21~1.21.1", pack_format: 48 },
    { version: "1.21.2~1.21.3", pack_format: 57 },
    { version: "1.21.4", pack_format: 61 },
    { version: "1.21.5", pack_format: 71 },
    { version: "1.21.6", pack_format: 80 },
    { version: "1.21.7~1.21.8", pack_format: 81 },
    { version: "1.21.9~1.21.10", pack_format: 88.0 },
    { version: "1.21.11", pack_format: 94.1 }
  ],
};

function populateVersionSelect(type) {
  versionSelect.innerHTML = "";
  packFormatMap[type].forEach(({ version }) => {
    const option = document.createElement("option");
    option.value = version;
    option.textContent = version;
    versionSelect.appendChild(option);
  });
}

function composeDescription(description, author) {
  let desc = description.trim() || "No description.";
  const authorStr = `Author: ${author.trim()}`;
  if (author && !desc.includes(authorStr)) {
    desc += `\n${authorStr}`;
  }
  return desc;
}

function getPackFormat(type, version) {
  const entry = packFormatMap[type].find((v) => v.version === version);
  if (!entry) throw new Error("未対応のバージョンです");
  return entry.pack_format;
}

function generatePackMcmeta() {
  const type = typeSelect.value;
  const version = versionSelect.value;
  if (!version) return alert("バージョンを選択してください。");
  try {
    const pack_format = getPackFormat(type, version);
    const description = composeDescription(descriptionInput.value, authorInput.value);
    const json = {
      pack: { pack_format, description },
    };
    outputCode.textContent = JSON.stringify(json, null, 2);
  } catch (e) {
    alert(e.message);
  }
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(outputCode.textContent);
    copyBtn.textContent = "コピー完了";
    setTimeout(() => (copyBtn.textContent = "コピー"), 1500);
  } catch (err) {
    alert("コピーに失敗しました: " + err);
  }
}

function downloadMcmeta() {
  const content = outputCode.textContent;
  if (!content) return alert("先に生成してください。");
  const blob = new Blob([content], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "pack.mcmeta";
  a.click();
}

function toggleMode() {
  const isDark = body.classList.contains("dark");
  body.classList.toggle("dark", !isDark);
  body.classList.toggle("light", isDark);
  modeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("mode", isDark ? "light" : "dark");
}

// 初期化
const savedMode = localStorage.getItem("mode");
if (savedMode === "light") {
  body.classList.remove("dark");
  body.classList.add("light");
  modeToggle.textContent = "☀️";
} else {
  body.classList.add("dark");
  modeToggle.textContent = "🌙";
}
typeSelect.innerHTML = `<option value="resource">リソースパック</option><option value="data">データパック</option>`;
populateVersionSelect(typeSelect.value);

// イベント登録
typeSelect.addEventListener("change", () => {
  populateVersionSelect(typeSelect.value);
  outputCode.textContent = "";
});
generateBtn.addEventListener("click", generatePackMcmeta);
copyBtn.addEventListener("click", copyToClipboard);
downloadBtn.addEventListener("click", downloadMcmeta);
modeToggle.addEventListener("click", toggleMode);
