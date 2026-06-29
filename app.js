const API_KEY = "586a476a4867616d3132324e58585549";
const PROXY   = "https://corsproxy.io/?";

const LINE_COLOR = {
  "1001":"#0052A4","1001k":"#0052A4",
  "1002":"#009D3E","1003":"#EF7C1C","1004":"#00A2D1",
  "1005":"#996CAC","1006":"#CD7C2F","1007":"#747F00","1008":"#E6186C",
  "1009":"#9E8A63","1063":"#77C4A3","1065":"#0090D2","1067":"#D31145",
  "1075":"#F5A200","1077":"#B0CE18","1092":"#6789CA","1093":"#8FC31F"
};

const LINE_LABEL = {
  "1001":"1호선","1001k":"1호선",
  "1002":"2호선","1003":"3호선","1004":"4호선",
  "1005":"5호선","1006":"6호선","1007":"7호선","1008":"8호선",
  "1009":"9호선","1063":"경의중앙선","1065":"공항철도","1067":"신분당선",
  "1075":"수인분당선","1077":"우이신설선","1092":"신림선","1093":"서해선"
};

// 탭·노선도에는 표시하지 않지만 경로 탐색에 사용하는 숨김 노선
const LINE_HIDDEN = new Set(["1001k"]);

// 환승역 (여러 노선이 지나는 주요역)
const TRANSFER = new Set([
  "시청","종로3가","동대문","동대문역사문화공원","충무로","을지로3가","을지로4가",
  "서울역","용산","왕십리","청량리","홍대입구","공덕","합정","당산","신도림",
  "구로","영등포","사당","교대","고속터미널","강남","선릉","잠실","건대입구",
  "군자","삼성","노원","창동","도봉산","수유","불광","연신내","석계","태릉입구",
  "이수","대림","가산디지털단지","복정","가락시장","오금","천호","강동","성수",
  "뚝섬","압구정","신사","노량진","이촌","동작","금정","한대앞","정자","미금",
  "수원","기흥","판교","모란","수진","도곡","논현","부평구청","김포공항",
  "마곡나루","디지털미디어시티","여의도","마포","삼각지","녹사평","약수",
  "신당","동묘앞","보문","안암","고려대","성신여대입구","효창공원앞"
]);

