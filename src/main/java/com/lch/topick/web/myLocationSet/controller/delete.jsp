<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Topick · 맛집 지도</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: "Pretendard", "Malgun Gothic", Arial, sans-serif; margin: 0; color: #222; }
    .layout { display: grid; grid-template-columns: 380px 1fr; height: 100vh; }
    .sidebar {
      border-right: 1px solid #eee;
      padding: 18px;
      overflow: auto;
      background: #fff;
    }
    h1 { margin: 0 0 4px; font-size: 22px; color: #FF6B00; }
    .sub { margin: 0 0 16px; font-size: 13px; color: #888; }
    .section { margin-bottom: 20px; }
    .section h3 { margin: 0 0 10px; font-size: 15px; }

    .search-box {
      width: 100%;
      padding: 10px 12px;
      border: 2px solid #FF6B00;
      border-radius: 8px;
      font-size: 15px;
    }
    .btn {
      margin-top: 8px;
      padding: 10px 16px;
      background: #FF6B00;
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
    }
    .btn:hover { background: #e65c00; }
    .btn.secondary { background: #fff; color: #FF6B00; border: 2px solid #FF6B00; }
    .btn.secondary:hover { background: #fff5ee; }

    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip {
      padding: 7px 14px;
      border-radius: 20px;
      border: 2px solid #FF6B00;
      background: #fff;
      color: #FF6B00;
      font-size: 13px;
      cursor: pointer;
      user-select: none;
    }
    .chip.selected { background: #FF6B00; color: #fff; }
    .tag-group { margin-bottom: 12px; }
    .tag-type { margin: 0 0 6px; font-size: 12px; font-weight: 600; color: #999; }
    .selected-tags { font-size: 12px; color: #FF6B00; min-height: 18px; margin: 6px 0 4px; }

    .result-item {
      border: 1px solid #e8e8e8;
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: box-shadow 0.15s;
    }
    .result-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .result-item h4 { margin: 0 0 6px; font-size: 15px; }
    .result-item h4 a { color: #222; text-decoration: none; }
    .result-item h4 a:hover { color: #FF6B00; }
    .result-item p { margin: 2px 0; font-size: 13px; color: #666; }
    .count { font-weight: normal; color: #888; font-size: 14px; }
    #map { width: 100%; height: 100%; min-height: 320px; }
    #status { font-size: 12px; color: #999; margin-top: 8px; }
    .empty { color: #aaa; font-size: 14px; padding: 12px 0; }
  </style>
</head>
<body>
<div class="layout">
  <aside class="sidebar">
    <h1>Topick</h1>
    <p class="sub">지도 영역 기준으로 카카오 맛집을 검색합니다</p>

    <section class="section">
      <h3>키워드 검색</h3>
      <input type="text" id="keyword" class="search-box" placeholder="예: 파스타, 치킨..." />
      <button type="button" class="btn" onclick="searchByKeyword()">키워드 검색</button>
    </section>

    <section class="section">
      <h3>태그 필터</h3>
      <p id="selectedTagsText" class="selected-tags"></p>
      <div id="tagContainer">
        <span class="empty">태그 로딩 중...</span>
      </div>
      <button type="button" class="btn secondary" onclick="searchByFilter()">태그로 검색</button>
    </section>

    <section class="section">
      <h3>검색 결과 <span id="totalCount" class="count"></span></h3>
      <div id="resultContainer"></div>
      <p id="status"></p>
    </section>
  </aside>

  <div id="map"></div>
</div>

<script>
  const KAKAO_APP_KEY = "${kakaoJsKey}";
  const selectedTags = new Set();
  let map;
  let markers = [];
  let lastMode = "keyword";
  let idleTimer = null;
  let suppressIdleUntil = 0;
  let lastFetchedBoundsKey = "";
  let searchInFlight = false;

  function setStatus(msg) {
    document.getElementById("status").textContent = msg || "";
  }

  function updateSelectedTagsText() {
    const el = document.getElementById("selectedTagsText");
    if (!el) return;
    if (selectedTags.size === 0) {
      el.textContent = "태그를 선택하면 맛집을 검색합니다";
      return;
    }
    el.textContent = "선택: " + Array.from(selectedTags).join(", ");
  }

  function toggleTag(tagName, chipEl) {
    if (selectedTags.has(tagName)) {
      selectedTags.delete(tagName);
      chipEl.classList.remove("selected");
    } else {
      selectedTags.add(tagName);
      chipEl.classList.add("selected");
    }
    updateSelectedTagsText();

    if (selectedTags.size > 0) {
      searchByFilter();
    } else {
      lastMode = "keyword";
      searchByKeyword();
    }
  }

  function buildBounds() {
    const b = map.getBounds();
    const sw = b.getSouthWest();
    const ne = b.getNorthEast();
    return {
      swX: sw.getLng(),
      swY: sw.getLat(),
      neX: ne.getLng(),
      neY: ne.getLat()
    };
  }

  function currentBoundsKey() {
    const b = buildBounds();
    return [b.swX, b.swY, b.neX, b.neY].map((v) => v.toFixed(5)).join("|");
  }

  function suppressIdle(ms) {
    suppressIdleUntil = Date.now() + ms;
  }

  function isIdleSuppressed() {
    return Date.now() < suppressIdleUntil;
  }

  function clearMarkers() {
    markers.forEach((m) => m.setMap(null));
    markers = [];
  }

  function drawMarkers(items) {
    clearMarkers();
    if (!items || !items.length) return;

    items.forEach((it) => {
      if (it.y == null || it.x == null) return;
      const pos = new kakao.maps.LatLng(it.y, it.x);
      const marker = new kakao.maps.Marker({ map, position: pos });
      
   	  // 마커 클릭 시 메뉴 요청
      kakao.maps.event.addListener(marker, 'click', function() {
          loadMenu(it.id); // kakao_id 로 메뉴 요청
      });
      
      markers.push(marker);
    });
  }

  function renderResult(data) {
	  console.log(data);
    const total = data.total != null ? data.total : 0;
    document.getElementById("totalCount").textContent = "(" + total + "개)";

    const container = document.getElementById("resultContainer");
    container.innerHTML = "";
    const items = data.item || [];

    if (!items.length) {
      container.innerHTML = '<p class="empty">검색 결과가 없습니다.</p>';
      clearMarkers();
      return;
    }

    items.forEach((store) => {
      const div = document.createElement("div");
      div.className = "result-item";
      div.innerHTML =
        "<h4><a href=\"" + (store.placeUrl || "#") + "\" target=\"_blank\" rel=\"noopener\">" +
        escapeHtml(store.place_name || "") + "</a></h4>" +
        "<p>📍 " + escapeHtml(store.addressName || "") + "</p>" +
        "<p>🍽️ " + escapeHtml(store.categoryName || "") + "</p>";

      div.onclick = () => {
        if (store.y != null && store.x != null) {
          suppressIdle(900);
          map.panTo(new kakao.maps.LatLng(store.y, store.x));
        }
      };
      container.appendChild(div);
    });

    drawMarkers(items);
    setStatus("지도에 " + items.length + "개 마커를 표시했습니다.");
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function postJson(url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error("HTTP " + res.status + (text ? ": " + text : ""));
    }
    return res.json();
  }

  async function searchByKeyword(fromMapMove) {
    if (!map || searchInFlight) return;
    lastMode = "keyword";
    const boundsKey = currentBoundsKey();
    const keyword = document.getElementById("keyword").value.trim();
    setStatus(fromMapMove ? "이 지역 검색 중..." : "키워드 검색 중...");
    searchInFlight = true;
    try {
      const data = await postJson("/api/keyword", {
        ...buildBounds(),
        keyword
      });
      lastFetchedBoundsKey = boundsKey;
      renderResult(data);
    } catch (e) {
      setStatus("키워드 검색 실패: " + e.message);
    } finally {
      searchInFlight = false;
    }
  }

  async function searchByFilter(fromMapMove) {
    if (!map || searchInFlight) return;
    if (selectedTags.size === 0) {
      alert("태그를 하나 이상 선택해주세요.");
      return;
    }
    lastMode = "filter";
    const boundsKey = currentBoundsKey();
    setStatus(fromMapMove ? "이 지역 태그 검색 중..." : "태그 필터 검색 중...");
    searchInFlight = true;
    try {
      const data = await postJson("/api/filter", {
        ...buildBounds(),
        tagName: Array.from(selectedTags)
      });
      lastFetchedBoundsKey = boundsKey;
      renderResult(data);
    } catch (e) {
      setStatus("필터 검색 실패: " + e.message);
    } finally {
      searchInFlight = false;
    }
  }

  function rerunLastSearch() {
    if (!map || isIdleSuppressed() || searchInFlight) return;

    const boundsKey = currentBoundsKey();
    if (boundsKey === lastFetchedBoundsKey) return;

    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!map || isIdleSuppressed() || searchInFlight) return;
      if (currentBoundsKey() === lastFetchedBoundsKey) return;

      if (lastMode === "filter" && selectedTags.size > 0) {
        searchByFilter(true);
      } else {
        searchByKeyword(true);
      }
    }, 500);
  }

  async function loadTags() {
    const container = document.getElementById("tagContainer");
    try {
      const res = await fetch("/api/tag");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const tags = await res.json();
      container.innerHTML = "";

      if (!tags.length) {
        container.innerHTML = '<span class="empty">활성 태그가 없습니다. (tag_status=active)</span>';
        updateSelectedTagsText();
        return;
      }

      const grouped = {};
      tags.forEach((tag) => {
        const type = (tag.tagType && tag.tagType.trim()) ? tag.tagType.trim() : "기타";
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(tag);
      });

      Object.keys(grouped).sort().forEach((type) => {
        const group = document.createElement("div");
        group.className = "tag-group";

        const label = document.createElement("p");
        label.className = "tag-type";
        label.textContent = type;
        group.appendChild(label);

        const chips = document.createElement("div");
        chips.className = "chips";

        grouped[type].forEach((tag) => {
          const chip = document.createElement("span");
          chip.className = "chip";
          chip.textContent = tag.tagName;
          chip.title = type;
          chip.onclick = () => toggleTag(tag.tagName, chip);
          chips.appendChild(chip);
        });

        group.appendChild(chips);
        container.appendChild(group);
      });

      updateSelectedTagsText();
    } catch (e) {
      container.innerHTML = '<span class="empty">태그 로딩 실패</span>';
      setStatus(e.message);
    }
  }

  function loadScript() {
    return new Promise((resolve, reject) => {
      if (!KAKAO_APP_KEY || !KAKAO_APP_KEY.trim()) {
        reject(new Error("kakao.maps.js-key가 설정되지 않았습니다."));
        return;
      }
      const script = document.createElement("script");
      script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey="
        + encodeURIComponent(KAKAO_APP_KEY) + "&autoload=false";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("카카오 지도 SDK 로드 실패"));
      document.head.appendChild(script);
    });
  }

  async function init() {
    updateSelectedTagsText();
    await loadTags();
    try {
      await loadScript();
      kakao.maps.load(() => {
        map = new kakao.maps.Map(document.getElementById("map"), {
          center: new kakao.maps.LatLng(37.3943, 127.1110),
          level: 5
        });
        kakao.maps.event.addListener(map, "idle", rerunLastSearch);
        suppressIdle(300);
        searchByKeyword(false);
      });
    } catch (e) {
      setStatus("지도 초기화 실패: " + e.message);
      document.getElementById("resultContainer").innerHTML =
        '<p class="empty">' + escapeHtml(e.message) + "</p>";
    }
  }

  document.getElementById("keyword").addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchByKeyword();
  });

  void init();
</script>
</body>
</html>