export default async function handler(req, res) {
  const { station } = req.query;
  if (!station) return res.status(400).json({ error: "station required" });

  const API_KEY = process.env.SEOUL_API_KEY;
  const url = `https://swopenapi.seoul.go.kr/api/subway/${API_KEY}/json/realtimeStationArrival/0/100/${encodeURIComponent(station)}`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
