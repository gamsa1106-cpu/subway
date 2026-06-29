const API_KEY = "586a476a4867616d3132324e58585549";
const PROXY   = "https://corsproxy.io/?";

const LINE_COLOR = {
  "1001":"#0052A4","1002":"#009D3E","1003":"#EF7C1C","1004":"#00A2D1",
  "1005":"#996CAC","1006":"#CD7C2F","1007":"#747F00","1008":"#E6186C",
  "1009":"#9E8A63","1063":"#77C4A3","1065":"#0090D2","1067":"#D31145",
  "1075":"#F5A200","1077":"#B0CE18","1092":"#6789CA","1093":"#8FC31F"
};

const LINE_LABEL = {
  "1001":"1호선","1002":"2호선","1003":"3호선","1004":"4호선",
  "1005":"5호선","1006":"6호선","1007":"7호선","1008":"8호선",
  "1009":"9호선","1063":"경의중앙선","1065":"공항철도","1067":"신분당선",
  "1075":"수인분당선","1077":"우이신설선","1092":"신림선","1093":"서해선"
};

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
  "1001": ["소요산","동두천중앙","동두천","지행","덕정","덕계","양주","녹양","가능","의정부","회룡","망월사","도봉산","도봉","방학","창동","녹천","월계","광운대","석계","신이문","외대앞","회기","청량리","제기동","신설동","동묘앞","동대문","종로5가","종로3가","종각","시청","서울역","남영","용산","노량진","대방","신길","영등포","신도림","구로","가산디지털단지","독산","금천구청","석수","관악","안양","명학","금정","군포","당정","의왕","성균관대","화서","수원","세류","병점","세마","오산대","오산","진위","송탄","서정리","지제","평택","성환","직산","두정","천안","봉명","쌍용","아산","탕정","배방","온양온천","신창"],
  "1002": ["시청","을지로입구","을지로3가","을지로4가","동대문역사문화공원","신당","상왕십리","왕십리","한양대","뚝섬","성수","건대입구","구의","강변","잠실나루","잠실","잠실새내","종합운동장","삼성","선릉","역삼","강남","교대","서초","방배","사당","낙성대","서울대입구","봉천","신림","신대방","구로디지털단지","대림","신도림","문래","영등포구청","당산","합정","홍대입구","신촌","이대","아현","충정로","시청"],
  "1003": ["대화","주엽","정발산","마두","백석","대곡","화정","원당","원흥","삼송","지축","구파발","연신내","불광","녹번","홍제","무악재","독립문","경복궁","안국","종로3가","을지로3가","충무로","동대입구","약수","금호","옥수","압구정","신사","잠원","고속터미널","교대","남부터미널","양재","매봉","도곡","대치","학여울","대청","일원","수서","가락시장","경찰병원","오금"],
  "1004": ["당고개","상계","노원","창동","쌍문","수유","미아","미아사거리","길음","성신여대입구","한성대입구","혜화","동대문","동대문역사문화공원","충무로","명동","회현","서울역","숙대입구","삼각지","신용산","이촌","동작","총신대입구","사당","남태령","선바위","경마공원","대공원","과천","정부과천청사","인덕원","평촌","범계","금정","산본","수리산","대야미","반월","상록수","한대앞","중앙","고잔","초지","안산","신길온천","정왕","오이도"],
  "1005": ["방화","개화산","김포공항","송정","마곡","발산","우장산","화곡","까치산","신정","목동","오목교","양평","영등포구청","영등포시장","신길","여의도","여의나루","마포","공덕","애오개","충정로","서대문","광화문","종로3가","을지로4가","동대문역사문화공원","청구","신금호","행당","왕십리","마장","답십리","장한평","군자","아차산","광나루","천호","강동","길동","굽은다리","명일","고덕","상일동"],
  "1006": ["응암","역촌","불광","독바위","연신내","구산","새절","증산","디지털미디어시티","월드컵경기장","마포구청","망원","합정","상수","광흥창","대흥","공덕","효창공원앞","삼각지","녹사평","이태원","한강진","버티고개","약수","청구","신당","동묘앞","창신","보문","안암","고려대","월곡","상월곡","돌곶이","석계","태릉입구","화랑대","봉화산"],
  "1007": ["장암","도봉산","수락산","마들","노원","중계","하계","공릉","태릉입구","먹골","중화","상봉","면목","사가정","용마산","중곡","군자","어린이대공원","건대입구","뚝섬유원지","청담","강남구청","학동","논현","반포","고속터미널","내방","이수","남성","숭실대입구","상도","장승배기","신대방삼거리","보라매","신풍","대림","남구로","가산디지털단지","철산","광명사거리","천왕","온수","까치울","부천종합운동장","춘의","부천시청","상동","삼산체육관","굴포천","부평구청","산곡","석남"],
  "1008": ["암사","천호","강동구청","몽촌토성","잠실","석촌","송파","가락시장","문정","장지","복정","산성","남한산성입구","단대오거리","신흥","수진","모란"],
  "1009": ["개화","김포공항","공항시장","신방화","마곡나루","양천향교","가양","증미","등촌","염창","당산","국회의사당","여의도","샛강","노량진","노들","흑석","동작","구반포","신반포","고속터미널","사평","신논현","언주","선정릉","삼성중앙","봉은사","종합운동장","삼전","석촌고분","석촌","송파나루","한성백제","올림픽공원","둔촌오륜","중앙보훈병원"],
  "1075": ["인천","신포","숭의","인하대","원인재","연수","송도","달월","월곶","소래포구","인천논현","오이도","정왕","신길온천","안산","초지","고잔","중앙","한대앞","사리","야목","어천","오목천","고색","수원","매탄권선","수원시청","매교","망포","영통","청명","상갈","기흥","신갈","구성","보정","죽전","오리","미금","정자","수내","서현","이매","야탑","모란","가천대","태평","신흥","수진","복정","가락시장","경찰병원","선릉","한티","도곡","구룡","개포동","대모산입구","수서","왕십리","서울숲","압구정로데오","강남구청","청담","청량리"],
  "1067": ["광교중앙","광교","상현","성복","수지구청","동천","미금","정자","판교","청계산입구","양재시민의숲","양재","강남","신사","논현","신논현","언주","강남구청"],
  "1063": ["문산","파주","운정","야당","탄현","일산","풍산","백마","곡산","능곡","행신","강매","화전","수색","디지털미디어시티","가좌","홍대입구","서강대","공덕","효창공원앞","서울역","청파","서빙고","한남","옥수","응봉","왕십리","청량리","회기","중랑","망우","양원","구리","도농","양정","덕소","도심","팔당","운길산","양수","신원","국수","아신","오빈","양평","원덕","용문","지평"],
  "1065": ["인천공항2터미널","인천공항1터미널","공항화물청사","운서","영종","청라국제도시","검암","계양","김포공항","마곡나루","디지털미디어시티","홍대입구","공덕","서울역"],
  "1077": ["북한산우이","솔밭공원","4.19민주묘지","가오리","화계","삼양","삼양사거리","솔샘","북한산보국문","정릉","성신여대입구","보문","신설동"],
  "1092": ["여의도","샛강","대방","서울지방병무청","보라매","보라매공원","당곡","신림","서원","봉천","관악산"],
  "1093": ["소사","소새울","시흥대야","신천","신현","능곡","원시"]
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
  lineTabs.innerHTML = Object.entries(LINE_LABEL).map(([id, name]) => {
    const c = LINE_COLOR[id];
    return `<button class="line-tab" data-line="${id}" style="--lc:${c}">${name}</button>`;
  }).join("");

  lineTabs.querySelectorAll(".line-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.line;
      if (activeLineId === id) {
        // 같은 탭 다시 클릭 → 닫기
        btn.classList.remove("active");
        routeMap.classList.add("hidden");
        activeLineId = null;
      } else {
        lineTabs.querySelectorAll(".line-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeLineId = id;
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

// 초기화
initLineMenu();
