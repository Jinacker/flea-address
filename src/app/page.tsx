"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import L from "leaflet";

// 센트럴파크 산책정원 중심
const PARK_CENTER = [37.3961, 126.6448];

interface Booth {
  id: number;
  name: string;
  desc: string;
  address: string;
  x: number;
  y: number;
  color: string;
}

// 네온/파스텔 스타일 부스 10개 좌표
const BOOTH_LAYOUT = [
  { x: 30, y: 28 }, { x: 125, y: 28 }, { x: 220, y: 28 }, { x: 315, y: 28 }, { x: 410, y: 28 },
  { x: 30, y: 98 }, { x: 125, y: 98 }, { x: 220, y: 98 }, { x: 315, y: 98 }, { x: 410, y: 98 }
];

// 컬러 팔레트
const BOOTH_COLORS = [
  "bg-gradient-to-br from-[#f9d423] to-[#ff4e50]",
  "bg-gradient-to-br from-[#a1ffce] to-[#faffd1]",
  "bg-gradient-to-br from-[#fdc094] to-[#ffb7de]",
  "bg-gradient-to-br from-[#6dd5ed] to-[#2193b0]",
  "bg-gradient-to-br from-[#fcff9e] to-[#c67700]",
  "bg-gradient-to-br from-[#f953c6] to-[#b91d73]",
  "bg-gradient-to-br from-[#e3ffe9] to-[#a6c1ee]",
  "bg-gradient-to-br from-[#f8ffae] to-[#43cea2]",
  "bg-gradient-to-br from-[#fdbb2d] to-[#22c1c3]",
  "bg-gradient-to-br from-[#e1eec3] to-[#f05053]",
];

const markerIcon = L.icon({
  iconUrl: "https://cdn.jsdelivr.net/gh/jonataswalker/map-utils@master/images/marker-pin.svg",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  className: "drop-shadow-xl",
});

const MARKET_NAME = "연수마켓";
const MARKET_PERIOD = "2027.07.08 ~ 2027.07.09";