// 노선별 역 목록
const LINE_STATIONS = {
  // 1호선 경부선·경원선 (구로↔가산디지털단지 직결 — 경인선은 1001k로 분리)
  "1001": ["소요산","동두천","보산","동두천중앙","지행","덕정","덕계","양주","녹양","가능","의정부","회룡","망월사","도봉산","도봉","방학","창동","녹천","월계","광운대","석계","신이문","외대앞","회기","청량리","제기동","신설동","동묘앞","동대문","종로5가","종로3가","종각","시청","서울역","남영","용산","노량진","대방","신길","영등포","신도림","구로","가산디지털단지","독산","금천구청","석수","관악","안양","명학","금정","군포","당정","의왕","성균관대","화서","수원","세류","병점","세마","오산대","오산","진위","송탄","서정리","지제","평택","성환","직산","두정","천안","봉명","쌍용","아산","탕정","배방","온양온천","신창"],
  // 1호선 경인선 (구로~인천) — 탭 비표시, 경로 탐색 전용
  "1001k": ["구로","구일","개봉","오류동","온수","역곡","소사","부천","중동","송내","부개","부평","백운","동암","간석","주안","도화","제물포","도원","동인천","인천"],
  "1002": ["시청","을지로입구","을지로3가","을지로4가","동대문역사문화공원","신당","상왕십리","왕십리","한양대","뚝섬","성수","건대입구","구의","강변","잠실나루","잠실","잠실새내","종합운동장","삼성","선릉","역삼","강남","교대","서초","방배","사당","낙성대","서울대입구","봉천","신림","신대방","구로디지털단지","대림","신도림","문래","영등포구청","당산","합정","홍대입구","신촌","이대","아현","충정로","시청"],
  "1003": ["대화","주엽","정발산","마두","백석","대곡","화정","원당","원흥","삼송","지축","구파발","연신내","불광","녹번","홍제","무악재","독립문","경복궁","안국","종로3가","을지로3가","충무로","동대입구","약수","금호","옥수","압구정","신사","잠원","고속터미널","교대","남부터미널","양재","매봉","도곡","대치","학여울","대청","일원","수서","가락시장","경찰병원","오금"],
  "1004": ["당고개","상계","노원","창동","쌍문","수유","미아","미아사거리","길음","성신여대입구","한성대입구","혜화","동대문","동대문역사문화공원","충무로","명동","회현","서울역","숙대입구","삼각지","신용산","이촌","동작","총신대입구","사당","남태령","선바위","경마공원","대공원","과천","정부과천청사","인덕원","평촌","범계","금정","산본","수리산","대야미","반월","상록수","한대앞","중앙","고잔","초지","안산","신길온천","정왕","오이도"],
  "1005": ["방화","개화산","김포공항","송정","마곡","발산","우장산","화곡","까치산","신정","목동","오목교","양평","영등포구청","영등포시장","신길","여의도","여의나루","마포","공덕","애오개","충정로","서대문","광화문","종로3가","을지로4가","동대문역사문화공원","청구","신금호","행당","왕십리","마장","답십리","장한평","군자","아차산","광나루","천호","강동","길동","굽은다리","명일","고덕","상일동","강일","미사","하남풍산","하남시청","하남검단산"],
  "1006": ["응암","역촌","불광","독바위","연신내","구산","새절","증산","디지털미디어시티","월드컵경기장","마포구청","망원","합정","상수","광흥창","대흥","공덕","효창공원앞","삼각지","녹사평","이태원","한강진","버티고개","약수","청구","신당","동묘앞","창신","보문","안암","고려대","월곡","상월곡","돌곶이","석계","태릉입구","화랑대","봉화산","신내"],
  "1007": ["장암","도봉산","수락산","마들","노원","중계","하계","공릉","태릉입구","먹골","중화","상봉","면목","사가정","용마산","중곡","군자","어린이대공원","건대입구","뚝섬유원지","청담","강남구청","학동","논현","반포","고속터미널","내방","이수","남성","숭실대입구","상도","장승배기","신대방삼거리","보라매","신풍","대림","남구로","가산디지털단지","철산","광명사거리","천왕","온수","까치울","부천종합운동장","춘의","부천시청","상동","삼산체육관","굴포천","부평구청","산곡","석남"],
  "1008": ["별내","다산","동구릉","구리","장자호수공원","암사역사공원","암사","천호","강동구청","몽촌토성","잠실","석촌","송파","가락시장","문정","장지","복정","남위례","산성","남한산성입구","단대오거리","신흥","수진","모란"],
  "1009": ["개화","김포공항","공항시장","신방화","마곡나루","양천향교","가양","증미","등촌","염창","당산","국회의사당","여의도","샛강","노량진","노들","흑석","동작","구반포","신반포","고속터미널","사평","신논현","언주","선정릉","삼성중앙","봉은사","종합운동장","삼전","석촌고분","석촌","송파나루","한성백제","올림픽공원","둔촌오륜","중앙보훈병원"],
  "1075": ["인천","신포","숭의","인하대","원인재","연수","송도","달월","월곶","소래포구","인천논현","오이도","정왕","신길온천","안산","초지","고잔","중앙","한대앞","사리","야목","어천","오목천","고색","수원","매탄권선","수원시청","매교","망포","영통","청명","상갈","기흥","신갈","구성","보정","죽전","오리","미금","정자","수내","서현","이매","야탑","모란","가천대","태평","신흥","수진","복정","가락시장","경찰병원","선릉","한티","도곡","구룡","개포동","대모산입구","수서","왕십리","서울숲","압구정로데오","강남구청","청담","청량리"],
  "1067": ["광교중앙","광교","상현","성복","수지구청","동천","미금","정자","판교","청계산입구","양재시민의숲","양재","강남","신사","논현","신논현","언주","강남구청"],
  "1063": ["문산","파주","월롱","금촌","금릉","운정","야당","탄현","일산","풍산","백마","곡산","대곡","능곡","행신","강매","한국항공대","수색","디지털미디어시티","가좌","홍대입구","서강대","공덕","효창공원앞","서울역","용산","이촌","서빙고","한남","옥수","응봉","왕십리","청량리","회기","중랑","상봉","망우","양원","구리","도농","양정","덕소","도심","팔당","운길산","양수","신원","국수","아신","오빈","양평","원덕","용문","지평"],
  "1065": ["인천공항2터미널","인천공항1터미널","공항화물청사","운서","영종","청라국제도시","검암","계양","김포공항","마곡나루","디지털미디어시티","홍대입구","공덕","서울역"],
  "1077": ["북한산우이","솔밭공원","4.19민주묘지","가오리","화계","삼양","삼양사거리","솔샘","북한산보국문","정릉","성신여대입구","보문","신설동"],
  "1092": ["여의도","샛강","대방","서울지방병무청","보라매","보라매공원","당곡","신림","서원","봉천","관악산"],
  "1093": ["소사","소새울","시흥대야","시흥시청","신천","시흥능곡","신현","능곡","원시"]
};

const ARVL_CD = {
  "0":"곧 도착","1":"도착","2":"출발","3":"전역 출발","4":"전전역 출발","5":"전전전역 출발","99":"운행중"
};

// 자동완성용 역 전체 목록 (중복 제거)
const ALL_STATIONS = [...new Set(Object.values(LINE_STATIONS).flat())].sort();

// 이번역 기준으로 전역·전전역(또는 다음역·다다음역) 계산
// reversed=true → 열차가 이번역 반대편에서 오는 경우 (이번역→다음역→다다음역 표시)
function getDisplayStations(lineId, target, trainCurPos) {
  let list = LINE_STATIONS[lineId] || [];
  let ti   = list.indexOf(target);

  // API가 잘못된 노선 코드를 반환하면 다른 노선에서 역 탐색
  if (ti === -1) {
    for (const [id, sts] of Object.entries(LINE_STATIONS)) {
      const idx = sts.indexOf(target);
      if (idx !== -1) { list = sts; ti = idx; break; }
    }
  }
  if (ti === -1) return { prev1: '', prev2: '', reversed: false };

  const ci = list.indexOf(trainCurPos);
  const reversed = ci !== -1 && ci > ti;
  const step = reversed ? 1 : -1;
  const p1i = ti + step, p2i = p1i + step;
  return {
    prev1: (p1i >= 0 && p1i < list.length) ? list[p1i] : '',
    prev2: (p2i >= 0 && p2i < list.length) ? list[p2i] : '',
    reversed
  };
}

