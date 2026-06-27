const API_KEY = "YOUR_API_KEY_HERE"; // data.seoul.go.kr 에서 발급
const PROXY   = "https://api.allorigins.win/raw?url=";

// 노선 이름 매핑
const LINE_NAME = {
  "1001": "1호선", "1002": "2호선", "1003": "3호선",
  "1004": "4호선", "1005": "5호선", "1006": "6호선",
  "1007": "7호선", "1008": "8호선", "1009": "9호선",
  "1063": "경의중앙선", "1065": "공항철도", "1067": "신분당선",
  "1075": "수인분당선", "1077": "우이신설선", "1092": "서해선",
  "1093": "신림선"
};

// 도착 상태 코드
const ARVL_CD = {
  "0": "곧 도착", "1": "도착", "2": "출발",
  "3": "전역 출발", "4": "전전역 출발", "5": "전전전역 출발", "99": "운행중"
};

// 주요 역 목록 (자동완성용)
const STATIONS = [
  "강남","강동","강북","강서","개봉","개화","거여","건대입구","경복궁","고속터미널",
  "공덕","관악","광화문","구로","구로디지털단지","군자","귤현","금정","기흥","길동",
  "낙성대","남구로","남태령","노원","녹번","녹사평","논현","당산","대림","대방",
  "대화","도곡","도림천","도봉산","독립문","독바위","동대문","동대문역사문화공원",
  "동묘앞","동수","동작","디지털미디어시티","마곡","마들","마포","망우","망원",
  "면목","명동","명일","모란","목동","무악재","미아","미아사거리","방배","방이",
  "방화","배봉","백석","뱀부","번동","보라매","봉은사","봉천","부천","북한산보국문",
  "불광","사당","삼각지","삼성","삼전","상계","상도","상봉","상왕십리","새절",
  "서울역","서초","석계","석촌","선릉","성수","세곡","수락산","수서","수유",
  "숙대입구","숭실대입구","시청","신길","신내","신당","신대방","신도림","신림",
  "신설동","신수","신정","신촌","쌍문","아현","압구정","애오개","약수","양재",
  "양천구청","어린이대공원","연신내","염창","영등포","영등포구청","영등포시장",
  "오금","오류동","오목교","온수","왕십리","외대앞","용답","용산","우이","월드컵경기장",
  "이수","이태원","인덕원","인천국제공항","잠실","잠실나루","잠실새내","장지","장한평",
  "전농","정왕","제기동","종각","종로3가","종로5가","주안","중계","중랑","창동",
  "천왕","철산","청구","청량리","총신대입구","충정로","태릉입구","통일로","풍납토성",
  "합정","행당","혜화","홍대입구","홍제","화곡","회기","회현"
];

let currentStation = "";
let refreshTimer   = null;
let countdownTimer = null;
let countdown      = 30;

// ── 자동완성 ──
const input      = document.getElementById("station-input");
const suggestEl  = document.getElementById("suggest-list");
const searchBtn  = document.getElementById("search-btn");
const statusMsg  = document.getElementById("status-msg");
const refreshBar = document.getElementById("refresh-bar");
const refreshBtn = document.getElementById("refresh-btn");
const grid       = document.getElementById("arrival-grid");

input.addEventListener("input", () => {
  const q = input.value.trim();
  if (!q) { suggestEl.innerHTML = ""; return; }

  const matches = STATIONS.filter(s => s.includes(q)).slice(0, 8);
  suggestEl.innerHTML = matches
    .map(s => `<li onclick="selectStation('${s}')">${s}역</li>`)
    .join("");
});

input.addEventListener("keydown", e => {
  if (e.key === "Enter") fetchArrivals(input.value.trim());
});

searchBtn.onclick = () => fetchArrivals(input.value.trim());

refreshBtn.onclick = () => fetchArrivals(currentStation);

function selectStation(name) {
  input.value = name;
  suggestEl.innerHTML = "";
  fetchArrivals(name);
}