export default function FleaMarketShowcase() {
  const [zoomedIn, setZoomedIn] = useState(false);
  const [booths, setBooths] = useState<Booth[]>([
    { id: 0, name: "홍길동상점", desc: "🌿 핸드메이드 소품", address: `@@연수마켓-홍길동상점`, x: 30, y: 28, color: BOOTH_COLORS[0] },
    { id: 2, name: "푸드트럭", desc: "🍩 즉석떡볶이", address: `@@연수마켓-푸드트럭`, x: 220, y: 28, color: BOOTH_COLORS[2] },
    { id: 7, name: "책방부스", desc: "📚 독립출판", address: `@@연수마켓-책방부스`, x: 315, y: 98, color: BOOTH_COLORS[7] },
  ]);
  const [selectedBoothIdx, setSelectedBoothIdx] = useState<number | null>(null);
  const [newBoothName, setNewBoothName] = useState("");
  const [newBoothDesc, setNewBoothDesc] = useState("");
  const [success, setSuccess] = useState(false);

  const handleBoothRegister = () => {
    if (!newBoothName.trim()) return;
    setBooths([
      ...booths,
      {
        id: selectedBoothIdx!,
        name: newBoothName.trim(),
        desc: newBoothDesc,
        address: `@@연수마켓-${newBoothName.trim()}`,
        ...BOOTH_LAYOUT[selectedBoothIdx!],
        color: BOOTH_COLORS[selectedBoothIdx! % BOOTH_COLORS.length]
      }
    ]);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1400);
    setNewBoothName("");
    setNewBoothDesc("");
    setSelectedBoothIdx(null);
  };

  function renderBoothGrid() {
    return (
      <div
        className="relative w-[500px] h-[180px] bg-gradient-to-br from-white to-blue-50 rounded-2xl mx-auto border border-blue-200 shadow-xl overflow-hidden flex flex-col justify-center items-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.98 }}
      >
        <div className="absolute inset-0 bg-white/80 rounded-2xl"></div>
        {/* 부스들 */}
        {BOOTH_LAYOUT.map((pos, idx) => {
          const found = booths.find((b) => b.id === idx);
          const isSelected = selectedBoothIdx === idx;
          return (
            <button
              key={idx}
              className={`
                absolute z-10 transition-all duration-150
                left-[${pos.x}px] top-[${pos.y}px] w-[70px] h-[58px] border-2 text-xs rounded-xl
                font-semibold flex flex-col items-center justify-center
                ${found ? found.color + " text-gray-900 border-white shadow-lg" : "bg-white border-dashed border-blue-400 text-blue-400 opacity-80 hover:scale-105"}
                ${isSelected ? "ring-2 ring-blue-700 scale-105" : ""}
              `}
              style={{ left: pos.x, top: pos.y }}
              onClick={() => setSelectedBoothIdx(idx)}
            >
              {found ? (
                <>
                  <span className="block truncate text-base font-bold">{found.name}</span>
                  <span className="text-[10px] text-blue-800 font-mono">{found.address}</span>
                </>
              ) : (
                <span>+ 부스<br />신청</span>
              )}
            </button>
          );
        })}
        {/* 전체 마켓 타이틀 */}
        <div className="absolute left-2 top-1 text-xl font-black text-blue-900/90 drop-shadow-lg select-none pointer-events-none">🎪 연수마켓</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0eafc] to-[#cfdef3]">
      <div className="w-full max-w-3xl space-y-9">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-900">연수구 산책정원 플리마켓</h1>
          <div className="font-semibold text-blue-700">{MARKET_NAME} <span className="text-sm text-gray-500">({MARKET_PERIOD})</span></div>
        </div>

        {/* 1. 지도 */}
        {!zoomedIn && (
          <Card className="shadow-2xl border-2 border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>연수구 전체 지도</span>
                <span className="ml-2 text-blue-800/80 text-xl animate-bounce">👇</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[330px] rounded-2xl overflow-hidden border-2 border-blue-100">
                <MapContainer
                  center={PARK_CENTER}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  <Marker position={PARK_CENTER} icon={markerIcon}>
                    <Popup>
                      <b>
                        <span className="text-blue-800 text-lg font-bold">🎪 연수마켓</span>
                        <br />
                        <span className="text-xs text-blue-700">산책정원(센트럴파크)</span>
                      </b>
                      <br />
                      <Button size="sm" className="mt-2 font-bold text-blue-800" onClick={() => setZoomedIn(true)}>
                        👉 연수마켓 입장
                      </Button>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div className="text-xs text-muted-foreground mt-2 text-center font-mono">
                마커 클릭 → 연수마켓 산책정원 입장
              </div>
            </CardContent>
          </Card>
        )}

        {/* 2. 산책정원 부스배치 */}
        {zoomedIn && (
          <Card className="shadow-2xl border-blue-200 border-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>산책정원 부스 배치도</span>
                <Button size="sm" variant="ghost" className="ml-2 text-blue-600 border" onClick={() => setZoomedIn(false)}>
                  전체지도
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderBoothGrid()}
              {/* 부스 상세/신청 */}
              {selectedBoothIdx !== null && (
                <div className="mt-7 p-6 rounded-xl bg-white/90 border-2 border-blue-100 shadow-xl max-w-lg mx-auto">
                  {booths.find((b) => b.id === selectedBoothIdx) ? (
                    <>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="font-extrabold text-blue-900 text-lg">{booths.find((b) => b.id === selectedBoothIdx)?.name}</span>
                        <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border">{booths.find((b) => b.id === selectedBoothIdx)?.address}</span>
                      </div>
                      <div className="text-base text-gray-700 flex items-center justify-center">
                        {booths.find((b) => b.id === selectedBoothIdx)?.desc}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold text-blue-900 mb-1">빈 부스 – 바로 신청!</div>
                      <div className="flex flex-col sm:flex-row gap-2 items-center justify-center mb-2">
                        <Input
                          placeholder="부스명"
                          className="max-w-xs"
                          value={newBoothName}
                          onChange={e => setNewBoothName(e.target.value)}
                        />
                        <Input
                          placeholder="간단한 설명"
                          className="max-w-xs"
                          value={newBoothDesc}
                          onChange={e => setNewBoothDesc(e.target.value)}
                        />
                        <Button onClick={handleBoothRegister} className="font-bold">신청</Button>
                      </div>
                      {success && (
                        <div className="mt-2 text-green-700 text-sm font-bold animate-bounce">
                          🎉 부스가 성공적으로 등록되었습니다!
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