// 정방향: 전전역=8% → 전역=50% → 이번역=92% (열차가 왼쪽→오른쪽으로 이동)
function getTrainPct(arvlCd, secs) {
  if (arvlCd === "5") return 8;
  if (arvlCd === "4") return 29;
  if (arvlCd === "3") return 50;
  if (arvlCd === "0") return 88;
  if (arvlCd === "1") return 93;
  const m = Math.floor(secs / 60);
  return m >= 6 ? 60 : m >= 4 ? 68 : m >= 2 ? 78 : secs > 30 ? 86 : 91;
}

// 반대선: 이번역=8% → 다음역=50% → 다다음역=92% (열차가 오른쪽→왼쪽으로 이동)
function getTrainPctRev(arvlCd, secs) {
  if (arvlCd === "5") return 88;
  if (arvlCd === "4") return 68;
  if (arvlCd === "3") return 50;
  if (arvlCd === "0") return 15;
  if (arvlCd === "1") return 8;
  const m = Math.floor(secs / 60);
  return m >= 6 ? 44 : m >= 4 ? 35 : m >= 2 ? 26 : secs > 30 ? 17 : 10;
}

// trainLineNm에서 급행 여부, 목적지 분리
function parseTrainName(raw) {
  const isExpress = raw.includes("급행");
  const dest = (raw.replace("급행", "").match(/\(([^)]+)\)/) || [])[1] || raw;
  return { isExpress, dest };
}

let currentStation = "";
let countdownTimer = null;
let countdown      = 30;
let activeLineId   = null;
let cachedList     = null;
let cachedStation  = null;

// DOM
const input           = document.getElementById("station-input");
const suggestEl       = document.getElementById("suggest-list");
const searchBtn       = document.getElementById("search-btn");
const statusMsg       = document.getElementById("status-msg");
const refreshBar      = document.getElementById("refresh-bar");
const refreshBtn      = document.getElementById("refresh-btn");
const grid            = document.getElementById("arrival-grid");
const routeMap        = document.getElementById("route-map");
const routeTrack      = document.getElementById("route-track");
const routeTitle      = document.getElementById("route-title");
const lineTabs        = document.getElementById("line-tabs");
const scheduleSection = document.getElementById("schedule-section");
const scheduleBtn     = document.getElementById("schedule-btn");

// ── 노선 탭 초기화 ──
function initLineMenu() {
  lineTabs.innerHTML = Object.entries(LINE_LABEL)
    .filter(([id]) => !LINE_HIDDEN.has(id))
    .map(([id, name]) => {
      const c = LINE_COLOR[id];
      return `<button class="line-tab" data-line="${id}" style="--lc:${c}"><div class="line-tab-bar"></div><span class="line-tab-label">${name}</span></button>`;
    }).join("");

  lineTabs.querySelectorAll(".line-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.line;
      if (activeLineId === id) {
        btn.classList.remove("active");
        routeMap.classList.add("hidden");
        activeLineId = null;
        document.documentElement.style.removeProperty("--theme");
      } else {
        lineTabs.querySelectorAll(".line-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeLineId = id;
        document.documentElement.style.setProperty("--theme", LINE_COLOR[id]);
        renderRouteMap(id);
      }
    });
  });
}

// ── 노선도 렌더링 ──
function renderRouteMap(lineId) {
  const color    = LINE_COLOR[lineId];
  const name     = LINE_LABEL[lineId];
  const stations = LINE_STATIONS[lineId];
  const isCircle = lineId === "1002"; // 2호선만 순환

  routeTitle.textContent = `${name} 노선도${isCircle ? " (순환선)" : ""}`;
  routeTitle.style.color = color;
  routeMap.querySelector(".route-scroll").style.setProperty("--track-color", color);
  routeTrack.style.setProperty("--track-color", color);

  routeTrack.innerHTML = stations.map((s, i) => {
    const isTransfer = TRANSFER.has(s);
    const isEnd      = i === 0 || i === stations.length - 1;
    const dotCls     = isTransfer ? "transfer" : isEnd ? "terminus" : "";
    return `
      <div class="station-stop" onclick="selectStation('${s}')">
        <div class="station-dot${dotCls ? " " + dotCls : ""}"></div>
        <div class="station-name">${s}</div>
      </div>`;
  }).join("");

  routeMap.classList.remove("hidden");
  // 스크롤을 왼쪽 끝으로
  routeMap.querySelector(".route-scroll").scrollLeft = 0;
}

