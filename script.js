"use strict";

// ======================================
// 要素取得用のショートカット関数
// ======================================
const $ = (id) => document.getElementById(id);

// ======================================
// DOM要素の取得
// ======================================
const typeSelect = $("typeSelect");             // パック種類選択
const versionSelect = $("versionSelect");       // バージョン選択
const descriptionInput = $("descriptionInput"); // 説明入力欄
const authorInput = $("authorInput");           // 作者入力欄
const generateBtn = $("generateBtn");           // 生成ボタン
const downloadBtn = $("downloadBtn");           // ダウンロードボタン
const outputCode = $("outputCode");             // 出力表示欄
const copyBtn = $("copyBtn");                   // コピーボタン
const modeToggle = $("modeToggle");             // テーマ切替ボタン
const body = document.body;

// ======================================
// pack_format 対応表
// Minecraftのバージョンごとの pack_format を管理
// ======================================
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
    { version: "1.21.11", pack_format: 75.0 },
    { version: "26.1", pack_format: 84.0 },
    { version: "26.2", pack_format: 88.0 },
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
    { version: "1.21.11", pack_format: 94.1 },
    { version: "26.1", pack_format: 101.1 },
    { version: "26.2", pack_format: 107.1 },
  ],
};

// ======================================
// バージョン一覧をプルダウンへ追加
// ======================================
function populateVersionSelect(type) {
  versionSelect.innerHTML = "";

  packFormatMap[type].forEach(({ version }) => {
    const option = document.createElement("option");
    option.value = version;
    option.textContent = version;
    versionSelect.appendChild(option);
  });
}

// ======================================
// description を組み立てる
// 作者が入力されていれば Author: を追加
// ======================================
function composeDescription(description, author) {
  let desc = description.trim() || "No description.";

  const authorStr = `Author: ${author.trim()}`;

  // 既に作者情報が含まれていなければ追加
  if (author && !desc.includes(authorStr)) {
    desc += `\n${authorStr}`;
  }

  return desc;
}

// ======================================
// 選択されたバージョンから pack_format を取得
// ======================================
function getPackFormat(type, version) {
  const entry = packFormatMap[type].find((v) => v.version === version);

  if (!entry) {
    throw new Error("未対応のバージョンです");
  }

  return entry.pack_format;
}

// ======================================
// pack.mcmeta を生成
// ======================================
function generatePackMcmeta() {
  const type = typeSelect.value;
  const version = versionSelect.value;

  // バージョン未選択
  if (!version) {
    return alert("バージョンを選択してください。");
  }

  try {
    const pack_format = getPackFormat(type, version);
    const description = composeDescription(
      descriptionInput.value,
      authorInput.value
    );

    const json = {
      pack: {
        pack_format,
        description,
      },
    };

    // 整形して表示
    outputCode.textContent = JSON.stringify(json, null, 2);

  } catch (e) {
    alert(e.message);
  }
}

// ======================================
// 生成結果をクリップボードへコピー
// ======================================
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(outputCode.textContent);

    copyBtn.textContent = "コピー完了";

    setTimeout(() => {
      copyBtn.textContent = "コピー";
    }, 1500);

  } catch (err) {
    alert("コピーに失敗しました: " + err);
  }
}

// ======================================
// pack.mcmeta をダウンロード
// ======================================
function downloadMcmeta() {
  const content = outputCode.textContent;

  if (!content) {
    return alert("先に生成してください。");
  }

  const blob = new Blob([content], {
    type: "application/json",
  });

  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "pack.mcmeta";
  a.click();
}

// ======================================
// ライト・ダークモード切替
// ======================================
function toggleMode() {
  const isDark = body.classList.contains("dark");

  body.classList.toggle("dark", !isDark);
  body.classList.toggle("light", isDark);

  modeToggle.textContent = isDark ? "☀️" : "🌙";

  // 設定保存
  localStorage.setItem("mode", isDark ? "light" : "dark");
}

// ======================================
// 初期化処理
// ======================================

// 保存されているテーマを読み込む
const savedMode = localStorage.getItem("mode");

if (savedMode === "light") {
  body.classList.remove("dark");
  body.classList.add("light");
  modeToggle.textContent = "☀️";
} else {
  body.classList.add("dark");
  modeToggle.textContent = "🌙";
}

// パック種類を追加
typeSelect.innerHTML = `
<option value="resource">リソースパック</option>
<option value="data">データパック</option>
`;

// 初期バージョン一覧を表示
populateVersionSelect(typeSelect.value);

// ======================================
// イベント登録
// ======================================

// パック種類変更
typeSelect.addEventListener("change", () => {
  populateVersionSelect(typeSelect.value);
  outputCode.textContent = "";
});

// pack.mcmeta生成
generateBtn.addEventListener("click", generatePackMcmeta);

// コピー
copyBtn.addEventListener("click", copyToClipboard);

// ダウンロード
downloadBtn.addEventListener("click", downloadMcmeta);

// テーマ切替
modeToggle.addEventListener("click", toggleMode);