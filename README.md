# Outspire — Social Networking & Curated Gathering Platform

A complete, high-performance, accessible, and responsive one-page social networking and gathering booking platform built with **HTML5, CSS, and Vanilla JavaScript**, featuring a warm **cream accent palette** (`#FAF7F2`, `#F7F1E6`, `#EFE4D2`, `#DFCFB7`, `#CBB696`) paired with rich roast obsidian surfaces and an optional linen light mode.

Directly based on the startup wireframes and design system:
- **Mission**: *"Meaningful connections, social confidence, and enjoyable meetings. Small gatherings, welcoming places, new faces and new connections."*
- **Comfort Priority**: Flexible 2–10 guest circles, 100% free seat holds, verified public venues, and 3-hour fair cancellation policy (no cancellations within 3 hours).

---

## 🌟 Key Features

### 1. Interactive Gathering Discovery & Filter Engine
- **Filter Tabs**: All Meetups, Highly Curated, Dining & Lunch, Night & Shows, Outdoor & Active, and **My Booked History** (with real-time counter).
- **Multi-parameter Search**: Search by keywords, day selector (`Today`, `Thu, Feb 12`, `Sun, Feb 15`, `Tue, Feb 10`), neighborhood (`Manhattan`, `Brooklyn`, `Queens`, `Hoboken`), and time window (`Morning`, `Afternoon`, `Evening`).
- **Random Meetups Matcher**: Direct wireframe feature ("*Hit the button and we'll notify you once we've found the perfect meetup for you*") that selects an open table with matching chemistry.
- **Wireframe Meetup Roster**:
  - **Lunch Meetup at Veselka** (144 2nd Ave, East Village, NY) — Sunday 1:00 PM
  - **Dining Meetup at Oceana** (120 W 49th St, Midtown, NY) — Today 8:00 PM
  - **Night Party & Show** (The Django Lounge, Tribeca, NY) — Thu 10:00 PM
  - **Soccer Match & Social (Age 20-30)** (Pier 5 Brooklyn Bridge Park) — Thu 8:00 PM
  - **Dog Walk Gathering** (153rd St & 90th Ave, Queens, NY) — Tue 7:00 AM
  - **Happy Weekend Coffee & Ideas** (Birch Coffee & Hoboken Park) — Tue 10:00 AM

### 2. Full Reservation & Booking Lifecycle
- **Interactive Reservation Modal**: View host, attendee list (Henry Jones, Lucas Martinez, Tyler Davis, Carl Johnson, etc.), venue address with direct Google Maps link, and atmosphere rating.
- **Instant Seat Hold (Free)**: Confirms reservation instantly, adds user to table roster, and updates `localStorage`.
- **Cancellation Flow with Confirmation**: Faithful reproduction of the wireframe dialog: *"Are you sure you want to cancel? [No, let it be] [Cancel reservation]"*.
- **Post-Booking Table Group Chat**: Unlocks a live interactive slide-over drawer where table members can chat, plan arrival, and send real-time messages.

### 3. Interactive Personality & Identity Matcher Wizard
- Faithfully implements the **18 onboarding steps** from the wireframe:
  - **Identity**: First/Middle/Last name, Age, Gender definition, Relationship status, Children, Country & City.
  - **Personality & Social Chemistry**: Comfort around new people, Group conversation role, Conversation depth, Introvert/Ambivert/Extrovert scale, Discussion value, Main goals, Favorite topics (pick up to 3), Social battery, Silence comfort, Career stage, Field/Industry, and Work talk preferences.
  - **Calculation & Match**: Displays an animated **98% Match Score** and directly recommends an ideal table with a 1-click booking button.

### 4. Community & Member Profiles
- **Profile Spotlight**: Tom Cruise profile (`@tom_cruise16`, 15 Meetups, 5 Events, *"Life is hard, but it's harder if you're stupid"*, friends Chris Brown, William Stone, Luke Vance).
- **Interactive Profile Viewer**: Click any attendee avatar to inspect their social style, meetups count, and mutual interests.

### 5. Design & Cream Color Theme System
- **Cream Accent Palette**:
  - Lightest Whipped Cream: `#FCFAF6`
  - Soft Warm Cream: `#F7F1E6`
  - Warm Almond / Oat Cream: `#EFE4D2`
  - Rich Golden Cream: `#E3D2BA`
  - Toasted Caramel Cream: `#C2A781`
- **Dual Mode**:
  - **Dark Roast Theme** (default): Deep espresso obsidian background with glowing cream borders and cream typography.
  - **Linen Light Theme**: Soft warm linen surface with coffee text and golden cream accents.
  - Instant theme toggle button in the navigation header with preference stored in `localStorage`.

### 6. SEO, Performance & Accessibility
- **Semantic HTML5**: Native `<dialog>`, `<details>`, `<summary>`, `<header>`, `<main>`, `<article>`, and `<aside>`.
- **SEO & Social Graph**: Open Graph (`og:*`), Twitter Cards, Canonical URL, Meta description, and viewport optimization.
- **Schema.org JSON-LD**: Rich structured data including `WebSite`, `Organization`, and `Event` schema for featured meetups.
- **Accessible Interactions**: Keyboard navigation, ESC key modal dismissal, focus-visible outlines, ARIA live feedback, and `prefers-reduced-motion` compliance.

---

## 📁 File Structure

```
strangers-meetup-platform/
├── index.html       # Semantic single-page application markup with JSON-LD & meta tags
├── styles.css       # Modern CSS: Cream design tokens, responsive grid/flexbox, animations
├── data.js          # Grounded datasets: meetups, venues, members, quiz questions, testimonials
├── app.js           # Vanilla JS controller: filters, modals, quiz wizard, chat drawer, bookings
└── README.md        # Comprehensive architecture & user guide
```

---

## 🚀 How to Run the Website

You can preview the website directly in any web browser without needing a build step or server:

1. Double-click `index.html` to open it in Chrome, Edge, Safari, or Firefox.
2. Or serve it via any local development server:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser.