// ── 자동완성 ──
input.addEventListener("input", () => {
  const q = input.value.trim();
  if (!q) { suggestEl.innerHTML = ""; return; }
  const hits = ALL_STATIONS.filter(s => s.includes(q)).slice(0, 8);
  suggestEl.innerHTML = hits.map(s => `<li onclick="selectStation('${s}')">${stationLabel(s)}</li>`).join("");
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
  // 모바일에서 노선도 아래로 부드럽게 스크롤
  setTimeout(() => {
    document.getElementById("status-msg").scrollIntoView({ behavior:"smooth", block:"nearest" });
  }, 100);
}

// 데모 데이터 (API 연결 실패 시 포트폴리오 시연용)
function getDemoData(station) {
  const demos = [
    { subwayId:"1002", trainLineNm:"2호선(시청행)", arvlMsg2:`2분 후 (역삼)`, arvlMsg3:"역삼", arvlCd:"99", barvlDt:"120", lstcarAt:"0" },
    { subwayId:"1002", trainLineNm:"2호선(성수행)", arvlMsg2:`5분 후 (선릉)`, arvlMsg3:"선릉", arvlCd:"99", barvlDt:"300", lstcarAt:"0" },
    { subwayId:"1009", trainLineNm:"9호선(중앙보훈병원행)", arvlMsg2:`1분 후 (신논현)`, arvlMsg3:"신논현", arvlCd:"3",  barvlDt:"60",  lstcarAt:"0" },
    { subwayId:"1009", trainLineNm:"9호선(개화행)",         arvlMsg2:`8분 후 (언주)`,  arvlMsg3:"언주",  arvlCd:"99", barvlDt:"480", lstcarAt:"0" },
    { subwayId:"1003", trainLineNm:"3호선(오금행)",          arvlMsg2:`도착`,           arvlMsg3:station, arvlCd:"1",  barvlDt:"0",   lstcarAt:"0" },
    { subwayId:"1003", trainLineNm:"3호선(대화행)",          arvlMsg2:`11분 후 (교대)`, arvlMsg3:"교대",  arvlCd:"99", barvlDt:"660", lstcarAt:"1" },
  ];
  return demos.map(d => ({ ...d, statnNm: station }));
}

// ── API 호출 ──
async function fetchArrivals(station) {
  if (!station) return;
  currentStation = station;
  suggestEl.innerHTML = "";
  showStatus("⏳ " + stationLabel(station) + " 정보를 불러오는 중...", false);
  clearTimers();

  const base = `/api/subway/${API_KEY}/json/realtimeStationArrival/0/100/${encodeURIComponent(station)}`;
  const httpUrl  = `http://swopenapi.seoul.go.kr${base}`;
  const httpsUrl = `https://swopenapi.seoul.go.kr${base}`;

  const proxies = [
    `https://corsproxy.io/?url=${encodeURIComponent(httpsUrl)}`,
    `https://corsproxy.io/?url=${encodeURIComponent(httpUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(httpUrl)}`,
    `https://thingproxy.freeboard.io/fetch/${httpUrl}`,
  ];

  let data = null;
  for (const url of proxies) {
    try {
      const ctrl = new AbortController();
      const tid  = setTimeout(() => ctrl.abort(), 6000);
      const res  = await fetch(url, { signal: ctrl.signal });
      clearTimeout(tid);
      if (!res.ok) { console.warn("[subway] proxy", res.status, url); continue; }
      const json = await res.json();
      if (json.realtimeArrivalList !== undefined || json.errorMessage) {
        data = json; break;
      }
      console.warn("[subway] unexpected response keys:", Object.keys(json), url);
    } catch (e) { console.warn("[subway] proxy error:", e.message, url); continue; }
  }

  // 모든 프록시 실패 → 데모 모드
  if (!data) {
    const demoList = getDemoData(station);
    renderCards(demoList, station, true);
    startAutoRefresh();
    return;
  }

  if (data.errorMessage) {
    const code = data.errorMessage.code;
    if (code === "INFO-200") { showStatus("❌ 역을 찾을 수 없습니다.", true); return; }
    if (code === "INFO-001") { showStatus("❌ API 키 오류. data.seoul.go.kr에서 키를 확인하세요.", true); return; }
    if (code !== "INFO-000") { showStatus(`❌ API 오류 (${code}): ${data.errorMessage.message}`, true); return; }
  }

  const list = data.realtimeArrivalList || [];
  if (!list.length) { showStatus("🚫 현재 운행 정보가 없습니다. (운행 종료 또는 역명 확인)", false); return; }

  renderCards(list, station, false);
  startAutoRefresh();
}

// ── 카드 렌더링 ──
function renderCards(list, station, isDemo = false) {
  statusMsg.classList.add("hidden");
  refreshBar.classList.remove("hidden");
  const now = new Date();
  document.getElementById("last-updated").textContent =
    `${stationLabel(station)} · 업데이트: ${now.toLocaleTimeString("ko-KR")}${isDemo ? " (데모)" : ""}`;

  const existingBanner = document.getElementById("demo-banner");
  if (existingBanner) existingBanner.remove();
  if (isDemo) {
    const banner = document.createElement("div");
    banner.id = "demo-banner";
    banner.className = "demo-banner";
    banner.textContent = "⚠️ 데모 모드 — API 서버 연결 중 오류가 발생해 샘플 데이터를 표시합니다.";
    grid.before(banner);
  }

  // 시간표 버튼 표시
  cachedList    = list;
  cachedStation = station;
  scheduleSection.classList.add("hidden");
  scheduleBtn.textContent = "🕐 예정 시간표 보기";
  scheduleBtn.classList.remove("hidden");

  grid.innerHTML = list.map(d => {
    const lineId              = d.subwayId || "1001";
    const color               = LINE_COLOR[lineId] || "#999";
    const lineName            = LINE_LABEL[lineId] || d.subwayNm || "";
    const { isExpress, dest } = parseTrainName(d.trainLineNm || "");
    const arvlCd              = d.arvlCd || "99";
    const secs                = parseInt(d.barvlDt) || 0;
    const isLast              = d.lstcarAt === "1";

    // 역 방향 계산 (reversed = 반대선)
    const curPos              = (d.arvlMsg3 || "").replace(/역$/, "").trim();
    const { prev1, prev2, reversed } = getDisplayStations(lineId, station, curPos);

    // 열차 위치 퍼센트 & 색상 선 계산
    const p = reversed ? getTrainPctRev(arvlCd, secs) : getTrainPct(arvlCd, secs);

    // 정방향: 왼→오 이동, fg-line = left:8% ~ p%
    // 반대선: 오→왼 이동, fg-line = p% ~ right:8% (열차가 지나온 오른쪽 구간 색칠)
    const fgStyle = reversed
      ? `left:${p}%;right:8%`
      : `width:calc(${Math.min(p, 92)}% - 8%)`;

    // 도트 통과 여부
    const dot2Passed = reversed ? p < 72 : p > 20;
    const dot1Passed = reversed ? p < 52 : p > 52;
    const midStatus  = reversed
      ? (arvlCd === "3" ? "출발" : dot1Passed ? "통과" : "")
      : (arvlCd === "3" ? "출발" : dot1Passed ? "통과" : "");

    // 도착 시간 텍스트
    let minsText, unitText, minsClass;
    if (arvlCd === "0" || arvlCd === "1") {
      minsText = "도착"; unitText = ""; minsClass = "arr-now";
    } else if (secs <= 0) {
      minsText = ARVL_CD[arvlCd] || "–"; unitText = ""; minsClass = "arr-soon";
    } else {
      const m = Math.floor(secs / 60), s = secs % 60;
      minsText  = m > 0 ? `${m}분` : `${s}초`;
      unitText  = "후 도착";
      minsClass = m === 0 ? "arr-now" : m <= 3 ? "arr-soon" : "arr-far";
    }
    const arrTime = secs > 0
      ? new Date(Date.now() + secs * 1000).toLocaleTimeString("ko-KR", { hour:"2-digit", minute:"2-digit" })
      : "";

    // 트랙 역 배치 (정방향: 전전역·전역·이번역 / 반대선: 이번역·다음역·다다음역)
    const leftStop  = reversed
      ? { name: station, sub: "이번역", cls: "lg", lbl: "this" }
      : { name: prev2 || "─", sub: "전전역", cls: `sm${dot2Passed ? " passed" : ""}`, lbl: "" };
    const midStop   = reversed
      ? { name: prev1 || "─", sub: "다음역", cls: `md${dot1Passed ? " passed" : ""}`, lbl: "", status: midStatus }
      : { name: prev1 || "─", sub: "전역",   cls: `md${dot1Passed ? " passed" : ""}`, lbl: "", status: midStatus };
    const rightStop = reversed
      ? { name: prev2 || "─", sub: "다다음역", cls: `sm${dot2Passed ? " passed" : ""}`, lbl: "" }
      : { name: station, sub: "이번역", cls: "lg", lbl: "this" };

    const stopHtml = (stop, pct) => `
      <div class="tr-stop" style="left:${pct}%">
        <div class="tr-dot ${stop.cls}"></div>
        <div class="tr-label">
          <span class="tr-sname${stop.cls === "lg" ? " bold" : ""}">${stop.name}</span>
          <span class="tr-sub${stop.lbl ? " " + stop.lbl : ""}">${stop.sub}</span>
          ${stop.status ? `<span class="tr-status">${stop.status}</span>` : ""}
        </div>
      </div>`;

    return `
      <div class="arrival-card${reversed ? " reversed" : ""}" style="--lc:${color}">
        <div class="card-top">
          <div class="card-line-info">
            <span class="line-chip">${lineName}</span>
            ${isExpress ? '<span class="express-badge">급행</span>' : ""}
            <span class="card-dest">${dest}</span>
          </div>
          ${isLast ? '<span class="last-badge">막차</span>' : ""}
        </div>

        <div class="tr-wrap">
          <div class="tr-track">
            <div class="tr-bg-line"></div>
            <div class="tr-fg-line" style="${fgStyle}"></div>
            <div class="tr-train${reversed ? " rev" : ""}" style="left:${p}%">🚇</div>
            ${stopHtml(leftStop,  8)}
            ${stopHtml(midStop,  50)}
            ${stopHtml(rightStop, 92)}
          </div>
        </div>

        <div class="card-bottom">
          <div class="arr-row">
            <span class="arr-mins ${minsClass}">${minsText}</span>
            ${unitText ? `<span class="arr-unit">${unitText}</span>` : ""}
          </div>
          ${arrTime ? `<div class="arr-eta">${arrTime} 도착 예정</div>` : ""}
        </div>
      </div>`;
  }).join("");
}

// ── 예정 시간표 토글 ──
scheduleBtn.addEventListener("click", () => {
  const hidden = scheduleSection.classList.toggle("hidden");
  scheduleBtn.textContent = hidden ? "🕐 예정 시간표 보기" : "✕ 시간표 닫기";
  if (!hidden && cachedList) renderSchedule(cachedList, cachedStation);
});

// ── 시간표 렌더링 ──
function renderSchedule(list, station) {
  const groups = {};
  list.forEach(d => {
    const lineId              = d.subwayId || "1001";
    const { isExpress, dest } = parseTrainName(d.trainLineNm || "");
    const key                 = `${lineId}::${dest}`;
    if (!groups[key]) groups[key] = { lineId, dest, isExpress, trains: [] };
    const secs = parseInt(d.barvlDt) || 0;
    const arvlCd = d.arvlCd || "99";
    const arrived = arvlCd === "1" || arvlCd === "0";
    if (secs > 0 || arrived) {
      const at = arrived
        ? new Date()
        : new Date(Date.now() + secs * 1000);
      groups[key].trains.push({
        time:      at.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        secs,
        isLast:    d.lstcarAt === "1",
        isExpress,
        arrived
      });
    }
  });

  Object.values(groups).forEach(g =>
    g.trains.sort((a, b) => a.secs - b.secs)
  );

  scheduleSection.innerHTML = `
    <div class="sched-header-bar">
      <span class="sched-title">🕐 ${stationLabel(station)} 예정 시간표</span>
      <span class="sched-note">현재 기준 다음 도착 열차 (실시간)</span>
    </div>
    ${Object.values(groups).map(g => {
      const color = LINE_COLOR[g.lineId] || "#999";
      const lineName = LINE_LABEL[g.lineId] || "";
      return `
        <div class="sched-group">
          <div class="sched-line-header" style="--lc:${color}">
            <span class="line-chip">${lineName}</span>
            ${g.isExpress ? '<span class="express-badge">급행</span>' : ""}
            <span class="sched-dest">${g.dest}</span>
          </div>
          <div class="sched-times">
            ${g.trains.map(t => `
              <div class="sched-item${t.arrived ? " now" : ""}${t.isLast ? " last" : ""}">
                <span class="sched-time">${t.time}</span>
                ${t.arrived  ? '<span class="sched-tag now-tag">도착중</span>' : ""}
                ${t.isExpress ? '<span class="sched-tag exp-tag">급행</span>'  : ""}
                ${t.isLast   ? '<span class="sched-tag last-tag">막차</span>' : ""}
              </div>`).join("")}
          </div>
        </div>`;
    }).join("")}`;
}

// ── 상태 메시지 ──
function showStatus(msg, isError) {
  grid.innerHTML = "";
  refreshBar.classList.add("hidden");
  statusMsg.textContent = msg;
  statusMsg.className   = "status-msg" + (isError ? " error" : "");
}

// ── 자동 새로고침 ──
function startAutoRefresh() {
  clearTimers();
  countdown = 30;
  updateCountdown();
  countdownTimer = setInterval(() => {
    countdown--;
    updateCountdown();
    if (countdown <= 0) fetchArrivals(currentStation);
  }, 1000);
}
function updateCountdown() {
  document.getElementById("refresh-info").textContent =
    `${stationLabel(currentStation)} · ${countdown}초 후 자동 갱신`;
}
function clearTimers() { clearInterval(countdownTimer); }

// 역 이름에 "역" 붙이기 (이미 붙어있으면 생략)
function stationLabel(name) {
  return name.endsWith("역") ? name : name + "역";
}

// ── 모드 탭 전환 ──
document.getElementById("tab-arrival").addEventListener("click", () => {
  document.getElementById("tab-arrival").classList.add("active");
  document.getElementById("tab-route").classList.remove("active");
  document.getElementById("mode-arrival").classList.remove("hidden");
  document.getElementById("mode-route").classList.add("hidden");
});
document.getElementById("tab-route").addEventListener("click", () => {
  document.getElementById("tab-route").classList.add("active");
  document.getElementById("tab-arrival").classList.remove("active");
  document.getElementById("mode-route").classList.remove("hidden");
  document.getElementById("mode-arrival").classList.add("hidden");
});

// ── 경로 안내 자동완성 ──
function initRouteAutocomplete(inputId, suggestId, otherInputId) {
  const inp = document.getElementById(inputId);
  const sug = document.getElementById(suggestId);
  inp.addEventListener("input", () => {
    const q = inp.value.trim();
    if (!q) { sug.innerHTML = ""; return; }
    const hits = ALL_STATIONS.filter(s => s.includes(q)).slice(0, 6);
    sug.innerHTML = hits.map(s =>
      `<li onclick="document.getElementById('${inputId}').value='${s}';document.getElementById('${suggestId}').innerHTML=''">${stationLabel(s)}</li>`
    ).join("");
  });
  inp.addEventListener("blur", () => setTimeout(() => sug.innerHTML = "", 200));
}
initRouteAutocomplete("route-from", "suggest-from");
initRouteAutocomplete("route-to",   "suggest-to");

// 출발/도착 바꾸기
document.getElementById("swap-btn").addEventListener("click", () => {
  const a = document.getElementById("route-from").value;
  const b = document.getElementById("route-to").value;
  document.getElementById("route-from").value = b;
  document.getElementById("route-to").value   = a;
});

document.getElementById("find-route-btn").addEventListener("click", () => {
  const from = document.getElementById("route-from").value.trim().replace(/역$/, "");
  const to   = document.getElementById("route-to").value.trim().replace(/역$/, "");
  if (!from || !to) { alert("출발역과 도착역을 입력해주세요."); return; }
  if (from === to)  { alert("출발역과 도착역이 같습니다."); return; }

  const rTime = findRoute(from, to, "time");
  const rXfer = findRoute(from, to, "transfer");
  renderRouteResults(rTime, rXfer, from, to);
});

// ── 경로 탐색 (Dijkstra) ──
function findRoute(startStation, endStation, mode = "time") {
  // 같은 노선명(예: 1호선↔1호선) 환승: 2분 (열차 방향만 바꾸는 수준)
  // 다른 노선 환승: 최단시간=4분, 최소환승=999분(사실상 차단)
  const sameLineCost  = 2;
  const xferCost      = mode === "transfer" ? 999 : 4;

  const adj = new Map();

  for (const [lineId, stations] of Object.entries(LINE_STATIONS)) {
    for (let i = 0; i < stations.length; i++) {
      const key = `${stations[i]}::${lineId}`;
      if (!adj.has(key)) adj.set(key, []);
      if (i > 0) {
        const prev = `${stations[i-1]}::${lineId}`;
        if (!adj.has(prev)) adj.set(prev, []);
        adj.get(key).push({ to: prev, cost: 2, type: "ride" });
        adj.get(prev).push({ to: key, cost: 2, type: "ride" });
      }
    }
  }

  // 환승 엣지: 같은 역명, 다른 노선ID
  const stationLines = {};
  for (const [lineId, stations] of Object.entries(LINE_STATIONS)) {
    for (const s of stations) {
      (stationLines[s] = stationLines[s] || new Set()).add(lineId);
    }
  }
  for (const [station, lines] of Object.entries(stationLines)) {
    const arr = [...lines];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const a = `${station}::${arr[i]}`;
        const b = `${station}::${arr[j]}`;
        if (!adj.has(a) || !adj.has(b)) continue;
        // 같은 노선명이면 저비용 (예: 1001 경부선 ↔ 1001k 경인선 @ 구로)
        const sameName = LINE_LABEL[arr[i]] === LINE_LABEL[arr[j]];
        const cost = sameName ? sameLineCost : xferCost;
        const type = sameName ? "same-line" : "transfer";
        adj.get(a).push({ to: b, cost, type });
        adj.get(b).push({ to: a, cost, type });
      }
    }
  }

  const dist = {};
  const prev = {};
  const queue = [];

  for (const key of adj.keys()) {
    if (key.startsWith(startStation + "::")) {
      dist[key] = 0;
      queue.push({ key, cost: 0 });
    }
  }
  if (!queue.length) return null;

  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost);
    const { key, cost } = queue.shift();
    if ((dist[key] ?? Infinity) < cost) continue;

    const [name] = key.split("::");
    if (name === endStation) {
      return buildSegments(prev, key);
    }

    for (const edge of (adj.get(key) || [])) {
      const nc = cost + edge.cost;
      if ((dist[edge.to] ?? Infinity) > nc) {
        dist[edge.to] = nc;
        prev[edge.to] = { from: key, edge };
        queue.push({ key: edge.to, cost: nc });
      }
    }
  }
  return null;
}

