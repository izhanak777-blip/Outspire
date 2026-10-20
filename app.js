/**
 * Outspire Platform - Interactive Application Engine
 * Pure Vanilla JavaScript: High performance, zero bloat, accessible, SEO-friendly
 */

(function () {
  "use strict";

  // --------------------------------------------------------------------------
  // Application State
  // --------------------------------------------------------------------------
  const STORAGE_KEY_BOOKINGS = "outspire_bookings";
  const STORAGE_KEY_THEME = "outspire_theme";
  const STORAGE_KEY_QUIZ = "outspire_quiz";
  const STORAGE_KEY_USER = "outspire_user";
  const STORAGE_KEY_QUIZ_COMPLETED = "outspire_quiz_completed";
  const STORAGE_KEY_HOSTED = "outspire_hosted_meetups";
  const STORAGE_KEY_CUSTOM_VENUES = "outspire_custom_venues";
  const STORAGE_KEY_ENDED_MEETUPS = "outspire_ended_meetups";
  const STORAGE_KEY_MY_HOSTED_MEETUPS = "outspire_my_created_meetup_ids";
  const STORAGE_KEY_SAVED_MEETUPS = "outspire_saved_meetups";
  const STORAGE_KEY_CHAT_READ_COUNTS = "outspire_chat_read_counts";
  const STORAGE_KEY_JOINED_HISTORY = "outspire_joined_history";
  const STORAGE_KEY_DELETED_HISTORY = "outspire_deleted_history";
  const STORAGE_KEY_HISTORY_TIMESTAMPS = "outspire_history_timestamps";
  const THREE_HOURS_MS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds (10,800,000 ms)
  try { localStorage.removeItem("outspire_active_host_meetups"); } catch (e) {}

  const MYSTERY_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2326211d' stroke='%23e3d2ba' stroke-width='2'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
  const OUTSPIRE_CONCIERGE_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='20' fill='%23171411'/%3E%3Ccircle cx='20' cy='20' r='18' stroke='%23e3d2ba' stroke-width='2' fill='none'/%3E%3Ctext x='20' y='26' font-family='sans-serif' font-size='18' font-weight='bold' fill='%23e3d2ba' text-anchor='middle'%3EO%3C/text%3E%3C/svg%3E";

  function getStoredCustomVenues() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_VENUES) || "{}");
    } catch (e) {
      return {};
    }
  }

  function saveCustomVenue(meetupId, venueName, venueAddress) {
    try {
      const venues = getStoredCustomVenues();
      venues[meetupId] = {
        venueName: venueName,
        venueAddress: venueAddress,
        isVenueChanged: true,
        mapQuery: encodeURIComponent(`${venueName} ${venueAddress}`),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY_CUSTOM_VENUES, JSON.stringify(venues));

      // Also update in hosted meetups if present
      const hostedRaw = localStorage.getItem(STORAGE_KEY_HOSTED);
      if (hostedRaw) {
        const hosted = JSON.parse(hostedRaw);
        const hostedIdx = hosted.findIndex(m => m.id === meetupId);
        if (hostedIdx !== -1) {
          hosted[hostedIdx].venueName = venueName;
          hosted[hostedIdx].venueAddress = venueAddress;
          hosted[hostedIdx].isVenueChanged = true;
          hosted[hostedIdx].mapQuery = encodeURIComponent(`${venueName} ${venueAddress}`);
          localStorage.setItem(STORAGE_KEY_HOSTED, JSON.stringify(hosted));
        }
      }
    } catch (e) {
      console.error("Error saving custom venue:", e);
    }
  }

  function getVenueSuggestionsForMeetup(meetup) {
    const city = ((meetup && meetup.city) || "").toLowerCase();
    const neighborhood = ((meetup && meetup.neighborhood) || "").toLowerCase();
    const isOutdoor = meetup && (meetup.category === "outdoors" || meetup.category === "parks" || meetup.category === "dogwalk");

    if (isOutdoor) {
      return [
        { name: "Washington Square Park Pergola", address: "Washington Square, New York, NY 10012" },
        { name: "Madison Square Park Oval Lawn", address: "11 Madison Ave, New York, NY 10010" },
        { name: "Central Park Sheep Meadow Walk", address: "Central Park West & 66th St, New York, NY 10023" },
        { name: "Domino Park Riverfront Promenade", address: "15 River St, Brooklyn, NY 11249" }
      ];
    }

    if (city.includes("brooklyn") || neighborhood.includes("williamsburg") || neighborhood.includes("dumbo")) {
      return [
        { name: "Devoción Botanical Roastery", address: "69 Grand St, Brooklyn, NY 11249" },
        { name: "Partners Coffee Williamsburg", address: "125 N 6th St, Brooklyn, NY 11249" },
        { name: "Butler Espresso & Bakery", address: "95 S 5th St, Brooklyn, NY 11249" },
        { name: "Milk Bar Brooklyn", address: "382 Metropolitan Ave, Brooklyn, NY 11211" }
      ];
    }

    return [
      { name: "Ludlow Coffee Supply & Lounge", address: "176 Ludlow St, New York, NY 10002" },
      { name: "Devoción Botanical Roastery", address: "69 Grand St, Brooklyn, NY 11249" },
      { name: "Remi Flower & Coffee", address: "906 2nd Ave, New York, NY 10017" },
      { name: "Birch Coffee & Library Lounge", address: "21 E 27th St, New York, NY 10016" },
      { name: "Maman Nomad Café & Bakery", address: "22 W 25th St, New York, NY 10010" }
    ];
  }

  const storedHosted = typeof getStoredHostedMeetups === "function" ? getStoredHostedMeetups() : [];
  storedHosted.forEach(m => {
    if (m.isSurpriseMeetup) {
      m.host = {
        name: "Outspire",
        role: "Official Outspire Team · Curated Surprise Table",
        avatar: OUTSPIRE_CONCIERGE_AVATAR
      };
      m.hostVenueNotes = "Table reserved under Outspire with your Meetup Code. Simply mention your code to the venue staff upon arrival.";
    }
  });

  const storedCustomVenues = getStoredCustomVenues();
  const rawMeetupsList = [...storedHosted, ...MEETUPS_DATA];
  rawMeetupsList.forEach(m => {
    if (storedCustomVenues && storedCustomVenues[m.id]) {
      m.venueName = storedCustomVenues[m.id].venueName || m.venueName;
      m.venueAddress = storedCustomVenues[m.id].venueAddress || m.venueAddress;
      m.isVenueChanged = true;
      if (storedCustomVenues[m.id].mapQuery) {
        m.mapQuery = storedCustomVenues[m.id].mapQuery;
      }
    }
  });

  const storedUser = JSON.parse(localStorage.getItem(STORAGE_KEY_USER) || "null");
  const storedQuiz = JSON.parse(localStorage.getItem(STORAGE_KEY_QUIZ) || "{}");
  const storedQuizCompleted = localStorage.getItem(STORAGE_KEY_QUIZ_COMPLETED) === "true" || !!(storedQuiz && storedQuiz.preferredGroupSize);

  function getCleanCity(city) {
    if (!city) return "";
    return city.split(/[,(]/)[0].trim();
  }

  const initialUserCountry = storedQuiz.country || (storedUser && storedUser.country) || "United States";
  const initialUserState = storedQuiz.state || (storedUser && storedUser.state) || "";
  const initialUserCity = storedQuiz.city || (storedUser && storedUser.city) || "New York";

  // History & Bookings Initial Storage State
  const defaultInitialHistoryIds = rawMeetupsList.slice(0, 7).map(m => m.id);
  const storedBookingsRaw = localStorage.getItem(STORAGE_KEY_BOOKINGS) || localStorage.getItem("strangers_meetup_bookings");
  const storedJoinedHistoryRaw = localStorage.getItem(STORAGE_KEY_JOINED_HISTORY);
  const storedHostedRaw = localStorage.getItem(STORAGE_KEY_MY_HOSTED_MEETUPS);
  const storedDeletedHistoryRaw = localStorage.getItem(STORAGE_KEY_DELETED_HISTORY);
  const storedHistoryTimestampsRaw = localStorage.getItem(STORAGE_KEY_HISTORY_TIMESTAMPS);

  let initialDeletedIds = storedDeletedHistoryRaw !== null ? JSON.parse(storedDeletedHistoryRaw) : [];
  let initialBookedIds = storedBookingsRaw !== null ? JSON.parse(storedBookingsRaw) : [...defaultInitialHistoryIds];
  let initialJoinedIds = storedJoinedHistoryRaw !== null ? JSON.parse(storedJoinedHistoryRaw) : [...defaultInitialHistoryIds];
  let initialHostedIds = storedHostedRaw !== null ? JSON.parse(storedHostedRaw) : (rawMeetupsList[0] ? [rawMeetupsList[0].id] : []);
  let initialHistoryTimestamps = {};
  try {
    if (storedHistoryTimestampsRaw) initialHistoryTimestamps = JSON.parse(storedHistoryTimestampsRaw);
  } catch (e) {}

  // Filter out any explicitly deleted IDs
  initialBookedIds = initialBookedIds.filter(id => !initialDeletedIds.includes(String(id)));
  initialJoinedIds = initialJoinedIds.filter(id => !initialDeletedIds.includes(String(id)));
  initialHostedIds = initialHostedIds.filter(id => !initialDeletedIds.includes(String(id)));

  if (storedBookingsRaw === null && initialBookedIds.length > 0) {
    try { localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(initialBookedIds)); } catch(e){}
  }
  if (storedJoinedHistoryRaw === null && initialJoinedIds.length > 0) {
    try { localStorage.setItem(STORAGE_KEY_JOINED_HISTORY, JSON.stringify(initialJoinedIds)); } catch(e){}
  }
  if (storedHostedRaw === null && initialHostedIds.length > 0) {
    try { localStorage.setItem(STORAGE_KEY_MY_HOSTED_MEETUPS, JSON.stringify(initialHostedIds)); } catch(e){}
  }

  let state = {
    theme: localStorage.getItem(STORAGE_KEY_THEME) || localStorage.getItem("strangers_meetup_theme") || "dark",
    meetups: rawMeetupsList,
    bookedIds: initialBookedIds,
    joinedHistoryIds: initialJoinedIds,
    myHostedMeetupIds: initialHostedIds,
    deletedHistoryIds: initialDeletedIds,
    historyTimestamps: initialHistoryTimestamps,
    historyFilter: "all",
    profileHistoryFilter: "all",
    savedMeetupIds: JSON.parse(localStorage.getItem(STORAGE_KEY_SAVED_MEETUPS) || "[]"),
    activeCategory: "all",
    searchQuery: "",
    selectedDay: "all",
    userCountry: initialUserCountry,
    userState: initialUserState,
    userCity: initialUserCity,
    selectedCity: getCleanCity(initialUserCity) || "New York",
    selectedArea: "all",
    selectedLocation: "city:" + (getCleanCity(initialUserCity) || "New York"),
    selectedTimeRange: "all",
    customTimeStart: "10:00",
    customTimeEnd: "18:00",
    selectedGroupSize: "all",
    currentModalMeetupId: null,
    activeChatMeetupId: null,
    quizStep: 0,
    quizAnswers: storedQuiz,
    quizCompleted: storedQuizCompleted,
    drawerQuizStep: 0,
    drawerQuizTab: "stepper",
    chatMessages: JSON.parse(JSON.stringify(MOCK_CHAT_MESSAGES)),
    chatReadCounts: JSON.parse(localStorage.getItem(STORAGE_KEY_CHAT_READ_COUNTS) || "{}"),
    currentUser: storedUser,
    isAuthenticated: !!storedUser,
    pendingQuizAdvance: false,
    departedMeetups: JSON.parse(localStorage.getItem("outspire_departed_meetups") || "[]"),
    connectedMemberIds: JSON.parse(localStorage.getItem("outspire_connected_members") || '["william_stone"]'),
    endedMeetups: JSON.parse(localStorage.getItem(STORAGE_KEY_ENDED_MEETUPS) || "{}"),
    customHostPhotoUrl: null,
    quizResultMinimized: false
  };

  window.__outspire = { state };

  function isUserHostOfMeetup(meetup) {
    if (!meetup) return false;
    if (meetup.isCreatedByCurrentUser) return true;
    if (state.myHostedMeetupIds && state.myHostedMeetupIds.includes(meetup.id)) return true;

    const hostedList = (typeof getStoredHostedMeetups === "function" ? getStoredHostedMeetups() : []) || [];
    if (hostedList.some(h => h.id === meetup.id)) return true;

    if (state.currentUser && meetup.host) {
      const currentUserName = (state.currentUser.name || "").trim().toLowerCase();
      const currentUserEmail = (state.currentUser.email || "").trim().toLowerCase();
      const hostName = (meetup.host.name || "").trim().toLowerCase();
      const hostEmail = (meetup.host.email || "").trim().toLowerCase();

      if (currentUserName && hostName && currentUserName === hostName) return true;
      if (currentUserEmail && hostEmail && currentUserEmail === hostEmail) return true;
    }
    return false;
  }

  function recordHistoryTimestamp(meetupId) {
    if (!meetupId) return;
    const sId = String(meetupId);
    if (!state.historyTimestamps) state.historyTimestamps = {};
    state.historyTimestamps[sId] = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY_TIMESTAMPS, JSON.stringify(state.historyTimestamps));
    } catch (e) {}
  }

  function getMeetupRecencyScore(meetup) {
    if (!meetup) return 0;
    const id = String(meetup.id);
    if (state.historyTimestamps && state.historyTimestamps[id]) {
      return state.historyTimestamps[id];
    }
    const match = id.match(/\d{12,}/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (!isNaN(num) && num > 1600000000000) return num;
    }
    if (meetup.createdAt) {
      return typeof meetup.createdAt === "number" ? meetup.createdAt : new Date(meetup.createdAt).getTime();
    }
    return 0;
  }

  function compareMeetupsLatestFirst(a, b) {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;

    const aEnded = isMeetupEndedOrPassed(a);
    const bEnded = isMeetupEndedOrPassed(b);

    // 1. Active / Upcoming gatherings always appear above Concluded / Past gatherings
    if (!aEnded && bEnded) return -1;
    if (aEnded && !bEnded) return 1;

    // 2. Both are Active / Upcoming:
    if (!aEnded && !bEnded) {
      // Prioritize the latest meetup (most recently booked / created first)
      const aRecency = getMeetupRecencyScore(a);
      const bRecency = getMeetupRecencyScore(b);
      if (aRecency !== bRecency) {
        return bRecency - aRecency;
      }
      // If same recency, later scheduled date/time on top
      const aStart = getMeetupStartTimestamp(a) || 0;
      const bStart = getMeetupStartTimestamp(b) || 0;
      if (aStart !== bStart) {
        return bStart - aStart;
      }
      return 0;
    }

    // 3. Both are Concluded / Past:
    // The most recently concluded meetup on top (latest date/time first)
    const aTime = getMeetupStartTimestamp(a) || 0;
    const bTime = getMeetupStartTimestamp(b) || 0;
    if (aTime !== bTime) {
      return bTime - aTime;
    }
    const aEndRecency = getMeetupRecencyScore(a);
    const bEndRecency = getMeetupRecencyScore(b);
    if (aEndRecency !== bEndRecency) {
      return bEndRecency - aEndRecency;
    }

    return 0;
  }

  function getHistoryMeetups(filterType = "all") {
    const orderedIds = [];
    const seen = new Set();
    const addId = (id) => {
      if (!id) return;
      const s = String(id);
      if (!seen.has(s)) {
        seen.add(s);
        orderedIds.push(s);
      }
    };

    (state.myHostedMeetupIds || []).forEach(addId);
    (state.joinedHistoryIds || []).forEach(addId);
    (state.bookedIds || []).forEach(addId);

    const deletedSet = new Set((state.deletedHistoryIds || []).map(id => String(id)));

    let list = [];
    for (const id of orderedIds) {
      if (deletedSet.has(id)) continue;
      const m = state.meetups.find(item => String(item.id) === id);
      if (m && !list.some(existing => String(existing.id) === String(m.id))) {
        list.push(m);
      }
    }

    if (filterType === "hosted") {
      list = list.filter(m => isUserHostOfMeetup(m));
    } else if (filterType === "reserved") {
      list = list.filter(m => state.bookedIds && state.bookedIds.includes(m.id) && !isMeetupEndedOrPassed(m));
    }

    // Sort: Latest meetup on the top!
    list.sort(compareMeetupsLatestFirst);

    return list;
  }

  function saveHistoryState() {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(state.bookedIds));
      localStorage.setItem(STORAGE_KEY_JOINED_HISTORY, JSON.stringify(state.joinedHistoryIds));
      localStorage.setItem(STORAGE_KEY_MY_HOSTED_MEETUPS, JSON.stringify(state.myHostedMeetupIds));
      localStorage.setItem(STORAGE_KEY_DELETED_HISTORY, JSON.stringify(state.deletedHistoryIds));
      if (state.historyTimestamps) {
        localStorage.setItem(STORAGE_KEY_HISTORY_TIMESTAMPS, JSON.stringify(state.historyTimestamps));
      }
    } catch (e) {}
    updateCategoryCounts();
    if (typeof updateFloatingChatWidget === "function") {
      updateFloatingChatWidget();
    }
  }

  function deleteHistoryItem(meetupId) {
    const sId = String(meetupId);
    state.bookedIds = (state.bookedIds || []).filter(id => String(id) !== sId);
    state.joinedHistoryIds = (state.joinedHistoryIds || []).filter(id => String(id) !== sId);
    state.myHostedMeetupIds = (state.myHostedMeetupIds || []).filter(id => String(id) !== sId);
    if (!state.deletedHistoryIds) state.deletedHistoryIds = [];
    if (!state.deletedHistoryIds.includes(sId)) {
      state.deletedHistoryIds.push(sId);
    }
    saveHistoryState();
  }

  function clearAllHistory() {
    const allMeetups = getHistoryMeetups("all");
    if (!state.deletedHistoryIds) state.deletedHistoryIds = [];
    allMeetups.forEach(m => {
      const sId = String(m.id);
      if (!state.deletedHistoryIds.includes(sId)) {
        state.deletedHistoryIds.push(sId);
      }
    });
    state.bookedIds = [];
    state.joinedHistoryIds = [];
    state.myHostedMeetupIds = [];
    saveHistoryState();
  }

  function getMeetupEndStatus(meetupId) {
    if (!meetupId) return { isEnded: false, isFullyClosed: false, remainingMs: 0 };
    const entry = state.endedMeetups && state.endedMeetups[meetupId];
    if (!entry || !entry.endedAt) {
      return { isEnded: false, isFullyClosed: false, remainingMs: 0 };
    }
    const elapsed = Date.now() - entry.endedAt;
    const isFullyClosed = !!(entry.fastForwarded || elapsed >= THREE_HOURS_MS);
    const remainingMs = isFullyClosed ? 0 : Math.max(0, THREE_HOURS_MS - elapsed);
    return {
      isEnded: true,
      isFullyClosed,
      endedAt: entry.endedAt,
      remainingMs,
      elapsed,
      endedBy: entry.endedBy || "Host"
    };
  }

  function formatRemainingTime(ms) {
    if (ms <= 0) return "0m 0s";
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  }

  function getMeetupStartTimestamp(meetup) {
    if (!meetup) return null;
    let dateStr = meetup.dateStr;
    if (!dateStr && typeof meetup.dayOffset === "number" && typeof calculate4DayBookingWindow === "function") {
      const win = calculate4DayBookingWindow();
      if (win && win.days && win.days[meetup.dayOffset]) {
        dateStr = win.days[meetup.dayOffset].dateStr;
      }
    }
    if (!dateStr && meetup.dayOffset === 0) {
      const now = new Date();
      const y = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, "0");
      const da = String(now.getDate()).padStart(2, "0");
      dateStr = `${y}-${mo}-${da}`;
    }
    if (dateStr) {
      const parts = dateStr.split("-").map(Number);
      if (parts.length === 3) {
        let hours = 0;
        let mins = 0;
        if (meetup.timeRaw) {
          const timeParts = meetup.timeRaw.split(":").map(Number);
          hours = timeParts[0] || 0;
          mins = timeParts[1] || 0;
        }
        return new Date(parts[0], parts[1] - 1, parts[2], hours, mins, 0, 0).getTime();
      }
    }
    return null;
  }

  function isMeetupEndedOrPassed(meetup) {
    if (!meetup) return false;
    // 1. Host has explicitly ended the meetup
    const endStatus = getMeetupEndStatus(meetup.id);
    if (endStatus && endStatus.isEnded) {
      return true;
    }
    // 2. Meetup scheduled start time has arrived or passed
    const startMs = getMeetupStartTimestamp(meetup);
    if (startMs !== null && Date.now() >= startMs) {
      return true;
    }
    // Fallback for today if startMs was null
    if (meetup.dayOffset === 0 && meetup.timeRaw) {
      const now = new Date();
      const currentMins = now.getHours() * 60 + now.getMinutes();
      const timeParts = meetup.timeRaw.split(":").map(Number);
      const meetupMins = (timeParts[0] || 0) * 60 + (timeParts[1] || 0);
      if (currentMins >= meetupMins) {
        return true;
      }
    }
    return false;
  }

  // --------------------------------------------------------------------------
  // DOM Elements
  // --------------------------------------------------------------------------
  const elements = {
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    mobileMenuBtn: document.getElementById("mobileMenuBtn"),
    mobileNav: document.getElementById("mobileNav"),
    filterTabsContainer: document.getElementById("filterTabsContainer"),
    meetupSearchInput: document.getElementById("meetupSearchInput"),
    dayFilterSelect: document.getElementById("dayFilterSelect"),
    locationFilterSelect: document.getElementById("locationFilterSelect"),
    cityAreaFilterBar: document.getElementById("cityAreaFilterBar"),
    historyControlsBar: document.getElementById("historyControlsBar"),
    timeFilterSelect: document.getElementById("timeFilterSelect"),
    customTimeRangeBar: document.getElementById("customTimeRangeBar"),
    timeRangeStartSelect: document.getElementById("timeRangeStartSelect"),
    timeRangeEndSelect: document.getElementById("timeRangeEndSelect"),
    applyCustomTimeBtn: document.getElementById("applyCustomTimeBtn"),
    clearCustomTimeBtn: document.getElementById("clearCustomTimeBtn"),
    activeTimeWindowNotice: document.getElementById("activeTimeWindowNotice"),
    groupSizeFilterSelect: document.getElementById("groupSizeFilterSelect"),
    randomMeetupBtn: document.getElementById("randomMeetupBtn") || document.getElementById("surpriseMeetupBtn"),
    surpriseMeetupBtn: document.getElementById("surpriseMeetupBtn") || document.getElementById("randomMeetupBtn"),
    surpriseMeetupModal: document.getElementById("surpriseMeetupModal"),
    surpriseModalContent: document.getElementById("surpriseModalContent"),
    surpriseModalFooter: document.getElementById("surpriseModalFooter"),
    closeSurpriseModalBtn: document.getElementById("closeSurpriseModalBtn"),
    clearFiltersBtn: document.getElementById("clearFiltersBtn"),
    meetupsGrid: document.getElementById("meetupsGrid"),
    meetupsCountDisplay: document.getElementById("meetupsCountDisplay"),
    reservationModal: document.getElementById("reservationModal"),
    cancelConfirmModal: document.getElementById("cancelConfirmModal"),
    deleteHistoryItemModal: document.getElementById("deleteHistoryItemModal"),
    clearHistoryConfirmModal: document.getElementById("clearHistoryConfirmModal"),
    profileModal: document.getElementById("profileModal"),
    authModal: document.getElementById("authModal"),
    meetupGamesModal: document.getElementById("meetupGamesModal"),
    gameModalTitle: document.getElementById("gameModalTitle"),
    gameSoundToggleBtn: document.getElementById("gameSoundToggleBtn"),
    soundIcon: document.getElementById("soundIcon"),
    gameRotateBtn: document.getElementById("gameRotateBtn"),
    closeGamesModalBtn: document.getElementById("closeGamesModalBtn"),
    gameModeTabs: document.getElementById("gameModeTabs"),
    tableGameStage: document.getElementById("tableGameStage"),
    tableGameBottomBar: document.getElementById("tableGameBottomBar"),
    chatDrawer: document.getElementById("chatDrawer"),
    chatMessagesList: document.getElementById("chatMessagesList"),
    chatInputForm: document.getElementById("chatInputForm"),
    chatMessageInput: document.getElementById("chatMessageInput"),
    chatMeetupTitle: document.getElementById("chatMeetupTitle"),
    quizContainer: document.getElementById("quizContainer"),
    quizSideDrawer: document.getElementById("quizSideDrawer"),
    quizDrawerOverlay: document.getElementById("quizDrawerOverlay"),
    quizDrawerBody: document.getElementById("quizDrawerBody"),
    closeQuizDrawerBtn: document.getElementById("closeQuizDrawerBtn"),
    drawerStepIndicator: document.getElementById("drawerStepIndicator"),
    drawerWizardTab: document.getElementById("drawerWizardTab"),
    drawerSummaryTab: document.getElementById("drawerSummaryTab"),
    toastContainer: document.getElementById("toastContainer"),
    shareWebsiteModal: document.getElementById("shareWebsiteModal"),
    closeShareWebsiteModalBtn: document.getElementById("closeShareWebsiteModalBtn"),
    closeShareWebsiteModalFooterBtn: document.getElementById("closeShareWebsiteModalFooterBtn")
  };

  // --------------------------------------------------------------------------
  // Theme Management
  // --------------------------------------------------------------------------
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    state.theme = theme;
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.innerHTML = theme === "dark" 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      elements.themeToggleBtn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    }
  }

  function toggleTheme() {
    const newTheme = state.theme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme} theme`);
  }

  // --------------------------------------------------------------------------
  // Toast Notifications
  // --------------------------------------------------------------------------
  function showToast(message, type = "info") {
    if (!elements.toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${escapeHTML(message)}</span>
    `;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // --------------------------------------------------------------------------
  // Utility Functions
  // --------------------------------------------------------------------------
  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function saveBookings() {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(state.bookedIds));
    updateCategoryCounts();
    if (typeof updateFloatingChatWidget === "function") {
      updateFloatingChatWidget();
    }
  }

  function isMeetupSaved(meetupId) {
    return Array.isArray(state.savedMeetupIds) && state.savedMeetupIds.includes(meetupId);
  }

  function toggleSaveMeetup(meetupId, triggerElement) {
    if (!meetupId) return false;
    const isSaved = isMeetupSaved(meetupId);
    if (isSaved) {
      state.savedMeetupIds = state.savedMeetupIds.filter(id => id !== meetupId);
      showToast("Removed from Saved for Later", "info");
    } else {
      state.savedMeetupIds.push(meetupId);
      showToast("🔖 Gathering saved for later!", "success");
    }
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_MEETUPS, JSON.stringify(state.savedMeetupIds));
    } catch (e) {}

    updateCategoryCounts();
    updateSaveButtonsInDOM(meetupId);

    // If currently viewing the 'saved' tab, re-render to reflect removal/addition
    if (state.activeCategory === "saved") {
      renderMeetups();
    }
    return !isSaved;
  }

  function updateSaveButtonsInDOM(meetupId) {
    const isSaved = isMeetupSaved(meetupId);
    document.querySelectorAll(`.btn-save-meetup-action[data-id="${meetupId}"]`).forEach(btn => {
      btn.classList.toggle("is-saved", isSaved);
      btn.setAttribute("title", isSaved ? "Saved for later · Click to remove" : "Save for later");
      btn.setAttribute("aria-label", isSaved ? "Saved for later · Click to remove" : "Save for later");
      const svg = btn.querySelector("svg");
      if (svg) {
        svg.setAttribute("fill", isSaved ? "var(--accent-gold, #c89d5c)" : "none");
        svg.style.stroke = isSaved ? "var(--accent-gold, #c89d5c)" : "currentColor";
      }
    });
  }

  function shareMeetup(meetupId, triggerElement) {
    const meetup = state.meetups.find(m => m.id === meetupId);
    if (!meetup) return;

    const shareUrl = `${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(meetup.code || meetup.id)}`;
    const shareTitle = `${meetup.title} — Outspire Gathering`;
    const shareText = `Join me for this meetup on Outspire: "${meetup.title}" on ${meetup.day || 'upcoming'}, ${meetup.time || ''} at ${meetup.venueName || ''}! Code: ${meetup.code || ''}`;

    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      }).catch(() => {
        copyMeetupShareFallback(shareText, shareUrl, triggerElement);
      });
    } else {
      copyMeetupShareFallback(shareText, shareUrl, triggerElement);
    }
  }

  function copyMeetupShareFallback(shareText, shareUrl, triggerElement) {
    const textToCopy = `${shareText}\n${shareUrl}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        triggerShareVisualFeedback(triggerElement);
        showToast("🔗 Meetup link & code copied to clipboard!", "success");
      }).catch(() => {
        promptCopyFallback(textToCopy);
      });
    } else {
      promptCopyFallback(textToCopy);
    }
  }

  function triggerShareVisualFeedback(btn) {
    if (!btn) return;
    const originalHTML = btn.innerHTML;
    btn.classList.add("btn-share-copied");
    btn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>Copied!</span>
    `;
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.classList.remove("btn-share-copied");
    }, 2200);
  }

  function promptCopyFallback(text) {
    window.prompt("Copy this link to share with friends:", text);
    showToast("Link ready to share!", "info");
  }

  // --------------------------------------------------------------------------
  // Website Platform Sharing
  // --------------------------------------------------------------------------
  function getWebsiteShareData() {
    const siteUrl = window.location.origin + window.location.pathname.replace(/\/index\.html$/i, "");
    const title = "Outspire — In-Person Social Meetups & Gatherings";
    const text = "Bringing strangers together in real-world spaces for coffee, dining, sports, outdoors, and lasting friendships. Check out Outspire!";
    return { siteUrl, title, text };
  }

  function shareWebsite(triggerElement) {
    const { siteUrl, title, text } = getWebsiteShareData();

    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      navigator.share({
        title,
        text,
        url: siteUrl
      }).catch(() => {
        openShareWebsiteModal();
      });
    } else {
      copyWebsiteLink(triggerElement);
      openShareWebsiteModal();
    }
  }

  function copyWebsiteLink(triggerElement) {
    const { siteUrl } = getWebsiteShareData();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(siteUrl).then(() => {
        triggerShareVisualFeedback(triggerElement);
        showToast("🔗 Outspire website link copied to clipboard!", "success");
      }).catch(() => {
        promptCopyFallback(siteUrl);
      });
    } else {
      promptCopyFallback(siteUrl);
    }
  }

  function openShareWebsiteModal() {
    const modal = elements.shareWebsiteModal || document.getElementById("shareWebsiteModal");
    if (!modal) return;

    const { siteUrl, title, text } = getWebsiteShareData();

    const input = modal.querySelector("#shareWebsiteUrlInput");
    if (input) input.value = siteUrl;

    const encodedUrl = encodeURIComponent(siteUrl);
    const encodedText = encodeURIComponent(`${title}\n${text}`);

    const wa = modal.querySelector(".share-whatsapp-link");
    if (wa) wa.href = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;

    const tw = modal.querySelector(".share-twitter-link");
    if (tw) tw.href = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;

    const tg = modal.querySelector(".share-telegram-link");
    if (tg) tg.href = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;

    const li = modal.querySelector(".share-linkedin-link");
    if (li) li.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

    const fb = modal.querySelector(".share-facebook-link");
    if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    const em = modal.querySelector(".share-email-link");
    if (em) em.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + "\n\nExplore here: " + siteUrl)}`;

    if (!modal.open) {
      modal.showModal();
    }
  }

  function closeShareWebsiteModal() {
    const modal = elements.shareWebsiteModal || document.getElementById("shareWebsiteModal");
    if (modal && modal.open) {
      modal.close();
    }
  }

  // --------------------------------------------------------------------------
  // Meetup Filtering & Rendering
  // --------------------------------------------------------------------------
  function getFilteredMeetups() {
    // ----------------------------------------------------------------------
    // 1. Reserved Meetups Tab ("🎟️ Reserved Meetups")
    // Only show active / upcoming gatherings the user has reserved
    // ----------------------------------------------------------------------
    if (state.activeCategory === "reserved") {
      let list = getHistoryMeetups("reserved");

      if (state.searchQuery.trim() !== "") {
        const rawQ = state.searchQuery.trim();
        const cleanQ = rawQ.toLowerCase().replace(/^(code\s*:\s*|#)/i, "").trim();
        const cleanNoDash = cleanQ.replace(/-/g, "");
        const q = rawQ.toLowerCase();
        list = list.filter(meetup => {
          const meetupCode = (meetup.code || "").toLowerCase();
          const meetupCodeNoDash = meetupCode.replace(/-/g, "");
          const isCodeMatch = Boolean(meetupCode && (
            meetupCode === cleanQ ||
            meetupCodeNoDash === cleanNoDash ||
            meetupCode.includes(cleanQ) ||
            (cleanQ.length >= 3 && meetupCode.endsWith(cleanQ))
          ));
          return (
            isCodeMatch ||
            meetup.title.toLowerCase().includes(q) ||
            meetup.description.toLowerCase().includes(q) ||
            meetup.venueName.toLowerCase().includes(q) ||
            meetup.location.toLowerCase().includes(q) ||
            meetup.neighborhood.toLowerCase().includes(q) ||
            (meetup.tags && meetup.tags.some(tag => tag.toLowerCase().includes(q)))
          );
        });
      }
      return list;
    }

    // ----------------------------------------------------------------------
    // 2. History View ("My Booked History" tab)
    // Always return in latest-first order (latest upcoming/joined on top, concluded last)
    // ----------------------------------------------------------------------
    if (state.activeCategory === "booked") {
      const historyFilter = state.historyFilter || "all";
      let list = getHistoryMeetups(historyFilter);

      // If a search query is active in My Booked History, search within user's booked meetups
      if (state.searchQuery.trim() !== "") {
        const rawQ = state.searchQuery.trim();
        const cleanQ = rawQ.toLowerCase().replace(/^(code\s*:\s*|#)/i, "").trim();
        const cleanNoDash = cleanQ.replace(/-/g, "");
        const q = rawQ.toLowerCase();
        list = list.filter(meetup => {
          const meetupCode = (meetup.code || "").toLowerCase();
          const meetupCodeNoDash = meetupCode.replace(/-/g, "");
          const isCodeMatch = Boolean(meetupCode && (
            meetupCode === cleanQ ||
            meetupCodeNoDash === cleanNoDash ||
            meetupCode.includes(cleanQ) ||
            (cleanQ.length >= 3 && meetupCode.endsWith(cleanQ))
          ));
          return (
            isCodeMatch ||
            meetup.title.toLowerCase().includes(q) ||
            meetup.description.toLowerCase().includes(q) ||
            meetup.venueName.toLowerCase().includes(q) ||
            meetup.location.toLowerCase().includes(q) ||
            meetup.neighborhood.toLowerCase().includes(q) ||
            (meetup.tags && meetup.tags.some(tag => tag.toLowerCase().includes(q)))
          );
        });
      }
      return list;
    }

    const publicList = state.meetups.filter(meetup => {
      const isBooked = state.bookedIds.includes(meetup.id);
      const isEndedOrPassed = isMeetupEndedOrPassed(meetup);

      // Public Gathering Visibility Enforcement:
      // When a meetup has ended OR reached its scheduled start time, remove it from public.
      // Only people who have joined it should see it in My Booked History or profile history.
      if (isEndedOrPassed) {
        return false;
      }

      if (state.activeCategory === "saved") {
        if (!isMeetupSaved(meetup.id)) return false;
      } else if (state.activeCategory === "dining") {
        if (meetup.category !== "dining" && meetup.category !== "coffee") return false;
      } else if (state.activeCategory === "active") {
        if (meetup.category !== "active" && meetup.category !== "jogging" && meetup.category !== "swimming" && meetup.category !== "fitness") return false;
      } else if (state.activeCategory === "sports") {
        if (meetup.category !== "sports" && meetup.category !== "games") return false;
      } else if (state.activeCategory === "outdoors") {
        if (meetup.category !== "outdoors" && meetup.category !== "dogwalk" && meetup.category !== "playground" && meetup.category !== "parks") return false;
      } else if (state.activeCategory === "creative") {
        if (meetup.category !== "creative" && meetup.category !== "arts" && meetup.category !== "hobbies") return false;
      } else if (state.activeCategory === "event") {
        if (meetup.category !== "event" && !meetup.isEvent) return false;
      } else if (state.activeCategory === "nightlife") {
        if (meetup.category !== "nightlife") return false;
      } else if (state.activeCategory === "curated") {
        if (meetup.vibeScore < 95) return false;
      } else if (state.activeCategory === "jogging") {
        if (meetup.category !== "jogging") return false;
      } else if (state.activeCategory === "dogwalk") {
        if (meetup.category !== "dogwalk") return false;
      } else if (state.activeCategory === "swimming") {
        if (meetup.category !== "swimming") return false;
      } else if (state.activeCategory === "playground") {
        if (meetup.category !== "playground") return false;
      }

      // Search Query & Direct Meetup Code Lookup (e.g. MEET-1001, Code: MEET-1001, 1001)
      if (state.searchQuery.trim() !== "") {
        const rawQ = state.searchQuery.trim();
        const cleanQ = rawQ.toLowerCase().replace(/^(code\s*:\s*|#)/i, "").trim();
        const cleanNoDash = cleanQ.replace(/-/g, "");

        const meetupCode = (meetup.code || "").toLowerCase();
        const meetupCodeNoDash = meetupCode.replace(/-/g, "");
        const isCodeMatch = Boolean(meetupCode && (
          meetupCode === cleanQ ||
          meetupCodeNoDash === cleanNoDash ||
          meetupCode.includes(cleanQ) ||
          (cleanQ.length >= 3 && meetupCode.endsWith(cleanQ))
        ));

        const q = rawQ.toLowerCase();
        const matchesQuery = 
          isCodeMatch ||
          meetup.title.toLowerCase().includes(q) ||
          meetup.description.toLowerCase().includes(q) ||
          meetup.venueName.toLowerCase().includes(q) ||
          meetup.location.toLowerCase().includes(q) ||
          meetup.neighborhood.toLowerCase().includes(q) ||
          meetup.tags.some(tag => tag.toLowerCase().includes(q));

        if (!matchesQuery) return false;

        // If the user entered a direct code lookup (e.g. MEET-1001, Code: MEET-1001, 1001),
        // prioritize finding that exact meetup immediately across cities/categories/days!
        const isDirectCodeSearch = /^code\s*:/i.test(rawQ) || rawQ.startsWith("#") || /^meet/i.test(rawQ) || /^\d{4}$/.test(rawQ.trim());
        if (isCodeMatch && isDirectCodeSearch) {
          return true;
        }
      }

      // 4-Day Booking Window Enforcement: Strictly only show meetups within active 4 days
      const win = typeof calculate4DayBookingWindow === "function" ? calculate4DayBookingWindow() : null;
      if (win && meetup.dateStr) {
        if (meetup.dateStr < win.startDateStr || meetup.dateStr > win.endDateStr) {
          return false;
        }
      }

      // Day filter (Next 4 Days)
      if (state.selectedDay !== "all") {
        if (state.selectedDay.startsWith("day:")) {
          const targetOffset = parseInt(state.selectedDay.replace("day:", ""), 10);
          if (meetup.dayOffset !== targetOffset) return false;
        } else if (state.selectedDay.includes("-")) {
          if (meetup.dateStr !== state.selectedDay) return false;
        } else {
          if (!meetup.day.toLowerCase().includes(state.selectedDay.toLowerCase())) return false;
        }
      }

      // City & Area / Location filter: Strictly only show meetups from the place that person is from
      const userCityClean = getCleanCity(state.userCity || "New York");
      const cityLower = userCityClean.toLowerCase();
      const matchesCity = 
        (meetup.location && meetup.location.toLowerCase().includes(cityLower)) ||
        (meetup.venueAddress && meetup.venueAddress.toLowerCase().includes(cityLower));
      if (!matchesCity) return false;

      // If specific area within that city is selected
      if (state.selectedArea && state.selectedArea !== "all") {
        const areaLower = state.selectedArea.toLowerCase();
        const matchesArea = 
          (meetup.location && meetup.location.toLowerCase().includes(areaLower)) ||
          (meetup.neighborhood && meetup.neighborhood.toLowerCase().includes(areaLower)) ||
          (meetup.venueAddress && meetup.venueAddress.toLowerCase().includes(areaLower));
        if (!matchesArea) return false;
      }

      // Time Range filter ("Between This to This")
      if (state.selectedTimeRange !== "all") {
        let startMins = 0;
        let endMins = 24 * 60;

        if (state.selectedTimeRange === "custom") {
          startMins = parseTimeToMinutes(state.customTimeStart || "10:00");
          endMins = parseTimeToMinutes(state.customTimeEnd || "18:00");
        } else if (state.selectedTimeRange.includes("-")) {
          const parts = state.selectedTimeRange.split("-").map(Number);
          startMins = parts[0] * 60;
          endMins = parts[1] * 60;
        }

        const meetupMins = parseTimeToMinutes(meetup.timeRaw);
        if (endMins >= startMins) {
          if (meetupMins < startMins || meetupMins > endMins) return false;
        } else {
          // Overnight range (e.g. 21:00 to 02:00)
          if (meetupMins < startMins && meetupMins > endMins) return false;
        }
      }

      // Group Size filter (Simplified clean categories)
      if (state.selectedGroupSize !== "all") {
        const cap = meetup.capacity;
        if (state.selectedGroupSize === "2") {
          if (cap !== 2) return false;
        } else if (state.selectedGroupSize === "3-4") {
          if (cap < 3 || cap > 4) return false;
        } else if (state.selectedGroupSize === "5-6") {
          if (cap < 5 || cap > 6) return false;
        } else if (state.selectedGroupSize === "7-10") {
          if (cap < 7 || cap > 10) return false;
        } else if (state.selectedGroupSize === "10+" || state.selectedGroupSize === "11-20" || state.selectedGroupSize === "20+") {
          if (cap < 10) return false;
        } else {
          const exact = parseInt(state.selectedGroupSize, 10);
          if (!isNaN(exact) && cap !== exact) return false;
        }
      }

      return true;
    });

    return publicList.sort((a, b) => {
      if (a.isCreatedByCurrentUser && !b.isCreatedByCurrentUser) return -1;
      if (!a.isCreatedByCurrentUser && b.isCreatedByCurrentUser) return 1;
      return 0;
    });
  }

  function renderHistoryControlsBar(container) {
    if (!container) return;
    const allCount = getHistoryMeetups("all").length;
    const reservedCount = getHistoryMeetups("reserved").length;
    const hostedCount = getHistoryMeetups("hosted").length;
    const currentFilter = state.historyFilter || "all";

    container.innerHTML = `
      <div class="history-controls-inner">
        <div class="history-filter-toggle-group" role="tablist" aria-label="History view filter">
          <button type="button" class="history-toggle-pill ${currentFilter === 'all' ? 'active' : ''}" data-history-filter="all" role="tab" aria-selected="${currentFilter === 'all'}">
            <span class="history-pill-icon">📋</span>
            <span class="history-pill-text">All Meetups</span>
            <span class="history-pill-count">${allCount}</span>
          </button>
          <button type="button" class="history-toggle-pill ${currentFilter === 'reserved' ? 'active' : ''}" data-history-filter="reserved" role="tab" aria-selected="${currentFilter === 'reserved'}">
            <span class="history-pill-icon">🎟️</span>
            <span class="history-pill-text">Reserved Meetups</span>
            <span class="history-pill-count">${reservedCount}</span>
          </button>
          <button type="button" class="history-toggle-pill ${currentFilter === 'hosted' ? 'active' : ''}" data-history-filter="hosted" role="tab" aria-selected="${currentFilter === 'hosted'}">
            <span class="history-pill-icon">👑</span>
            <span class="history-pill-text">I Hosted Meetups</span>
            <span class="history-pill-count">${hostedCount}</span>
          </button>
        </div>
        <div class="history-actions-group">
          <button type="button" class="btn btn-secondary btn-sm btn-clear-history" id="btnClearHistoryBtn" title="Clear all meetup history" ${allCount === 0 ? 'disabled style="opacity: 0.45; cursor: not-allowed;"' : ''}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:4px;">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Clear History
          </button>
        </div>
      </div>
    `;

    container.querySelectorAll(".history-toggle-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const filter = pill.getAttribute("data-history-filter") || "all";
        state.historyFilter = filter;
        renderMeetups();
      });
    });

    const clearBtn = container.querySelector("#btnClearHistoryBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (allCount > 0) {
          openClearHistoryConfirm();
        }
      });
    }
  }

  function renderMeetups() {
    if (!elements.meetupsGrid) return;

    if (state.activeCategory === "booked") {
      if (elements.cityAreaFilterBar) elements.cityAreaFilterBar.style.display = "none";
      if (elements.historyControlsBar) {
        elements.historyControlsBar.style.display = "flex";
        renderHistoryControlsBar(elements.historyControlsBar);
      }
    } else if (state.activeCategory === "reserved") {
      if (elements.cityAreaFilterBar) elements.cityAreaFilterBar.style.display = "none";
      if (elements.historyControlsBar) elements.historyControlsBar.style.display = "none";
    } else {
      if (elements.cityAreaFilterBar) elements.cityAreaFilterBar.style.display = "";
      if (elements.historyControlsBar) elements.historyControlsBar.style.display = "none";
    }

    const filtered = getFilteredMeetups();

    if (elements.meetupsCountDisplay) {
      if (state.activeCategory === "reserved") {
        elements.meetupsCountDisplay.textContent = `${filtered.length} Reserved Gathering${filtered.length === 1 ? '' : 's'}`;
      } else if (state.activeCategory === "booked") {
        let label = "History Gathering";
        if (state.historyFilter === "hosted") label = "Hosted Gathering";
        else if (state.historyFilter === "reserved") label = "Reserved Gathering";
        elements.meetupsCountDisplay.textContent = `${filtered.length} ${label}${filtered.length === 1 ? '' : 's'}`;
      } else if (state.searchQuery.trim() !== "") {
        elements.meetupsCountDisplay.textContent = `${filtered.length} Gathering${filtered.length === 1 ? '' : 's'} matching "${state.searchQuery.trim()}"`;
      } else {
        elements.meetupsCountDisplay.textContent = `${filtered.length} Gathering${filtered.length === 1 ? '' : 's'} in ${state.userCity || 'Your City'}`;
      }
    }

    if (filtered.length === 0) {
      if (state.searchQuery.trim() !== "") {
        elements.meetupsGrid.innerHTML = `
          <div class="empty-meetups-state">
            <h3>No gathering found matching "${escapeHTML(state.searchQuery.trim())}"</h3>
            <p style="color: var(--text-muted); margin-bottom: 20px;">
              Check the meetup code (e.g. <strong>Code: MEET-1001</strong>) or search by venue, activity, or city name.
            </p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-secondary btn-sm" id="clearSearchInnerBtn">
                Clear Search
              </button>
            </div>
          </div>
        `;

        const clearBtn = document.getElementById("clearSearchInnerBtn");
        if (clearBtn) {
          clearBtn.addEventListener("click", () => {
            state.searchQuery = "";
            if (elements.meetupSearchInput) elements.meetupSearchInput.value = "";
            renderMeetups();
          });
        }
        return;
      }

      if (state.activeCategory === "reserved") {
        elements.meetupsGrid.innerHTML = `
          <div class="empty-meetups-state">
            <div style="font-size: 2.4rem; margin-bottom: 10px;">🎟️</div>
            <h3>No Reserved Meetups Yet</h3>
            <p style="color: var(--text-muted); margin-bottom: 20px; max-width: 460px; margin-left: auto; margin-right: auto;">
              You don't have any upcoming reserved meetups right now. Browse available tables, walks, and games in your area to reserve your free spot!
            </p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-primary btn-sm" id="btnExploreFromReserved">
                Explore All Gatherings
              </button>
            </div>
          </div>
        `;
        const exploreBtn = document.getElementById("btnExploreFromReserved");
        if (exploreBtn) exploreBtn.addEventListener("click", () => setCategory("all"));
        return;
      }

      if (state.activeCategory === "booked") {
        const isHosted = state.historyFilter === "hosted";
        const isReserved = state.historyFilter === "reserved";
        let emptyIcon = "📋";
        let emptyHeader = "Your Meetup History is Empty";
        let emptyDesc = "You don't have any gatherings in history, or your history was cleared. Explore upcoming meetups in your area to reserve your seat!";
        if (isHosted) {
          emptyIcon = "👑";
          emptyHeader = "No Hosted Meetups in History";
          emptyDesc = "You haven't hosted any meetups yet. Host a gathering in your neighborhood and welcome curious strangers to your table!";
        } else if (isReserved) {
          emptyIcon = "🎟️";
          emptyHeader = "No Reserved Meetups Currently Active";
          emptyDesc = "You don't have any active upcoming reservations right now. Explore upcoming meetups in your area to reserve your free spot!";
        }

        elements.meetupsGrid.innerHTML = `
          <div class="empty-meetups-state">
            <div style="font-size: 2.4rem; margin-bottom: 10px;">${emptyIcon}</div>
            <h3>${emptyHeader}</h3>
            <p style="color: var(--text-muted); margin-bottom: 20px; max-width: 460px; margin-left: auto; margin-right: auto;">
              ${emptyDesc}
            </p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              ${isHosted ? `
                <a href="#host-section" class="btn btn-primary btn-sm">
                  + Host a Gathering Now
                </a>
                <button class="btn btn-secondary btn-sm" id="btnSwitchAllHistory">
                  View All Meetups History
                </button>
              ` : `
                <button class="btn btn-primary btn-sm" id="btnExploreFromHistory">
                  Explore Gatherings
                </button>
              `}
            </div>
          </div>
        `;
        const exploreBtn = document.getElementById("btnExploreFromHistory");
        if (exploreBtn) exploreBtn.addEventListener("click", () => setCategory("all"));
        const switchBtn = document.getElementById("btnSwitchAllHistory");
        if (switchBtn) {
          switchBtn.addEventListener("click", () => {
            state.historyFilter = "all";
            renderMeetups();
          });
        }
        return;
      }

      const userCityDisplay = state.userCity || "your city";
      const isSavedTab = state.activeCategory === 'saved';
      const isBookedTab = state.activeCategory === 'booked';
      const emptyTitle = isSavedTab 
        ? "No gatherings saved for later yet" 
        : (isBookedTab ? "No reserved meetups or history yet" : `No gatherings currently scheduled in ${escapeHTML(userCityDisplay)}`);

      const emptyDesc = isBookedTab 
        ? "You haven't reserved any meetups yet. Explore upcoming tables in your area and reserve your first seat free!" 
        : (isSavedTab 
          ? "You haven't bookmarked any meetups for later yet. Tap the bookmark ribbon 🔖 on any gathering to save it here for quick access!"
          : `There are no gatherings matching your current filters in ${escapeHTML(userCityDisplay)}. You can host the first gathering in your city, or adjust your day/time filters.`);

      elements.meetupsGrid.innerHTML = `
        <div class="empty-meetups-state">
          <h3>${emptyTitle}</h3>
          <p style="color: var(--text-muted); margin-bottom: 20px;">
            ${emptyDesc}
          </p>
          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            ${isSavedTab ? `
              <button class="btn btn-primary btn-sm" id="resetFiltersInnerBtn">
                Explore All Gatherings
              </button>
            ` : `
              <a href="#host-section" class="btn btn-primary btn-sm">
                + Host Gathering in ${escapeHTML(userCityDisplay)}
              </a>
              <button class="btn btn-secondary btn-sm" id="resetFiltersInnerBtn">
                ${isBookedTab ? 'Explore Gatherings' : 'Reset All Filters'}
              </button>
            `}
          </div>
        </div>
      `;

      const resetBtn = document.getElementById("resetFiltersInnerBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          if (state.activeCategory === "booked" || state.activeCategory === "saved") {
            setCategory("all");
          } else {
            resetFilters();
          }
        });
      }
      return;
    }

    elements.meetupsGrid.innerHTML = filtered.map(meetup => {
      const isBooked = state.bookedIds.includes(meetup.id);
      const spotsRemaining = meetup.capacity - meetup.bookedCount - (isBooked ? 0 : 0);

      // Determine activity-tailored capacity badge
      const capDisplay = meetup.capacity >= 100 ? "100+" : meetup.capacity;
      let capacityBadge = `👥 Table of ${meetup.capacity} (Max 10)`;
      if (meetup.category === "jogging") capacityBadge = `🏃 ${capDisplay} Joggers`;
      else if (meetup.category === "sports") capacityBadge = `⚽ ${capDisplay} Players`;
      else if (meetup.category === "dogwalk") capacityBadge = `🐕 ${capDisplay} Dog Walkers`;
      else if (meetup.category === "swimming") capacityBadge = `🏊 ${capDisplay} Swimmers`;
      else if (meetup.category === "playground") capacityBadge = `🛝 ${capDisplay} Group`;
      else if (meetup.category === "event" || meetup.isEvent) capacityBadge = `🎉 Event (${capDisplay} Spots)`;
      else if (meetup.category === "coffee" || meetup.category === "dining" || meetup.category === "nightlife") capacityBadge = `👥 Table of ${meetup.capacity} (Max 10)`;
      else capacityBadge = `👥 Group of ${capDisplay}`;

      const win = typeof calculate4DayBookingWindow === "function" ? calculate4DayBookingWindow() : null;
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const meetupMinutes = parseTimeToMinutes(meetup.timeRaw);
      
      const isToday = meetup.dayOffset === 0 || (win && meetup.dateStr === win.startDateStr);
      const isConcludedToday = isToday && currentMinutes > meetupMinutes + 60;
      const isInProgress = isToday && currentMinutes >= meetupMinutes && currentMinutes <= meetupMinutes + 60;
      const isStartingSoon = isToday && currentMinutes < meetupMinutes && (meetupMinutes - currentMinutes <= 180);

      const endStatus = getMeetupEndStatus(meetup.id);
      const isEndedOrPassed = isMeetupEndedOrPassed(meetup);
      let liveStatusBadge = "";
      if (endStatus.isFullyClosed) {
        liveStatusBadge = `<span class="meetup-live-status-pill status-concluded" style="background: rgba(239, 68, 68, 0.18); color: #f87171; border-color: rgba(239, 68, 68, 0.35);">🔒 Concluded</span>`;
      } else if (endStatus.isEnded) {
        liveStatusBadge = `<span class="meetup-live-status-pill status-starting-soon" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border-color: rgba(245, 158, 11, 0.4);">⏱️ Wrapping Up (${formatRemainingTime(endStatus.remainingMs)})</span>`;
      } else if (isInProgress) {
        liveStatusBadge = `<span class="meetup-live-status-pill status-in-progress">🔴 In Progress Now</span>`;
      } else if (isEndedOrPassed || isConcludedToday) {
        liveStatusBadge = `<span class="meetup-live-status-pill status-concluded">⏳ Concluded / History</span>`;
      } else if (isStartingSoon) {
        const diffMins = meetupMinutes - currentMinutes;
        const h = Math.floor(diffMins / 60);
        const m = diffMins % 60;
        const countdown = h > 0 ? `${h}h ${m}m` : `${m}m`;
        liveStatusBadge = `<span class="meetup-live-status-pill status-starting-soon">⚡ Starts in ${countdown}</span>`;
      } else if (isToday) {
        liveStatusBadge = `<span class="meetup-live-status-pill status-today">🟢 Open Today</span>`;
      } else if (meetup.dayOffset === 1) {
        liveStatusBadge = `<span class="meetup-live-status-pill status-tomorrow">🗓️ Open Tomorrow</span>`;
      } else {
        liveStatusBadge = `<span class="meetup-live-status-pill status-future">🗓️ ${escapeHTML(meetup.day)}</span>`;
      }

      const isDining = meetup.category === 'coffee' || meetup.category === 'dining' || meetup.category === 'nightlife';
      let actionButtonText = "";
      if (isBooked) {
        actionButtonText = isDining ? 'View Table ✓' : 'View Group ✓';
      } else if (isEndedOrPassed || isConcludedToday) {
        actionButtonText = 'Concluded';
      } else {
        actionButtonText = (meetup.isEvent || meetup.category === 'event') ? 'View & Join' : (isDining ? 'View Table & Join' : 'View & Join Group');
      }

      let spotsBadgeHTML = "";
      if (isBooked) {
        if (isEndedOrPassed) {
          spotsBadgeHTML = `
            <span class="spots-badge status-reserved" style="background: rgba(227, 210, 186, 0.12); border-color: rgba(227, 210, 186, 0.25); color: var(--cream-200);" title="You attended this gathering">
              ✓ Attended (History)
            </span>
          `;
        } else {
          spotsBadgeHTML = `
            <span class="spots-badge status-reserved" title="You have a confirmed reserved spot for this gathering">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block; vertical-align:middle;">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Spot Reserved
            </span>
          `;
        }
      } else if (isEndedOrPassed || isConcludedToday) {
        spotsBadgeHTML = `
          <span class="spots-badge status-concluded">
            Booking Closed
          </span>
        `;
      } else {
        const isFew = spotsRemaining <= 2;
        spotsBadgeHTML = `
          <span class="spots-badge status-open">
            <span class="spots-status-dot ${isFew ? 'dot-few' : ''}"></span>
            ${spotsRemaining} spot${spotsRemaining === 1 ? '' : 's'} left
          </span>
        `;
      }

      return `
        <article 
          class="meetup-card ${meetup.isSurpriseMeetup ? 'surprise-meetup-card' : ''}" 
          data-meetup-id="${meetup.id}"
          role="button"
          tabindex="0"
          aria-label="Open group page for ${escapeHTML(meetup.title)}"
          title="Click to open ${escapeHTML(meetup.title)} group page"
        >
          <div class="meetup-card-media">
            <img 
              src="${meetup.image}" 
              alt="${escapeHTML(meetup.imageAlt)}" 
              class="meetup-card-img" 
              loading="lazy"
              width="400" 
              height="250"
            />
            <span class="meetup-time-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 4px;">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${escapeHTML(meetup.day)} • ${escapeHTML(meetup.time)}
            </span>
            <span class="meetup-price-badge">${isBooked ? "Reserved ✓" : escapeHTML(meetup.price)}</span>

            <!-- Floating Quick Actions: Share & Save for later -->
            <div class="meetup-card-floating-actions">
              <button 
                type="button" 
                class="meetup-card-action-btn btn-meetup-share-action" 
                data-id="${meetup.id}" 
                title="Share this meetup" 
                aria-label="Share ${escapeHTML(meetup.title)}"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                <span>Share</span>
              </button>
              <button 
                type="button" 
                class="meetup-card-action-btn btn-symbolic-action btn-save-meetup-action ${isMeetupSaved(meetup.id) ? 'is-saved' : ''}" 
                data-id="${meetup.id}" 
                title="${isMeetupSaved(meetup.id) ? 'Saved for later · Click to remove' : 'Save for later'}" 
                aria-label="${isMeetupSaved(meetup.id) ? 'Saved for later · Click to remove' : 'Save for later'}"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="${isMeetupSaved(meetup.id) ? 'var(--accent-gold)' : 'none'}" stroke="${isMeetupSaved(meetup.id) ? 'var(--accent-gold)' : 'currentColor'}" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="meetup-card-body">
            <div class="meetup-card-tags">
              ${meetup.isSurpriseMeetup ? '<span class="meetup-tag surprise-card-tag">🎁 Surprise Match · Reserved</span>' : ''}
              ${isUserHostOfMeetup(meetup) ? '<span class="meetup-tag hosted-by-you-tag" style="background: rgba(227, 210, 186, 0.2); color: var(--accent-gold); border: 1px solid rgba(227, 210, 186, 0.4); font-weight: 700;">👑 Hosted by You</span>' : ''}
              <span class="meetup-code-pill copy-meetup-code-btn" data-code="${escapeHTML(meetup.code || '')}" title="Click to copy Code: ${escapeHTML(meetup.code || '')}">
                <span class="code-prefix">Code:</span> <span class="code-num">${escapeHTML(meetup.code || '')}</span>
                <span class="code-copy-icon" aria-hidden="true">📋</span>
              </span>
              ${liveStatusBadge}
              <span class="meetup-tag capacity-tag">${capacityBadge}</span>
              ${meetup.tags.slice(0, 2).map(tag => `<span class="meetup-tag">${escapeHTML(tag)}</span>`).join("")}
              ${meetup.host ? `<span class="badge-community-host">${meetup.isSurpriseMeetup ? '✨ Hosted by Outspire' : `📍 Host: ${escapeHTML(meetup.host.name)}`}</span>` : ""}
            </div>

            <h3 class="meetup-card-title">${escapeHTML(meetup.title)}</h3>

            <div class="meetup-card-venue">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cream-300)" stroke-width="2" style="flex-shrink:0; margin-top:3px;">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span><strong>${escapeHTML(meetup.venueName)}</strong> — ${escapeHTML(meetup.venueAddress)}</span>
            </div>

            <p class="meetup-card-desc">${escapeHTML(meetup.description)}</p>

            ${(() => {
              const cardCfg = (typeof getMeetupGameConfig === "function" ? getMeetupGameConfig(meetup) : null);
              const cardIcon = cardCfg ? cardCfg.icon : "🎲";
              const cardLabel = cardCfg ? cardCfg.cardLabel : "Meetup games: Unlock at venue";
              return `
                <div class="meetup-card-games-banner view-games-card-btn" data-id="${meetup.id}" role="button" tabindex="0" title="Socializing games provided · Host unlocks at the venue">
                  <span class="games-mini-label">
                    <span>${cardIcon}</span>
                    <span>${escapeHTML(cardLabel)}</span>
                  </span>
                  <span class="games-mini-arrow">Unlock ➔</span>
                </div>
              `;
            })()}

            <div class="meetup-card-footer">
              <div class="meetup-footer-left">
                ${meetup.isSurpriseMeetup ? `
                  <div class="avatar-stack" title="Surprise Table: Photos hidden until meetup">
                    ${meetup.members.slice(0, 4).map((m, idx) => `
                      <div 
                        class="mystery-stack-avatar" 
                        title="${escapeHTML(m.name)} (Photo hidden for surprise meetup)"
                        style="z-index: ${5 - idx}; width: 30px; height: 30px; border-radius: 50%; background: #26211d; border: 2px solid var(--cream-300); display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; color: var(--cream-200); margin-right: -8px;"
                      >
                        👤
                      </div>
                    `).join("")}
                  </div>
                ` : `
                  <div class="avatar-stack" title="${meetup.members.map(m => m.name).join(', ')}">
                    ${meetup.members.slice(0, 4).map((m, idx) => `
                      <img 
                        src="${m.avatar}" 
                        alt="${escapeHTML(m.name)}" 
                        loading="lazy"
                        title="${escapeHTML(m.name)}"
                        class="member-avatar-btn"
                        data-member-name="${escapeHTML(m.name)}"
                        style="z-index: ${5 - idx};"
                        width="30" 
                        height="30"
                      />
                    `).join("")}
                    ${meetup.members.length > 4 ? `
                      <span class="avatar-stack-overflow" style="z-index: 1;" title="${meetup.members.length - 4} more attendees">+${meetup.members.length - 4}</span>
                    ` : ''}
                  </div>
                `}
                ${spotsBadgeHTML}
              </div>

              <div style="display: flex; gap: 8px; align-items: center;">
                ${(state.activeCategory === 'booked' && (isEndedOrPassed || isConcludedToday)) ? `
                  <button 
                    type="button" 
                    class="btn btn-ghost btn-sm btn-delete-card-history" 
                    data-history-id="${meetup.id}" 
                    title="Delete this gathering from history" 
                    aria-label="Delete ${escapeHTML(meetup.title)} from history"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <span>Delete</span>
                  </button>
                ` : ''}

                <button 
                  class="btn ${isBooked ? 'btn-secondary' : (isConcludedToday ? 'btn-secondary' : 'btn-primary')} btn-sm view-reserve-btn" 
                  data-id="${meetup.id}"
                  ${isConcludedToday ? 'style="opacity: 0.75;"' : ''}
                  aria-label="${isBooked ? 'Open group page for ' + meetup.title : (isConcludedToday ? meetup.title + ' is concluded' : 'Open group page and join ' + meetup.title)}"
                >
                  ${actionButtonText}
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join("");

    // Allow clicking the entire meetup card (image, title, venue, card body) to open the group page
    elements.meetupsGrid.querySelectorAll(".meetup-card").forEach(card => {
      card.addEventListener("click", (e) => {
        // If clicking on a nested element that handles its own action, don't re-trigger
        if (
          e.target.closest(".copy-meetup-code-btn") ||
          e.target.closest(".view-games-card-btn") ||
          e.target.closest(".member-avatar-btn") ||
          e.target.closest(".view-reserve-btn") ||
          e.target.closest(".btn-save-meetup-action") ||
          e.target.closest(".btn-meetup-share-action") ||
          e.target.closest(".btn-delete-card-history") ||
          e.target.closest(".meetup-card-floating-actions")
        ) {
          return;
        }
        const id = card.getAttribute("data-meetup-id");
        if (id) {
          openReservationModal(id);
        }
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (
            e.target.closest(".copy-meetup-code-btn") ||
            e.target.closest(".view-games-card-btn") ||
            e.target.closest(".member-avatar-btn") ||
            e.target.closest(".view-reserve-btn") ||
            e.target.closest(".btn-save-meetup-action") ||
            e.target.closest(".btn-meetup-share-action") ||
            e.target.closest(".btn-delete-card-history") ||
            e.target.closest(".meetup-card-floating-actions")
          ) {
            return;
          }
          e.preventDefault();
          const id = card.getAttribute("data-meetup-id");
          if (id) {
            openReservationModal(id);
          }
        }
      });
    });

    // Attach event listeners to history card delete buttons
    elements.meetupsGrid.querySelectorAll(".btn-delete-card-history").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const id = btn.getAttribute("data-history-id");
        if (id) {
          openDeleteHistoryItemConfirm(id);
        }
      });
    });

    // Attach event listeners to card reserve buttons and member avatars
    elements.meetupsGrid.querySelectorAll(".view-reserve-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute("data-id");
        openReservationModal(id);
      });
    });

    elements.meetupsGrid.querySelectorAll(".view-games-card-btn").forEach(banner => {
      banner.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute("data-id");
        openMeetupGamesModal(id);
      });
      banner.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          const id = e.currentTarget.getAttribute("data-id");
          openMeetupGamesModal(id);
        }
      });
    });

    elements.meetupsGrid.querySelectorAll(".member-avatar-btn").forEach(img => {
      img.addEventListener("click", (e) => {
        e.stopPropagation();
        openProfileModal("tom_cruise16"); // Open sample attendee profile
      });
    });
  }

  function setCategory(category) {
    state.activeCategory = category;
    if (elements.filterTabsContainer) {
      elements.filterTabsContainer.querySelectorAll(".filter-tab").forEach(tab => {
        tab.classList.toggle("active", tab.getAttribute("data-category") === category);
      });
    }
    renderMeetups();
  }

  function updateCategoryCounts() {
    if (!elements.filterTabsContainer) return;
    const reservedCount = (typeof getHistoryMeetups === "function") ? getHistoryMeetups("reserved").length : (state.bookedIds || []).length;
    const reservedBadge = elements.filterTabsContainer.querySelector('[data-category="reserved"] .badge-count');
    if (reservedBadge) {
      reservedBadge.textContent = reservedCount;
    }
    const historyCount = (typeof getHistoryMeetups === "function") ? getHistoryMeetups("all").length : (state.bookedIds || []).length;
    const bookedBadge = elements.filterTabsContainer.querySelector('[data-category="booked"] .badge-count');
    if (bookedBadge) {
      bookedBadge.textContent = historyCount;
    }
    const savedCount = (state.savedMeetupIds || []).length;
    const savedBadge = elements.filterTabsContainer.querySelector('[data-category="saved"] .badge-count');
    if (savedBadge) {
      savedBadge.textContent = savedCount;
    }
  }

  // --------------------------------------------------------------------------
  // Time Window Filtering ("Between This to This")
  // --------------------------------------------------------------------------
  function parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(":");
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return h * 60 + m;
  }

  function formatMinutesTo12h(mins) {
    const h24 = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    const period = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    const mStr = m < 10 ? "0" + m : m;
    return `${h12}:${mStr} ${period}`;
  }

  function formatTimeWindowLabel(startMins, endMins) {
    return `Between ${formatMinutesTo12h(startMins)} to ${formatMinutesTo12h(endMins)}`;
  }

  function updateTimeFilterUI() {
    if (!elements.customTimeRangeBar) return;

    if (state.selectedTimeRange === "all") {
      elements.customTimeRangeBar.style.display = "none";
      if (elements.timeFilterSelect) elements.timeFilterSelect.value = "all";
      if (elements.activeTimeWindowNotice) elements.activeTimeWindowNotice.style.display = "none";
    } else if (state.selectedTimeRange === "custom") {
      elements.customTimeRangeBar.style.display = "block";
      if (elements.timeFilterSelect) elements.timeFilterSelect.value = "custom";
      if (elements.timeRangeStartSelect) elements.timeRangeStartSelect.value = state.customTimeStart || "10:00";
      if (elements.timeRangeEndSelect) elements.timeRangeEndSelect.value = state.customTimeEnd || "18:00";
      
      const sMins = parseTimeToMinutes(state.customTimeStart || "10:00");
      const eMins = parseTimeToMinutes(state.customTimeEnd || "18:00");
      if (elements.activeTimeWindowNotice) {
        elements.activeTimeWindowNotice.style.display = "flex";
        elements.activeTimeWindowNotice.innerHTML = `
          <span>✓ Filtering meetups <strong>${formatTimeWindowLabel(sMins, eMins)}</strong></span>
        `;
      }
    } else if (state.selectedTimeRange.includes("-")) {
      elements.customTimeRangeBar.style.display = "block";
      const parts = state.selectedTimeRange.split("-").map(Number);
      const sMins = parts[0] * 60;
      const eMins = parts[1] * 60;
      const sStr = (parts[0] < 10 ? "0" + parts[0] : parts[0]) + ":00";
      const eStr = (parts[1] < 10 ? "0" + parts[1] : parts[1]) + ":00";

      if (elements.timeFilterSelect) elements.timeFilterSelect.value = state.selectedTimeRange;
      if (elements.timeRangeStartSelect) elements.timeRangeStartSelect.value = sStr;
      if (elements.timeRangeEndSelect) elements.timeRangeEndSelect.value = eStr;

      if (elements.activeTimeWindowNotice) {
        elements.activeTimeWindowNotice.style.display = "flex";
        elements.activeTimeWindowNotice.innerHTML = `
          <span>✓ Showing meetups <strong>${formatTimeWindowLabel(sMins, eMins)}</strong></span>
        `;
      }
    }
  }

  // --------------------------------------------------------------------------
  // Live 4-Day Booking Window & Real-Time Clock Engine
  // --------------------------------------------------------------------------
  function renderDaySelectOptions() {
    if (!elements.dayFilterSelect) return;
    const win = typeof calculate4DayBookingWindow === "function" ? calculate4DayBookingWindow() : null;
    if (!win) return;
    const selected = state.selectedDay || "all";
    const endDay = win.days && win.days[3] ? win.days[3].weekdayShort : "Wed";
    let html = `<option value="all">Any of 4 Days (Today – ${escapeHTML(endDay)})</option>`;
    win.days.forEach(d => {
      html += `<option value="day:${d.offset}">${escapeHTML(d.dayLabel)}</option>`;
    });
    elements.dayFilterSelect.innerHTML = html;
    elements.dayFilterSelect.value = selected;
  }

  // --------------------------------------------------------------------------
  // Dynamic City & Neighborhood / Area Filters (Driven by Questionnaire)
  // --------------------------------------------------------------------------
  function getAreasForCity(cityName) {
    if (!cityName || cityName === "all") return [];
    const cityLower = cityName.toLowerCase();
    const cityMeetups = state.meetups.filter(m => 
      (m.location && m.location.toLowerCase().includes(cityLower)) ||
      (m.venueAddress && m.venueAddress.toLowerCase().includes(cityLower))
    );

    const areaMap = new Map();
    cityMeetups.forEach(m => {
      let areaName = "";
      if (m.location && m.location.includes(",")) {
        const parts = m.location.split(",").map(p => p.trim());
        if (parts[1] && parts[1].toLowerCase().includes(cityLower)) {
          areaName = parts[0];
        } else if (parts[0].toLowerCase().includes(cityLower)) {
          areaName = m.neighborhood ? m.neighborhood.split("/")[0].trim() : parts[0];
        } else {
          areaName = parts[0];
        }
      } else if (m.location && m.location.includes("/")) {
        const parts = m.location.split("/").map(p => p.trim());
        areaName = parts[0];
      } else if (m.neighborhood) {
        areaName = m.neighborhood.split("/")[0].trim();
      } else {
        areaName = m.location || "";
      }

      if (areaName) {
        areaMap.set(areaName, (areaMap.get(areaName) || 0) + 1);
      }
    });

    return Array.from(areaMap.entries()).map(([name, count]) => ({ name, count }));
  }

  function renderLocationSelectOptions() {
    if (!elements.locationFilterSelect) return;
    const userCity = state.userCity || "New York";
    const userCountry = state.userCountry || "United States";
    const isCustom = !!(state.quizAnswers.city || (state.currentUser && state.currentUser.city));
    const cleanUserCity = getCleanCity(userCity);
    const cityAreas = getAreasForCity(cleanUserCity);
    const cityMeetupCount = state.meetups.filter(m => 
      (m.location && m.location.toLowerCase().includes(cleanUserCity.toLowerCase())) ||
      (m.venueAddress && m.venueAddress.toLowerCase().includes(cleanUserCity.toLowerCase()))
    ).length;

    const fullLocationLabel = [userCity, state.userState, userCountry].filter(Boolean).join(", ");
    let html = `
      <optgroup label="Your Location (${escapeHTML(fullLocationLabel)})${isCustom ? ' · Questionnaire' : ' · Default'}">
        <option value="city:${escapeHTML(cleanUserCity)}">All ${escapeHTML(userCity)} (${cityMeetupCount} gathering${cityMeetupCount === 1 ? '' : 's'})</option>
    `;

    if (cityAreas.length > 0) {
      cityAreas.forEach(a => {
        html += `<option value="area:${escapeHTML(a.name)}">↳ ${escapeHTML(a.name)} (${a.count})</option>`;
      });
    }

    html += `</optgroup>`;

    elements.locationFilterSelect.innerHTML = html;

    // Synchronize select dropdown value with active state
    if (state.selectedArea && state.selectedArea !== "all") {
      elements.locationFilterSelect.value = "area:" + state.selectedArea;
    } else {
      elements.locationFilterSelect.value = "city:" + cleanUserCity;
    }
  }

  function renderCityAreaFilterBar() {
    if (!elements.cityAreaFilterBar) return;
    const userCity = state.userCity || "New York";
    const userCountry = state.userCountry || "United States";
    const isCustom = !!(state.quizAnswers.city || (state.currentUser && state.currentUser.city));
    const cleanCity = getCleanCity(userCity);
    const areas = getAreasForCity(cleanCity);
    const cityMeetupsCount = state.meetups.filter(m => 
      (m.location && m.location.toLowerCase().includes(cleanCity.toLowerCase())) ||
      (m.venueAddress && m.venueAddress.toLowerCase().includes(cleanCity.toLowerCase()))
    ).length;

    const fullLocationLabel = [userCity, state.userState, userCountry].filter(Boolean).join(", ");
    const headerHTML = `
      <div class="city-area-header">
        <div class="city-area-title-group">
          <span>📍 Gatherings in ${escapeHTML(fullLocationLabel)}</span>
          <span class="city-user-indicator">${isCustom ? '● Your City' : '● Default City'} · ${cityMeetupsCount} Gathering${cityMeetupsCount === 1 ? '' : 's'}</span>
        </div>
        <button type="button" class="btn-edit-quiz-city" id="btnEditQuizCity" title="Edit your country, state, and city in the 19 questionnaire">
          ✏️ ${isCustom ? 'Change City in Questionnaire' : 'Set Your City in Questionnaire'}
        </button>
      </div>
    `;

    let chipsHTML = "";
    if (areas.length > 0) {
      chipsHTML = `
        <div class="city-area-chips-wrapper">
          <span class="city-area-label">Areas & Neighborhoods:</span>
          <button type="button" class="area-chip ${state.selectedArea === 'all' ? 'active' : ''}" data-type="area" data-value="all">
            All ${escapeHTML(userCity)} <span class="area-count">${cityMeetupsCount}</span>
          </button>
      `;

      areas.forEach(a => {
        const isActive = state.selectedArea.toLowerCase() === a.name.toLowerCase();
        chipsHTML += `
          <button type="button" class="area-chip ${isActive ? 'active' : ''}" data-type="area" data-value="${escapeHTML(a.name)}">
            ${escapeHTML(a.name)} <span class="area-count">${a.count}</span>
          </button>
        `;
      });

      chipsHTML += `</div>`;
    } else if (cityMeetupsCount > 0) {
      chipsHTML = `
        <div class="city-area-chips-wrapper">
          <span class="city-area-label">Area:</span>
          <button type="button" class="area-chip active" data-type="area" data-value="all">
            All ${escapeHTML(userCity)} <span class="area-count">${cityMeetupsCount}</span>
          </button>
        </div>
      `;
    } else {
      chipsHTML = `
        <div class="city-empty-notice">
          <span>No gatherings currently scheduled in <strong>${escapeHTML(userCity)}</strong>.</span>
          <div class="city-empty-actions">
            <a href="#host-section" class="btn btn-primary btn-sm" style="padding: 4px 12px; font-size: 0.8rem;">
              + Host Gathering in ${escapeHTML(userCity)}
            </a>
          </div>
        </div>
      `;
    }

    elements.cityAreaFilterBar.innerHTML = headerHTML + chipsHTML;

    // Attach click listeners to chips
    elements.cityAreaFilterBar.querySelectorAll(".area-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const val = chip.getAttribute("data-value") || "all";
        state.selectedArea = val;
        renderLocationSelectOptions();
        renderCityAreaFilterBar();
        renderMeetups();
      });
    });

    const editQuizBtn = document.getElementById("btnEditQuizCity");
    if (editQuizBtn) {
      editQuizBtn.addEventListener("click", () => {
        state.drawerQuizStep = 5; // Step 6 is index 5 (Where are you based?)
        state.drawerQuizTab = "stepper";
        state.quizStep = 5;
        openQuizSideDrawer(5);
        showToast("Jumped to Step 6: Set your country, state, and city in the questionnaire!", "info");
        setTimeout(() => {
          const cityEl = document.getElementById("drawer_city");
          if (cityEl) {
            cityEl.focus();
          }
        }, 300);
      });
    }
  }

  function applyUserLocationFromQuiz(city, country, userState) {
    const clean = getCleanCity(city);
    state.userCity = city;
    state.userCountry = country || "";
    state.userState = userState || "";
    state.selectedCity = clean;
    state.selectedArea = "all";

    if (state.currentUser) {
      state.currentUser.city = city;
      state.currentUser.country = country;
      state.currentUser.state = userState || "";
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state.currentUser));
    }

    renderLocationSelectOptions();
    renderCityAreaFilterBar();
    renderMeetups();

    const areas = getAreasForCity(clean);
    const cityCount = state.meetups.filter(m => 
      (m.location && m.location.toLowerCase().includes(clean.toLowerCase())) ||
      (m.venueAddress && m.venueAddress.toLowerCase().includes(clean.toLowerCase()))
    ).length;

    if (cityCount > 0) {
      showToast(`📍 Location set to ${city}! Found ${cityCount} gathering${cityCount === 1 ? '' : 's'}${areas.length > 0 ? ' across ' + areas.length + ' areas' : ''}.`, "success");
    } else {
      showToast(`📍 Location set to ${city}. You can be the first to host a gathering here!`, "info");
    }
  }

  function resetFilters() {
    state.searchQuery = "";
    state.selectedDay = "all";
    state.selectedCity = getCleanCity(state.userCity) || "New York";
    state.selectedArea = "all";
    state.selectedTimeRange = "all";
    state.customTimeStart = null;
    state.customTimeEnd = null;
    state.selectedGroupSize = "all";

    if (elements.meetupSearchInput) elements.meetupSearchInput.value = "";
    if (elements.dayFilterSelect) elements.dayFilterSelect.value = "all";
    if (elements.timeFilterSelect) elements.timeFilterSelect.value = "all";
    if (elements.groupSizeFilterSelect) elements.groupSizeFilterSelect.value = "all";
    if (elements.customTimeRangeBar) elements.customTimeRangeBar.style.display = "none";
    if (elements.activeTimeWindowNotice) elements.activeTimeWindowNotice.style.display = "none";

    renderDaySelectOptions();
    renderLocationSelectOptions();
    renderCityAreaFilterBar();
    renderMeetups();
    showToast(`Filters reset to default (${state.userCity})`);
  }

  // --------------------------------------------------------------------------
  // Reservation Modal Flow (Directly from Wireframes)
  // --------------------------------------------------------------------------
  function openReservationModal(meetupId) {
    const meetup = state.meetups.find(m => m.id === meetupId);
    if (!meetup || !elements.reservationModal) return;

    state.currentModalMeetupId = meetupId;
    const isBooked = state.bookedIds.includes(meetupId);
    const endStatus = getMeetupEndStatus(meetupId);
    const isEndedOrPassed = isMeetupEndedOrPassed(meetup);

    // Host detection: strictly verified so only the actual host has host controls (no other members can end it)
    const isHost = isUserHostOfMeetup(meetup);

    const modalTitle = elements.reservationModal.querySelector("#modalMeetupTitle");
    const modalContent = elements.reservationModal.querySelector("#modalMeetupContent");
    const modalFooter = elements.reservationModal.querySelector("#modalMeetupFooter");

    const isSaved = isMeetupSaved(meetupId);

    if (modalTitle) {
      modalTitle.style.cssText = "flex: 1; min-width: 0; margin: 0; font-weight: normal;";
      modalTitle.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 6px; width: 100%;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding-right: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span class="meetup-tag" style="background: rgba(227, 210, 186, 0.14); color: var(--accent-gold); font-size: 0.72rem; padding: 3px 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid rgba(227, 210, 186, 0.28); border-radius: 6px;">
                👥 Meetup Group Page
              </span>
              ${isBooked ? `<span class="meetup-tag" style="background: var(--status-success-bg); color: var(--status-success); font-size: 0.72rem; padding: 3px 10px; font-weight: 600; border-radius: 6px;">✓ You're Attending</span>` : ''}
              ${!isBooked && isEndedOrPassed ? `<span class="meetup-tag" style="background: rgba(239, 68, 68, 0.16); color: #f87171; font-size: 0.72rem; padding: 3px 10px; font-weight: 600; border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.3);">🔒 Concluded · Booking Closed</span>` : ''}
              ${isHost ? `<span class="meetup-tag" style="background: rgba(227, 210, 186, 0.2); color: var(--accent-gold); font-size: 0.72rem; padding: 3px 10px; font-weight: 700; border-radius: 6px;">👑 Host</span>` : ''}
            </div>
            <div class="modal-header-actions" style="display: flex; align-items: center; gap: 8px;">
              <button 
                type="button" 
                class="btn-meetup-share-action" 
                data-id="${meetup.id}" 
                title="Share this meetup"
                aria-label="Share ${escapeHTML(meetup.title)}"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                <span>Share</span>
              </button>
              <button 
                type="button" 
                class="btn-symbolic-action btn-save-meetup-action ${isSaved ? 'is-saved' : ''}" 
                data-id="${meetup.id}" 
                aria-label="${isSaved ? 'Saved for later · Click to remove' : 'Save for later'}" 
                title="${isSaved ? 'Saved for later · Click to remove' : 'Save for later'}"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="${isSaved ? 'var(--accent-gold)' : 'none'}" stroke="${isSaved ? 'var(--accent-gold)' : 'currentColor'}" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
              <span class="meetup-code-pill modal-code-pill copy-meetup-code-btn" data-code="${escapeHTML(meetup.code || '')}" title="Click to copy Code: ${escapeHTML(meetup.code || '')}" style="margin: 0; font-size: 0.8rem; padding: 4px 10px; cursor: pointer;">
                <span class="code-prefix">Code:</span> <strong class="code-num">${escapeHTML(meetup.code || '')}</strong>
                <span class="code-copy-icon">📋</span>
              </span>
            </div>
          </div>
          <div style="font-size: 1.35rem; font-weight: 700; color: var(--cream-100); line-height: 1.3; letter-spacing: -0.01em;">
            ${escapeHTML(meetup.title)}
          </div>
        </div>
      `;
    }


    if (modalContent) {
      const gameConfig = (typeof getMeetupGameConfig === "function" ? getMeetupGameConfig(meetup) : null) || {
        badge: "In-Person Gathering Feature",
        icon: "🎲",
        title: "Meetup games",
        subtext: `When you reach the meetup at the café or venue, the host opens this page, clicks <strong style="color: var(--cream-100);">"Unlock the game"</strong>, and keeps their phone flat in the middle of the table. Everyone plays together directly from that phone!`,
        buttonBadge: "Table Mode",
        pills: ["🧭 360° Table Compass", "🔥 Hot Takes Poll", "🤫 2 Truths & Dream", "⚡ Rapid Fire", "✨ Deeper Stories"]
      };

      modalContent.innerHTML = `
        ${endStatus.isEnded ? `
          <div class="meetup-ended-countdown-banner ${endStatus.isFullyClosed ? 'concluded' : ''}">
            <div class="countdown-banner-left">
              <span class="countdown-pulse-icon">${endStatus.isFullyClosed ? '🔒' : '⏱️'}</span>
              <div class="countdown-text-group">
                <div class="countdown-title" style="${endStatus.isFullyClosed ? 'color: var(--status-error, #f87171);' : ''}">
                  ${endStatus.isFullyClosed ? 'Meetup Concluded · 3-Hour Window Expired' : 'Meetup Ended by Host · 3-Hour Wrap-Up Window'}
                </div>
                <div class="countdown-subtext">
                  ${endStatus.isFullyClosed 
                    ? 'The chat section and game section for this meetup have now ended.' 
                    : `Chat and table games will automatically conclude in <strong id="endedCountdownDisplay" style="color: var(--cream-100);">${formatRemainingTime(endStatus.remainingMs)}</strong>.`}
                </div>
              </div>
            </div>
            <div class="countdown-banner-actions">
              ${endStatus.isFullyClosed ? `
                <span class="countdown-timer-pill closed">🔒 Concluded</span>
              ` : `
                <span class="countdown-timer-pill" id="endedCountdownPill">
                  ⏳ <span id="endedCountdownLiveText">${formatRemainingTime(endStatus.remainingMs)}</span>
                </span>
                ${isHost ? `
                  <button type="button" class="btn btn-sm btn-fast-forward" id="btnFastForward3Hours" title="Fast-forward time 3 hours forward to preview closed chat & games">
                    ⚡ Fast-Forward 3 Hours (Demo)
                  </button>
                ` : ''}
              `}
            </div>
          </div>
        ` : ''}

        <div class="modal-event-hero">
          <img src="${meetup.image}" alt="${escapeHTML(meetup.imageAlt)}" class="modal-event-img" />
          <span class="meetup-time-badge" style="position: absolute; bottom: 14px; left: 14px; top: auto; background: rgba(14, 12, 10, 0.85); backdrop-filter: blur(8px); border: 1px solid rgba(227, 210, 186, 0.28); color: var(--cream-100); padding: 7px 14px; border-radius: 20px; font-weight: 600; font-size: 0.84rem; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
            <span>🗓️</span> ${escapeHTML(meetup.dateFormatted)} • <span>⏰</span> ${escapeHTML(meetup.time)}
          </span>
        </div>

        <div class="meetup-group-layout-grid">
          <!-- LEFT COLUMN: Gathering Details, Venue, Members & Policies -->
          <div class="meetup-group-col">
            <div class="modal-info-block">
          <div class="modal-info-row modal-venue-info-row" style="display: flex; align-items: flex-start; gap: 14px; position: relative;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cream-300)" stroke-width="2" style="flex-shrink: 0; margin-top: 3px;">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 220px;">
                  <strong style="color: var(--cream-100); font-size: 0.98rem; display: block; margin-bottom: 2px;">${escapeHTML(meetup.venueName)}</strong>
                  <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">${escapeHTML(meetup.venueAddress)}</div>
                  <div style="display: flex; align-items: center; gap: 12px; margin-top: 5px; flex-wrap: wrap;">
                    <a 
                      href="https://maps.google.com/?q=${encodeURIComponent(meetup.venueAddress)}" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style="color: var(--cream-200); font-size: 0.82rem; font-weight: 600; text-decoration: underline; display: inline-block;"
                    >
                      Open in Google Maps ↗
                    </a>
                    ${meetup.isVenueChanged ? `
                      <span class="meetup-tag" style="background: rgba(227, 210, 186, 0.15); color: var(--accent-gold); font-size: 0.7rem; padding: 2px 7px; border: 1px solid rgba(227, 210, 186, 0.3); border-radius: 4px;">
                        📍 Location Updated by Group
                      </span>
                    ` : ''}
                  </div>
                </div>

                <button 
                  type="button" 
                  class="btn btn-secondary btn-sm change-location-toggle-btn" 
                  id="changeLocationToggleBtn"
                  title="Change or suggest another location after discussing with fellow members"
                  style="padding: 5px 12px; font-size: 0.8rem; font-weight: 600; border-color: rgba(227, 210, 186, 0.35); color: var(--cream-100); display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span>Change Location</span>
                </button>
              </div>

              <!-- Collapsible Location Change Card -->
              <div class="venue-change-card" id="venueChangeCard" style="display: none; margin-top: 14px; background: rgba(20, 18, 16, 0.95); border: 1px solid var(--cream-border); border-radius: 10px; padding: 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 1.05rem;">📍</span>
                    <strong style="color: var(--cream-100); font-size: 0.92rem;">Change Gathering Spot</strong>
                  </div>
                  <span class="meetup-tag" style="background: rgba(227, 210, 186, 0.12); color: var(--accent-gold); font-size: 0.7rem; padding: 2px 7px;">
                    👥 Group Co-Decision
                  </span>
                </div>

                <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 12px;">
                  Members can discuss in Group Chat and agree on a different cafe, lounge, or park. Saving here updates the venue for everyone in this gathering and automatically posts an announcement in group chat.
                </p>

                <!-- Quick Preset Recommendations -->
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 0.75rem; color: var(--cream-300); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
                    💡 Popular alternative spots in ${escapeHTML(meetup.city || 'the area')}:
                  </div>
                  <div class="venue-quick-chips" style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${getVenueSuggestionsForMeetup(meetup).map(s => `
                      <button 
                        type="button" 
                        class="venue-suggestion-chip" 
                        data-name="${escapeHTML(s.name)}" 
                        data-address="${escapeHTML(s.address)}"
                        style="background: rgba(227, 210, 186, 0.08); border: 1px solid rgba(227, 210, 186, 0.2); border-radius: 6px; padding: 4px 9px; font-size: 0.76rem; color: var(--cream-100); text-align: left; cursor: pointer; transition: all 0.2s ease;"
                      >
                        ☕ ${escapeHTML(s.name)}
                      </button>
                    `).join("")}
                  </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                  <div>
                    <label style="display: block; font-size: 0.78rem; font-weight: 600; color: var(--cream-200); margin-bottom: 4px;">
                      Venue / Spot Name:
                    </label>
                    <input 
                      type="text" 
                      id="inputNewVenueName" 
                      class="form-control" 
                      value="${escapeHTML(meetup.venueName)}" 
                      placeholder="e.g. Ludlow Coffee Supply & Lounge"
                      style="width: 100%; font-size: 0.88rem; padding: 8px 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--cream-border); border-radius: 6px; color: var(--cream-100);"
                    />
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.78rem; font-weight: 600; color: var(--cream-200); margin-bottom: 4px;">
                      Full Address:
                    </label>
                    <input 
                      type="text" 
                      id="inputNewVenueAddress" 
                      class="form-control" 
                      value="${escapeHTML(meetup.venueAddress)}" 
                      placeholder="e.g. 176 Ludlow St, New York, NY 10002"
                      style="width: 100%; font-size: 0.88rem; padding: 8px 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--cream-border); border-radius: 6px; color: var(--cream-100);"
                    />
                  </div>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 14px; flex-wrap: wrap;">
                  <button 
                    type="button" 
                    class="btn-ghost btn-sm" 
                    id="discussVenueInChatBtn"
                    style="font-size: 0.8rem; color: var(--cream-300); text-decoration: underline; padding: 4px 6px;"
                  >
                    💬 Discuss in Chat First
                  </button>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <button 
                      type="button" 
                      class="btn btn-secondary btn-sm" 
                      id="cancelVenueChangeBtn"
                      style="font-size: 0.8rem; padding: 6px 12px;"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-primary btn-sm" 
                      id="saveVenueChangeBtn"
                      style="font-size: 0.8rem; padding: 6px 14px; font-weight: 600;"
                    >
                      Update Spot & Notify Group ➔
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div class="modal-info-row" style="margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cream-300)" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <strong style="color: var(--cream-100); font-size: 0.95rem; display: block; margin-bottom: 2px;">Gathering Atmosphere & Chemistry</strong>
              <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45;">
                ${escapeHTML(meetup.atmosphere)} (${(meetup.category === 'coffee' || meetup.category === 'dining') ? `Table of ${meetup.capacity} guests max · Intimate group chemistry` : (meetup.isEvent || meetup.category === 'event' ? `Open community event · up to ${meetup.capacity >= 100 ? '100+' : meetup.capacity} attendees` : `Active group · up to ${meetup.capacity >= 100 ? '100+' : meetup.capacity} participants`)})
              </div>
            </div>
          </div>

          <div class="modal-info-row" style="margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cream-300)" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; margin-bottom: 2px;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <strong style="color: var(--cream-100); font-size: 0.95rem;">Hosted by ${escapeHTML(meetup.isSurpriseMeetup ? "Outspire" : (meetup.host ? meetup.host.name : "Community Member"))}</strong>
                  <span class="meetup-tag" style="background: rgba(39, 174, 96, 0.14); color: #34d399; font-size: 0.7rem; padding: 2px 7px; font-weight: 600;">${meetup.isSurpriseMeetup ? '✓ Official Gathering' : '✓ Verified Host'}</span>
                  ${isHost ? `<span class="meetup-tag" style="background: rgba(227, 210, 186, 0.2); color: var(--accent-gold); font-size: 0.7rem; padding: 2px 7px; font-weight: 700;">👑 Host (You)</span>` : ''}
                </div>
              </div>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">${escapeHTML(meetup.isSurpriseMeetup ? "Official Outspire Team · Curated Surprise Table" : (meetup.host ? meetup.host.role : "Community Host"))}</div>
              ${meetup.isSurpriseMeetup ? `<div style="font-size: 0.82rem; color: var(--cream-200); margin-top: 4px;">✨ <strong>Outspire Note:</strong> Table is reserved under Outspire with your Meetup Code <strong>${escapeHTML(meetup.code || '')}</strong>. Mention your code to staff upon arrival to be seated with your table!</div>` : (meetup.hostVenueNotes ? `<div style="font-size: 0.82rem; color: var(--cream-200); margin-top: 4px;">📍 <strong>Spot Tip:</strong> ${escapeHTML(meetup.hostVenueNotes)}</div>` : '')}
            </div>
          </div>
        </div>

        <h4 style="font-size: 1.05rem; margin-bottom: 8px; color: var(--cream-100);">About This Gathering</h4>
        <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">
          ${escapeHTML(meetup.description)}
        </p>

        <h4 style="font-size: 1.05rem; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
          <span style="color: var(--cream-100);">Attending Members (${meetup.members.length + (isBooked ? 1 : 0)} / ${meetup.capacity >= 100 ? '100+' : meetup.capacity})</span>
          <span style="font-size: 0.8rem; color: var(--cream-300); font-weight: normal;">No strangers for long</span>
        </h4>

        <div class="modal-members-list">
          ${isBooked ? `
            <div class="modal-member-item" style="border: 1px solid var(--cream-300); background: rgba(227, 210, 186, 0.1);">
              <div class="modal-member-info">
                ${meetup.isSurpriseMeetup ? `
                  <div class="surprise-member-avatar surprise-mystery-avatar" style="width: 38px; height: 38px; border-radius: 50%; border-color: var(--status-success); color: #34d399; background: rgba(116, 198, 157, 0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                ` : `
                  <img src="${PROFILES_DATA.tom_cruise16.avatar}" alt="You" />
                `}
                <div>
                  <strong style="color: var(--cream-100);">You (Reserved)</strong>
                  <div style="font-size: 0.78rem; color: var(--status-success);">${(meetup.category === 'coffee' || meetup.category === 'dining') ? 'Confirmed Guest · Seat Locked' : 'Confirmed Attendee · Spot Locked'}</div>
                </div>
              </div>
              <span class="meetup-tag" style="background: var(--status-success-bg); color: var(--status-success);">${(meetup.category === 'coffee' || meetup.category === 'dining') ? 'Your Table' : (meetup.isEvent || meetup.category === 'event' ? 'Registered' : 'Attending')}</span>
            </div>
          ` : ''}
          ${meetup.members.filter(member => !(isBooked && (member.isSelf || (member.name && member.name.includes('(You)'))))).map(member => `
            <div class="modal-member-item">
              <div class="modal-member-info">
                ${meetup.isSurpriseMeetup ? `
                  <div class="surprise-member-avatar surprise-mystery-avatar" style="width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;" title="${escapeHTML(member.name)} (Photo hidden for surprise meetup)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                ` : `
                  <img src="${member.avatar}" alt="${escapeHTML(member.name)}" />
                `}
                <div>
                  <strong style="color: var(--cream-100);">${escapeHTML(member.name)}</strong>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${escapeHTML(member.bio ? member.bio.slice(0, 50) : '')}...</div>
                </div>
              </div>
              ${meetup.isSurpriseMeetup ? `
                <span class="meetup-tag" style="background: rgba(227, 210, 186, 0.1); color: var(--cream-300); font-size: 0.72rem;">🔒 Photo Hidden</span>
              ` : `
                <button class="btn-ghost btn-sm view-profile-inline" data-profile="${member.name}" style="font-size: 0.78rem;">
                  View
                </button>
              `}
            </div>
          `).join("")}
        </div>

        ${isBooked ? `
          <div class="safe-departure-card" style="margin-top: 4px; background: rgba(39, 174, 96, 0.08); border: 1px solid rgba(39, 174, 96, 0.3); border-radius: var(--radius-md); padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(39, 174, 96, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                🛡️
              </div>
              <div>
                <strong style="color: var(--cream-100); font-size: 0.92rem; display: block;">Safe Departure Check-In</strong>
                <div style="font-size: 0.78rem; color: var(--cream-300); margin-top: 2px;" id="departureStatusText">
                  ${state.departedMeetups.includes(meetupId) 
                    ? '✅ You confirmed your safe departure from this meetup.' 
                    : 'When the meetup ends, confirm below that you have safely departed the venue.'}
                </div>
              </div>
            </div>
            <button class="btn btn-sm ${state.departedMeetups.includes(meetupId) ? 'btn-secondary' : 'btn-primary'}" id="confirmDepartureBtn" style="font-size: 0.82rem; padding: 6px 14px;" ${state.departedMeetups.includes(meetupId) ? 'disabled' : ''}>
              ${state.departedMeetups.includes(meetupId) ? '✓ Safely Departed' : 'I Have Safely Departed'}
            </button>
          </div>
        ` : ''}

        <div class="cancellation-notice" style="margin-top: 4px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>If you want to cancel it, you can do it till <strong style="color: var(--cream-100);">3 hours before meetup</strong> without penalty.</span>
        </div>

        <!-- Host Gathering Controls: "End meetup" (Host Only) -->
        ${isHost ? `
          <div class="modal-host-controls-card" id="hostMeetupControlsCard" style="margin-top: 4px;">
            <div class="host-controls-header">
              <div class="host-controls-title">
                <span class="host-badge-icon">👑</span>
                <div>
                  <strong style="color: var(--cream-100); font-size: 0.95rem;">Host Gathering Controls</strong>
                  <div style="font-size: 0.78rem; color: var(--text-secondary);">Visible only to you as the host of this meetup</div>
                </div>
              </div>
              <span class="meetup-tag" style="background: rgba(227, 210, 186, 0.15); color: var(--accent-gold); font-size: 0.72rem; padding: 2px 8px; font-weight: 700;">
                Host Only
              </span>
            </div>

            <p class="host-controls-desc">
              When your gathering has wrapped up, click <strong>"End meetup"</strong> below. Group members will have a 3-hour wrap-up window, after which the chat section and game section will automatically close.
            </p>

            <div class="host-controls-action-row">
              ${endStatus.isEnded ? `
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: ${endStatus.isFullyClosed ? 'var(--status-error, #f87171)' : 'var(--accent-gold)'}; font-weight: 600; font-size: 0.88rem;">
                    ${endStatus.isFullyClosed ? '🔒 Meetup Fully Concluded (Chat & Games Ended)' : `⏱️ Ending in progress (${formatRemainingTime(endStatus.remainingMs)} remaining)`}
                  </span>
                </div>
              ` : `
                <button type="button" class="btn btn-end-meetup" id="btnHostEndMeetup">
                  <span style="font-size: 1rem;">🏁</span>
                  <span>End meetup</span>
                </button>
                <span style="font-size: 0.78rem; color: var(--text-muted); margin-left: 8px;">
                  Starts 3-hour timer to conclude chat & table games
                </span>
              `}
            </div>
          </div>
        ` : ''}
          </div> <!-- Close Left Column .meetup-group-col -->

          <!-- RIGHT COLUMN: Group Member Chat & Table Games -->
          <div class="meetup-group-col">
            <!-- Group Member Chat Section -->
            ${endStatus.isFullyClosed ? `
              <div class="modal-group-chat-card" id="modalGroupChatCard" style="border-color: rgba(239, 68, 68, 0.35);">
                <div class="modal-chat-header" style="background: rgba(239, 68, 68, 0.08);">
                  <div class="modal-chat-header-title">
                    <span style="font-size: 0.95rem;">🔒</span>
                    <strong style="color: var(--cream-100); font-size: 0.95rem;">Group Member Chat</strong>
                    <span class="meetup-tag" style="background: rgba(239, 68, 68, 0.2); color: #f87171; font-size: 0.7rem; padding: 2px 7px; font-weight: 700;">
                      Chat Ended (3h expired)
                    </span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">
                    Read-Only Archive (${meetup.members.length + (isBooked ? 1 : 0)} Members)
                  </div>
                </div>

                <div class="modal-chat-stream" id="modalChatStream" style="min-height: 180px; max-height: 280px;">
                  <!-- Messages rendered dynamically by renderModalInlineChat -->
                </div>

                <div class="chat-closed-input-bar" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                  <span style="font-size: 1.15rem;">🔒</span>
                  <div>
                    <strong style="color: var(--cream-100); font-size: 0.88rem;">Chat section ended for this meetup</strong>
                    <div style="font-size: 0.76rem; color: var(--text-muted);">3 hours have elapsed since the meetup ended. Messages are preserved in read-only mode.</div>
                  </div>
                </div>
              </div>
            ` : `
              <div class="modal-group-chat-card" id="modalGroupChatCard">
                <div class="modal-chat-header">
                  <div class="modal-chat-header-title">
                    <span class="modal-chat-live-dot"></span>
                    <strong style="color: var(--cream-100); font-size: 0.95rem;">Group Member Chat</strong>
                    <span class="meetup-tag" style="background: rgba(39, 174, 96, 0.15); color: #34d399; font-size: 0.7rem; padding: 2px 7px; font-weight: 600;">
                      ● Live Circle
                    </span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--cream-300);">
                    ${meetup.members.length + (isBooked ? 1 : 0)} Attending Members
                  </div>
                </div>

                <div class="modal-chat-stream" id="modalChatStream" style="min-height: 180px; max-height: 280px;">
                  <!-- Messages rendered dynamically by renderModalInlineChat -->
                </div>

                <div class="modal-chat-quick-chips">
                  <span class="modal-chat-chip-btn" data-text="👋 Hey everyone, so excited for this meetup!">👋 Say Hello</span>
                  <span class="modal-chat-chip-btn" data-text="📍 Looking forward to meeting you all at ${escapeHTML(meetup.venueName)}!">📍 Confirm Spot</span>
                  <span class="modal-chat-chip-btn" data-text="💬 Hey everyone, what do you think about changing our meeting spot?">📍 Discuss Location</span>
                  <span class="modal-chat-chip-btn" data-text="⏰ I'll be arriving right on time!">⏰ On-Time</span>
                  <span class="modal-chat-chip-btn" data-text="🥐 Anyone have favorite menu tips or recommendations?">🥐 Menu Tips</span>
                </div>

                <form class="modal-chat-input-bar" id="modalInlineChatForm">
                  <input 
                    type="text" 
                    id="modalInlineChatInput" 
                    placeholder="${isBooked ? 'Message your group members...' : `Say hello to ${meetup.members[0] ? escapeHTML(meetup.members[0].name.split(' ')[0]) : 'the table'} & group members...`}" 
                    autocomplete="off"
                  />
                  <button type="submit" class="btn btn-primary btn-sm" style="padding: 7px 16px;">
                    <span>Send</span> ➔
                  </button>
                </form>
              </div>
            `}

            <!-- Portioned: "Meetup games" section -->
            ${endStatus.isFullyClosed ? `
              <div class="games-ended-card">
                <div class="games-ended-badge">
                  <span>🔒</span> Session Concluded
                </div>
                <div style="display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 8px;">
                  <div style="font-size: 2rem; opacity: 0.5;">🎲</div>
                  <div style="text-align: left;">
                    <h4 style="color: var(--cream-200); margin: 0 0 4px 0; font-size: 1.02rem;">Meetup Games Ended</h4>
                    <p style="margin: 0; font-size: 0.84rem; color: var(--text-muted); line-height: 1.45;">
                      Table games for this gathering have concluded following the 3-hour post-meetup window.
                    </p>
                  </div>
                </div>
              </div>
            ` : `
              <div class="meetup-games-section-card">
                <div class="games-card-top">
                  <div class="games-badge-tag">
                    <span class="pulse-dot"></span> ${escapeHTML(gameConfig.badge)}
                  </div>
                  <div class="games-header-row">
                    <div class="games-icon-circle">${gameConfig.icon || '🎲'}</div>
                    <div class="games-text-group">
                      <h4 class="games-section-heading">${escapeHTML(gameConfig.title)}</h4>
                      <p class="games-section-subtext">
                        ${gameConfig.subtext}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="games-unlock-box">
                  <button class="btn btn-unlock-game" id="unlockMeetupGameBtn" data-id="${meetup.id}">
                    <span class="unlock-btn-icon">🔓</span>
                    <span>Unlock the game</span>
                    <span class="unlock-btn-badge">${escapeHTML(gameConfig.buttonBadge)}</span>
                  </button>
                  <div class="games-preview-pills">
                    ${gameConfig.pills.map(p => `<span>${escapeHTML(p)}</span>`).join("")}
                  </div>
                </div>
              </div>
            `}
          </div> <!-- Close Right Column .meetup-group-col -->
        </div> <!-- Close .meetup-group-layout-grid -->
      `;
    }

    if (modalFooter) {
      if (isBooked) {
        modalFooter.innerHTML = `
          ${endStatus.isFullyClosed ? `
            <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.6; cursor: not-allowed;">
              <span style="font-size: 1rem;">🔒</span> Games Ended
            </button>
            <button class="btn btn-secondary btn-sm" id="openChatFromModalBtn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Chat (Read-Only)
            </button>
          ` : `
            <button class="btn btn-primary btn-sm" id="unlockGamesModalFooterBtn">
              <span style="font-size: 1.05rem;">🎲</span> Unlock the game
            </button>
            <button class="btn btn-secondary btn-sm" id="openChatFromModalBtn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Group Chat
            </button>
          `}
          <button class="btn btn-danger btn-sm" id="triggerCancelBtn">Cancel</button>
          <button class="btn btn-secondary btn-sm" id="closeModalSuccessBtn">Done</button>
        `;

        const cancelBtn = modalFooter.querySelector("#triggerCancelBtn");
        if (cancelBtn) {
          cancelBtn.addEventListener("click", () => openCancelConfirm(meetupId));
        }

        const chatBtn = modalFooter.querySelector("#openChatFromModalBtn");
        if (chatBtn) {
          chatBtn.addEventListener("click", () => {
            closeReservationModal();
            openChatDrawer(meetupId);
          });
        }

        const footerUnlockBtn = modalFooter.querySelector("#unlockGamesModalFooterBtn");
        if (footerUnlockBtn) {
          footerUnlockBtn.addEventListener("click", () => {
            openMeetupGamesModal(meetupId);
          });
        }

        const departureBtn = modalContent.querySelector("#confirmDepartureBtn");
        if (departureBtn) {
          departureBtn.addEventListener("click", () => {
            if (!state.departedMeetups.includes(meetupId)) {
              state.departedMeetups.push(meetupId);
              localStorage.setItem("outspire_departed_meetups", JSON.stringify(state.departedMeetups));
              departureBtn.textContent = "✓ Safely Departed";
              departureBtn.disabled = true;
              departureBtn.className = "btn btn-sm btn-secondary";
              const statusText = modalContent.querySelector("#departureStatusText");
              if (statusText) statusText.textContent = "✅ You confirmed your safe departure from this meetup.";
              showToast("🛡️ Safe departure confirmed! Your group and host know you moved out safely.", "success");
            }
          });
        }

        const doneBtn = modalFooter.querySelector("#closeModalSuccessBtn");
        if (doneBtn) doneBtn.addEventListener("click", closeReservationModal);

      } else {
        const isEndedOrPassed = isMeetupEndedOrPassed(meetup);

        if (isEndedOrPassed) {
          modalFooter.innerHTML = `
            <div style="margin-right: auto; font-size: 0.88rem; color: #f87171; font-weight: 600;">
              🔒 Gathering has started or ended (Public Booking Closed)
            </div>
            <button class="btn btn-secondary btn-sm" id="modalDismissBtn">Close</button>
            <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.6; cursor: not-allowed;">
              Booking Closed
            </button>
          `;
          const dismissBtn = modalFooter.querySelector("#modalDismissBtn");
          if (dismissBtn) dismissBtn.addEventListener("click", closeReservationModal);
        } else {
          const isEvent = meetup.isEvent || meetup.category === 'event';
          const confirmBtnLabel = isEvent ? 'Confirm & Join Event' : 'Confirm & Join Meetup';

          modalFooter.innerHTML = `
            <div style="margin-right: auto; font-size: 0.9rem;">
              <span style="color: var(--text-muted);">Amount:</span> 
              <strong style="color: var(--status-success); font-size: 1.1rem; margin-left: 4px;">Free</strong>
            </div>
            <button class="btn btn-secondary btn-sm" id="modalDismissBtn">Back to Home</button>
            <button class="btn btn-primary btn-sm" id="confirmReservationBtn">
              ${confirmBtnLabel}
            </button>
          `;

          const dismissBtn = modalFooter.querySelector("#modalDismissBtn");
          if (dismissBtn) dismissBtn.addEventListener("click", closeReservationModal);

          const confirmBtn = modalFooter.querySelector("#confirmReservationBtn");
          if (confirmBtn) {
            confirmBtn.addEventListener("click", () => showConfirmReservationStep(meetupId));
          }
        }
      }
    }

    // Attach unlock game button inside modal body
    const bodyUnlockBtn = modalContent.querySelector("#unlockMeetupGameBtn");
    if (bodyUnlockBtn) {
      bodyUnlockBtn.addEventListener("click", () => {
        openMeetupGamesModal(meetupId);
      });
    }

    // Attach inline profile buttons
    modalContent.querySelectorAll(".view-profile-inline").forEach(btn => {
      btn.addEventListener("click", () => openProfileModal("tom_cruise16"));
    });

    // Render and initialize group chat inside modal
    renderModalInlineChat(meetupId);

    const inlineChatForm = modalContent.querySelector("#modalInlineChatForm");
    const inlineChatInput = modalContent.querySelector("#modalInlineChatInput");
    if (inlineChatForm && inlineChatInput) {
      inlineChatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = inlineChatInput.value.trim();
        if (!text) return;
        inlineChatInput.value = "";
        
        sendChatMessage(text, meetupId);

        if (!state.bookedIds.includes(meetupId)) {
          state.bookedIds.push(meetupId);
          saveBookings();
          renderMeetups();
          showToast("🎉 Seat confirmed & your message was shared with group members!", "success");
          openReservationModal(meetupId);
        } else {
          showToast("💬 Message sent to group members!", "info");
        }
      });
    }

    // Quick starter chips
    modalContent.querySelectorAll(".modal-chat-chip-btn").forEach(chip => {
      chip.addEventListener("click", () => {
        const text = chip.getAttribute("data-text");
        if (text && inlineChatInput) {
          inlineChatInput.value = text;
          inlineChatInput.focus();
        }
      });
    });

    // Venue / Location Change Handlers
    const changeLocToggleBtn = modalContent.querySelector("#changeLocationToggleBtn");
    const venueChangeCard = modalContent.querySelector("#venueChangeCard");
    const venueNameInput = modalContent.querySelector("#inputNewVenueName");
    const venueAddressInput = modalContent.querySelector("#inputNewVenueAddress");
    const cancelVenueBtn = modalContent.querySelector("#cancelVenueChangeBtn");
    const saveVenueBtn = modalContent.querySelector("#saveVenueChangeBtn");
    const discussChatBtn = modalContent.querySelector("#discussVenueInChatBtn");

    if (changeLocToggleBtn && venueChangeCard) {
      changeLocToggleBtn.addEventListener("click", () => {
        const isHidden = venueChangeCard.style.display === "none";
        venueChangeCard.style.display = isHidden ? "block" : "none";
        if (isHidden) {
          changeLocToggleBtn.innerHTML = `✕ Close`;
          if (venueNameInput) {
            venueNameInput.focus();
            venueNameInput.select();
          }
        } else {
          changeLocToggleBtn.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <span>Change Location</span>
          `;
        }
      });
    }

    if (cancelVenueBtn && venueChangeCard) {
      cancelVenueBtn.addEventListener("click", () => {
        venueChangeCard.style.display = "none";
        if (changeLocToggleBtn) {
          changeLocToggleBtn.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <span>Change Location</span>
          `;
        }
      });
    }

    // Quick suggestion chips
    modalContent.querySelectorAll(".venue-suggestion-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const name = chip.getAttribute("data-name");
        const addr = chip.getAttribute("data-address");
        if (venueNameInput && name) venueNameInput.value = name;
        if (venueAddressInput && addr) venueAddressInput.value = addr;
        modalContent.querySelectorAll(".venue-suggestion-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
      });
    });

    // Discuss in Chat First button
    if (discussChatBtn) {
      discussChatBtn.addEventListener("click", () => {
        const chatCard = modalContent.querySelector("#modalGroupChatCard");
        if (chatCard) {
          chatCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        if (inlineChatInput) {
          const proposedSpot = venueNameInput && venueNameInput.value.trim() ? venueNameInput.value.trim() : "a different spot";
          inlineChatInput.value = `Hey everyone! What do you think about changing our meeting spot to ${proposedSpot}?`;
          inlineChatInput.focus();
        }
      });
    }

    // Save Location Change
    if (saveVenueBtn) {
      saveVenueBtn.addEventListener("click", () => {
        const newName = venueNameInput ? venueNameInput.value.trim() : "";
        const newAddr = venueAddressInput ? venueAddressInput.value.trim() : "";
        if (!newName) {
          showToast("Please enter a venue or cafe name.", "warning");
          if (venueNameInput) venueNameInput.focus();
          return;
        }
        if (!newAddr) {
          showToast("Please enter the venue address.", "warning");
          if (venueAddressInput) venueAddressInput.focus();
          return;
        }

        const oldVenueName = meetup.venueName;
        meetup.venueName = newName;
        meetup.venueAddress = newAddr;
        meetup.isVenueChanged = true;
        meetup.mapQuery = encodeURIComponent(`${newName} ${newAddr}`);

        // Persist to localStorage
        saveCustomVenue(meetupId, newName, newAddr);

        // Auto-book user if not booked yet so they are part of the gathering
        if (!state.bookedIds.includes(meetupId)) {
          state.bookedIds.push(meetupId);
          saveBookings();
        }

        // Add official notice to group chat
        if (!state.chatMessages[meetupId]) {
          state.chatMessages[meetupId] = generateFallbackChatMessages(meetup);
        }
        const systemNotice = {
          sender: "Outspire Concierge",
          avatar: OUTSPIRE_CONCIERGE_AVATAR,
          time: "Just now",
          text: `📍 Location Updated: The gathering location has been moved from "${oldVenueName}" to "${newName}" (${newAddr}) following group discussion. Google Maps link and meetup details have been updated for all members!`
        };
        state.chatMessages[meetupId].push(systemNotice);

        // Friendly attendee affirmation reply after 900ms
        setTimeout(() => {
          const responder = (meetup.members && meetup.members[0]) ? meetup.members[0].name : "Elena";
          const responderAvatar = meetup.isSurpriseMeetup ? MYSTERY_AVATAR : ((meetup.members && meetup.members[0]) ? meetup.members[0].avatar : "");
          state.chatMessages[meetupId].push({
            sender: responder,
            avatar: responderAvatar,
            time: "Just now",
            text: `Sounds wonderful! "${newName}" is an awesome spot. Thanks for updating it!`
          });
          renderModalInlineChat(meetupId);
          renderChatMessages(meetupId);
        }, 900);

        // Re-render modal in place and update cards
        renderMeetups();
        openReservationModal(meetupId);
        showToast(`📍 Meetup location updated to "${newName}" and shared in Group Chat!`, "success");
      });
    }

    // Host-Only "End meetup" button handler (only host can end the meetup)
    const hostEndMeetupBtn = modalContent.querySelector("#btnHostEndMeetup");
    if (hostEndMeetupBtn) {
      hostEndMeetupBtn.addEventListener("click", () => {
        if (!isHost) {
          showToast("Only the host can end this meetup.", "warning");
          return;
        }
        const confirmed = confirm("Are you sure you want to end this meetup?\n\nOnce ended, a 3-hour wrap-up window begins. After 3 hours, the chat section and game section will automatically close.");
        if (!confirmed) return;

        if (!state.endedMeetups) state.endedMeetups = {};
        state.endedMeetups[meetupId] = {
          endedAt: Date.now(),
          endedBy: (state.currentUser && state.currentUser.name) || (meetup.host ? meetup.host.name : "Host"),
          fastForwarded: false
        };
        localStorage.setItem(STORAGE_KEY_ENDED_MEETUPS, JSON.stringify(state.endedMeetups));

        // Post announcement into group chat
        if (!state.chatMessages[meetupId]) {
          state.chatMessages[meetupId] = generateFallbackChatMessages(meetup);
        }
        state.chatMessages[meetupId].push({
          sender: "Outspire Concierge",
          avatar: OUTSPIRE_CONCIERGE_AVATAR,
          time: "Just now",
          text: `🏁 Meetup Ended: The host has officially ended this meetup! A 3-hour wrap-up window has started. Please exchange any contacts or final messages before the chat and games close.`
        });

        showToast("🏁 Meetup marked as ended! 3-hour countdown started.", "info");
        renderMeetups();
        openReservationModal(meetupId);
      });
    }

    // Demo button: Fast-forward 3 hours to immediately trigger the conclusion of chat and games (Host only)
    const fastForwardBtn = modalContent.querySelector("#btnFastForward3Hours");
    if (fastForwardBtn) {
      fastForwardBtn.addEventListener("click", () => {
        if (!isHost) return;
        if (!state.endedMeetups) state.endedMeetups = {};
        if (!state.endedMeetups[meetupId]) {
          state.endedMeetups[meetupId] = {
            endedAt: Date.now() - THREE_HOURS_MS - 1000,
            endedBy: (meetup.host ? meetup.host.name : "Host"),
            fastForwarded: true
          };
        } else {
          state.endedMeetups[meetupId].fastForwarded = true;
          state.endedMeetups[meetupId].endedAt = Date.now() - THREE_HOURS_MS - 1000;
        }
        localStorage.setItem(STORAGE_KEY_ENDED_MEETUPS, JSON.stringify(state.endedMeetups));
        showToast("⚡ Fast-forwarded 3 hours! Chat section and game section have ended.", "warning");
        renderMeetups();
        openReservationModal(meetupId);
      });
    }

    // Live countdown timer for the 3-hour wrap-up window
    clearInterval(window.meetupCountdownInterval);
    if (endStatus.isEnded && !endStatus.isFullyClosed) {
      window.meetupCountdownInterval = setInterval(() => {
        const curStatus = getMeetupEndStatus(meetupId);
        if (curStatus.isFullyClosed) {
          clearInterval(window.meetupCountdownInterval);
          openReservationModal(meetupId);
          return;
        }
        const disp = modalContent.querySelector("#endedCountdownDisplay");
        const liveText = modalContent.querySelector("#endedCountdownLiveText");
        const formatted = formatRemainingTime(curStatus.remainingMs);
        if (disp) disp.textContent = formatted;
        if (liveText) liveText.textContent = formatted;
      }, 1000);
    }

    if (elements.reservationModal) {
      if (!elements.reservationModal.open) {
        try {
          elements.reservationModal.showModal();
        } catch (e) {
          elements.reservationModal.setAttribute("open", "");
        }
      }
      elements.reservationModal.scrollTop = 0;
    }
  }

  function showConfirmReservationStep(meetupId) {
    const meetup = state.meetups.find(m => m.id === meetupId);
    if (!meetup || !elements.reservationModal) return;

    if (isMeetupEndedOrPassed(meetup)) {
      showToast("⚠️ Booking is closed because this gathering has already started or concluded.", "warning");
      return;
    }

    const win = typeof calculate4DayBookingWindow === "function" ? calculate4DayBookingWindow() : null;
    if (win && meetup.dateStr && (meetup.dateStr < win.startDateStr || meetup.dateStr > win.endDateStr)) {
      showToast("Bookings are strictly open for the next 4 days only.", "warning");
      return;
    }

    const modalTitle = elements.reservationModal.querySelector("#modalMeetupTitle");
    const modalContent = elements.reservationModal.querySelector("#modalMeetupContent");
    const modalFooter = elements.reservationModal.querySelector("#modalMeetupFooter");

    if (modalTitle) {
      modalTitle.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; width: 100%;">
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="meetup-tag" style="background: rgba(227, 210, 186, 0.14); color: var(--accent-gold); font-size: 0.72rem; padding: 2px 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid rgba(227, 210, 186, 0.25);">
                Review & Confirm
              </span>
            </div>
            <span style="font-size: 1.25rem; font-weight: 700; color: var(--cream-100);">Confirm Reservation</span>
          </div>
          <span class="meetup-code-pill modal-code-pill copy-meetup-code-btn" data-code="${escapeHTML(meetup.code || '')}" title="Click to copy Code: ${escapeHTML(meetup.code || '')}">
            <span class="code-prefix">Code:</span> <span class="code-num">${escapeHTML(meetup.code || '')}</span>
            <span class="code-copy-icon">📋</span>
          </span>
        </div>
      `;
    }

    if (modalContent) {
      modalContent.scrollTop = 0;
      modalContent.innerHTML = `
        <div class="confirm-reservation-view">
          <div style="text-align: center; margin-bottom: 22px; padding: 6px 0;">
            <div class="confirm-header-icon" style="width: 58px; height: 58px; border-radius: 50%; background: rgba(227, 210, 186, 0.15); border: 2px solid var(--cream-300); color: var(--cream-100); display: inline-flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 12px; box-shadow: 0 0 20px rgba(227, 210, 186, 0.2);">
              🎟️
            </div>
            <h3 style="font-size: 1.4rem; color: var(--cream-100); margin-bottom: 6px; font-weight: 700;">
              Confirm Reservation
            </h3>
            <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto; line-height: 1.5;">
              Please review your gathering details before locking in your reservation.
            </p>
          </div>

          <div class="confirm-summary-card">
            <div class="confirm-meetup-row">
              <img src="${meetup.image}" alt="${escapeHTML(meetup.imageAlt || meetup.title)}" class="confirm-meetup-thumb" />
              <div style="flex-grow: 1; min-width: 0;">
                <span class="meetup-tag" style="background: rgba(227, 210, 186, 0.12); color: var(--cream-200); font-size: 0.72rem; padding: 2px 8px; font-weight: 600; text-transform: uppercase;">
                  ${escapeHTML(meetup.category || 'Meetup')}
                </span>
                <h4 style="font-size: 1.1rem; color: var(--cream-100); margin: 4px 0 3px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${escapeHTML(meetup.title)}
                </h4>
                <div style="font-size: 0.82rem; color: var(--text-secondary);">
                  Hosted by <strong style="color: var(--cream-200);">${escapeHTML(meetup.isSurpriseMeetup ? 'Outspire' : (meetup.host ? meetup.host.name : 'Community Host'))}</strong>
                </div>
              </div>
            </div>

            <div class="confirm-grid">
              <div class="confirm-grid-item">
                <span class="confirm-grid-icon">🗓️</span>
                <div>
                  <div class="confirm-grid-label">Date & Time</div>
                  <div class="confirm-grid-val">${escapeHTML(meetup.dateFormatted)} • ${escapeHTML(meetup.time)}</div>
                </div>
              </div>

              <div class="confirm-grid-item">
                <span class="confirm-grid-icon">📍</span>
                <div>
                  <div class="confirm-grid-label">Location & Venue</div>
                  <div class="confirm-grid-val">${escapeHTML(meetup.venueName)}</div>
                  <div style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.3;">${escapeHTML(meetup.venueAddress)}</div>
                </div>
              </div>

              <div class="confirm-grid-item">
                <span class="confirm-grid-icon">👤</span>
                <div>
                  <div class="confirm-grid-label">Reserved For</div>
                  <div class="confirm-grid-val">${escapeHTML(PROFILES_DATA.tom_cruise16.name)} (You)</div>
                </div>
              </div>

              <div class="confirm-grid-item">
                <span class="confirm-grid-icon">💳</span>
                <div>
                  <div class="confirm-grid-label">Reservation Amount</div>
                  <div class="confirm-grid-val" style="color: var(--status-success);">Free ($0.00)</div>
                </div>
              </div>
            </div>
          </div>

          <div class="confirm-commitment-card">
            <span style="font-size: 1.25rem; line-height: 1;">🤝</span>
            <div style="font-size: 0.85rem; color: var(--cream-200); line-height: 1.5;">
              <strong style="color: var(--cream-100); display: block; margin-bottom: 2px;">Community Attendance Commitment</strong>
              Table seats are limited to keep gatherings personal and engaging. By clicking <strong>Confirm Reservation</strong> below, you reserve your seat at the table and commit to meeting your group members on time.
            </div>
          </div>

          <div class="cancellation-notice" style="margin-top: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>If plans change, cancel anytime up to <strong style="color: var(--cream-100);">3 hours before meetup</strong> without penalty.</span>
          </div>
        </div>
      `;
    }

    if (modalFooter) {
      modalFooter.innerHTML = `
        <div style="margin-right: auto; font-size: 0.9rem; display: flex; align-items: center; gap: 6px;">
          <span style="color: var(--text-muted);">Amount:</span> 
          <strong style="color: var(--status-success); font-size: 1.1rem;">Free</strong>
        </div>
        <button class="btn btn-secondary btn-sm" id="cancelConfirmStepBtn">
          ← Back to Details
        </button>
        <button class="btn btn-primary btn-sm" id="executeReservationBtn" style="padding: 8px 22px; font-weight: 700;">
          Confirm Reservation ✓
        </button>
      `;

      const backBtn = modalFooter.querySelector("#cancelConfirmStepBtn");
      if (backBtn) {
        backBtn.addEventListener("click", () => {
          openReservationModal(meetupId);
        });
      }

      const executeBtn = modalFooter.querySelector("#executeReservationBtn");
      if (executeBtn) {
        executeBtn.addEventListener("click", () => {
          handleConfirmReservation(meetupId);
        });
      }
    }
  }

  function handleConfirmReservation(meetupId) {
    const meetup = state.meetups.find(m => m.id === meetupId);
    if (!meetup) return;

    if (isMeetupEndedOrPassed(meetup)) {
      showToast("⚠️ Booking is closed because this gathering has already started or concluded.", "warning");
      return;
    }

    const win = typeof calculate4DayBookingWindow === "function" ? calculate4DayBookingWindow() : null;
    if (win && meetup.dateStr && (meetup.dateStr < win.startDateStr || meetup.dateStr > win.endDateStr)) {
      showToast("Bookings are strictly open for the next 4 days only.", "warning");
      return;
    }

    if (!state.bookedIds) state.bookedIds = [];
    state.bookedIds = [meetupId, ...state.bookedIds.filter(id => id !== meetupId)];
    saveBookings();

    if (!state.joinedHistoryIds) state.joinedHistoryIds = [];
    state.joinedHistoryIds = [meetupId, ...state.joinedHistoryIds.filter(id => id !== meetupId)];

    if (state.deletedHistoryIds) {
      state.deletedHistoryIds = state.deletedHistoryIds.filter(id => String(id) !== String(meetupId));
    }
    recordHistoryTimestamp(meetupId);
    saveHistoryState();

    const modalTitle = elements.reservationModal.querySelector("#modalMeetupTitle");
    const modalContent = elements.reservationModal.querySelector("#modalMeetupContent");
    const modalFooter = elements.reservationModal.querySelector("#modalMeetupFooter");

    if (modalTitle) {
      modalTitle.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; width: 100%;">
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="meetup-tag" style="background: var(--status-success-bg); color: var(--status-success); font-size: 0.72rem; padding: 2px 8px; font-weight: 700; text-transform: uppercase;">
                ✓ Reservation Confirmed
              </span>
            </div>
            <span style="font-size: 1.25rem; font-weight: 700; color: var(--cream-100);">${escapeHTML(meetup.title)}</span>
          </div>
          <span class="meetup-code-pill modal-code-pill copy-meetup-code-btn" data-code="${escapeHTML(meetup.code || '')}" title="Click to copy Code: ${escapeHTML(meetup.code || '')}">
            <span class="code-prefix">Code:</span> <span class="code-num">${escapeHTML(meetup.code || '')}</span>
            <span class="code-copy-icon">📋</span>
          </span>
        </div>
      `;
    }

    if (modalContent) {
      modalContent.scrollTop = 0;
      const isDining = meetup.category === 'coffee' || meetup.category === 'dining';
      const isEvent = meetup.isEvent || meetup.category === 'event';
      const reservedSpotMsg = isDining
        ? `You reserved the seat at <strong>${escapeHTML(meetup.venueName)}</strong>.`
        : (isEvent
           ? `You registered your spot for <strong>${escapeHTML(meetup.title)}</strong> at <strong>${escapeHTML(meetup.venueName)}</strong>.`
           : `You reserved your spot for <strong>${escapeHTML(meetup.title)}</strong> at <strong>${escapeHTML(meetup.venueName)}</strong>.`);

      const nextStepTitle = isDining ? 'Next Step: Join the Table Chat' : (isEvent ? 'Next Step: Join Event Chat' : 'Next Step: Join Meetup Chat');

      modalContent.innerHTML = `
        <div class="reservation-success-state">
          <div class="success-icon-badge">✓</div>
          <h3 style="font-size: 1.8rem; margin-bottom: 8px;">Congratulations!</h3>
          <p style="font-size: 1.15rem; color: var(--cream-200); margin-bottom: 12px;">
            ${reservedSpotMsg}
          </p>
          <div style="margin: 0 auto 18px; display: inline-flex; align-items: center; gap: 8px; background: rgba(227, 210, 186, 0.12); border: 1px solid var(--cream-border); padding: 5px 14px; border-radius: var(--radius-full);">
            <span style="font-size: 0.82rem; color: var(--cream-200); font-weight: 600;">Meetup Code:</span>
            <strong style="font-family: monospace; font-size: 0.95rem; color: var(--cream-100);">${escapeHTML(meetup.code || '')}</strong>
            <button class="copy-meetup-code-btn" data-code="${escapeHTML(meetup.code || '')}" title="Copy code" style="background: none; border: none; cursor: pointer; font-size: 0.85rem; color: var(--cream-300); padding: 0 2px;">📋</button>
          </div>
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; max-width: 440px; margin: 0 auto 20px;">
            We've sent a calendar invite and confirmation to your inbox. You can cancel with 1-click up to 3 hours before the gathering starts.
          </p>
          <div class="modal-info-block" style="text-align: left;">
            <div style="font-weight: 700; color: var(--cream-100); margin-bottom: 4px;">${nextStepTitle}</div>
            <div style="font-size: 0.88rem; color: var(--text-secondary);">
              Say hi to your fellow attendees before meeting on ${escapeHTML(meetup.day)}!
            </div>
          </div>
        </div>
      `;
    }

    if (modalFooter) {
      modalFooter.innerHTML = `
        <button class="btn btn-secondary btn-sm" id="viewGroupPageNowBtn">👥 View Group Page</button>
        <button class="btn btn-secondary btn-sm" id="cancelReservationNowBtn">Cancel</button>
        <button class="btn btn-primary btn-sm" id="openChatNowBtn">Join Group Chat →</button>
      `;

      const viewPageBtn = modalFooter.querySelector("#viewGroupPageNowBtn");
      if (viewPageBtn) {
        viewPageBtn.addEventListener("click", () => {
          openReservationModal(meetupId);
        });
      }

      const cancelBtn = modalFooter.querySelector("#cancelReservationNowBtn");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => openCancelConfirm(meetupId));
      }

      const chatBtn = modalFooter.querySelector("#openChatNowBtn");
      if (chatBtn) {
        chatBtn.addEventListener("click", () => {
          closeReservationModal();
          openChatDrawer(meetupId);
        });
      }
    }

    const confirmToastText = (meetup.category === 'coffee' || meetup.category === 'dining')
      ? `Seat confirmed at ${meetup.venueName}!`
      : (meetup.isEvent || meetup.category === 'event' ? `Registered for ${meetup.title}!` : `Spot confirmed for ${meetup.title}!`);

    showToast(confirmToastText, "success");
    renderMeetups();
  }

  function closeReservationModal() {
    clearInterval(window.meetupCountdownInterval);
    if (elements.reservationModal && elements.reservationModal.open) {
      elements.reservationModal.close();
      try {
        if (window.location.hash) {
          history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      } catch (e) {}
    }
  }

  // --------------------------------------------------------------------------
  // Cancellation Flow (from Wireframes: "Are you sure you want to cancel?")
  // --------------------------------------------------------------------------
  function openCancelConfirm(meetupId) {
    if (!elements.cancelConfirmModal) return;
    state.currentModalMeetupId = meetupId;
    closeReservationModal();

    const confirmBtn = elements.cancelConfirmModal.querySelector("#confirmCancelBtn");
    const keepBtn = elements.cancelConfirmModal.querySelector("#keepReservationBtn");

    if (confirmBtn) {
      confirmBtn.onclick = () => {
        state.bookedIds = state.bookedIds.filter(id => id !== meetupId);
        saveBookings();
        elements.cancelConfirmModal.close();
        renderMeetups();
        showToast("Reservation successfully cancelled.", "info");
      };
    }

    if (keepBtn) {
      keepBtn.onclick = () => {
        elements.cancelConfirmModal.close();
        openReservationModal(meetupId);
      };
    }

    elements.cancelConfirmModal.showModal();
  }

  // --------------------------------------------------------------------------
  // History Item Delete & Clear All History Confirmation Modals
  // --------------------------------------------------------------------------
  function openDeleteHistoryItemConfirm(meetupId) {
    if (!elements.deleteHistoryItemModal) return;
    const meetup = (state.meetups || []).find(m => String(m.id) === String(meetupId));
    const title = meetup ? meetup.title : "this gathering";

    const nameEl = elements.deleteHistoryItemModal.querySelector("#deleteHistoryItemName");
    if (nameEl) {
      nameEl.textContent = `Remove "${title}"?`;
    }

    const confirmBtn = elements.deleteHistoryItemModal.querySelector("#btnConfirmDeleteHistoryItem");
    const cancelBtn = elements.deleteHistoryItemModal.querySelector("#btnCancelDeleteHistoryItem");

    if (confirmBtn) {
      confirmBtn.onclick = () => {
        deleteHistoryItem(meetupId);
        elements.deleteHistoryItemModal.close();
        renderMeetups();
        if (elements.profileModal && elements.profileModal.open) {
          openUserProfileModal("gatherings");
        }
        showToast(`Removed "${title}" from history.`, "info");
      };
    }

    if (cancelBtn) {
      cancelBtn.onclick = () => {
        elements.deleteHistoryItemModal.close();
      };
    }

    elements.deleteHistoryItemModal.showModal();
  }

  function openClearHistoryConfirm() {
    if (!elements.clearHistoryConfirmModal) return;
    const count = getHistoryMeetups("all").length;
    const descEl = elements.clearHistoryConfirmModal.querySelector("#clearHistoryDescText");
    if (descEl) {
      descEl.textContent = `All ${count} gatherings will be removed from your personal history records. This cannot be undone.`;
    }

    const confirmBtn = elements.clearHistoryConfirmModal.querySelector("#btnConfirmClearAllHistory");
    const cancelBtn = elements.clearHistoryConfirmModal.querySelector("#btnCancelClearAllHistory");

    if (confirmBtn) {
      confirmBtn.onclick = () => {
        clearAllHistory();
        elements.clearHistoryConfirmModal.close();
        renderMeetups();
        if (elements.profileModal && elements.profileModal.open) {
          openUserProfileModal("gatherings");
        }
        showToast("All meetup history cleared.", "info");
      };
    }

    if (cancelBtn) {
      cancelBtn.onclick = () => {
        elements.clearHistoryConfirmModal.close();
      };
    }

    elements.clearHistoryConfirmModal.showModal();
  }

  // --------------------------------------------------------------------------
  // Post-Booking Group Chat Drawer & Floating Chat Widget
  // --------------------------------------------------------------------------
  function openChatDrawer(meetupId) {
    if (!elements.chatDrawer) return;

    const availableIds = typeof getAvailableGroupChats === "function" ? getAvailableGroupChats() : (state.bookedIds || []);

    // If no specific meetupId passed, determine from active or booked meetups
    let targetId = meetupId;
    if (!targetId) {
      if (availableIds && availableIds.length > 0) {
        targetId = (state.activeChatMeetupId && availableIds.includes(state.activeChatMeetupId)) 
          ? state.activeChatMeetupId 
          : availableIds[0];
      }
    }

    if (!targetId) {
      openEmptyChatDrawer();
      return;
    }

    const meetup = state.meetups.find(m => m.id === targetId);
    if (!meetup) {
      openEmptyChatDrawer();
      return;
    }

    state.activeChatMeetupId = targetId;
    if (typeof markChatAsRead === "function") {
      markChatAsRead(targetId);
    }
    const endStatus = getMeetupEndStatus(targetId);

    const liveBadge = document.getElementById("chatHeaderLiveBadge");
    const chatForm = document.getElementById("chatInputForm");
    const quickReplies = document.getElementById("drawerQuickReplies");

    if (endStatus.isFullyClosed) {
      if (elements.chatMeetupTitle) {
        elements.chatMeetupTitle.textContent = `${meetup.title} (Concluded)`;
      }
      if (liveBadge) {
        liveBadge.style.display = "inline-flex";
        liveBadge.textContent = "🔒 Chat Ended (3h post-meetup expired)";
        liveBadge.style.background = "rgba(239, 68, 68, 0.18)";
        liveBadge.style.color = "#f87171";
      }
      if (chatForm) chatForm.style.display = "none";
      if (quickReplies) quickReplies.style.display = "none";
    } else {
      if (elements.chatMeetupTitle) {
        elements.chatMeetupTitle.textContent = `${meetup.title} (${meetup.venueName || meetup.location})`;
      }
      if (liveBadge) {
        liveBadge.style.display = "inline-flex";
        liveBadge.innerHTML = `<span class="chat-live-pulse-dot"></span> Live Circle`;
        liveBadge.style.background = "rgba(39, 174, 96, 0.15)";
        liveBadge.style.color = "#34d399";
      }
      if (chatForm) chatForm.style.display = "flex";
      if (quickReplies) quickReplies.style.display = "flex";
    }

    // Render group switcher if multiple meetups are booked
    renderChatGroupSwitcher();

    renderChatMessages(targetId);
    elements.chatDrawer.classList.add("open");

    const overlay = document.getElementById("chatDrawerOverlay");
    if (overlay) overlay.classList.add("active");
  }

  function closeChatDrawer() {
    if (elements.chatDrawer) {
      elements.chatDrawer.classList.remove("open");
    }
    const overlay = document.getElementById("chatDrawerOverlay");
    if (overlay) overlay.classList.remove("active");
    if (typeof updateFloatingChatWidget === "function") {
      updateFloatingChatWidget();
    }
  }

  function openEmptyChatDrawer() {
    if (!elements.chatDrawer) return;

    if (elements.chatMeetupTitle) {
      elements.chatMeetupTitle.textContent = "No active group joined yet";
    }

    const liveBadge = document.getElementById("chatHeaderLiveBadge");
    if (liveBadge) liveBadge.style.display = "none";

    const tabsBar = document.getElementById("chatGroupTabsBar");
    if (tabsBar) tabsBar.style.display = "none";

    const chatForm = document.getElementById("chatInputForm");
    if (chatForm) chatForm.style.display = "none";

    const quickReplies = document.getElementById("drawerQuickReplies");
    if (quickReplies) quickReplies.style.display = "none";

    if (elements.chatMessagesList) {
      elements.chatMessagesList.innerHTML = `
        <div class="chat-empty-state">
          <div class="chat-empty-icon-wrap">
            <span style="font-size: 2rem;">💬</span>
          </div>
          <h4 class="chat-empty-title">Meetup Group Chat</h4>
          <p class="chat-empty-desc">
            When you join or reserve a meetup group, your private table group chat will appear here so you can chat directly with your host and fellow attendees!
          </p>
          <div class="chat-empty-buttons">
            <button type="button" class="btn btn-primary btn-sm" id="btnChatExploreMeetups">
              Explore Meetups ➔
            </button>
            <button type="button" class="btn btn-outline btn-sm" id="btnChatJoinSampleMeetup" style="border-color: rgba(227, 210, 186, 0.4); color: var(--cream-100);">
              ⚡ Join Sample Meetup to Test Chat
            </button>
          </div>
        </div>
      `;

      const exploreBtn = document.getElementById("btnChatExploreMeetups");
      if (exploreBtn) {
        exploreBtn.addEventListener("click", () => {
          closeChatDrawer();
          const meetupsSec = document.getElementById("meetups");
          if (meetupsSec) meetupsSec.scrollIntoView({ behavior: "smooth" });
        });
      }

      const sampleBtn = document.getElementById("btnChatJoinSampleMeetup");
      if (sampleBtn) {
        sampleBtn.addEventListener("click", () => {
          const sampleId = (state.meetups && state.meetups[0]) ? state.meetups[0].id : "m-01";
          if (!state.bookedIds.includes(sampleId)) {
            state.bookedIds.push(sampleId);
            saveBookings();
          }
          showToast("🎉 You joined Lunch Meetup at Veselka! Chat unlocked!", "success");
          openChatDrawer(sampleId);
        });
      }
    }

    elements.chatDrawer.classList.add("open");
    const overlay = document.getElementById("chatDrawerOverlay");
    if (overlay) overlay.classList.add("active");
  }

  function getAvailableGroupChats() {
    const activeIds = [];
    if (Array.isArray(state.bookedIds)) activeIds.push(...state.bookedIds);
    if (Array.isArray(state.myHostedMeetupIds)) activeIds.push(...state.myHostedMeetupIds);
    const uniqueIds = [...new Set(activeIds)];

    return uniqueIds.filter(id => {
      const meetup = state.meetups && state.meetups.find(m => m.id === id);
      if (!meetup) return false;
      const endStatus = getMeetupEndStatus(id);
      if (endStatus && endStatus.isFullyClosed) return false;
      return true;
    });
  }

  function hasAvailableGroupChat() {
    return getAvailableGroupChats().length > 0;
  }

  function getUnreadChatMessageCountForMeetup(meetupId) {
    if (!meetupId) return 0;
    const endStatus = getMeetupEndStatus(meetupId);
    if (endStatus && endStatus.isFullyClosed) return 0;

    const messages = state.chatMessages[meetupId] || [];
    // If read count is not yet tracked for this meetup, initialize to current length
    // so existing historical messages don't falsely create unread badges
    if (!state.chatReadCounts || typeof state.chatReadCounts[meetupId] !== "number") {
      if (!state.chatReadCounts) state.chatReadCounts = {};
      state.chatReadCounts[meetupId] = messages.length;
      try {
        localStorage.setItem(STORAGE_KEY_CHAT_READ_COUNTS, JSON.stringify(state.chatReadCounts));
      } catch (e) {}
    }
    const readCount = state.chatReadCounts[meetupId] || 0;
    return Math.max(0, messages.length - readCount);
  }

  function getUnreadChatMessageCount() {
    const availableMeetupIds = getAvailableGroupChats();
    if (availableMeetupIds.length === 0) return 0;

    let totalUnread = 0;
    availableMeetupIds.forEach(id => {
      totalUnread += getUnreadChatMessageCountForMeetup(id);
    });
    return totalUnread;
  }

  function markChatAsRead(meetupId) {
    if (!meetupId) return;
    const messages = state.chatMessages[meetupId] || [];
    if (!state.chatReadCounts) state.chatReadCounts = {};
    state.chatReadCounts[meetupId] = messages.length;
    try {
      localStorage.setItem(STORAGE_KEY_CHAT_READ_COUNTS, JSON.stringify(state.chatReadCounts));
    } catch (e) {}
    updateFloatingChatWidget();
  }

  function renderChatGroupSwitcher() {
    const tabsBar = document.getElementById("chatGroupTabsBar");
    if (!tabsBar) return;

    const availableIds = getAvailableGroupChats();
    const bookedMeetups = availableIds
      .map(id => state.meetups.find(m => m.id === id))
      .filter(Boolean);

    if (bookedMeetups.length <= 1) {
      tabsBar.style.display = "none";
      tabsBar.innerHTML = "";
      return;
    }

    tabsBar.style.display = "flex";
    tabsBar.innerHTML = bookedMeetups.map(m => {
      const isActive = m.id === state.activeChatMeetupId;
      const unreadForGroup = getUnreadChatMessageCountForMeetup(m.id);
      const catIcon = m.category === "dining" ? "🍴" : m.category === "coffee" ? "☕" : m.category === "walk" ? "👟" : "📍";
      const shortName = m.title.split(" ").slice(0, 2).join(" ");
      return `
        <button type="button" class="chat-group-tab-btn ${isActive ? 'active' : ''}" data-meetup-id="${m.id}" title="${escapeHTML(m.title)}">
          <span>${catIcon}</span>
          <span>${escapeHTML(shortName)}</span>
          ${unreadForGroup > 0 ? `<span class="chat-tab-unread-dot" title="${unreadForGroup} unread">${unreadForGroup}</span>` : ''}
        </button>
      `;
    }).join("");

    tabsBar.querySelectorAll(".chat-group-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.meetupId;
        openChatDrawer(id);
      });
    });
  }

  function initFloatingChatWidget() {
    const floatingBtn = document.getElementById("btnFloatingChat");
    const overlay = document.getElementById("chatDrawerOverlay");
    const closeBtn = document.getElementById("closeChatBtn");

    if (floatingBtn) {
      floatingBtn.addEventListener("click", () => {
        if (elements.chatDrawer && elements.chatDrawer.classList.contains("open")) {
          closeChatDrawer();
        } else {
          openChatDrawer();
        }
      });
    }

    if (overlay) {
      overlay.addEventListener("click", closeChatDrawer);
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeChatDrawer);
    }

    // Bind drawer quick replies
    const quickReplies = document.querySelectorAll("#drawerQuickReplies .chat-quick-chip");
    quickReplies.forEach(chip => {
      chip.addEventListener("click", () => {
        const msg = chip.dataset.msg;
        if (msg) {
          sendChatMessage(msg, state.activeChatMeetupId);
        }
      });
    });

    updateFloatingChatWidget();
  }

  function updateFloatingChatWidget() {
    const badge = document.getElementById("floatingChatBadge");
    const beacon = document.getElementById("floatingChatPulseBeacon");
    const tooltipText = document.getElementById("floatingChatTooltipText");

    const hasChatAvailable = hasAvailableGroupChat();
    const unreadCount = getUnreadChatMessageCount();

    // 1. Green Dot Beacon: Only show when any group chat is available
    if (beacon) {
      beacon.style.display = hasChatAvailable ? "block" : "none";
    }

    // 2. Badge Counter: Only show the number of unread messages (never show booked count, hide if 0)
    if (badge) {
      if (hasChatAvailable && unreadCount > 0) {
        badge.textContent = unreadCount > 99 ? "99+" : String(unreadCount);
        badge.style.display = "flex";
        badge.setAttribute("aria-label", `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`);
      } else {
        badge.textContent = "0";
        badge.style.display = "none";
        badge.removeAttribute("aria-label");
      }
    }

    // 3. Tooltip text
    if (tooltipText) {
      if (!hasChatAvailable) {
        tooltipText.textContent = "Meetup Group Chat";
      } else if (unreadCount > 0) {
        tooltipText.textContent = `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`;
      } else {
        const availableChats = getAvailableGroupChats();
        const firstMeetup = state.meetups.find(m => m.id === availableChats[0]);
        const title = firstMeetup ? firstMeetup.title : "Meetup Group";
        tooltipText.textContent = availableChats.length === 1 ? `Chat: ${title}` : `${availableChats.length} Active Group Chats`;
      }
    }
  }

  function generateFallbackChatMessages(meetup) {
    if (!meetup) return [];
    const members = meetup.members || [];
    const m1 = members[0] || { name: "Jordan Hayes", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80" };
    const m2 = members[1] || { name: "Sarah Jenkins", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" };
    const host = meetup.host || { name: "Host", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" };

    return [
      {
        sender: host.name,
        avatar: host.avatar,
        time: "Yesterday, 18:30",
        text: `Hey everyone! Looking forward to hosting at ${meetup.venueName || 'the venue'}. Can't wait to see you all!`
      },
      {
        sender: m1.name,
        avatar: m1.avatar,
        time: "Today, 09:15",
        text: `Good morning! Really excited for ${meetup.title}. Counting down the hours!`
      },
      {
        sender: m2.name,
        avatar: m2.avatar,
        time: "Today, 10:40",
        text: `Same here! I'll be arriving a few minutes early to grab a good spot.`
      }
    ];
  }

  function renderModalInlineChat(meetupId) {
    const chatStream = document.getElementById("modalChatStream");
    if (!chatStream) return;

    const meetup = state.meetups.find(m => m.id === meetupId);
    if (!meetup) return;

    if (!state.chatMessages[meetupId] || state.chatMessages[meetupId].length === 0) {
      state.chatMessages[meetupId] = generateFallbackChatMessages(meetup);
    }

    const messages = state.chatMessages[meetupId] || [];
    const defaultUserAvatar = (PROFILES_DATA && PROFILES_DATA.tom_cruise16 && PROFILES_DATA.tom_cruise16.avatar) 
      || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";

    chatStream.innerHTML = messages.map(msg => {
      const isMe = msg.sender === "You" || msg.sender === "Tom";
      const isConcierge = msg.sender === "Outspire Concierge" || msg.sender === "Outspire";
      let avatar = msg.avatar;

      if (!avatar) {
        if (isConcierge) {
          avatar = OUTSPIRE_CONCIERGE_AVATAR;
        } else if (isMe) {
          avatar = defaultUserAvatar;
        } else if (meetup.members && meetup.members.length > 0) {
          const matchedMember = meetup.members.find(m => m.name === msg.sender || m.name.toLowerCase().includes(msg.sender.toLowerCase()));
          if (matchedMember) avatar = matchedMember.avatar;
        }
        if (!avatar && meetup.host && (meetup.host.name === msg.sender || meetup.host.name.toLowerCase().includes(msg.sender.toLowerCase()))) {
          avatar = meetup.host.avatar;
        }
        if (!avatar) {
          avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";
        }
      }

      const isHost = !isMe && !isConcierge && meetup.host && (meetup.host.name === msg.sender || meetup.host.name.toLowerCase().includes(msg.sender.toLowerCase()));

      return `
        <div class="modal-chat-msg-row ${isMe ? 'outgoing' : 'incoming'} ${isConcierge ? 'concierge-msg' : ''}">
          ${isConcierge ? `
            <img src="${OUTSPIRE_CONCIERGE_AVATAR}" alt="Outspire" class="modal-chat-avatar" style="border-radius: 50%; border: 1px solid var(--accent-gold); flex-shrink: 0;" />
          ` : (meetup.isSurpriseMeetup && !isMe ? `
            <div class="modal-chat-avatar surprise-mystery-avatar" style="width: 32px; height: 32px; border-radius: 50%; background: rgba(227, 210, 186, 0.1); border: 1px dashed var(--cream-300); display: flex; align-items: center; justify-content: center; color: var(--cream-300); font-size: 0.85rem; flex-shrink: 0;" title="${escapeHTML(msg.sender)} (Photo hidden for surprise meetup)">
              👤
            </div>
          ` : `
            <img src="${avatar}" alt="${escapeHTML(msg.sender)}" class="modal-chat-avatar" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'" />
          `)}
          <div class="modal-chat-bubble-wrap">
            <div class="modal-chat-meta">
              <span class="modal-chat-sender" style="${isConcierge ? 'color: var(--accent-gold); font-weight: 700;' : ''}">${isMe ? 'You' : escapeHTML(msg.sender)}</span>
              ${isConcierge ? `<span class="meetup-tag" style="background: rgba(227,210,186,0.18); color: var(--accent-gold); font-size: 0.65rem; padding: 1px 6px; border-radius: 4px; font-weight: 700;">✓ Official Notice</span>` : (isHost ? `<span class="meetup-tag" style="background: rgba(227,210,186,0.12); color: var(--cream-100); font-size: 0.65rem; padding: 1px 5px; border-radius: 4px; font-weight: 600;">Host</span>` : '')}
              <span class="modal-chat-time">${escapeHTML(msg.time || 'Today')}</span>
            </div>
            <div class="modal-chat-bubble" style="${isConcierge ? 'border: 1px solid rgba(227, 210, 186, 0.3); background: rgba(227, 210, 186, 0.08); color: var(--cream-100);' : ''}">
              ${escapeHTML(msg.text)}
            </div>
          </div>
        </div>
      `;
    }).join("");

    chatStream.scrollTop = chatStream.scrollHeight;
  }

  function renderChatMessages(meetupId) {
    if (!elements.chatMessagesList) return;
    const meetup = state.meetups.find(m => m.id === meetupId);
    if (!state.chatMessages[meetupId] || state.chatMessages[meetupId].length === 0) {
      state.chatMessages[meetupId] = generateFallbackChatMessages(meetup);
    }
    const messages = state.chatMessages[meetupId];

    elements.chatMessagesList.innerHTML = messages.map(msg => {
      const isMe = msg.sender === "You" || msg.sender === "Tom";
      const isConcierge = msg.sender === "Outspire Concierge" || msg.sender === "Outspire";
      return `
        <div class="chat-bubble ${isMe ? 'outgoing' : 'incoming'}" style="${isConcierge ? 'border: 1px solid rgba(227, 210, 186, 0.3); background: rgba(227, 210, 186, 0.08);' : ''}">
          ${!isMe ? `<div class="chat-sender-name" style="${isConcierge ? 'color: var(--accent-gold); font-weight: 700;' : ''}">${escapeHTML(msg.sender)} ${isConcierge ? '✓' : ''}</div>` : ''}
          <div class="chat-message-text">${escapeHTML(msg.text)}</div>
          <div style="font-size: 0.68rem; opacity: 0.7; text-align: right; margin-top: 4px;">
            ${escapeHTML(msg.time)}
          </div>
        </div>
      `;
    }).join("");

    elements.chatMessagesList.scrollTop = elements.chatMessagesList.scrollHeight;
  }

  function sendChatMessage(text, targetMeetupId) {
    const meetupId = targetMeetupId || state.activeChatMeetupId || state.currentModalMeetupId;
    if (!text || !text.trim() || !meetupId) return;

    const endStatus = getMeetupEndStatus(meetupId);
    if (endStatus.isFullyClosed) {
      showToast("🔒 Chat for this meetup has ended (3-hour post-meetup window expired).", "warning");
      return;
    }

    if (!state.chatMessages[meetupId]) {
      const meetup = state.meetups.find(m => m.id === meetupId);
      state.chatMessages[meetupId] = generateFallbackChatMessages(meetup);
    }

    const userAvatar = (PROFILES_DATA && PROFILES_DATA.tom_cruise16 && PROFILES_DATA.tom_cruise16.avatar) 
      || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";

    const newMsg = {
      sender: "You",
      avatar: userAvatar,
      time: "Just now",
      text: text.trim()
    };

    state.chatMessages[meetupId].push(newMsg);
    if (typeof markChatAsRead === "function") {
      markChatAsRead(meetupId);
    }

    // Synchronize both inline modal and drawer
    renderChatMessages(meetupId);
    renderModalInlineChat(meetupId);

    // Mock friendly automated reply from one of the attending members or host after 1.2s
    setTimeout(() => {
      const meetup = state.meetups.find(m => m.id === meetupId);
      let responderName = "Henry Jones";
      let responderAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80";

      if (meetup) {
        if (meetup.members && meetup.members.length > 0) {
          const rand = meetup.members[Math.floor(Math.random() * meetup.members.length)];
          responderName = rand.name;
          responderAvatar = rand.avatar;
        } else if (meetup.host) {
          responderName = meetup.host.name;
          responderAvatar = meetup.host.avatar;
        }
      }

      const replies = [
        `Awesome! So happy you're joining us at ${meetup ? meetup.venueName : 'the venue'}. See you soon!`,
        `Glad you checked in! We're saving a spot for you at the table.`,
        `Hey! Looking forward to meeting you and chatting in person today!`,
        `Great to have you in the circle! It's going to be a fun group.`
      ];
      const replyText = replies[Math.floor(Math.random() * replies.length)];

      state.chatMessages[meetupId].push({
        sender: responderName,
        avatar: responderAvatar,
        time: "Just now",
        text: replyText
      });

      renderChatMessages(meetupId);
      renderModalInlineChat(meetupId);

      const isDrawerOpen = elements.chatDrawer && 
        elements.chatDrawer.classList.contains("open") && 
        state.activeChatMeetupId === meetupId;

      if (isDrawerOpen) {
        if (typeof markChatAsRead === "function") markChatAsRead(meetupId);
      } else {
        if (typeof updateFloatingChatWidget === "function") updateFloatingChatWidget();
      }
    }, 1200);
  }

  // --------------------------------------------------------------------------
  // Member Profile Viewer (Tom's Profile & Attendee Profiles)
  // --------------------------------------------------------------------------
  function openProfileModal(profileKey = "tom_cruise16", previousProfileKey = null) {
    let profile = PROFILES_DATA[profileKey];
    if (!profile) {
      for (const m of (state.meetups || [])) {
        const found = (m.members || []).find(mem => mem.id === profileKey || mem.name === profileKey);
        if (found) {
          profile = {
            id: found.id,
            name: found.name,
            handle: "@" + found.name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
            avatar: found.avatar,
            stats: {
              meetupsAttended: found.meetupsCount || 10,
              eventsJoined: 3,
              showUpRating: "100%",
              friendlyVibeRating: "98%"
            },
            bio: found.bio || "Active community member enjoying meaningful table conversations and curious gatherings.",
            city: m.city || "New York",
            socialStyle: "Friendly & Easygoing · Great Listener",
            badges: ["Verified Member", "100% Show-Up (Always Attends)", "Active Community Member"],
            favoriteTopics: found.topics || ["Coffee", "City Walks", "Good Conversations"],
            friends: [
              { id: "tom_cruise16", name: "Tom K.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" },
              { id: "chris_brown", name: "Chris Brown", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80" }
            ]
          };
          break;
        }
      }
    }
    if (!profile) profile = PROFILES_DATA.tom_cruise16;
    if (!elements.profileModal) return;

    const isConnected = (state.connectedMemberIds || []).includes(profile.id);
    const currentUserName = (state.currentUser && state.currentUser.name) || "Izhan K.";
    const currentUserAvatar = (state.currentUser && state.currentUser.avatar) || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";

    const displayFriends = [...(profile.friends || [])];
    if (isConnected && !displayFriends.some(f => f.id === "you" || f.id === "current_user")) {
      displayFriends.unshift({
        id: "you",
        name: "You (" + currentUserName + ")",
        avatar: currentUserAvatar,
        isSelf: true
      });
    }

    const connectionsCount = displayFriends.length;
    const meetupsCount = (profile.stats && profile.stats.meetupsAttended !== undefined) ? profile.stats.meetupsAttended : 15;
    const eventsCount = (profile.stats && profile.stats.eventsJoined !== undefined) ? profile.stats.eventsJoined : 5;
    const totalMeetups = (profile.stats && profile.stats.meetups !== undefined) 
      ? profile.stats.meetups 
      : (meetupsCount + eventsCount);

    const modalBody = elements.profileModal.querySelector("#profileModalContent");
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="profile-card-preview" style="border: none; padding: 0; box-shadow: none;">
          ${previousProfileKey && (previousProfileKey === "you" || PROFILES_DATA[previousProfileKey]) ? `
            <div style="margin-bottom: 14px;">
              <button class="profile-nav-back-btn" data-back-id="${previousProfileKey}" type="button">
                ← Back to ${previousProfileKey === "you" ? "Your Profile" : escapeHTML(PROFILES_DATA[previousProfileKey].name)}
              </button>
            </div>
          ` : ''}

          <div class="profile-header-preview">
            <div class="profile-avatar-wrapper">
              <img src="${profile.avatar}" alt="${escapeHTML(profile.name)}" class="profile-avatar-large" />
              <span class="profile-online-badge" title="Active Community Member"></span>
            </div>
            <div class="profile-header-main">
              <div class="profile-header-top">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <h3 style="font-size: 1.45rem; margin: 0; color: var(--cream-100); font-weight: 700;">${escapeHTML(profile.name)}</h3>
                    <span class="meetup-tag" style="background: rgba(39, 174, 96, 0.15); color: #34d399; font-size: 0.72rem; padding: 2px 8px; font-weight: 600; border: 1px solid rgba(39, 174, 96, 0.3);">✓ Verified Member</span>
                  </div>
                  <div style="font-size: 0.86rem; color: var(--cream-300); margin-top: 3px;">${escapeHTML(profile.handle)}</div>
                </div>

                <div class="profile-header-actions">
                  <button class="btn btn-primary btn-connect-action ${isConnected ? 'is-connected' : ''}" id="profileConnectBtn" data-profile-id="${escapeHTML(profile.id)}" type="button">
                    ${isConnected ? `<span>✓ Connected</span>` : `<span>+ Connect</span>`}
                  </button>
                </div>
              </div>

              <div class="profile-meta-row">
                <span>${escapeHTML(profile.city)}</span>
                <span>•</span>
                <span>Member since Nov 2025</span>
              </div>
            </div>
          </div>

          <div class="profile-stats-row">
            <div class="profile-stat-box" title="${totalMeetups} meetups attended">
              <strong style="color: var(--cream-100);">${totalMeetups}</strong>
              <span>Meetups</span>
            </div>
            <div class="profile-stat-box" title="${connectionsCount} verified table friends">
              <strong style="color: var(--cream-100);" id="profileStatsConnectionsCount">${connectionsCount}</strong>
              <span>Connections</span>
            </div>
            <div class="profile-stat-box" title="Show-Up Rating: 100% of booked meetups attended without missing">
              <strong style="color: #34d399;">${profile.stats.showUpRating || profile.stats.showUpRate || profile.stats.reliability || "100%"}</strong>
              <span>Show-Up Rating</span>
            </div>
            <div class="profile-stat-box" title="Friendly Vibe Rating: 98% positive vibe & friendly feedback from fellow table guests">
              <strong style="color: #fbbf24;">${profile.stats.friendlyVibe || profile.stats.friendlyVibeRating || profile.stats.rating || "98%"}</strong>
              <span>Friendly Vibe</span>
            </div>
          </div>

          <div class="profile-section">
            <div class="profile-section-heading">
              About Me
            </div>
            <div class="profile-bio-box">
              "${escapeHTML(profile.bio)}"
            </div>
          </div>

          <div class="profile-section">
            <div class="profile-section-heading">
              Social Style & Table Chemistry
            </div>
            <div class="profile-social-style-box">
              ${escapeHTML(profile.socialStyle)}
            </div>
          </div>

          <div class="profile-section">
            <div class="profile-section-heading">
              Favorite Topics & Conversation Sparks
            </div>
            <div class="profile-topics-wrap">
              ${(profile.favoriteTopics || []).map(t => `<span class="meetup-tag">${escapeHTML(t)}</span>`).join("")}
            </div>
          </div>

          <div class="profile-section">
            <div class="profile-section-heading">
              Community Trust Badges
            </div>
            <div class="profile-badges-wrap">
              ${(profile.badges || ["Verified Member", "100% Show-Up (Always Attends)", "Safe Departure Verified (100%)", "Active Community Member"]).map(b => `
                <span class="meetup-tag badge-trust-tag">${escapeHTML(b)}</span>
              `).join("")}
            </div>
          </div>

          ${profile.stories && profile.stories.length > 0 ? `
            <div class="profile-section">
              <div class="profile-section-heading">
                Recent Gathering Highlights
              </div>
              <div class="profile-stories-list">
                ${profile.stories.map(s => `
                  <div class="profile-story-card">
                    <div class="profile-story-header">
                      <strong>${escapeHTML(s.title)}</strong>
                      <span class="profile-story-time">${escapeHTML(s.time)}</span>
                    </div>
                    <p class="profile-story-preview">${escapeHTML(s.preview)}</p>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ''}

          <div class="profile-section" style="margin-bottom: 0;">
            <div class="profile-section-heading" style="justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                Connections <span class="profile-count-pill" id="profileHeaderConnectionsPill">${connectionsCount}</span>
              </div>
              <span style="font-size: 0.74rem; color: var(--cream-300); font-weight: normal;">Click any profile to view</span>
            </div>
            <div class="profile-connections-grid" id="profileConnectionsGrid">
              ${displayFriends.map(f => `
                <div class="connection-member-card" data-profile-id="${escapeHTML(f.id || '')}" role="button" tabindex="0" title="${f.isSelf ? 'Your Profile' : `Open ${escapeHTML(f.name)}'s Profile`}">
                  <img src="${f.avatar}" alt="${escapeHTML(f.name)}" class="connection-member-avatar" />
                  <div class="connection-member-info">
                    <span class="connection-member-name">${escapeHTML(f.name)}</span>
                    <span class="connection-member-sub">${f.isSelf ? 'You' : (f.id && (state.connectedMemberIds || []).includes(f.id) ? '✓ Connected' : 'View Profile')}</span>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          ${state.bookedIds.length > 0 && profileKey === 'tom_cruise16' ? `
            <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-subtle);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--cream-100); text-transform: uppercase;">
                  Your Reserved Meetups (${state.bookedIds.length})
                </div>
                <span class="meetup-tag" style="background: var(--status-success-bg); color: var(--status-success); font-size: 0.68rem; padding: 2px 6px;">
                  Active Bookings
                </span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${state.bookedIds.map(id => {
                  const m = state.meetups.find(item => item.id === id);
                  if (!m) return '';
                  return `
                    <div class="reserved-meetup-mini-row" data-id="${m.id}" role="button" tabindex="0" style="display: flex; align-items: center; justify-content: space-between; gap: 10px; background: rgba(227, 210, 186, 0.08); border: 1px solid var(--cream-border); padding: 9px 12px; border-radius: var(--radius-sm); cursor: pointer; transition: background var(--transition-fast);">
                      <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                        <img src="${m.image}" alt="${escapeHTML(m.title)}" style="width: 38px; height: 38px; border-radius: 6px; object-fit: cover; flex-shrink: 0;" />
                        <div style="min-width: 0;">
                          <div style="font-weight: 700; font-size: 0.88rem; color: var(--cream-100); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(m.title)}</div>
                          <div style="font-size: 0.76rem; color: var(--cream-300);">${escapeHTML(m.day)} • ${escapeHTML(m.time)} (${escapeHTML(m.venueName)})</div>
                        </div>
                      </div>
                      <button class="btn btn-primary btn-sm open-reserved-from-profile" data-id="${m.id}" style="padding: 4px 10px; font-size: 0.74rem; flex-shrink: 0;">
                        Open ➔
                      </button>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          ` : ''}
        </div>
      `;

      // Connect button handler
      const connectBtn = modalBody.querySelector("#profileConnectBtn");
      if (connectBtn) {
        connectBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const targetId = connectBtn.getAttribute("data-profile-id");
          if (!targetId) return;

          if (!state.connectedMemberIds) state.connectedMemberIds = [];
          const nowConnected = state.connectedMemberIds.includes(targetId);

          if (!nowConnected) {
            state.connectedMemberIds.push(targetId);
            localStorage.setItem("outspire_connected_members", JSON.stringify(state.connectedMemberIds));
            showToast(`🤝 Connected with ${profile.name}! You are now mutual table friends.`, "success");
            openProfileModal(profileKey, previousProfileKey);
          } else {
            state.connectedMemberIds = state.connectedMemberIds.filter(id => id !== targetId);
            localStorage.setItem("outspire_connected_members", JSON.stringify(state.connectedMemberIds));
            showToast(`Removed connection with ${profile.name}.`, "info");
            openProfileModal(profileKey, previousProfileKey);
          }
        });
      }

      // Clickable connection member cards to open that profile
      modalBody.querySelectorAll(".connection-member-card").forEach(card => {
        card.addEventListener("click", (e) => {
          e.stopPropagation();
          const targetId = card.getAttribute("data-profile-id");
          if (targetId && targetId !== "you" && targetId !== profileKey) {
            openProfileModal(targetId, profileKey);
          } else if (targetId === "you") {
            showToast(`👤 This is your connection card on ${profile.name}'s profile!`, "info");
          }
        });
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            card.click();
          }
        });
      });

      // Back navigation button
      const backBtn = modalBody.querySelector(".profile-nav-back-btn");
      if (backBtn) {
        backBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const backId = backBtn.getAttribute("data-back-id");
          if (backId === "you") {
            openUserProfileModal();
          } else if (backId) {
            openProfileModal(backId);
          }
        });
      }

      modalBody.querySelectorAll(".reserved-meetup-mini-row, .open-reserved-from-profile").forEach(el => {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = el.getAttribute("data-id");
          if (id) {
            if (elements.profileModal) elements.profileModal.close();
            openReservationModal(id);
          }
        });
      });
    }

    const modalTitle = elements.profileModal.querySelector("#profileModalTitle");
    if (modalTitle) modalTitle.textContent = "Member Profile";

    const modalFooter = elements.profileModal.querySelector("#profileModalFooter") || elements.profileModal.querySelector(".modal-footer");
    if (modalFooter) {
      modalFooter.innerHTML = `<button class="btn btn-secondary btn-sm modal-close-btn">Close</button>`;
      const closeBtn = modalFooter.querySelector(".modal-close-btn");
      if (closeBtn) closeBtn.addEventListener("click", () => elements.profileModal.close());
    }

    if (!elements.profileModal.open) {
      elements.profileModal.showModal();
    }
  }

  // --------------------------------------------------------------------------
  // Authentication & Member Account Management
  // --------------------------------------------------------------------------
  function openAuthModal(mode = "signin", prefillName = "") {
    if (!elements.authModal) return;

    const nameGroup = document.getElementById("authNameGroup");
    const nameInput = document.getElementById("authName");
    const submitBtn = document.getElementById("authSubmitBtn");
    const authTitle = document.getElementById("authTitle");
    const authSubtitle = document.getElementById("authSubtitle");

    const isSignUp = mode === "signup";

    const authTabs = document.querySelectorAll(".auth-tab-btn");
    authTabs.forEach(t => {
      t.classList.toggle("active", t.getAttribute("data-mode") === mode);
    });

    if (nameGroup) {
      nameGroup.style.display = isSignUp ? "flex" : "none";
      nameGroup.style.flexDirection = "column";
    }
    if (submitBtn) {
      submitBtn.textContent = isSignUp ? (state.pendingQuizAdvance ? "Sign Up & Continue" : "Sign Up Free") : "Sign In";
    }

    if (nameInput && prefillName) {
      nameInput.value = prefillName;
    }

    if (authTitle) {
      authTitle.textContent = isSignUp ? "Sign Up to Continue" : "Welcome to Outspire";
    }
    if (authSubtitle) {
      authSubtitle.textContent = isSignUp 
        ? "Create your account to save your profile & unlock all gathering matches" 
        : "Sign in to access your profile, bookings, and group chats";
    }

    elements.authModal.showModal();
  }

  function switchAuthTab(mode) {
    const authTabs = document.querySelectorAll(".auth-tab-btn");
    authTabs.forEach(t => {
      t.classList.toggle("active", t.getAttribute("data-mode") === mode);
    });

    const isSignUp = mode === "signup";
    const nameGroup = document.getElementById("authNameGroup");
    const avatarGroup = document.getElementById("authAvatarGroup");
    const submitBtn = document.getElementById("authSubmitBtn");
    const authTitle = document.getElementById("authTitle");
    const authSubtitle = document.getElementById("authSubtitle");

    if (nameGroup) {
      nameGroup.style.display = isSignUp ? "flex" : "none";
      nameGroup.style.flexDirection = "column";
    }
    if (avatarGroup) {
      avatarGroup.style.display = isSignUp ? "flex" : "none";
      avatarGroup.style.flexDirection = "column";
    }
    if (submitBtn) {
      submitBtn.textContent = isSignUp ? (state.pendingQuizAdvance ? "Sign Up & Continue" : "Sign Up Free") : "Sign In";
    }
    if (authTitle) {
      authTitle.textContent = isSignUp ? (state.pendingQuizAdvance ? "Sign Up to Continue" : "Create Account") : "Welcome to Outspire";
    }
    if (authSubtitle) {
      authSubtitle.textContent = isSignUp 
        ? "Create your account to save your profile & unlock all gathering matches" 
        : "Sign in to access your profile, bookings, and group chats";
    }
  }

  function handleSuccessfulAuth(name, email, avatar) {
    const userName = (name || (state.quizAnswers.firstName ? `${state.quizAnswers.firstName} ${state.quizAnswers.lastName || ''}`.trim() : "Member")).trim();
    const userEmail = email || "user@example.com";
    const userAvatar = (avatar && typeof avatar === "string" && avatar.trim().length > 0) 
      ? avatar.trim() 
      : (state.currentUser && state.currentUser.avatar ? state.currentUser.avatar : "");

    state.currentUser = {
      name: userName,
      email: userEmail,
      avatar: userAvatar
    };
    state.isAuthenticated = true;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state.currentUser));

    if (elements.authModal && elements.authModal.open) {
      elements.authModal.close();
    }

    updateAuthUI();

    if (state.pendingQuizAdvance) {
      state.pendingQuizAdvance = false;
      showToast(`🎉 Account created! Continuing your profile setup...`, "success");
      state.quizStep++;
      renderQuizStep();
      const quizSection = document.getElementById("quiz");
      if (quizSection) {
        quizSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      showToast(`Account active.`, "success");
    }
  }

  function updateAuthUI() {
    const authBtns = document.querySelectorAll(".open-auth-btn");
    authBtns.forEach(btn => {
      // Clear text so no name is mentioned
      btn.innerHTML = "";
      btn.classList.add("nav-profile-btn");
      btn.classList.remove("btn", "btn-ghost", "btn-sm");

      const avatarCircle = document.createElement("div");
      avatarCircle.className = "nav-profile-avatar-circle";

      const userAvatar = state.currentUser && state.currentUser.avatar && typeof state.currentUser.avatar === "string" 
        ? state.currentUser.avatar.trim() 
        : "";

      if (userAvatar) {
        // If a person has a profile photo, show the profile photo in it
        const img = document.createElement("img");
        img.className = "nav-profile-avatar-img";
        img.src = userAvatar;
        img.alt = "Profile";
        img.onerror = () => {
          // Fallback to profile logo SVG if photo fails to load
          avatarCircle.innerHTML = `
            <svg class="nav-profile-logo-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          `;
        };
        avatarCircle.appendChild(img);
      } else {
        // Just give a profile logo SVG in it (no name text)
        avatarCircle.innerHTML = `
          <svg class="nav-profile-logo-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        `;
      }

      btn.appendChild(avatarCircle);
      btn.title = state.isAuthenticated ? "Account & Profile" : "Sign In / Profile";
      btn.setAttribute("aria-label", "User Profile");
    });

    updateCommunityProfilePreview();
    syncHostProfileInfo();
    if (typeof updateHostPreview === "function") {
      updateHostPreview();
    }
  }

  function syncHostProfileInfo() {
    const nameEl = document.getElementById("hostProfileAutoName");
    const avatarEl = document.getElementById("hostProfileAutoAvatar");
    const detailsEl = document.getElementById("hostProfileAutoDetails");
    const userName = (state.currentUser && state.currentUser.name && state.currentUser.name.trim()) 
      ? state.currentUser.name.trim() 
      : "Tom K.";
    const userCity = (state.currentUser && state.currentUser.city) || state.userCity || "New York";
    const userAvatar = (state.currentUser && state.currentUser.avatar && typeof state.currentUser.avatar === "string") 
      ? state.currentUser.avatar.trim() 
      : "";

    if (nameEl) nameEl.textContent = userName;
    if (detailsEl) detailsEl.textContent = `Verified Member · ${userCity}`;
    if (avatarEl) {
      if (userAvatar) {
        avatarEl.innerHTML = `<img src="${escapeHTML(userAvatar)}" alt="${escapeHTML(userName)}" style="width:100%; height:100%; object-fit:cover; border-radius:50%; display:block;" />`;
      } else {
        avatarEl.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        `;
      }
    }
  }

  function updateCommunityProfilePreview() {
    const avatarImg = document.getElementById("previewAvatarImg");
    const avatarLogo = document.getElementById("previewAvatarLogo");
    const displayName = document.getElementById("previewDisplayName");
    const handle = document.getElementById("previewHandle");

    const userAvatar = state.currentUser && state.currentUser.avatar && typeof state.currentUser.avatar === "string" 
      ? state.currentUser.avatar.trim() 
      : "";

    if (avatarImg && avatarLogo) {
      if (userAvatar) {
        avatarImg.src = userAvatar;
        avatarImg.style.display = "block";
        avatarLogo.style.display = "none";
      } else {
        avatarImg.style.display = "none";
        avatarLogo.style.display = "flex";
      }
    }

    if (displayName) {
      displayName.textContent = "Member Profile";
    }
    if (handle) {
      handle.textContent = "Active Member · Outspire Community";
    }
  }

  const SAMPLE_PROFILE_AVATARS = [
    { label: "Classic Warm", url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" },
    { label: "Curious Explorer", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" },
    { label: "Urban Creative", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
    { label: "Coffee Connoisseur", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
    { label: "Thoughtful Reader", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
    { label: "Friendly Host", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" }
  ];

  const PRESET_VIBE_PILLS = [
    "🎙️ Great Listener (60/40)",
    "☕ Deep Conversations",
    "🎨 Creative Mind",
    "🍕 Zero Drama & Warm",
    "🎲 Board Game & Trivia",
    "🌆 City Walker",
    "📚 Avid Bookworm"
  ];

  const POPULAR_DISCUSSION_TOPICS = [
    "☕ Specialty Coffee",
    "📚 Sci-Fi & Fiction",
    "🌆 City Architecture",
    "🍕 Best Slice Debates",
    "🎬 Indie Cinema",
    "🚀 Tech & AI",
    "✈️ Solo Travel Stories",
    "🎲 Board Games",
    "🐕 Dogs & Parks"
  ];

  function openUserProfileModal(activeTab = "about") {
    if (!elements.profileModal) return;
    const modalBody = elements.profileModal.querySelector("#profileModalContent");
    if (!modalBody) return;

    const defaultUser = {
      name: "Tom K.",
      email: "tom.cruise16@example.com",
      handle: "@tom_k",
      avatar: "",
      bio: "Moved to Manhattan last year. Always down for morning park walks, trying neighborhood coffee spots, and playing table games with curious, friendly people.",
      city: state.userCity || "New York",
      country: state.userCountry || "United States",
      socialStyle: "Friendly Ambivert · Great Listener · Zero Drama",
      favoriteTopics: ["Park Walks & Dogs", "Board Games & Fun", "Books & Cinema", "Neighborhood Spots", "Tech & Startups"],
      badges: ["Verified Member", "100% Show-Up (Zero No-Shows)", "Safe Departure Verified", "Active Community Member", "Conversation Spark"],
      memberSince: "Nov 2025",
      meetupsCount: 15
    };

    const user = Object.assign({}, defaultUser, state.currentUser || {});
    if (!state.currentUser) {
      state.currentUser = user;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state.currentUser));
    } else {
      Object.keys(defaultUser).forEach(k => {
        if (state.currentUser[k] === undefined) {
          state.currentUser[k] = defaultUser[k];
        }
      });
    }

    const hasPhoto = !!(user.avatar && user.avatar.trim().length > 0);

    // Booked & History meetups
    const allHistoryMeetups = getHistoryMeetups("all");
    const reservedHistoryMeetups = getHistoryMeetups("reserved");
    const hostedHistoryMeetups = getHistoryMeetups("hosted");
    const profileFilter = state.profileHistoryFilter || "all";
    let displayedMeetups = allHistoryMeetups;
    if (profileFilter === "hosted") {
      displayedMeetups = hostedHistoryMeetups;
    } else if (profileFilter === "reserved") {
      displayedMeetups = reservedHistoryMeetups;
    }
    const bookedMeetups = allHistoryMeetups;

    // Normal profile meetups count (standard community stats)
    const userStats = (user && user.stats) || (PROFILES_DATA.tom_cruise16 && PROFILES_DATA.tom_cruise16.stats) || {};
    const normalMeetupsCount = (user && user.meetupsCount !== undefined)
      ? user.meetupsCount
      : ((userStats.meetupsAttended !== undefined) ? userStats.meetupsAttended : 15);

    // Connected friends
    const connectedFriends = [];
    const connectedIds = state.connectedMemberIds || [];
    connectedIds.forEach(id => {
      let p = PROFILES_DATA[id];
      if (!p) {
        for (const m of (state.meetups || [])) {
          const found = (m.members || []).find(mem => mem.id === id || mem.name === id);
          if (found) {
            p = {
              id: found.id || id,
              name: found.name,
              handle: "@" + found.name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
              avatar: found.avatar,
              city: m.city || "New York",
              socialStyle: "Friendly & Easygoing"
            };
            break;
          }
        }
      }
      if (p) connectedFriends.push(p);
    });

    // Update modal header title
    const modalTitle = elements.profileModal.querySelector("#profileModalTitle");
    if (modalTitle) modalTitle.textContent = "Member Passport · Your Profile";

    // Set clean, unified modal footer (Sign Out on left, Done on right)
    const modalFooter = elements.profileModal.querySelector("#profileModalFooter") || elements.profileModal.querySelector(".modal-footer");
    if (modalFooter) {
      modalFooter.innerHTML = `
        <button type="button" class="btn btn-ghost btn-sm" id="btnSignOutFromFooter" style="color: var(--cream-300); margin-right: auto; font-size: 0.82rem;">
          🚪 Sign Out
        </button>
        <button type="button" class="btn btn-primary btn-sm modal-close-btn" style="min-width: 100px;">
          Done
        </button>
      `;

      const footerSignOut = modalFooter.querySelector("#btnSignOutFromFooter");
      if (footerSignOut) {
        footerSignOut.addEventListener("click", () => {
          state.isAuthenticated = false;
          state.currentUser = null;
          localStorage.removeItem(STORAGE_KEY_USER);
          elements.profileModal.close();
          updateAuthUI();
          showToast("Signed out. Using default profile logo.", "info");
        });
      }

      const footerDone = modalFooter.querySelector(".modal-close-btn");
      if (footerDone) {
        footerDone.addEventListener("click", () => {
          elements.profileModal.close();
        });
      }
    }

    if (state.userIsConnected === undefined) {
      const storedConn = localStorage.getItem("outspire_user_connected_state");
      state.userIsConnected = storedConn !== null ? JSON.parse(storedConn) : false;
    }

    modalBody.innerHTML = `
      <div class="user-profile-container">
        <!-- Atmospheric Cover Banner -->
        <div class="user-profile-cover-banner"></div>

        <!-- Identity Card with Avatar & Header Details -->
        <div class="user-profile-identity-card">
          <!-- Top Row: Avatar overlapping cover banner -->
          <div class="user-profile-avatar-row">
            <div class="user-profile-avatar-wrap" id="userProfileAvatarWrap" role="button" tabindex="0" title="Click to change photo or logo">
              ${hasPhoto ? `
                <img src="${escapeHTML(user.avatar)}" alt="${escapeHTML(user.name)}" class="user-profile-avatar-img" id="userProfileAvatarImg" />
              ` : `
                <div class="user-profile-avatar-logo" id="userProfileAvatarLogo">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              `}
              <span class="profile-online-badge" title="Active Member · Online"></span>
              <button type="button" class="user-profile-camera-btn" id="btnAvatarQuickEdit" aria-label="Change photo or logo" title="Change photo or logo">
                📷
              </button>
            </div>
          </div>

          <!-- Profile Details (Positioned below the profile photo) -->
          <div class="user-profile-meta-wrap">
            <div class="user-profile-header-main-row">
              <div class="user-profile-name-row">
                <h3 class="user-profile-name" id="userDisplayName">${escapeHTML(user.name)}</h3>
                <button type="button" class="user-profile-edit-name-btn" id="btnEditDisplayName" title="Edit your display name">
                  ✏️ Edit
                </button>
                <span class="meetup-tag" style="background: rgba(39, 174, 96, 0.15); color: #34d399; font-size: 0.72rem; padding: 2px 8px; font-weight: 600; border: 1px solid rgba(39, 174, 96, 0.3);">
                  ✓ Verified Member
                </span>
              </div>

              <div class="user-profile-actions-row">
                <button type="button" class="btn btn-secondary btn-sm" id="userProfileShareBtn" title="Copy your public profile link">
                  <span>🔗 Share Profile</span>
                </button>
              </div>
            </div>

            <!-- Inline Name Editor (Hidden by default) -->
            <div id="userNameEditBox" style="display: none; margin-top: 6px; margin-bottom: 6px;">
              <div style="display: flex; gap: 6px; align-items: center;">
                <input type="text" id="userNameInput" value="${escapeHTML(user.name)}" class="form-control" style="font-size: 0.86rem; padding: 4px 10px; max-width: 200px; background: var(--bg-surface); color: var(--cream-100); border: 1px solid var(--cream-border); border-radius: var(--radius-sm);" />
                <button type="button" class="btn btn-primary btn-xs" id="btnSaveName">Save</button>
                <button type="button" class="btn btn-ghost btn-xs" id="btnCancelName">✕</button>
              </div>
            </div>

            <div class="user-profile-handle-row">
              <span>${escapeHTML(user.handle || '@' + user.name.toLowerCase().replace(/[^a-z0-9]/g, '_'))}</span>
              <span>•</span>
              <span>${escapeHTML(user.email)}</span>
            </div>

            <div class="user-profile-location-row">
              <span>📍 ${escapeHTML(user.city || state.userCity || 'New York')}, ${escapeHTML(user.country || state.userCountry || 'United States')}</span>
            </div>
          </div>
        </div>

        <!-- 4-Column Prestige Community Stats Grid -->
        <div class="user-profile-stats-grid">
          <div class="user-profile-stat-card" id="statCardBookings" title="${normalMeetupsCount} meetups attended · Click to view gatherings">
            <strong style="color: var(--cream-100);">${normalMeetupsCount}</strong>
            <span>Meetups</span>
          </div>
          <div class="user-profile-stat-card" id="statCardConnections" title="${connectedFriends.length} verified table friends · Click to view connections">
            <strong style="color: var(--cream-100);">${connectedFriends.length}</strong>
            <span>Connections</span>
          </div>
          <div class="user-profile-stat-card" title="100% attendance rate without missing">
            <strong style="color: #34d399;">100%</strong>
            <span>Show-Up</span>
          </div>
          <div class="user-profile-stat-card" title="Warm table feedback from fellow guests">
            <strong style="color: #fbbf24;">99%</strong>
            <span>Table Vibe</span>
          </div>
        </div>

        <!-- Tab Navigation Bar -->
        <div class="user-profile-tabs-bar">
          <button type="button" class="user-profile-tab-button ${activeTab === 'about' ? 'active' : ''}" data-tab="about">
            👤 About & Vibes
          </button>
          <button type="button" class="user-profile-tab-button ${activeTab === 'gatherings' ? 'active' : ''}" data-tab="gatherings">
            🗓️ Gatherings (${bookedMeetups.length})
          </button>
          <button type="button" class="user-profile-tab-button ${activeTab === 'connections' ? 'active' : ''}" data-tab="connections">
            🤝 Table Friends (${connectedFriends.length})
          </button>
          <button type="button" class="user-profile-tab-button ${activeTab === 'settings' ? 'active' : ''}" data-tab="settings">
            ⚙️ Photo & Settings
          </button>
        </div>

        <!-- TAB 1: ABOUT & VIBES -->
        <div class="user-profile-tab-pane ${activeTab === 'about' ? 'active' : ''}" id="tabPaneAbout">
          <!-- Personal Bio -->
          <div class="profile-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div class="profile-section-heading" style="margin: 0;">Personal Bio</div>
              <button type="button" class="btn btn-ghost btn-xs" id="btnEditUserBio" style="font-size: 0.74rem; color: var(--accent-gold); padding: 2px 8px;">
                ✏️ Edit Bio
              </button>
            </div>
            <div id="userBioDisplay" class="profile-bio-box">
              "${escapeHTML(user.bio || 'Active community member enjoying meaningful table conversations and curious gatherings.')}"
            </div>
            <div id="userBioEditor" style="display: none; margin-top: 10px;">
              <textarea id="userBioInput" rows="3" style="width: 100%; background: var(--bg-surface); border: 1px solid var(--cream-border); color: var(--cream-100); border-radius: var(--radius-sm); padding: 10px; font-size: 0.88rem; resize: vertical;">${escapeHTML(user.bio || '')}</textarea>
              <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px;">
                <button type="button" class="btn btn-ghost btn-xs" id="btnCancelUserBio">Cancel</button>
                <button type="button" class="btn btn-primary btn-xs" id="btnSaveUserBio">Save Bio</button>
              </div>
              <div style="margin-top: 10px;">
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 5px;">Quick inspiration (click to use):</div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <button type="button" class="bio-prompt-chip" data-prompt="☕ Coffee lover, architect, and amateur photographer exploring NYC tables.">☕ Coffee & Architecture</button>
                  <button type="button" class="bio-prompt-chip" data-prompt="📚 Bookworm & tech enthusiast who loves deep questions and zero small talk.">📚 Books & Zero Small Talk</button>
                  <button type="button" class="bio-prompt-chip" data-prompt="🍕 Always searching for the city's best pizza, hidden jazz clubs, and great banter.">🍕 Best Pizza & Jazz</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Style & Table Chemistry -->
          <div class="profile-section">
            <div class="profile-section-heading">Social Style & Table Chemistry</div>
            <div class="profile-social-style-box" style="margin-bottom: 10px;">
              ${escapeHTML(user.socialStyle || 'Friendly Ambivert · Great Listener · Zero Drama')}
            </div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;" id="vibePillsContainer">
              ${PRESET_VIBE_PILLS.map(v => {
                const isSelected = (user.socialStyle || '').includes(v.split(' ')[1] || v);
                return `<button type="button" class="vibe-tag-chip ${isSelected ? 'active' : ''}" data-vibe="${escapeHTML(v)}">${escapeHTML(v)}</button>`;
              }).join("")}
            </div>
          </div>

          <!-- Favorite Topics & Conversation Sparks -->
          <div class="profile-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div class="profile-section-heading" style="margin: 0;">Favorite Topics & Conversation Sparks</div>
              <button type="button" class="btn btn-ghost btn-xs" id="btnToggleAddTopic" style="font-size: 0.74rem; color: var(--accent-gold); padding: 2px 8px;">
                + Add Topic
              </button>
            </div>
            <div class="profile-topics-wrap" id="userTopicsList">
              ${(user.favoriteTopics || []).map(t => `
                <span class="meetup-tag" style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px;">
                  ${escapeHTML(t)}
                  <button type="button" class="btn-remove-topic" data-topic="${escapeHTML(t)}" style="background: transparent; border: none; color: var(--cream-300); cursor: pointer; padding: 0; font-size: 0.75rem; line-height: 1;" title="Remove topic">✕</button>
                </span>
              `).join("")}
            </div>
            <div id="addTopicBox" style="display: none; margin-top: 10px;">
              <div style="display: flex; gap: 6px; align-items: center;">
                <input type="text" id="newTopicInput" placeholder="e.g. Vintage Watches, Tokyo Food..." style="flex-grow: 1; background: var(--bg-surface); border: 1px solid var(--cream-border); color: var(--cream-100); border-radius: var(--radius-sm); padding: 6px 10px; font-size: 0.84rem;" />
                <button type="button" class="btn btn-primary btn-xs" id="btnAddTopicSubmit">Add</button>
                <button type="button" class="btn btn-ghost btn-xs" id="btnAddTopicCancel">✕</button>
              </div>
              <div style="margin-top: 8px; display: flex; gap: 5px; flex-wrap: wrap;">
                ${POPULAR_DISCUSSION_TOPICS.map(pt => `
                  <button type="button" class="bio-prompt-chip popular-topic-suggest" data-topic="${escapeHTML(pt)}">${escapeHTML(pt)}</button>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- Community Trust Badges -->
          <div class="profile-section">
            <div class="profile-section-heading">Community Trust Badges</div>
            <div class="profile-badges-wrap">
              ${(user.badges || ["Verified Member", "100% Show-Up (Zero No-Shows)", "Safe Departure Verified", "Active Community Member", "Conversation Spark"]).map(b => `
                <span class="meetup-tag badge-trust-tag">${escapeHTML(b)}</span>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- TAB 2: MY GATHERINGS -->
        <div class="user-profile-tab-pane ${activeTab === 'gatherings' ? 'active' : ''}" id="tabPaneGatherings">
          <!-- History Subnav & Clear Options -->
          <div class="profile-history-controls-bar">
            <div class="history-filter-toggle-group" role="tablist" aria-label="Profile history filter">
              <button type="button" class="history-toggle-pill profile-history-toggle-pill ${profileFilter === 'all' ? 'active' : ''}" data-profile-filter="all">
                <span>📋 All Meetups</span>
                <span class="history-pill-count">${allHistoryMeetups.length}</span>
              </button>
              <button type="button" class="history-toggle-pill profile-history-toggle-pill ${profileFilter === 'reserved' ? 'active' : ''}" data-profile-filter="reserved">
                <span>🎟️ Reserved Meetups</span>
                <span class="history-pill-count">${reservedHistoryMeetups.length}</span>
              </button>
              <button type="button" class="history-toggle-pill profile-history-toggle-pill ${profileFilter === 'hosted' ? 'active' : ''}" data-profile-filter="hosted">
                <span>👑 I Hosted Meetups</span>
                <span class="history-pill-count">${hostedHistoryMeetups.length}</span>
              </button>
            </div>
            ${allHistoryMeetups.length > 0 ? `
              <button type="button" class="btn btn-secondary btn-xs btn-clear-history" id="btnProfileClearHistory" title="Clear all meetup history">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:3px;">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Clear History
              </button>
            ` : ''}
          </div>

          ${displayedMeetups.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${displayedMeetups.map(m => {
                const endedOrPassed = isMeetupEndedOrPassed(m);
                const endStat = getMeetupEndStatus(m.id);
                let badgeText = "✓ Reserved Seat Confirmed";
                let badgeColor = "#34d399";
                if (endStat.isEnded) {
                  badgeText = "🔒 Concluded Gathering (Attended)";
                  badgeColor = "#f87171";
                } else if (endedOrPassed) {
                  badgeText = "⏳ Concluded / Attended (History)";
                  badgeColor = "#fbbf24";
                }
                const isHosted = isUserHostOfMeetup(m);
                return `
                <div class="profile-gathering-card">
                  <img src="${escapeHTML(m.image || m.photo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80')}" alt="${escapeHTML(m.title)}" class="profile-gathering-thumb" />
                  <div class="profile-gathering-info">
                    <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                      <span class="profile-gathering-title">${escapeHTML(m.title)}</span>
                      ${isHosted ? '<span class="meetup-tag" style="background: rgba(227, 210, 186, 0.2); color: var(--accent-gold); font-size: 0.68rem; padding: 1px 6px; font-weight: 700;">👑 Hosted</span>' : ''}
                    </div>
                    <div class="profile-gathering-meta">
                      <span>🗓️ ${escapeHTML(m.day || m.date || 'Tonight')} • ${escapeHTML(m.time || '7:00 PM')}</span>
                      <span> • 📍 ${escapeHTML(m.venueName || m.neighborhood || 'SoHo')}</span>
                    </div>
                    <div style="font-size: 0.72rem; color: ${badgeColor}; font-weight: 600;">
                      ${badgeText}
                    </div>
                  </div>
                  <div class="profile-gathering-actions">
                    <button type="button" class="btn btn-primary btn-xs profile-open-chat-btn" data-meetup-id="${m.id}" style="font-size: 0.75rem; padding: 4px 10px;">
                      💬 Group Chat
                    </button>
                    <button type="button" class="btn btn-secondary btn-xs profile-view-meetup-btn" data-meetup-id="${m.id}" style="font-size: 0.75rem; padding: 4px 8px;">
                      📍 Table
                    </button>
                    ${(endedOrPassed || endStat.isEnded) ? `
                      <button type="button" class="btn btn-ghost btn-xs profile-delete-history-btn" data-meetup-id="${m.id}" style="font-size: 0.75rem; padding: 4px 6px; color: #f87171;" title="Delete this gathering from history">
                        🗑️
                      </button>
                    ` : ''}
                  </div>
                </div>
              `;}).join("")}
            </div>
          ` : `
            <div style="text-align: center; padding: 36px 16px; background: rgba(227, 210, 186, 0.04); border-radius: var(--radius-md); border: 1px dashed var(--cream-border);">
              <div style="font-size: 2.2rem; margin-bottom: 10px;">${profileFilter === 'hosted' ? '👑' : (profileFilter === 'reserved' ? '🎟️' : '🗓️')}</div>
              <h4 style="color: var(--cream-100); margin: 0 0 6px; font-size: 1.1rem;">
                ${profileFilter === 'hosted' ? 'No Hosted Gatherings in History' : (profileFilter === 'reserved' ? 'No Reserved Gatherings Yet' : 'No Gatherings in History')}
              </h4>
              <p style="font-size: 0.84rem; color: var(--cream-300); max-width: 380px; margin: 0 auto 16px;">
                ${profileFilter === 'hosted'
                  ? "You haven't hosted any meetups yet. Host a gathering and welcome curious strangers to your table!"
                  : (profileFilter === 'reserved'
                    ? "You don't have any upcoming reserved meetups right now. Reserve your seat at an upcoming table to see it here!"
                    : "You don't have any gatherings in history, or your history was cleared.")}
              </p>
              ${profileFilter === 'hosted' ? `
                <a href="#host-section" class="btn btn-primary btn-sm" id="btnProfileHostGathering">
                  + Host a Gathering Now
                </a>
              ` : `
                <button type="button" class="btn btn-primary btn-sm" id="btnExploreGatheringsFromProfile">
                  Explore Gatherings ➔
                </button>
              `}
            </div>
          `}
        </div>

        <!-- TAB 3: TABLE FRIENDS -->
        <div class="user-profile-tab-pane ${activeTab === 'connections' ? 'active' : ''}" id="tabPaneConnections">
          ${connectedFriends.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${connectedFriends.map(f => `
                <div class="connection-member-card" style="padding: 10px 14px;">
                  <img src="${escapeHTML(f.avatar)}" alt="${escapeHTML(f.name)}" class="connection-member-avatar" style="width: 44px; height: 44px;" />
                  <div class="connection-member-info">
                    <strong class="connection-member-name" style="font-size: 0.92rem;">${escapeHTML(f.name)}</strong>
                    <span class="connection-member-sub">${escapeHTML(f.handle || '@friend')} • ${escapeHTML(f.city || 'New York')}</span>
                    <span style="font-size: 0.72rem; color: #34d399; font-weight: 600;">🤝 Mutual Table Friend</span>
                  </div>
                  <div style="display: flex; gap: 6px; flex-shrink: 0;">
                    <button type="button" class="btn btn-secondary btn-xs profile-view-friend-btn" data-profile-id="${f.id}" style="font-size: 0.75rem; padding: 4px 10px;">
                      Profile
                    </button>
                    <button type="button" class="btn btn-ghost btn-xs profile-wave-friend-btn" data-name="${escapeHTML(f.name)}" style="font-size: 0.85rem; padding: 4px 8px;" title="Wave hello">
                      👋
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          ` : `
            <div style="text-align: center; padding: 36px 16px; background: rgba(227, 210, 186, 0.04); border-radius: var(--radius-md); border: 1px dashed var(--cream-border);">
              <div style="font-size: 2.2rem; margin-bottom: 10px;">🤝</div>
              <h4 style="color: var(--cream-100); margin: 0 0 6px; font-size: 1.1rem;">No Table Friends Yet</h4>
              <p style="font-size: 0.84rem; color: var(--cream-300); max-width: 380px; margin: 0 auto 16px;">
                After each gathering, you can connect with your table mates. They will appear here in your circle!
              </p>
              <button type="button" class="btn btn-secondary btn-sm" id="btnConnectSampleFriend">
                + Connect with William Stone (Sample)
              </button>
            </div>
          `}
        </div>

        <!-- TAB 4: PHOTO & SETTINGS -->
        <div class="user-profile-tab-pane ${activeTab === 'settings' ? 'active' : ''}" id="tabPaneSettings">
          <!-- Avatar Switcher -->
          <div class="profile-section" id="profilePhotoSection">
            <div class="profile-section-heading">Avatar & Profile Appearance</div>
            <div style="background: rgba(227, 210, 186, 0.04); border: 1px solid var(--cream-border); border-radius: var(--radius-sm); padding: 14px;">
              <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px;">
                ${hasPhoto ? `
                  <img src="${escapeHTML(user.avatar)}" alt="Current avatar" style="width: 54px; height: 54px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent-gold);" />
                  <div>
                    <div style="font-size: 0.88rem; font-weight: 600; color: var(--cream-100);">Profile Photo Active</div>
                    <div style="font-size: 0.76rem; color: var(--cream-300);">Visible across the community navbar and tables</div>
                  </div>
                ` : `
                  <div style="width: 54px; height: 54px; border-radius: 50%; background: rgba(245, 237, 224, 0.08); border: 2px solid rgba(245, 237, 224, 0.3); display: flex; align-items: center; justify-content: center; color: var(--cream-100);">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <div style="font-size: 0.88rem; font-weight: 600; color: var(--cream-100);">Default Profile Logo Active</div>
                    <div style="font-size: 0.76rem; color: var(--cream-300);">Sleek icon logo with no photo exposed</div>
                  </div>
                `}
              </div>

              <!-- 1-Click Avatar Selection Gallery -->
              <div style="margin-bottom: 14px;">
                <label style="font-size: 0.78rem; font-weight: 600; color: var(--cream-200); display: block; margin-bottom: 6px;">
                  1-Click Sample Avatars:
                </label>
                <div class="avatar-gallery-grid">
                  ${SAMPLE_PROFILE_AVATARS.map(sa => `
                    <div class="avatar-gallery-item ${user.avatar === sa.url ? 'selected' : ''}" data-avatar-url="${escapeHTML(sa.url)}" title="${escapeHTML(sa.label)}">
                      <img src="${escapeHTML(sa.url)}" alt="${escapeHTML(sa.label)}" class="avatar-gallery-img" />
                    </div>
                  `).join("")}
                </div>
              </div>

              <!-- Custom URL & File Upload -->
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 0.78rem; font-weight: 600; color: var(--cream-200); margin: 0;">
                  Or Custom Image URL / Upload:
                </label>
                <div style="display: flex; gap: 6px;">
                  <input type="url" id="customAvatarUrlInput" placeholder="https://images.unsplash.com/..." value="${hasPhoto ? escapeHTML(user.avatar) : ''}" style="flex-grow: 1; background: var(--bg-surface); border: 1px solid var(--cream-border); color: var(--cream-100); border-radius: var(--radius-sm); padding: 6px 10px; font-size: 0.84rem;" />
                  <button type="button" class="btn btn-secondary btn-xs" id="btnApplyAvatarUrl" style="font-size: 0.78rem; padding: 6px 12px;">Apply URL</button>
                </div>
                <div style="display: flex; gap: 10px; align-items: center; margin-top: 4px; flex-wrap: wrap;">
                  <label class="btn btn-ghost btn-xs" style="cursor: pointer; font-size: 0.76rem; padding: 4px 10px; border: 1px solid var(--cream-border);">
                    📁 Upload from Device
                    <input type="file" id="localAvatarFileInput" accept="image/*" style="display: none;" />
                  </label>
                  <button type="button" class="btn btn-ghost btn-xs" id="btnResetToLogo" style="color: #f87171; font-size: 0.76rem; padding: 4px 10px;">
                    ✕ Switch to Profile Logo (SVG)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Basic Info Settings -->
          <div class="profile-section">
            <div class="profile-section-heading">Basic Information</div>
            <div style="display: flex; flex-direction: column; gap: 10px; background: rgba(227, 210, 186, 0.04); border: 1px solid var(--cream-border); border-radius: var(--radius-sm); padding: 14px;">
              <div>
                <label style="font-size: 0.78rem; font-weight: 600; color: var(--cream-200); display: block; margin-bottom: 4px;">Display Name</label>
                <input type="text" id="settingsNameInput" value="${escapeHTML(user.name)}" class="form-control" style="width: 100%; background: var(--bg-surface); border: 1px solid var(--cream-border); color: var(--cream-100); border-radius: var(--radius-sm); padding: 8px 10px; font-size: 0.88rem;" />
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 600; color: var(--cream-200); display: block; margin-bottom: 4px;">Email Address</label>
                <input type="email" id="settingsEmailInput" value="${escapeHTML(user.email)}" class="form-control" style="width: 100%; background: var(--bg-surface); border: 1px solid var(--cream-border); color: var(--cream-100); border-radius: var(--radius-sm); padding: 8px 10px; font-size: 0.88rem;" />
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 600; color: var(--cream-200); display: block; margin-bottom: 4px;">Home City</label>
                <select id="settingsCitySelect" style="width: 100%; background: var(--bg-surface); border: 1px solid var(--cream-border); color: var(--cream-100); border-radius: var(--radius-sm); padding: 8px 10px; font-size: 0.88rem;">
                  <option value="New York" ${user.city === 'New York' ? 'selected' : ''}>New York, United States</option>
                  <option value="London" ${user.city === 'London' ? 'selected' : ''}>London, United Kingdom</option>
                  <option value="Tokyo" ${user.city === 'Tokyo' ? 'selected' : ''}>Tokyo, Japan</option>
                  <option value="Paris" ${user.city === 'Paris' ? 'selected' : ''}>Paris, France</option>
                  <option value="Berlin" ${user.city === 'Berlin' ? 'selected' : ''}>Berlin, Germany</option>
                  <option value="San Francisco" ${user.city === 'San Francisco' ? 'selected' : ''}>San Francisco, United States</option>
                  <option value="Toronto" ${user.city === 'Toronto' ? 'selected' : ''}>Toronto, Canada</option>
                  <option value="Sydney" ${user.city === 'Sydney' ? 'selected' : ''}>Sydney, Australia</option>
                </select>
              </div>
              <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
                <button type="button" class="btn btn-primary btn-sm" id="btnSaveBasicSettings">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <!-- Preferences & Notifications -->
          <div class="profile-section">
            <div class="profile-section-heading">Preferences & Notifications</div>
            <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(227, 210, 186, 0.04); border: 1px solid var(--cream-border); border-radius: var(--radius-sm); padding: 14px;">
              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 0.84rem; color: var(--cream-200); cursor: pointer;">
                <span>📢 Notify me whenever a new meetup is hosted in my area</span>
                <input type="checkbox" checked style="accent-color: var(--accent-gold); transform: scale(1.15);" />
              </label>
              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 0.84rem; color: var(--cream-200); cursor: pointer;">
                <span>👥 Share profile bio with confirmed guests before table starts</span>
                <input type="checkbox" checked style="accent-color: var(--accent-gold); transform: scale(1.15);" />
              </label>
              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 0.84rem; color: var(--cream-200); cursor: pointer;">
                <span>🤝 Auto-enable Safe Departure buddy check</span>
                <input type="checkbox" checked style="accent-color: var(--accent-gold); transform: scale(1.15);" />
              </label>
            </div>
          </div>
        </div>
      </div>
    `;

    // ------------------------------------------------------------------------
    // EVENT LISTENERS & INTERACTION
    // ------------------------------------------------------------------------

    // Tab Switching
    const tabButtons = modalBody.querySelectorAll(".user-profile-tab-button");
    const tabPanes = {
      about: modalBody.querySelector("#tabPaneAbout"),
      gatherings: modalBody.querySelector("#tabPaneGatherings"),
      connections: modalBody.querySelector("#tabPaneConnections"),
      settings: modalBody.querySelector("#tabPaneSettings")
    };

    function switchProfileTab(tabName) {
      tabButtons.forEach(b => {
        b.classList.toggle("active", b.getAttribute("data-tab") === tabName);
      });
      Object.keys(tabPanes).forEach(k => {
        if (tabPanes[k]) {
          tabPanes[k].classList.toggle("active", k === tabName);
        }
      });
    }

    tabButtons.forEach(b => {
      b.addEventListener("click", () => {
        const tab = b.getAttribute("data-tab") || "about";
        switchProfileTab(tab);
      });
    });

    // Stat cards click to switch tabs
    const statBookings = modalBody.querySelector("#statCardBookings");
    if (statBookings) {
      statBookings.addEventListener("click", () => switchProfileTab("gatherings"));
    }
    const statConnections = modalBody.querySelector("#statCardConnections");
    if (statConnections) {
      statConnections.addEventListener("click", () => switchProfileTab("connections"));
    }

    // Camera icon & Avatar Click: directly opens file picker and scrolls to Photo Settings
    const cameraBtn = modalBody.querySelector("#btnAvatarQuickEdit");
    const avatarWrap = modalBody.querySelector("#userProfileAvatarWrap");

    function handleQuickPhotoAction(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Switch to settings tab
      switchProfileTab("settings");

      // Scroll smoothly to photo section and pulse highlight
      const photoSection = modalBody.querySelector("#profilePhotoSection");
      if (photoSection) {
        modalBody.scrollTo({
          top: photoSection.offsetTop - 12,
          behavior: "smooth"
        });
        photoSection.classList.add("photo-section-highlight");
        setTimeout(() => photoSection.classList.remove("photo-section-highlight"), 1800);
      }

      // Synchronously trigger file picker input
      const localInput = modalBody.querySelector("#localAvatarFileInput");
      if (localInput) {
        localInput.click();
      }

      showToast("📷 Select a photo, or choose from the avatar options below!", "info");
    }

    if (cameraBtn) {
      cameraBtn.addEventListener("click", handleQuickPhotoAction);
    }
    if (avatarWrap) {
      avatarWrap.addEventListener("click", (e) => {
        if (e.target !== cameraBtn) {
          handleQuickPhotoAction(e);
        }
      });
      avatarWrap.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleQuickPhotoAction(e);
        }
      });
    }

    // User Profile Share Button Handler
    const userShareBtn = modalBody.querySelector("#userProfileShareBtn");
    if (userShareBtn) {
      userShareBtn.addEventListener("click", () => {
        const url = window.location.origin + window.location.pathname + "#profile";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            showToast("🔗 Profile link copied to clipboard!", "success");
          }).catch(() => {
            promptCopyFallback(url);
          });
        } else {
          promptCopyFallback(url);
        }
      });
    }

    // Inline Name Editor
    const editNameBtn = modalBody.querySelector("#btnEditDisplayName");
    const nameEditBox = modalBody.querySelector("#userNameEditBox");
    const nameInput = modalBody.querySelector("#userNameInput");
    const saveNameBtn = modalBody.querySelector("#btnSaveName");
    const cancelNameBtn = modalBody.querySelector("#btnCancelName");
    const userDisplayNameEl = modalBody.querySelector("#userDisplayName");

    if (editNameBtn && nameEditBox) {
      editNameBtn.addEventListener("click", () => {
        nameEditBox.style.display = "block";
        if (nameInput) nameInput.focus();
      });
    }
    if (cancelNameBtn && nameEditBox) {
      cancelNameBtn.addEventListener("click", () => {
        nameEditBox.style.display = "none";
      });
    }
    if (saveNameBtn && nameInput) {
      saveNameBtn.addEventListener("click", () => {
        const newName = nameInput.value.trim() || "Member";
        if (!state.currentUser) state.currentUser = {};
        state.currentUser.name = newName;
        state.currentUser.handle = "@" + newName.toLowerCase().replace(/[^a-z0-9]/g, "_");
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state.currentUser));
        updateAuthUI();
        openUserProfileModal("about");
        showToast(`Display name updated to "${newName}"!`, "success");
      });
    }

    // Bio Editor
    const editBioBtn = modalBody.querySelector("#btnEditUserBio");
    const bioDisplay = modalBody.querySelector("#userBioDisplay");
    const bioEditor = modalBody.querySelector("#userBioEditor");
    const bioInput = modalBody.querySelector("#userBioInput");
    const saveBioBtn = modalBody.querySelector("#btnSaveUserBio");
    const cancelBioBtn = modalBody.querySelector("#btnCancelUserBio");

    if (editBioBtn && bioDisplay && bioEditor) {
      editBioBtn.addEventListener("click", () => {
        bioDisplay.style.display = "none";
        bioEditor.style.display = "block";
        if (bioInput) bioInput.focus();
      });
    }
    if (cancelBioBtn && bioDisplay && bioEditor) {
      cancelBioBtn.addEventListener("click", () => {
        bioEditor.style.display = "none";
        bioDisplay.style.display = "block";
      });
    }
    if (saveBioBtn && bioInput) {
      saveBioBtn.addEventListener("click", () => {
        const newBio = bioInput.value.trim();
        if (!state.currentUser) state.currentUser = {};
        state.currentUser.bio = newBio;
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state.currentUser));
        bioDisplay.textContent = `"${newBio}"`;
        bioEditor.style.display = "none";
        bioDisplay.style.display = "block";
        showToast("Profile bio updated!", "success");
      });
    }

    // Quick Bio Prompts
    modalBody.querySelectorAll(".bio-prompt-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const promptText = chip.getAttribute("data-prompt");
        if (promptText && bioInput) {
          bioInput.value = promptText;
          if (bioDisplay && bioEditor && bioDisplay.style.display !== "none") {
            bioDisplay.style.display = "none";
            bioEditor.style.display = "block";
          }
          bioInput.focus();
        }
      });
    });

    // Vibe Pills Toggle
    modalBody.querySelectorAll(".vibe-tag-chip").forEach(pill => {
      pill.addEventListener("click", () => {
        const vibe = pill.getAttribute("data-vibe");
        if (!vibe) return;
        pill.classList.toggle("active");
        const activeVibes = Array.from(modalBody.querySelectorAll(".vibe-tag-chip.active")).map(p => p.getAttribute("data-vibe"));
        const newStyle = activeVibes.join(" · ") || "Friendly Ambivert · Great Listener";
        if (!state.currentUser) state.currentUser = {};
        state.currentUser.socialStyle = newStyle;
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state.currentUser));
        const styleBox = modalBody.querySelector(".profile-social-style-box");
        if (styleBox) styleBox.textContent = newStyle;
        showToast("Table vibes updated!", "success");
      });
    });

    // Topic remove
    modalBody.querySelectorAll(".btn-remove-topic").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const topicToRemove = btn.getAttribute("data-topic");
        if (!topicToRemove) return;
        if (!state.currentUser) state.currentUser = {};
        const curTopics = state.currentUser.favoriteTopics || user.favoriteTopics || [];
        state.currentUser.favoriteTopics = curTopics.filter(t => t !== topicToRemove);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state.currentUser));
        openUserProfileModal("about");
        showToast(`Removed "${topicToRemove}".`, "info");
      });
    });

    // Add Topic Box Toggle
    const toggleAddTopicBtn = modalBody.querySelector("#btnToggleAddTopic");
    const addTopicBox = modalBody.querySelector("#addTopicBox");
    const newTopicInput = modalBody.querySelector("#newTopicInput");
    const addTopicSubmit = modalBody.querySelector("#btnAddTopicSubmit");
    const addTopicCancel = modalBody.querySelector("#btnAddTopicCancel");

    if (toggleAddTopicBtn && addTopicBox) {
      toggleAddTopicBtn.addEventListener("click", () => {
        addTopicBox.style.display = "block";
        if (newTopicInput) newTopicInput.focus();
      });
    }
    if (addTopicCancel && addTopicBox) {
      addTopicCancel.addEventListener("click", () => {
        addTopicBox.style.display = "none";
      });
    }
    function handleAddNewTopic(topicName) {
      if (!topicName || !topicName.trim()) return;
      if (!state.currentUser) state.currentUser = {};
      const curTopics = state.currentUser.favoriteTopics || user.favoriteTopics || [];
      if (!curTopics.includes(topicName.trim())) {
        curTopics.push(topicName.trim());
        state.currentUser.favoriteTopics = curTopics;
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state.currentUser));
        openUserProfileModal("about");
        showToast(`Added "${topicName.trim()}" to favorite topics!`, "success");
      } else {
        showToast(`Topic already added.`, "info");
      }
    }
    if (addTopicSubmit && newTopicInput) {
      addTopicSubmit.addEventListener("click", () => {
        handleAddNewTopic(newTopicInput.value);
      });
      newTopicInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAddNewTopic(newTopicInput.value);
        }
      });
    }
    modalBody.querySelectorAll(".popular-topic-suggest").forEach(btn => {
      btn.addEventListener("click", () => {
        handleAddNewTopic(btn.getAttribute("data-topic"));
      });
    });

    // Gatherings actions
    modalBody.querySelectorAll(".profile-open-chat-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const meetupId = btn.getAttribute("data-meetup-id");
        if (meetupId) {
          elements.profileModal.close();
          if (typeof openChatDrawer === "function") {
            openChatDrawer(meetupId);
          }
        }
      });
    });

    modalBody.querySelectorAll(".profile-view-meetup-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const meetupId = btn.getAttribute("data-meetup-id");
        if (meetupId) {
          elements.profileModal.close();
          if (typeof openReservationModal === "function") {
            openReservationModal(meetupId);
          }
        }
      });
    });

    // Profile History Subnav & Actions (All Meetups, I Hosted Meetups, Clear & Delete)
    modalBody.querySelectorAll(".profile-history-toggle-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        state.profileHistoryFilter = pill.getAttribute("data-profile-filter") || "all";
        openUserProfileModal("gatherings");
      });
    });

    const profileClearHistoryBtn = modalBody.querySelector("#btnProfileClearHistory");
    if (profileClearHistoryBtn) {
      profileClearHistoryBtn.addEventListener("click", () => {
        openClearHistoryConfirm();
      });
    }

    modalBody.querySelectorAll(".profile-delete-history-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const meetupId = btn.getAttribute("data-meetup-id");
        if (meetupId) {
          openDeleteHistoryItemConfirm(meetupId);
        }
      });
    });

    const profileHostBtn = modalBody.querySelector("#btnProfileHostGathering");
    if (profileHostBtn) {
      profileHostBtn.addEventListener("click", () => {
        elements.profileModal.close();
      });
    }

    modalBody.querySelectorAll(".profile-cancel-rsvp-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const meetupId = btn.getAttribute("data-meetup-id");
        if (!meetupId) return;
        if (confirm("Are you sure you want to cancel this reservation?")) {
          state.bookedIds = (state.bookedIds || []).filter(id => id !== meetupId);
          localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(state.bookedIds));
          if (typeof renderMeetups === "function") renderMeetups();
          openUserProfileModal("gatherings");
          showToast("Reservation cancelled.", "info");
        }
      });
    });

    const exploreGatheringsBtn = modalBody.querySelector("#btnExploreGatheringsFromProfile");
    if (exploreGatheringsBtn) {
      exploreGatheringsBtn.addEventListener("click", () => {
        elements.profileModal.close();
        const meetupsSection = document.getElementById("meetups");
        if (meetupsSection) {
          meetupsSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    // Connections actions
    modalBody.querySelectorAll(".profile-view-friend-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const profileId = btn.getAttribute("data-profile-id");
        if (profileId) {
          openProfileModal(profileId, "you");
        }
      });
    });

    modalBody.querySelectorAll(".profile-wave-friend-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const friendName = btn.getAttribute("data-name") || "your table friend";
        showToast(`👋 You waved hello to ${friendName}!`, "success");
      });
    });

    const sampleFriendBtn = modalBody.querySelector("#btnConnectSampleFriend");
    if (sampleFriendBtn) {
      sampleFriendBtn.addEventListener("click", () => {
        if (!state.connectedMemberIds) state.connectedMemberIds = [];
        if (!state.connectedMemberIds.includes("william_stone")) {
          state.connectedMemberIds.push("william_stone");
          localStorage.setItem("outspire_connected_members", JSON.stringify(state.connectedMemberIds));
        }
        openUserProfileModal("connections");
        showToast("Connected with William Stone!", "success");
      });
    }

    // 1-Click Avatar Selection
    modalBody.querySelectorAll(".avatar-gallery-item").forEach(item => {
      item.addEventListener("click", () => {
        const newUrl = item.getAttribute("data-avatar-url");
        if (newUrl) {
          if (!state.currentUser) state.currentUser = {};
          state.currentUser.avatar = newUrl;
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state.currentUser));
          updateAuthUI();
          openUserProfileModal("settings");
          showToast("Profile photo updated!", "success");
        }
      });
    });

    // Custom Avatar URL
    const applyUrlBtn = modalBody.querySelector("#btnApplyAvatarUrl");
    const customUrlInput = modalBody.querySelector("#customAvatarUrlInput");
    if (applyUrlBtn && customUrlInput) {
      applyUrlBtn.addEventListener("click", () => {
        const newUrl = customUrlInput.value.trim();
        if (newUrl) {
          if (!state.currentUser) state.currentUser = {};
          state.currentUser.avatar = newUrl;
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state.currentUser));
          updateAuthUI();
          openUserProfileModal("settings");
          showToast("Profile photo updated from URL!", "success");
        } else {
          showToast("Please enter a valid image URL.", "error");
        }
      });
    }

    // Local File Upload
    const fileInput = modalBody.querySelector("#localAvatarFileInput");
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (uploadEvent) => {
            const dataUrl = uploadEvent.target.result;
            if (!state.currentUser) state.currentUser = {};
            state.currentUser.avatar = dataUrl;
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state.currentUser));
            updateAuthUI();
            openUserProfileModal("settings");
            showToast("Photo uploaded from your device!", "success");
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Switch to profile logo SVG
    const resetToLogoBtn = modalBody.querySelector("#btnResetToLogo");
    if (resetToLogoBtn) {
      resetToLogoBtn.addEventListener("click", () => {
        if (state.currentUser) {
          state.currentUser.avatar = "";
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state.currentUser));
        }
        updateAuthUI();
        openUserProfileModal("settings");
        showToast("Switched to default profile logo SVG.", "info");
      });
    }

    // Basic Settings Save
    const saveBasicSettingsBtn = modalBody.querySelector("#btnSaveBasicSettings");
    const settingsNameInput = modalBody.querySelector("#settingsNameInput");
    const settingsEmailInput = modalBody.querySelector("#settingsEmailInput");
    const settingsCitySelect = modalBody.querySelector("#settingsCitySelect");

    if (saveBasicSettingsBtn) {
      saveBasicSettingsBtn.addEventListener("click", () => {
        if (!state.currentUser) state.currentUser = {};
        if (settingsNameInput) state.currentUser.name = settingsNameInput.value.trim() || "Member";
        if (settingsEmailInput) state.currentUser.email = settingsEmailInput.value.trim() || "user@example.com";
        if (settingsCitySelect) {
          state.currentUser.city = settingsCitySelect.value;
          state.userCity = settingsCitySelect.value;
        }
        state.currentUser.handle = "@" + (state.currentUser.name || 'member').toLowerCase().replace(/[^a-z0-9]/g, "_");
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state.currentUser));
        updateAuthUI();
        openUserProfileModal("settings");
        showToast("Account details saved successfully!", "success");
      });
    }

    if (!elements.profileModal.open) {
      elements.profileModal.showModal();
    }
  }

  // --------------------------------------------------------------------------
  // Location Selector Options & Cascading Dropdowns
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // Location Selector Options & Cascading Dropdowns
  // --------------------------------------------------------------------------
  function initLocationSelectorInQuiz(answers, countryId = "country", stateId = "state", cityId = "city") {
    const countrySelect = document.getElementById(countryId);
    const stateSelect = document.getElementById(stateId);
    const citySelect = document.getElementById(cityId);
    if (!countrySelect || !stateSelect || !citySelect) return;

    const presets = (typeof LOCATION_PRESETS !== "undefined" && Array.isArray(LOCATION_PRESETS))
      ? LOCATION_PRESETS
      : [];

    let curCountry = (answers && answers.country) || state.userCountry || "United States";
    let curState = (answers && answers.state) || state.userState || "New York";
    let curCity = (answers && answers.city) || state.userCity || "New York City";

    // Populate country options
    let countryHTML = "";
    presets.forEach(p => {
      countryHTML += `<option value="${escapeHTML(p.country)}">${escapeHTML(p.country)}</option>`;
    });
    countrySelect.innerHTML = countryHTML;

    function populateStates(countryVal, preferredState) {
      const countryObj = presets.find(p => p.country.toLowerCase() === (countryVal || "").toLowerCase());
      let stateHTML = "";
      if (countryObj && countryObj.states && countryObj.states.length > 0) {
        countryObj.states.forEach(s => {
          stateHTML += `<option value="${escapeHTML(s.name)}">${escapeHTML(s.name)}</option>`;
        });
      }
      stateSelect.innerHTML = stateHTML;

      if (preferredState) {
        const optionsList = Array.from(stateSelect.options);
        const exactMatch = optionsList.find(o => o.value.toLowerCase() === preferredState.toLowerCase());
        const abbrMap = {
          "al": "alabama", "ak": "alaska", "az": "arizona", "ar": "arkansas", "ca": "california",
          "co": "colorado", "ct": "connecticut", "de": "delaware", "dc": "district of columbia",
          "fl": "florida", "ga": "georgia", "hi": "hawaii", "id": "idaho", "il": "illinois",
          "in": "indiana", "ia": "iowa", "ks": "kansas", "ky": "kentucky", "la": "louisiana",
          "me": "maine", "md": "maryland", "ma": "massachusetts", "mi": "michigan", "mn": "minnesota",
          "ms": "mississippi", "mo": "missouri", "mt": "montana", "ne": "nebraska", "nv": "nevada",
          "nh": "new hampshire", "nj": "new jersey", "nm": "new mexico", "ny": "new york",
          "nc": "north carolina", "nd": "north dakota", "oh": "ohio", "ok": "oklahoma", "or": "oregon",
          "pa": "pennsylvania", "pr": "puerto rico", "ri": "rhode island", "sc": "south carolina",
          "sd": "south dakota", "tn": "tennessee", "tx": "texas", "ut": "utah", "vt": "vermont",
          "va": "virginia", "wa": "washington", "wv": "west virginia", "wi": "wisconsin", "wy": "wyoming",
          "on": "ontario", "bc": "british columbia", "qc": "quebec", "ab": "alberta", "mb": "manitoba",
          "ns": "nova scotia", "nb": "new brunswick", "sk": "saskatchewan", "pe": "prince edward island",
          "nl": "newfoundland and labrador", "nt": "northwest territories", "yt": "yukon", "nu": "nunavut",
          "nsw": "new south wales", "vic": "victoria", "qld": "queensland", "sa": "south australia",
          "tas": "tasmania", "act": "australian capital territory", "nt_au": "northern territory"
        };
        const mappedName = abbrMap[preferredState.toLowerCase().trim()];
        const abbrMatch = mappedName ? optionsList.find(o => o.value.toLowerCase() === mappedName) : null;
        const substrMatch = optionsList.find(o => {
          const v = o.value.toLowerCase();
          const p = preferredState.toLowerCase();
          return v.includes(p) || p.includes(v);
        });

        const chosen = exactMatch || abbrMatch || substrMatch;
        if (chosen) {
          stateSelect.value = chosen.value;
        } else {
          stateSelect.selectedIndex = 0;
        }
      } else {
        stateSelect.selectedIndex = 0;
      }
    }

    function populateCities(countryVal, stateVal, preferredCity) {
      const countryObj = presets.find(p => p.country.toLowerCase() === (countryVal || "").toLowerCase());
      let cityHTML = "";
      if (countryObj && countryObj.states) {
        const stateObj = countryObj.states.find(s => s.name.toLowerCase() === (stateVal || "").toLowerCase());
        if (stateObj && stateObj.cities) {
          stateObj.cities.forEach(c => {
            cityHTML += `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`;
          });
        }
      }
      citySelect.innerHTML = cityHTML;

      if (preferredCity) {
        const optionsList = Array.from(citySelect.options);
        const exactMatch = optionsList.find(o => o.value.toLowerCase() === preferredCity.toLowerCase());
        const normMatch = exactMatch || optionsList.find(o => {
          const v = o.value.toLowerCase().replace(/\s+city$/i, "").trim();
          const p = preferredCity.toLowerCase().replace(/\s+city$/i, "").trim();
          return v === p;
        });
        const substrMatch = normMatch || optionsList.find(o => {
          const v = o.value.toLowerCase();
          const p = preferredCity.toLowerCase();
          return v.includes(p) || p.includes(v);
        });

        const chosen = exactMatch || normMatch || substrMatch;
        if (chosen) {
          citySelect.value = chosen.value;
        } else {
          citySelect.selectedIndex = 0;
        }
      } else {
        citySelect.selectedIndex = 0;
      }
    }

    // Set initial Country
    const optionsList = Array.from(countrySelect.options);
    const countryAliases = {
      "us": "united states",
      "usa": "united states",
      "united states of america": "united states",
      "uk": "united kingdom",
      "great britain": "united kingdom",
      "england": "united kingdom",
      "uae": "united arab emirates",
      "emirates": "united arab emirates"
    };
    const exactCountry = optionsList.find(o => o.value.toLowerCase() === curCountry.toLowerCase());
    const aliasKey = curCountry.toLowerCase().trim();
    const aliasCountry = countryAliases[aliasKey] 
      ? optionsList.find(o => o.value.toLowerCase() === countryAliases[aliasKey])
      : null;
    const substrCountry = optionsList.find(o => {
      const v = o.value.toLowerCase();
      const c = curCountry.toLowerCase();
      return v.includes(c) || c.includes(v);
    });

    const chosenCountry = exactCountry || aliasCountry || substrCountry;
    if (chosenCountry) {
      countrySelect.value = chosenCountry.value;
    } else {
      countrySelect.selectedIndex = 0;
    }

    populateStates(countrySelect.value, curState);
    populateCities(countrySelect.value, stateSelect.value, curCity);

    // Dynamic Cascading Listeners
    countrySelect.addEventListener("change", () => {
      const selectedC = countrySelect.value;
      populateStates(selectedC, "");
      populateCities(selectedC, stateSelect.value, "");
      if (answers) {
        answers.country = selectedC;
        answers.state = stateSelect.value;
        answers.city = citySelect.value;
      }
      state.quizAnswers.country = selectedC;
      state.quizAnswers.state = stateSelect.value;
      state.quizAnswers.city = citySelect.value;
      localStorage.setItem(STORAGE_KEY_QUIZ, JSON.stringify(state.quizAnswers));
      applyUserLocationFromQuiz(state.quizAnswers.city, state.quizAnswers.country, state.quizAnswers.state);
    });

    stateSelect.addEventListener("change", () => {
      const selectedS = stateSelect.value;
      populateCities(countrySelect.value, selectedS, "");
      if (answers) {
        answers.state = selectedS;
        answers.city = citySelect.value;
      }
      state.quizAnswers.state = selectedS;
      state.quizAnswers.city = citySelect.value;
      localStorage.setItem(STORAGE_KEY_QUIZ, JSON.stringify(state.quizAnswers));
      applyUserLocationFromQuiz(state.quizAnswers.city, state.quizAnswers.country, state.quizAnswers.state);
    });

    citySelect.addEventListener("change", () => {
      if (answers) {
        answers.city = citySelect.value;
      }
      state.quizAnswers.city = citySelect.value;
      localStorage.setItem(STORAGE_KEY_QUIZ, JSON.stringify(state.quizAnswers));
      applyUserLocationFromQuiz(state.quizAnswers.city, state.quizAnswers.country, state.quizAnswers.state);
    });
  }

  // --------------------------------------------------------------------------
  // Interactive Personality & Identity Matcher Wizard (Wireframe Steps 1-19)
  // --------------------------------------------------------------------------
  function openQuestionnaire(stepIndex = 0) {
    openQuizSideDrawer(stepIndex);
  }

  // --------------------------------------------------------------------------
  // Right-Side Slide-Over Questionnaire Drawer (For Completed Users)
  // --------------------------------------------------------------------------
  function openQuizSideDrawer(stepIndex = null) {
    if (!elements.quizSideDrawer) return;
    if (stepIndex !== null && typeof stepIndex === "number") {
      state.drawerQuizStep = stepIndex;
      state.drawerQuizTab = "stepper";
    }
    elements.quizSideDrawer.classList.add("open");
    elements.quizSideDrawer.setAttribute("aria-hidden", "false");
    if (elements.quizDrawerOverlay) {
      elements.quizDrawerOverlay.classList.add("open");
      elements.quizDrawerOverlay.setAttribute("aria-hidden", "false");
    }
    renderDrawerQuizContent();
  }

  function closeQuizSideDrawer() {
    if (!elements.quizSideDrawer) return;
    elements.quizSideDrawer.classList.remove("open");
    elements.quizSideDrawer.setAttribute("aria-hidden", "true");
    if (elements.quizDrawerOverlay) {
      elements.quizDrawerOverlay.classList.remove("open");
      elements.quizDrawerOverlay.setAttribute("aria-hidden", "true");
    }
  }

  function renderDrawerQuizContent() {
    if (!elements.quizDrawerBody) return;

    if (elements.drawerWizardTab) {
      elements.drawerWizardTab.classList.toggle("active", state.drawerQuizTab === "stepper");
    }
    if (elements.drawerSummaryTab) {
      elements.drawerSummaryTab.classList.toggle("active", state.drawerQuizTab === "summary");
    }

    if (state.drawerQuizTab === "summary") {
      if (elements.drawerStepIndicator) {
        elements.drawerStepIndicator.textContent = "All 19 Answers";
      }

      let summaryHTML = `<div class="drawer-summary-list">`;
      QUIZ_STEPS.forEach((s, idx) => {
        let answerText = "";
        if (s.type === "location-selector") {
          const locParts = [state.quizAnswers.city, state.quizAnswers.state, state.quizAnswers.country].filter(Boolean);
          answerText = locParts.length > 0 ? "📍 " + locParts.join(", ") : "Not specified";
        } else if (s.fields) {
          const names = [state.quizAnswers.firstName, state.quizAnswers.middleName, state.quizAnswers.lastName].filter(Boolean).join(" ");
          answerText = names || "Not specified";
        } else if (Array.isArray(state.quizAnswers[s.fieldId])) {
          answerText = state.quizAnswers[s.fieldId].length > 0 ? state.quizAnswers[s.fieldId].join(", ") : "Not specified";
        } else {
          answerText = state.quizAnswers[s.fieldId] || "Not specified";
        }

        summaryHTML += `
          <div class="drawer-summary-card">
            <div class="drawer-summary-card-left">
              <div class="drawer-summary-step-num">Step ${s.stepNumber} · ${escapeHTML(s.category)}</div>
              <div class="drawer-summary-question">${escapeHTML(s.title)}</div>
              <div class="drawer-summary-answer">${escapeHTML(answerText)}</div>
            </div>
            <button class="drawer-summary-edit-btn" data-step-index="${idx}" type="button">
              ✏️ Edit
            </button>
          </div>
        `;
      });
      summaryHTML += `
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; gap: 10px;">
          <button class="btn btn-secondary btn-sm" id="drawerSummaryCloseBtn" type="button">Close Panel</button>
          <button class="btn btn-primary btn-sm" id="drawerSummarySaveBtn" type="button">Save & View Matches ✨</button>
        </div>
      </div>`;

      elements.quizDrawerBody.innerHTML = summaryHTML;

      elements.quizDrawerBody.querySelectorAll(".drawer-summary-edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const targetStep = parseInt(btn.getAttribute("data-step-index"), 10);
          state.drawerQuizStep = targetStep;
          state.drawerQuizTab = "stepper";
          renderDrawerQuizContent();
        });
      });

      const summaryCloseBtn = document.getElementById("drawerSummaryCloseBtn");
      if (summaryCloseBtn) {
        summaryCloseBtn.addEventListener("click", closeQuizSideDrawer);
      }

      const summarySaveBtn = document.getElementById("drawerSummarySaveBtn");
      if (summarySaveBtn) {
        summarySaveBtn.addEventListener("click", () => {
          state.quizCompleted = true;
          localStorage.setItem(STORAGE_KEY_QUIZ_COMPLETED, "true");
          renderQuizResults();
          renderMeetups();
          showToast("✨ Matches updated based on your questionnaire!", "success");
          closeQuizSideDrawer();
          const quizSec = document.getElementById("quiz");
          if (quizSec) quizSec.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      return;
    }

    // Stepper mode
    const step = QUIZ_STEPS[state.drawerQuizStep] || QUIZ_STEPS[0];
    if (elements.drawerStepIndicator) {
      elements.drawerStepIndicator.textContent = `Step ${state.drawerQuizStep + 1} of ${QUIZ_STEPS.length}`;
    }
    const progressPct = Math.round(((state.drawerQuizStep + 1) / QUIZ_STEPS.length) * 100);

    let contentHTML = "";

    if (step.type === "location-selector") {
      contentHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div class="form-group">
            <label for="drawer_country" class="form-label">Country <span class="required">*</span></label>
            <select id="drawer_country" class="form-input quiz-select-input" aria-label="Select Country"></select>
          </div>
          <div class="form-group">
            <label for="drawer_state" class="form-label">State / Province <span class="required">*</span></label>
            <select id="drawer_state" class="form-input quiz-select-input" aria-label="Select State or Province"></select>
          </div>
          <div class="form-group">
            <label for="drawer_city" class="form-label">City / Region <span class="required">*</span></label>
            <select id="drawer_city" class="form-input quiz-select-input" aria-label="Select City or Region"></select>
          </div>
        </div>
      `;
    } else if (step.fields) {
      contentHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${step.fields.map(f => `
            <div class="form-group">
              <label for="drawer_${f.id}" class="form-label">${escapeHTML(f.label)}</label>
              <input 
                type="${f.type}" 
                id="drawer_${f.id}" 
                class="form-input drawer-field-input" 
                data-field="${f.id}"
                placeholder="${escapeHTML(f.placeholder || '')}" 
                value="${escapeHTML(state.quizAnswers[f.id] || '')}"
                ${f.min ? `min="${f.min}"` : ''}
                ${f.max ? `max="${f.max}"` : ''}
              />
            </div>
          `).join("")}
        </div>
      `;
    } else if (step.type === "choice" || step.type === "multi-choice") {
      const isMulti = step.type === "multi-choice";
      const selectedVal = state.quizAnswers[step.fieldId];
      contentHTML = `
        <div class="choice-grid" style="grid-template-columns: 1fr; gap: 10px;">
          ${step.options.map(opt => {
            const isSelected = isMulti 
              ? (Array.isArray(selectedVal) && selectedVal.includes(opt))
              : selectedVal === opt;
            return `
              <div class="choice-card ${isSelected ? 'selected' : ''}" data-value="${escapeHTML(opt)}" data-field="${step.fieldId}" data-multi="${isMulti}">
                <span>${escapeHTML(opt)}</span>
                <span class="check-circle">${isSelected ? '✓' : ''}</span>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }

    elements.quizDrawerBody.innerHTML = `
      <div class="drawer-step-header">
        <div class="drawer-step-meta">
          <span class="quiz-step-badge">${escapeHTML(step.category)}</span>
          <span style="font-size: 0.84rem; color: var(--text-muted);">Step ${state.drawerQuizStep + 1} of ${QUIZ_STEPS.length}</span>
        </div>
        <div class="drawer-progress-bar-bg" aria-label="Progress: ${progressPct}%">
          <div class="drawer-progress-fill" style="width: ${progressPct}%;"></div>
        </div>
        <h4 class="drawer-step-title">${escapeHTML(step.title)}</h4>
        <p class="drawer-step-subtitle">${escapeHTML(step.subtitle)}</p>
      </div>

      <div class="drawer-step-content">
        ${contentHTML}
      </div>

      <div class="drawer-step-footer">
        <button class="btn btn-secondary btn-sm" id="drawerPrevStepBtn" ${state.drawerQuizStep === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
          ← Back
        </button>
        <select class="drawer-step-jump-select" id="drawerJumpSelect" aria-label="Jump to question">
          ${QUIZ_STEPS.map((s, i) => `
            <option value="${i}" ${i === state.drawerQuizStep ? 'selected' : ''}>
              ${i + 1}. ${escapeHTML(s.title.slice(0, 24))}...
            </option>
          `).join("")}
        </select>
        <button class="btn btn-primary btn-sm" id="drawerNextStepBtn">
          ${state.drawerQuizStep === QUIZ_STEPS.length - 1 ? 'Finish' : 'Next Step →'}
        </button>
      </div>
    `;

    // Attach step interactions
    if (step.type === "location-selector") {
      initLocationSelectorInQuiz(state.quizAnswers, "drawer_country", "drawer_state", "drawer_city");
    }

    elements.quizDrawerBody.querySelectorAll(".choice-card").forEach(card => {
      card.addEventListener("click", () => {
        const field = card.getAttribute("data-field");
        const val = card.getAttribute("data-value");
        const isMulti = card.getAttribute("data-multi") === "true";

        if (isMulti) {
          if (!state.quizAnswers[field]) state.quizAnswers[field] = [];
          const idx = state.quizAnswers[field].indexOf(val);
          if (idx > -1) {
            state.quizAnswers[field].splice(idx, 1);
          } else {
            if (state.quizAnswers[field].length < (step.maxChoices || 3)) {
              state.quizAnswers[field].push(val);
            } else {
              showToast(`You can pick up to ${step.maxChoices} topics.`, "info");
              return;
            }
          }
        } else {
          state.quizAnswers[field] = val;
        }

        localStorage.setItem(STORAGE_KEY_QUIZ, JSON.stringify(state.quizAnswers));
        renderDrawerQuizContent();
      });
    });

    elements.quizDrawerBody.querySelectorAll(".drawer-field-input").forEach(input => {
      input.addEventListener("input", () => {
        const field = input.getAttribute("data-field");
        state.quizAnswers[field] = input.value.trim();
        localStorage.setItem(STORAGE_KEY_QUIZ, JSON.stringify(state.quizAnswers));
      });
    });

    const jumpSelect = document.getElementById("drawerJumpSelect");
    if (jumpSelect) {
      jumpSelect.addEventListener("change", (e) => {
        state.drawerQuizStep = parseInt(e.target.value, 10);
        renderDrawerQuizContent();
      });
    }

    const prevBtn = document.getElementById("drawerPrevStepBtn");
    if (prevBtn && state.drawerQuizStep > 0) {
      prevBtn.addEventListener("click", () => {
        state.drawerQuizStep--;
        renderDrawerQuizContent();
      });
    }

    const nextBtn = document.getElementById("drawerNextStepBtn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (step.type === "location-selector") {
          const c = document.getElementById("drawer_country");
          const s = document.getElementById("drawer_state");
          const ci = document.getElementById("drawer_city");
          if (ci && ci.value) {
            state.quizAnswers.country = c ? c.value : state.quizAnswers.country;
            state.quizAnswers.state = s ? s.value : state.quizAnswers.state;
            state.quizAnswers.city = ci.value;
            localStorage.setItem(STORAGE_KEY_QUIZ, JSON.stringify(state.quizAnswers));
            applyUserLocationFromQuiz(ci.value, c ? c.value : "", s ? s.value : "");
          }
        }

        if (state.drawerQuizStep === QUIZ_STEPS.length - 1) {
          state.quizCompleted = true;
          localStorage.setItem(STORAGE_KEY_QUIZ_COMPLETED, "true");
          renderQuizResults();
          renderMeetups();
          showToast("✨ Matches updated! Your preferences have been refreshed.", "success");
          closeQuizSideDrawer();
          const meetupsSec = document.getElementById("meetups");
          if (meetupsSec) meetupsSec.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          state.drawerQuizStep++;
          renderDrawerQuizContent();
        }
      });
    }
  }

  function renderQuizStep() {
    if (!elements.quizContainer) return;
    const step = QUIZ_STEPS[state.quizStep];

    if (!step) {
      renderQuizResults();
      return;
    }

    // Reset completed view styling when in interactive wizard mode
    const quizSec = document.getElementById("quiz");
    if (quizSec) quizSec.classList.remove("quiz-completed-view");
    if (elements.quizContainer) elements.quizContainer.classList.remove("result-mode");

    const sectionTag = document.getElementById("quizSectionTag");
    const sectionHeading = document.getElementById("quizHeading");
    const sectionDesc = document.getElementById("quizSectionDesc");
    if (sectionTag) sectionTag.textContent = "Personalized Gathering Curation";
    if (sectionHeading) sectionHeading.textContent = "Find Your Perfect Gathering";
    if (sectionDesc) sectionDesc.textContent = "We match strangers based on conversational balance, social battery, and shared curiosity. Complete this short questionnaire to see your ideal table.";

    const progressPct = Math.round(((state.quizStep + 1) / QUIZ_STEPS.length) * 100);
    const answers = state.quizAnswers;

    let contentHTML = "";

    if (step.type === "location-selector") {
      contentHTML = `
        <div class="quiz-form-grid three-col">
          <div class="form-group">
            <label for="country" class="form-label">Country <span class="required">*</span></label>
            <select id="country" name="country" class="form-input quiz-select-input" aria-label="Select Country">
            </select>
          </div>

          <div class="form-group">
            <label for="state" class="form-label">State / Province <span class="required">*</span></label>
            <select id="state" name="state" class="form-input quiz-select-input" aria-label="Select State or Province">
            </select>
          </div>

          <div class="form-group">
            <label for="city" class="form-label">City / Region <span class="required">*</span></label>
            <select id="city" name="city" class="form-input quiz-select-input" aria-label="Select City or Region">
            </select>
          </div>
        </div>
      `;
    } else if (step.fields) {
      // Text or number inputs
      contentHTML = `
        <div class="quiz-form-grid ${step.fields.length === 1 ? 'single-col' : (step.fields.length === 3 ? 'three-col' : '')}">
          ${step.fields.map(f => `
            <div class="form-group">
              <label for="${f.id}" class="form-label">${escapeHTML(f.label)}</label>
              <input 
                type="${f.type}" 
                id="${f.id}" 
                name="${f.id}" 
                class="form-input quiz-text-input" 
                placeholder="${escapeHTML(f.placeholder || '')}"
                value="${escapeHTML(answers[f.id] || '')}"
                ${f.min ? `min="${f.min}"` : ''}
                ${f.max ? `max="${f.max}"` : ''}
              />
            </div>
          `).join("")}
        </div>
      `;
    } else if (step.type === "choice") {
      // Single choice
      contentHTML = `
        <div class="choice-grid">
          ${step.options.map(opt => {
            const isSelected = answers[step.fieldId] === opt;
            return `
              <div class="choice-card ${isSelected ? 'selected' : ''}" data-value="${escapeHTML(opt)}" data-field="${step.fieldId}">
                <span>${escapeHTML(opt)}</span>
                <span class="check-circle">${isSelected ? '✓' : ''}</span>
              </div>
            `;
          }).join("")}
        </div>
      `;
    } else if (step.type === "multi-choice") {
      // Multi choice
      const selectedArr = answers[step.fieldId] || [];
      contentHTML = `
        <div class="choice-grid">
          ${step.options.map(opt => {
            const isSelected = selectedArr.includes(opt);
            return `
              <div class="choice-card ${isSelected ? 'selected' : ''}" data-value="${escapeHTML(opt)}" data-field="${step.fieldId}" data-multi="true">
                <span>${escapeHTML(opt)}</span>
                <span class="check-circle">${isSelected ? '✓' : ''}</span>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }

    elements.quizContainer.innerHTML = `
      <div class="quiz-header">
        <div class="quiz-progress-info">
          <span class="quiz-step-badge">${escapeHTML(step.category)}</span>
          <span style="font-size: 0.88rem; color: var(--text-muted);">Step ${state.quizStep + 1} of ${QUIZ_STEPS.length}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 14px; flex-grow: 1; justify-content: flex-end;">
          <div class="quiz-progress-bar-bg" aria-label="Progress: ${progressPct}%">
            <div class="quiz-progress-fill" style="width: ${progressPct}%;"></div>
          </div>
          ${state.quizStep > 0 ? `
            <button class="quiz-restart-mini-btn" id="quizRestartCardBtn" title="Restart Questionnaire from Step 1">
              ↺ Restart
            </button>
          ` : ''}
        </div>
      </div>

      <h3 class="quiz-step-title">${escapeHTML(step.title)}</h3>
      <p class="quiz-step-subtitle">${escapeHTML(step.subtitle)}</p>

      <div class="quiz-step-body">
        ${contentHTML}
      </div>

      <div class="quiz-footer">
        <button class="btn btn-secondary btn-sm" id="quizBackBtn" ${state.quizStep === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
          ← Back
        </button>
        <button class="btn btn-primary btn-sm" id="quizNextBtn">
          ${state.quizStep === QUIZ_STEPS.length - 1 ? 'Finish' : 'Continue →'}
        </button>
      </div>
    `;

    // Attach interactions
    if (step.type === "location-selector") {
      initLocationSelectorInQuiz(answers);
    }

    elements.quizContainer.querySelectorAll(".choice-card").forEach(card => {
      card.addEventListener("click", () => {
        const field = card.getAttribute("data-field");
        const val = card.getAttribute("data-value");
        const isMulti = card.getAttribute("data-multi") === "true";

        if (isMulti) {
          if (!state.quizAnswers[field]) state.quizAnswers[field] = [];
          const idx = state.quizAnswers[field].indexOf(val);
          if (idx > -1) {
            state.quizAnswers[field].splice(idx, 1);
          } else {
            if (state.quizAnswers[field].length < (step.maxChoices || 3)) {
              state.quizAnswers[field].push(val);
            } else {
              showToast(`You can pick up to ${step.maxChoices} topics.`, "info");
              return;
            }
          }
        } else {
          state.quizAnswers[field] = val;
        }

        localStorage.setItem(STORAGE_KEY_QUIZ, JSON.stringify(state.quizAnswers));
        renderQuizStep();
      });
    });

    const backBtn = document.getElementById("quizBackBtn");
    if (backBtn && state.quizStep > 0) {
      backBtn.addEventListener("click", () => {
        state.quizStep--;
        renderQuizStep();
      });
    }

    const restartCardBtn = document.getElementById("quizRestartCardBtn");
    if (restartCardBtn) {
      restartCardBtn.addEventListener("click", () => {
        openQuestionnaire(0);
      });
    }

    const nextBtn = document.getElementById("quizNextBtn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        // Location selector handling (Step 6)
        if (step.type === "location-selector") {
          const countrySelect = document.getElementById("country");
          const stateSelect = document.getElementById("state");
          const citySelect = document.getElementById("city");

          const finalCountry = countrySelect?.value.trim();
          const finalState = stateSelect?.value.trim();
          const finalCity = citySelect?.value.trim();

          if (!finalCountry) {
            showToast("Please choose your country before continuing.", "warning");
            countrySelect?.focus();
            return;
          }
          if (!finalState) {
            showToast("Please select your state or province before continuing.", "warning");
            stateSelect?.focus();
            return;
          }
          if (!finalCity) {
            showToast("Please choose your city before continuing.", "warning");
            citySelect?.focus();
            return;
          }

          state.quizAnswers.country = finalCountry;
          state.quizAnswers.state = finalState;
          state.quizAnswers.city = finalCity;
          localStorage.setItem(STORAGE_KEY_QUIZ, JSON.stringify(state.quizAnswers));

          applyUserLocationFromQuiz(finalCity, finalCountry, finalState);
        } else if (step.fields) {
          let hasMissingRequired = false;
          let firstMissingEl = null;

          step.fields.forEach(f => {
            const input = document.getElementById(f.id);
            if (input) {
              const val = input.value.trim();
              state.quizAnswers[f.id] = val;
              if (f.required && !val) {
                hasMissingRequired = true;
                input.style.borderColor = "var(--status-danger)";
                if (!firstMissingEl) firstMissingEl = input;
              } else {
                input.style.borderColor = "";
              }
            }
          });
          localStorage.setItem(STORAGE_KEY_QUIZ, JSON.stringify(state.quizAnswers));

          if (hasMissingRequired) {
            const errorMsg = step.stepNumber === 1 
              ? "Please enter your name before continuing." 
              : "Please fill in all required fields before continuing.";
            showToast(errorMsg, "error");
            if (firstMissingEl) firstMissingEl.focus();
            return;
          }
        }

        // REQUIRED AUTHENTICATION:
        // Do not let the person move to the next slide before they sign up or sign in!
        if (state.quizStep === 0 && !state.isAuthenticated) {
          state.pendingQuizAdvance = true;
          const prefillName = [state.quizAnswers.firstName, state.quizAnswers.middleName, state.quizAnswers.lastName]
            .filter(Boolean)
            .join(" ") || state.quizAnswers.firstName || "";

          openAuthModal("signup", prefillName);
          showToast("Please sign up or sign in to continue to the next step.", "info");
          return;
        }

        if (state.quizStep === QUIZ_STEPS.length - 1) {
          state.quizCompleted = true;
          localStorage.setItem(STORAGE_KEY_QUIZ_COMPLETED, "true");
        }

        state.quizStep++;
        renderQuizStep();
      });
    }
  }

  function renderQuizResults() {
    if (!elements.quizContainer) return;
    state.quizCompleted = true;
    localStorage.setItem(STORAGE_KEY_QUIZ_COMPLETED, "true");

    const quizSec = document.getElementById("quiz");
    if (quizSec) quizSec.classList.add("quiz-completed-view");
    if (elements.quizContainer) elements.quizContainer.classList.add("result-mode");

    const sectionTag = document.getElementById("quizSectionTag");
    const sectionHeading = document.getElementById("quizHeading");
    const sectionDesc = document.getElementById("quizSectionDesc");
    if (sectionTag) sectionTag.textContent = "Personalized Gathering Match";
    if (sectionHeading) sectionHeading.textContent = "Your Curated Gathering Match";
    if (sectionDesc) sectionDesc.textContent = "Matched based on your conversational battery, storytelling style, and city preferences.";

    const preferredSize = state.quizAnswers.preferredGroupSize || "";
    let matchedMeetup = state.meetups[0];

    if (preferredSize.includes("2 people")) {
      matchedMeetup = state.meetups.find(m => m.capacity === 2) || matchedMeetup;
    } else if (preferredSize.includes("3–4") || preferredSize.includes("3-4")) {
      matchedMeetup = state.meetups.find(m => m.capacity >= 3 && m.capacity <= 4) || matchedMeetup;
    } else if (preferredSize.includes("5–6") || preferredSize.includes("5-6")) {
      matchedMeetup = state.meetups.find(m => m.capacity >= 5 && m.capacity <= 6) || matchedMeetup;
    } else if (preferredSize.includes("7–10") || preferredSize.includes("7-10")) {
      matchedMeetup = state.meetups.find(m => m.capacity >= 7 && m.capacity <= 10) || matchedMeetup;
    }
    const userName = state.quizAnswers.firstName || "Izhan";

    if (state.quizResultMinimized) {
      elements.quizContainer.innerHTML = `
        <div class="match-minimized-ribbon">
          <div class="match-minimized-info">
            <span class="match-badge-sm">98% Match</span>
            <span>Welcome <strong>${escapeHTML(userName)}</strong>! Your curated gathering is <strong>${escapeHTML(matchedMeetup.title)}</strong> (${escapeHTML(matchedMeetup.venueName)}).</span>
          </div>
          <div class="match-minimized-actions">
            <button class="btn btn-primary btn-sm" id="reserveMatchedTableMinBtn" style="padding: 5px 12px; font-size: 0.8rem;">
              Reserve Seat
            </button>
            <button class="btn btn-ghost btn-sm" id="expandMatchBtn" style="padding: 5px 12px; font-size: 0.8rem;">
              Expand Details ▾
            </button>
          </div>
        </div>
      `;

      const reserveMinBtn = document.getElementById("reserveMatchedTableMinBtn");
      if (reserveMinBtn) {
        reserveMinBtn.addEventListener("click", () => openReservationModal(matchedMeetup.id));
      }
      const expandBtn = document.getElementById("expandMatchBtn");
      if (expandBtn) {
        expandBtn.addEventListener("click", () => {
          state.quizResultMinimized = false;
          renderQuizResults();
        });
      }
      return;
    }

    elements.quizContainer.innerHTML = `
      <div class="match-result-card">
        <!-- Top bar: Badge, Review Questionnaire Button & Minimize -->
        <div class="match-result-topbar">
          <div class="match-badge">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Social Chemistry Match Found</span>
          </div>

          <div class="match-topbar-actions">
            <button class="match-drawer-btn" id="quizResultRestartBtn" title="Review or Edit Answers in Side Drawer">
              📋 Review Questionnaire
            </button>
            <button class="match-minimize-btn" id="quizMinimizeBtn" title="Minimize match banner" aria-label="Minimize match banner">
              ✕
            </button>
          </div>
        </div>

        <!-- 2-Column Split Grid -->
        <div class="match-result-grid">
          <!-- Left: Persona Chemistry Overview -->
          <div class="match-persona-col">
            <div class="match-score-row">
              <div class="match-score-number">98%</div>
              <div class="match-score-meta">
                <span class="match-score-label">Compatibility</span>
                <span class="match-score-sub">High Chemistry Index</span>
              </div>
            </div>

            <h3 class="match-persona-title">
              Welcome, ${escapeHTML(userName)}!
            </h3>
            <p class="match-persona-desc">
              Based on your conversation pace, love for thoughtful storytelling, and preference for relaxed settings, you'll feel right at home at this gathering:
            </p>

            <div class="match-traits-chips">
              <span class="trait-chip">🗣️ Thoughtful Storytelling</span>
              <span class="trait-chip">☕ Relaxed Setting</span>
              <span class="trait-chip">👥 Balanced Table</span>
            </div>

            <div class="match-persona-actions">
              <a href="#meetups" class="btn btn-secondary btn-sm" id="matchExploreMeetupsBtn">
                Explore All Gatherings ↓
              </a>
            </div>
          </div>

          <!-- Right: Matched Gathering Preview Cardlet -->
          <div class="match-event-col">
            <div class="match-event-card">
              <div class="match-event-media">
                <img src="${matchedMeetup.image}" alt="${escapeHTML(matchedMeetup.imageAlt)}" class="match-event-img" />
                <span class="match-event-time-pill">${escapeHTML(matchedMeetup.day)} • ${escapeHTML(matchedMeetup.time)}</span>
                <span class="match-event-code-pill">Code: ${escapeHTML(matchedMeetup.code || 'MEET-1001')}</span>
              </div>

              <div class="match-event-body">
                <h4 class="match-event-title">${escapeHTML(matchedMeetup.title)}</h4>
                <div class="match-event-venue">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--cream-300)" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>${escapeHTML(matchedMeetup.venueName)} (${escapeHTML(matchedMeetup.neighborhood)})</span>
                </div>
                <p class="match-event-desc">
                  ${escapeHTML(matchedMeetup.description)}
                </p>

                <div class="match-event-footer">
                  <span class="spots-left">${matchedMeetup.capacity - matchedMeetup.bookedCount} spots remaining</span>
                  <button class="btn btn-primary btn-sm" id="reserveMatchedTableBtn">
                    Reserve My Seat (Free)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const cornerRetakeBtn = document.getElementById("quizResultRestartBtn");
    if (cornerRetakeBtn) {
      cornerRetakeBtn.addEventListener("click", () => {
        openQuizSideDrawer();
      });
    }

    const minBtn = document.getElementById("quizMinimizeBtn");
    if (minBtn) {
      minBtn.addEventListener("click", () => {
        state.quizResultMinimized = true;
        renderQuizResults();
      });
    }

    const reserveBtn = document.getElementById("reserveMatchedTableBtn");
    if (reserveBtn) {
      reserveBtn.addEventListener("click", () => {
        openReservationModal(matchedMeetup.id);
      });
    }

    const exploreBtn = document.getElementById("matchExploreMeetupsBtn");
    if (exploreBtn) {
      exploreBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const meetupsSec = document.getElementById("meetups");
        if (meetupsSec) {
          meetupsSec.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // Helper to format 24h to 12h
  function formatTimeTo12h(timeStr) {
    if (!timeStr) return "7:00 PM";
    if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
    const parts = timeStr.split(":");
    let hours = parseInt(parts[0], 10);
    const mins = parts[1] || "00";
    if (isNaN(hours)) return timeStr;
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${mins} ${ampm}`;
  }

  function pickSurpriseVenue(city, category) {
    const cleanCity = (getCleanCity(city) || city || "New York").trim();
    const cLower = cleanCity.toLowerCase();
    const isCoffee = category === "coffee";

    if (cLower.includes("brooklyn")) {
      return isCoffee
        ? { name: "Devoción Botanical Roastery", address: `69 Grand St, Williamsburg, Brooklyn, NY 11249` }
        : { name: "Laser Wolf Rooftop & Hearth", address: `97 Wythe Ave, Williamsburg, Brooklyn, NY 11249` };
    }
    if (cLower.includes("london")) {
      return isCoffee
        ? { name: "Monmouth Coffee Company", address: `27 Monmouth St, Covent Garden, London WC2H 9EU` }
        : { name: "Dishoom Shoreditch Verandah", address: `7 Boundary St, Shoreditch, London E2 7JE` };
    }
    if (cLower.includes("san francisco")) {
      return isCoffee
        ? { name: "Sightglass Coffee Roastery", address: `270 7th St, SoMa, San Francisco, CA 94103` }
        : { name: "Foreign Cinema Courtyard", address: `2534 Mission St, Mission District, San Francisco, CA 94110` };
    }
    if (cLower.includes("paris")) {
      return isCoffee
        ? { name: "Café de Flore Salon", address: `172 Blvd Saint-Germain, 75006 Paris, France` }
        : { name: "Le Mary Celeste Lounge", address: `1 Rue Commines, 75003 Paris, France` };
    }
    if (cLower.includes("tokyo")) {
      return isCoffee
        ? { name: "Blue Bottle Coffee Aoyama", address: `3-13-14 Minamiaoyama, Minato City, Tokyo 107-0062` }
        : { name: "Gonpachi Nishi-Azabu Tavern", address: `1-13-11 Nishiazabu, Minato City, Tokyo 106-0031` };
    }
    if (cLower.includes("chicago")) {
      return isCoffee
        ? { name: "Sawada Coffee Roastery", address: `112 N Green St, West Loop, Chicago, IL 60607` }
        : { name: "Au Cheval Bistro & Parlor", address: `800 W Randolph St, Chicago, IL 60607` };
    }
    if (cLower.includes("austin")) {
      return isCoffee
        ? { name: "Radio Coffee & Beer Garden", address: `4204 Menchaca Rd, Austin, TX 78704` }
        : { name: "Launderette Patio & Dining", address: `2115 Holly St, East Austin, TX 78702` };
    }
    if (cLower.includes("new york") || cLower.includes("manhattan")) {
      return isCoffee
        ? { name: "Ludlow Coffee Supply & Lounge", address: `176 Ludlow St, Lower East Side, New York, NY 10002` }
        : { name: "The Secret Garden Bistro & Lounge", address: `188 Avenue B, East Village, New York, NY 10009` };
    }

    return isCoffee
      ? { name: `${cleanCity} Artisan Coffee Roastery`, address: `18 Market St, Central Quarter, ${cleanCity}` }
      : { name: `The Botanist Kitchen & Lounge`, address: `45 Riverside Ave, Downtown, ${cleanCity}` };
  }

  // Curated Surprise Meetup Matcher (Personality-Matched Algorithm)
  // --------------------------------------------------------------------------
  function triggerSurpriseMeetup() {
    const modal = document.getElementById("surpriseMeetupModal");
    const content = document.getElementById("surpriseModalContent");
    const footer = document.getElementById("surpriseModalFooter");
    const title = document.getElementById("surpriseModalTitle");
    if (!modal || !content) return;

    // Read user questionnaire answers
    const answers = state.quizAnswers || {};
    const userName = answers.firstName || (state.currentUser && state.currentUser.name ? state.currentUser.name.split(" ")[0] : "Izhan");
    const defaultCity = answers.city || state.userCity || "New York";
    const userTopics = Array.isArray(answers.topics) && answers.topics.length > 0
      ? answers.topics
      : ["Life experiences & Stories", "Philosophy & Books", "Tech / Innovation"];
    const userPace = answers.conversationDepth || "Thoughtful & Meaningful";

    // Dynamic upcoming days (till next 3 days)
    const now = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dayOptions = [];
    // If before 6:30 PM (18:30), allow Today as an option
    if (now.getHours() < 18 || (now.getHours() === 18 && now.getMinutes() <= 30)) {
      dayOptions.push({
        value: `Today (${dayNames[now.getDay()]})`,
        label: `Today (${dayNames[now.getDay()]})`,
        isActive: false
      });
    }

    // Up to next 3 days
    for (let i = 1; i <= 3; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      const dayName = dayNames[d.getDay()];
      const monthName = monthNames[d.getMonth()];
      const dateNum = d.getDate();
      const label = i === 1 ? `Tomorrow (${dayName})` : `${dayName} (${monthName} ${dateNum})`;
      dayOptions.push({
        value: label,
        label: label,
        isActive: i === 1 // Tomorrow active by default
      });
    }

    // Mutable state for the surprise meetup curation
    let chosenCity = defaultCity;
    let chosenDay = (dayOptions.find(d => d.isActive) || dayOptions[0]).value;
    let chosenTime = "7:00 PM";
    let chosenTimeRaw = "19:00";
    let chosenCategory = "dining";

    if (title) {
      title.textContent = "Curate Your Surprise Meetup";
    }

    modal.showModal();

    // Render interactive setup asking for Location and Time (pre-selected, fully changeable)
    content.innerHTML = `
      <div class="surprise-confirm-state" style="text-align: left;">
        <div style="text-align: center; margin-bottom: 16px;">
          <div class="surprise-icon-bubble" style="margin: 0 auto 10px;">
            <span>🎁</span>
          </div>
          <h3 style="font-size: 1.35rem; color: var(--cream-100); margin-bottom: 6px; font-weight: 700;">
            Curate Your Surprise Meetup
          </h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto; line-height: 1.45;">
            Outspire will match you with 3 verified people based on your questionnaire answers and reserve your table.
          </p>
        </div>

        <!-- 1. Location Selection -->
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px 16px; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
            <label for="surpriseCitySelect" style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--cream-300); font-weight: 700; display: flex; align-items: center; gap: 6px;">
              <span>📍</span> Gathering Location
            </label>
          </div>

          <div>
            <select id="surpriseCitySelect" class="surprise-select" style="width: 100%;">
              <option value="${escapeHTML(defaultCity)}" selected>📍 ${escapeHTML(defaultCity)}</option>
              <optgroup label="Popular Gathering Cities">
                <option value="New York">New York, NY</option>
                <option value="Brooklyn">Brooklyn, NY</option>
                <option value="London">London, UK</option>
                <option value="San Francisco">San Francisco, CA</option>
                <option value="Los Angeles">Los Angeles, CA</option>
                <option value="Chicago">Chicago, IL</option>
                <option value="Austin">Austin, TX</option>
                <option value="Seattle">Seattle, WA</option>
                <option value="Toronto">Toronto, Canada</option>
                <option value="Paris">Paris, France</option>
                <option value="Berlin">Berlin, Germany</option>
                <option value="Tokyo">Tokyo, Japan</option>
              </optgroup>
              <option value="__custom__">✏️ Enter custom city / neighborhood...</option>
            </select>
          </div>

          <div id="surpriseCustomCityWrap" style="display: none; margin-top: 10px;">
            <div style="display: flex; gap: 6px;">
              <input type="text" id="surpriseCustomCityInput" class="surprise-custom-input" placeholder="Type city or area (e.g. Jersey City, Boston, Queens...)" value="${escapeHTML(defaultCity)}">
              <button type="button" class="btn btn-primary btn-sm" id="btnApplyCustomCity" style="padding: 6px 12px; font-size: 0.78rem;">Set</button>
            </div>
          </div>
          <div style="margin-top: 6px; font-size: 0.73rem; color: var(--text-muted);">
            Location is changeable anytime by table members.
          </div>
        </div>

        <!-- 2. Time Selection (Day & Time Slots) -->
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px 16px; margin-bottom: 14px;">
          <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--cream-300); font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
            <span>🗓️</span> Preferred Day
          </div>
          <div class="surprise-days-wrap" id="surpriseDaysContainer">
            ${dayOptions.map(opt => `
              <button type="button" class="surprise-day-chip ${opt.isActive ? 'active' : ''}" data-day="${escapeHTML(opt.value)}">
                ${escapeHTML(opt.label)}
              </button>
            `).join("")}
          </div>

          <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--cream-300); font-weight: 700; margin: 14px 0 8px; display: flex; align-items: center; justify-content: space-between;">
            <span style="display: flex; align-items: center; gap: 6px;"><span>⏰</span> Preferred Time Slot</span>
            <span id="surpriseChosenTimeBadge" style="font-size: 0.74rem; color: var(--cream-200); font-weight: 600;">7:00 PM (Dinner)</span>
          </div>
          
          <div class="surprise-time-grid" id="surpriseTimesContainer">
            <div class="surprise-time-card" data-time="10:30 AM" data-raw="10:30" data-cat="coffee" data-desc="Morning Coffee">
              <span style="font-size: 1.2rem;">☕</span>
              <div>
                <strong>10:30 AM</strong>
                <span style="font-size: 0.72rem; color: var(--text-muted);">Morning Coffee</span>
              </div>
            </div>
            <div class="surprise-time-card" data-time="1:00 PM" data-raw="13:00" data-cat="dining" data-desc="Lunch">
              <span style="font-size: 1.2rem;">🥪</span>
              <div>
                <strong>1:00 PM</strong>
                <span style="font-size: 0.72rem; color: var(--text-muted);">Casual Lunch</span>
              </div>
            </div>
            <div class="surprise-time-card" data-time="4:30 PM" data-raw="16:30" data-cat="coffee" data-desc="Afternoon Tea">
              <span style="font-size: 1.2rem;">🥐</span>
              <div>
                <strong>4:30 PM</strong>
                <span style="font-size: 0.72rem; color: var(--text-muted);">Afternoon Break</span>
              </div>
            </div>
            <div class="surprise-time-card active" data-time="7:00 PM" data-raw="19:00" data-cat="dining" data-desc="Dinner">
              <span style="font-size: 1.2rem;">🍽️</span>
              <div>
                <strong>7:00 PM</strong>
                <span style="font-size: 0.72rem; color: var(--text-muted);">Dinner & Stories</span>
              </div>
            </div>
            <div class="surprise-time-card" data-time="8:30 PM" data-raw="20:30" data-cat="dining" data-desc="Lounge">
              <span style="font-size: 1.2rem;">🍸</span>
              <div>
                <strong>8:30 PM</strong>
                <span style="font-size: 0.72rem; color: var(--text-muted);">Evening Lounge</span>
              </div>
            </div>
          </div>

          <!-- Custom Exact Time Input -->
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--border-subtle); flex-wrap: wrap;">
            <span style="font-size: 0.76rem; color: var(--cream-300);">Or pick exact time:</span>
            <input type="time" id="surpriseCustomTimePicker" value="19:00" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); color: var(--cream-100); border-radius: var(--radius-sm); padding: 4px 8px; font-size: 0.78rem;">
            <button type="button" class="btn btn-secondary btn-sm" id="btnSetExactTime" style="padding: 3px 8px; font-size: 0.74rem;">Set Exact</button>
          </div>
        </div>

        <!-- 3. Questionnaire Profile Preview -->
        <div style="background: rgba(227, 210, 186, 0.05); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 12px 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
            <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--cream-300); font-weight: 700;">
              Your Questionnaire Topics
            </span>
            <span style="font-size: 0.74rem; color: var(--cream-200);">${escapeHTML(userPace)}</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${userTopics.map(t => `<span class="meetup-tag" style="background: rgba(227, 210, 186, 0.12); color: var(--cream-200); font-size: 0.74rem; padding: 2px 7px;">${escapeHTML(t)}</span>`).join("")}
          </div>
        </div>
      </div>
    `;

    // Event handlers for interactive Location & Time customization
    const citySelect = document.getElementById("surpriseCitySelect");
    const customCityWrap = document.getElementById("surpriseCustomCityWrap");
    const customCityInput = document.getElementById("surpriseCustomCityInput");
    const applyCustomCityBtn = document.getElementById("btnApplyCustomCity");

    if (citySelect) {
      citySelect.addEventListener("change", (e) => {
        if (e.target.value === "__custom__") {
          if (customCityWrap) {
            customCityWrap.style.display = "block";
            if (customCityInput) customCityInput.focus();
          }
        } else {
          chosenCity = e.target.value;
          if (customCityWrap) customCityWrap.style.display = "none";
        }
      });
    }

    if (applyCustomCityBtn && customCityInput) {
      applyCustomCityBtn.addEventListener("click", () => {
        const val = customCityInput.value.trim();
        if (val) {
          chosenCity = val;
          if (citySelect) {
            let opt = Array.from(citySelect.options).find(o => o.value.toLowerCase() === val.toLowerCase());
            if (!opt) {
              opt = document.createElement("option");
              opt.value = val;
              opt.textContent = `📍 ${val}`;
              citySelect.insertBefore(opt, citySelect.firstChild);
            }
            citySelect.value = val;
          }
          if (customCityWrap) customCityWrap.style.display = "none";
          showToast(`📍 Location updated to ${val}`, "success");
        }
      });
    }

    if (customCityInput) {
      customCityInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (applyCustomCityBtn) applyCustomCityBtn.click();
        }
      });
    }

    if (jumpToQuizCityBtn) {
      jumpToQuizCityBtn.addEventListener("click", () => {
        modal.close();
        if (typeof openQuizSideDrawer === "function") {
          openQuizSideDrawer(5);
        }
      });
    }

    // Day chips handler
    const dayChips = document.querySelectorAll(".surprise-day-chip");
    dayChips.forEach(chip => {
      chip.addEventListener("click", () => {
        dayChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        chosenDay = chip.dataset.day || "Tomorrow (Saturday)";
      });
    });

    // Time slot cards handler
    const timeCards = document.querySelectorAll(".surprise-time-card");
    const chosenTimeBadge = document.getElementById("surpriseChosenTimeBadge");
    const customTimePicker = document.getElementById("surpriseCustomTimePicker");
    const setExactTimeBtn = document.getElementById("btnSetExactTime");

    timeCards.forEach(card => {
      card.addEventListener("click", () => {
        timeCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        chosenTime = card.dataset.time || "7:00 PM";
        chosenTimeRaw = card.dataset.raw || "19:00";
        chosenCategory = card.dataset.cat || "dining";
        const desc = card.dataset.desc || "Dinner";
        if (chosenTimeBadge) {
          chosenTimeBadge.textContent = `${chosenTime} (${desc})`;
        }
      });
    });

    if (setExactTimeBtn && customTimePicker) {
      setExactTimeBtn.addEventListener("click", () => {
        const val = customTimePicker.value;
        if (val) {
          timeCards.forEach(c => c.classList.remove("active"));
          chosenTimeRaw = val;
          chosenTime = formatTimeTo12h(val);
          const hour = parseInt(val.split(":")[0], 10);
          chosenCategory = (hour >= 11 && hour <= 14) || hour >= 18 ? "dining" : "coffee";
          if (chosenTimeBadge) {
            chosenTimeBadge.textContent = `${chosenTime} (Custom)`;
          }
          showToast(`⏰ Time set to ${chosenTime}`, "info");
        }
      });
    }

    if (footer) {
      footer.innerHTML = `
        <div style="margin-right: auto; font-size: 0.88rem; color: var(--status-success); font-weight: 600;">
          ● Free Community Reservation
        </div>
        <button class="btn btn-secondary btn-sm" id="cancelSurpriseConfirmBtn">
          Cancel
        </button>
        <button class="btn btn-primary btn-sm" id="proceedSurpriseMatchBtn" style="padding: 8px 20px; font-weight: 700;">
          Confirm & Find Meetup ➔
        </button>
      `;

      const cancelBtn = document.getElementById("cancelSurpriseConfirmBtn");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => modal.close());
      }

      const confirmBtn = document.getElementById("proceedSurpriseMatchBtn");
      if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
          // Validate chosen city
          if (customCityWrap && customCityWrap.style.display !== "none" && customCityInput && customCityInput.value.trim()) {
            chosenCity = customCityInput.value.trim();
          }
          chosenCity = (chosenCity || defaultCity || "New York").trim();

          startSurpriseMeetupMatching(
            answers,
            userName,
            chosenCity,
            chosenDay,
            chosenTime,
            userTopics,
            userPace,
            chosenTimeRaw,
            chosenCategory
          );
        });
      }
    }
  }

  function startSurpriseMeetupMatching(answers, userName, userCity, chosenDay, chosenTime, userTopics, userPace, chosenTimeRaw, chosenCategory) {
    const modal = document.getElementById("surpriseMeetupModal");
    const content = document.getElementById("surpriseModalContent");
    const footer = document.getElementById("surpriseModalFooter");
    const title = document.getElementById("surpriseModalTitle");
    if (!modal || !content) return;

    if (title) {
      title.textContent = "Surprise Meetup Matching";
    }

    // Stage 1: Immediate confirmation with the user's exact required quote
    content.innerHTML = `
      <div class="surprise-stage-one">
        <div class="surprise-icon-bubble">
          <span>🎁</span>
        </div>

        <div class="surprise-quote-box">
          <div class="surprise-quote-badge">
            <span class="pulse-dot"></span> Reservation Acknowledged
          </div>
          <blockquote class="surprise-user-quote">
            “Thank you for reserving, I will notify whenever a perfect meetup is ready for you”
          </blockquote>
          <p class="surprise-quote-sub">
            Our algorithm is scanning ${escapeHTML(userCity)} to find people related to your questionnaire answers and place you in a curated surprise meetup on ${escapeHTML(chosenDay)} at ${escapeHTML(chosenTime)}.
          </p>
        </div>

        <div class="surprise-matching-stepper" id="surpriseStepper">
          <div class="surprise-step-item active" id="sStep1">
            <span class="s-icon">📋</span>
            <span class="s-text">Reading questionnaire profile (${escapeHTML(userName)}, ${escapeHTML(userCity)})...</span>
            <span class="s-spinner"></span>
          </div>
          <div class="surprise-step-item" id="sStep2">
            <span class="s-icon">🧠</span>
            <span class="s-text">Analyzing topics: ${escapeHTML(userTopics.join(", "))}...</span>
          </div>
          <div class="surprise-step-item" id="sStep3">
            <span class="s-icon">👥</span>
            <span class="s-text">Finding people in ${escapeHTML(userCity)} for ${escapeHTML(chosenDay)} at ${escapeHTML(chosenTime)}...</span>
          </div>
          <div class="surprise-step-item" id="sStep4">
            <span class="s-icon">✨</span>
            <span class="s-text">Curating table at handpicked venue in ${escapeHTML(userCity)} and reserving your seat...</span>
          </div>
        </div>
      </div>
    `;

    if (footer) {
      footer.innerHTML = `
        <button class="btn btn-secondary btn-sm" id="cancelSurpriseSearchBtn">
          Cancel
        </button>
        <span style="font-size: 0.8rem; color: var(--cream-300);">
          Finding compatible members in ${escapeHTML(userCity)}...
        </span>
      `;
      const cancelBtn = document.getElementById("cancelSurpriseSearchBtn");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => modal.close());
      }
    }

    // Step progression animation
    const t1 = setTimeout(() => {
      const s1 = document.getElementById("sStep1");
      const s2 = document.getElementById("sStep2");
      if (s1 && s2) {
        s1.classList.remove("active");
        s1.classList.add("done");
        s2.classList.add("active");
        s2.innerHTML += `<span class="s-spinner"></span>`;
      }
    }, 700);

    const t2 = setTimeout(() => {
      const s2 = document.getElementById("sStep2");
      const s3 = document.getElementById("sStep3");
      if (s2 && s3) {
        s2.classList.remove("active");
        s2.classList.add("done");
        s3.classList.add("active");
        s3.innerHTML += `<span class="s-spinner"></span>`;
      }
    }, 1500);

    const t3 = setTimeout(() => {
      const s3 = document.getElementById("sStep3");
      const s4 = document.getElementById("sStep4");
      if (s3 && s4) {
        s3.classList.remove("active");
        s3.classList.add("done");
        s4.classList.add("active");
        s4.innerHTML += `<span class="s-spinner"></span>`;
      }
    }, 2200);

    // Stage 2: Match and reveal
    const t4 = setTimeout(() => {
      finalizeSurpriseMatch(answers, userName, userCity, chosenDay, chosenTime, userTopics, userPace, chosenTimeRaw, chosenCategory);
    }, 3000);

    const closeBtn = document.getElementById("closeSurpriseModalBtn");
    if (closeBtn) {
      closeBtn.onclick = () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        modal.close();
      };
    }
  }

  function finalizeSurpriseMatch(answers, userName, userCity, chosenDay, chosenTime, userTopics, userPace, chosenTimeRaw, chosenCategory) {
    const modal = document.getElementById("surpriseMeetupModal");
    const content = document.getElementById("surpriseModalContent");
    const footer = document.getElementById("surpriseModalFooter");
    if (!modal || !content) return;

    // Pick handpicked venue according to city and category
    const venue = pickSurpriseVenue(userCity, chosenCategory);

    // Candidate pool with explicit tie-ins to questionnaire topics (photos strictly hidden for surprise meetup)
    const candidatePool = [
      {
        id: "m-elena",
        name: "Elena Rostova",
        avatar: MYSTERY_AVATAR,
        bio: "Curator & researcher. Enjoys cozy cafés, literature, and art discussions.",
        meetupsCount: 16,
        topics: ["Philosophy & Books", "Creative Arts", "Life experiences & Stories"],
        matchReason: `Matched on: ${userTopics[0] || 'Meaningful Ideas'} & thoughtful storytelling`
      },
      {
        id: "m-lucas",
        name: "Lucas Martinez",
        avatar: MYSTERY_AVATAR,
        bio: "Product designer & city walker. Looking to meet curious minds over great coffee.",
        meetupsCount: 9,
        topics: ["Tech / Innovation", "Travel & Culture", "Career / Business"],
        matchReason: `Matched on: ${userTopics[1] || 'Creative Innovation'} & relaxed group vibe`
      },
      {
        id: "m-carl",
        name: "Carl Johnson",
        avatar: MYSTERY_AVATAR,
        bio: "Software developer & runner. Loves genuine real-life conversations.",
        meetupsCount: 14,
        topics: ["Tech / Innovation", "Podcasts", "Life experiences & Stories"],
        matchReason: `Matches your pace: attentive listener with warm energy`
      }
    ];

    const matchedMembers = candidatePool;
    const themeTopic = userTopics[0] || "Creative Minds & Stories";
    let meetupTitle = `🎁 Surprise Meetup: ${themeTopic}`;
    if (themeTopic.includes("Tech")) meetupTitle = "🎁 Surprise Meetup: Tech, Ideas & Banter";
    else if (themeTopic.includes("Books") || themeTopic.includes("Philosophy")) meetupTitle = "🎁 Surprise Meetup: Deep Ideas & Storytelling";
    else if (themeTopic.includes("Travel")) meetupTitle = "🎁 Surprise Meetup: Wandering Tales & Culture";
    else if (themeTopic.includes("Career")) meetupTitle = "🎁 Surprise Meetup: Purpose, Growth & Real Stories";
    else if (themeTopic.includes("Life")) meetupTitle = "🎁 Surprise Meetup: Life Experiences & Stories";

    const nextCode = (typeof generateMeetupCode === "function") ? generateMeetupCode() : "MEET-2001";
    const surpriseMeetupId = "meetup-surprise-" + Date.now();

    const userMember = {
      id: "current-user",
      name: `${userName} (You)`,
      avatar: MYSTERY_AVATAR,
      bio: `Matched via Questionnaire: ${userTopics.slice(0, 2).join(", ")} · ${userPace}`,
      meetupsCount: 1,
      topics: userTopics,
      isSelf: true
    };

    const surpriseMeetup = {
      id: surpriseMeetupId,
      code: nextCode,
      title: meetupTitle,
      category: chosenCategory || "dining",
      day: chosenDay || "Upcoming Weekend",
      time: (chosenTimeRaw || "19:00") + " (" + (chosenTime || "7:00 PM") + ")",
      dateFormatted: (chosenDay || "Upcoming Weekend") + " • " + (chosenTime || "7:00 PM"),
      timeRaw: chosenTimeRaw || "19:00",
      location: userCity,
      neighborhood: "Central Quarter",
      venueName: venue.name,
      venueAddress: venue.address,
      coordinates: { lat: 40.726, lng: -73.981 },
      isCommunityHosted: false,
      isOfficialHosted: true,
      isSurpriseMeetup: true,
      mapQuery: encodeURIComponent(venue.name + " " + userCity),
      price: "Free",
      capacity: 4,
      bookedCount: 4,
      tags: ["🎁 Surprise Match", "99% Compatibility", "Curated Circle", "Verified Friends"],
      description: `A hand-curated surprise gathering matching you with fellow members who share your passions for ${userTopics.join(", ")}. Enjoy relaxed conversation, delicious drinks & bites, and effortless connection.`,
      atmosphere: "Intimate, warm, laughter-filled & cozy",
      vibeScore: 99,
      image: "meetup-gathering.jpg",
      imageAlt: "Small group of friendly strangers sharing a surprise meetup together",
      host: {
        name: "Outspire",
        role: "Official Outspire Team · Curated Surprise Table",
        avatar: OUTSPIRE_CONCIERGE_AVATAR
      },
      hostVenueNotes: "Table reserved under Outspire with your Meetup Code. Simply mention your code to the venue staff upon arrival.",
      members: [
        ...matchedMembers,
        userMember
      ]
    };

    // Auto-reserve user in state & localStorage
    if (!state.bookedIds.includes(surpriseMeetupId)) {
      state.bookedIds.push(surpriseMeetupId);
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(state.bookedIds));
    }

    // Initialize group chat with welcoming messages
    state.chatMessages[surpriseMeetupId] = [
      {
        sender: "Outspire Team",
        avatar: OUTSPIRE_CONCIERGE_AVATAR,
        time: "Just now",
        text: `✨ Welcome to your Curated Surprise Table! Outspire has reserved your table at ${venue.name} in ${userCity}. Arrive on ${chosenDay} at ${chosenTime}, give the host your code ${nextCode}, and enjoy your gathering!`
      },
      {
        sender: matchedMembers[0].name,
        avatar: MYSTERY_AVATAR,
        time: "Just now",
        text: `🎉 Welcome to our Surprise Table! I see our questionnaire matched us on ${userTopics[0] || 'great conversations'}. So excited to meet on ${chosenDay}!`
      },
      {
        sender: matchedMembers[1].name,
        avatar: MYSTERY_AVATAR,
        time: "Just now",
        text: `Hey @${userName}! Looking forward to chatting about ${userTopics[1] || 'new ideas'} and enjoying ${chosenTime} together!`
      },
      {
        sender: matchedMembers[2].name,
        avatar: MYSTERY_AVATAR,
        time: "Just now",
        text: `Count me in! ${venue.name} has such an incredible vibe. Can't wait!`
      }
    ];

    // Prepend to meetups list and persist
    state.meetups = [surpriseMeetup, ...state.meetups.filter(m => m.id !== surpriseMeetupId)];
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_HOSTED) || "[]");
      stored.unshift(surpriseMeetup);
      localStorage.setItem(STORAGE_KEY_HOSTED, JSON.stringify(stored));
    } catch (e) {}

    renderMeetups();

    // Render Stage 2 in modal
    content.innerHTML = `
      <div class="surprise-stage-two">
        <div class="surprise-celebration-banner">
          <div>
            <h4 class="surprise-celebration-title">🎉 A Perfect Meetup Is Ready For You!</h4>
            <p class="surprise-celebration-sub">
              You have been added to this gathering with 3 compatible members based on your questionnaire answers.
            </p>
          </div>
          <span class="surprise-score-pill">99% Compatibility Match</span>
        </div>

        <div class="surprise-meetup-preview-card">
          <div class="surprise-preview-header">
            <span class="meetup-code-pill">
              <span class="code-prefix">Code:</span> <span class="code-num">${escapeHTML(surpriseMeetup.code)}</span>
            </span>
            <span class="surprise-reserved-badge">
              ✓ Spot Reserved for You
            </span>
          </div>
          <h4 class="surprise-preview-title">${escapeHTML(surpriseMeetup.title)}</h4>
          <div class="surprise-preview-meta">
            <span>🗓️ ${escapeHTML(surpriseMeetup.dateFormatted)}</span>
            <span>⏰ ${escapeHTML(surpriseMeetup.time)}</span>
            <span>📍 ${escapeHTML(surpriseMeetup.venueName)} (${escapeHTML(surpriseMeetup.location)})</span>
          </div>
        </div>

        <div class="surprise-section-label">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span>👥 People Matched With You (Based on Questionnaire):</span>
            <span style="font-size: 0.74rem; color: var(--cream-300); font-weight: 500;">🔒 Photos hidden for surprise meetup</span>
          </div>
        </div>

        <div class="surprise-members-grid">
          ${matchedMembers.map(m => `
            <div class="surprise-member-card">
              <div class="surprise-member-avatar surprise-mystery-avatar" title="${escapeHTML(m.name)} (Photo hidden for surprise meetup)">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="surprise-member-info">
                <span class="surprise-member-name">${escapeHTML(m.name)}</span>
                <span class="surprise-member-match-reason">${escapeHTML(m.matchReason)}</span>
              </div>
            </div>
          `).join("")}
          <div class="surprise-member-card" style="border-color: rgba(116, 198, 157, 0.4); background: rgba(116, 198, 157, 0.08);">
            <div class="surprise-member-avatar surprise-mystery-avatar" style="border-color: var(--status-success); color: #34d399; background: rgba(116, 198, 157, 0.12);" title="${escapeHTML(userName)} (You)">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="surprise-member-info">
              <span class="surprise-member-name">${escapeHTML(userName)} (You)</span>
              <span class="surprise-member-match-reason" style="color: var(--cream-200);">✓ Confirmed Reserved Attendee</span>
            </div>
          </div>
        </div>
      </div>
    `;

    if (footer) {
      footer.innerHTML = `
        <button class="btn btn-secondary btn-sm" id="surpriseViewGridBtn">
          👀 View on Gatherings Grid
        </button>
        <button class="btn btn-primary btn-sm" id="surpriseOpenChatBtn">
          💬 Open Meetup & Member Chat
        </button>
      `;

      const viewGridBtn = document.getElementById("surpriseViewGridBtn");
      if (viewGridBtn) {
        viewGridBtn.addEventListener("click", () => {
          modal.close();
          const card = document.querySelector(`[data-meetup-id="${surpriseMeetupId}"]`);
          if (card) {
            card.scrollIntoView({ behavior: "smooth", block: "center" });
            card.classList.add("highlight-bounce");
            setTimeout(() => card.classList.remove("highlight-bounce"), 2000);
          }
        });
      }

      const openChatBtn = document.getElementById("surpriseOpenChatBtn");
      if (openChatBtn) {
        openChatBtn.addEventListener("click", () => {
          modal.close();
          openReservationModal(surpriseMeetupId);
        });
      }
    }

    showToast(`🎉 You're reserved in "${surpriseMeetup.title}"!`, "success");
  }

  // Alias triggerRandomMatch for backwards compatibility
  function triggerRandomMatch() {
    triggerSurpriseMeetup();
  }

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // Host Studio, Google Maps Platform & Gathering Creator
  // --------------------------------------------------------------------------
  // Source: Google Maps Platform Code Assist
  let hostLeafletMap = null;
  let hostMarker = null;
  let hostTileLayer = null;
  let isMapSelecting = false;
  let reverseGeocodeTimeout = null;
  let selectedHostLat = 40.7275;
  let selectedHostLng = -73.9840;
  let selectedHostQuery = "Abraço Espresso, East Village, New York";

  function createGoogleMapsPinIcon() {
    if (typeof L === "undefined") return null;
    const pinHtml = `
      <div class="gmap-marker-pin-wrap">
        <div class="gmap-marker-pulse"></div>
        <svg class="gmap-marker-pin-svg" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.16344 0 0 7.16344 0 16C0 26.5 14.2 40.8 14.8 41.4C15.1 41.7 15.5 41.9 16 41.9C16.5 41.9 16.9 41.7 17.2 41.4C17.8 40.8 32 26.5 32 16C32 7.16344 24.8366 0 16 0Z" fill="#EA4335"/>
          <path d="M16 1C24.2843 1 31 7.71573 31 16C31 25.8 17.7 39.5 16.5 40.7C16.2 41 15.8 41 15.5 40.7C14.3 39.5 1 25.8 1 16C1 7.71573 7.71573 1 16 1Z" stroke="#B31412" stroke-width="0.8"/>
          <circle cx="16" cy="15" r="6.2" fill="#FFFFFF"/>
          <circle cx="16" cy="15" r="4.2" fill="#C5221F"/>
        </svg>
      </div>
    `;
    return L.divIcon({
      html: pinHtml,
      className: "gmap-custom-div-icon",
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42]
    });
  }

  function initGoogleMapStudio() {
    const mapContainer = document.getElementById("hostLocationMap");
    if (!mapContainer) return;

    // Render photo options & bind inputs
    renderPhotoSelector();
    initCustomPhotoModal();
    bindHostFormLivePreview();
    setDefaultMeetupDate();
    updateHostPreview();

    // Setup fast neighborhood presets
    setupNeighborhoodPresets();

    // Setup Google Maps search
    setupGoogleMapsSearch();

    // Setup Google Maps fullscreen
    setupGoogleMapsFullscreen();

    // Autofill initial default spot
    if (CITY_CURATED_SPOTS["New York"] && CITY_CURATED_SPOTS["New York"][0]) {
      autofillAllLocationOptions(CITY_CURATED_SPOTS["New York"][0], false);
    }

    // Mount live Google Map immediately
    mountInteractiveGoogleMap(selectedHostLat, selectedHostLng, selectedHostQuery, false);
  }

  function mountInteractiveGoogleMap(lat, lng, query, shouldOpenPopup = false) {
    const mapContainer = document.getElementById("hostLocationMap");
    if (!mapContainer) return;

    if (lat) selectedHostLat = Number(lat);
    if (lng) selectedHostLng = Number(lng);
    if (query) selectedHostQuery = query;

    // Fallback if Leaflet script failed to load
    if (typeof L === "undefined") {
      mountFallbackIframe(selectedHostLat, selectedHostLng, selectedHostQuery);
      return;
    }

    if (!hostLeafletMap) {
      mapContainer.innerHTML = "";
      
      // Initialize Leaflet Map
      hostLeafletMap = L.map("hostLocationMap", {
        center: [selectedHostLat, selectedHostLng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      // Sleek zoom controls bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(hostLeafletMap);

      // Google Maps standard road and landmark tiles
      const googleTileUrl = "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
      hostTileLayer = L.tileLayer(googleTileUrl, {
        subdomains: ["0", "1", "2", "3"],
        maxZoom: 20,
        attribution: "Google Maps"
      }).addTo(hostLeafletMap);

      // Graceful fallback to Carto Voyager tiles if Google tiles blocked
      hostTileLayer.on("tileerror", function () {
        if (!this._swapped) {
          this._swapped = true;
          this.setUrl("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png");
        }
      });

      // Add custom SVG Google Red Pin marker
      const pinIcon = createGoogleMapsPinIcon();
      hostMarker = L.marker([selectedHostLat, selectedHostLng], {
        icon: pinIcon,
        draggable: true,
        autoPan: true
      }).addTo(hostLeafletMap);

      // Marker drag event: dragging the pin selects the spot & autofills down options
      hostMarker.on("dragend", async (e) => {
        const pos = e.target.getLatLng();
        await handleMapCoordinateSelect(pos.lat, pos.lng, true);
      });

      // Map Click event: Clicking ANYWHERE on the map selects that place & autofills down options!
      hostLeafletMap.on("click", async (e) => {
        const { lat: cLat, lng: cLng } = e.latlng;
        await handleMapCoordinateSelect(cLat, cLng, true);
      });

      // Force canvas dimension refresh
      setTimeout(() => {
        if (hostLeafletMap) hostLeafletMap.invalidateSize();
      }, 250);
    } else {
      hostLeafletMap.flyTo([selectedHostLat, selectedHostLng], 16, {
        animate: true,
        duration: 0.8
      });
      if (hostMarker) {
        hostMarker.setLatLng([selectedHostLat, selectedHostLng]);
      }
    }

    updateMapExternalLinks(selectedHostLat, selectedHostLng, selectedHostQuery);

    if (shouldOpenPopup && hostMarker) {
      const vName = query ? query.split(",")[0].trim() : "Selected Spot";
      const gUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || `${selectedHostLat},${selectedHostLng}`)}`;
      const pContent = `
        <div class="gmap-click-popup">
          <div class="gmap-popup-header">
            <div class="gmap-popup-badge"><span class="badge-dot"></span> ✓ Place Selected & Autofilled</div>
          </div>
          <h4 class="gmap-popup-title">${escapeHTML(vName)}</h4>
          <p class="gmap-popup-address">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${escapeHTML(query || 'Map Location')}
          </p>
          <div class="gmap-popup-tags">
            <span class="gmap-popup-autofill-tag">⚡ All fields below autofilled</span>
          </div>
          <div class="gmap-popup-coords">📍 ${selectedHostLat.toFixed(5)}, ${selectedHostLng.toFixed(5)}</div>
          <a href="${gUrl}" target="_blank" rel="noopener noreferrer" class="gmap-popup-link">Open in Google Maps ↗</a>
        </div>
      `;
      hostMarker.bindPopup(pContent, { maxWidth: 320, closeButton: true }).openPopup();
    }
  }

  function mountFallbackIframe(lat, lng, query) {
    const mapContainer = document.getElementById("hostLocationMap");
    if (!mapContainer) return;
    const searchTerm = query || `${lat},${lng}`;
    const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(searchTerm)}&z=15&output=embed`;
    let iframe = document.getElementById("hostGoogleMapIframe");
    if (!iframe) {
      mapContainer.innerHTML = "";
      iframe = document.createElement("iframe");
      iframe.id = "hostGoogleMapIframe";
      iframe.className = "gmap-embed-frame";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      iframe.title = "Google Map";
      mapContainer.appendChild(iframe);
    }
    if (iframe.src !== embedSrc) iframe.src = embedSrc;
  }

  function updateMapExternalLinks(lat, lng, query) {
    const searchTerm = query || `${lat},${lng}`;
    const directUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchTerm)}`;

    const externalBtn = document.getElementById("openInGoogleMapsBtn");
    if (externalBtn) externalBtn.href = directUrl;

    const fsOpenBtn = document.getElementById("fullscreenOpenInGmapBtn");
    if (fsOpenBtn) fsOpenBtn.href = directUrl;

    const latInput = document.getElementById("hostLat");
    const lngInput = document.getElementById("hostLng");
    if (latInput) latInput.value = Number(lat).toFixed(5);
    if (lngInput) lngInput.value = Number(lng).toFixed(5);
  }

  // Calculate distance between two coordinates in meters
  function getDistanceInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const p1 = lat1 * Math.PI / 180;
    const p2 = lat2 * Math.PI / 180;
    const dp = (lat2 - lat1) * Math.PI / 180;
    const dl = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
              Math.cos(p1) * Math.cos(p2) *
              Math.sin(dl / 2) * Math.sin(dl / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function findNearbyCuratedSpot(lat, lng, maxDistanceMeters = 150) {
    for (const city of Object.keys(CITY_CURATED_SPOTS)) {
      for (const spot of CITY_CURATED_SPOTS[city]) {
        const dist = getDistanceInMeters(lat, lng, spot.lat, spot.lng);
        if (dist <= maxDistanceMeters) {
          return spot;
        }
      }
    }
    return null;
  }

  async function reverseGeocodeCoordinates(lat, lng) {
    // 1. Check if clicked spot matches or is near any curated spot (~150m)
    const nearby = findNearbyCuratedSpot(lat, lng, 150);
    if (nearby) {
      return {
        ...nearby,
        lat: lat,
        lng: lng
      };
    }

    // 2. Query Photon API (fast OpenStreetMap POI search, CORS-enabled, detects restaurants, cafes, parks)
    try {
      const photonRes = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`);
      if (photonRes.ok) {
        const geoData = await photonRes.json();
        if (geoData && geoData.features && geoData.features.length > 0) {
          const feat = geoData.features[0];
          const props = feat.properties || {};

          const name = props.name || "";
          const street = props.street || "";
          const houseNumber = props.housenumber ? `${props.housenumber} ` : "";
          const district = props.district || props.suburb || props.locality || "";
          const city = props.city || props.town || props.village || district || "";
          const state = props.state || "";
          const country = props.country || "";
          const postcode = props.postcode || "";

          let venueName = name;
          if (!venueName && street) {
            venueName = `${houseNumber}${street}`.trim();
          }
          if (!venueName) {
            venueName = district ? `${district} Gathering Spot` : `Spot at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          }

          const streetPart = houseNumber + street;
          const addressParts = [
            streetPart || name,
            district !== street ? district : null,
            city !== district ? city : null,
            state,
            postcode,
            country
          ].filter(Boolean);
          const cleanAddress = addressParts.join(", ") || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

          const neighborhoodParts = [district || city, country].filter(Boolean);
          const cleanNeighborhood = neighborhoodParts.join(", ") || "Selected City Area";

          let category = "coffee";
          const osmVal = (props.osm_value || "").toLowerCase();
          if (osmVal.includes("restaurant") || osmVal.includes("food") || osmVal.includes("bakery")) category = "dining";
          else if (osmVal.includes("park") || osmVal.includes("garden") || osmVal.includes("nature")) category = "walk";
          else if (osmVal.includes("bar") || osmVal.includes("pub") || osmVal.includes("club")) category = "nightlife";
          else if (osmVal.includes("cafe") || osmVal.includes("coffee")) category = "coffee";

          return {
            venue: venueName,
            neighborhood: cleanNeighborhood,
            address: cleanAddress,
            notes: `Meet near the main entrance or seating area of ${venueName}. Look for the Outspire meetup group.`,
            lat: lat,
            lng: lng,
            category: category,
            suggestedTitle: `Meetup & Friendly Convos at ${venueName}`
          };
        }
      }
    } catch (e) {
      console.warn("Photon reverse geocode notice:", e);
    }

    // 3. Fallback to Nominatim API
    try {
      const nomRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        if (nomData && nomData.address) {
          const addr = nomData.address;
          const road = addr.road || addr.pedestrian || addr.suburb || "";
          const houseNum = addr.house_number ? `${addr.house_number} ` : "";
          const city = addr.city || addr.town || addr.municipality || addr.village || addr.city_district || "";
          const neighborhood = addr.neighbourhood || addr.suburb || addr.quarter || city;
          const state = addr.state || "";
          const country = addr.country || "";
          const postcode = addr.postcode || "";

          const venueName = nomData.name && nomData.name !== road ? nomData.name : (road ? `${houseNum}${road}`.trim() : `Spot at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          const cleanAddr = [houseNum + road, neighborhood, city, state, postcode, country].filter(Boolean).join(", ");
          const cleanNeigh = [neighborhood || city, country].filter(Boolean).join(", ") || "Selected City Area";

          return {
            venue: venueName,
            neighborhood: cleanNeigh,
            address: cleanAddr || nomData.display_name,
            notes: `Meet near the main entrance or seating area of ${venueName}. Look for the Outspire meetup group.`,
            lat: lat,
            lng: lng,
            category: "coffee",
            suggestedTitle: `Meetup & Relaxed Conversations at ${venueName}`
          };
        }
      }
    } catch (e) {
      console.warn("Nominatim reverse geocode notice:", e);
    }

    // 4. Default fallback
    return {
      venue: `Spot at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      neighborhood: "Selected Location Area",
      address: `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      notes: "Look for the Outspire meetup host with the table card.",
      lat: lat,
      lng: lng,
      category: "coffee",
      suggestedTitle: `Gathering & Friendly Conversations`
    };
  }

  async function handleMapCoordinateSelect(lat, lng, isUserClick = true) {
    if (isMapSelecting) return;
    isMapSelecting = true;

    selectedHostLat = lat;
    selectedHostLng = lng;

    if (hostMarker) {
      hostMarker.setLatLng([lat, lng]);
      if (isUserClick) {
        const loadingHtml = `
          <div class="gmap-click-popup">
            <div class="gmap-popup-header">
              <div class="gmap-popup-badge" style="background: rgba(234, 67, 53, 0.1); color: #ea4335;">
                <span class="badge-dot" style="background: #ea4335;"></span> Locating Place...
              </div>
            </div>
            <h4 class="gmap-popup-title" style="font-size: 0.95rem; color: var(--cream-200);">Identifying place details...</h4>
            <div class="gmap-popup-coords">📍 ${lat.toFixed(5)}, ${lng.toFixed(5)}</div>
          </div>
        `;
        hostMarker.bindPopup(loadingHtml, { maxWidth: 320, closeButton: false }).openPopup();
      }
    }

    const latInput = document.getElementById("hostLat");
    const lngInput = document.getElementById("hostLng");
    if (latInput) latInput.value = lat.toFixed(5);
    if (lngInput) lngInput.value = lng.toFixed(5);

    try {
      const placeData = await reverseGeocodeCoordinates(lat, lng);
      
      // Autofill ALL options down below immediately!
      autofillAllLocationOptions(placeData, true);

      // Update search input displays
      const searchInput = document.getElementById("gmapQuickSearchInput");
      const fsSearchInput = document.getElementById("gmapFullscreenSearchInput");
      const displayQuery = `${placeData.venue}, ${placeData.neighborhood}`;
      if (searchInput) searchInput.value = displayQuery;
      if (fsSearchInput) fsSearchInput.value = displayQuery;
      selectedHostQuery = displayQuery;

      updateMapExternalLinks(lat, lng, `${placeData.venue} ${placeData.address}`);

      // Open confirmed popup
      if (hostMarker) {
        const gmapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeData.venue + ' ' + placeData.address)}`;
        const popupHtml = `
          <div class="gmap-click-popup">
            <div class="gmap-popup-header">
              <div class="gmap-popup-badge"><span class="badge-dot"></span> ✓ Place Selected & Autofilled</div>
            </div>
            <h4 class="gmap-popup-title">${escapeHTML(placeData.venue)}</h4>
            <p class="gmap-popup-address">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${escapeHTML(placeData.address)}
            </p>
            <div class="gmap-popup-tags">
              <span class="gmap-popup-autofill-tag">⚡ All fields below autofilled</span>
            </div>
            <div class="gmap-popup-coords">📍 ${lat.toFixed(5)}, ${lng.toFixed(5)}</div>
            <a href="${gmapSearchUrl}" target="_blank" rel="noopener noreferrer" class="gmap-popup-link">Open in Google Maps ↗</a>
          </div>
        `;
        hostMarker.bindPopup(popupHtml, { maxWidth: 320, closeButton: true }).openPopup();
      }

      if (isUserClick) {
        showToast(`📍 Selected "${placeData.venue}" & auto-filled all options!`, "success");
      }
    } catch (err) {
      console.warn("Map coordinate select error:", err);
    } finally {
      isMapSelecting = false;
    }
  }

  // Backwards-compatible alias for any callers
  function mountLiveGoogleMap(lat, lng, query) {
    mountInteractiveGoogleMap(lat, lng, query, true);
  }

  function setupGoogleMapsFullscreen() {
    const wrapper = document.getElementById("hostMapWrapper");
    const headerBtn = document.getElementById("btnToggleMapFullscreen");
    const floatingBtn = document.getElementById("btnFloatingMapFullscreen");
    const exitBtn = document.getElementById("btnExitMapFullscreen");
    const fsSearchInput = document.getElementById("gmapFullscreenSearchInput");
    const fsSearchBtn = document.getElementById("btnGmapFullscreenSearch");
    const fsOpenLink = document.getElementById("fullscreenOpenInGmapBtn");
    const mainSearchInput = document.getElementById("gmapQuickSearchInput");

    if (!wrapper) return;

    function isFullscreenActive() {
      return document.fullscreenElement === wrapper || wrapper.classList.contains("is-map-fullscreen");
    }

    function syncFullscreenState(active) {
      if (active) {
        wrapper.classList.add("is-map-fullscreen");
        document.body.classList.add("map-fullscreen-active");
        document.querySelectorAll(".fullscreen-icon-expand").forEach(el => el.style.display = "none");
        document.querySelectorAll(".fullscreen-icon-collapse").forEach(el => el.style.display = "inline-block");
        const btnText = document.querySelector("#btnToggleMapFullscreen .fullscreen-btn-text");
        if (btnText) btnText.textContent = "Exit Fullscreen";
        if (fsSearchInput && mainSearchInput) {
          fsSearchInput.value = mainSearchInput.value;
        }
        if (fsOpenLink) {
          const searchTerm = selectedHostQuery || `${selectedHostLat},${selectedHostLng}`;
          fsOpenLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchTerm)}`;
        }
      } else {
        wrapper.classList.remove("is-map-fullscreen");
        document.body.classList.remove("map-fullscreen-active");
        document.querySelectorAll(".fullscreen-icon-expand").forEach(el => el.style.display = "inline-block");
        document.querySelectorAll(".fullscreen-icon-collapse").forEach(el => el.style.display = "none");
        const btnText = document.querySelector("#btnToggleMapFullscreen .fullscreen-btn-text");
        if (btnText) btnText.textContent = "Fullscreen";
      }
    }

    async function enterFullscreen() {
      syncFullscreenState(true);
      if (wrapper.requestFullscreen && !document.fullscreenElement) {
        try {
          await wrapper.requestFullscreen();
        } catch (err) {
          // CSS fixed overlay is already active as seamless fallback
        }
      }
      setTimeout(() => {
        if (hostLeafletMap) hostLeafletMap.invalidateSize();
      }, 250);
    }

    async function exitFullscreen() {
      syncFullscreenState(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        try {
          await document.exitFullscreen();
        } catch (err) {
          // Exit fallback
        }
      }
      setTimeout(() => {
        if (hostLeafletMap) hostLeafletMap.invalidateSize();
      }, 250);
    }

    function toggleFullscreen() {
      if (isFullscreenActive()) {
        exitFullscreen();
      } else {
        enterFullscreen();
      }
    }

    if (headerBtn) headerBtn.addEventListener("click", toggleFullscreen);
    if (floatingBtn) floatingBtn.addEventListener("click", toggleFullscreen);
    if (exitBtn) exitBtn.addEventListener("click", exitFullscreen);

    // Sync with browser native fullscreen exit (Esc key / browser controls)
    document.addEventListener("fullscreenchange", () => {
      const isNative = document.fullscreenElement === wrapper;
      if (!isNative && wrapper.classList.contains("is-map-fullscreen")) {
        syncFullscreenState(false);
      }
      setTimeout(() => {
        if (hostLeafletMap) hostLeafletMap.invalidateSize();
      }, 250);
    });

    // Keyboard Esc key fallback for CSS overlay mode
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && wrapper.classList.contains("is-map-fullscreen")) {
        exitFullscreen();
      }
    });

    // Fullscreen search handling
    if (fsSearchBtn && fsSearchInput) {
      const executeFsSearch = () => {
        const q = fsSearchInput.value.trim();
        if (!q) return;
        if (mainSearchInput) mainSearchInput.value = q;
        handleSpotSearchAutofill(q);
      };

      fsSearchBtn.addEventListener("click", executeFsSearch);
      fsSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          executeFsSearch();
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // Curated Popular Gathering Spots Database (Per City)
  // --------------------------------------------------------------------------
  const CITY_CURATED_SPOTS = {
    "New York": [
      {
        id: "ny-abraco",
        name: "Abraço Espresso",
        icon: "☕",
        venue: "Abraço Espresso",
        neighborhood: "East Village, New York, USA",
        address: "81 E 7th St, New York, NY 10003",
        notes: "Look for the outdoor wooden bench or the Outspire meetup card by the front window.",
        lat: 40.7275,
        lng: -73.9840,
        category: "coffee",
        suggestedTitle: "East Village Coffee & Creative Chats at Abraço"
      },
      {
        id: "ny-central-park",
        name: "Sheep Meadow",
        icon: "🌳",
        venue: "Sheep Meadow Lawn (Central Park)",
        neighborhood: "Manhattan, New York, USA",
        address: "1802 65th St Transverse, New York, NY 10065",
        notes: "Meet by the southwest shade trees near the Le Pain Quotidien pavilion.",
        lat: 40.7712,
        lng: -73.9744,
        category: "walk",
        suggestedTitle: "Central Park Stroll & Relaxed Picnic Convos"
      },
      {
        id: "ny-joes-pizza",
        name: "Joe's Pizza & Park",
        icon: "🍕",
        venue: "Joe's Pizza & Washington Square Park",
        neighborhood: "Greenwich Village, New York, USA",
        address: "7 Carmine St, New York, NY 10014",
        notes: "Grab a slice then gather around the Washington Square fountain circular bench.",
        lat: 40.7306,
        lng: -74.0021,
        category: "dining",
        suggestedTitle: "Village Pizza & Fountain Gathering"
      },
      {
        id: "ny-the-strand",
        name: "The Strand Bookstore",
        icon: "📚",
        venue: "The Strand Bookstore & Union Sq",
        neighborhood: "Union Square, New York, USA",
        address: "828 Broadway, New York, NY 10003",
        notes: "Meet right outside the main corner entrance under the iconic red awning.",
        lat: 40.7333,
        lng: -73.9908,
        category: "coffee",
        suggestedTitle: "Book Lovers Meetup & Coffee at The Strand"
      },
      {
        id: "ny-gramercy-tavern",
        name: "Gramercy Tavern",
        icon: "🍽️",
        venue: "Gramercy Tavern",
        neighborhood: "Flatiron District, New York, USA",
        address: "42 E 20th St, New York, NY 10003",
        notes: "Meet in the tavern front dining room / bar area. Look for the Outspire meetup host.",
        lat: 40.7384,
        lng: -73.9884,
        category: "dining",
        suggestedTitle: "Flatiron Dining & Meaningful Chats at Gramercy Tavern"
      }
    ],
    "London": [
      {
        id: "lon-hyde-park",
        name: "Italian Gardens Café",
        icon: "☕",
        venue: "Italian Gardens Café (Hyde Park)",
        neighborhood: "Westminster, London, UK",
        address: "Italian Gardens, Hyde Park, London W2 2UH",
        notes: "Meet at the outdoor wooden tables overlooking the ornamental fountain pools.",
        lat: 51.5113,
        lng: -0.1754,
        category: "coffee",
        suggestedTitle: "Hyde Park Italian Gardens Coffee & Stroll"
      },
      {
        id: "lon-regents-park",
        name: "Queen Mary's Rose Garden",
        icon: "🌳",
        venue: "Queen Mary's Rose Gardens",
        neighborhood: "Camden, London, UK",
        address: "Chester Rd, Regent's Park, London NW1 4NR",
        notes: "Gather at the pergola benches near the central rose circular fountain.",
        lat: 51.5284,
        lng: -0.1537,
        category: "walk",
        suggestedTitle: "Regent's Park Rose Garden Weekend Walk"
      },
      {
        id: "lon-monmouth",
        name: "Monmouth Coffee",
        icon: "☕",
        venue: "Monmouth Coffee Company",
        neighborhood: "Covent Garden, London, UK",
        address: "27 Monmouth St, London WC2H 9EU",
        notes: "Meet by the outdoor standing barrels or front bench along Monmouth Street.",
        lat: 51.5139,
        lng: -0.1269,
        category: "coffee",
        suggestedTitle: "Covent Garden Espresso & Friendly Talks"
      }
    ],
    "Tokyo": [
      {
        id: "tyo-shibuya-stream",
        name: "Shibuya Stream Terrace",
        icon: "☕",
        venue: "Shibuya Stream Riverside Terrace",
        neighborhood: "Shibuya, Tokyo, Japan",
        address: "3-21-3 Shibuya, Shibuya City, Tokyo 150-0002",
        notes: "Meet at the riverside public wooden benches next to Dean & DeLuca.",
        lat: 35.6580,
        lng: 139.7037,
        category: "coffee",
        suggestedTitle: "Shibuya Riverside Evening Coffee & Social"
      },
      {
        id: "tyo-shinjuku-gyoen",
        name: "Shinjuku Gyoen Garden",
        icon: "🌳",
        venue: "Shinjuku Gyoen National Garden",
        neighborhood: "Shinjuku, Tokyo, Japan",
        address: "11 Naitomachi, Shinjuku City, Tokyo 160-0014",
        notes: "Meet right inside the Shinjuku Gate near the green lawn picnic circle.",
        lat: 35.6852,
        lng: 139.7101,
        category: "walk",
        suggestedTitle: "Shinjuku Gyoen Peaceful Stroll & Chat"
      },
      {
        id: "tyo-daikanyama",
        name: "Daikanyama T-Site",
        icon: "🍵",
        venue: "Daikanyama T-Site Garden Table",
        neighborhood: "Daikanyama, Tokyo, Japan",
        address: "16-15 Sarugakucho, Shibuya City, Tokyo 150-0033",
        notes: "Meet at the outdoor terrace tables under the trees outside Tsutaya Books.",
        lat: 35.6491,
        lng: 139.6996,
        category: "coffee",
        suggestedTitle: "Daikanyama Book & Coffee Gathering"
      }
    ],
    "Paris": [
      {
        id: "par-cafe-flore",
        name: "Café de Flore",
        icon: "☕",
        venue: "Café de Flore",
        neighborhood: "Saint-Germain-des-Prés, Paris, France",
        address: "172 Bd Saint-Germain, 75006 Paris",
        notes: "Gather at the covered terrace tables along Boulevard Saint-Germain.",
        lat: 48.8542,
        lng: 2.3325,
        category: "coffee",
        suggestedTitle: "Saint-Germain Afternoon Coffee at Café de Flore"
      },
      {
        id: "par-luxembourg",
        name: "Jardin du Luxembourg",
        icon: "🌳",
        venue: "Jardin du Luxembourg Medici Fountain",
        neighborhood: "6th Arrondissement, Paris, France",
        address: "Rue de Médicis, 75006 Paris",
        notes: "Meet on the iconic green park chairs surrounding the Medici water basin.",
        lat: 48.8475,
        lng: 2.3392,
        category: "walk",
        suggestedTitle: "Luxembourg Gardens Stroll & Casual Talks"
      },
      {
        id: "par-canal-st-martin",
        name: "Canal Saint-Martin",
        icon: "🌉",
        venue: "Canal Saint-Martin Iron Footbridge",
        neighborhood: "10th Arrondissement, Paris, France",
        address: "Quai de Valmy, 75010 Paris",
        notes: "Gather on the elevated arched iron footbridge overlooking the water locks.",
        lat: 48.8718,
        lng: 2.3653,
        category: "walk",
        suggestedTitle: "Canal Saint-Martin Sunset Social Stroll"
      }
    ],
    "Berlin": [
      {
        id: "ber-tiergarten",
        name: "Café am Neuen See",
        icon: "☕",
        venue: "Café am Neuen See (Tiergarten)",
        neighborhood: "Tiergarten, Berlin, Germany",
        address: "Lichtensteinallee 2, 10787 Berlin",
        notes: "Meet at the long wooden tables directly beside the scenic boating lake.",
        lat: 52.5074,
        lng: 13.3444,
        category: "dining",
        suggestedTitle: "Tiergarten Lakeside Tables & Meaningful Chats"
      },
      {
        id: "ber-mauerpark",
        name: "Mauerpark Amphitheater",
        icon: "🌳",
        venue: "Mauerpark Stone Amphitheater",
        neighborhood: "Prenzlauer Berg, Berlin, Germany",
        address: "Gleimstraße 55, 10437 Berlin",
        notes: "Meet at the top tier stone steps overlooking the grassy open knoll.",
        lat: 52.5441,
        lng: 13.4026,
        category: "walk",
        suggestedTitle: "Mauerpark Sunday Social & Open Vibe"
      },
      {
        id: "ber-the-barn",
        name: "The Barn Coffee",
        icon: "☕",
        venue: "The Barn Coffee Roasters (Mitte)",
        neighborhood: "Mitte, Berlin, Germany",
        address: "Auguststraße 58, 10119 Berlin",
        notes: "Look for the outdoor bench along Auguststraße with the Outspire card.",
        lat: 52.5278,
        lng: 13.3957,
        category: "coffee",
        suggestedTitle: "Berlin Specialty Coffee & Ideas at The Barn"
      }
    ],
    "Sydney": [
      {
        id: "syd-single-o",
        name: "Surry Hills Roastery",
        icon: "☕",
        venue: "Single O Surry Hills",
        neighborhood: "Surry Hills, Sydney, Australia",
        address: "60-64 Reservoir St, Surry Hills NSW 2010",
        notes: "Gather at the sidewalk street tables along Reservoir Street.",
        lat: -33.8837,
        lng: 151.2112,
        category: "coffee",
        suggestedTitle: "Surry Hills Morning Coffee & Community"
      },
      {
        id: "syd-botanic",
        name: "Botanic Garden Lawn",
        icon: "🌳",
        venue: "Mrs Macquarie's Chair & Botanic Lawn",
        neighborhood: "Sydney CBD, Australia",
        address: "1 Mrs Macquaries Rd, Sydney NSW 2000",
        notes: "Meet at the shade trees facing the iconic Harbour Bridge & Opera House.",
        lat: -33.8599,
        lng: 151.2223,
        category: "walk",
        suggestedTitle: "Harbour View Stroll & Open Conversations"
      },
      {
        id: "syd-circular-quay",
        name: "Circular Quay Waterfront",
        icon: "🌊",
        venue: "Circular Quay Promenade Steps",
        neighborhood: "The Rocks, Sydney, Australia",
        address: "Eastbank, Circular Quay, Sydney NSW 2000",
        notes: "Meet at the seaside wooden benches outside the MCA café.",
        lat: -33.8602,
        lng: 151.2096,
        category: "dining",
        suggestedTitle: "Circular Quay Harbor Breeze Social"
      }
    ],
    "Toronto": [
      {
        id: "tor-trinity",
        name: "Trinity Bellwoods Park",
        icon: "🌳",
        venue: "Trinity Bellwoods Circle Table",
        neighborhood: "West Queen West, Toronto, Canada",
        address: "790 Queen St W, Toronto, ON M6J 1G3",
        notes: "Meet at the grassy bowl benches near the central community dog bowl.",
        lat: 43.6473,
        lng: -79.4138,
        category: "walk",
        suggestedTitle: "Trinity Bellwoods Weekend Park Social"
      },
      {
        id: "tor-fika",
        name: "Fika Café & Garden Patio",
        icon: "☕",
        venue: "Fika Café & Garden Patio",
        neighborhood: "Kensington Market, Toronto, Canada",
        address: "28 Kensington Ave, Toronto, ON M5T 2J9",
        notes: "Gather in the cozy backyard garden patio with warm string lights.",
        lat: 43.6536,
        lng: -79.4005,
        category: "coffee",
        suggestedTitle: "Kensington Market Garden Coffee & Good Vibes"
      },
      {
        id: "tor-high-park",
        name: "High Park Grenadier",
        icon: "🌳",
        venue: "Grenadier Café Terrace (High Park)",
        neighborhood: "High Park, Toronto, Canada",
        address: "200 Parkside Dr, Toronto, ON M6R 2Z3",
        notes: "Meet by the outdoor garden pavilion overlooking Grenadier Pond.",
        lat: 43.6465,
        lng: -79.4637,
        category: "walk",
        suggestedTitle: "High Park Nature Stroll & Thoughtful Chats"
      }
    ]
  };

  // --------------------------------------------------------------------------
  // Location Autofill Engine: Populates ALL Venue & Meeting Options
  // --------------------------------------------------------------------------
  function autofillAllLocationOptions(data, shouldFlash = true) {
    if (!data) return;

    const venueInput = document.getElementById("hostVenueName");
    const neighInput = document.getElementById("hostNeighborhood");
    const addressInput = document.getElementById("hostVenueAddress");
    const notesInput = document.getElementById("hostVenueNotes");
    const latInput = document.getElementById("hostLat");
    const lngInput = document.getElementById("hostLng");
    const titleInput = document.getElementById("hostMeetupTitle");

    // Force autofill all venue fields
    if (venueInput && data.venue) {
      venueInput.value = data.venue;
      if (shouldFlash) flashAutofillField(venueInput);
    }

    if (neighInput && data.neighborhood) {
      neighInput.value = data.neighborhood;
      if (shouldFlash) flashAutofillField(neighInput);
    }

    if (addressInput && data.address) {
      addressInput.value = data.address;
      if (shouldFlash) flashAutofillField(addressInput);
    }

    if (notesInput) {
      notesInput.value = data.notes || `Meet at the main entrance / seating area of ${data.venue}. Look for the Outspire meetup group.`;
      if (shouldFlash) flashAutofillField(notesInput);
    }

    if (latInput && data.lat) latInput.value = Number(data.lat).toFixed(5);
    if (lngInput && data.lng) lngInput.value = Number(data.lng).toFixed(5);

    if (data.lat && data.lng) {
      selectedHostLat = Number(data.lat);
      selectedHostLng = Number(data.lng);
    }

    // Auto-suggest a warm meetup title if default or unedited
    if (titleInput && (!titleInput.value || titleInput.value.includes("Sunday Coffee & Thoughtful Conversations") || !titleInput.dataset.userEdited)) {
      titleInput.value = data.suggestedTitle || `Meetup & Relaxed Conversations at ${data.venue}`;
      if (shouldFlash) flashAutofillField(titleInput);
    }

    // Auto-align category if specified and unedited
    if (data.category) {
      const catSelect = document.getElementById("hostCategory");
      if (catSelect && !catSelect.dataset.userEdited) {
        catSelect.value = data.category;
      }
    }

    // Update Live Preview Card
    updateHostPreview();
  }

  function flashAutofillField(el) {
    if (!el) return;
    el.classList.remove("field-autofilled-glow");
    void el.offsetWidth; // Force CSS reflow
    el.classList.add("field-autofilled-glow");
  }

  async function handleSpotSearchAutofill(query) {
    const q = (query || "").trim();
    if (!q) return;

    // 1. Check if q matches any spot in our curated database
    for (const city of Object.keys(CITY_CURATED_SPOTS)) {
      const match = CITY_CURATED_SPOTS[city].find(s => 
        s.name.toLowerCase().includes(q.toLowerCase()) || 
        s.venue.toLowerCase().includes(q.toLowerCase())
      );
      if (match) {
        mountInteractiveGoogleMap(match.lat, match.lng, `${match.venue}, ${match.neighborhood}`, true);
        autofillAllLocationOptions(match, true);
        showToast(`📍 Found & auto-filled all options for: ${match.venue}`, "success");
        return;
      }
    }

    // 2. Perform live geocoding lookup
    let spotData = null;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&q=${encodeURIComponent(q)}&limit=1`);
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const item = results[0];
          const addr = item.address || {};
          const road = addr.road || addr.pedestrian || addr.suburb || "";
          const houseNum = addr.house_number ? `${addr.house_number} ` : "";
          const city = addr.city || addr.town || addr.municipality || addr.village || addr.city_district || "";
          const neighborhood = addr.neighbourhood || addr.suburb || addr.quarter || city;
          const country = addr.country || "";
          const state = addr.state || "";

          const venueName = item.name && item.name !== road ? item.name : q.split(",")[0].trim();
          const cleanAddress = [houseNum + road, neighborhood, city, state, country].filter(Boolean).join(", ") || item.display_name;
          const cityArea = [city || neighborhood, country].filter(Boolean).join(", ") || "Selected City";

          spotData = {
            venue: venueName,
            neighborhood: cityArea,
            address: cleanAddress,
            notes: `Meet at the main entrance / seating area of ${venueName}. Look for the Outspire meetup group.`,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            suggestedTitle: `Casual Meetup & Great Convos at ${venueName}`
          };
        }
      }
    } catch (e) {
      console.warn("Geocoding lookup notice:", e);
    }

    // 3. Fallback heuristic parser if network was offline or no match
    if (!spotData) {
      const parts = q.split(",").map(p => p.trim()).filter(Boolean);
      const venueName = parts[0] || q;
      const cityArea = parts.length > 1 ? parts.slice(1).join(", ") : "Selected City";
      spotData = {
        venue: venueName,
        neighborhood: cityArea,
        address: q,
        notes: `Meet near the entrance or outdoor seating at ${venueName}. Look for the Outspire table card.`,
        lat: selectedHostLat,
        lng: selectedHostLng,
        suggestedTitle: `Meetup & Relaxed Conversations at ${venueName}`
      };
    }

    // Mount Interactive Google Map & Autofill ALL options!
    mountInteractiveGoogleMap(spotData.lat, spotData.lng, q, true);
    autofillAllLocationOptions(spotData, true);
    showToast(`📍 Google Maps updated & all options auto-filled for ${spotData.venue}!`, "success");
  }

  function setupGoogleMapsSearch() {
    const searchInput = document.getElementById("gmapQuickSearchInput");
    const searchBtn = document.getElementById("btnGmapSearch");

    const doSearch = () => {
      const q = searchInput?.value.trim();
      if (!q) return;
      handleSpotSearchAutofill(q);
    };

    if (searchBtn) {
      searchBtn.addEventListener("click", doSearch);
    }
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          doSearch();
        }
      });
    }
  }

  function setupNeighborhoodPresets() {
    const presetChips = document.querySelectorAll(".map-preset-chips .preset-chip");
    presetChips.forEach(chip => {
      chip.addEventListener("click", () => {
        presetChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const name = chip.dataset.name;

        // Pick primary spot for this city
        const spots = CITY_CURATED_SPOTS[name] || [];
        const primarySpot = spots[0] || {
          venue: `${name} Central Spot`,
          neighborhood: chip.dataset.city || name,
          address: `${name}, Center`,
          notes: "Meet near the central landmark or plaza with the Outspire meetup card.",
          lat: parseFloat(chip.dataset.lat),
          lng: parseFloat(chip.dataset.lng),
          suggestedTitle: `Community Gathering & Conversation in ${name}`
        };

        // Update search inputs
        const searchInput = document.getElementById("gmapQuickSearchInput");
        const fsSearch = document.getElementById("gmapFullscreenSearchInput");
        const queryTerm = `${primarySpot.venue}, ${primarySpot.neighborhood}`;
        if (searchInput) searchInput.value = queryTerm;
        if (fsSearch) fsSearch.value = queryTerm;

        // Mount live Google Map & open popup
        mountInteractiveGoogleMap(primarySpot.lat, primarySpot.lng, queryTerm, true);

        // Autofill ALL options!
        autofillAllLocationOptions(primarySpot, true);
        showToast(`✓ City switched to ${name} & options auto-filled!`, "success");
      });
    });
  }

  function setHostLocation(lat, lng, doGeocode = false) {
    selectedHostLat = lat;
    selectedHostLng = lng;

    const latInput = document.getElementById("hostLat");
    const lngInput = document.getElementById("hostLng");
    if (latInput) latInput.value = lat.toFixed(5);
    if (lngInput) lngInput.value = lng.toFixed(5);

    if (doGeocode) {
      clearTimeout(reverseGeocodeTimeout);
      reverseGeocodeTimeout = setTimeout(() => {
        fetchReverseGeocode(lat, lng);
      }, 350);
    } else {
      updateHostPreview();
    }
  }

  async function fetchReverseGeocode(lat, lng) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const road = data.address.road || data.address.pedestrian || data.address.suburb || "";
          const houseNum = data.address.house_number ? `${data.address.house_number} ` : "";
          const country = data.address.country || "";
          const city = data.address.city || data.address.town || data.address.municipality || data.address.village || data.address.city_district || "";
          const neighborhood = data.address.neighbourhood || data.address.suburb || data.address.quarter || city;
          const stateOrCountry = data.address.state || country;
          const postcode = data.address.postcode || "";

          const addressInput = document.getElementById("hostVenueAddress");
          const venueInput = document.getElementById("hostVenueName");
          const neighborhoodInput = document.getElementById("hostNeighborhood");

          if (addressInput && !addressInput.dataset.userEdited) {
            const cleanAddr = [houseNum + road, neighborhood, city, stateOrCountry, country].filter(Boolean).join(", ");
            if (cleanAddr) addressInput.value = cleanAddr;
          }

          if (neighborhoodInput && !neighborhoodInput.dataset.userEdited) {
            const displayCity = city ? (country ? `${city}, ${country}` : city) : (neighborhood ? (country ? `${neighborhood}, ${country}` : neighborhood) : country);
            neighborhoodInput.value = displayCity || "Worldwide";
          }

          if (venueInput && !venueInput.value) {
            if (data.name && data.name !== road) {
              venueInput.value = data.name;
            }
          }

          updateHostPreview();
        }
      }
    } catch (err) {
      console.warn("Geocoding notice:", err);
      updateHostPreview();
    }
  }

  function setDefaultMeetupDate() {
    const dateInput = document.getElementById("hostMeetupDate");
    const win = typeof calculate4DayBookingWindow === "function" ? calculate4DayBookingWindow() : null;
    if (dateInput && win) {
      dateInput.min = win.startDateStr;
      dateInput.max = win.endDateStr;
      if (!dateInput.value || dateInput.value < win.startDateStr || dateInput.value > win.endDateStr) {
        dateInput.value = win.days[1].dateStr; // default to Tomorrow
      }
    }
  }

  let tempCandidatePhotoUrl = null;

  function renderPhotoSelector() {
    const container = document.getElementById("photoSelectorGrid");
    if (!container || typeof HOST_CURATED_PHOTOS === "undefined") return;

    const hiddenInput = document.getElementById("hostSelectedPhoto");
    let currentPhoto = hiddenInput?.value || HOST_CURATED_PHOTOS[0].url;

    const hasCustomPhoto = !!state.customHostPhotoUrl;
    const isCustomSelected = hasCustomPhoto && currentPhoto === state.customHostPhotoUrl;

    let html = HOST_CURATED_PHOTOS.map(item => `
      <div 
        class="photo-option ${item.url === currentPhoto ? 'selected' : ''}" 
        data-photo-url="${item.url}"
        role="radio"
        aria-checked="${item.url === currentPhoto}"
        tabindex="0"
        title="${escapeHTML(item.label)}"
      >
        <img src="${item.url}" alt="${escapeHTML(item.label)}" loading="lazy" />
        <div class="photo-option-label">${escapeHTML(item.label)}</div>
      </div>
    `).join("");

    // 12th Slot: Add Your Own Cover Photo Card
    html += `
      <div 
        class="photo-option photo-option-custom ${isCustomSelected ? 'selected' : ''}" 
        id="customPhotoOptionCard" 
        data-photo-url="${hasCustomPhoto ? escapeHTML(state.customHostPhotoUrl) : ''}"
        role="radio"
        aria-checked="${isCustomSelected}"
        tabindex="0"
        title="${hasCustomPhoto ? 'Click to change custom cover photo' : 'Upload or paste your own cover photo'}"
      >
        <div class="custom-photo-inner" id="customPhotoCardContent" style="${hasCustomPhoto ? 'display: none;' : ''}">
          <div class="custom-photo-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span class="custom-photo-plus">+</span>
          </div>
          <div class="custom-photo-title">Add Your Own</div>
          <div class="custom-photo-subtitle">Upload file or link</div>
        </div>
        <img id="customPhotoPreviewImg" src="${hasCustomPhoto ? escapeHTML(state.customHostPhotoUrl) : ''}" alt="Custom cover photo" style="${hasCustomPhoto ? '' : 'display: none;'}" />
        <div class="photo-option-label" id="customPhotoOptionLabel" style="${hasCustomPhoto ? '' : 'display: none;'}">
          ✓ Custom Cover Photo
        </div>
      </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll(".photo-option").forEach(card => {
      if (card.id === "customPhotoOptionCard") {
        card.addEventListener("click", () => {
          openCustomPhotoModal();
        });
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openCustomPhotoModal();
          }
        });
      } else {
        const selectCard = () => {
          container.querySelectorAll(".photo-option").forEach(c => {
            c.classList.remove("selected");
            c.setAttribute("aria-checked", "false");
          });
          card.classList.add("selected");
          card.setAttribute("aria-checked", "true");
          if (hiddenInput) hiddenInput.value = card.dataset.photoUrl;
          updateHostPreview();
        };

        card.addEventListener("click", selectCard);
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectCard();
          }
        });
      }
    });
  }

  function initCustomPhotoModal() {
    const modal = document.getElementById("customPhotoModal");
    if (!modal) return;

    const closeBtn = document.getElementById("closeCustomPhotoModalBtn");
    const cancelBtn = document.getElementById("btnCancelCustomPhoto");
    const applyBtn = document.getElementById("btnApplyCustomPhoto");
    const tabUpload = document.getElementById("tabUploadFile");
    const tabUrl = document.getElementById("tabPasteUrl");
    const sectionUpload = document.getElementById("sectionUploadFile");
    const sectionUrl = document.getElementById("sectionPasteUrl");
    const dropzone = document.getElementById("customPhotoDropzone");
    const fileInput = document.getElementById("hostCoverFileInput");
    const urlInput = document.getElementById("customPhotoUrlInput");
    const btnPreviewUrl = document.getElementById("btnPreviewPhotoUrl");
    const previewArea = document.getElementById("customPhotoPreviewArea");
    const previewImg = document.getElementById("customPhotoPreviewImgElement");

    function closeModal() {
      modal.close();
    }

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    // Tab switching
    if (tabUpload && tabUrl) {
      tabUpload.addEventListener("click", () => {
        sectionUpload.style.display = "block";
        sectionUrl.style.display = "none";
        tabUpload.style.background = "rgba(227, 210, 186, 0.16)";
        tabUpload.style.borderColor = "var(--cream-300)";
        tabUpload.style.color = "var(--cream-100)";
        tabUrl.style.background = "";
        tabUrl.style.borderColor = "";
        tabUrl.style.color = "";
      });

      tabUrl.addEventListener("click", () => {
        sectionUpload.style.display = "none";
        sectionUrl.style.display = "block";
        tabUrl.style.background = "rgba(227, 210, 186, 0.16)";
        tabUrl.style.borderColor = "var(--cream-300)";
        tabUrl.style.color = "var(--cream-100)";
        tabUpload.style.background = "";
        tabUpload.style.borderColor = "";
        tabUpload.style.color = "";
        if (urlInput) urlInput.focus();
      });
    }

    // Dropzone & File Input
    if (dropzone && fileInput) {
      dropzone.addEventListener("click", () => {
        fileInput.click();
      });

      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("drag-over");
      });

      dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("drag-over");
      });

      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("drag-over");
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileChosen(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFileChosen(e.target.files[0]);
        }
      });
    }

    function handleFileChosen(file) {
      if (!file.type.startsWith("image/")) {
        showToast("Please select a valid image file (PNG, JPG, WebP)", "warning");
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        showToast("Image size must be under 8MB", "warning");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        tempCandidatePhotoUrl = e.target.result;
        if (previewImg && previewArea) {
          previewImg.src = tempCandidatePhotoUrl;
          previewArea.style.display = "block";
        }
        if (applyBtn) applyBtn.disabled = false;
      };
      reader.readAsDataURL(file);
    }

    // URL Preview
    function handlePreviewUrl() {
      const val = urlInput?.value.trim();
      if (!val) {
        showToast("Please enter an image URL", "warning");
        return;
      }
      if (!val.startsWith("http://") && !val.startsWith("https://") && !val.startsWith("data:")) {
        showToast("Please enter a valid URL starting with http:// or https://", "warning");
        return;
      }

      const img = new Image();
      img.onload = () => {
        tempCandidatePhotoUrl = val;
        if (previewImg && previewArea) {
          previewImg.src = val;
          previewArea.style.display = "block";
        }
        if (applyBtn) applyBtn.disabled = false;
      };
      img.onerror = () => {
        showToast("Could not load image from that URL. Please verify the link.", "error");
      };
      img.src = val;
    }

    if (btnPreviewUrl) {
      btnPreviewUrl.addEventListener("click", handlePreviewUrl);
    }
    if (urlInput) {
      urlInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handlePreviewUrl();
        }
      });
    }

    // Apply Button
    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        if (!tempCandidatePhotoUrl) return;

        state.customHostPhotoUrl = tempCandidatePhotoUrl;
        const hiddenInput = document.getElementById("hostSelectedPhoto");
        if (hiddenInput) hiddenInput.value = tempCandidatePhotoUrl;

        // Update custom card in grid
        const customCard = document.getElementById("customPhotoOptionCard");
        const customContent = document.getElementById("customPhotoCardContent");
        const customImg = document.getElementById("customPhotoPreviewImg");
        const customLabel = document.getElementById("customPhotoOptionLabel");
        const container = document.getElementById("photoSelectorGrid");

        if (container) {
          container.querySelectorAll(".photo-option").forEach(c => {
            c.classList.remove("selected");
            c.setAttribute("aria-checked", "false");
          });
        }

        if (customCard) {
          customCard.classList.add("selected");
          customCard.setAttribute("aria-checked", "true");
          customCard.dataset.photoUrl = tempCandidatePhotoUrl;
          customCard.title = "Click to change custom cover photo";
        }
        if (customContent) customContent.style.display = "none";
        if (customImg) {
          customImg.src = tempCandidatePhotoUrl;
          customImg.style.display = "block";
        }
        if (customLabel) customLabel.style.display = "block";

        updateHostPreview();
        closeModal();
        showToast("📷 Custom cover photo applied to your gathering!", "success");
      });
    }
  }

  function openCustomPhotoModal() {
    const modal = document.getElementById("customPhotoModal");
    if (!modal) return;

    const previewArea = document.getElementById("customPhotoPreviewArea");
    const previewImg = document.getElementById("customPhotoPreviewImgElement");
    const applyBtn = document.getElementById("btnApplyCustomPhoto");
    const urlInput = document.getElementById("customPhotoUrlInput");

    tempCandidatePhotoUrl = state.customHostPhotoUrl || null;

    if (state.customHostPhotoUrl && previewImg && previewArea) {
      previewImg.src = state.customHostPhotoUrl;
      previewArea.style.display = "block";
      if (applyBtn) applyBtn.disabled = false;
      if (urlInput && !state.customHostPhotoUrl.startsWith("data:")) {
        urlInput.value = state.customHostPhotoUrl;
      }
    } else {
      if (previewArea) previewArea.style.display = "none";
      if (applyBtn) applyBtn.disabled = true;
      if (urlInput) urlInput.value = "";
    }

    modal.showModal();
  }

  const CAFE_CAPACITY_OPTIONS = [
    { value: "2", label: "2 people (Intimate Pair)" },
    { value: "3", label: "3 people (Cozy Trio)" },
    { value: "4", label: "4 people (Small Table)" },
    { value: "5", label: "5 people (Balanced Circle)" },
    { value: "6", label: "6 people (Classic Group)" },
    { value: "7", label: "7 people (Lively Dinner)" },
    { value: "8", label: "8 people (Spacious Group)" },
    { value: "9", label: "9 people (Festive Table)" },
    { value: "10", label: "10 people (Max Café/Dining Limit)" }
  ];

  const OPEN_CAPACITY_OPTIONS = [
    { value: "2", label: "2 people (Pair)" },
    { value: "4", label: "4 people (Small Group)" },
    { value: "6", label: "6 people (Active Group)" },
    { value: "8", label: "8 people (Squad)" },
    { value: "10", label: "10 people (Full Team)" },
    { value: "12", label: "12 people (Community Group)" },
    { value: "15", label: "15 people (Active Meetup)" },
    { value: "20", label: "20 people (Large Gathering)" },
    { value: "25", label: "25 people (Big Group / Team)" },
    { value: "30", label: "30 people (Open Gathering)" },
    { value: "40", label: "40 people (Community Group)" },
    { value: "50", label: "50 people (Large Community Meetup)" },
    { value: "100", label: "100+ people (Open Event / Festival)" },
    { value: "custom", label: "✏️ Custom number of people..." }
  ];

  function confirmCustomCapacity(isSilent = false) {
    const customInput = document.getElementById("hostCustomCapacity");
    const warningEl = document.getElementById("customCapacityRuleWarning");
    const badgeEl = document.getElementById("customCapacityConfirmedBadge");
    if (!customInput) return;

    let val = parseInt(customInput.value, 10);

    if (isNaN(val) || val < 2) {
      val = 2;
      customInput.value = "2";
      if (!isSilent) showToast("Minimum group size is 2 people.", "info");
    }

    if (val > 100) {
      customInput.value = "100";
      val = 100;
      if (warningEl) {
        warningEl.style.display = "block";
        warningEl.innerHTML = `⚠️ <strong>Cap Reached:</strong> Open gatherings are limited to <strong>100+ at max</strong>. Set to 100.`;
      }
      if (!isSilent) {
        showToast("Open gatherings are capped at 100+ people at max.", "info");
      }
    } else {
      if (warningEl) warningEl.style.display = "none";
    }

    if (badgeEl) {
      badgeEl.style.display = "inline-flex";
      badgeEl.textContent = `✓ Confirmed: ${val} people`;
    }

    if (!isSilent && val <= 100) {
      showToast(`Confirmed: ${val} people for this gathering`, "success");
    }

    updateHostPreview();
  }

  function updateCapacityDropdownForCategory(category) {
    const capacitySelect = document.getElementById("hostCapacity");
    const helperText = document.getElementById("capacityHelperText");
    const customWrapper = document.getElementById("customCapacityWrapper");
    const customInput = document.getElementById("hostCustomCapacity");
    const customHint = document.getElementById("customCapacityHint");
    const warningEl = document.getElementById("customCapacityRuleWarning");
    const badgeEl = document.getElementById("customCapacityConfirmedBadge");
    if (!capacitySelect) return;

    const isIntimateDining = category === "coffee" || category === "dining" || category === "nightlife";
    const currentVal = capacitySelect.value;
    const options = isIntimateDining ? CAFE_CAPACITY_OPTIONS : OPEN_CAPACITY_OPTIONS;

    capacitySelect.innerHTML = options.map(opt => 
      `<option value="${opt.value}" ${opt.value === currentVal ? 'selected' : ''}>${opt.label}</option>`
    ).join("");

    // If previous value is not in new options (e.g. was custom or large number), assign a sensible default
    if (!options.some(opt => opt.value === currentVal)) {
      capacitySelect.value = isIntimateDining ? "6" : "15";
    }

    if (customWrapper) {
      if (!isIntimateDining && capacitySelect.value === "custom") {
        customWrapper.style.display = "block";
        if (customInput) {
          customInput.max = "100";
          if (warningEl) warningEl.style.display = "none";
          if (customHint) customHint.textContent = "Enter any specific crowd size (e.g. 18, 35, 75, or 100+ at max). Press Enter to confirm.";
        }
      } else {
        customWrapper.style.display = "none";
        if (warningEl) warningEl.style.display = "none";
        if (badgeEl) badgeEl.style.display = "none";
      }
    }

    if (helperText) {
      helperText.textContent = isIntimateDining 
        ? "Café and dining meetups are capped at 10 people max for intimate table conversation."
        : "Outdoor, active, sports, creative & custom meetups can welcome any crowd size (from 2 up to 100+ at max)!";
    }
  }

  function bindHostFormLivePreview() {
    const fields = [
      "hostMeetupTitle",
      "hostCategory",
      "hostCapacity",
      "hostCustomCapacity",
      "hostMeetupDate",
      "hostMeetupTime",
      "hostDescription",
      "hostVenueName",
      "hostNeighborhood",
      "hostVenueAddress",
      "hostRole"
    ];

    fields.forEach(fieldId => {
      const el = document.getElementById(fieldId);
      if (el) {
        el.addEventListener("input", () => {
          el.dataset.userEdited = "true";
          updateHostPreview();
        });
        el.addEventListener("change", updateHostPreview);
      }
    });

    const editProfileBtn = document.getElementById("btnEditProfileFromHost");
    if (editProfileBtn && !editProfileBtn.dataset.bound) {
      editProfileBtn.dataset.bound = "true";
      editProfileBtn.addEventListener("click", () => {
        if (typeof openUserProfileModal === "function") {
          openUserProfileModal("about");
        }
      });
    }

    syncHostProfileInfo();

    // Auto-locate address on Google Map when host finishes typing venue, address, or neighborhood
    const addressInput = document.getElementById("hostVenueAddress");
    const venueInput = document.getElementById("hostVenueName");
    const neighInput = document.getElementById("hostNeighborhood");
    const updateGmapFromInputs = () => {
      const v = venueInput?.value.trim() || "";
      const a = addressInput?.value.trim() || "";
      const n = neighInput?.value.trim() || "";
      const queryParts = [v, a, n].filter(Boolean);
      if (queryParts.length > 0) {
        mountLiveGoogleMap(selectedHostLat, selectedHostLng, queryParts.join(", "));
      }
    };
    if (addressInput) addressInput.addEventListener("change", updateGmapFromInputs);
    if (venueInput) venueInput.addEventListener("change", updateGmapFromInputs);
    if (neighInput) neighInput.addEventListener("change", updateGmapFromInputs);

    const capacitySelect = document.getElementById("hostCapacity");
    if (capacitySelect) {
      capacitySelect.addEventListener("change", () => {
        const customWrapper = document.getElementById("customCapacityWrapper");
        const customInput = document.getElementById("hostCustomCapacity");
        const categorySelect = document.getElementById("hostCategory");
        const isDining = categorySelect?.value === "coffee" || categorySelect?.value === "dining" || categorySelect?.value === "nightlife";
        const badgeEl = document.getElementById("customCapacityConfirmedBadge");
        const warningEl = document.getElementById("customCapacityRuleWarning");
        if (customWrapper) {
          if (!isDining && capacitySelect.value === "custom") {
            customWrapper.style.display = "block";
            if (customInput && !customInput.value) {
              customInput.value = "18";
            }
            if (badgeEl) {
              badgeEl.style.display = "inline-flex";
              badgeEl.textContent = `✓ Confirmed: ${customInput?.value || '18'} people`;
            }
            if (customInput) customInput.focus();
          } else {
            customWrapper.style.display = "none";
            if (warningEl) warningEl.style.display = "none";
            if (badgeEl) badgeEl.style.display = "none";
          }
        }
        updateHostPreview();
      });
    }

    const confirmCapacityBtn = document.getElementById("confirmCustomCapacityBtn");
    if (confirmCapacityBtn) {
      confirmCapacityBtn.addEventListener("click", () => confirmCustomCapacity(false));
    }

    const customCapInput = document.getElementById("hostCustomCapacity");
    if (customCapInput) {
      customCapInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          confirmCustomCapacity(false);
        }
      });
      customCapInput.addEventListener("input", () => {
        const warningEl = document.getElementById("customCapacityRuleWarning");
        const badgeEl = document.getElementById("customCapacityConfirmedBadge");
        if (badgeEl) badgeEl.style.display = "none";

        const val = parseInt(customCapInput.value, 10);
        if (!isNaN(val) && val > 100) {
          if (warningEl) {
            warningEl.style.display = "block";
            warningEl.innerHTML = `⚠️ <strong>Cap Reached:</strong> Open gatherings are limited to <strong>100+ at max</strong>. Click <strong>Enter</strong> to set to 100.`;
          }
        } else {
          if (warningEl) warningEl.style.display = "none";
        }
        updateHostPreview();
      });
      customCapInput.addEventListener("change", () => confirmCustomCapacity(true));
      customCapInput.addEventListener("blur", () => confirmCustomCapacity(true));
    }

    const audienceChips = document.getElementById("audienceVibeChips");
    if (audienceChips) {
      audienceChips.querySelectorAll("button.preset-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          const tag = chip.dataset.vibeTag;
          if (!tag) return;
          const descEl = document.getElementById("hostDescription");
          if (!descEl) return;

          chip.classList.toggle("active");
          const isActive = chip.classList.contains("active");

          let currentVal = descEl.value.trim();

          if (isActive) {
            if (!currentVal) {
              descEl.value = `Who should join: ${tag}. `;
            } else if (currentVal.includes("Who should join:")) {
              descEl.value = currentVal.replace(/(Who should join:[^\n]*)/, `$1, ${tag}`);
            } else {
              descEl.value = `${currentVal}\n\nWho should join: ${tag}.`;
            }
          } else {
            descEl.value = descEl.value
              .replace(new RegExp(`,?\\s*${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'), '')
              .replace(/Who should join:\s*(\.|\s*)?$/, '')
              .trim();
          }

          descEl.dataset.userEdited = "true";
          updateHostPreview();
        });
      });
    }

    const categorySelect = document.getElementById("hostCategory");
    if (categorySelect) {
      categorySelect.addEventListener("change", (e) => {
        const selectedCat = e.target.value;
        updateCapacityDropdownForCategory(selectedCat);

        // Auto-suggest matching photo if available and not manually chosen
        const hiddenPhoto = document.getElementById("hostSelectedPhoto");
        if (typeof HOST_CURATED_PHOTOS !== "undefined" && hiddenPhoto) {
          if (!state.customHostPhotoUrl || hiddenPhoto.value !== state.customHostPhotoUrl) {
            const matchingPhoto = HOST_CURATED_PHOTOS.find(p => p.category === selectedCat);
            if (matchingPhoto) {
              hiddenPhoto.value = matchingPhoto.url;
              const container = document.getElementById("photoSelectorGrid");
              if (container) {
                container.querySelectorAll(".photo-option").forEach(card => {
                  const isMatch = card.dataset.photoUrl === matchingPhoto.url;
                  card.classList.toggle("selected", isMatch);
                  card.setAttribute("aria-checked", isMatch ? "true" : "false");
                });
              }
            }
          }
        }
        updateHostPreview();
      });
    }

    const form = document.getElementById("createMeetupForm");
    if (form) {
      form.addEventListener("submit", handleCreateMeetupSubmit);
    }

    const publishBtn = document.getElementById("publishMeetupBtn");
    if (publishBtn) {
      publishBtn.addEventListener("click", (e) => {
        if (!form) {
          handleCreateMeetupSubmit(e);
        }
      });
    }
  }

  function getSelectedHostCapacity() {
    const capacitySelect = document.getElementById("hostCapacity");
    if (!capacitySelect) return 6;
    const cat = document.getElementById("hostCategory")?.value;
    const isDining = cat === "coffee" || cat === "dining" || cat === "nightlife";
    if (!isDining && capacitySelect.value === "custom") {
      const customInput = document.getElementById("hostCustomCapacity");
      let val = parseInt(customInput?.value, 10);
      if (isNaN(val) || val < 2) val = 18;
      if (val > 100) val = 100;
      return val;
    }
    return parseInt(capacitySelect.value || "6", 10);
  }

  function updateHostPreview() {
    const previewContainer = document.getElementById("hostPreviewCard");
    if (!previewContainer) return;

    const title = document.getElementById("hostMeetupTitle")?.value.trim() || "Sunday Coffee & Thoughtful Conversations";
    const venueName = document.getElementById("hostVenueName")?.value.trim() || "Your Selected Spot / Café";
    const venueAddress = document.getElementById("hostVenueAddress")?.value.trim() || "Click map to drop meeting pin";
    const neighborhood = document.getElementById("hostNeighborhood")?.value.trim() || "East Village, NY";
    const dateVal = document.getElementById("hostMeetupDate")?.value;
    const timeVal = document.getElementById("hostMeetupTime")?.value || "14:00";
    const category = document.getElementById("hostCategory")?.value || "coffee";
    const capacity = getSelectedHostCapacity();
    const description = document.getElementById("hostDescription")?.value.trim() || "Join us for a friendly, unhurried conversation. Welcoming all curious minds to share ideas, laugh, and relax.";
    const hostName = (state.currentUser && state.currentUser.name && state.currentUser.name.trim()) 
      ? state.currentUser.name.trim() 
      : "Tom K.";
    const photoUrl = document.getElementById("hostSelectedPhoto")?.value || "meetup-gathering.jpg";

    let formattedDate = "Sat, Upcoming";
    if (dateVal) {
      const d = new Date(dateVal + "T00:00:00");
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      }
    }

    const [hours, minutes] = timeVal.split(":");
    const hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum % 12 || 12;
    const formattedTime = `${timeVal} (${hour12}:${minutes || "00"} ${ampm})`;

    const capText = capacity >= 100 ? "100+" : capacity;
    let capacityBadge = `👥 Group of ${capText}`;
    let actionBtnText = "Join Meetup";
    let typeTag = "Real-World Meetup";

    if (category === "coffee" || category === "dining" || category === "nightlife") {
      capacityBadge = `👥 Table of ${capacity} (Max 10)`;
      actionBtnText = "Join Table";
      typeTag = category === "coffee" ? "Café Table" : (category === "nightlife" ? "Music Lounge" : "Dining Table");
    } else if (category === "event") {
      capacityBadge = `🎉 Community Event (${capText} Spots)`;
      actionBtnText = "Join Event";
      typeTag = "Community Event";
    } else if (category === "jogging") {
      capacityBadge = `🏃 ${capText} Runners`;
      actionBtnText = "Join Meetup";
      typeTag = "Morning Jog";
    } else if (category === "sports") {
      capacityBadge = `⚽ ${capText} Players`;
      actionBtnText = "Join Meetup";
      typeTag = "Sports & Recreation";
    } else if (category === "dogwalk") {
      capacityBadge = `🐕 ${capText} Dog Walkers`;
      actionBtnText = "Join Meetup";
      typeTag = "Dog Walk Meetup";
    } else if (category === "swimming") {
      capacityBadge = `🏊 ${capText} Swimmers`;
      actionBtnText = "Join Meetup";
      typeTag = "Swimming Meetup";
    } else if (category === "playground") {
      capacityBadge = `🛝 ${capText} People`;
      actionBtnText = "Join Meetup";
      typeTag = "Playground Hangout";
    } else if (category === "active" || category === "fitness") {
      capacityBadge = `🏃 ${capText} People`;
      actionBtnText = "Join Meetup";
      typeTag = "Active & Fitness";
    } else if (category === "outdoors" || category === "parks") {
      capacityBadge = `🌳 ${capText} People`;
      actionBtnText = "Join Meetup";
      typeTag = "Parks & Outdoors";
    } else if (category === "creative" || category === "arts") {
      capacityBadge = `🎨 ${capText} People`;
      actionBtnText = "Join Meetup";
      typeTag = "Creative & Hobbies";
    } else {
      capacityBadge = `👥 Group of ${capText}`;
      actionBtnText = "Join Meetup";
      typeTag = "Custom Meetup";
    }

    const hostUserAvatar = (state.currentUser && state.currentUser.avatar && state.currentUser.avatar.trim()) ? state.currentUser.avatar.trim() : "";
    const hostAvatarHTML = hostUserAvatar 
      ? `<img src="${escapeHTML(hostUserAvatar)}" alt="Host" width="30" height="30" style="border-radius:50%; object-fit:cover; display:block;" />`
      : `<div class="host-preview-logo-icon" style="width:30px; height:30px; border-radius:50%; background:rgba(245,237,224,0.12); border:1px solid rgba(245,237,224,0.22); display:flex; align-items:center; justify-content:center; color:var(--cream-100);"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`;

    previewContainer.innerHTML = `
      <div class="meetup-card-media">
        <img src="${photoUrl}" alt="${escapeHTML(title)}" class="meetup-card-img" />
        <span class="meetup-time-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 4px;">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${escapeHTML(formattedDate)} • ${escapeHTML(formattedTime)}
        </span>
        <span class="meetup-price-badge">Free</span>
      </div>

      <div class="meetup-card-body">
        <div class="meetup-card-tags">
          <span class="meetup-tag capacity-tag">${capacityBadge}</span>
          <span class="meetup-tag">${typeTag}</span>
          <span class="meetup-tag">${escapeHTML(neighborhood)}</span>
          <span class="badge-community-host">📍 Community Host</span>
        </div>

        <h3 class="meetup-card-title">${escapeHTML(title)}</h3>

        <div class="meetup-card-venue">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cream-300)" stroke-width="2" style="flex-shrink:0; margin-top:3px;">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span><strong>${escapeHTML(venueName)}</strong> — ${escapeHTML(venueAddress)}</span>
        </div>

        <p class="meetup-card-desc">${escapeHTML(description)}</p>

        <div class="meetup-card-footer">
          <div class="meetup-footer-left">
            <div class="avatar-stack">
              ${hostAvatarHTML}
            </div>
            <span class="spots-badge status-open">
              <span class="spots-status-dot"></span>
              ${capacity >= 100 ? "99+ spots left" : `${Math.max(1, capacity - 1)} spots left`}
            </span>
          </div>
          <button type="button" class="btn btn-primary btn-sm" style="pointer-events: none; opacity: 0.9;">
            ${actionBtnText}
          </button>
        </div>
      </div>
    `;
  }

  let isPublishingMeetupInProgress = false;

  function handleCreateMeetupSubmit(e) {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (isPublishingMeetupInProgress) return;
    isPublishingMeetupInProgress = true;

    try {
      const titleInput = document.getElementById("hostMeetupTitle");
      const venueNameInput = document.getElementById("hostVenueName");
      const addressInput = document.getElementById("hostVenueAddress");
      const dateInput = document.getElementById("hostMeetupDate");
      const timeInput = document.getElementById("hostMeetupTime");
      const endTimeInput = document.getElementById("hostMeetupEndTime");
      const descInput = document.getElementById("hostDescription");
      const categorySelect = document.getElementById("hostCategory");
      const capacitySelect = document.getElementById("hostCapacity");
      const neighborhoodInput = document.getElementById("hostNeighborhood");
      const venueNotesInput = document.getElementById("hostVenueNotes");
      const photoInput = document.getElementById("hostSelectedPhoto");
      const roleInput = document.getElementById("hostRole");

      // Robust fallback defaults so publishing ALWAYS succeeds smoothly
      const finalTitle = (titleInput?.value || "").trim() || "Sunday Coffee & Thoughtful Conversations";
      const finalVenueName = (venueNameInput?.value || "").trim() || "The Roastery Café";
      const finalAddress = (addressInput?.value || "").trim() || "42 Bedford Ave, Brooklyn, NY 11249";
      const finalNeighborhood = (neighborhoodInput?.value || "").trim() || "Brooklyn, New York";
      const finalHostName = (state.currentUser && state.currentUser.name && state.currentUser.name.trim()) 
        ? state.currentUser.name.trim() 
        : "Tom K.";
      const finalHostAvatar = (state.currentUser && state.currentUser.avatar && state.currentUser.avatar.trim())
        ? state.currentUser.avatar.trim()
        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
      const finalRole = (roleInput?.value || "").trim() || "Community Host & Coffee Lover";
      const finalDesc = ((descInput?.value || "").trim().length >= 8)
        ? descInput.value.trim()
        : "Welcoming all vibes — introverts & extroverts alike! Great for anyone wanting friendly, meaningful conversation over great coffee.";

      const win = typeof calculate4DayBookingWindow === "function" ? calculate4DayBookingWindow() : null;
      let finalDateStr = dateInput?.value;
      if (!finalDateStr || (win && (finalDateStr < win.startDateStr || finalDateStr > win.endDateStr))) {
        finalDateStr = win ? win.days[1].dateStr : new Date().toISOString().split("T")[0];
        if (dateInput) dateInput.value = finalDateStr;
      }

      let startTimeVal = timeInput?.value || "14:00";
      let endTimeVal = endTimeInput?.value || "16:30";

      if (win && finalDateStr === win.startDateStr) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        if (parseTimeToMinutes(startTimeVal) <= currentMinutes) {
          const nextH = Math.min(21, Math.floor(currentMinutes / 60) + 1);
          startTimeVal = `${String(nextH).padStart(2, '0')}:00`;
          endTimeVal = `${String(Math.min(23, nextH + 2)).padStart(2, '0')}:30`;
          if (timeInput) timeInput.value = startTimeVal;
          if (endTimeInput) endTimeInput.value = endTimeVal;
        }
      }

      const dateObj = new Date(finalDateStr + "T" + startTimeVal);
      const formattedDay = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
        : "Upcoming";
      const formattedFullDate = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
        : "Upcoming Date";

      const targetDay = win ? win.days.find(d => d.dateStr === finalDateStr) : null;
      const dayOffset = targetDay ? targetDay.offset : 0;

      function formatTime12hSimple(timeVal) {
        if (!timeVal) return "";
        const [h, m] = timeVal.split(":");
        const hNum = parseInt(h, 10);
        const ampm = hNum >= 12 ? "PM" : "AM";
        const h12 = hNum % 12 || 12;
        return `${h12}:${m || "00"} ${ampm}`;
      }

      const formattedTime = `Between ${formatTime12hSimple(startTimeVal)} to ${formatTime12hSimple(endTimeVal)}`;

      const category = categorySelect?.value || "coffee";
      const isEvent = category === "event";

      // Activity-specific tag
      let categoryTag = "Social Meetup";
      if (category === "active" || category === "fitness") categoryTag = "Active & Fitness";
      else if (category === "jogging") categoryTag = "Morning Jog";
      else if (category === "sports") categoryTag = "Sports & Recreation";
      else if (category === "dogwalk") categoryTag = "Dog Walk";
      else if (category === "swimming") categoryTag = "Swimming Meetup";
      else if (category === "playground") categoryTag = "Playground Hangout";
      else if (category === "outdoors") categoryTag = "Parks & Outdoors";
      else if (category === "creative") categoryTag = "Creative & Hobbies";
      else if (category === "dining") categoryTag = "Dining Table";
      else if (category === "coffee") categoryTag = "Café Table";
      else if (category === "nightlife") categoryTag = "Music Lounge";
      else if (category === "event") categoryTag = "Community Event";
      else categoryTag = "Custom Meetup";

      let finalCapacity = parseInt(capacitySelect?.value || "6", 10);
      const isDining = category === "coffee" || category === "dining" || category === "nightlife";
      if (!isDining && capacitySelect?.value === "custom") {
        confirmCustomCapacity(true);
        const customInput = document.getElementById("hostCustomCapacity");
        let customVal = parseInt(customInput?.value, 10);
        if (isNaN(customVal) || customVal < 2) {
          customVal = 18;
        }
        if (customVal > 100) {
          customVal = 100;
        }
        finalCapacity = customVal;
      }

      const newId = `meetup-hosted-${Date.now()}`;
      const newCode = (typeof generateMeetupCode === "function") 
        ? generateMeetupCode(state.meetups) 
        : `MEET-${Math.floor(1017 + Math.random() * 8000)}`;

      const newMeetup = {
        id: newId,
        code: newCode,
        title: finalTitle,
        category: category,
        isEvent: isEvent,
        dayOffset: dayOffset,
        dateStr: finalDateStr,
        day: targetDay ? targetDay.dayTag : formattedDay,
        dayLabel: targetDay ? targetDay.dayLabel : formattedDay,
        time: formattedTime,
        dateFormatted: targetDay ? targetDay.dateFormatted : formattedFullDate,
        timeRaw: startTimeVal,
        endTimeRaw: endTimeVal,
        location: finalNeighborhood,
        neighborhood: finalNeighborhood,
        venueName: finalVenueName,
        venueAddress: finalAddress,
        hostVenueNotes: venueNotesInput?.value.trim() || "",
        coordinates: {
          lat: parseFloat(document.getElementById("hostLat")?.value || selectedHostLat.toString()),
          lng: parseFloat(document.getElementById("hostLng")?.value || selectedHostLng.toString())
        },
        mapQuery: encodeURIComponent(`${finalVenueName} ${finalAddress}`),
        price: "Free",
        capacity: finalCapacity,
        bookedCount: 1,
        tags: ["Community Host", categoryTag, finalNeighborhood],
        description: finalDesc,
        atmosphere: (category === "coffee" || category === "dining") ? "Warm, cozy & intimate table" : "Active, friendly & welcoming crowd",
        vibeScore: 99,
        image: photoInput?.value || "meetup-gathering.jpg",
        imageAlt: `${finalTitle} at ${finalVenueName}`,
        isCommunityHosted: true,
        isCreatedByCurrentUser: true,
        host: {
          name: finalHostName,
          role: finalRole,
          avatar: finalHostAvatar
        },
        members: [
          {
            id: `m-host-${Date.now()}`,
            name: finalHostName,
            avatar: finalHostAvatar,
            bio: finalRole,
            meetupsCount: 1,
            topics: ["Local Culture", categoryTag, "New Connections"]
          }
        ]
      };

      if (!state.myHostedMeetupIds) state.myHostedMeetupIds = [];
      state.myHostedMeetupIds = [newId, ...state.myHostedMeetupIds.filter(id => id !== newId)];
      try {
        localStorage.setItem(STORAGE_KEY_MY_HOSTED_MEETUPS, JSON.stringify(state.myHostedMeetupIds));
      } catch (e) {}

      // Host is automatically confirmed as attending their own gathering
      if (!state.bookedIds) state.bookedIds = [];
      state.bookedIds = [newId, ...state.bookedIds.filter(id => id !== newId)];
      if (!state.joinedHistoryIds) state.joinedHistoryIds = [];
      state.joinedHistoryIds = [newId, ...state.joinedHistoryIds.filter(id => id !== newId)];
      recordHistoryTimestamp(newId);
      if (typeof saveBookings === "function") {
        saveBookings();
      }
      saveHistoryState();

      // Initialize host welcome message in group chat
      if (!state.chatMessages) state.chatMessages = {};
      state.chatMessages[newId] = [
        {
          id: `c-msg-${Date.now()}-1`,
          sender: newMeetup.host.name,
          role: "host",
          isHost: true,
          avatar: newMeetup.host.avatar,
          time: "Just now",
          text: `👋 Welcome everyone to "${newMeetup.title}"! I'm ${newMeetup.host.name}, your host. Feel free to say hello or ask any questions here in our group chat.`
        }
      ];

      // Persist in localStorage
      if (typeof saveHostedMeetup === "function") {
        saveHostedMeetup(newMeetup);
      }

      // Add to state and render in Explore & Book Gatherings grid
      state.meetups.unshift(newMeetup);
      state.searchQuery = "";
      if (elements.meetupSearchInput) elements.meetupSearchInput.value = "";
      if (typeof setCategory === "function") {
        setCategory("all");
      } else {
        updateCategoryCounts();
        renderMeetups();
      }

      const form = document.getElementById("createMeetupForm");
      if (form) form.reset();
      setDefaultMeetupDate();
      const customWrapper = document.getElementById("customCapacityWrapper");
      if (customWrapper) customWrapper.style.display = "none";
      updateHostPreview();

      showToast(isEvent ? `🎉 Your event "${newMeetup.title}" is published! Welcome to your Meetup Group Page.` : `🎉 Your meetup "${newMeetup.title}" is published! Welcome to your Meetup Group Page.`, "success");

      setTimeout(() => {
        const areaName = newMeetup.neighborhood || newMeetup.location || "your area";
        showToast(`📢 Notified members in ${areaName}! A new meetup was just hosted in their area.`, "info");
      }, 1500);

      // 1. Instantly position the Explore section behind the modal
      const meetupsEl = document.getElementById("meetups");
      if (meetupsEl) {
        meetupsEl.scrollIntoView({ behavior: "instant", block: "start" });
      }

      // 2. Immediately take the host directly to the Meetup Group Page modal
      if (typeof openReservationModal === "function") {
        openReservationModal(newId);
      }
    } finally {
      setTimeout(() => {
        isPublishingMeetupInProgress = false;
      }, 500);
    }
  }

  // --------------------------------------------------------------------------
  // Socializing Meetup Games Centerpiece Subsystem
  // --------------------------------------------------------------------------
  const gamesState = {
    currentMeetupId: null,
    currentMode: "compass", // compass | hottakes | twotruths | rapidfire | deepdive
    isRotated: false,
    soundEnabled: true,
    wakeLockSentinel: null,

    // Compass
    compassAngle: 0,
    isSpinning: false,
    compassQuestionIndex: 0,

    // Hot Takes
    hotTakeIndex: 0,
    agreeCount: 0,
    disagreeCount: 0,

    // 2 Truths & A Dream
    twoTruthsIndex: 0,
    twoTruthsTimeRemaining: 60,
    twoTruthsTimerInterval: null,
    twoTruthsIsRunning: false,

    // Rapid Fire
    rapidFireIndex: 0,
    rapidFireTimeRemaining: 5.0,
    rapidFireTimerInterval: null,
    rapidFireIsRunning: false,

    // Deeper Waters
    deepDiveIndex: 0
  };

  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtx = new AudioCtx();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSoundEffect(type) {
    if (!gamesState.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === "tick") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === "reveal" || type === "chime") {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.35);
        });
      } else if (type === "unlock") {
        const notes = [440, 554.37, 659.25, 880, 1108.73];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.14, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.38);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.38);
        });
      } else if (type === "agree") {
        const notes = [587.33, 880];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0.15, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.25);
        });
      } else if (type === "disagree") {
        const notes = [320, 240];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.1, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.25);
        });
      } else if (type === "buzzer") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.4);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {
      // Audio autoplay policy or unsupported
    }
  }

  async function requestGameWakeLock() {
    try {
      if ("wakeLock" in navigator) {
        gamesState.wakeLockSentinel = await navigator.wakeLock.request("screen");
      }
    } catch (e) {
      // Ignore
    }
  }

  function releaseGameWakeLock() {
    try {
      if (gamesState.wakeLockSentinel) {
        gamesState.wakeLockSentinel.release();
        gamesState.wakeLockSentinel = null;
      }
    } catch (e) {
      // Ignore
    }
  }

  function toggleGameSound() {
    gamesState.soundEnabled = !gamesState.soundEnabled;
    if (elements.soundIcon) {
      elements.soundIcon.textContent = gamesState.soundEnabled ? "🔊" : "🔇";
    }
    if (elements.gameSoundToggleBtn) {
      elements.gameSoundToggleBtn.title = gamesState.soundEnabled ? "Sound ON (Tap to mute)" : "Sound MUTED (Tap to unmute)";
      elements.gameSoundToggleBtn.setAttribute("aria-label", elements.gameSoundToggleBtn.title);
    }
    if (gamesState.soundEnabled) {
      playSoundEffect("chime");
      showToast("🔊 Game sound effects enabled", "info");
    } else {
      showToast("🔇 Game sound effects muted", "info");
    }
  }

  function toggleGameRotation() {
    gamesState.isRotated = !gamesState.isRotated;
    const box = document.querySelector("#tableGameStage .game-rotatable-box");
    if (box) {
      box.classList.toggle("rotated-180", gamesState.isRotated);
    }
    if (elements.gameRotateBtn) {
      elements.gameRotateBtn.textContent = gamesState.isRotated ? "🔄 Normal View" : "🔄 Rotate 180°";
      elements.gameRotateBtn.classList.toggle("active", gamesState.isRotated);
    }
    playSoundEffect("tick");
  }

  function setGameMode(mode) {
    gamesState.currentMode = mode;

    // Clear any timers
    if (gamesState.twoTruthsTimerInterval) {
      clearInterval(gamesState.twoTruthsTimerInterval);
      gamesState.twoTruthsIsRunning = false;
    }
    if (gamesState.rapidFireTimerInterval) {
      clearInterval(gamesState.rapidFireTimerInterval);
      gamesState.rapidFireIsRunning = false;
    }

    if (elements.gameModeTabs) {
      elements.gameModeTabs.querySelectorAll(".table-mode-tab").forEach(tab => {
        const isCurrent = tab.getAttribute("data-mode") === mode;
        tab.classList.toggle("active", isCurrent);
        tab.setAttribute("aria-selected", isCurrent);
      });
    }

    renderActiveGame();
    playSoundEffect("tick");
  }

  function renderActiveGame() {
    if (!elements.tableGameStage || !elements.tableGameBottomBar) return;
    const gamesData = window.MEETUP_GAMES_DATA || {};
    const rotatedClass = gamesState.isRotated ? "rotated-180" : "";

    if (gamesState.currentMode === "compass") {
      const qList = gamesData.compassQuestions || [
        "What is something you are secretly a total nerd about?",
        "If our table had to pull off an Oceans 11-style heist tonight, what would your role be?"
      ];
      const currentQ = qList[gamesState.compassQuestionIndex % qList.length];

      elements.tableGameStage.innerHTML = `
        <div class="game-rotatable-box ${rotatedClass}">
          <div class="compass-dial-container">
            <div class="compass-dial-outer">
              <div class="compass-needle-layer" id="compassNeedleLayer" style="transform: rotate(${gamesState.compassAngle}deg);">
                <div class="compass-needle"></div>
              </div>
            </div>
            <div class="compass-pivot"></div>
          </div>

          <div class="compass-label-card">
            <div class="compass-card-tag">Table Compass · Point to Player</div>
            <p class="compass-question-text" id="compassQuestionDisplay">"${escapeHTML(currentQ)}"</p>
          </div>
        </div>
      `;

      elements.tableGameBottomBar.innerHTML = `
        <button class="btn btn-primary" id="compassSpinBtn" style="font-weight: 700; padding: 12px 24px;">
          <span>🧭</span> Spin the Compass!
        </button>
        <button class="btn btn-secondary btn-sm" id="compassNextQBtn">
          Next Question ➔
        </button>
      `;

      const spinBtn = elements.tableGameBottomBar.querySelector("#compassSpinBtn");
      if (spinBtn) spinBtn.addEventListener("click", spinCompass);

      const nextQBtn = elements.tableGameBottomBar.querySelector("#compassNextQBtn");
      if (nextQBtn) {
        nextQBtn.addEventListener("click", () => {
          gamesState.compassQuestionIndex = (gamesState.compassQuestionIndex + 1) % qList.length;
          const qEl = document.getElementById("compassQuestionDisplay");
          if (qEl) qEl.textContent = `"${qList[gamesState.compassQuestionIndex]}"`;
          playSoundEffect("tick");
        });
      }

    } else if (gamesState.currentMode === "hottakes") {
      const takes = gamesData.hotTakes || [
        { statement: "Pineapple is genuinely elite on pizza.", context: "Culinary warfare" }
      ];
      const currentTake = takes[gamesState.hotTakeIndex % takes.length];
      const total = gamesState.agreeCount + gamesState.disagreeCount;
      const agreePercent = total > 0 ? Math.round((gamesState.agreeCount / total) * 100) : 50;
      const disagreePercent = total > 0 ? (100 - agreePercent) : 50;

      elements.tableGameStage.innerHTML = `
        <div class="game-rotatable-box ${rotatedClass}">
          <div class="hot-take-container">
            <div class="hot-take-card">
              <span class="hot-take-topic-badge">${escapeHTML(currentTake.context)}</span>
              <p class="hot-take-quote">"${escapeHTML(currentTake.statement)}"</p>

              <div class="vote-bar-wrapper">
                <div class="vote-bar-track">
                  <div class="vote-bar-agree" id="voteBarAgree" style="width: ${agreePercent}%;"></div>
                  <div class="vote-bar-disagree" id="voteBarDisagree" style="width: ${disagreePercent}%;"></div>
                </div>
                <div class="vote-stats-row">
                  <span id="voteAgreeStats" style="color: #4ade80;">👍 Agree: ${gamesState.agreeCount} (${agreePercent}%)</span>
                  <span id="voteDisagreeStats" style="color: #f87171;">👎 Disagree: ${gamesState.disagreeCount} (${disagreePercent}%)</span>
                </div>
              </div>

              <div class="vote-buttons-grid">
                <button class="btn-vote-agree" id="voteAgreeBtn">
                  👍 Agree (+1)
                </button>
                <button class="btn-vote-disagree" id="voteDisagreeBtn">
                  👎 Disagree (+1)
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      elements.tableGameBottomBar.innerHTML = `
        <button class="btn btn-secondary btn-sm" id="resetVotesBtn">
          Reset Table Votes ↺
        </button>
        <button class="btn btn-primary" id="nextHotTakeBtn" style="font-weight: 700;">
          Next Hot Take ➔
        </button>
      `;

      const agreeBtn = elements.tableGameStage.querySelector("#voteAgreeBtn");
      if (agreeBtn) agreeBtn.addEventListener("click", () => voteHotTake("agree"));

      const disagreeBtn = elements.tableGameStage.querySelector("#voteDisagreeBtn");
      if (disagreeBtn) disagreeBtn.addEventListener("click", () => voteHotTake("disagree"));

      const resetVotesBtn = elements.tableGameBottomBar.querySelector("#resetVotesBtn");
      if (resetVotesBtn) {
        resetVotesBtn.addEventListener("click", () => {
          gamesState.agreeCount = 0;
          gamesState.disagreeCount = 0;
          updateHotTakeVoteUI();
          playSoundEffect("tick");
        });
      }

      const nextTakeBtn = elements.tableGameBottomBar.querySelector("#nextHotTakeBtn");
      if (nextTakeBtn) nextTakeBtn.addEventListener("click", nextHotTake);

    } else if (gamesState.currentMode === "twotruths") {
      const prompts = gamesData.twoTruthsPrompts || [
        { title: "Travel Edition", instruction: "Share 2 real travel memories and 1 place you have never visited. Table has 60s to interrogate!" }
      ];
      const currentPrompt = prompts[gamesState.twoTruthsIndex % prompts.length];

      elements.tableGameStage.innerHTML = `
        <div class="game-rotatable-box ${rotatedClass}">
          <div class="two-truths-container">
            <span class="hot-take-topic-badge">🤫 2 Truths & A Dream</span>
            <h4 style="font-size: 1.35rem; color: var(--cream-100); margin: 6px 0 10px;">${escapeHTML(currentPrompt.title)}</h4>
            <p style="font-size: 0.98rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
              ${escapeHTML(currentPrompt.instruction)}
            </p>

            <div class="timer-circle-widget">
              <span class="timer-seconds-big" id="twoTruthsSeconds">${gamesState.twoTruthsTimeRemaining}s</span>
              <span class="timer-label-sub">Table Interrogation</span>
            </div>
          </div>
        </div>
      `;

      elements.tableGameBottomBar.innerHTML = `
        <button class="btn btn-primary" id="twoTruthsTimerToggleBtn" style="font-weight: 700;">
          ${gamesState.twoTruthsIsRunning ? '<span>⏸</span> Pause Timer' : '<span>▶</span> Start 60s Timer'}
        </button>
        <button class="btn btn-secondary btn-sm" id="twoTruthsResetBtn">
          ↺ Reset 60s
        </button>
        <button class="btn btn-secondary btn-sm" id="nextTwoTruthsPromptBtn">
          Next Pack ➔
        </button>
      `;

      const toggleTimerBtn = elements.tableGameBottomBar.querySelector("#twoTruthsTimerToggleBtn");
      if (toggleTimerBtn) toggleTimerBtn.addEventListener("click", toggleTwoTruthsTimer);

      const resetTimerBtn = elements.tableGameBottomBar.querySelector("#twoTruthsResetBtn");
      if (resetTimerBtn) resetTimerBtn.addEventListener("click", resetTwoTruthsTimer);

      const nextPromptBtn = elements.tableGameBottomBar.querySelector("#nextTwoTruthsPromptBtn");
      if (nextPromptBtn) nextPromptBtn.addEventListener("click", nextTwoTruthsPrompt);

    } else if (gamesState.currentMode === "rapidfire") {
      const prompts = gamesData.rapidFirePrompts || [
        { prompt: "Midnight Snack", category: "Quick Association" }
      ];
      const currentRapid = prompts[gamesState.rapidFireIndex % prompts.length];

      elements.tableGameStage.innerHTML = `
        <div class="game-rotatable-box ${rotatedClass}">
          <div class="rapid-fire-card">
            <span class="hot-take-topic-badge">⚡ ${escapeHTML(currentRapid.category)}</span>
            <h4 style="font-size: 1.7rem; font-family: var(--font-serif); color: var(--cream-100); margin: 10px 0;">
              "${escapeHTML(currentRapid.prompt)}"
            </h4>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">
              Pass around table! 5-second countdown buzzer for each person's instant reaction.
            </p>

            <div class="rapid-buzzer-bar">
              <div class="rapid-buzzer-progress" id="rapidBuzzerProgress" style="width: 100%;"></div>
            </div>
          </div>
        </div>
      `;

      elements.tableGameBottomBar.innerHTML = `
        <button class="btn btn-primary" id="rapidBlitzBtn" style="font-weight: 700;">
          <span>⚡</span> Start 5s Blitz!
        </button>
        <button class="btn btn-secondary btn-sm" id="nextRapidBtn">
          Next Prompt ➔
        </button>
      `;

      const blitzBtn = elements.tableGameBottomBar.querySelector("#rapidBlitzBtn");
      if (blitzBtn) blitzBtn.addEventListener("click", startRapidFireBlitz);

      const nextRapidBtn = elements.tableGameBottomBar.querySelector("#nextRapidBtn");
      if (nextRapidBtn) nextRapidBtn.addEventListener("click", nextRapidPrompt);

    } else if (gamesState.currentMode === "deepdive") {
      const questions = gamesData.deepDiveQuestions || [
        "What was a turning point in your life that completely changed your trajectory?"
      ];
      const currentQ = questions[gamesState.deepDiveIndex % questions.length];

      elements.tableGameStage.innerHTML = `
        <div class="game-rotatable-box ${rotatedClass}">
          <div class="compass-label-card" style="max-width: 520px; border-color: rgba(212, 163, 115, 0.45); padding: 32px 24px;">
            <div class="compass-card-tag" style="color: #d4a373;">✨ Deeper Waters · Story Time</div>
            <p class="compass-question-text" style="font-size: 1.3rem; font-family: var(--font-serif); font-style: italic; color: var(--cream-100); margin: 12px 0 16px;">
              "${escapeHTML(currentQ)}"
            </p>
            <p style="font-size: 0.86rem; color: var(--text-muted); margin: 0;">
              No rush. Take your time, listen closely, and let conversations wander.
            </p>
          </div>
        </div>
      `;

      elements.tableGameBottomBar.innerHTML = `
        <button class="btn btn-primary" id="nextDeepDiveBtn" style="font-weight: 700;">
          <span>✨</span> Next Story Prompt ➔
        </button>
      `;

      const nextDeepBtn = elements.tableGameBottomBar.querySelector("#nextDeepDiveBtn");
      if (nextDeepBtn) nextDeepBtn.addEventListener("click", nextDeepDiveQuestion);
    }
  }

  function spinCompass() {
    if (gamesState.isSpinning) return;
    gamesState.isSpinning = true;

    // Pick random degrees: 4 to 8 full spins + random angle
    const extraRounds = (4 + Math.floor(Math.random() * 4)) * 360;
    const randomStop = Math.floor(Math.random() * 360);
    gamesState.compassAngle += extraRounds + randomStop;

    const needleLayer = document.getElementById("compassNeedleLayer");
    const spinBtn = document.getElementById("compassSpinBtn");
    if (spinBtn) {
      spinBtn.disabled = true;
      spinBtn.innerHTML = `<span>🌀</span> Spinning for Table...`;
    }

    if (needleLayer) {
      needleLayer.style.transform = `rotate(${gamesState.compassAngle}deg)`;
    }

    let tickCount = 0;
    const tickInterval = setInterval(() => {
      playSoundEffect("tick");
      tickCount++;
      if (tickCount > 24) clearInterval(tickInterval);
    }, 120);

    setTimeout(() => {
      gamesState.isSpinning = false;
      clearInterval(tickInterval);

      const qList = (window.MEETUP_GAMES_DATA && window.MEETUP_GAMES_DATA.compassQuestions) || [];
      if (qList.length > 0) {
        gamesState.compassQuestionIndex = (gamesState.compassQuestionIndex + 1) % qList.length;
        const qEl = document.getElementById("compassQuestionDisplay");
        if (qEl) {
          qEl.textContent = `"${qList[gamesState.compassQuestionIndex]}"`;
        }
      }

      if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
      playSoundEffect("reveal");

      if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.innerHTML = `<span>🧭</span> Spin Compass Again!`;
      }
    }, 3200);
  }

  function voteHotTake(voteType) {
    if (voteType === "agree") {
      gamesState.agreeCount++;
      playSoundEffect("agree");
    } else {
      gamesState.disagreeCount++;
      playSoundEffect("disagree");
    }
    updateHotTakeVoteUI();
  }

  function updateHotTakeVoteUI() {
    const total = gamesState.agreeCount + gamesState.disagreeCount;
    const agreePercent = total > 0 ? Math.round((gamesState.agreeCount / total) * 100) : 50;
    const disagreePercent = total > 0 ? (100 - agreePercent) : 50;

    const agreeBar = document.getElementById("voteBarAgree");
    const disagreeBar = document.getElementById("voteBarDisagree");
    const agreeText = document.getElementById("voteAgreeStats");
    const disagreeText = document.getElementById("voteDisagreeStats");

    if (agreeBar) agreeBar.style.width = `${agreePercent}%`;
    if (disagreeBar) disagreeBar.style.width = `${disagreePercent}%`;
    if (agreeText) agreeText.textContent = `👍 Agree: ${gamesState.agreeCount} (${agreePercent}%)`;
    if (disagreeText) disagreeText.textContent = `👎 Disagree: ${gamesState.disagreeCount} (${disagreePercent}%)`;
  }

  function nextHotTake() {
    const takes = (window.MEETUP_GAMES_DATA && window.MEETUP_GAMES_DATA.hotTakes) || [];
    if (takes.length > 0) {
      gamesState.hotTakeIndex = (gamesState.hotTakeIndex + 1) % takes.length;
      gamesState.agreeCount = 0;
      gamesState.disagreeCount = 0;
      renderActiveGame();
      playSoundEffect("tick");
    }
  }

  function toggleTwoTruthsTimer() {
    if (gamesState.twoTruthsIsRunning) {
      clearInterval(gamesState.twoTruthsTimerInterval);
      gamesState.twoTruthsIsRunning = false;
      updateTwoTruthsBtnLabel();
    } else {
      if (gamesState.twoTruthsTimeRemaining <= 0) {
        gamesState.twoTruthsTimeRemaining = 60;
      }
      gamesState.twoTruthsIsRunning = true;
      updateTwoTruthsBtnLabel();

      gamesState.twoTruthsTimerInterval = setInterval(() => {
        gamesState.twoTruthsTimeRemaining--;
        updateTwoTruthsDisplay();

        if (gamesState.twoTruthsTimeRemaining <= 5 && gamesState.twoTruthsTimeRemaining > 0) {
          playSoundEffect("tick");
        }

        if (gamesState.twoTruthsTimeRemaining <= 0) {
          clearInterval(gamesState.twoTruthsTimerInterval);
          gamesState.twoTruthsIsRunning = false;
          updateTwoTruthsBtnLabel();
          playSoundEffect("buzzer");
          if (navigator.vibrate) navigator.vibrate([150, 80, 150]);
          showToast("⏰ Time's up! Table must vote on the lie!", "info");
        }
      }, 1000);
    }
  }

  function resetTwoTruthsTimer() {
    clearInterval(gamesState.twoTruthsTimerInterval);
    gamesState.twoTruthsIsRunning = false;
    gamesState.twoTruthsTimeRemaining = 60;
    updateTwoTruthsDisplay();
    updateTwoTruthsBtnLabel();
    playSoundEffect("tick");
  }

  function updateTwoTruthsDisplay() {
    const el = document.getElementById("twoTruthsSeconds");
    if (el) el.textContent = `${gamesState.twoTruthsTimeRemaining}s`;
  }

  function updateTwoTruthsBtnLabel() {
    const btn = document.getElementById("twoTruthsTimerToggleBtn");
    if (btn) {
      btn.innerHTML = gamesState.twoTruthsIsRunning
        ? `<span>⏸</span> Pause Timer`
        : `<span>▶</span> Start 60s Timer`;
    }
  }

  function nextTwoTruthsPrompt() {
    const prompts = (window.MEETUP_GAMES_DATA && window.MEETUP_GAMES_DATA.twoTruthsPrompts) || [];
    if (prompts.length > 0) {
      gamesState.twoTruthsIndex = (gamesState.twoTruthsIndex + 1) % prompts.length;
      resetTwoTruthsTimer();
      renderActiveGame();
    }
  }

  function startRapidFireBlitz() {
    const bar = document.getElementById("rapidBuzzerProgress");
    const buzzerBtn = document.getElementById("rapidBlitzBtn");
    if (gamesState.rapidFireIsRunning) return;

    gamesState.rapidFireIsRunning = true;
    if (buzzerBtn) buzzerBtn.disabled = true;

    let timeLeftMs = 5000;
    const intervalMs = 50;

    clearInterval(gamesState.rapidFireTimerInterval);
    gamesState.rapidFireTimerInterval = setInterval(() => {
      timeLeftMs -= intervalMs;
      const pct = Math.max(0, (timeLeftMs / 5000) * 100);
      if (bar) bar.style.width = `${pct}%`;

      if (timeLeftMs <= 0) {
        clearInterval(gamesState.rapidFireTimerInterval);
        gamesState.rapidFireIsRunning = false;
        playSoundEffect("buzzer");
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        if (buzzerBtn) {
          buzzerBtn.disabled = false;
          buzzerBtn.innerHTML = `<span>⚡</span> Next Table Member (5s Blitz)`;
        }
      }
    }, intervalMs);
  }

  function nextRapidPrompt() {
    const prompts = (window.MEETUP_GAMES_DATA && window.MEETUP_GAMES_DATA.rapidFirePrompts) || [];
    if (prompts.length > 0) {
      gamesState.rapidFireIndex = (gamesState.rapidFireIndex + 1) % prompts.length;
      clearInterval(gamesState.rapidFireTimerInterval);
      gamesState.rapidFireIsRunning = false;
      renderActiveGame();
    }
  }

  function nextDeepDiveQuestion() {
    const questions = (window.MEETUP_GAMES_DATA && window.MEETUP_GAMES_DATA.deepDiveQuestions) || [];
    if (questions.length > 0) {
      gamesState.deepDiveIndex = (gamesState.deepDiveIndex + 1) % questions.length;
      renderActiveGame();
      playSoundEffect("chime");
    }
  }

  function openMeetupGamesModal(meetupId) {
    const endStatus = getMeetupEndStatus(meetupId);
    if (endStatus.isFullyClosed) {
      showToast("🔒 Table games for this meetup have concluded (3 hours post-meetup expired).", "warning");
      return;
    }

    const meetup = state.meetups.find(m => m.id === meetupId) || (window.MEETUPS_DATA && window.MEETUPS_DATA.find(m => m.id === meetupId));
    gamesState.currentMeetupId = meetupId;

    const gameConfig = (typeof getMeetupGameConfig === "function" ? getMeetupGameConfig(meetup) : null);
    if (gameConfig && gameConfig.games && window.MEETUP_GAMES_DATA) {
      window.MEETUP_GAMES_DATA.compassQuestions = gameConfig.games.compassQuestions;
      window.MEETUP_GAMES_DATA.hotTakes = gameConfig.games.hotTakes;
      window.MEETUP_GAMES_DATA.twoTruthsPrompts = gameConfig.games.twoTruthsPrompts;
      window.MEETUP_GAMES_DATA.rapidFirePrompts = gameConfig.games.rapidFirePrompts;
      window.MEETUP_GAMES_DATA.deepDiveQuestions = gameConfig.games.deepDiveQuestions;

      // Reset state for new meetup
      gamesState.compassQuestionIndex = 0;
      gamesState.hotTakeIndex = 0;
      gamesState.agreeCount = 0;
      gamesState.disagreeCount = 0;
      gamesState.twoTruthsIndex = 0;
      gamesState.twoTruthsTimeRemaining = 60;
      gamesState.rapidFireIndex = 0;
      gamesState.deepDiveIndex = 0;
    }

    if (elements.gameModalTitle) {
      elements.gameModalTitle.textContent = meetup 
        ? `${meetup.title} · ${gameConfig ? gameConfig.title : "Games"}` 
        : "Meetup Games";
    }

    // Update banner in centerpiece dialog
    if (elements.meetupGamesModal) {
      const bannerText = elements.meetupGamesModal.querySelector(".centerpiece-banner-text");
      const bannerIcon = elements.meetupGamesModal.querySelector(".centerpiece-banner-icon");
      const liveBadge = elements.meetupGamesModal.querySelector(".table-live-badge");
      if (bannerText && gameConfig) {
        bannerText.innerHTML = `<strong>${escapeHTML(gameConfig.bannerStrong)}</strong> — ${escapeHTML(gameConfig.bannerSub)}`;
      }
      if (bannerIcon && gameConfig) {
        bannerIcon.textContent = gameConfig.icon || "📱";
      }
      if (liveBadge && gameConfig) {
        liveBadge.innerHTML = `<span class="pulse-dot"></span> LIVE ${escapeHTML(gameConfig.buttonBadge).toUpperCase()} CENTERPIECE`;
      }
    }

    if (elements.reservationModal && elements.reservationModal.open) {
      elements.reservationModal.close();
    }

    if (elements.meetupGamesModal) {
      elements.meetupGamesModal.showModal();
    }

    playSoundEffect("unlock");
    requestGameWakeLock();
    renderActiveGame();

    const toastMsg = gameConfig 
      ? `🎉 ${gameConfig.title} unlocked! ${gameConfig.bannerStrong}.`
      : "🎲 Meetup games unlocked! Place phone flat on the table.";
    showToast(toastMsg, "success");
  }

  function closeMeetupGamesModal() {
    if (gamesState.twoTruthsTimerInterval) {
      clearInterval(gamesState.twoTruthsTimerInterval);
      gamesState.twoTruthsIsRunning = false;
    }
    if (gamesState.rapidFireTimerInterval) {
      clearInterval(gamesState.rapidFireTimerInterval);
      gamesState.rapidFireIsRunning = false;
    }

    releaseGameWakeLock();

    if (elements.meetupGamesModal && elements.meetupGamesModal.open) {
      elements.meetupGamesModal.close();
    }
  }

  function initMeetupGames() {
    if (elements.gameModeTabs) {
      elements.gameModeTabs.querySelectorAll(".table-mode-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          const mode = tab.getAttribute("data-mode");
          setGameMode(mode);
        });
      });
    }

    if (elements.gameSoundToggleBtn) {
      elements.gameSoundToggleBtn.addEventListener("click", toggleGameSound);
    }

    if (elements.gameRotateBtn) {
      elements.gameRotateBtn.addEventListener("click", toggleGameRotation);
    }

    if (elements.closeGamesModalBtn) {
      elements.closeGamesModalBtn.addEventListener("click", closeMeetupGamesModal);
    }

    if (elements.meetupGamesModal) {
      elements.meetupGamesModal.addEventListener("click", (e) => {
        if (e.target === elements.meetupGamesModal) {
          closeMeetupGamesModal();
        }
      });
      elements.meetupGamesModal.addEventListener("cancel", () => {
        closeMeetupGamesModal();
      });
    }
  }

  // --------------------------------------------------------------------------
  // Event Listeners Initialization
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    initMeetupGames();

    // Theme toggle
    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.addEventListener("click", toggleTheme);
    }

    // Mobile Navigation
    if (elements.mobileMenuBtn && elements.mobileNav) {
      elements.mobileMenuBtn.addEventListener("click", () => {
        const isOpen = elements.mobileNav.classList.toggle("open");
        elements.mobileMenuBtn.setAttribute("aria-expanded", isOpen);
      });

      elements.mobileNav.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
          elements.mobileNav.classList.remove("open");
          if (elements.mobileMenuBtn) elements.mobileMenuBtn.setAttribute("aria-expanded", "false");
        });
      });
    }

    // Filter Tabs
    if (elements.filterTabsContainer) {
      elements.filterTabsContainer.querySelectorAll(".filter-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          const category = tab.getAttribute("data-category");
          setCategory(category);
        });
      });
    }

    // Global delegation for Save for later symbolic button and Share button
    document.addEventListener("click", (e) => {
      const saveBtn = e.target.closest(".btn-save-meetup-action");
      if (saveBtn) {
        e.stopPropagation();
        e.preventDefault();
        const id = saveBtn.getAttribute("data-id");
        if (id) {
          toggleSaveMeetup(id, saveBtn);
        }
        return;
      }

      const shareBtn = e.target.closest(".btn-meetup-share-action");
      if (shareBtn) {
        e.stopPropagation();
        e.preventDefault();
        const id = shareBtn.getAttribute("data-id");
        if (id) {
          shareMeetup(id, shareBtn);
        }
        return;
      }

      // Website Platform Sharing Delegation
      const webShareBtn = e.target.closest(".footer-share-website-btn");
      if (webShareBtn) {
        e.stopPropagation();
        e.preventDefault();
        shareWebsite(webShareBtn);
        return;
      }

      const copyUrlBtn = e.target.closest(".copy-website-url-btn");
      if (copyUrlBtn) {
        e.stopPropagation();
        e.preventDefault();
        copyWebsiteLink(copyUrlBtn);
        return;
      }

      const instagramBtn = e.target.closest(".share-instagram-link");
      if (instagramBtn) {
        const { siteUrl } = getWebsiteShareData();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(siteUrl).then(() => {
            showToast("📸 Outspire link copied! Paste it in your Instagram story or bio.", "success");
          }).catch(() => {
            showToast("Opening Instagram...", "info");
          });
        } else {
          showToast("📸 Link copied! Share on your Instagram story.", "info");
        }
      }
    });

    // Share Website Modal Close Buttons
    if (elements.closeShareWebsiteModalBtn) {
      elements.closeShareWebsiteModalBtn.addEventListener("click", closeShareWebsiteModal);
    }
    if (elements.closeShareWebsiteModalFooterBtn) {
      elements.closeShareWebsiteModalFooterBtn.addEventListener("click", closeShareWebsiteModal);
    }
    if (elements.shareWebsiteModal) {
      elements.shareWebsiteModal.addEventListener("click", (e) => {
        if (e.target === elements.shareWebsiteModal) {
          closeShareWebsiteModal();
        }
      });
    }

    // Search Input
    if (elements.meetupSearchInput) {
      let debounceTimer;
      elements.meetupSearchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          state.searchQuery = e.target.value;
          renderMeetups();
        }, 180);
      });

      elements.meetupSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const firstCard = elements.meetupsGrid ? elements.meetupsGrid.querySelector(".meetup-card") : null;
          if (firstCard) {
            const id = firstCard.getAttribute("data-meetup-id");
            if (id) {
              openReservationModal(id);
            }
          }
        }
      });
    }

    // Day Select
    if (elements.dayFilterSelect) {
      elements.dayFilterSelect.addEventListener("change", (e) => {
        state.selectedDay = e.target.value;
        renderMeetups();
      });
    }

    // Location Select (Strictly focused on member's city and local areas)
    if (elements.locationFilterSelect) {
      elements.locationFilterSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val.startsWith("area:")) {
          state.selectedArea = val.replace("area:", "");
        } else {
          state.selectedArea = "all";
        }
        state.selectedCity = getCleanCity(state.userCity) || "New York";
        renderCityAreaFilterBar();
        renderMeetups();
      });
    }

    // Time Select ("Between This to This")
    if (elements.timeFilterSelect) {
      elements.timeFilterSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        state.selectedTimeRange = val;
        if (val === "custom") {
          state.customTimeStart = elements.timeRangeStartSelect?.value || "10:00";
          state.customTimeEnd = elements.timeRangeEndSelect?.value || "18:00";
        }
        updateTimeFilterUI();
        renderMeetups();
      });
    }

    if (elements.applyCustomTimeBtn) {
      elements.applyCustomTimeBtn.addEventListener("click", () => {
        state.selectedTimeRange = "custom";
        state.customTimeStart = elements.timeRangeStartSelect?.value || "10:00";
        state.customTimeEnd = elements.timeRangeEndSelect?.value || "18:00";
        updateTimeFilterUI();
        renderMeetups();
        const sMins = parseTimeToMinutes(state.customTimeStart);
        const eMins = parseTimeToMinutes(state.customTimeEnd);
        showToast(`⏰ Filtering meetups ${formatTimeWindowLabel(sMins, eMins)}`, "info");
      });
    }

    if (elements.clearCustomTimeBtn) {
      elements.clearCustomTimeBtn.addEventListener("click", () => {
        state.selectedTimeRange = "all";
        state.customTimeStart = null;
        state.customTimeEnd = null;
        updateTimeFilterUI();
        renderMeetups();
        showToast("⏰ Time filter reset to Any Time", "info");
      });
    }

    if (elements.timeRangeStartSelect) {
      elements.timeRangeStartSelect.addEventListener("change", () => {
        state.selectedTimeRange = "custom";
        state.customTimeStart = elements.timeRangeStartSelect.value;
        state.customTimeEnd = elements.timeRangeEndSelect?.value || "18:00";
        updateTimeFilterUI();
        renderMeetups();
      });
    }

    if (elements.timeRangeEndSelect) {
      elements.timeRangeEndSelect.addEventListener("change", () => {
        state.selectedTimeRange = "custom";
        state.customTimeStart = elements.timeRangeStartSelect?.value || "10:00";
        state.customTimeEnd = elements.timeRangeEndSelect.value;
        updateTimeFilterUI();
        renderMeetups();
      });
    }

    // Group Size Select
    if (elements.groupSizeFilterSelect) {
      elements.groupSizeFilterSelect.addEventListener("change", (e) => {
        state.selectedGroupSize = e.target.value;
        renderMeetups();
      });
    }

    // Surprise Meetup Button
    const surpriseBtn = elements.surpriseMeetupBtn || elements.randomMeetupBtn;
    if (surpriseBtn) {
      surpriseBtn.addEventListener("click", triggerSurpriseMeetup);
    }

    // Clear Filters Button
    if (elements.clearFiltersBtn) {
      elements.clearFiltersBtn.addEventListener("click", resetFilters);
    }

    // Chat drawer form
    if (elements.chatInputForm && elements.chatMessageInput) {
      elements.chatInputForm.addEventListener("submit", (e) => {
        e.preventDefault();
        sendChatMessage(elements.chatMessageInput.value);
        elements.chatMessageInput.value = "";
      });
    }

    const closeChatBtn = document.getElementById("closeChatBtn");
    if (closeChatBtn) {
      closeChatBtn.addEventListener("click", closeChatDrawer);
    }

    // Modal light dismiss & close handlers
    [
      elements.reservationModal, 
      elements.cancelConfirmModal, 
      elements.deleteHistoryItemModal, 
      elements.clearHistoryConfirmModal, 
      elements.profileModal, 
      elements.authModal, 
      elements.surpriseMeetupModal
    ].forEach(dialog => {
      if (!dialog) return;

      // Click outside backdrop to close
      dialog.addEventListener("click", (e) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          dialog.close();
        }
      });

      const closeBtns = dialog.querySelectorAll(".modal-close-btn");
      closeBtns.forEach(btn => {
        btn.addEventListener("click", () => dialog.close());
      });
    });

    // Keyboard ESC key closes drawers
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeChatDrawer();
        closeQuizSideDrawer();
        if (elements.mobileNav) elements.mobileNav.classList.remove("open");
      }
    });

    // Top-Right Corner Questionnaire Trigger Sign
    const openQuizHeaderBtn = document.getElementById("openQuizHeaderBtn");
    if (openQuizHeaderBtn) {
      openQuizHeaderBtn.addEventListener("click", () => {
        openQuizSideDrawer();
      });
    }

    const mobileQuizLink = document.getElementById("mobileQuizLink");
    if (mobileQuizLink) {
      mobileQuizLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (elements.mobileNav) elements.mobileNav.classList.remove("open");
        openQuizSideDrawer();
      });
    }

    document.querySelectorAll('a[href="#quiz"]').forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        if (elements.mobileNav) elements.mobileNav.classList.remove("open");
        openQuizSideDrawer();
      });
    });

    // Right-Side Questionnaire Drawer Controls
    if (elements.closeQuizDrawerBtn) {
      elements.closeQuizDrawerBtn.addEventListener("click", closeQuizSideDrawer);
    }
    if (elements.quizDrawerOverlay) {
      elements.quizDrawerOverlay.addEventListener("click", closeQuizSideDrawer);
    }
    if (elements.drawerWizardTab) {
      elements.drawerWizardTab.addEventListener("click", () => {
        state.drawerQuizTab = "stepper";
        renderDrawerQuizContent();
      });
    }
    if (elements.drawerSummaryTab) {
      elements.drawerSummaryTab.addEventListener("click", () => {
        state.drawerQuizTab = "summary";
        renderDrawerQuizContent();
      });
    }

    // Quick Sign In / User Profile Trigger buttons
    document.querySelectorAll(".open-auth-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (state.isAuthenticated && state.currentUser) {
          openUserProfileModal();
        } else {
          openAuthModal("signin");
        }
      });
    });

    // Auth Modal tab switching (Sign in / Sign up)
    const authTabs = document.querySelectorAll(".auth-tab-btn");
    authTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const mode = tab.getAttribute("data-mode") || "signin";
        switchAuthTab(mode);
      });
    });

    // Google & Apple One-Click Auth
    const googleBtn = document.getElementById("googleAuthBtn");
    if (googleBtn) {
      googleBtn.addEventListener("click", () => {
        const nameInput = document.getElementById("authName");
        const avatarInput = document.getElementById("authAvatar");
        const prefillName = (nameInput && nameInput.value.trim()) || [state.quizAnswers.firstName, state.quizAnswers.middleName, state.quizAnswers.lastName].filter(Boolean).join(" ") || "Member";
        const prefillAvatar = (avatarInput && avatarInput.value.trim()) || "";
        handleSuccessfulAuth(prefillName, "google.user@example.com", prefillAvatar);
      });
    }

    const appleBtn = document.getElementById("appleAuthBtn");
    if (appleBtn) {
      appleBtn.addEventListener("click", () => {
        const nameInput = document.getElementById("authName");
        const avatarInput = document.getElementById("authAvatar");
        const prefillName = (nameInput && nameInput.value.trim()) || [state.quizAnswers.firstName, state.quizAnswers.middleName, state.quizAnswers.lastName].filter(Boolean).join(" ") || "Member";
        const prefillAvatar = (avatarInput && avatarInput.value.trim()) || "";
        handleSuccessfulAuth(prefillName, "apple.user@example.com", prefillAvatar);
      });
    }

    // Sample Photo quick picker in Auth modal
    const samplePhotoBtn = document.getElementById("authSamplePhotoBtn");
    if (samplePhotoBtn) {
      samplePhotoBtn.addEventListener("click", () => {
        const avatarInput = document.getElementById("authAvatar");
        if (avatarInput) {
          avatarInput.value = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
          showToast("Sample profile photo selected!", "info");
        }
      });
    }

    const authForm = document.getElementById("authForm");
    if (authForm) {
      authForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameInput = document.getElementById("authName");
        const emailInput = document.getElementById("authEmail");
        const avatarInput = document.getElementById("authAvatar");
        const enteredName = (nameInput && nameInput.value.trim()) 
          || [state.quizAnswers.firstName, state.quizAnswers.middleName, state.quizAnswers.lastName].filter(Boolean).join(" ") 
          || "Member";
        const enteredEmail = (emailInput && emailInput.value.trim()) || "you@example.com";
        const enteredAvatar = (avatarInput && avatarInput.value.trim()) || "";
        handleSuccessfulAuth(enteredName, enteredEmail, enteredAvatar);
      });
    }

    // Quick hero buttons
    const heroExploreBtn = document.getElementById("heroExploreBtn");
    if (heroExploreBtn) {
      heroExploreBtn.addEventListener("click", () => {
        document.getElementById("meetups").scrollIntoView({ behavior: "smooth" });
      });
    }

    const heroMatchBtn = document.getElementById("heroMatchBtn");
    if (heroMatchBtn) {
      heroMatchBtn.addEventListener("click", () => {
        document.getElementById("quiz").scrollIntoView({ behavior: "smooth" });
      });
    }

    const heroHostBtn = document.getElementById("heroHostBtn");
    if (heroHostBtn) {
      heroHostBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const hostSec = document.getElementById("host-section");
        if (hostSec) {
          hostSec.scrollIntoView({ behavior: "smooth" });
          const titleInput = document.getElementById("hostMeetupTitle");
          if (titleInput) setTimeout(() => titleInput.focus(), 500);
        }
      });
    }

    // Meetup notifications subscription form
    const newsletterForm = document.getElementById("newsletterForm");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector(".newsletter-input");
        if (input && input.value) {
          const userCity = state.userCity || "your area";
          showToast(`Subscribed! We'll notify you whenever a new meetup is hosted in ${userCity}.`, "success");
          localStorage.setItem("outspire_notify_area_meetups", "true");
          input.value = "";
        }
      });
    }

    // Community section Tom's profile button
    const viewFullProfileBtn = document.getElementById("viewFullProfileBtn");
    if (viewFullProfileBtn) {
      viewFullProfileBtn.addEventListener("click", () => {
        openProfileModal("tom_cruise16");
      });
    }

    // Homepage preview card connection clicks to open respective profiles
    document.querySelectorAll("#exampleProfileCard .connection-member-card").forEach(card => {
      card.addEventListener("click", (e) => {
        e.stopPropagation();
        const profileId = card.getAttribute("data-profile-id");
        if (profileId) {
          openProfileModal(profileId, "tom_cruise16");
        }
      });
    });

    // Homepage preview card Edit Profile action (Own profile)
    const previewEditProfileBtn = document.getElementById("previewEditProfileBtn");
    if (previewEditProfileBtn) {
      previewEditProfileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openUserProfileModal("about");
      });
    }

    // Connect action for other members on feedback cards
    document.querySelectorAll(".btn-author-connect").forEach(btn => {
      const pid = btn.getAttribute("data-profile-id");
      const isConnected = (state.connectedMemberIds || []).includes(pid);
      if (isConnected) {
        btn.classList.add("is-connected");
        btn.innerHTML = "<span>✓ Connected</span>";
      }
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!state.connectedMemberIds) state.connectedMemberIds = [];
        const targetId = btn.getAttribute("data-profile-id");
        if (!targetId) return;
        const nowConn = state.connectedMemberIds.includes(targetId);
        const targetProfile = PROFILES_DATA[targetId] || { name: "member" };

        if (!nowConn) {
          state.connectedMemberIds.push(targetId);
          localStorage.setItem("outspire_connected_members", JSON.stringify(state.connectedMemberIds));
          btn.classList.add("is-connected");
          btn.innerHTML = "<span>✓ Connected</span>";
          showToast(`🤝 Connected with ${targetProfile.name}! You are now mutual table friends.`, "success");
        } else {
          state.connectedMemberIds = state.connectedMemberIds.filter(id => id !== targetId);
          localStorage.setItem("outspire_connected_members", JSON.stringify(state.connectedMemberIds));
          btn.classList.remove("is-connected");
          btn.innerHTML = "<span>+ Connect</span>";
          showToast(`Removed connection with ${targetProfile.name}.`, "info");
        }
      });
    });

    // Click on other member in feedback cards to open their full profile
    document.querySelectorAll(".testimonial-author[data-profile-id]").forEach(author => {
      author.addEventListener("click", (e) => {
        if (e.target.closest(".btn-author-connect")) return;
        const pid = author.getAttribute("data-profile-id");
        if (pid) {
          openProfileModal(pid);
        }
      });
    });


    // Leave Feedback Modal
    const leaveFeedbackBtn = document.getElementById("leaveFeedbackBtn");
    const feedbackModal = document.getElementById("feedbackModal");
    const feedbackForm = document.getElementById("feedbackForm");

    if (leaveFeedbackBtn && feedbackModal) {
      leaveFeedbackBtn.addEventListener("click", () => {
        const authorInput = document.getElementById("feedbackAuthorName");
        if (authorInput && state.isAuthenticated && state.currentUser) {
          authorInput.value = state.currentUser.name;
        }
        feedbackModal.showModal();
      });
    }

    if (feedbackForm) {
      feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const authorName = document.getElementById("feedbackAuthorName")?.value || (state.currentUser ? state.currentUser.name : "Verified Member");
        const meetupSelect = document.getElementById("feedbackMeetupSelect")?.value || "Sunday Central Park Walk";
        const comment = document.getElementById("feedbackComment")?.value || "Wonderful meetup! The group was so warm and welcoming.";
        
        const feedbackCardsList = document.getElementById("feedbackCardsList");
        if (feedbackCardsList) {
          const newCard = document.createElement("div");
          newCard.className = "testimonial-card";
          newCard.style.border = "1px solid var(--cream-border)";
          newCard.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="color: #f59e0b; font-size: 0.95rem;">★★★★★</span>
                <strong style="font-size: 0.84rem; color: var(--cream-200);">5.0 · ${escapeHTML(meetupSelect)}</strong>
              </div>
              <span class="meetup-tag" style="background: rgba(39, 174, 96, 0.12); color: #27ae60; font-size: 0.7rem; padding: 2px 7px;">✓ Just Now</span>
            </div>
            <p class="testimonial-quote">
              "${escapeHTML(comment)}"
            </p>
            <div class="testimonial-author">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80" 
                alt="${escapeHTML(authorName)}" 
                class="testimonial-avatar"
                width="40"
                height="40"
              />
              <div>
                <strong style="color: var(--cream-100); font-size: 0.92rem;">${escapeHTML(authorName)}</strong>
                <div style="font-size: 0.78rem; color: var(--cream-300);">Verified Attendee · ${escapeHTML(meetupSelect)}</div>
              </div>
              <span style="margin-left: auto; font-size: 0.74rem; color: var(--status-success);">Just Now</span>
            </div>
          `;
          feedbackCardsList.prepend(newCard);
        }

        if (feedbackModal) feedbackModal.close();
        feedbackForm.reset();
        showToast("🎉 Thank you! Your meetup feedback has been submitted.", "success");
      });
    }

    // --------------------------------------------------------------------------
    // Simple FAQ Ask a Question Handler
    // --------------------------------------------------------------------------
    const faqAskForm = document.getElementById("faqAskForm");
    const faqAskInput = document.getElementById("faqAskInput");
    const faqAskResponse = document.getElementById("faqAskResponse");

    if (faqAskForm) {
      faqAskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const question = faqAskInput ? faqAskInput.value.trim() : "";
        if (!question) {
          showToast("Please type your question first.", "warning");
          if (faqAskInput) faqAskInput.focus();
          return;
        }
        handleFaqQuestionSubmit(question);
      });
    }

    function handleFaqQuestionSubmit(question) {
      const qLower = question.toLowerCase();
      let answerText = "";
      let topicBadge = "💡 Community Answer";

      if (qLower.includes("friend") || qLower.includes("plus-one") || qLower.includes("guest") || qLower.includes("bring someone")) {
        topicBadge = "👫 Bringing a Friend or Guest";
        answerText = "Every seat is individually reserved so that each person has their own verified attendee pass and profile. If you'd like a friend or partner to join, simply share the gathering link or Meetup Code (e.g. MEET-1001) with them so they can claim an open seat at the exact same table!";
      } else if (qLower.includes("diet") || qLower.includes("allergy") || qLower.includes("allergies") || qLower.includes("vegan") || qLower.includes("vegetarian") || qLower.includes("halal") || qLower.includes("kosher") || qLower.includes("food")) {
        topicBadge = "🥗 Dietary & Food Flexibility";
        answerText = "All food and beverage orders are handled à la carte directly with the venue staff. You order and pay for whatever fits your personal dietary needs, preferences, or allergies—there are no forced set menus or shared bills!";
      } else if (qLower.includes("host") || qLower.includes("create") || qLower.includes("organize") || qLower.includes("lead")) {
        topicBadge = "✨ Hosting on Outspire";
        answerText = "Anyone in the Outspire community can host! Tap 'Host a Gathering' in the navigation bar to pick your favorite local venue, choose your day/time and group size (from 2 to 10), and publish your table. It takes under 60 seconds!";
      } else if (qLower.includes("free") || qLower.includes("cost") || qLower.includes("price") || qLower.includes("fee") || qLower.includes("pay") || qLower.includes("subscription")) {
        topicBadge = "🎟️ Free Seating & Pricing";
        answerText = "Reserving your seat on Outspire is 100% free! We never charge membership fees or reservation fees. At dining or coffee meetups, each member simply pays the venue directly for what they order.";
      } else if (qLower.includes("late") || qLower.includes("running late") || qLower.includes("delay") || qLower.includes("minutes")) {
        topicBadge = "⏰ Running Late";
        answerText = "No worries at all! Just open your meetup's private Group Chat and send a quick message to let your fellow table members know. Everyone is relaxed and friendly.";
      } else if (qLower.includes("cancel") || qLower.includes("reschedule") || qLower.includes("can't make it")) {
        topicBadge = "🔄 Free 1-Click Cancellation";
        answerText = "You can cancel your reservation with a single click anytime up to 3 hours before the gathering starts from your pass or dashboard. Within 3 hours, spots lock to ensure hosts and guests aren't left waiting.";
      } else if (qLower.includes("safe") || qLower.includes("safety") || qLower.includes("departure") || qLower.includes("trust") || qLower.includes("stranger")) {
        topicBadge = "🛡️ Community Safety & Verification";
        answerText = "All meetups take place in public, vetted spaces like popular cafes, parks, and restaurants. Every attendee agrees to our Code of Conduct, and when the meetup ends, everyone taps 'Confirm Safe Departure' so everyone knows all members got home safely.";
      } else {
        topicBadge = "💬 Question Received";
        answerText = `Thank you! We've logged your question: “${escapeHTML(question)}”. Our Outspire team will review it and assist you. You can also join any open meetup to connect with fellow members directly!`;
      }

      if (faqAskResponse) {
        faqAskResponse.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent-gold);">
              ${topicBadge}
            </span>
            <button type="button" id="btnCloseFaqAnswer" style="background: none; border: none; color: var(--cream-300); cursor: pointer; font-size: 0.8rem; padding: 2px 6px;">
              ✕ Close
            </button>
          </div>
          <p style="font-size: 0.9rem; color: var(--cream-100); line-height: 1.5; margin: 0;">
            ${answerText}
          </p>
        `;
        faqAskResponse.style.display = "block";
        if (faqAskInput) faqAskInput.value = "";

        const closeBtn = document.getElementById("btnCloseFaqAnswer");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            faqAskResponse.style.display = "none";
          });
        }
      }

      showToast("✨ Question processed!", "success");
    }

    // Global Event Delegate for Copying Meetup Code
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".copy-meetup-code-btn");
      if (!btn) return;
      e.stopPropagation();
      e.preventDefault();
      const code = btn.dataset.code;
      if (!code) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          showToast(`📋 Code ${code} copied to clipboard! Share it or search it anytime.`, "success");
        }).catch(() => {
          showToast(`Code: ${code}`, "info");
        });
      } else {
        showToast(`Code: ${code}`, "info");
      }
    });
  }

  // --------------------------------------------------------------------------
  // Application Bootstrap
  // --------------------------------------------------------------------------
  function init() {
    applyTheme(state.theme);
    updateCategoryCounts();
    renderDaySelectOptions();
    renderLocationSelectOptions();
    renderCityAreaFilterBar();
    updateTimeFilterUI();
    renderMeetups();
    setupEventListeners();
    updateAuthUI();
    initGoogleMapStudio();
    initFloatingChatWidget();

    // Periodic real-time update: Automatically remove meetups from public view as time reaches their scheduled start
    setInterval(() => {
      if (elements.meetupsGrid && !document.hidden) {
        renderMeetups();
        updateCategoryCounts();
      }
    }, 30000);

    // Clean up any stale modal hash on page load so modals NEVER auto-open on page refresh
    if (window.location.hash) {
      const rawHash = window.location.hash.replace("#", "").trim();
      const isModalHash = /^MEET-|^PROFILE$|^MY-PROFILE$/i.test(rawHash) || state.meetups.some(m => 
        (m.code && m.code.toUpperCase() === rawHash.toUpperCase()) ||
        (m.id && m.id.toUpperCase() === rawHash.toUpperCase()) ||
        (m.code && m.code.replace("-", "").toUpperCase() === rawHash.replace("-", "").toUpperCase())
      );
      if (isModalHash) {
        try {
          history.replaceState(null, "", window.location.pathname + window.location.search);
        } catch (e) {}
      }
    }
    // Test & debug hook
    window.__outspire = {
      state,
      elements,
      openReservationModal,
      closeReservationModal,
      openUserProfileModal,
      renderMeetups,
      openChatDrawer,
      closeChatDrawer,
      markChatAsRead,
      hasAvailableGroupChat,
      getAvailableGroupChats,
      getUnreadChatMessageCount,
      updateFloatingChatWidget
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
