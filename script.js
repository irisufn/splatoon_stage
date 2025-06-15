const API_URL = "https://spla3.yuu26.com/api/schedule";

async function fetchData() {
  try {
    const res = await fetch(API_URL, {
      headers: {
        "User-Agent": "MySplaApp/1.0 (https://example.com)"
      }
    });
    const data = await res.json();
    displayData(data.result);
  } catch (e) {
    console.error("データの取得に失敗しました:", e);
  }
}

function displayData(result) {
  displayMatch("open", result.bankara_open.slice(0, 6));      // ← 最大6件
  displayMatch("challenge", result.bankara_challenge.slice(0, 6)); // ← 最大6件
}

function formatTime(start, end) {
  const s = new Date(start).toLocaleString("ja-JP");
  const e = new Date(end).toLocaleString("ja-JP");
  return `${s} ～ ${e}`;
}

function displayMatch(containerId, matches) {
  const container = document.querySelector(`#${containerId} .content`);
  const now = new Date();

  let currentIndex = -1;
  matches.forEach((match, i) => {
    const start = new Date(match.start_time);
    const end = new Date(match.end_time);
    if (now >= start && now < end) currentIndex = i;
  });

  matches.forEach((match, i) => {
    let cls = "card";
    if (i === currentIndex) cls += " current";       // 今
    else if (i === currentIndex + 1) cls += " next"; // 次

    const card = document.createElement("div");
    card.className = cls;
    card.innerHTML = `
      <div class="time">${formatTime(match.start_time, match.end_time)}</div>
      <div>ルール: ${match.rule?.name || "不明"}</div>
      <div class="stages">
        ${match.stages.map(st => `
          <div>
            <img src="${st.image}" alt="${st.name}" />
            <div>${st.name}</div>
          </div>
        `).join("")}
      </div>
    `;
    container.appendChild(card);
  });
}

fetchData();