function buildSegments(prev, endKey) {
  const steps = [];
  let cur = endKey;
  while (prev[cur]) {
    steps.unshift({ to: cur, from: prev[cur].from, edge: prev[cur].edge });
    cur = prev[cur].from;
  }

  // 노선ID별로 구간 분리
  const raw = [];
  let seg = null;
  for (const { to, from, edge } of steps) {
    const [fromName] = from.split("::");
    const [toName, toLine] = to.split("::");

    if (edge.type === "transfer" || edge.type === "same-line") {
      if (seg) { raw.push(seg); seg = null; }
      continue;
    }
    if (!seg || seg.lineId !== toLine) {
      if (seg) raw.push(seg);
      seg = { lineId: toLine, stations: [fromName] };
    }
    seg.stations.push(toName);
  }
  if (seg) raw.push(seg);

  // 같은 노선명 연속 구간 병합 (예: 1001k 경인선 + 1001 경부선 → "1호선" 하나로)
  const segments = [];
  for (const s of raw) {
    const last = segments[segments.length - 1];
    if (last && LINE_LABEL[last.lineId] === LINE_LABEL[s.lineId]) {
      // 중복 접점역(구로 등) 제거 후 병합
      const extra = s.stations[0] === last.stations[last.stations.length - 1]
        ? s.stations.slice(1) : s.stations;
      last.stations.push(...extra);
    } else {
      segments.push({ ...s, stations: [...s.stations] });
    }
  }

  let totalTime = 0, totalStops = 0;
  const transfers = Math.max(0, segments.length - 1);
  segments.forEach(s => {
    s.stops    = s.stations.length - 1;
    s.from     = s.stations[0];
    s.to       = s.stations[s.stations.length - 1];
    s.lineName = LINE_LABEL[s.lineId] || s.lineId;
    s.color    = LINE_COLOR[s.lineId] || "#888";
    totalStops += s.stops;
    totalTime  += s.stops * 2;
  });
  totalTime += transfers * 4;

  return { segments, totalTime, totalStops, transfers };
}