// ── API 호출 ──
async function fetchArrivals(station) {
  if (!station) return;
  currentStation = station;
  suggestEl.innerHTML = "";

  showStatus("⏳ " + station + "역 정보를 불러오는 중...", false);
  clearTimers();

  try {
    const apiUrl = `https://swopenapi.seoul.go.kr/api/subway/${API_KEY}/json/realtimeStationArrival/0/100/${encodeURIComponent(station)}`;
    const res    = await fetch(PROXY + encodeURIComponent(apiUrl));
    if (!res.ok) throw new Error("네트워크 오류");

    const data = await res.json();

    // 에러 체크
    if (data.errorMessage) {
      const code = data.errorMessage.code;
      if (code === "INFO-200") {
        showStatus("❌ 해당 역을 찾을 수 없습니다. 역 이름을 다시 확인해주세요.", true);
        return;
      }
      if (code !== "INFO-000") {
        showStatus(`❌ API 오류: ${data.errorMessage.message}`, true);
        return;
      }
    }

    const list = data.realtimeArrivalList || [];
    if (!list.length) {
      showStatus("🚫 현재 운행 정보가 없습니다. (운행 종료 또는 역명 확인)", false);
      return;
    }

    renderCards(list, station);
    startAutoRefresh();

  } catch (err) {
    showStatus("❌ 데이터를 불러오지 못했습니다. API 키를 확인하거나 잠시 후 다시 시도해주세요.", true);
    console.error(err);
  }
}

// ── 카드 렌더링 ──
function renderCards(list, station) {
  statusMsg.classList.add("hidden");
  refreshBar.classList.remove("hidden");

  const now = new Date();
  document.getElementById("last-updated").textContent =
    `${station}역 · 업데이트: ${now.toLocaleTimeString("ko-KR")}`;

  grid.innerHTML = list.map(d => {
    const lineId   = d.subwayId || "1001";
    const lineName = LINE_NAME[lineId] || d.subwayNm || "";
    const direction = (d.trainLineNm || "").replace(/\(.*?\)/g, "").trim();
    const arrMsg   = d.arvlMsg2 || "";
    const curLoc   = d.arvlMsg3 || "";
    const arvlCd   = d.arvlCd  || "99";
    const secs     = parseInt(d.barvlDt) || 0;
    const isLast   = d.lstcarAt === "1";

    // 도착 시간 계산
    let minsText, minsClass, unitText;
    if (arvlCd === "0" || arvlCd === "1") {
      minsText  = "도착";
      minsClass = "now";
      unitText  = "";
    } else if (secs <= 0) {
      minsText  = ARVL_CD[arvlCd] || "-";
      minsClass = "soon";
      unitText  = "";
    } else {
      const mins = Math.floor(secs / 60);
      const sec2 = secs % 60;
      minsText  = mins > 0 ? String(mins) : String(sec2);
      unitText  = mins > 0 ? "분 후" : "초 후";
      minsClass = mins === 0 ? "now" : mins <= 3 ? "soon" : "far";
    }

    // 예상 도착 시각
    const arrTime = secs > 0
      ? new Date(Date.now() + secs * 1000).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      : "";

    return `
      <div class="arrival-card">
        <div class="card-line-header line-${lineId}">
          <span class="line-badge">${lineName}</span>
          <span>${direction}</span>
        </div>
        <div class="card-body">
          <div class="arrival-direction">${arrMsg || direction + " 방향"}</div>
          <div class="arrival-time-row">
            <span class="arrival-mins ${minsClass}">${minsText}</span>
            <span class="arrival-unit">${unitText}</span>
          </div>
          ${arrTime ? `<div class="arrival-status">예상 도착 ${arrTime}</div>` : ""}
          ${curLoc ? `<div class="arrival-current">현재 위치: ${curLoc}</div>` : ""}
          ${isLast ? `<div class="last-train-badge">🚨 막차</div>` : ""}
        </div>
      </div>`;
  }).join("");
}

// ── 상태 메시지 ──
function showStatus(msg, isError) {
  grid.innerHTML = "";
  refreshBar.classList.add("hidden");
  statusMsg.textContent = msg;
  statusMsg.className   = "status-msg" + (isError ? " error" : "");
}

// ── 자동 새로고침 (30초) ──
function startAutoRefresh() {
  clearTimers();
  countdown = 30;
  updateCountdown();

  countdownTimer = setInterval(() => {
    countdown--;
    updateCountdown();
    if (countdown <= 0) {
      fetchArrivals(currentStation);
    }
  }, 1000);
}

function updateCountdown() {
  document.getElementById("refresh-info").textContent =
    `${currentStation}역 · ${countdown}초 후 자동 갱신`;
}

function clearTimers() {
  clearInterval(refreshTimer);
  clearInterval(countdownTimer);
}