// ── 경로 바 시각화 ──
function buildJourneyBar(segments) {
  const total = segments.reduce((s, g) => s + g.stops, 0) || 1;
  return segments.map((seg, idx) => {
    const pct = (seg.stops / total * 100).toFixed(1);
    const xfer = idx < segments.length - 1
      ? `<div class="jbar-xfer"></div>` : "";
    return `<div class="jbar-seg" style="flex:${seg.stops};background:${seg.color};" title="${seg.lineName} ${seg.stops}정거장"></div>${xfer}`;
  }).join("");
}

// 세그먼트 라벨 (1호선 → 2호선 형태)
function buildLineLabel(segments) {
  return segments.map((seg, idx) => {
    const chip = `<span class="jlabel-chip" style="background:${seg.color}">${seg.lineName}</span>`;
    const arr  = idx < segments.length - 1 ? `<span class="jlabel-arr">→</span>` : "";
    return chip + arr;
  }).join("");
}

// 접이식 역 상세 목록
function buildStopDetail(segments) {
  return segments.map((seg, idx) => {
    const isLast = idx === segments.length - 1;
    const nextSeg = segments[idx + 1];

    const stops = seg.stations.map((s, i) => {
      const isFirst = i === 0;
      const isEnd   = i === seg.stations.length - 1;
      const cls = isFirst ? "dep" : isEnd ? "arr" : "mid";
      const badge = isFirst ? "출발" : (isEnd && isLast) ? "도착" : isEnd ? "환승" : "";
      return `
        <div class="sd-stop ${cls}" style="--lc:${seg.color}">
          <div class="sd-dot"></div>
          <span class="sd-name">${stationLabel(s)}</span>
          ${badge ? `<span class="sd-badge ${cls}">${badge}</span>` : ""}
        </div>`;
    }).join("");

    const xfer = !isLast ? `
      <div class="sd-xfer">
        <div class="sd-xfer-icon">환승</div>
        <span>${stationLabel(seg.to)}에서 <strong style="color:${nextSeg.color}">${nextSeg.lineName}</strong> 승차 · 약 4분</span>
      </div>` : "";

    return `
      <div class="sd-segment" style="--lc:${seg.color}">
        <div class="sd-seg-title">
          <span class="line-chip" style="background:${seg.color}">${seg.lineName}</span>
          <span class="sd-seg-desc">${stationLabel(seg.from)} → ${stationLabel(seg.to)} · ${seg.stops}개 정거장</span>
        </div>
        <div class="sd-stops">${stops}</div>
      </div>
      ${xfer}`;
  }).join("");
}

// 카드 하나 생성
let cardUid = 0;
function buildRouteCard(result, badgeLabel, badgeClass) {
  if (!result) return "";
  const { segments, totalTime, totalStops, transfers } = result;
  const uid = ++cardUid;

  return `
    <div class="rc-card">
      <div class="rc-header">
        <div class="rc-left">
          <span class="rc-time"><strong>${totalTime}</strong>분</span>
          <span class="rc-meta">${totalStops}개 정거장 · 환승 ${transfers}회</span>
        </div>
        <span class="rc-badge ${badgeClass}">${badgeLabel}</span>
      </div>

      <div class="jbar">${buildJourneyBar(segments)}</div>
      <div class="jlabels">${buildLineLabel(segments)}</div>

      <button class="rc-toggle" onclick="
        const d=document.getElementById('rc-detail-${uid}');
        const b=this;
        if(d.classList.toggle('open')){b.textContent='▲ 경로 접기';}
        else{b.textContent='▼ 상세 경로 보기';}
      ">▼ 상세 경로 보기</button>

      <div class="rc-detail" id="rc-detail-${uid}">
        ${buildStopDetail(segments)}
      </div>
    </div>`;
}

// ── 두 경로 동시 렌더링 ──
function renderRouteResults(rTime, rXfer, from, to) {
  const el = document.getElementById("route-result");

  if (!rTime && !rXfer) {
    el.innerHTML = `
      <div class="route-no-result">
        <div>😥</div>
        <p><strong>${stationLabel(from)}</strong> → <strong>${stationLabel(to)}</strong></p>
        <p>경로를 찾을 수 없어요. 역 이름을 확인해주세요.</p>
      </div>`;
    return;
  }

  // 두 결과가 동일하면 하나만 표시
  const sameRoute = rTime && rXfer && rTime.transfers === rXfer.transfers && rTime.totalTime === rXfer.totalTime;

  cardUid = 0;
  const header = `
    <div class="rc-from-to">
      <span class="rc-station">${stationLabel(from)}</span>
      <span class="rc-arrow">→</span>
      <span class="rc-station">${stationLabel(to)}</span>
    </div>`;

  if (sameRoute) {
    el.innerHTML = header + buildRouteCard(rTime, "최적", "best");
  } else {
    el.innerHTML = header
      + (rTime ? buildRouteCard(rTime, "⏱ 최단시간", "best") : "")
      + (rXfer && !sameRoute ? buildRouteCard(rXfer, "🔁 최소환승", "xfer") : "");
  }
}

// 초기화
initLineMenu();
