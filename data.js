/**
 * Outspire Platform - Core Data Store
 * Grounded directly in the wireframe specifications, attendee lists, venues, and questionnaire steps.
 */

const MEETUPS_DATA = [
  {
    id: "meetup-veselka-lunch",
    title: "Lunch Meetup at Veselka",
    category: "dining",
    day: "Sun, Feb 15",
    time: "13:00 (1:00 PM)",
    dateFormatted: "Sunday, February 15, 2026",
    timeRaw: "13:00",
    location: "Manhattan, New York",
    neighborhood: "East Village",
    venueName: "Veselka Restaurant",
    venueAddress: "144 2nd Ave, New York, NY 10003, United States",
    coordinates: { lat: 40.7291, lng: -73.9872 },
    isCommunityHosted: true,
    mapQuery: "Veselka+144+2nd+Ave+New+York",
    price: "Free",
    capacity: 4,
    bookedCount: 3,
    tags: ["Lunch & Comfort", "Strangers Welcoming", "Casual Dining", "Foodies"],
    description: "A relaxed meetup bringing strangers together over warm Ukrainian comfort food in the heart of East Village. Sit together, share stories, enjoy warm pierogis, and turn unfamiliar faces into familiar friends.",
    atmosphere: "Warm, cozy, vibrant & welcoming",
    vibeScore: 98,
    image: "meetup-gathering.jpg",
    imageAlt: "Small group of friendly strangers laughing and sharing an evening dinner together at a bistro table",
    host: {
      name: "Henry Jones",
      role: "Verified Host",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-henry",
        name: "Henry Jones",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        bio: "East Village local, book lover & amateur sourdough baker. Loves good humor and easygoing conversations.",
        meetupsCount: 12,
        topics: ["Books", "Culinary", "Local History"]
      },
      {
        id: "m-lucas",
        name: "Lucas Martinez",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        bio: "Product designer who recently moved to NYC. Looking to meet fellow curious minds and explore coffee spots.",
        meetupsCount: 8,
        topics: ["Design", "Travel", "City Walks"]
      },
      {
        id: "m-tyler",
        name: "Tyler Davis",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
        bio: "Music enthusiast and freelance sound editor. Enjoys deep chats and listening more than talking.",
        meetupsCount: 5,
        topics: ["Music", "Films", "Philosophy"]
      },
      {
        id: "m-carl",
        name: "Carl Johnson",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        bio: "Software developer & runner. Trying to step out of screen time and connect with real people in real life.",
        meetupsCount: 14,
        topics: ["Tech & Ideas", "Running", "Podcasts"]
      }
    ]
  },
  {
    id: "meetup-oceana-dining",
    title: "Dining Meetup at Oceana",
    category: "dining",
    day: "Today",
    time: "20:00 (8:00 PM)",
    dateFormatted: "Wednesday, February 11, 2026",
    timeRaw: "20:00",
    location: "Manhattan, New York",
    neighborhood: "Midtown West",
    venueName: "Oceana Restaurant",
    venueAddress: "120 W, 49th St, New York, NY 10020, United States",
    coordinates: { lat: 40.7597, lng: -73.9822 },
    isCommunityHosted: true,
    mapQuery: "Oceana+120+W+49th+St+New+York",
    price: "Free",
    capacity: 6,
    bookedCount: 3,
    tags: ["Dinner Gathering", "Intimate Setting", "Great Ambiance", "Seafood & Grill"],
    description: "An enjoyable evening dinner for friendly individuals who appreciate thoughtful conversation in an elegant, unpretentious dining atmosphere. Unwind mid-week with engaging company.",
    atmosphere: "Sophisticated yet comfortable and relaxed",
    vibeScore: 95,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Warm restaurant interior with soft lighting and dining tables",
    host: {
      name: "Sarah Jenkins",
      role: "Community Ambassador",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-sarah",
        name: "Sarah Jenkins",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        bio: "Architectural writer and museum explorer. Believes great conversations make any city feel like home.",
        meetupsCount: 19,
        topics: ["Architecture", "Wine", "Travel"]
      },
      {
        id: "m-david",
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
        bio: "Fintech engineer, vinyl collector, and jazz fan. Appreciates honest conversations and zero pretension.",
        meetupsCount: 6,
        topics: ["Jazz", "Tech", "Food"]
      },
      {
        id: "m-maya",
        name: "Maya Patel",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
        bio: "Brand strategist and plant mom. Passionate about sustainability, creative side-projects and psychology.",
        meetupsCount: 9,
        topics: ["Psychology", "Design", "Nature"]
      }
    ]
  },
  {
    id: "meetup-night-party",
    title: "Night Party & Enjoyable Show Meetup",
    category: "nightlife",
    day: "Thu, Feb 12",
    time: "22:00 (10:00 PM)",
    dateFormatted: "Thursday, February 12, 2026",
    timeRaw: "22:00",
    location: "Manhattan, New York",
    neighborhood: "Tribeca",
    venueName: "The Django Lounge",
    venueAddress: "2 Avenue of the Americas, New York, NY 10013, United States",
    coordinates: { lat: 40.7193, lng: -74.0048 },
    isCommunityHosted: true,
    mapQuery: "The+Django+Lounge+2+Avenue+of+the+Americas+New+York",
    price: "Free",
    capacity: 5,
    bookedCount: 3,
    tags: ["Live Show", "18+ Gathering", "Music & Cocktails", "Social Energy"],
    description: "An enjoyable gathering for random people above age 18. Enjoy live indie jazz performances, craft mocktails/cocktails, and meet friendly locals in a warm, subterranean Parisian-style lounge.",
    atmosphere: "Lively, soulful, low-lit & energetic",
    vibeScore: 92,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Live jazz band performing on a cozy lounge stage with warm lighting",
    host: {
      name: "Chris Brown",
      role: "Host & DJ",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-chris",
        name: "Chris Brown",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
        bio: "Music producer & audio engineer. Always curating new sounds and making newcomers feel right at home.",
        meetupsCount: 22,
        topics: ["Live Music", "Nightlife", "Creative Media"]
      },
      {
        id: "m-william",
        name: "William Stone",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
        bio: "Comedy writer and trivia night champion. Here to share laughs and hear quirky life stories.",
        meetupsCount: 11,
        topics: ["Comedy", "Writing", "Cinema"]
      },
      {
        id: "m-luke",
        name: "Luke Vance",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
        bio: "Photographer roaming around Lower Manhattan. Loves meeting diverse creative minds.",
        meetupsCount: 7,
        topics: ["Visual Arts", "Street Life", "Travel"]
      },
      {
        id: "m-elena",
        name: "Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        bio: "Ex-pat teacher living in SoHo. Enjoys cultural exchanges, theater, and making new friends.",
        meetupsCount: 15,
        topics: ["Languages", "Dance", "Philosophy"]
      },
      {
        id: "m-tom",
        name: "Tom Cruise",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        bio: "Life is hard, but it's harder if you're stupid. Enthusiastic explorer of NYC gatherings.",
        meetupsCount: 15,
        topics: ["Adventures", "Movies", "Fitness"]
      }
    ]
  },
  {
    id: "meetup-brooklyn-soccer",
    title: "Casual Soccer Match Meetup",
    category: "sports",
    day: "Thu, Feb 12",
    time: "20:00 (8:00 PM)",
    dateFormatted: "Thursday, February 12, 2026",
    timeRaw: "20:00",
    location: "Brooklyn, New York",
    neighborhood: "Brooklyn Heights",
    venueName: "Pier 5 Turf Fields",
    venueAddress: "Pier 5, Brooklyn Bridge Park, Brooklyn, NY 11201, United States",
    coordinates: { lat: 40.6972, lng: -74.0003 },
    isCommunityHosted: true,
    mapQuery: "Pier+5+Brooklyn+Bridge+Park",
    price: "Free",
    capacity: 14,
    bookedCount: 8,
    tags: ["Friendly Sports", "Soccer Match", "Casual Game", "East River Views"],
    description: "Join us for a friendly, casual kickaround under the Manhattan skyline lights, followed by slice and drinks nearby. All skill levels welcome!",
    atmosphere: "Sporty, energetic, friendly & supportive",
    vibeScore: 94,
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80",
    imageAlt: "People playing friendly soccer on an outdoor turf field at twilight",
    host: {
      name: "Marcus Roy",
      role: "Match Organizer",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-marcus",
        name: "Marcus Roy",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
        bio: "Lifelong soccer enthusiast and fitness coach. Welcoming all skill levels for a fun kickaround.",
        meetupsCount: 18,
        topics: ["Sports", "Wellness", "Community"]
      },
      {
        id: "m-alex",
        name: "Alex Silva",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        bio: "Graphic designer who loves weekend matches and post-match chats.",
        meetupsCount: 6,
        topics: ["Fitness", "Art", "Brooklyn Culture"]
      }
    ]
  },
  {
    id: "meetup-morning-jog",
    title: "Morning Waterfront Jogging Meetup",
    category: "jogging",
    day: "Sun, Feb 15",
    time: "08:30 (8:30 AM)",
    dateFormatted: "Sunday, February 15, 2026",
    timeRaw: "08:30",
    location: "Manhattan, New York",
    neighborhood: "East River Esplanade",
    venueName: "East River Waterfront Promenade",
    venueAddress: "FDR Dr & E 20th St, New York, NY 10009, United States",
    coordinates: { lat: 40.7335, lng: -73.9745 },
    isCommunityHosted: true,
    mapQuery: "East+River+Waterfront+Promenade+NY",
    price: "Free",
    capacity: 20,
    bookedCount: 12,
    tags: ["Jogging & Run", "Morning Energy", "River Views", "Easy Pace"],
    description: "Start Sunday right with a relaxed 5K morning jog along the East River with friendly neighbors. Conversational pace with stretching and fresh juice after.",
    atmosphere: "Invigorating, social, uplifting & welcoming",
    vibeScore: 96,
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
    imageAlt: "People jogging together along a scenic riverside path in the morning sunshine",
    host: {
      name: "Carl Johnson",
      role: "Running Lead",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-carl-jog",
        name: "Carl Johnson",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        bio: "Avid amateur runner who loves starting the day with community movement.",
        meetupsCount: 14,
        topics: ["Running", "Health", "Podcasts"]
      },
      {
        id: "m-maya-jog",
        name: "Maya Patel",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
        bio: "Enjoys morning movement before the city gets crowded.",
        meetupsCount: 9,
        topics: ["Fitness", "Mindfulness", "Design"]
      }
    ]
  },
  {
    id: "meetup-dog-walk",
    title: "Neighborhood Dog Walk Meetup",
    category: "dogwalk",
    day: "Tue, Feb 10",
    time: "07:00 (7:00 AM)",
    dateFormatted: "Tuesday, February 10, 2026",
    timeRaw: "07:00",
    location: "Queens, New York",
    neighborhood: "Jamaica",
    venueName: "Rufus King Park",
    venueAddress: "153rd St & 90th Ave, Jamaica, NY 11435, United States",
    coordinates: { lat: 40.7042, lng: -73.8037 },
    isCommunityHosted: true,
    mapQuery: "153rd+St+and+90th+Ave+Jamaica+NY",
    price: "Free",
    capacity: 15,
    bookedCount: 9,
    tags: ["Morning Walk", "Dog Friendly", "Fresh Air", "Gentle Pace"],
    description: "Start your morning with a refreshing stroll alongside friendly neighborhood dogs and fellow animal lovers. Perfect for pet parents or anyone who loves dogs and fresh air.",
    atmosphere: "Peaceful, heartwarming, sunny & relaxed",
    vibeScore: 97,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Happy dogs walking together in a green city park with their owners",
    host: {
      name: "Emily Rose",
      role: "Dog Care Volunteer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-emily",
        name: "Emily Rose",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        bio: "Veterinary technician and golden retriever owner. Loves early morning walks.",
        meetupsCount: 16,
        topics: ["Animals", "Gardening", "Mindfulness"]
      }
    ]
  },
  {
    id: "meetup-astoria-swimming",
    title: "Summer Swimming & Pool Meetup",
    category: "swimming",
    day: "Sun, Feb 15",
    time: "14:00 (2:00 PM)",
    dateFormatted: "Sunday, February 15, 2026",
    timeRaw: "14:00",
    location: "Queens, New York",
    neighborhood: "Astoria",
    venueName: "Astoria Park Pool & Lawn",
    venueAddress: "19th St & 23rd Dr, Astoria, NY 11105, United States",
    coordinates: { lat: 40.7785, lng: -73.9212 },
    isCommunityHosted: true,
    mapQuery: "Astoria+Park+Pool+Astoria+NY",
    price: "Free",
    capacity: 25,
    bookedCount: 14,
    tags: ["Swimming", "Water Activities", "Park Picnic", "Sunny Vibes"],
    description: "An open community swim and lawn hangout! Do some laps in the outdoor pool, bask on the grassy hills with Triborough Bridge views, and enjoy cold drinks.",
    atmosphere: "Refreshing, sunlit, playful & social",
    vibeScore: 95,
    image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=800&q=80",
    imageAlt: "People swimming and lounging around an outdoor public swimming pool on a warm day",
    host: {
      name: "Lucas Martinez",
      role: "Host",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-lucas-swim",
        name: "Lucas Martinez",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        bio: "Swimmer, designer, and outdoor explorer. Loves summer city weekends.",
        meetupsCount: 8,
        topics: ["Swimming", "Outdoors", "City Life"]
      }
    ]
  },
  {
    id: "meetup-playground",
    title: "Playground Hangout & Parents Meetup",
    category: "playground",
    day: "Sat, Feb 14",
    time: "11:00 (11:00 AM)",
    dateFormatted: "Saturday, February 14, 2026",
    timeRaw: "11:00",
    location: "Manhattan, New York",
    neighborhood: "Flatiron",
    venueName: "Madison Square Park Playground",
    venueAddress: "Madison Ave & E 25th St, New York, NY 10010, United States",
    coordinates: { lat: 40.7419, lng: -73.9877 },
    isCommunityHosted: true,
    mapQuery: "Madison+Square+Park+Playground+NY",
    price: "Free",
    capacity: 12,
    bookedCount: 7,
    tags: ["Playground", "Casual Hangout", "Weekend Morning", "Friendly Chats"],
    description: "A laid-back weekend meetup by the playground. Let the kids play or just enjoy a park coffee chat on the benches with neighborhood friends.",
    atmosphere: "Friendly, casual, relaxed & heartwarming",
    vibeScore: 93,
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Families and friends sitting and talking on benches near a sunny neighborhood park playground",
    host: {
      name: "Chloe Bennett",
      role: "Community Host",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-chloe-play",
        name: "Chloe Bennett",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
        bio: "Neighborhood local who loves easygoing morning conversations in the park.",
        meetupsCount: 8,
        topics: ["Playground", "Coffee", "Local Community"]
      }
    ]
  },
  {
    id: "meetup-happy-coffee",
    title: "Happy Weekend Coffee & Meaningful Ideas",
    category: "coffee",
    day: "Tue, Feb 10",
    time: "10:00 (10:00 AM)",
    dateFormatted: "Tuesday, February 10, 2026",
    timeRaw: "10:00",
    location: "Hoboken / New York",
    neighborhood: "Hudson Waterfront",
    venueName: "Birch Coffee & Hoboken Park",
    venueAddress: "Pier A Park, 100 Sinatra Dr, Hoboken, NJ 07030, United States",
    coordinates: { lat: 40.7397, lng: -74.0278 },
    isCommunityHosted: true,
    mapQuery: "Pier+A+Park+Hoboken+NJ",
    price: "Free",
    capacity: 2,
    bookedCount: 1,
    tags: ["Artisan Coffee", "Intimate Pair", "Scenic View", "Comfort First"],
    description: "A serene morning coffee meetup designed especially for those who appreciate quiet, reflective discussions, good specialty coffee, and open vistas across the Hudson River.",
    atmosphere: "Intimate, calm, deeply engaging & restorative",
    vibeScore: 99,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Warm cup of artisan coffee on an outdoor table overlooking the water",
    host: {
      name: "William Stone",
      role: "Host",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-william2",
        name: "William Stone",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
        bio: "Writer and coffee obsessive. Believes the best talks happen when nobody feels rushed.",
        meetupsCount: 11,
        topics: ["Writing", "Philosophy", "Urbanism"]
      }
    ]
  },
  {
    id: "meetup-board-games-event",
    title: "Weekend Board Games & Social Gathering Event",
    category: "event",
    isEvent: true,
    day: "Sat, Feb 14",
    time: "17:00 (5:00 PM)",
    dateFormatted: "Saturday, February 14, 2026",
    timeRaw: "17:00",
    location: "Manhattan, New York",
    neighborhood: "Upper West Side",
    venueName: "Hex & Co Community Lounge",
    venueAddress: "2911 Broadway, New York, NY 10025, United States",
    coordinates: { lat: 40.8062, lng: -73.9652 },
    isCommunityHosted: true,
    mapQuery: "Hex+and+Co+Broadway+NY",
    price: "Free",
    capacity: 30,
    bookedCount: 19,
    tags: ["Community Event", "Board Games", "Social Mixer", "Open Group"],
    description: "An open community event where anyone can drop in! Over 500 board games available, casual rounds of Codenames, Catan, and party games with friendly drinks.",
    atmosphere: "Lively, buzzing, inclusive & celebratory",
    vibeScore: 98,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    imageAlt: "A lively group of diverse people laughing and playing board games together at a community event",
    host: {
      name: "David Kim",
      role: "Event Coordinator",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-david-event",
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
        bio: "Board game nerd & community builder. Loves bringing people together.",
        meetupsCount: 15,
        topics: ["Games", "Community", "Tech"]
      }
    ]
  },
  {
    id: "meetup-london-hyde-park",
    title: "Hyde Park Afternoon Walk & Tea",
    category: "walk",
    day: "Sun, Feb 15",
    time: "14:00 (2:00 PM)",
    dateFormatted: "Sunday, February 15, 2026",
    timeRaw: "14:00",
    location: "London, United Kingdom",
    neighborhood: "Hyde Park / Westminster",
    venueName: "The Serpentine Bar & Kitchen",
    venueAddress: "Hyde Park, London W2 2UH, United Kingdom",
    coordinates: { lat: 51.5055, lng: -0.1678 },
    isCommunityHosted: true,
    mapQuery: "The+Serpentine+Kitchen+Hyde+Park+London",
    price: "Free",
    capacity: 6,
    bookedCount: 4,
    tags: ["Park Walk", "Scenic Trails", "Fresh Air", "Coffee & Tea"],
    description: "A gentle stroll around the Serpentine followed by warm tea and relaxed stories at the waterside café. All paces and friendly conversation welcome.",
    atmosphere: "Breezy, refreshing, scenic & calm",
    vibeScore: 97,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
    imageAlt: "People walking peacefully through a sunlit green European city park",
    host: {
      name: "Oliver Davies",
      role: "Verified Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-oliver",
        name: "Oliver Davies",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        bio: "London history buff, walker, and avid tea drinker.",
        meetupsCount: 14,
        topics: ["Architecture", "History", "Walks"]
      },
      {
        id: "m-sophie",
        name: "Sophie Clark",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        bio: "Software developer living in Marylebone. Loves weekend strolls.",
        meetupsCount: 6,
        topics: ["Tech", "Books", "Coffee"]
      }
    ]
  },
  {
    id: "meetup-tokyo-shinjuku-walk",
    title: "Shinjuku Gyoen Garden Walk & Café",
    category: "walk",
    day: "Sat, Feb 14",
    time: "11:00 (11:00 AM)",
    dateFormatted: "Saturday, February 14, 2026",
    timeRaw: "11:00",
    location: "Tokyo, Japan",
    neighborhood: "Shinjuku",
    venueName: "Shinjuku Gyoen National Garden",
    venueAddress: "11 Naitomachi, Shinjuku City, Tokyo 160-0014, Japan",
    coordinates: { lat: 35.6852, lng: 139.7101 },
    isCommunityHosted: true,
    mapQuery: "Shinjuku+Gyoen+National+Garden+Tokyo",
    price: "Free",
    capacity: 5,
    bookedCount: 3,
    tags: ["Garden Walk", "Nature & Peace", "Matcha & Tea", "Multilingual"],
    description: "Stroll through tranquil traditional landscapes and open lawns in central Tokyo. A relaxed, welcoming circle for locals, expats, and travelers to share stories.",
    atmosphere: "Peaceful, aesthetic & open-minded",
    vibeScore: 99,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Tranquil Japanese garden pathway surrounded by greenery in Tokyo",
    host: {
      name: "Kenji Sato",
      role: "Verified Host",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-kenji",
        name: "Kenji Sato",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        bio: "Photographer and tea lover. Enjoys meeting people from around the world.",
        meetupsCount: 18,
        topics: ["Photography", "Nature", "Travel"]
      }
    ]
  },
  {
    id: "meetup-paris-seine-stroll",
    title: "Seine Riverbank Sunset Stroll & Crepes",
    category: "walk",
    day: "Sun, Feb 15",
    time: "17:30 (5:30 PM)",
    dateFormatted: "Sunday, February 15, 2026",
    timeRaw: "17:30",
    location: "Paris, France",
    neighborhood: "Latin Quarter / 5th Arr.",
    venueName: "Pont Saint-Michel Steps",
    venueAddress: "Place Saint-Michel, 75005 Paris, France",
    coordinates: { lat: 48.8532, lng: 2.3444 },
    isCommunityHosted: true,
    mapQuery: "Place+Saint+Michel+Paris",
    price: "Free",
    capacity: 6,
    bookedCount: 4,
    tags: ["Sunset Stroll", "Riverside", "Casual Dining", "Storytelling"],
    description: "An easy evening walk along the banks of the Seine catching the golden hour light, pausing for fresh crêpes, and talking about art, travel, and city life.",
    atmosphere: "Charming, golden, friendly & relaxed",
    vibeScore: 98,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Sunset over the Seine river in Paris with historic bridges and gentle light",
    host: {
      name: "Amélie Laurent",
      role: "Verified Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-amelie",
        name: "Amélie Laurent",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        bio: "Art curator and film enthusiast. Always excited to share hidden corners of Paris.",
        meetupsCount: 11,
        topics: ["Cinema", "Art", "Philosophy"]
      }
    ]
  },
  {
    id: "meetup-berlin-tiergarten-games",
    title: "Tiergarten Outdoor Lawn Games & Coffee",
    category: "sports",
    day: "Sat, Feb 14",
    time: "14:00 (2:00 PM)",
    dateFormatted: "Saturday, February 14, 2026",
    timeRaw: "14:00",
    location: "Berlin, Germany",
    neighborhood: "Tiergarten / Mitte",
    venueName: "Café am Neuen See Lawn",
    venueAddress: "Lichtensteinallee 2, 10787 Berlin, Germany",
    coordinates: { lat: 52.5074, lng: 13.3442 },
    isCommunityHosted: true,
    mapQuery: "Cafe+am+Neuen+See+Berlin",
    price: "Free",
    capacity: 8,
    bookedCount: 5,
    tags: ["Lawn Games", "Frisbee", "Outdoor Café", "Easygoing"],
    description: "Casual frisbee, spikeball, or just lounging on the grass with a warm cup of coffee. No athletic skills needed—just good vibes, open grass, and cheerful conversation.",
    atmosphere: "Lively, breezy, playful & open",
    vibeScore: 96,
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Sprawling green park with lake and trees in Berlin",
    host: {
      name: "Lukas Weber",
      role: "Verified Host",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-lukas",
        name: "Lukas Weber",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        bio: "Creative writer who loves sunny weekends in the park and casual table games.",
        meetupsCount: 9,
        topics: ["Writing", "Outdoors", "Games"]
      }
    ]
  },
  {
    id: "meetup-sydney-harbour-walk",
    title: "Harbour Walk & Royal Botanic Lawn Social",
    category: "walk",
    day: "Sun, Feb 15",
    time: "10:00 (10:00 AM)",
    dateFormatted: "Sunday, February 15, 2026",
    timeRaw: "10:00",
    location: "Sydney, Australia",
    neighborhood: "Circular Quay / Botanic Gardens",
    venueName: "Royal Botanic Garden Pavilion",
    venueAddress: "Mrs Macquaries Rd, Sydney NSW 2000, Australia",
    coordinates: { lat: -33.8642, lng: 151.2166 },
    isCommunityHosted: true,
    mapQuery: "Royal+Botanic+Garden+Sydney",
    price: "Free",
    capacity: 6,
    bookedCount: 3,
    tags: ["Harbour Views", "Morning Walk", "Coastal Air", "Coffee"],
    description: "Enjoy iconic harbor sights, morning ocean breeze, and relaxed conversation as we circle from Circular Quay through the Botanic Gardens to Mrs Macquarie's Chair.",
    atmosphere: "Sunny, panoramic, invigorating & warm",
    vibeScore: 98,
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Breathtaking Sydney harbour with bright blue water and sunny sky",
    host: {
      name: "Liam Cooper",
      role: "Verified Host",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-liam",
        name: "Liam Cooper",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
        bio: "Surf enthusiast and community runner. Always up for an early morning stroll.",
        meetupsCount: 7,
        topics: ["Fitness", "Outdoors", "Travel"]
      }
    ]
  },
  {
    id: "meetup-toronto-bellwoods-chat",
    title: "Trinity Bellwoods Walk & Coffee Circle",
    category: "walk",
    day: "Thu, Feb 12",
    time: "15:30 (3:30 PM)",
    dateFormatted: "Thursday, February 12, 2026",
    timeRaw: "15:30",
    location: "Toronto, Canada",
    neighborhood: "Queen West",
    venueName: "White Squirrel Coffee Grounds",
    venueAddress: "707 Queen St W, Toronto, ON M6J 1E6, Canada",
    coordinates: { lat: 43.6465, lng: -79.4103 },
    isCommunityHosted: true,
    mapQuery: "Trinity+Bellwoods+Park+Toronto",
    price: "Free",
    capacity: 5,
    bookedCount: 3,
    tags: ["Park Walk", "Coffee Circle", "Neighbourhood Vibe", "Friendly"],
    description: "Grab a warm cup from a local roaster and take a peaceful lap around Trinity Bellwoods. Perfect mid-week breather to meet friendly neighbors and new friends.",
    atmosphere: "Cozy, neighborly & grounded",
    vibeScore: 97,
    image: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Park in Toronto with trees and people relaxing outdoors",
    host: {
      name: "Chloe Tremblay",
      role: "Verified Host",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
    },
    members: [
      {
        id: "m-chloe",
        name: "Chloe Tremblay",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
        bio: "Graphic designer and dog lover. Loves weekend park walks.",
        meetupsCount: 10,
        topics: ["Design", "Art", "Dogs"]
      }
    ]
  }
];

// --------------------------------------------------------------------------
// 4-Day Booking Window & Live Time Engine
// Strict Rule: Bookings are strictly open for the next 4 days only (Today + 3 Days)
// --------------------------------------------------------------------------
const MEETUP_DAY_OFFSETS = {
  "meetup-veselka-lunch": 0,          // Day 0: Today (13:00)
  "meetup-oceana-dining": 0,          // Day 0: Today (20:00)
  "meetup-night-party": 0,            // Day 0: Today (22:00)
  "meetup-dog-walk": 1,               // Day 1: Tomorrow (07:00)
  "meetup-happy-coffee": 1,           // Day 1: Tomorrow (10:00)
  "meetup-brooklyn-soccer": 1,        // Day 1: Tomorrow (20:00)
  "meetup-morning-jog": 2,            // Day 2 (08:30)
  "meetup-playground": 2,             // Day 2 (11:00)
  "meetup-astoria-swimming": 3,       // Day 3 (14:00)
  "meetup-board-games-event": 3,      // Day 3 (17:00)
  "meetup-london-hyde-park": 0,       // Day 0: Today (14:00)
  "meetup-tokyo-shinjuku-walk": 1,    // Day 1: Tomorrow (11:00)
  "meetup-paris-seine-stroll": 0,     // Day 0: Today (17:30)
  "meetup-berlin-tiergarten-games": 2,// Day 2 (14:00)
  "meetup-sydney-harbour-walk": 1,    // Day 1: Tomorrow (10:00)
  "meetup-toronto-bellwoods-chat": 3  // Day 3 (15:30)
};

// --------------------------------------------------------------------------
// Unique Meetup Search Codes (e.g. Code: MEET-1001)
// Enables direct, instant lookup of any gathering anywhere worldwide
// --------------------------------------------------------------------------
const MEETUP_CODES = {
  "meetup-veselka-lunch": "MEET-1001",
  "meetup-oceana-dining": "MEET-1002",
  "meetup-night-party": "MEET-1003",
  "meetup-brooklyn-soccer": "MEET-1004",
  "meetup-morning-jog": "MEET-1005",
  "meetup-dog-walk": "MEET-1006",
  "meetup-astoria-swimming": "MEET-1007",
  "meetup-playground": "MEET-1008",
  "meetup-happy-coffee": "MEET-1009",
  "meetup-board-games-event": "MEET-1010",
  "meetup-london-hyde-park": "MEET-1011",
  "meetup-tokyo-shinjuku-walk": "MEET-1012",
  "meetup-paris-seine-stroll": "MEET-1013",
  "meetup-berlin-tiergarten-games": "MEET-1014",
  "meetup-sydney-harbour-walk": "MEET-1015",
  "meetup-toronto-bellwoods-chat": "MEET-1016"
};

function generateMeetupCode(existingMeetups = []) {
  const existingCodes = new Set(existingMeetups.map(m => m.code).filter(Boolean));
  let num = 1017;
  while (existingCodes.has(`MEET-${num}`)) {
    num++;
  }
  return `MEET-${num}`;
}

function getLocalDateString(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calculate4DayBookingWindow(referenceDate = new Date()) {
  const days = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate() + i);
    const dateStr = getLocalDateString(d);
    const weekdayShort = d.toLocaleDateString("en-US", { weekday: "short" });
    const weekdayLong = d.toLocaleDateString("en-US", { weekday: "long" });
    const monthShort = d.toLocaleDateString("en-US", { month: "short" });
    const monthLong = d.toLocaleDateString("en-US", { month: "long" });
    const dayNum = d.getDate();
    const year = d.getFullYear();

    let dayLabel = "";
    let dayTag = "";
    if (i === 0) {
      dayLabel = `Today (${weekdayShort}, ${monthShort} ${dayNum})`;
      dayTag = `Today (${weekdayShort})`;
    } else if (i === 1) {
      dayLabel = `Tomorrow (${weekdayShort}, ${monthShort} ${dayNum})`;
      dayTag = `Tomorrow (${weekdayShort})`;
    } else {
      dayLabel = `${weekdayLong} (${monthShort} ${dayNum})`;
      dayTag = `${weekdayShort}, ${monthShort} ${dayNum}`;
    }

    days.push({
      offset: i,
      dateStr,
      dayLabel,
      dayTag,
      weekdayShort,
      weekdayLong,
      monthShort,
      monthLong,
      dayNum,
      year,
      dateFormatted: `${weekdayLong}, ${monthLong} ${dayNum}, ${year}`
    });
  }

  return {
    now: referenceDate,
    days,
    startDateStr: days[0].dateStr,
    endDateStr: days[3].dateStr,
    summaryLabel: `${days[0].dayTag} – ${days[3].dayTag}`
  };
}

function syncMeetupsTo4DayWindow(meetupList) {
  const win = calculate4DayBookingWindow();
  meetupList.forEach((m, idx) => {
    if (!m.code || m.code.startsWith("OUT-")) {
      m.code = MEETUP_CODES[m.id] || `MEET-${1000 + idx + 1}`;
    }
    const offset = typeof m.dayOffset === "number" 
      ? m.dayOffset 
      : (MEETUP_DAY_OFFSETS[m.id] !== undefined ? MEETUP_DAY_OFFSETS[m.id] : 0);
    const targetDay = win.days[offset] || win.days[0];
    m.dayOffset = offset;
    m.dateStr = targetDay.dateStr;
    m.day = targetDay.dayTag;
    m.dayLabel = targetDay.dayLabel;
    m.dateFormatted = targetDay.dateFormatted;
  });
  return win;
}

// Automatically sync MEETUPS_DATA to live 4-day window
const LIVE_4_DAY_WINDOW = syncMeetupsTo4DayWindow(MEETUPS_DATA);

const PROFILES_DATA = {
  tom_cruise16: {
    id: "tom_cruise16",
    name: "Tom K.",
    handle: "@tom_k",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    stats: {
      meetupsAttended: 15,
      eventsJoined: 5,
      showUpRating: "100%",
      showUpRate: "100%",
      reliability: "100%",
      friendlyVibe: "98%",
      friendlyVibeRating: "98%",
      rating: "98%"
    },
    bio: "Moved to Manhattan last year. Always down for morning park walks, trying neighborhood coffee spots, and playing table games with curious, friendly people.",
    city: "Manhattan, New York",
    relationship: "Single",
    socialStyle: "Friendly Ambivert · Warm & Curious · Zero Drama",
    badges: ["Verified Member", "100% Show-Up (Always Attends)", "Safe Departure Verified (100%)", "Active Community Member", "Conversation Spark"],
    favoriteTopics: ["Park Walks & Dogs", "Board Games & Fun", "Books & Cinema", "Neighborhood Spots"],
    friends: [
      { 
        id: "chris_brown",
        name: "Chris Brown", 
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80"
      },
      { 
        id: "william_stone",
        name: "William Stone", 
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80"
      },
      { 
        id: "luke_vance",
        name: "Luke Vance", 
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80"
      }
    ],
    stories: [
      { title: "Central Park Morning Walk", time: "3 days ago", preview: "Met 4 wonderful folks, walked the reservoir, and grabbed fresh bagels after!" },
      { title: "Table Game Night at Greenwich", time: "Last week", preview: "Laughed until our cheeks hurt over the Icebreaker trivia wheel." }
    ]
  },
  chris_brown: {
    id: "chris_brown",
    name: "Chris Brown",
    handle: "@chris_b",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
    stats: {
      meetupsAttended: 12,
      eventsJoined: 4,
      showUpRating: "100%",
      showUpRate: "100%",
      reliability: "100%",
      friendlyVibe: "97%",
      friendlyVibeRating: "97%",
      rating: "97%"
    },
    bio: "Live music lover & vinyl collector in Brooklyn. Always up for acoustic sessions, cozy listening bars, and great conversations over dinner.",
    city: "Brooklyn, New York",
    relationship: "Single",
    socialStyle: "Energetic & Outgoing · Great Laugh · Music Geek",
    badges: ["Verified Member", "100% Show-Up (Always Attends)", "Safe Departure Verified (100%)", "Active Community Member"],
    favoriteTopics: ["Live Music & Gigs", "Vinyl Records", "Food & Cocktails", "Indie Films"],
    friends: [
      { 
        id: "tom_cruise16",
        name: "Tom K.", 
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
      },
      { 
        id: "william_stone",
        name: "William Stone", 
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80"
      },
      { 
        id: "luke_vance",
        name: "Luke Vance", 
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80"
      }
    ],
    stories: [
      { title: "Vinyl Bar Social in Williamsburg", time: "5 days ago", preview: "Spun classic 70s funk records and chatted with fellow audiophiles." }
    ]
  },
  william_stone: {
    id: "william_stone",
    name: "William Stone",
    handle: "@will_stone",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    stats: {
      meetupsAttended: 19,
      eventsJoined: 7,
      showUpRating: "100%",
      showUpRate: "100%",
      reliability: "100%",
      friendlyVibe: "99%",
      friendlyVibeRating: "99%",
      rating: "99%"
    },
    bio: "Board game host, trivia fan, and software engineer in Midtown. Passionate about strategy games, sci-fi novels, and warm Sunday conversations.",
    city: "Midtown, New York",
    relationship: "Single",
    socialStyle: "Thoughtful & Friendly · Patient Host · Quick Wit",
    badges: ["Verified Member", "Super Host", "100% Show-Up (Always Attends)", "Safe Departure Verified (100%)"],
    favoriteTopics: ["Board Games & Strategy", "Sci-Fi & Books", "Trivia & Puzzles", "Craft Coffee"],
    friends: [
      { 
        id: "tom_cruise16",
        name: "Tom K.", 
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
      },
      { 
        id: "chris_brown",
        name: "Chris Brown", 
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80"
      },
      { 
        id: "luke_vance",
        name: "Luke Vance", 
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80"
      }
    ],
    stories: [
      { title: "Catan & Wingspan Night", time: "Last weekend", preview: "Taught 3 newcomers how to play Wingspan; ended in an epic tiebreaker!" }
    ]
  },
  luke_vance: {
    id: "luke_vance",
    name: "Luke Vance",
    handle: "@luke_vance",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    stats: {
      meetupsAttended: 14,
      eventsJoined: 6,
      showUpRating: "100%",
      showUpRate: "100%",
      reliability: "100%",
      friendlyVibe: "98%",
      friendlyVibeRating: "98%",
      rating: "98%"
    },
    bio: "Street photographer and architecture enthusiast in the East Village. Always exploring NYC with a camera, good coffee, and curious minds.",
    city: "East Village, New York",
    relationship: "Single",
    socialStyle: "Curious Observer · Warm Conversationalist · Empathetic Listener",
    badges: ["Verified Member", "100% Show-Up (Always Attends)", "Safe Departure Verified (100%)", "Active Community Member"],
    favoriteTopics: ["Street Photography", "Architecture & Art", "City Walks", "Coffee Spots"],
    friends: [
      { 
        id: "tom_cruise16",
        name: "Tom K.", 
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
      },
      { 
        id: "chris_brown",
        name: "Chris Brown", 
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80"
      },
      { 
        id: "william_stone",
        name: "William Stone", 
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80"
      }
    ],
    stories: [
      { title: "East Village Photo Walk", time: "4 days ago", preview: "Captured morning golden hour across Tompkins Square Park with new friends." }
    ]
  },
  elena_r: {
    id: "elena_r",
    name: "Elena R.",
    handle: "@elena_writes",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    stats: {
      meetupsAttended: 16,
      eventsJoined: 6,
      showUpRating: "100%",
      friendlyVibe: "99%",
      rating: "99%"
    },
    bio: "High school literature teacher and essayist. Love Sunday morning park walks, independent bookstores, and warm table conversations with curious strangers.",
    city: "Manhattan, New York",
    relationship: "Single",
    socialStyle: "Thoughtful & Warm · Great Listener · Deep Conversationalist",
    badges: ["Verified Member", "100% Show-Up (Always Attends)", "Safe Departure Verified (100%)", "Active Community Member"],
    favoriteTopics: ["Books & Poetry", "Park Walks & Dogs", "Art & Theatre", "Coffee Shops"],
    friends: [
      { id: "tom_cruise16", name: "Tom K.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" },
      { id: "chris_brown", name: "Chris Brown", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80" }
    ]
  },
  carl_j: {
    id: "carl_j",
    name: "Carl J.",
    handle: "@carl_builds",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    stats: {
      meetupsAttended: 11,
      eventsJoined: 4,
      showUpRating: "100%",
      friendlyVibe: "98%",
      rating: "98%"
    },
    bio: "Software engineer and board game enthusiast. Big social cocktail parties make me nervous, but 4-person table games and relaxed cafe conversations are my favorite weekend ritual.",
    city: "Brooklyn, New York",
    relationship: "Single",
    socialStyle: "Friendly Introvert · Curious & Relaxed · Quick Humor",
    badges: ["Verified Member", "100% Show-Up (Always Attends)", "Safe Departure Verified (100%)"],
    favoriteTopics: ["Board Games & Fun", "Tech & Gadgets", "Coffee & Cafes", "Urban Biking"],
    friends: [
      { id: "william_stone", name: "William Stone", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80" },
      { id: "luke_vance", name: "Luke Vance", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80" }
    ]
  },
  maya_p: {
    id: "maya_p",
    name: "Maya P.",
    handle: "@maya_creative",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    stats: {
      meetupsAttended: 18,
      eventsJoined: 7,
      showUpRating: "100%",
      friendlyVibe: "99%",
      rating: "99%"
    },
    bio: "Brand strategist and weekend outdoor adventurer. Always down for sunset walks, casual badminton in the park, and trying authentic neighborhood street food.",
    city: "Queens, New York",
    relationship: "Single",
    socialStyle: "Sunny Energy · Welcoming Vibe · Inclusive Host",
    badges: ["Verified Member", "Super Host", "100% Show-Up (Always Attends)", "Safe Departure Verified (100%)"],
    favoriteTopics: ["Outdoor Games", "Design & Brand", "Sunset Walks", "Food & Dining"],
    friends: [
      { id: "tom_cruise16", name: "Tom K.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" },
      { id: "carl_j", name: "Carl J.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" }
    ]
  }
};

const ALL_COUNTRIES_195 = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia (Czech Republic)",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Holy See (Vatican City)",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

const LOCATION_PRESETS = [
  {
    "country": "Afghanistan",
    "states": [
      {
        "name": "Kabul Province",
        "cities": [
          "Kabul"
        ]
      },
      {
        "name": "Herat Province",
        "cities": [
          "Herat"
        ]
      },
      {
        "name": "Balkh Province",
        "cities": [
          "Mazar-i-Sharif"
        ]
      },
      {
        "name": "Kandahar Province",
        "cities": [
          "Kandahar"
        ]
      }
    ]
  },
  {
    "country": "Albania",
    "states": [
      {
        "name": "Tirana County",
        "cities": [
          "Tirana"
        ]
      },
      {
        "name": "Durrës County",
        "cities": [
          "Durrës"
        ]
      },
      {
        "name": "Vlorë County",
        "cities": [
          "Vlorë"
        ]
      },
      {
        "name": "Shkodër County",
        "cities": [
          "Shkodër"
        ]
      }
    ]
  },
  {
    "country": "Algeria",
    "states": [
      {
        "name": "Algiers Province",
        "cities": [
          "Algiers"
        ]
      },
      {
        "name": "Oran Province",
        "cities": [
          "Oran"
        ]
      },
      {
        "name": "Constantine Province",
        "cities": [
          "Constantine"
        ]
      },
      {
        "name": "Annaba Province",
        "cities": [
          "Annaba"
        ]
      }
    ]
  },
  {
    "country": "Andorra",
    "states": [
      {
        "name": "Andorra la Vella",
        "cities": [
          "Andorra la Vella"
        ]
      },
      {
        "name": "Escaldes-Engordany",
        "cities": [
          "Escaldes-Engordany"
        ]
      },
      {
        "name": "Encamp",
        "cities": [
          "Encamp"
        ]
      }
    ]
  },
  {
    "country": "Angola",
    "states": [
      {
        "name": "Luanda Province",
        "cities": [
          "Luanda"
        ]
      },
      {
        "name": "Huambo Province",
        "cities": [
          "Huambo"
        ]
      },
      {
        "name": "Benguela Province",
        "cities": [
          "Benguela",
          "Lobito"
        ]
      }
    ]
  },
  {
    "country": "Antigua and Barbuda",
    "states": [
      {
        "name": "Saint John Parish",
        "cities": [
          "Saint John's"
        ]
      },
      {
        "name": "Barbuda",
        "cities": [
          "Codrington"
        ]
      }
    ]
  },
  {
    "country": "Argentina",
    "states": [
      {
        "name": "Buenos Aires (City)",
        "cities": [
          "Buenos Aires",
          "Palermo",
          "Recoleta",
          "Belgrano"
        ]
      },
      {
        "name": "Buenos Aires Province",
        "cities": [
          "La Plata",
          "Mar del Plata",
          "San Isidro"
        ]
      },
      {
        "name": "Córdoba",
        "cities": [
          "Córdoba",
          "Villa Carlos Paz"
        ]
      },
      {
        "name": "Santa Fe",
        "cities": [
          "Rosario",
          "Santa Fe"
        ]
      },
      {
        "name": "Mendoza",
        "cities": [
          "Mendoza",
          "San Rafael"
        ]
      }
    ]
  },
  {
    "country": "Armenia",
    "states": [
      {
        "name": "Yerevan",
        "cities": [
          "Yerevan"
        ]
      },
      {
        "name": "Shirak Province",
        "cities": [
          "Gyumri"
        ]
      },
      {
        "name": "Lori Province",
        "cities": [
          "Vanadzor"
        ]
      }
    ]
  },
  {
    "country": "Australia",
    "states": [
      {
        "name": "Australian Capital Territory",
        "cities": [
          "Canberra"
        ]
      },
      {
        "name": "New South Wales",
        "cities": [
          "Sydney",
          "Newcastle",
          "Wollongong",
          "Central Coast"
        ]
      },
      {
        "name": "Northern Territory",
        "cities": [
          "Darwin",
          "Alice Springs"
        ]
      },
      {
        "name": "Queensland",
        "cities": [
          "Brisbane",
          "Gold Coast",
          "Cairns",
          "Sunshine Coast",
          "Townsville"
        ]
      },
      {
        "name": "South Australia",
        "cities": [
          "Adelaide",
          "Mount Gambier"
        ]
      },
      {
        "name": "Tasmania",
        "cities": [
          "Hobart",
          "Launceston"
        ]
      },
      {
        "name": "Victoria",
        "cities": [
          "Melbourne",
          "Geelong",
          "Ballarat",
          "Bendigo"
        ]
      },
      {
        "name": "Western Australia",
        "cities": [
          "Perth",
          "Fremantle",
          "Mandurah"
        ]
      }
    ]
  },
  {
    "country": "Austria",
    "states": [
      {
        "name": "Vienna",
        "cities": [
          "Vienna"
        ]
      },
      {
        "name": "Salzburg",
        "cities": [
          "Salzburg"
        ]
      },
      {
        "name": "Tyrol",
        "cities": [
          "Innsbruck",
          "Kitzbühel"
        ]
      },
      {
        "name": "Styria",
        "cities": [
          "Graz"
        ]
      },
      {
        "name": "Upper Austria",
        "cities": [
          "Linz"
        ]
      },
      {
        "name": "Carinthia",
        "cities": [
          "Klagenfurt",
          "Villach"
        ]
      }
    ]
  },
  {
    "country": "Azerbaijan",
    "states": [
      {
        "name": "Baku",
        "cities": [
          "Baku"
        ]
      },
      {
        "name": "Ganja",
        "cities": [
          "Ganja"
        ]
      },
      {
        "name": "Sumqayit",
        "cities": [
          "Sumqayit"
        ]
      }
    ]
  },
  {
    "country": "Bahamas",
    "states": [
      {
        "name": "New Providence",
        "cities": [
          "Nassau"
        ]
      },
      {
        "name": "Grand Bahama",
        "cities": [
          "Freeport"
        ]
      }
    ]
  },
  {
    "country": "Bahrain",
    "states": [
      {
        "name": "Capital Governorate",
        "cities": [
          "Manama"
        ]
      },
      {
        "name": "Muharraq Governorate",
        "cities": [
          "Muharraq"
        ]
      },
      {
        "name": "Southern Governorate",
        "cities": [
          "Riffa"
        ]
      }
    ]
  },
  {
    "country": "Bangladesh",
    "states": [
      {
        "name": "Dhaka Division",
        "cities": [
          "Dhaka",
          "Gazipur"
        ]
      },
      {
        "name": "Chittagong Division",
        "cities": [
          "Chittagong",
          "Cox's Bazar"
        ]
      },
      {
        "name": "Sylhet Division",
        "cities": [
          "Sylhet"
        ]
      },
      {
        "name": "Rajshahi Division",
        "cities": [
          "Rajshahi"
        ]
      }
    ]
  },
  {
    "country": "Barbados",
    "states": [
      {
        "name": "Saint Michael",
        "cities": [
          "Bridgetown"
        ]
      },
      {
        "name": "Christ Church",
        "cities": [
          "Oistins"
        ]
      }
    ]
  },
  {
    "country": "Belarus",
    "states": [
      {
        "name": "Minsk",
        "cities": [
          "Minsk"
        ]
      },
      {
        "name": "Brest Region",
        "cities": [
          "Brest"
        ]
      },
      {
        "name": "Grodno Region",
        "cities": [
          "Grodno"
        ]
      }
    ]
  },
  {
    "country": "Belgium",
    "states": [
      {
        "name": "Brussels-Capital",
        "cities": [
          "Brussels",
          "Ixelles",
          "Saint-Gilles"
        ]
      },
      {
        "name": "Flanders",
        "cities": [
          "Antwerp",
          "Ghent",
          "Bruges",
          "Leuven"
        ]
      },
      {
        "name": "Wallonia",
        "cities": [
          "Liège",
          "Charleroi",
          "Namur",
          "Mons"
        ]
      }
    ]
  },
  {
    "country": "Belize",
    "states": [
      {
        "name": "Belize District",
        "cities": [
          "Belize City"
        ]
      },
      {
        "name": "Cayo District",
        "cities": [
          "Belmopan",
          "San Ignacio"
        ]
      }
    ]
  },
  {
    "country": "Benin",
    "states": [
      {
        "name": "Littoral Department",
        "cities": [
          "Cotonou"
        ]
      },
      {
        "name": "Ouémé Department",
        "cities": [
          "Porto-Novo"
        ]
      }
    ]
  },
  {
    "country": "Bhutan",
    "states": [
      {
        "name": "Thimphu District",
        "cities": [
          "Thimphu"
        ]
      },
      {
        "name": "Paro District",
        "cities": [
          "Paro"
        ]
      }
    ]
  },
  {
    "country": "Bolivia",
    "states": [
      {
        "name": "La Paz Department",
        "cities": [
          "La Paz"
        ]
      },
      {
        "name": "Santa Cruz Department",
        "cities": [
          "Santa Cruz de la Sierra"
        ]
      },
      {
        "name": "Cochabamba Department",
        "cities": [
          "Cochabamba"
        ]
      },
      {
        "name": "Chuquisaca Department",
        "cities": [
          "Sucre"
        ]
      }
    ]
  },
  {
    "country": "Bosnia and Herzegovina",
    "states": [
      {
        "name": "Sarajevo Canton",
        "cities": [
          "Sarajevo"
        ]
      },
      {
        "name": "Republika Srpska",
        "cities": [
          "Banja Luka"
        ]
      },
      {
        "name": "Herzegovina-Neretva",
        "cities": [
          "Mostar"
        ]
      },
      {
        "name": "Tuzla Canton",
        "cities": [
          "Tuzla"
        ]
      }
    ]
  },
  {
    "country": "Botswana",
    "states": [
      {
        "name": "South-East District",
        "cities": [
          "Gaborone"
        ]
      },
      {
        "name": "North-East District",
        "cities": [
          "Francistown"
        ]
      }
    ]
  },
  {
    "country": "Brazil",
    "states": [
      {
        "name": "São Paulo",
        "cities": [
          "São Paulo",
          "Campinas",
          "Santos",
          "São José dos Campos"
        ]
      },
      {
        "name": "Rio de Janeiro",
        "cities": [
          "Rio de Janeiro",
          "Niterói",
          "Petrópolis",
          "Búzios"
        ]
      },
      {
        "name": "Minas Gerais",
        "cities": [
          "Belo Horizonte",
          "Ouro Preto",
          "Uberlândia"
        ]
      },
      {
        "name": "Federal District",
        "cities": [
          "Brasília"
        ]
      },
      {
        "name": "Bahia",
        "cities": [
          "Salvador",
          "Porto Seguro"
        ]
      },
      {
        "name": "Paraná",
        "cities": [
          "Curitiba",
          "Foz do Iguaçu"
        ]
      },
      {
        "name": "Rio Grande do Sul",
        "cities": [
          "Porto Alegre",
          "Gramado"
        ]
      },
      {
        "name": "Santa Catarina",
        "cities": [
          "Florianópolis",
          "Balneário Camboriú"
        ]
      },
      {
        "name": "Ceará",
        "cities": [
          "Fortaleza"
        ]
      },
      {
        "name": "Pernambuco",
        "cities": [
          "Recife",
          "Olinda"
        ]
      }
    ]
  },
  {
    "country": "Brunei",
    "states": [
      {
        "name": "Brunei-Muara District",
        "cities": [
          "Bandar Seri Begawan"
        ]
      },
      {
        "name": "Belait District",
        "cities": [
          "Kuala Belait"
        ]
      }
    ]
  },
  {
    "country": "Bulgaria",
    "states": [
      {
        "name": "Sofia City",
        "cities": [
          "Sofia"
        ]
      },
      {
        "name": "Plovdiv Province",
        "cities": [
          "Plovdiv"
        ]
      },
      {
        "name": "Varna Province",
        "cities": [
          "Varna"
        ]
      },
      {
        "name": "Burgas Province",
        "cities": [
          "Burgas"
        ]
      }
    ]
  },
  {
    "country": "Burkina Faso",
    "states": [
      {
        "name": "Kadiogo Province",
        "cities": [
          "Ouagadougou"
        ]
      },
      {
        "name": "Houet Province",
        "cities": [
          "Bobo-Dioulasso"
        ]
      }
    ]
  },
  {
    "country": "Burundi",
    "states": [
      {
        "name": "Bujumbura Mairie",
        "cities": [
          "Bujumbura"
        ]
      },
      {
        "name": "Gitega Province",
        "cities": [
          "Gitega"
        ]
      }
    ]
  },
  {
    "country": "Cabo Verde",
    "states": [
      {
        "name": "Santiago",
        "cities": [
          "Praia"
        ]
      },
      {
        "name": "São Vicente",
        "cities": [
          "Mindelo"
        ]
      }
    ]
  },
  {
    "country": "Cambodia",
    "states": [
      {
        "name": "Phnom Penh",
        "cities": [
          "Phnom Penh"
        ]
      },
      {
        "name": "Siem Reap Province",
        "cities": [
          "Siem Reap"
        ]
      },
      {
        "name": "Preah Sihanouk",
        "cities": [
          "Sihanoukville"
        ]
      }
    ]
  },
  {
    "country": "Cameroon",
    "states": [
      {
        "name": "Centre Region",
        "cities": [
          "Yaoundé"
        ]
      },
      {
        "name": "Littoral Region",
        "cities": [
          "Douala"
        ]
      }
    ]
  },
  {
    "country": "Canada",
    "states": [
      {
        "name": "Alberta",
        "cities": [
          "Calgary",
          "Edmonton",
          "Red Deer",
          "Banff"
        ]
      },
      {
        "name": "British Columbia",
        "cities": [
          "Vancouver",
          "Victoria",
          "Burnaby",
          "Richmond",
          "Surrey",
          "Kelowna"
        ]
      },
      {
        "name": "Manitoba",
        "cities": [
          "Winnipeg",
          "Brandon"
        ]
      },
      {
        "name": "New Brunswick",
        "cities": [
          "Fredericton",
          "Moncton",
          "Saint John"
        ]
      },
      {
        "name": "Newfoundland and Labrador",
        "cities": [
          "St. John's",
          "Corner Brook"
        ]
      },
      {
        "name": "Northwest Territories",
        "cities": [
          "Yellowknife"
        ]
      },
      {
        "name": "Nova Scotia",
        "cities": [
          "Halifax",
          "Dartmouth",
          "Sydney"
        ]
      },
      {
        "name": "Nunavut",
        "cities": [
          "Iqaluit"
        ]
      },
      {
        "name": "Ontario",
        "cities": [
          "Toronto",
          "Ottawa",
          "Mississauga",
          "Hamilton",
          "London",
          "Brampton",
          "Markham"
        ]
      },
      {
        "name": "Prince Edward Island",
        "cities": [
          "Charlottetown",
          "Summerside"
        ]
      },
      {
        "name": "Quebec",
        "cities": [
          "Montreal",
          "Quebec City",
          "Laval",
          "Gatineau",
          "Sherbrooke"
        ]
      },
      {
        "name": "Saskatchewan",
        "cities": [
          "Saskatoon",
          "Regina"
        ]
      },
      {
        "name": "Yukon",
        "cities": [
          "Whitehorse"
        ]
      }
    ]
  },
  {
    "country": "Central African Republic",
    "states": [
      {
        "name": "Bangui",
        "cities": [
          "Bangui"
        ]
      }
    ]
  },
  {
    "country": "Chad",
    "states": [
      {
        "name": "N'Djamena",
        "cities": [
          "N'Djamena"
        ]
      }
    ]
  },
  {
    "country": "Chile",
    "states": [
      {
        "name": "Santiago Metropolitan",
        "cities": [
          "Santiago",
          "Providencia",
          "Las Condes",
          "Vitacura"
        ]
      },
      {
        "name": "Valparaíso",
        "cities": [
          "Valparaíso",
          "Viña del Mar"
        ]
      },
      {
        "name": "Biobío",
        "cities": [
          "Concepción"
        ]
      },
      {
        "name": "Los Lagos",
        "cities": [
          "Puerto Montt",
          "Puerto Varas"
        ]
      }
    ]
  },
  {
    "country": "China",
    "states": [
      {
        "name": "Beijing",
        "cities": [
          "Beijing",
          "Chaoyang",
          "Haidian"
        ]
      },
      {
        "name": "Shanghai",
        "cities": [
          "Shanghai",
          "Pudong",
          "Jing'an",
          "Huangpu"
        ]
      },
      {
        "name": "Guangdong",
        "cities": [
          "Guangzhou",
          "Shenzhen",
          "Dongguan",
          "Foshan"
        ]
      },
      {
        "name": "Zhejiang",
        "cities": [
          "Hangzhou",
          "Ningbo",
          "Wenzhou"
        ]
      },
      {
        "name": "Jiangsu",
        "cities": [
          "Nanjing",
          "Suzhou",
          "Wuxi"
        ]
      },
      {
        "name": "Sichuan",
        "cities": [
          "Chengdu"
        ]
      },
      {
        "name": "Shandong",
        "cities": [
          "Qingdao",
          "Jinan"
        ]
      },
      {
        "name": "Hubei",
        "cities": [
          "Wuhan"
        ]
      },
      {
        "name": "Shaanxi",
        "cities": [
          "Xi'an"
        ]
      },
      {
        "name": "Chongqing",
        "cities": [
          "Chongqing"
        ]
      },
      {
        "name": "Tianjin",
        "cities": [
          "Tianjin"
        ]
      },
      {
        "name": "Fujian",
        "cities": [
          "Xiamen",
          "Fuzhou"
        ]
      }
    ]
  },
  {
    "country": "Colombia",
    "states": [
      {
        "name": "Bogotá D.C.",
        "cities": [
          "Bogotá",
          "Chapinero",
          "Usaquén"
        ]
      },
      {
        "name": "Antioquia",
        "cities": [
          "Medellín",
          "El Poblado",
          "Laureles",
          "Envigado"
        ]
      },
      {
        "name": "Valle del Cauca",
        "cities": [
          "Cali"
        ]
      },
      {
        "name": "Bolívar",
        "cities": [
          "Cartagena"
        ]
      },
      {
        "name": "Atlántico",
        "cities": [
          "Barranquilla"
        ]
      }
    ]
  },
  {
    "country": "Comoros",
    "states": [
      {
        "name": "Grande Comore",
        "cities": [
          "Moroni"
        ]
      }
    ]
  },
  {
    "country": "Congo (Congo-Brazzaville)",
    "states": [
      {
        "name": "Brazzaville",
        "cities": [
          "Brazzaville"
        ]
      },
      {
        "name": "Pointe-Noire",
        "cities": [
          "Pointe-Noire"
        ]
      }
    ]
  },
  {
    "country": "Costa Rica",
    "states": [
      {
        "name": "San José Province",
        "cities": [
          "San José",
          "Escazú",
          "Santa Ana"
        ]
      },
      {
        "name": "Alajuela Province",
        "cities": [
          "Alajuela"
        ]
      },
      {
        "name": "Heredia Province",
        "cities": [
          "Heredia"
        ]
      },
      {
        "name": "Guanacaste Province",
        "cities": [
          "Liberia",
          "Tamarindo"
        ]
      }
    ]
  },
  {
    "country": "Croatia",
    "states": [
      {
        "name": "City of Zagreb",
        "cities": [
          "Zagreb"
        ]
      },
      {
        "name": "Split-Dalmatia",
        "cities": [
          "Split"
        ]
      },
      {
        "name": "Dubrovnik-Neretva",
        "cities": [
          "Dubrovnik"
        ]
      },
      {
        "name": "Primorje-Gorski Kotar",
        "cities": [
          "Rijeka"
        ]
      },
      {
        "name": "Istria County",
        "cities": [
          "Pula",
          "Rovinj"
        ]
      }
    ]
  },
  {
    "country": "Cuba",
    "states": [
      {
        "name": "Havana",
        "cities": [
          "Havana"
        ]
      },
      {
        "name": "Santiago de Cuba Province",
        "cities": [
          "Santiago de Cuba"
        ]
      }
    ]
  },
  {
    "country": "Cyprus",
    "states": [
      {
        "name": "Nicosia District",
        "cities": [
          "Nicosia"
        ]
      },
      {
        "name": "Limassol District",
        "cities": [
          "Limassol"
        ]
      },
      {
        "name": "Larnaca District",
        "cities": [
          "Larnaca"
        ]
      },
      {
        "name": "Paphos District",
        "cities": [
          "Paphos"
        ]
      }
    ]
  },
  {
    "country": "Czechia (Czech Republic)",
    "states": [
      {
        "name": "Prague",
        "cities": [
          "Prague"
        ]
      },
      {
        "name": "South Moravian",
        "cities": [
          "Brno"
        ]
      },
      {
        "name": "Moravian-Silesian",
        "cities": [
          "Ostrava"
        ]
      },
      {
        "name": "Plzeň",
        "cities": [
          "Plzeň"
        ]
      }
    ]
  },
  {
    "country": "Democratic Republic of the Congo",
    "states": [
      {
        "name": "Kinshasa",
        "cities": [
          "Kinshasa"
        ]
      },
      {
        "name": "Haut-Katanga",
        "cities": [
          "Lubumbashi"
        ]
      },
      {
        "name": "North Kivu",
        "cities": [
          "Goma"
        ]
      }
    ]
  },
  {
    "country": "Denmark",
    "states": [
      {
        "name": "Capital Region",
        "cities": [
          "Copenhagen",
          "Frederiksberg",
          "Helsingør"
        ]
      },
      {
        "name": "Central Denmark",
        "cities": [
          "Aarhus",
          "Randers"
        ]
      },
      {
        "name": "Region of Southern Denmark",
        "cities": [
          "Odense",
          "Esbjerg",
          "Vejle"
        ]
      },
      {
        "name": "North Denmark",
        "cities": [
          "Aalborg"
        ]
      }
    ]
  },
  {
    "country": "Djibouti",
    "states": [
      {
        "name": "Djibouti Region",
        "cities": [
          "Djibouti"
        ]
      }
    ]
  },
  {
    "country": "Dominica",
    "states": [
      {
        "name": "Saint George Parish",
        "cities": [
          "Roseau"
        ]
      }
    ]
  },
  {
    "country": "Dominican Republic",
    "states": [
      {
        "name": "Distrito Nacional",
        "cities": [
          "Santo Domingo"
        ]
      },
      {
        "name": "Santiago Province",
        "cities": [
          "Santiago de los Caballeros"
        ]
      },
      {
        "name": "La Altagracia",
        "cities": [
          "Punta Cana"
        ]
      }
    ]
  },
  {
    "country": "Ecuador",
    "states": [
      {
        "name": "Pichincha",
        "cities": [
          "Quito"
        ]
      },
      {
        "name": "Guayas",
        "cities": [
          "Guayaquil"
        ]
      },
      {
        "name": "Azuay",
        "cities": [
          "Cuenca"
        ]
      }
    ]
  },
  {
    "country": "Egypt",
    "states": [
      {
        "name": "Cairo Governorate",
        "cities": [
          "Cairo",
          "New Cairo",
          "Heliopolis",
          "Maadi",
          "Zamalek"
        ]
      },
      {
        "name": "Alexandria Governorate",
        "cities": [
          "Alexandria"
        ]
      },
      {
        "name": "Giza Governorate",
        "cities": [
          "Giza",
          "6th of October City",
          "Sheikh Zayed"
        ]
      },
      {
        "name": "Red Sea Governorate",
        "cities": [
          "Hurghada",
          "El Gouna"
        ]
      },
      {
        "name": "South Sinai Governorate",
        "cities": [
          "Sharm El Sheikh",
          "Dahab"
        ]
      }
    ]
  },
  {
    "country": "El Salvador",
    "states": [
      {
        "name": "San Salvador Department",
        "cities": [
          "San Salvador"
        ]
      },
      {
        "name": "Santa Ana Department",
        "cities": [
          "Santa Ana"
        ]
      }
    ]
  },
  {
    "country": "Equatorial Guinea",
    "states": [
      {
        "name": "Bioko Norte",
        "cities": [
          "Malabo"
        ]
      },
      {
        "name": "Litoral",
        "cities": [
          "Bata"
        ]
      }
    ]
  },
  {
    "country": "Eritrea",
    "states": [
      {
        "name": "Maekel Region",
        "cities": [
          "Asmara"
        ]
      }
    ]
  },
  {
    "country": "Estonia",
    "states": [
      {
        "name": "Harju County",
        "cities": [
          "Tallinn"
        ]
      },
      {
        "name": "Tartu County",
        "cities": [
          "Tartu"
        ]
      },
      {
        "name": "Pärnu County",
        "cities": [
          "Pärnu"
        ]
      }
    ]
  },
  {
    "country": "Eswatini",
    "states": [
      {
        "name": "Hhohho Region",
        "cities": [
          "Mbabane"
        ]
      },
      {
        "name": "Manzini Region",
        "cities": [
          "Manzini"
        ]
      }
    ]
  },
  {
    "country": "Ethiopia",
    "states": [
      {
        "name": "Addis Ababa",
        "cities": [
          "Addis Ababa"
        ]
      },
      {
        "name": "Dire Dawa",
        "cities": [
          "Dire Dawa"
        ]
      }
    ]
  },
  {
    "country": "Fiji",
    "states": [
      {
        "name": "Central Division",
        "cities": [
          "Suva"
        ]
      },
      {
        "name": "Western Division",
        "cities": [
          "Nadi",
          "Lautoka"
        ]
      }
    ]
  },
  {
    "country": "Finland",
    "states": [
      {
        "name": "Uusimaa",
        "cities": [
          "Helsinki",
          "Espoo",
          "Vantaa"
        ]
      },
      {
        "name": "Pirkanmaa",
        "cities": [
          "Tampere"
        ]
      },
      {
        "name": "Southwest Finland",
        "cities": [
          "Turku"
        ]
      },
      {
        "name": "North Ostrobothnia",
        "cities": [
          "Oulu"
        ]
      }
    ]
  },
  {
    "country": "France",
    "states": [
      {
        "name": "Auvergne-Rhône-Alpes",
        "cities": [
          "Lyon",
          "Grenoble",
          "Saint-Étienne",
          "Clermont-Ferrand",
          "Annecy"
        ]
      },
      {
        "name": "Bourgogne-Franche-Comté",
        "cities": [
          "Dijon",
          "Besançon"
        ]
      },
      {
        "name": "Brittany",
        "cities": [
          "Rennes",
          "Brest"
        ]
      },
      {
        "name": "Centre-Val de Loire",
        "cities": [
          "Tours",
          "Orléans"
        ]
      },
      {
        "name": "Corsica",
        "cities": [
          "Ajaccio",
          "Bastia"
        ]
      },
      {
        "name": "Grand Est",
        "cities": [
          "Strasbourg",
          "Reims",
          "Metz",
          "Nancy"
        ]
      },
      {
        "name": "Hauts-de-France",
        "cities": [
          "Lille",
          "Amiens"
        ]
      },
      {
        "name": "Île-de-France",
        "cities": [
          "Paris",
          "Boulogne-Billancourt",
          "Saint-Denis",
          "Versailles"
        ]
      },
      {
        "name": "Normandy",
        "cities": [
          "Rouen",
          "Le Havre",
          "Caen"
        ]
      },
      {
        "name": "Nouvelle-Aquitaine",
        "cities": [
          "Bordeaux",
          "Limoges",
          "Poitiers",
          "Biarritz"
        ]
      },
      {
        "name": "Occitanie",
        "cities": [
          "Toulouse",
          "Montpellier",
          "Nîmes",
          "Perpignan"
        ]
      },
      {
        "name": "Pays de la Loire",
        "cities": [
          "Nantes",
          "Angers",
          "Le Mans"
        ]
      },
      {
        "name": "Provence-Alpes-Côte d'Azur",
        "cities": [
          "Marseille",
          "Nice",
          "Toulon",
          "Cannes",
          "Aix-en-Provence"
        ]
      }
    ]
  },
  {
    "country": "Gabon",
    "states": [
      {
        "name": "Estuaire Province",
        "cities": [
          "Libreville"
        ]
      },
      {
        "name": "Ogooué-Maritime",
        "cities": [
          "Port-Gentil"
        ]
      }
    ]
  },
  {
    "country": "Gambia",
    "states": [
      {
        "name": "Banjul",
        "cities": [
          "Banjul"
        ]
      },
      {
        "name": "Kanifing",
        "cities": [
          "Serekunda"
        ]
      }
    ]
  },
  {
    "country": "Georgia",
    "states": [
      {
        "name": "Tbilisi",
        "cities": [
          "Tbilisi"
        ]
      },
      {
        "name": "Adjara",
        "cities": [
          "Batumi"
        ]
      },
      {
        "name": "Imereti",
        "cities": [
          "Kutaisi"
        ]
      }
    ]
  },
  {
    "country": "Germany",
    "states": [
      {
        "name": "Baden-Württemberg",
        "cities": [
          "Stuttgart",
          "Mannheim",
          "Karlsruhe",
          "Heidelberg",
          "Freiburg"
        ]
      },
      {
        "name": "Bavaria",
        "cities": [
          "Munich",
          "Nuremberg",
          "Augsburg",
          "Würzburg",
          "Regensburg"
        ]
      },
      {
        "name": "Berlin",
        "cities": [
          "Berlin"
        ]
      },
      {
        "name": "Brandenburg",
        "cities": [
          "Potsdam",
          "Cottbus"
        ]
      },
      {
        "name": "Bremen",
        "cities": [
          "Bremen",
          "Bremerhaven"
        ]
      },
      {
        "name": "Hamburg",
        "cities": [
          "Hamburg"
        ]
      },
      {
        "name": "Hesse",
        "cities": [
          "Frankfurt",
          "Wiesbaden",
          "Kassel",
          "Darmstadt"
        ]
      },
      {
        "name": "Lower Saxony",
        "cities": [
          "Hanover",
          "Braunschweig",
          "Oldenburg",
          "Osnabrück"
        ]
      },
      {
        "name": "Mecklenburg-Vorpommern",
        "cities": [
          "Rostock",
          "Schwerin"
        ]
      },
      {
        "name": "North Rhine-Westphalia",
        "cities": [
          "Cologne",
          "Düsseldorf",
          "Dortmund",
          "Essen",
          "Bonn",
          "Münster"
        ]
      },
      {
        "name": "Rhineland-Palatinate",
        "cities": [
          "Mainz",
          "Ludwigshafen",
          "Koblenz",
          "Trier"
        ]
      },
      {
        "name": "Saarland",
        "cities": [
          "Saarbrücken"
        ]
      },
      {
        "name": "Saxony",
        "cities": [
          "Leipzig",
          "Dresden",
          "Chemnitz"
        ]
      },
      {
        "name": "Saxony-Anhalt",
        "cities": [
          "Magdeburg",
          "Halle"
        ]
      },
      {
        "name": "Schleswig-Holstein",
        "cities": [
          "Kiel",
          "Lübeck",
          "Flensburg"
        ]
      },
      {
        "name": "Thuringia",
        "cities": [
          "Erfurt",
          "Jena",
          "Weimar"
        ]
      }
    ]
  },
  {
    "country": "Ghana",
    "states": [
      {
        "name": "Greater Accra Region",
        "cities": [
          "Accra",
          "Tema"
        ]
      },
      {
        "name": "Ashanti Region",
        "cities": [
          "Kumasi"
        ]
      },
      {
        "name": "Western Region",
        "cities": [
          "Sekondi-Takoradi"
        ]
      }
    ]
  },
  {
    "country": "Greece",
    "states": [
      {
        "name": "Attica",
        "cities": [
          "Athens",
          "Piraeus",
          "Glyfada",
          "Kifisia"
        ]
      },
      {
        "name": "Central Macedonia",
        "cities": [
          "Thessaloniki"
        ]
      },
      {
        "name": "Crete",
        "cities": [
          "Heraklion",
          "Chania",
          "Rethymno"
        ]
      },
      {
        "name": "South Aegean",
        "cities": [
          "Mykonos",
          "Santorini",
          "Rhodes"
        ]
      },
      {
        "name": "Ionian Islands",
        "cities": [
          "Corfu"
        ]
      }
    ]
  },
  {
    "country": "Grenada",
    "states": [
      {
        "name": "Saint George Parish",
        "cities": [
          "St. George's"
        ]
      }
    ]
  },
  {
    "country": "Guatemala",
    "states": [
      {
        "name": "Guatemala Department",
        "cities": [
          "Guatemala City"
        ]
      },
      {
        "name": "Sacatepéquez",
        "cities": [
          "Antigua Guatemala"
        ]
      }
    ]
  },
  {
    "country": "Guinea",
    "states": [
      {
        "name": "Conakry",
        "cities": [
          "Conakry"
        ]
      }
    ]
  },
  {
    "country": "Guinea-Bissau",
    "states": [
      {
        "name": "Bissau Region",
        "cities": [
          "Bissau"
        ]
      }
    ]
  },
  {
    "country": "Guyana",
    "states": [
      {
        "name": "Demerara-Mahaica",
        "cities": [
          "Georgetown"
        ]
      }
    ]
  },
  {
    "country": "Haiti",
    "states": [
      {
        "name": "Ouest Department",
        "cities": [
          "Port-au-Prince"
        ]
      },
      {
        "name": "Nord Department",
        "cities": [
          "Cap-Haïtien"
        ]
      }
    ]
  },
  {
    "country": "Holy See (Vatican City)",
    "states": [
      {
        "name": "Vatican City State",
        "cities": [
          "Vatican City"
        ]
      }
    ]
  },
  {
    "country": "Honduras",
    "states": [
      {
        "name": "Francisco Morazán",
        "cities": [
          "Tegucigalpa"
        ]
      },
      {
        "name": "Cortés Department",
        "cities": [
          "San Pedro Sula"
        ]
      }
    ]
  },
  {
    "country": "Hungary",
    "states": [
      {
        "name": "Budapest",
        "cities": [
          "Budapest"
        ]
      },
      {
        "name": "Pest",
        "cities": [
          "Érd",
          "Dunakeszi"
        ]
      },
      {
        "name": "Csongrád-Csanád",
        "cities": [
          "Szeged"
        ]
      },
      {
        "name": "Hajdú-Bihar",
        "cities": [
          "Debrecen"
        ]
      }
    ]
  },
  {
    "country": "Iceland",
    "states": [
      {
        "name": "Capital Region",
        "cities": [
          "Reykjavík",
          "Kópavogur",
          "Hafnarfjörður"
        ]
      },
      {
        "name": "Northeastern Region",
        "cities": [
          "Akureyri"
        ]
      }
    ]
  },
  {
    "country": "India",
    "states": [
      {
        "name": "Andhra Pradesh",
        "cities": [
          "Visakhapatnam",
          "Vijayawada",
          "Guntur"
        ]
      },
      {
        "name": "Assam",
        "cities": [
          "Guwahati",
          "Silchar"
        ]
      },
      {
        "name": "Bihar",
        "cities": [
          "Patna",
          "Gaya"
        ]
      },
      {
        "name": "Chandigarh",
        "cities": [
          "Chandigarh"
        ]
      },
      {
        "name": "Chhattisgarh",
        "cities": [
          "Raipur",
          "Bhilai"
        ]
      },
      {
        "name": "Delhi (NCR)",
        "cities": [
          "New Delhi",
          "Delhi",
          "Noida",
          "Gurugram",
          "Faridabad",
          "Ghaziabad"
        ]
      },
      {
        "name": "Goa",
        "cities": [
          "Panaji",
          "Margao"
        ]
      },
      {
        "name": "Gujarat",
        "cities": [
          "Ahmedabad",
          "Surat",
          "Vadodara",
          "Rajkot"
        ]
      },
      {
        "name": "Haryana",
        "cities": [
          "Gurugram",
          "Faridabad",
          "Panipat"
        ]
      },
      {
        "name": "Himachal Pradesh",
        "cities": [
          "Shimla",
          "Dharamshala",
          "Manali"
        ]
      },
      {
        "name": "Jammu and Kashmir",
        "cities": [
          "Srinagar",
          "Jammu"
        ]
      },
      {
        "name": "Jharkhand",
        "cities": [
          "Ranchi",
          "Jamshedpur"
        ]
      },
      {
        "name": "Karnataka",
        "cities": [
          "Bengaluru",
          "Bangalore",
          "Mysuru",
          "Mangaluru",
          "Hubli"
        ]
      },
      {
        "name": "Kerala",
        "cities": [
          "Thiruvananthapuram",
          "Kochi",
          "Kozhikode"
        ]
      },
      {
        "name": "Madhya Pradesh",
        "cities": [
          "Bhopal",
          "Indore",
          "Gwalior"
        ]
      },
      {
        "name": "Maharashtra",
        "cities": [
          "Mumbai",
          "Pune",
          "Nagpur",
          "Thane",
          "Nashik"
        ]
      },
      {
        "name": "Odisha",
        "cities": [
          "Bhubaneswar",
          "Cuttack"
        ]
      },
      {
        "name": "Punjab",
        "cities": [
          "Ludhiana",
          "Amritsar",
          "Jalandhar"
        ]
      },
      {
        "name": "Rajasthan",
        "cities": [
          "Jaipur",
          "Jodhpur",
          "Udaipur",
          "Kota"
        ]
      },
      {
        "name": "Tamil Nadu",
        "cities": [
          "Chennai",
          "Coimbatore",
          "Madurai",
          "Salem"
        ]
      },
      {
        "name": "Telangana",
        "cities": [
          "Hyderabad",
          "Warangal"
        ]
      },
      {
        "name": "Uttar Pradesh",
        "cities": [
          "Lucknow",
          "Kanpur",
          "Varanasi",
          "Agra",
          "Prayagraj"
        ]
      },
      {
        "name": "Uttarakhand",
        "cities": [
          "Dehradun",
          "Haridwar",
          "Rishikesh"
        ]
      },
      {
        "name": "West Bengal",
        "cities": [
          "Kolkata",
          "Howrah",
          "Siliguri",
          "Darjeeling"
        ]
      }
    ]
  },
  {
    "country": "Indonesia",
    "states": [
      {
        "name": "Jakarta",
        "cities": [
          "Jakarta",
          "Central Jakarta",
          "South Jakarta"
        ]
      },
      {
        "name": "West Java",
        "cities": [
          "Bandung",
          "Bekasi",
          "Depok",
          "Bogor"
        ]
      },
      {
        "name": "Bali",
        "cities": [
          "Denpasar",
          "Ubud",
          "Kuta",
          "Seminyak",
          "Canggu"
        ]
      },
      {
        "name": "East Java",
        "cities": [
          "Surabaya",
          "Malang"
        ]
      },
      {
        "name": "Central Java",
        "cities": [
          "Semarang",
          "Surakarta (Solo)"
        ]
      },
      {
        "name": "Special Region of Yogyakarta",
        "cities": [
          "Yogyakarta"
        ]
      },
      {
        "name": "North Sumatra",
        "cities": [
          "Medan"
        ]
      }
    ]
  },
  {
    "country": "Iran",
    "states": [
      {
        "name": "Tehran Province",
        "cities": [
          "Tehran"
        ]
      },
      {
        "name": "Isfahan Province",
        "cities": [
          "Isfahan"
        ]
      },
      {
        "name": "Fars Province",
        "cities": [
          "Shiraz"
        ]
      },
      {
        "name": "Razavi Khorasan",
        "cities": [
          "Mashhad"
        ]
      }
    ]
  },
  {
    "country": "Iraq",
    "states": [
      {
        "name": "Baghdad Governorate",
        "cities": [
          "Baghdad"
        ]
      },
      {
        "name": "Erbil Governorate",
        "cities": [
          "Erbil"
        ]
      },
      {
        "name": "Basra Governorate",
        "cities": [
          "Basra"
        ]
      }
    ]
  },
  {
    "country": "Ireland",
    "states": [
      {
        "name": "Leinster",
        "cities": [
          "Dublin",
          "Dún Laoghaire",
          "Kilkenny",
          "Drogheda"
        ]
      },
      {
        "name": "Munster",
        "cities": [
          "Cork",
          "Limerick",
          "Waterford",
          "Killarney"
        ]
      },
      {
        "name": "Connacht",
        "cities": [
          "Galway",
          "Sligo"
        ]
      },
      {
        "name": "Ulster (ROI)",
        "cities": [
          "Letterkenny",
          "Monaghan",
          "Cavan"
        ]
      }
    ]
  },
  {
    "country": "Israel",
    "states": [
      {
        "name": "Tel Aviv District",
        "cities": [
          "Tel Aviv",
          "Ramat Gan",
          "Herzliya",
          "Holon"
        ]
      },
      {
        "name": "Jerusalem District",
        "cities": [
          "Jerusalem"
        ]
      },
      {
        "name": "Central District",
        "cities": [
          "Rishon LeZion",
          "Petah Tikva",
          "Netanya"
        ]
      },
      {
        "name": "Haifa District",
        "cities": [
          "Haifa"
        ]
      }
    ]
  },
  {
    "country": "Italy",
    "states": [
      {
        "name": "Abruzzo",
        "cities": [
          "L'Aquila",
          "Pescara"
        ]
      },
      {
        "name": "Apulia",
        "cities": [
          "Bari",
          "Lecce"
        ]
      },
      {
        "name": "Campania",
        "cities": [
          "Naples",
          "Salerno",
          "Amalfi"
        ]
      },
      {
        "name": "Emilia-Romagna",
        "cities": [
          "Bologna",
          "Parma",
          "Modena",
          "Rimini"
        ]
      },
      {
        "name": "Lazio",
        "cities": [
          "Rome",
          "Viterbo",
          "Latina"
        ]
      },
      {
        "name": "Liguria",
        "cities": [
          "Genoa",
          "La Spezia",
          "Sanremo"
        ]
      },
      {
        "name": "Lombardy",
        "cities": [
          "Milan",
          "Bergamo",
          "Brescia",
          "Como",
          "Monza"
        ]
      },
      {
        "name": "Piedmont",
        "cities": [
          "Turin",
          "Novara",
          "Asti"
        ]
      },
      {
        "name": "Sardinia",
        "cities": [
          "Cagliari",
          "Sassari"
        ]
      },
      {
        "name": "Sicily",
        "cities": [
          "Palermo",
          "Catania",
          "Syracuse",
          "Taormina"
        ]
      },
      {
        "name": "Tuscany",
        "cities": [
          "Florence",
          "Pisa",
          "Siena",
          "Lucca",
          "Arezzo"
        ]
      },
      {
        "name": "Trentino-Alto Adige",
        "cities": [
          "Trento",
          "Bolzano"
        ]
      },
      {
        "name": "Umbria",
        "cities": [
          "Perugia",
          "Assisi"
        ]
      },
      {
        "name": "Veneto",
        "cities": [
          "Venice",
          "Verona",
          "Padua",
          "Vicenza",
          "Treviso"
        ]
      }
    ]
  },
  {
    "country": "Ivory Coast",
    "states": [
      {
        "name": "Abidjan Autonomous District",
        "cities": [
          "Abidjan"
        ]
      },
      {
        "name": "Yamoussoukro",
        "cities": [
          "Yamoussoukro"
        ]
      }
    ]
  },
  {
    "country": "Jamaica",
    "states": [
      {
        "name": "Kingston Parish",
        "cities": [
          "Kingston"
        ]
      },
      {
        "name": "Saint James Parish",
        "cities": [
          "Montego Bay"
        ]
      }
    ]
  },
  {
    "country": "Japan",
    "states": [
      {
        "name": "Tokyo",
        "cities": [
          "Tokyo",
          "Shinjuku",
          "Shibuya",
          "Ginza",
          "Roppongi",
          "Akihabara"
        ]
      },
      {
        "name": "Osaka",
        "cities": [
          "Osaka",
          "Sakai",
          "Umeda",
          "Namba"
        ]
      },
      {
        "name": "Kyoto",
        "cities": [
          "Kyoto",
          "Uji"
        ]
      },
      {
        "name": "Kanagawa",
        "cities": [
          "Yokohama",
          "Kawasaki",
          "Kamakura"
        ]
      },
      {
        "name": "Aichi",
        "cities": [
          "Nagoya"
        ]
      },
      {
        "name": "Fukuoka",
        "cities": [
          "Fukuoka",
          "Kitakyushu"
        ]
      },
      {
        "name": "Hokkaido",
        "cities": [
          "Sapporo",
          "Hakodate",
          "Otaru"
        ]
      },
      {
        "name": "Hyogo",
        "cities": [
          "Kobe",
          "Himeji"
        ]
      },
      {
        "name": "Chiba",
        "cities": [
          "Chiba",
          "Narita"
        ]
      },
      {
        "name": "Saitama",
        "cities": [
          "Saitama",
          "Kawagoe"
        ]
      },
      {
        "name": "Hiroshima",
        "cities": [
          "Hiroshima"
        ]
      },
      {
        "name": "Okinawa",
        "cities": [
          "Naha",
          "Okinawa City"
        ]
      }
    ]
  },
  {
    "country": "Jordan",
    "states": [
      {
        "name": "Amman Governorate",
        "cities": [
          "Amman"
        ]
      },
      {
        "name": "Aqaba Governorate",
        "cities": [
          "Aqaba"
        ]
      },
      {
        "name": "Irbid Governorate",
        "cities": [
          "Irbid"
        ]
      }
    ]
  },
  {
    "country": "Kazakhstan",
    "states": [
      {
        "name": "Almaty",
        "cities": [
          "Almaty"
        ]
      },
      {
        "name": "Astana",
        "cities": [
          "Astana"
        ]
      },
      {
        "name": "Shymkent",
        "cities": [
          "Shymkent"
        ]
      }
    ]
  },
  {
    "country": "Kenya",
    "states": [
      {
        "name": "Capital Region",
        "cities": [
          "Capital City"
        ]
      }
    ]
  },
  {
    "country": "Kiribati",
    "states": [
      {
        "name": "Gilbert Islands",
        "cities": [
          "South Tarawa"
        ]
      }
    ]
  },
  {
    "country": "Kuwait",
    "states": [
      {
        "name": "Capital Governorate",
        "cities": [
          "Kuwait City"
        ]
      },
      {
        "name": "Hawalli Governorate",
        "cities": [
          "Hawalli",
          "Salmiya"
        ]
      },
      {
        "name": "Farwaniya Governorate",
        "cities": [
          "Farwaniya"
        ]
      }
    ]
  },
  {
    "country": "Kyrgyzstan",
    "states": [
      {
        "name": "Bishkek",
        "cities": [
          "Bishkek"
        ]
      },
      {
        "name": "Osh",
        "cities": [
          "Osh"
        ]
      }
    ]
  },
  {
    "country": "Laos",
    "states": [
      {
        "name": "Vientiane Prefecture",
        "cities": [
          "Vientiane"
        ]
      },
      {
        "name": "Luang Prabang Province",
        "cities": [
          "Luang Prabang"
        ]
      }
    ]
  },
  {
    "country": "Latvia",
    "states": [
      {
        "name": "Riga",
        "cities": [
          "Riga"
        ]
      },
      {
        "name": "Daugavpils",
        "cities": [
          "Daugavpils"
        ]
      },
      {
        "name": "Jūrmala",
        "cities": [
          "Jūrmala"
        ]
      }
    ]
  },
  {
    "country": "Lebanon",
    "states": [
      {
        "name": "Beirut Governorate",
        "cities": [
          "Beirut"
        ]
      },
      {
        "name": "Mount Lebanon",
        "cities": [
          "Byblos",
          "Jounieh"
        ]
      },
      {
        "name": "North Governorate",
        "cities": [
          "Tripoli"
        ]
      }
    ]
  },
  {
    "country": "Lesotho",
    "states": [
      {
        "name": "Maseru District",
        "cities": [
          "Maseru"
        ]
      }
    ]
  },
  {
    "country": "Liberia",
    "states": [
      {
        "name": "Montserrado County",
        "cities": [
          "Monrovia"
        ]
      }
    ]
  },
  {
    "country": "Libya",
    "states": [
      {
        "name": "Tripoli District",
        "cities": [
          "Tripoli"
        ]
      },
      {
        "name": "Benghazi District",
        "cities": [
          "Benghazi"
        ]
      }
    ]
  },
  {
    "country": "Liechtenstein",
    "states": [
      {
        "name": "Oberland",
        "cities": [
          "Vaduz"
        ]
      },
      {
        "name": "Unterland",
        "cities": [
          "Schaan",
          "Eschen"
        ]
      }
    ]
  },
  {
    "country": "Lithuania",
    "states": [
      {
        "name": "Vilnius County",
        "cities": [
          "Vilnius"
        ]
      },
      {
        "name": "Kaunas County",
        "cities": [
          "Kaunas"
        ]
      },
      {
        "name": "Klaipėda County",
        "cities": [
          "Klaipėda"
        ]
      }
    ]
  },
  {
    "country": "Luxembourg",
    "states": [
      {
        "name": "Luxembourg Canton",
        "cities": [
          "Luxembourg City"
        ]
      },
      {
        "name": "Esch-sur-Alzette Canton",
        "cities": [
          "Esch-sur-Alzette"
        ]
      }
    ]
  },
  {
    "country": "Madagascar",
    "states": [
      {
        "name": "Analamanga",
        "cities": [
          "Antananarivo"
        ]
      },
      {
        "name": "Atsinanana",
        "cities": [
          "Toamasina"
        ]
      }
    ]
  },
  {
    "country": "Malawi",
    "states": [
      {
        "name": "Central Region",
        "cities": [
          "Lilongwe"
        ]
      },
      {
        "name": "Southern Region",
        "cities": [
          "Blantyre"
        ]
      }
    ]
  },
  {
    "country": "Malaysia",
    "states": [
      {
        "name": "Kuala Lumpur",
        "cities": [
          "Kuala Lumpur",
          "Mont Kiara",
          "Bangsar",
          "KLCC"
        ]
      },
      {
        "name": "Selangor",
        "cities": [
          "Petaling Jaya",
          "Shah Alam",
          "Subang Jaya"
        ]
      },
      {
        "name": "Penang",
        "cities": [
          "George Town",
          "Batu Ferringhi"
        ]
      },
      {
        "name": "Johor",
        "cities": [
          "Johor Bahru"
        ]
      },
      {
        "name": "Sabah",
        "cities": [
          "Kota Kinabalu"
        ]
      },
      {
        "name": "Sarawak",
        "cities": [
          "Kuching"
        ]
      }
    ]
  },
  {
    "country": "Maldives",
    "states": [
      {
        "name": "Malé Atoll",
        "cities": [
          "Malé",
          "Hulhumalé"
        ]
      }
    ]
  },
  {
    "country": "Mali",
    "states": [
      {
        "name": "Bamako Capital District",
        "cities": [
          "Bamako"
        ]
      }
    ]
  },
  {
    "country": "Malta",
    "states": [
      {
        "name": "Southern Harbour",
        "cities": [
          "Valletta"
        ]
      },
      {
        "name": "Northern Harbour",
        "cities": [
          "Sliema",
          "St. Julian's",
          "Birkirkara"
        ]
      }
    ]
  },
  {
    "country": "Marshall Islands",
    "states": [
      {
        "name": "Majuro Atoll",
        "cities": [
          "Majuro"
        ]
      }
    ]
  },
  {
    "country": "Mauritania",
    "states": [
      {
        "name": "Nouakchott",
        "cities": [
          "Nouakchott"
        ]
      }
    ]
  },
  {
    "country": "Mauritius",
    "states": [
      {
        "name": "Port Louis District",
        "cities": [
          "Port Louis"
        ]
      },
      {
        "name": "Rivière du Rempart",
        "cities": [
          "Grand Baie"
        ]
      },
      {
        "name": "Plaines Wilhems",
        "cities": [
          "Beau Bassin-Rose Hill"
        ]
      }
    ]
  },
  {
    "country": "Mexico",
    "states": [
      {
        "name": "Mexico City (CDMX)",
        "cities": [
          "Mexico City",
          "Polanco",
          "Roma",
          "Condesa",
          "Coyoacán"
        ]
      },
      {
        "name": "Jalisco",
        "cities": [
          "Guadalajara",
          "Puerto Vallarta",
          "Zapopan"
        ]
      },
      {
        "name": "Nuevo León",
        "cities": [
          "Monterrey",
          "San Pedro Garza García"
        ]
      },
      {
        "name": "Puebla",
        "cities": [
          "Puebla",
          "Cholula"
        ]
      },
      {
        "name": "Quintana Roo",
        "cities": [
          "Cancún",
          "Playa del Carmen",
          "Tulum"
        ]
      },
      {
        "name": "Yucatán",
        "cities": [
          "Mérida",
          "Valladolid"
        ]
      },
      {
        "name": "Baja California",
        "cities": [
          "Tijuana",
          "Ensenada",
          "Mexicali"
        ]
      },
      {
        "name": "Baja California Sur",
        "cities": [
          "Cabo San Lucas",
          "San José del Cabo",
          "La Paz"
        ]
      },
      {
        "name": "Guanajuato",
        "cities": [
          "Guanajuato",
          "San Miguel de Allende",
          "León"
        ]
      },
      {
        "name": "Querétaro",
        "cities": [
          "Querétaro"
        ]
      }
    ]
  },
  {
    "country": "Micronesia",
    "states": [
      {
        "name": "Pohnpei State",
        "cities": [
          "Palikir",
          "Kolonia"
        ]
      }
    ]
  },
  {
    "country": "Moldova",
    "states": [
      {
        "name": "Chișinău Municipality",
        "cities": [
          "Chișinău"
        ]
      },
      {
        "name": "Bălți Municipality",
        "cities": [
          "Bălți"
        ]
      }
    ]
  },
  {
    "country": "Monaco",
    "states": [
      {
        "name": "Monaco-Ville",
        "cities": [
          "Monaco"
        ]
      },
      {
        "name": "Monte Carlo",
        "cities": [
          "Monte Carlo"
        ]
      },
      {
        "name": "La Condamine",
        "cities": [
          "La Condamine"
        ]
      }
    ]
  },
  {
    "country": "Mongolia",
    "states": [
      {
        "name": "Ulaanbaatar",
        "cities": [
          "Ulaanbaatar"
        ]
      }
    ]
  },
  {
    "country": "Montenegro",
    "states": [
      {
        "name": "Podgorica Municipality",
        "cities": [
          "Podgorica"
        ]
      },
      {
        "name": "Kotor Municipality",
        "cities": [
          "Kotor"
        ]
      },
      {
        "name": "Budva Municipality",
        "cities": [
          "Budva"
        ]
      }
    ]
  },
  {
    "country": "Morocco",
    "states": [
      {
        "name": "Casablanca-Settat",
        "cities": [
          "Casablanca"
        ]
      },
      {
        "name": "Marrakesh-Safi",
        "cities": [
          "Marrakesh"
        ]
      },
      {
        "name": "Rabat-Salé-Kénitra",
        "cities": [
          "Rabat"
        ]
      },
      {
        "name": "Tanger-Tetouan-Al Hoceima",
        "cities": [
          "Tangier"
        ]
      }
    ]
  },
  {
    "country": "Mozambique",
    "states": [
      {
        "name": "Maputo City",
        "cities": [
          "Maputo"
        ]
      },
      {
        "name": "Sofala Province",
        "cities": [
          "Beira"
        ]
      }
    ]
  },
  {
    "country": "Myanmar (Burma)",
    "states": [
      {
        "name": "Yangon Region",
        "cities": [
          "Yangon"
        ]
      },
      {
        "name": "Mandalay Region",
        "cities": [
          "Mandalay"
        ]
      },
      {
        "name": "Naypyidaw Union Territory",
        "cities": [
          "Naypyidaw"
        ]
      }
    ]
  },
  {
    "country": "Namibia",
    "states": [
      {
        "name": "Khomas Region",
        "cities": [
          "Windhoek"
        ]
      },
      {
        "name": "Erongo Region",
        "cities": [
          "Swakopmund",
          "Walvis Bay"
        ]
      }
    ]
  },
  {
    "country": "Nauru",
    "states": [
      {
        "name": "Yaren District",
        "cities": [
          "Yaren"
        ]
      }
    ]
  },
  {
    "country": "Nepal",
    "states": [
      {
        "name": "Bagmati Province",
        "cities": [
          "Kathmandu",
          "Lalitpur"
        ]
      },
      {
        "name": "Gandaki Province",
        "cities": [
          "Pokhara"
        ]
      }
    ]
  },
  {
    "country": "Netherlands",
    "states": [
      {
        "name": "North Holland",
        "cities": [
          "Amsterdam",
          "Haarlem",
          "Alkmaar"
        ]
      },
      {
        "name": "South Holland",
        "cities": [
          "Rotterdam",
          "The Hague",
          "Leiden",
          "Delft"
        ]
      },
      {
        "name": "Utrecht",
        "cities": [
          "Utrecht",
          "Amersfoort"
        ]
      },
      {
        "name": "North Brabant",
        "cities": [
          "Eindhoven",
          "Tilburg",
          "Breda",
          "'s-Hertogenbosch"
        ]
      },
      {
        "name": "Gelderland",
        "cities": [
          "Arnhem",
          "Nijmegen",
          "Apeldoorn"
        ]
      },
      {
        "name": "Overijssel",
        "cities": [
          "Zwolle",
          "Enschede"
        ]
      },
      {
        "name": "Groningen",
        "cities": [
          "Groningen"
        ]
      },
      {
        "name": "Limburg",
        "cities": [
          "Maastricht"
        ]
      }
    ]
  },
  {
    "country": "New Zealand",
    "states": [
      {
        "name": "Auckland",
        "cities": [
          "Auckland",
          "North Shore",
          "Manukau"
        ]
      },
      {
        "name": "Wellington",
        "cities": [
          "Wellington",
          "Lower Hutt"
        ]
      },
      {
        "name": "Canterbury",
        "cities": [
          "Christchurch"
        ]
      },
      {
        "name": "Otago",
        "cities": [
          "Queenstown",
          "Dunedin",
          "Wanaka"
        ]
      },
      {
        "name": "Waikato",
        "cities": [
          "Hamilton",
          "Taupo"
        ]
      },
      {
        "name": "Bay of Plenty",
        "cities": [
          "Tauranga",
          "Rotorua"
        ]
      }
    ]
  },
  {
    "country": "Nicaragua",
    "states": [
      {
        "name": "Managua Department",
        "cities": [
          "Managua"
        ]
      },
      {
        "name": "Granada Department",
        "cities": [
          "Granada"
        ]
      },
      {
        "name": "León Department",
        "cities": [
          "León"
        ]
      }
    ]
  },
  {
    "country": "Niger",
    "states": [
      {
        "name": "Niamey Capital District",
        "cities": [
          "Niamey"
        ]
      }
    ]
  },
  {
    "country": "Nigeria",
    "states": [
      {
        "name": "Lagos",
        "cities": [
          "Lagos",
          "Ikeja",
          "Lekki",
          "Victoria Island"
        ]
      },
      {
        "name": "Federal Capital Territory",
        "cities": [
          "Abuja"
        ]
      },
      {
        "name": "Rivers",
        "cities": [
          "Port Harcourt"
        ]
      },
      {
        "name": "Kano",
        "cities": [
          "Kano"
        ]
      },
      {
        "name": "Oyo",
        "cities": [
          "Ibadan"
        ]
      },
      {
        "name": "Enugu",
        "cities": [
          "Enugu"
        ]
      },
      {
        "name": "Delta",
        "cities": [
          "Warri",
          "Asaba"
        ]
      }
    ]
  },
  {
    "country": "North Korea",
    "states": [
      {
        "name": "Pyongyang",
        "cities": [
          "Pyongyang"
        ]
      }
    ]
  },
  {
    "country": "North Macedonia",
    "states": [
      {
        "name": "Skopje Region",
        "cities": [
          "Skopje"
        ]
      },
      {
        "name": "Southwestern Region",
        "cities": [
          "Ohrid"
        ]
      }
    ]
  },
  {
    "country": "Norway",
    "states": [
      {
        "name": "Oslo",
        "cities": [
          "Oslo"
        ]
      },
      {
        "name": "Vestland",
        "cities": [
          "Bergen"
        ]
      },
      {
        "name": "Trøndelag",
        "cities": [
          "Trondheim"
        ]
      },
      {
        "name": "Rogaland",
        "cities": [
          "Stavanger"
        ]
      },
      {
        "name": "Viken",
        "cities": [
          "Drammen",
          "Bærum"
        ]
      },
      {
        "name": "Troms og Finnmark",
        "cities": [
          "Tromsø"
        ]
      }
    ]
  },
  {
    "country": "Oman",
    "states": [
      {
        "name": "Muscat Governorate",
        "cities": [
          "Muscat"
        ]
      },
      {
        "name": "Dhofar Governorate",
        "cities": [
          "Salalah"
        ]
      }
    ]
  },
  {
    "country": "Pakistan",
    "states": [
      {
        "name": "Punjab",
        "cities": [
          "Lahore",
          "Rawalpindi",
          "Faisalabad",
          "Multan",
          "Gujranwala"
        ]
      },
      {
        "name": "Sindh",
        "cities": [
          "Karachi",
          "Hyderabad",
          "Sukkur"
        ]
      },
      {
        "name": "Islamabad Capital Territory",
        "cities": [
          "Islamabad"
        ]
      },
      {
        "name": "Khyber Pakhtunkhwa",
        "cities": [
          "Peshawar",
          "Abbottabad"
        ]
      },
      {
        "name": "Balochistan",
        "cities": [
          "Quetta"
        ]
      }
    ]
  },
  {
    "country": "Palau",
    "states": [
      {
        "name": "Melekeok State",
        "cities": [
          "Ngerulmud"
        ]
      },
      {
        "name": "Koror State",
        "cities": [
          "Koror"
        ]
      }
    ]
  },
  {
    "country": "Palestine State",
    "states": [
      {
        "name": "West Bank",
        "cities": [
          "Ramallah",
          "Jerusalem",
          "Bethlehem",
          "Nablus",
          "Hebron"
        ]
      },
      {
        "name": "Gaza Strip",
        "cities": [
          "Gaza City",
          "Khan Yunis"
        ]
      }
    ]
  },
  {
    "country": "Panama",
    "states": [
      {
        "name": "Panamá Province",
        "cities": [
          "Panama City"
        ]
      },
      {
        "name": "Colón Province",
        "cities": [
          "Colón"
        ]
      }
    ]
  },
  {
    "country": "Papua New Guinea",
    "states": [
      {
        "name": "National Capital District",
        "cities": [
          "Port Moresby"
        ]
      }
    ]
  },
  {
    "country": "Paraguay",
    "states": [
      {
        "name": "Capital District",
        "cities": [
          "Asunción"
        ]
      },
      {
        "name": "Alto Paraná",
        "cities": [
          "Ciudad del Este"
        ]
      }
    ]
  },
  {
    "country": "Peru",
    "states": [
      {
        "name": "Lima Province",
        "cities": [
          "Lima",
          "Miraflores",
          "San Isidro",
          "Barranco"
        ]
      },
      {
        "name": "Cusco",
        "cities": [
          "Cusco",
          "Urubamba"
        ]
      },
      {
        "name": "Arequipa",
        "cities": [
          "Arequipa"
        ]
      },
      {
        "name": "La Libertad",
        "cities": [
          "Trujillo"
        ]
      }
    ]
  },
  {
    "country": "Philippines",
    "states": [
      {
        "name": "Metro Manila (NCR)",
        "cities": [
          "Manila",
          "Quezon City",
          "Makati",
          "Taguig (BGC)",
          "Pasig"
        ]
      },
      {
        "name": "Central Visayas",
        "cities": [
          "Cebu City",
          "Mandaue",
          "Lapu-Lapu"
        ]
      },
      {
        "name": "Davao Region",
        "cities": [
          "Davao City"
        ]
      },
      {
        "name": "Western Visayas",
        "cities": [
          "Iloilo City",
          "Bacolod"
        ]
      },
      {
        "name": "Calabarzon",
        "cities": [
          "Antipolo",
          "Calamba",
          "Santa Rosa"
        ]
      }
    ]
  },
  {
    "country": "Poland",
    "states": [
      {
        "name": "Masovian",
        "cities": [
          "Warsaw",
          "Radom",
          "Płock"
        ]
      },
      {
        "name": "Lesser Poland",
        "cities": [
          "Kraków",
          "Tarnów",
          "Nowy Sącz"
        ]
      },
      {
        "name": "Lower Silesian",
        "cities": [
          "Wrocław",
          "Wałbrzych",
          "Legnica"
        ]
      },
      {
        "name": "Pomeranian",
        "cities": [
          "Gdańsk",
          "Gdynia",
          "Sopot"
        ]
      },
      {
        "name": "Greater Poland",
        "cities": [
          "Poznań",
          "Kalisz"
        ]
      },
      {
        "name": "Silesian",
        "cities": [
          "Katowice",
          "Gliwice",
          "Częstochowa"
        ]
      }
    ]
  },
  {
    "country": "Portugal",
    "states": [
      {
        "name": "Lisbon District",
        "cities": [
          "Lisbon",
          "Cascais",
          "Sintra",
          "Oeiras"
        ]
      },
      {
        "name": "Porto District",
        "cities": [
          "Porto",
          "Vila Nova de Gaia",
          "Matosinhos"
        ]
      },
      {
        "name": "Faro District (Algarve)",
        "cities": [
          "Faro",
          "Lagos",
          "Albufeira",
          "Portimão"
        ]
      },
      {
        "name": "Braga District",
        "cities": [
          "Braga",
          "Guimarães"
        ]
      },
      {
        "name": "Coimbra District",
        "cities": [
          "Coimbra"
        ]
      },
      {
        "name": "Madeira",
        "cities": [
          "Funchal"
        ]
      },
      {
        "name": "Azores",
        "cities": [
          "Ponta Delgada"
        ]
      }
    ]
  },
  {
    "country": "Qatar",
    "states": [
      {
        "name": "Doha Municipality",
        "cities": [
          "Doha"
        ]
      },
      {
        "name": "Al Rayyan Municipality",
        "cities": [
          "Al Rayyan"
        ]
      },
      {
        "name": "Al Wakrah Municipality",
        "cities": [
          "Al Wakrah"
        ]
      }
    ]
  },
  {
    "country": "Romania",
    "states": [
      {
        "name": "Bucharest",
        "cities": [
          "Bucharest"
        ]
      },
      {
        "name": "Cluj County",
        "cities": [
          "Cluj-Napoca"
        ]
      },
      {
        "name": "Timiș County",
        "cities": [
          "Timișoara"
        ]
      },
      {
        "name": "Iași County",
        "cities": [
          "Iași"
        ]
      },
      {
        "name": "Brașov County",
        "cities": [
          "Brașov"
        ]
      }
    ]
  },
  {
    "country": "Russia",
    "states": [
      {
        "name": "Moscow",
        "cities": [
          "Moscow"
        ]
      },
      {
        "name": "Saint Petersburg",
        "cities": [
          "Saint Petersburg"
        ]
      },
      {
        "name": "Novosibirsk Oblast",
        "cities": [
          "Novosibirsk"
        ]
      },
      {
        "name": "Sverdlovsk Oblast",
        "cities": [
          "Yekaterinburg"
        ]
      },
      {
        "name": "Tatarstan",
        "cities": [
          "Kazan"
        ]
      },
      {
        "name": "Nizhny Novgorod Oblast",
        "cities": [
          "Nizhny Novgorod"
        ]
      }
    ]
  },
  {
    "country": "Rwanda",
    "states": [
      {
        "name": "Kigali Province",
        "cities": [
          "Kigali"
        ]
      }
    ]
  },
  {
    "country": "Saint Kitts and Nevis",
    "states": [
      {
        "name": "Saint George Basseterre",
        "cities": [
          "Basseterre"
        ]
      }
    ]
  },
  {
    "country": "Saint Lucia",
    "states": [
      {
        "name": "Castries District",
        "cities": [
          "Castries"
        ]
      }
    ]
  },
  {
    "country": "Saint Vincent and the Grenadines",
    "states": [
      {
        "name": "Saint George Parish",
        "cities": [
          "Kingstown"
        ]
      }
    ]
  },
  {
    "country": "Samoa",
    "states": [
      {
        "name": "Tuamasaga",
        "cities": [
          "Apia"
        ]
      }
    ]
  },
  {
    "country": "San Marino",
    "states": [
      {
        "name": "City of San Marino",
        "cities": [
          "San Marino"
        ]
      },
      {
        "name": "Serravalle",
        "cities": [
          "Serravalle"
        ]
      }
    ]
  },
  {
    "country": "Sao Tome and Principe",
    "states": [
      {
        "name": "São Tomé Province",
        "cities": [
          "São Tomé"
        ]
      }
    ]
  },
  {
    "country": "Saudi Arabia",
    "states": [
      {
        "name": "Riyadh Region",
        "cities": [
          "Riyadh",
          "Al Kharj"
        ]
      },
      {
        "name": "Makkah Region",
        "cities": [
          "Jeddah",
          "Mecca",
          "Taif"
        ]
      },
      {
        "name": "Eastern Province",
        "cities": [
          "Dammam",
          "Khobar",
          "Dhahran",
          "Jubail"
        ]
      },
      {
        "name": "Medina Region",
        "cities": [
          "Medina",
          "Yanbu"
        ]
      }
    ]
  },
  {
    "country": "Senegal",
    "states": [
      {
        "name": "Dakar Region",
        "cities": [
          "Dakar"
        ]
      },
      {
        "name": "Thiès Region",
        "cities": [
          "Thiès"
        ]
      }
    ]
  },
  {
    "country": "Serbia",
    "states": [
      {
        "name": "Belgrade",
        "cities": [
          "Belgrade"
        ]
      },
      {
        "name": "South Bačka",
        "cities": [
          "Novi Sad"
        ]
      },
      {
        "name": "Nišava",
        "cities": [
          "Niš"
        ]
      }
    ]
  },
  {
    "country": "Seychelles",
    "states": [
      {
        "name": "Greater Victoria",
        "cities": [
          "Victoria"
        ]
      }
    ]
  },
  {
    "country": "Sierra Leone",
    "states": [
      {
        "name": "Western Area Urban",
        "cities": [
          "Freetown"
        ]
      }
    ]
  },
  {
    "country": "Singapore",
    "states": [
      {
        "name": "Central Region",
        "cities": [
          "Singapore Downtown",
          "Orchard",
          "Marina Bay",
          "Bugis",
          "Tanjong Pagar"
        ]
      },
      {
        "name": "East Region",
        "cities": [
          "Tampines",
          "Bedok",
          "Pasir Ris"
        ]
      },
      {
        "name": "West Region",
        "cities": [
          "Jurong East",
          "Clementi"
        ]
      },
      {
        "name": "North Region",
        "cities": [
          "Woodlands",
          "Yishun"
        ]
      },
      {
        "name": "North-East Region",
        "cities": [
          "Punggol",
          "Sengkang",
          "Serangoon"
        ]
      }
    ]
  },
  {
    "country": "Slovakia",
    "states": [
      {
        "name": "Bratislava Region",
        "cities": [
          "Bratislava"
        ]
      },
      {
        "name": "Košice Region",
        "cities": [
          "Košice"
        ]
      }
    ]
  },
  {
    "country": "Slovenia",
    "states": [
      {
        "name": "Central Slovenia",
        "cities": [
          "Ljubljana"
        ]
      },
      {
        "name": "Drava Region",
        "cities": [
          "Maribor"
        ]
      },
      {
        "name": "Upper Carniola",
        "cities": [
          "Bled",
          "Kranj"
        ]
      }
    ]
  },
  {
    "country": "Solomon Islands",
    "states": [
      {
        "name": "Guadalcanal Province",
        "cities": [
          "Honiara"
        ]
      }
    ]
  },
  {
    "country": "Somalia",
    "states": [
      {
        "name": "Banaadir",
        "cities": [
          "Mogadishu"
        ]
      }
    ]
  },
  {
    "country": "South Africa",
    "states": [
      {
        "name": "Gauteng",
        "cities": [
          "Johannesburg",
          "Pretoria",
          "Sandton",
          "Soweto"
        ]
      },
      {
        "name": "Western Cape",
        "cities": [
          "Cape Town",
          "Stellenbosch",
          "George"
        ]
      },
      {
        "name": "KwaZulu-Natal",
        "cities": [
          "Durban",
          "Pietermaritzburg",
          "Umhlanga"
        ]
      },
      {
        "name": "Eastern Cape",
        "cities": [
          "Gqeberha (Port Elizabeth)",
          "East London"
        ]
      },
      {
        "name": "Free State",
        "cities": [
          "Bloemfontein"
        ]
      }
    ]
  },
  {
    "country": "South Korea",
    "states": [
      {
        "name": "Seoul",
        "cities": [
          "Seoul",
          "Gangnam",
          "Mapo",
          "Jongno",
          "Yongsan"
        ]
      },
      {
        "name": "Busan",
        "cities": [
          "Busan",
          "Haeundae"
        ]
      },
      {
        "name": "Gyeonggi",
        "cities": [
          "Suwon",
          "Seongnam (Bundang)",
          "Goyang"
        ]
      },
      {
        "name": "Incheon",
        "cities": [
          "Incheon",
          "Songdo"
        ]
      },
      {
        "name": "Daegu",
        "cities": [
          "Daegu"
        ]
      },
      {
        "name": "Jeju",
        "cities": [
          "Jeju City",
          "Seogwipo"
        ]
      }
    ]
  },
  {
    "country": "South Sudan",
    "states": [
      {
        "name": "Central Equatoria",
        "cities": [
          "Juba"
        ]
      }
    ]
  },
  {
    "country": "Spain",
    "states": [
      {
        "name": "Andalusia",
        "cities": [
          "Seville",
          "Malaga",
          "Granada",
          "Cordoba",
          "Marbella",
          "Cadiz"
        ]
      },
      {
        "name": "Aragon",
        "cities": [
          "Zaragoza"
        ]
      },
      {
        "name": "Balearic Islands",
        "cities": [
          "Palma",
          "Ibiza"
        ]
      },
      {
        "name": "Basque Country",
        "cities": [
          "Bilbao",
          "San Sebastián",
          "Vitoria-Gasteiz"
        ]
      },
      {
        "name": "Canary Islands",
        "cities": [
          "Las Palmas",
          "Santa Cruz de Tenerife"
        ]
      },
      {
        "name": "Castile and León",
        "cities": [
          "Valladolid",
          "Salamanca",
          "Burgos"
        ]
      },
      {
        "name": "Catalonia",
        "cities": [
          "Barcelona",
          "Girona",
          "Tarragona",
          "Lleida"
        ]
      },
      {
        "name": "Galicia",
        "cities": [
          "Santiago de Compostela",
          "A Coruña",
          "Vigo"
        ]
      },
      {
        "name": "Madrid",
        "cities": [
          "Madrid",
          "Alcalá de Henares",
          "Getafe"
        ]
      },
      {
        "name": "Murcia",
        "cities": [
          "Murcia",
          "Cartagena"
        ]
      },
      {
        "name": "Navarre",
        "cities": [
          "Pamplona"
        ]
      },
      {
        "name": "Valencia",
        "cities": [
          "Valencia",
          "Alicante",
          "Castellón de la Plana",
          "Benidorm"
        ]
      }
    ]
  },
  {
    "country": "Sri Lanka",
    "states": [
      {
        "name": "Western Province",
        "cities": [
          "Colombo"
        ]
      },
      {
        "name": "Central Province",
        "cities": [
          "Kandy"
        ]
      },
      {
        "name": "Southern Province",
        "cities": [
          "Galle"
        ]
      }
    ]
  },
  {
    "country": "Sudan",
    "states": [
      {
        "name": "Khartoum State",
        "cities": [
          "Khartoum"
        ]
      }
    ]
  },
  {
    "country": "Suriname",
    "states": [
      {
        "name": "Paramaribo District",
        "cities": [
          "Paramaribo"
        ]
      }
    ]
  },
  {
    "country": "Sweden",
    "states": [
      {
        "name": "Stockholm",
        "cities": [
          "Stockholm",
          "Solna",
          "Nacka"
        ]
      },
      {
        "name": "Västra Götaland",
        "cities": [
          "Gothenburg",
          "Borås"
        ]
      },
      {
        "name": "Skåne",
        "cities": [
          "Malmö",
          "Lund",
          "Helsingborg"
        ]
      },
      {
        "name": "Uppsala",
        "cities": [
          "Uppsala"
        ]
      }
    ]
  },
  {
    "country": "Switzerland",
    "states": [
      {
        "name": "Zurich",
        "cities": [
          "Zurich",
          "Winterthur"
        ]
      },
      {
        "name": "Geneva",
        "cities": [
          "Geneva"
        ]
      },
      {
        "name": "Vaud",
        "cities": [
          "Lausanne",
          "Montreux"
        ]
      },
      {
        "name": "Bern",
        "cities": [
          "Bern",
          "Interlaken",
          "Thun"
        ]
      },
      {
        "name": "Basel-Stadt",
        "cities": [
          "Basel"
        ]
      },
      {
        "name": "Lucerne",
        "cities": [
          "Lucerne"
        ]
      },
      {
        "name": "Valais",
        "cities": [
          "Zermatt",
          "Sion"
        ]
      },
      {
        "name": "Ticino",
        "cities": [
          "Lugano",
          "Locarno"
        ]
      }
    ]
  },
  {
    "country": "Syria",
    "states": [
      {
        "name": "Damascus Governorate",
        "cities": [
          "Damascus"
        ]
      },
      {
        "name": "Aleppo Governorate",
        "cities": [
          "Aleppo"
        ]
      }
    ]
  },
  {
    "country": "Tajikistan",
    "states": [
      {
        "name": "Dushanbe",
        "cities": [
          "Dushanbe"
        ]
      }
    ]
  },
  {
    "country": "Tanzania",
    "states": [
      {
        "name": "Dar es Salaam",
        "cities": [
          "Dar es Salaam"
        ]
      },
      {
        "name": "Dodoma",
        "cities": [
          "Dodoma"
        ]
      },
      {
        "name": "Zanzibar Urban/West",
        "cities": [
          "Zanzibar City"
        ]
      }
    ]
  },
  {
    "country": "Thailand",
    "states": [
      {
        "name": "Bangkok",
        "cities": [
          "Bangkok",
          "Sukhumvit",
          "Silom",
          "Siam"
        ]
      },
      {
        "name": "Chiang Mai",
        "cities": [
          "Chiang Mai"
        ]
      },
      {
        "name": "Phuket",
        "cities": [
          "Phuket City",
          "Patong"
        ]
      },
      {
        "name": "Chonburi",
        "cities": [
          "Pattaya"
        ]
      },
      {
        "name": "Surat Thani",
        "cities": [
          "Ko Samui",
          "Ko Pha-ngan"
        ]
      },
      {
        "name": "Krabi",
        "cities": [
          "Krabi Town",
          "Ao Nang"
        ]
      }
    ]
  },
  {
    "country": "Timor-Leste",
    "states": [
      {
        "name": "Dili Municipality",
        "cities": [
          "Dili"
        ]
      }
    ]
  },
  {
    "country": "Togo",
    "states": [
      {
        "name": "Maritime Region",
        "cities": [
          "Lomé"
        ]
      }
    ]
  },
  {
    "country": "Tonga",
    "states": [
      {
        "name": "Tongatapu",
        "cities": [
          "Nukuʻalofa"
        ]
      }
    ]
  },
  {
    "country": "Trinidad and Tobago",
    "states": [
      {
        "name": "Port of Spain",
        "cities": [
          "Port of Spain"
        ]
      },
      {
        "name": "San Fernando",
        "cities": [
          "San Fernando"
        ]
      },
      {
        "name": "Tobago",
        "cities": [
          "Scarborough"
        ]
      }
    ]
  },
  {
    "country": "Tunisia",
    "states": [
      {
        "name": "Tunis Governorate",
        "cities": [
          "Tunis"
        ]
      },
      {
        "name": "Sousse Governorate",
        "cities": [
          "Sousse"
        ]
      }
    ]
  },
  {
    "country": "Turkey",
    "states": [
      {
        "name": "Istanbul",
        "cities": [
          "Istanbul",
          "Kadıköy",
          "Beşiktaş",
          "Beyoğlu",
          "Şişli"
        ]
      },
      {
        "name": "Ankara",
        "cities": [
          "Ankara",
          "Çankaya"
        ]
      },
      {
        "name": "Izmir",
        "cities": [
          "Izmir",
          "Karşıyaka",
          "Bornova",
          "Çeşme"
        ]
      },
      {
        "name": "Antalya",
        "cities": [
          "Antalya",
          "Alanya"
        ]
      },
      {
        "name": "Bursa",
        "cities": [
          "Bursa"
        ]
      },
      {
        "name": "Muğla",
        "cities": [
          "Bodrum",
          "Fethiye",
          "Marmaris"
        ]
      }
    ]
  },
  {
    "country": "Turkmenistan",
    "states": [
      {
        "name": "Ashgabat",
        "cities": [
          "Ashgabat"
        ]
      }
    ]
  },
  {
    "country": "Tuvalu",
    "states": [
      {
        "name": "Funafuti",
        "cities": [
          "Funafuti"
        ]
      }
    ]
  },
  {
    "country": "Uganda",
    "states": [
      {
        "name": "Central Region",
        "cities": [
          "Kampala",
          "Entebbe"
        ]
      }
    ]
  },
  {
    "country": "Ukraine",
    "states": [
      {
        "name": "Kyiv",
        "cities": [
          "Kyiv"
        ]
      },
      {
        "name": "Lviv Oblast",
        "cities": [
          "Lviv"
        ]
      },
      {
        "name": "Odesa Oblast",
        "cities": [
          "Odesa"
        ]
      },
      {
        "name": "Kharkiv Oblast",
        "cities": [
          "Kharkiv"
        ]
      }
    ]
  },
  {
    "country": "United Arab Emirates",
    "states": [
      {
        "name": "Dubai",
        "cities": [
          "Dubai",
          "Downtown Dubai",
          "Dubai Marina",
          "JBR",
          "Palm Jumeirah",
          "Deira"
        ]
      },
      {
        "name": "Abu Dhabi",
        "cities": [
          "Abu Dhabi",
          "Al Ain",
          "Yas Island"
        ]
      },
      {
        "name": "Sharjah",
        "cities": [
          "Sharjah"
        ]
      },
      {
        "name": "Ajman",
        "cities": [
          "Ajman"
        ]
      },
      {
        "name": "Ras Al Khaimah",
        "cities": [
          "Ras Al Khaimah"
        ]
      },
      {
        "name": "Fujairah",
        "cities": [
          "Fujairah"
        ]
      }
    ]
  },
  {
    "country": "United Kingdom",
    "states": [
      {
        "name": "England",
        "cities": [
          "London",
          "Manchester",
          "Birmingham",
          "Bristol",
          "Leeds",
          "Liverpool",
          "Newcastle",
          "Oxford",
          "Cambridge",
          "Brighton",
          "Sheffield",
          "Nottingham"
        ]
      },
      {
        "name": "Northern Ireland",
        "cities": [
          "Belfast",
          "Derry",
          "Lisburn"
        ]
      },
      {
        "name": "Scotland",
        "cities": [
          "Edinburgh",
          "Glasgow",
          "Aberdeen",
          "Dundee",
          "Inverness"
        ]
      },
      {
        "name": "Wales",
        "cities": [
          "Cardiff",
          "Swansea",
          "Newport",
          "Wrexham"
        ]
      }
    ]
  },
  {
    "country": "United States",
    "states": [
      {
        "name": "Alabama",
        "cities": [
          "Birmingham",
          "Montgomery",
          "Huntsville",
          "Mobile"
        ]
      },
      {
        "name": "Alaska",
        "cities": [
          "Anchorage",
          "Fairbanks",
          "Juneau"
        ]
      },
      {
        "name": "Arizona",
        "cities": [
          "Phoenix",
          "Scottsdale",
          "Tucson",
          "Mesa",
          "Tempe",
          "Chandler"
        ]
      },
      {
        "name": "Arkansas",
        "cities": [
          "Little Rock",
          "Fayetteville",
          "Fort Smith",
          "Springdale"
        ]
      },
      {
        "name": "California",
        "cities": [
          "Los Angeles",
          "San Francisco",
          "San Diego",
          "San Jose",
          "Sacramento",
          "Oakland",
          "Long Beach",
          "Irvine",
          "Fresno"
        ]
      },
      {
        "name": "Colorado",
        "cities": [
          "Denver",
          "Boulder",
          "Colorado Springs",
          "Fort Collins",
          "Aurora"
        ]
      },
      {
        "name": "Connecticut",
        "cities": [
          "Hartford",
          "New Haven",
          "Stamford",
          "Bridgeport",
          "Greenwich"
        ]
      },
      {
        "name": "Delaware",
        "cities": [
          "Wilmington",
          "Dover",
          "Newark"
        ]
      },
      {
        "name": "District of Columbia",
        "cities": [
          "Washington D.C.",
          "Georgetown",
          "Capitol Hill",
          "Dupont Circle"
        ]
      },
      {
        "name": "Florida",
        "cities": [
          "Miami",
          "Orlando",
          "Tampa",
          "Fort Lauderdale",
          "Jacksonville",
          "St. Petersburg",
          "Tallahassee"
        ]
      },
      {
        "name": "Georgia",
        "cities": [
          "Atlanta",
          "Savannah",
          "Augusta",
          "Athens",
          "Sandy Springs"
        ]
      },
      {
        "name": "Hawaii",
        "cities": [
          "Honolulu",
          "Hilo",
          "Kailua",
          "Maui"
        ]
      },
      {
        "name": "Idaho",
        "cities": [
          "Boise",
          "Meridian",
          "Nampa",
          "Idaho Falls"
        ]
      },
      {
        "name": "Illinois",
        "cities": [
          "Chicago",
          "Naperville",
          "Evanston",
          "Rockford",
          "Springfield",
          "Peoria"
        ]
      },
      {
        "name": "Indiana",
        "cities": [
          "Indianapolis",
          "Fort Wayne",
          "Bloomington",
          "South Bend",
          "Carmel"
        ]
      },
      {
        "name": "Iowa",
        "cities": [
          "Des Moines",
          "Cedar Rapids",
          "Iowa City",
          "Davenport"
        ]
      },
      {
        "name": "Kansas",
        "cities": [
          "Wichita",
          "Overland Park",
          "Kansas City",
          "Topeka",
          "Lawrence"
        ]
      },
      {
        "name": "Kentucky",
        "cities": [
          "Louisville",
          "Lexington",
          "Bowling Green",
          "Covington"
        ]
      },
      {
        "name": "Louisiana",
        "cities": [
          "New Orleans",
          "Baton Rouge",
          "Shreveport",
          "Lafayette"
        ]
      },
      {
        "name": "Maine",
        "cities": [
          "Portland",
          "Lewiston",
          "Bangor",
          "Augusta"
        ]
      },
      {
        "name": "Maryland",
        "cities": [
          "Baltimore",
          "Annapolis",
          "Bethesda",
          "Silver Spring",
          "Rockville"
        ]
      },
      {
        "name": "Massachusetts",
        "cities": [
          "Boston",
          "Cambridge",
          "Somerville",
          "Worcester",
          "Springfield",
          "Salem"
        ]
      },
      {
        "name": "Michigan",
        "cities": [
          "Detroit",
          "Ann Arbor",
          "Grand Rapids",
          "Lansing",
          "Kalamazoo"
        ]
      },
      {
        "name": "Minnesota",
        "cities": [
          "Minneapolis",
          "Saint Paul",
          "Rochester",
          "Duluth",
          "Bloomington"
        ]
      },
      {
        "name": "Mississippi",
        "cities": [
          "Jackson",
          "Gulfport",
          "Southaven",
          "Biloxi"
        ]
      },
      {
        "name": "Missouri",
        "cities": [
          "Kansas City",
          "Saint Louis",
          "Springfield",
          "Columbia"
        ]
      },
      {
        "name": "Montana",
        "cities": [
          "Billings",
          "Missoula",
          "Bozeman",
          "Helena"
        ]
      },
      {
        "name": "Nebraska",
        "cities": [
          "Omaha",
          "Lincoln",
          "Bellevue"
        ]
      },
      {
        "name": "Nevada",
        "cities": [
          "Las Vegas",
          "Reno",
          "Henderson",
          "Carson City"
        ]
      },
      {
        "name": "New Hampshire",
        "cities": [
          "Manchester",
          "Nashua",
          "Concord",
          "Portsmouth"
        ]
      },
      {
        "name": "New Jersey",
        "cities": [
          "Jersey City",
          "Newark",
          "Hoboken",
          "Princeton",
          "Atlantic City",
          "Trenton"
        ]
      },
      {
        "name": "New Mexico",
        "cities": [
          "Albuquerque",
          "Santa Fe",
          "Las Cruces",
          "Roswell"
        ]
      },
      {
        "name": "New York",
        "cities": [
          "New York City",
          "New York",
          "Manhattan",
          "Brooklyn",
          "Queens",
          "Bronx",
          "Staten Island",
          "Buffalo",
          "Rochester",
          "Albany",
          "Syracuse",
          "Yonkers"
        ]
      },
      {
        "name": "North Carolina",
        "cities": [
          "Charlotte",
          "Raleigh",
          "Durham",
          "Greensboro",
          "Winston-Salem",
          "Asheville"
        ]
      },
      {
        "name": "North Dakota",
        "cities": [
          "Fargo",
          "Bismarck",
          "Grand Forks"
        ]
      },
      {
        "name": "Ohio",
        "cities": [
          "Columbus",
          "Cleveland",
          "Cincinnati",
          "Toledo",
          "Akron",
          "Dayton"
        ]
      },
      {
        "name": "Oklahoma",
        "cities": [
          "Oklahoma City",
          "Tulsa",
          "Norman",
          "Edmond"
        ]
      },
      {
        "name": "Oregon",
        "cities": [
          "Portland",
          "Eugene",
          "Salem",
          "Bend",
          "Beaverton"
        ]
      },
      {
        "name": "Pennsylvania",
        "cities": [
          "Philadelphia",
          "Pittsburgh",
          "Allentown",
          "Harrisburg",
          "Scranton"
        ]
      },
      {
        "name": "Puerto Rico",
        "cities": [
          "San Juan",
          "Ponce",
          "Bayamón",
          "Carolina"
        ]
      },
      {
        "name": "Rhode Island",
        "cities": [
          "Providence",
          "Warwick",
          "Newport",
          "Pawtucket"
        ]
      },
      {
        "name": "South Carolina",
        "cities": [
          "Charleston",
          "Columbia",
          "Greenville",
          "Myrtle Beach"
        ]
      },
      {
        "name": "South Dakota",
        "cities": [
          "Sioux Falls",
          "Rapid City",
          "Aberdeen"
        ]
      },
      {
        "name": "Tennessee",
        "cities": [
          "Nashville",
          "Memphis",
          "Knoxville",
          "Chattanooga",
          "Clarksville"
        ]
      },
      {
        "name": "Texas",
        "cities": [
          "Austin",
          "Houston",
          "Dallas",
          "San Antonio",
          "Fort Worth",
          "El Paso",
          "Arlington",
          "Plano"
        ]
      },
      {
        "name": "Utah",
        "cities": [
          "Salt Lake City",
          "Provo",
          "West Valley City",
          "Park City",
          "Orem"
        ]
      },
      {
        "name": "Vermont",
        "cities": [
          "Burlington",
          "Montpelier",
          "Rutland"
        ]
      },
      {
        "name": "Virginia",
        "cities": [
          "Virginia Beach",
          "Richmond",
          "Norfolk",
          "Arlington",
          "Alexandria",
          "Charlottesville"
        ]
      },
      {
        "name": "Washington",
        "cities": [
          "Seattle",
          "Bellevue",
          "Tacoma",
          "Spokane",
          "Vancouver",
          "Redmond",
          "Olympia"
        ]
      },
      {
        "name": "West Virginia",
        "cities": [
          "Charleston",
          "Huntington",
          "Morgantown"
        ]
      },
      {
        "name": "Wisconsin",
        "cities": [
          "Milwaukee",
          "Madison",
          "Green Bay",
          "Kenosha"
        ]
      },
      {
        "name": "Wyoming",
        "cities": [
          "Cheyenne",
          "Casper",
          "Laramie",
          "Jackson"
        ]
      }
    ]
  },
  {
    "country": "Uruguay",
    "states": [
      {
        "name": "Montevideo Department",
        "cities": [
          "Montevideo"
        ]
      },
      {
        "name": "Maldonado Department",
        "cities": [
          "Punta del Este"
        ]
      }
    ]
  },
  {
    "country": "Uzbekistan",
    "states": [
      {
        "name": "Tashkent",
        "cities": [
          "Tashkent"
        ]
      },
      {
        "name": "Samarkand Region",
        "cities": [
          "Samarkand"
        ]
      },
      {
        "name": "Bukhara Region",
        "cities": [
          "Bukhara"
        ]
      }
    ]
  },
  {
    "country": "Vanuatu",
    "states": [
      {
        "name": "Shefa Province",
        "cities": [
          "Port Vila"
        ]
      }
    ]
  },
  {
    "country": "Venezuela",
    "states": [
      {
        "name": "Capital District",
        "cities": [
          "Caracas"
        ]
      },
      {
        "name": "Zulia",
        "cities": [
          "Maracaibo"
        ]
      },
      {
        "name": "Carabobo",
        "cities": [
          "Valencia"
        ]
      }
    ]
  },
  {
    "country": "Vietnam",
    "states": [
      {
        "name": "Ho Chi Minh City",
        "cities": [
          "Ho Chi Minh City",
          "District 1",
          "District 2 (Thao Dien)",
          "District 7"
        ]
      },
      {
        "name": "Hanoi",
        "cities": [
          "Hanoi",
          "Hoan Kiem",
          "Tay Ho"
        ]
      },
      {
        "name": "Da Nang",
        "cities": [
          "Da Nang"
        ]
      },
      {
        "name": "Khanh Hoa",
        "cities": [
          "Nha Trang"
        ]
      },
      {
        "name": "Lam Dong",
        "cities": [
          "Da Lat"
        ]
      },
      {
        "name": "Quang Nam",
        "cities": [
          "Hoi An"
        ]
      }
    ]
  },
  {
    "country": "Yemen",
    "states": [
      {
        "name": "Sana'a Governorate",
        "cities": [
          "Sana'a"
        ]
      },
      {
        "name": "Aden Governorate",
        "cities": [
          "Aden"
        ]
      }
    ]
  },
  {
    "country": "Zambia",
    "states": [
      {
        "name": "Lusaka Province",
        "cities": [
          "Lusaka"
        ]
      },
      {
        "name": "Southern Province",
        "cities": [
          "Livingstone"
        ]
      }
    ]
  },
  {
    "country": "Zimbabwe",
    "states": [
      {
        "name": "Harare Province",
        "cities": [
          "Harare"
        ]
      },
      {
        "name": "Bulawayo Province",
        "cities": [
          "Bulawayo"
        ]
      }
    ]
  }
];

const QUIZ_STEPS = [
  {
    stepNumber: 1,
    category: "Identity",
    title: "What's your name?",
    subtitle: "We will only show your first name to table members.",
    fields: [
      { id: "firstName", label: "First Name", type: "text", placeholder: "e.g. Tom", required: true },
      { id: "middleName", label: "Middle Name (Optional)", type: "text", placeholder: "e.g. Robert" },
      { id: "lastName", label: "Last Name", type: "text", placeholder: "e.g. Cruise", required: true }
    ]
  },
  {
    stepNumber: 2,
    category: "Identity",
    title: "What's your age?",
    subtitle: "Helps us assemble balanced, comfortable circles.",
    fields: [
      { id: "age", label: "Your Age", type: "number", placeholder: "e.g. 26", min: 18, max: 99, required: true }
    ]
  },
  {
    stepNumber: 3,
    category: "Identity",
    title: "How do you define yourself?",
    subtitle: "Choose your gender identity for comfortable gathering curation.",
    type: "choice",
    fieldId: "gender",
    options: ["Man", "Woman", "Non-binary", "Other"]
  },
  {
    stepNumber: 4,
    category: "Identity",
    title: "What is your relationship status?",
    subtitle: "We prioritize low-pressure, friendship-first environments.",
    type: "choice",
    fieldId: "relationship",
    options: ["Single", "Married", "In a relationship", "It's complicated"]
  },
  {
    stepNumber: 5,
    category: "Identity",
    title: "Do you have children?",
    subtitle: "Connects you with people in similar life phases if desired.",
    type: "choice",
    fieldId: "children",
    options: ["Yes", "No", "I prefer not to say"]
  },
  {
    stepNumber: 6,
    category: "Identity",
    title: "Where are you based?",
    subtitle: "Select your country, state, and city from the options below.",
    type: "location-selector",
    fields: [
      { id: "country", label: "Country", type: "select", required: true },
      { id: "state", label: "State / Province", type: "select", required: true },
      { id: "city", label: "City / Region", type: "select", required: true }
    ]
  },
  {
    stepNumber: 7,
    category: "Personality",
    title: "How do you usually feel around new people?",
    subtitle: "There are no wrong answers — we design tables around comfort.",
    type: "choice",
    fieldId: "socialComfort",
    options: ["Very comfortable", "Comfortable after some time", "Neutral", "A bit uncomfortable"]
  },
  {
    stepNumber: 8,
    category: "Personality",
    title: "In a group conversation, you mostly:",
    subtitle: "Balanced groups have great listeners, talkers, and facilitators.",
    type: "choice",
    fieldId: "groupRole",
    options: ["Join actively", "Listen more than speak", "Lead and talk a lot"]
  },
  {
    stepNumber: 9,
    category: "Personality",
    title: "What kind of conversations do you enjoy most?",
    subtitle: "Finding your preferred rhythm and depth.",
    type: "choice",
    fieldId: "conversationDepth",
    options: ["Light & fun", "Balanced", "Deep & meaningful"]
  },
  {
    stepNumber: 10,
    category: "Personality",
    title: "Which describes you better?",
    subtitle: "We ensure introverts never get talked over by crowds.",
    type: "choice",
    fieldId: "introvertScale",
    options: ["Introvert", "Ambivert", "Extrovert"]
  },
  {
    stepNumber: 11,
    category: "Personality",
    title: "What do you value more in discussions?",
    subtitle: "Helps tailor the table dynamics.",
    type: "choice",
    fieldId: "discussionValue",
    options: ["Logic & facts", "Emotions & experiences", "A mix of both"]
  },
  {
    stepNumber: 12,
    category: "Personality",
    title: "Why are you joining this meetup?",
    subtitle: "Aligning your intentions with your table mates.",
    type: "choice",
    fieldId: "primaryGoal",
    options: ["Make new friends", "Interesting conversations", "Casual networking", "Just for fun"]
  },
  {
    stepNumber: 13,
    category: "Personality",
    title: "Topics you enjoy talking about (Pick up to 3):",
    subtitle: "We match shared curiosity across common passions.",
    type: "multi-choice",
    maxChoices: 3,
    fieldId: "topics",
    options: [
      "Career / Business",
      "Life experiences & Stories",
      "Tech / Innovation",
      "Philosophy & Books",
      "Travel & Culture",
      "Casual fun & Pop culture"
    ]
  },
  {
    stepNumber: 14,
    category: "Personality",
    title: "How do you feel after social gatherings?",
    subtitle: "Understanding your social battery and recharge preferences.",
    type: "choice",
    fieldId: "socialBattery",
    options: ["Energized", "Neutral", "Drained"]
  },
  {
    stepNumber: 15,
    category: "Personality",
    title: "Silence in a conversation feels:",
    subtitle: "Small natural pauses are welcomed in our gatherings.",
    type: "choice",
    fieldId: "silenceFeeling",
    options: ["Comfortable", "A little awkward", "Very awkward"]
  },
  {
    stepNumber: 16,
    category: "Personality",
    title: "Which best describes your current professional stage?",
    subtitle: "For relevant career context if work comes up naturally.",
    type: "choice",
    fieldId: "careerStage",
    options: [
      "Student",
      "Early career (0–3 years)",
      "Mid career (3–8 years)",
      "Senior / Leadership",
      "Entrepreneur / Freelancer"
    ]
  },
  {
    stepNumber: 17,
    category: "Personality",
    title: "What field best fits what you do?",
    subtitle: "Pick the area closest to your craft.",
    type: "choice",
    fieldId: "industry",
    options: [
      "Tech / IT",
      "Business / Management",
      "Creative / Media & Arts",
      "Healthcare / Science",
      "Education / Research",
      "Finance / Law",
      "Looking for opportunities / Transition",
      "Other"
    ]
  },
  {
    stepNumber: 18,
    category: "Personality",
    title: "What kind of conversations do you enjoy related to work?",
    subtitle: "Helps you avoid generic business-card swaps.",
    type: "choice",
    fieldId: "workConversationType",
    options: [
      "Learning & growth",
      "Sharing real-life experiences",
      "Brainstorming creative ideas",
      "Avoid work talk, prefer personal & fun topics"
    ]
  },
  {
    stepNumber: 19,
    category: "Personality",
    title: "What gathering size feels most comfortable for you?",
    subtitle: "Choose the circle size where your conversation flows most naturally (2–10 people).",
    type: "choice",
    fieldId: "preferredGroupSize",
    options: [
      "Intimate Pair (2 people)",
      "Small Table (3–4 people)",
      "Balanced Circle (5–6 people)",
      "Lively Table (7–10 people)",
      "Comfortable with any group size (2–10)"
    ]
  }
];

const MOCK_CHAT_MESSAGES = {
  "meetup-veselka-lunch": [
    { sender: "Henry Jones", time: "Yesterday, 14:15", text: "Hey everyone! Excited for lunch on Sunday at Veselka. I already reserved our back booth!" },
    { sender: "Lucas Martinez", time: "Yesterday, 14:32", text: "Awesome! I've been craving their potato pierogis for weeks. Can't wait to meet you all." },
    { sender: "Carl Johnson", time: "Today, 09:10", text: "Morning team! Count me in. Does anyone need directions from the Astor Place subway?" },
    { sender: "Tyler Davis", time: "Today, 10:05", text: "It's super easy, just 2 blocks down 2nd Ave. See you all at 1:00 PM!" }
  ],
  "meetup-oceana-dining": [
    { sender: "Sarah Jenkins", time: "11:20 AM", text: "Good morning! Looking forward to dinner at Oceana tonight at 8 PM. Dress code is smart-casual." },
    { sender: "David Kim", time: "11:45 AM", text: "Perfect, see you there! Table under Sarah right?" },
    { sender: "Maya Patel", time: "12:15 PM", text: "Can't wait! First time joining an Outspire gathering, feeling excited." }
  ],
  "meetup-night-party": [
    { sender: "Chris Brown", time: "16:00", text: "Live band starts promptly at 10:15. I'll be by the vintage brass lamp near the bar holding a warm smile." },
    { sender: "Luke Vance", time: "16:40", text: "Bringing my camera for some candid film shots if everyone is cool with it!" }
  ],
  "meetup-brooklyn-soccer": [
    { sender: "Marcus Brody", time: "Yesterday, 18:20", text: "Pitch 3 is locked in for Sunday morning! Cleats or turf shoes work great." },
    { sender: "Alex Rivera", time: "Today, 08:45", text: "I'll bring 2 extra balls and pinnies. Looking forward to a fun friendly match!" },
    { sender: "Jordan Hayes", time: "Today, 09:15", text: "Count me in! Who's down for post-match tacos across the street after?" }
  ],
  "meetup-happy-coffee": [
    { sender: "Elena Rostova", time: "Yesterday, 10:30", text: "Hey friends! I'll arrive 10 minutes early to grab the big round wooden table by the window." },
    { sender: "Carl Johnson", time: "Yesterday, 11:15", text: "Can't wait! Bringing an interesting book on neighborhood design to share." },
    { sender: "Maya Patel", time: "Today, 08:20", text: "Sounds lovely! First time at this café, see you all at 10:00 AM." }
  ],
  "meetup-london-hyde-park": [
    { sender: "Oliver Smith", time: "Yesterday, 16:40", text: "Hyde Park forecast is looking sunny! Let's meet right outside the Italian Gardens Café." },
    { sender: "Emma Watson", time: "Today, 11:05", text: "Perfect, grabbing a matcha tea on the way. See you all at 2:00 PM!" }
  ],
  "meetup-dog-walk": [
    { sender: "Chloe Bennett", time: "Yesterday, 12:10", text: "Barnaby is so excited to meet the other pups! I'll bring some organic peanut butter treats." },
    { sender: "Sam Wilson", time: "Today, 08:30", text: "Milo will be wearing his bright blue bandana! See everyone by the park fountain at 9:30 AM." }
  ],
  "meetup-board-games-event": [
    { sender: "William Stone", time: "Yesterday, 19:00", text: "Game night lineup: Codenames, Settlers, and Ticket to Ride! Feel free to bring personal favorites too." },
    { sender: "Sofia Chen", time: "Today, 10:20", text: "Bringing Wingspan if anyone wants to learn! Super relaxing engine-builder." }
  ]
};

const COMMUNITY_TESTIMONIALS = [
  {
    quote: "I moved to NYC not knowing a single soul. My first Veselka meetup felt like having Sunday dinner with lifelong friends. We still meet every month!",
    author: "Elena R.",
    role: "Teacher & Writer",
    meetupAttended: "Lunch Meetup at Veselka",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "As an introvert, large networking events give me dread. Being able to choose an intimate 2-to-4 person coffee table with no pitch pressure changed everything for my confidence.",
    author: "Carl J.",
    role: "Software Developer",
    meetupAttended: "Happy Weekend Coffee",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "The 3-hour flexible cancellation policy made me take the leap. I ended up showing up and having the best conversation about life and travel in years.",
    author: "Maya P.",
    role: "Brand Strategist",
    meetupAttended: "Dining Meetup at Oceana",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
  }
];

const HOST_CURATED_PHOTOS = [
  {
    id: "photo-bistro",
    url: "meetup-gathering.jpg",
    label: "Evening Bistro & Dinner",
    category: "dining"
  },
  {
    id: "photo-cafe",
    url: "candidate-option-1-cafe.jpg",
    label: "Sunlit Artisan Café",
    category: "coffee"
  },
  {
    id: "photo-cozy-table",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    label: "Warm Restaurant Table",
    category: "dining"
  },
  {
    id: "photo-coffee-cup",
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    label: "Waterfront Coffee Stroll",
    category: "casual"
  },
  {
    id: "photo-lounge",
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    label: "Music & Cozy Lounge",
    category: "nightlife"
  },
  {
    id: "photo-outdoor",
    url: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80",
    label: "Sports & Soccer Match",
    category: "sports"
  },
  {
    id: "photo-jogging",
    url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
    label: "Jogging & River Run",
    category: "jogging"
  },
  {
    id: "photo-dogwalk",
    url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    label: "Park Dog Walk",
    category: "dogwalk"
  },
  {
    id: "photo-swimming",
    url: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=800&q=80",
    label: "Swimming & Pool Hangout",
    category: "swimming"
  },
  {
    id: "photo-playground",
    url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80",
    label: "Playground & Casual Hangout",
    category: "playground"
  },
  {
    id: "photo-event",
    url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    label: "Community Mixer Event",
    category: "event"
  }
];

const STORAGE_KEY_HOSTED_MEETUPS = "outspire_hosted_meetups";

function getStoredHostedMeetups() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HOSTED_MEETUPS);
    const list = raw ? JSON.parse(raw) : [];
    const win = calculate4DayBookingWindow();
    return list.filter(m => {
      if (!m.dateStr) return false;
      return m.dateStr >= win.startDateStr && m.dateStr <= win.endDateStr;
    });
  } catch (e) {
    console.error("Error reading hosted meetups:", e);
    return [];
  }
}

function saveHostedMeetup(newMeetup) {
  try {
    const existing = getStoredHostedMeetups();
    const updated = [newMeetup, ...existing.filter(m => m.id !== newMeetup.id)];
    localStorage.setItem(STORAGE_KEY_HOSTED_MEETUPS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Error saving hosted meetup:", e);
    return [];
  }
}

// --------------------------------------------------------------------------
// Socializing Meetup Games Data (Table Centerpiece Group Games)
// --------------------------------------------------------------------------
const MEETUP_GAMES_DATA = {
  modes: [
    {
      id: "compass",
      name: "Table Compass",
      tagline: "Spin & Point",
      icon: "🧭",
      description: "Spin the 360° compass. Whoever it points to answers the prompt or takes the challenge!"
    },
    {
      id: "hottakes",
      name: "Hot Takes Poll",
      tagline: "Table Consensus",
      icon: "🔥",
      description: "A controversial or funny opinion appears. Everyone around the table votes Agree or Disagree!"
    },
    {
      id: "twotruths",
      name: "2 Truths & A Dream",
      tagline: "Guess the Stranger",
      icon: "🤫",
      description: "One person shares 2 real facts and 1 wild dream. The table has 60 seconds to interrogate & guess!"
    },
    {
      id: "rapidfire",
      name: "Rapid Fire",
      tagline: "3-Second Blitz",
      icon: "⚡",
      description: "Fast-paced word association & instant reactions passed around the table."
    },
    {
      id: "deepdive",
      name: "Deeper Waters",
      tagline: "Meaningful Stories",
      icon: "✨",
      description: "Thoughtful life perspectives and memorable stories when the table feels warm and connected."
    }
  ],
  compassQuestions: [
    "What is something you are secretly a total nerd about?",
    "If our table had to pull off an Oceans 11-style heist tonight, what would your role be?",
    "What is the strangest or funniest interaction you've ever had with an absolute stranger?",
    "What is a hill you are 100% willing to die on?",
    "If you could teleport this entire table to any city in the world for dinner right now, where are we going?",
    "What song or movie is your ultimate guilty pleasure?",
    "What is the best $20 you've spent in the last 6 months?",
    "What's a piece of terrible advice you received that you actually followed?",
    "If you had to teach a 1-hour masterclass right now with zero preparation, what topic are you teaching?",
    "What is one random skill or trick you can do that almost nobody knows about?",
    "What's a food combination people think is weird, but you swear by?",
    "What is the most spontaneous thing you've done in the past year?",
    "If you could have dinner with anyone alive or dead, but they had to sit at this exact table with us, who is it?",
    "What is something you used to hate as a kid but now genuinely love?",
    "What would the title of your autobiography be if it had to be brutally honest?",
    "What is your go-to comfort food on a rainy Sunday evening?",
    "If you had to pick a theme song that plays every time you enter a room, what is it?",
    "What is one city or place you visited that felt completely like magic?",
    "What was your very first job, and what is your favorite ridiculous memory from it?",
    "If you could wake up tomorrow completely fluent in any language and culture, which one?"
  ],
  hotTakes: [
    { statement: "Pineapple is genuinely elite on pizza.", context: "Culinary warfare" },
    { statement: "Working remotely in pajamas is 10x better than any office culture.", context: "Work-life debate" },
    { statement: "Texting is superior to phone calls in 99% of situations.", context: "Modern communication" },
    { statement: "Cereal is technically cold soup.", context: "Philosophical dilemma" },
    { statement: "Spoilers don't ruin movies; good storytelling survives them.", context: "Cinema ethics" },
    { statement: "Going to restaurants or cinemas alone is the peak of confidence and enjoyment.", context: "Solo independence" },
    { statement: "Living in a quiet cabin in the woods beats living in a luxury Manhattan penthouse.", context: "Lifestyle choice" },
    { statement: "Coffee is more about the cozy morning ritual than the actual caffeine.", context: "Morning rituals" },
    { statement: "Modern music is just as creative and soulful as the 70s and 80s classics.", context: "Musical showdown" },
    { statement: "You should always order dessert before knowing if you have room for it.", context: "Dining priorities" },
    { statement: "Dogs have better emotional intelligence than cats.", context: "Pet showdown" },
    { statement: "Having zero plans on a Friday night is better than going to a crowded party.", context: "Social battery" },
    { statement: "Summer is overrated; crisp autumn is the undisputed best season of the year.", context: "Weather wars" },
    { statement: "Audiobooks count as reading real books.", context: "Literary debate" },
    { statement: "It is totally acceptable to leave a party without saying goodbye to anyone (the Irish Exit).", context: "Social etiquette" }
  ],
  twoTruthsPrompts: [
    { title: "Travel Edition", instruction: "Share 2 real travel memories and 1 place you have never actually visited. Table has 60s to guess!" },
    { title: "Hobbies & Quirks", instruction: "Share 2 actual hobbies you do and 1 hobby you only pretend you want to start." },
    { title: "Culinary Adventures", instruction: "Share 2 weird or exotic foods you've eaten, and 1 completely made up dish." },
    { title: "Odd Jobs Edition", instruction: "Share 2 real jobs or gigs you've had in your life, and 1 completely fake job." },
    { title: "Childhood Mishaps", instruction: "Share 2 true embarrassing childhood memories and 1 fabricated mischief." },
    { title: "Wild Encounters", instruction: "Share 2 times you brushed paths with a celebrity or notable person, and 1 lie." }
  ],
  rapidFirePrompts: [
    { prompt: "Midnight Snack", category: "Quick Association" },
    { prompt: "Dream Vacation Spot", category: "Quick Association" },
    { prompt: "Sunday Morning Vibe", category: "Quick Association" },
    { prompt: "Your Social Battery Level Right Now", category: "Self Check-in" },
    { prompt: "First Car or Transportation Memory", category: "Nostalgia" },
    { prompt: "NYC Subway in One Word", category: "Urban Life" },
    { prompt: "Ultimate Comfort Food", category: "Quick Association" },
    { prompt: "Guilty Pleasure TV Show", category: "Entertainment" },
    { prompt: "Morning Person or Night Owl?", category: "Lifestyle" },
    { prompt: "Best Concert You've Ever Attended", category: "Music" },
    { prompt: "A Skill You Wish You Had", category: "Aspirations" },
    { prompt: "Your Signature Drink Order", category: "Beverages" }
  ],
  deepDiveQuestions: [
    "What was a turning point in your life that completely changed your trajectory?",
    "What is a lesson you had to learn the hard way that you're now genuinely grateful for?",
    "When in your life did you feel the most out of your comfort zone, and what did you discover about yourself?",
    "What does a truly meaningful day look like to you when nobody is watching?",
    "What is something you are working toward right now that genuinely excites you?",
    "Who is someone you met briefly who changed how you look at the world?",
    "If you could send a 10-second voice memo to yourself 10 years ago, what would you say?",
    "What is a small, quiet moment from the past week that brought you unexpected peace or joy?",
    "What is a belief or opinion you held strongly 5 years ago that you have completely changed your mind about?",
    "When was the last time you laughed until your stomach hurt, and who were you with?"
  ]
};

// --------------------------------------------------------------------------
// Tailored Category-Specific Games Configurations
// Games & icebreakers dynamically matched to the exact meetup activity!
// --------------------------------------------------------------------------
const CATEGORY_GAMES_CONFIG = {
  dining: {
    badge: "🍴 Table & Foodie Feature",
    icon: "🍽️",
    title: "Table & Foodie Icebreakers",
    cardLabel: "Table games: Unlock at dinner",
    subtext: `When you take your seats at the table, the host clicks <strong style="color: var(--cream-100);">"Unlock the game"</strong> and places their phone in the center of the table. Enjoy culinary debates, food bracket polls, and delicious stories together while waiting for the food!`,
    buttonBadge: "Table Mode",
    bannerStrong: "Keep phone flat in the center of the table",
    bannerSub: "everyone plays and votes directly from this screen while dining!",
    pills: [
      "🍕 Foodie Hot Takes",
      "🧭 Culinary Compass",
      "🤫 2 Truths & A Dish",
      "⚡ Flavor Rapid Fire",
      "🥂 Memorable Meals"
    ],
    games: {
      compassQuestions: [
        "What is a vegetable or dish you completely despised as a kid that you now crave as an adult?",
        "If our table could teleport to any city on Earth right now purely for dinner, where are we heading?",
        "What's the best street food or hidden gem restaurant you've ever discovered while traveling?",
        "If you were competing on Iron Chef tonight, what secret ingredient would guarantee your victory?",
        "What is your ultimate late-night comfort food order after a long week?",
        "What's the most bizarre or exotic food you have ever tasted, and would you eat it again?",
        "What is a cooking disaster you personally caused that was disastrously hilarious?",
        "If you had to eat only one cuisine (Italian, Mexican, Japanese, Thai, etc.) for the rest of your life, what is it?"
      ],
      hotTakes: [
        { statement: "Pineapple is genuinely elite and belongs on pizza.", context: "Culinary showdown" },
        { statement: "You should always order dessert before knowing if you have room for it.", context: "Dining priorities" },
        { statement: "Splitting the restaurant bill equally is always better than itemizing every dollar.", context: "Table etiquette" },
        { statement: "Fancy Michelin-star dining is often overrated compared to casual mom-and-pop hole-in-the-walls.", context: "Food philosophy" },
        { statement: "Brunch is the single greatest meal concept humans have ever invented.", context: "Weekend ritual" },
        { statement: "Cilantro (coriander) tastes like pure fragrant joy, not soap.", context: "Flavor genetics" }
      ],
      twoTruthsPrompts: [
        { title: "Exotic Eats", instruction: "Share 2 real strange or exotic foods you've eaten, and 1 fake food. Table has 60s to interrogate!" },
        { title: "Kitchen Mishaps", instruction: "Share 2 real cooking fails and 1 made-up kitchen disaster. Table votes on the lie!" },
        { title: "Secret Food Confessions", instruction: "Share 2 real weird food combos you secretly love, and 1 fake combo." }
      ],
      rapidFirePrompts: [
        { prompt: "Sweet or Savory?", category: "Instant Craving" },
        { prompt: "French Fries or Garlic Bread?", category: "Side Dish Battle" },
        { prompt: "Spicy Level: Mild, Medium, or Fire?", category: "Tolerance Check" },
        { prompt: "Guilty Pleasure Midnight Snack", category: "Late Night" },
        { prompt: "Coffee or Tea after dinner?", category: "Digestif" },
        { prompt: "Pizza crust: Eat it or leave it?", category: "Crust Debate" }
      ],
      deepDiveQuestions: [
        "What family recipe or childhood meal instantly transports you back in time?",
        "Tell the table about the most memorable meal of your life and who you shared it with.",
        "What is a tradition around food or dining in your culture or family that you cherish?",
        "If you could have dinner with anyone living or historical, who would you seat next to you tonight?"
      ]
    }
  },

  walk: {
    badge: "👟 Walk & Stroll Feature",
    icon: "🌿",
    title: "Walk & Talk Group Games",
    cardLabel: "Walk & Talk: Unlock on stroll",
    subtext: `During the walk or when stopping for park benches and coffee, the host taps <strong style="color: var(--cream-100);">"Unlock the game"</strong> on their phone. Share quick fun prompts, neighborhood observations, and stroll polls with your walking group!`,
    buttonBadge: "Walk Mode",
    bannerStrong: "Hold or pass phone during your walk",
    bannerSub: "quick prompt breaks and stroll polls on the go!",
    pills: [
      "🧭 Stroll Compass",
      "🌳 Park & Travel Hot Takes",
      "🤫 2 Truths & A Destination",
      "⚡ Quick-Step Rapid Fire",
      "✨ Wandering Stories"
    ],
    games: {
      compassQuestions: [
        "What is your favorite quiet park, hidden garden, or peaceful spot in this city?",
        "What's the longest walk or hike you've ever completed in a single day?",
        "If you could take a 6:00 AM sunrise walk through any city in the world tomorrow, where are you?",
        "What is the strangest or most wonderful thing you've stumbled upon while taking a spontaneous walk?",
        "What is your go-to walking soundtrack or podcast when you need to clear your mind?",
        "If you had to describe this neighborhood in three words, what would they be?",
        "What's a city or country where the pedestrian walking culture blew you away?",
        "Do you prefer walking with zero destination in mind, or having a set finish line like coffee or bagels?"
      ],
      hotTakes: [
        { statement: "Getting lost on foot in a new city beats following any sightseeing guidebook.", context: "Urban exploration" },
        { statement: "Walking in crisp morning air with a warm coffee is top-tier therapy.", context: "Morning rituals" },
        { statement: "Living within a 5-minute walk of a green park is worth living in a smaller apartment.", context: "City living" },
        { statement: "Autumn is the undisputed champion season for outdoor walks.", context: "Seasonal debate" },
        { statement: "Walking without headphones is essential for creative breakthroughs.", context: "Mindfulness" },
        { statement: "Cobblestone streets are charming until you actually have to walk on them for 2 hours.", context: "Historic charm" }
      ],
      twoTruthsPrompts: [
        { title: "Wanderlust Steps", instruction: "Share 2 real places you walked 20,000+ steps in, and 1 destination you've never visited. Table guesses the lie!" },
        { title: "Outdoor Encounters", instruction: "Share 2 real unexpected encounters with wildlife or nature, and 1 made-up story." },
        { title: "Neighborhood Quests", instruction: "Share 2 weird landmarks you've seen on walks and 1 fictional spot." }
      ],
      rapidFirePrompts: [
        { prompt: "Comfortable Sneakers or Stylish Boots?", category: "Footwear Choice" },
        { prompt: "Forest Trail or Coastal Boardwalk?", category: "Scenery Pick" },
        { prompt: "Sunrise Walk or Golden Hour Sunset?", category: "Timing" },
        { prompt: "Walk with a dog or solo with music?", category: "Vibe" },
        { prompt: "Rainy day walk: Yes with umbrella, or stay indoors?", category: "Weather Check" }
      ],
      deepDiveQuestions: [
        "Where is a spot on Earth where you felt completely at peace and connected to the world?",
        "Tell us about a time you took an unexpected detour or journey that completely changed your path.",
        "What does your ideal Saturday outdoors look like from morning to night?",
        "What is a place you walked through that made you feel like you were in a movie?"
      ]
    }
  },

  sports: {
    badge: "⚽ Active Match & Bench Feature",
    icon: "🏆",
    title: "Match Warmup & Bench Games",
    cardLabel: "Match games: Unlock at bench",
    subtext: `During pre-game warmups, halftime breathers, or post-match bench drinks, the host taps <strong style="color: var(--cream-100);">"Unlock the game"</strong> to spark lively team chemistry, athletic debates, and hilarious sports confessions!`,
    buttonBadge: "Match Mode",
    bannerStrong: "Gather at the bench or sideline huddle",
    bannerSub: "warm-up debates and post-match fun for the whole squad!",
    pills: [
      "🧭 Team Compass Spin",
      "🏆 Sports & Rivalry Hot Takes",
      "🥇 2 Truths & A Trophy",
      "⚡ Lightning Reflex Blitz",
      "💪 Epic Comeback Stories"
    ],
    games: {
      compassQuestions: [
        "What was the most clutch or heroic athletic moment of your life (real or playground)?",
        "What sport looks deceivingly easy on television but is punishingly hard in real life?",
        "What is your ultimate high-energy pump-up track right before a match or run?",
        "What was the most hilarious or embarrassing athletic blunder you've ever made?",
        "If you could possess the skills of any professional athlete in their prime for 24 hours, who?",
        "Do you prefer a hard-fought tie game or an effortless blowout win?",
        "What's the best running trail or sports field you've ever played on?"
      ],
      hotTakes: [
        { statement: "Casual friendly sports matches get ruined the second someone gets hyper-competitive.", context: "Spirit of play" },
        { statement: "Playing a sport with friends is 100x more exhilarating than watching it on TV.", context: "Active life" },
        { statement: "Morning workouts give you an unfair psychological advantage for the rest of the day.", context: "Energy boost" },
        { statement: "Running without music is an elite mental meditation.", context: "Cardio debate" },
        { statement: "The post-game cold drink or slice of pizza tastes 10x better than any normal meal.", context: "Post-match rewards" }
      ],
      twoTruthsPrompts: [
        { title: "Sports Mishaps", instruction: "Share 2 real sports injuries or fails, and 1 fake injury. Group guesses the lie!" },
        { title: "Hidden Athletic Skills", instruction: "Share 2 real random sports you're good at, and 1 totally fabricated skill." },
        { title: "Championship Memories", instruction: "Share 2 real athletic events you attended or played in, and 1 lie." }
      ],
      rapidFirePrompts: [
        { prompt: "Best Gatorade or electrolyte drink color?", category: "Hydration Battle" },
        { prompt: "Running: Distance endurance or sprinting speed?", category: "Pace Check" },
        { prompt: "Team sports or individual sports?", category: "Preference" },
        { prompt: "Stretching before or after?", category: "Routine" },
        { prompt: "Go-to post-workout meal?", category: "Recovery" }
      ],
      deepDiveQuestions: [
        "Tell the team about a time you had to push through physical exhaustion and what it taught you.",
        "What sport, activity, or teammate helped you build resilience or confidence in life?",
        "What was your favorite memory playing sports or games as a kid?"
      ]
    }
  },

  jogging: {
    badge: "🏃 Waterfront Run & Jog Feature",
    icon: "👟",
    title: "Runner's Stretch & Social Games",
    cardLabel: "Jog games: Unlock at warm-up",
    subtext: `During pre-run stretches or post-jog cooldown drinks, the host taps <strong style="color: var(--cream-100);">"Unlock the game"</strong> to share runner stories, pace philosophies, and morning motivation!`,
    buttonBadge: "Run Mode",
    bannerStrong: "Gather at the waterfront bench or stretch area",
    bannerSub: "running stories, stretch polls, and pace debates!",
    pills: [
      "🧭 Runner's Compass",
      "🏃 Running & Pace Hot Takes",
      "🤫 2 Truths & A Marathon",
      "⚡ High-Cadence Rapid Fire",
      "🌅 Sunrise Run Stories"
    ],
    games: {
      compassQuestions: [
        "What is the single best waterfront, park, or skyline route you've ever jogged?",
        "Do you run to music, podcasts, audiobooks, or pure nature soundscapes?",
        "What was your personal running milestone that made you feel invincible?",
        "What is your ultimate post-run breakfast reward?",
        "If you could jog anywhere in the world at dawn tomorrow, where is your route?"
      ],
      hotTakes: [
        { statement: "Running in cool morning drizzle is better than running on a hot sunny afternoon.", context: "Weather preference" },
        { statement: "The second mile is always the hardest; after that, you feel like flying.", context: "Runner's high" },
        { statement: "A great pair of running shoes is the best fitness investment you can ever make.", context: "Gear talk" }
      ],
      twoTruthsPrompts: [
        { title: "Running Milestones", instruction: "Share 2 real running achievements or longest runs, and 1 fabricated milestone." },
        { title: "Gear & Routines", instruction: "Share 2 real running quirks and 1 made-up ritual." }
      ],
      rapidFirePrompts: [
        { prompt: "Morning run or sunset jog?", category: "Timing" },
        { prompt: "Pavement or trail dirt?", category: "Terrain" },
        { prompt: "Water before run or gulp after?", category: "Hydration" },
        { prompt: "Smartwatch stats or run by feel?", category: "Tech" }
      ],
      deepDiveQuestions: [
        "When did running or regular movement become something you love rather than a chore?",
        "What thoughts go through your mind when you hit your runner's high?"
      ]
    }
  },

  coffee: {
    badge: "☕ Café Table Feature",
    icon: "☕",
    title: "Cozy Café & Idea Conversations",
    cardLabel: "Café games: Unlock over coffee",
    subtext: `When everyone sits down with their warm drinks, place the phone flat on the café table. Unlock cozy morning questions, coffee hot takes, and spark creative discussions with zero awkward silence!`,
    buttonBadge: "Café Mode",
    bannerStrong: "Keep phone flat on the café table",
    bannerSub: "cozy morning questions and creative discussions over coffee!",
    pills: [
      "🧭 Coffee Compass",
      "☕ Café Culture Hot Takes",
      "🤫 2 Truths & A Coffee Order",
      "⚡ Sunday Vibe Rapid Fire",
      "✨ Meaningful Horizons"
    ],
    games: {
      compassQuestions: [
        "What creative idea or side project have you been quietly daydreaming about lately?",
        "What book, podcast, or documentary completely rewired how you think about life?",
        "What is your ideal slow Sunday morning routine if you had zero deadlines or chores?",
        "What is a quirky personal obsession or hobby you could talk about for an entire hour?",
        "What was the coziest café or coffee shop you have ever stepped foot in?",
        "What is a small, unexpected purchase under $30 that genuinely made your life better?"
      ],
      hotTakes: [
        { statement: "Drinking iced coffee in the dead of winter is completely acceptable and valid.", context: "Beverage ethics" },
        { statement: "Sitting in a café reading or people-watching is a productive form of self-care.", context: "Slow living" },
        { statement: "Coffee snobs miss out on the simple pure joy of sweet vanilla syrup.", context: "Espresso debate" },
        { statement: "Physical paperback books will always be superior to Kindles and e-readers.", context: "Book lovers" },
        { statement: "Having zero plans on a Sunday morning is the ultimate modern luxury.", context: "Weekend bliss" }
      ],
      twoTruthsPrompts: [
        { title: "Caffeine & Quirks", instruction: "Share 2 real daily habits/rituals, and 1 made-up habit. Table interrogates!" },
        { title: "Creative Aspirations", instruction: "Share 2 real skills you want to learn, and 1 ridiculous fake dream." },
        { title: "Bookworm Edition", instruction: "Share 2 books you actually finished, and 1 famous book you pretended to read." }
      ],
      rapidFirePrompts: [
        { prompt: "Flat White, Cold Brew, or Matcha?", category: "Drink Pick" },
        { prompt: "Croissant or Cinnamon Roll?", category: "Pastry Showdown" },
        { prompt: "Window seat or cozy corner booth?", category: "Seating Vibe" },
        { prompt: "Morning Person or Night Owl?", category: "Rhythm" },
        { prompt: "Soundtrack for coffee: Acoustic indie or lo-fi beats?", category: "Ambience" }
      ],
      deepDiveQuestions: [
        "What is an aspiration or dream you haven't talked to many people about yet?",
        "What is a piece of advice someone gave you over a casual conversation that stuck with you forever?",
        "What does true contentment feel like to you on an ordinary weekday?"
      ]
    }
  },

  event: {
    badge: "🎲 Game Night & Party Feature",
    icon: "🎲",
    title: "Board Game Table Icebreakers",
    cardLabel: "Game night: Unlock at table",
    subtext: `Keep phone flat in the center of the board game table to kick off game night! Roll the virtual compass, debate rules lawyer dilemmas, and warm up the group before the first round!`,
    buttonBadge: "Party Mode",
    bannerStrong: "Keep phone flat in the center of the game table",
    bannerSub: "table compass and warmups before your first board game round!",
    pills: [
      "🎲 Table Compass Spin",
      "♟️ Board Game Hot Takes",
      "🃏 2 Truths & A Bluff",
      "⚡ Speed Category Blitz",
      "🏆 Epic Win/Loss Tales"
    ],
    games: {
      compassQuestions: [
        "If our table had to pull off an Ocean's Eleven-style heist tonight, what would your specific role be?",
        "What board game or card game brings out your most ruthlessly competitive side?",
        "What is a game you used to dominate everyone at when you were growing up?",
        "What is your signature gaming strategy: slow tactical planner, aggressive bluffer, or total chaos?",
        "What is the funniest or most heated argument you've ever witnessed over a board game rule?"
      ],
      hotTakes: [
        { statement: "Monopoly destroys friendships and should be retired from game night forever.", context: "Classic games" },
        { statement: "A good bluff in a game is 10x more satisfying than winning purely on luck.", context: "Strategy showdown" },
        { statement: "Reading the rulebook out loud for 30 minutes kills the buzz; just start playing!", context: "Game host dilemma" },
        { statement: "Cooperative games where everyone wins together are better than cutthroat competitive games.", context: "Game style" }
      ],
      twoTruthsPrompts: [
        { title: "Bluff Master", instruction: "Share 2 real gaming victories or blunders, and 1 fabricated bluff. Table votes on the lie!" },
        { title: "Party Tricks", instruction: "Share 2 weird talents you can perform, and 1 made-up talent." }
      ],
      rapidFirePrompts: [
        { prompt: "Dice roll or Card draw?", category: "Game Mechanic" },
        { prompt: "Strategy board game or Social deduction party game?", category: "Game Genre" },
        { prompt: "Snack while playing: Clean pretzels or risky cheese puffs?", category: "Table Etiquette" },
        { prompt: "Winner takes all or friendly rematch?", category: "Game Vibe" }
      ],
      deepDiveQuestions: [
        "Tell the table about the most legendary game night or tournament you've ever played.",
        "What is a hobby or game that taught you how to read people or communicate better?"
      ]
    }
  },

  dogwalk: {
    badge: "🐕 Paws & Park Socializer",
    icon: "🐾",
    title: "Dog Lover & Park Games",
    cardLabel: "Pup games: Unlock at park",
    subtext: `While the pups play or when stopping for treats and water breaks, tap <strong style="color: var(--cream-100);">"Unlock the game"</strong> to compare hilarious pet stories, dog breed hot takes, and puppy trivia!`,
    buttonBadge: "Pup Mode",
    bannerStrong: "Gather on the park lawn with your pups",
    bannerSub: "fun pet stories and dog lover polls for everyone!",
    pills: [
      "🧭 Pup Compass",
      "🐾 Dog Lover Hot Takes",
      "🤫 2 Truths & A Pet Mischief",
      "⚡ Furry Friend Rapid Fire",
      "❤️ Rescue & Puppy Stories"
    ],
    games: {
      compassQuestions: [
        "What is the most ridiculous or dramatic personality trait your dog (or favorite pet) possesses?",
        "If dogs could speak English for just 60 seconds, what would your dog complain about?",
        "What was the most mischievous thing a pet ever chewed up or destroyed in your home?",
        "If your dog had a human job, what profession would they work in?",
        "What is the funniest nickname you call your dog that sounds totally absurd to strangers?"
      ],
      hotTakes: [
        { statement: "Dogs have noticeably higher emotional intelligence than cats.", context: "Pet showdown" },
        { statement: "Letting your dog sleep under the duvet is totally normal and hygienic.", context: "Pet habits" },
        { statement: "Talking to your dog in an embarrassing baby voice is mandatory for good health.", context: "Dog psychology" }
      ],
      twoTruthsPrompts: [
        { title: "Pet Shenanigans", instruction: "Share 2 real naughty things your pet did, and 1 made-up mischief. Group guesses the lie!" },
        { title: "Breed Affinities", instruction: "Share 2 dog breeds you've lived with, and 1 you've never owned." }
      ],
      rapidFirePrompts: [
        { prompt: "Golden Retriever energy or French Bulldog chill?", category: "Vibe" },
        { prompt: "Tennis ball or squeaky toy?", category: "Toy of Choice" },
        { prompt: "Dog in costume on Halloween: Cute or humiliating?", category: "Pet Fashion" },
        { prompt: "Park fetch or lazy couch cuddle?", category: "Activity" }
      ],
      deepDiveQuestions: [
        "Tell us about a time your pet cheered you up when you were having a really tough day.",
        "How has having a pet in your life changed your daily habits and happiness?"
      ]
    }
  },

  nightlife: {
    badge: "🍸 Evening & Lounge Socializer",
    icon: "🎉",
    title: "Nightlife & Social Show Games",
    cardLabel: "Social games: Unlock at venue",
    subtext: `At the lounge, comedy club, or show venue, keep the vibes buzzing with party polls, wild concert hot takes, and fast nightlife trivia!`,
    buttonBadge: "Night Mode",
    bannerStrong: "Pass around the lounge or cocktail table",
    bannerSub: "party polls and high-energy nightlife trivia!",
    pills: [
      "🧭 Lounge Compass",
      "🍹 Cocktail & Music Hot Takes",
      "🤫 2 Truths & A Wild Night",
      "⚡ Midnight Rapid Fire",
      "🎶 Legendary Concert Stories"
    ],
    games: {
      compassQuestions: [
        "What is the single best live concert, DJ set, or comedy show you have ever attended?",
        "If you had to sing one karaoke song to save the entire table's lives, what track are you performing?",
        "What was the most spontaneous, unforgettable night out in your entire twenties?",
        "What is your signature evening cocktail or mocktail order?",
        "If you could party with any celebrity or musical icon for one night, who is on the VIP list?"
      ],
      hotTakes: [
        { statement: "Leaving a party without saying goodbye to anyone (the Irish Exit) is an elite move.", context: "Party etiquette" },
        { statement: "A late-night slice of pizza on the sidewalk beats any fancy sit-down restaurant.", context: "After-hours" },
        { statement: "Live music is 10x better in small, intimate underground venues than in giant stadiums.", context: "Venue debates" }
      ],
      twoTruthsPrompts: [
        { title: "VIP Encounters", instruction: "Share 2 real celebrity/performer brushes, and 1 fake brush. Table guesses the lie!" },
        { title: "Wild Nights Out", instruction: "Share 2 true spontaneous night memories, and 1 lie." }
      ],
      rapidFirePrompts: [
        { prompt: "Rooftop lounge or basement jazz bar?", category: "Venue Choice" },
        { prompt: "Dance floor champion or cozy booth conversationalist?", category: "Social Style" },
        { prompt: "Late night taco truck or 24hr diner?", category: "Late Night Bite" },
        { prompt: "DJ playlist or live band?", category: "Music Vibe" }
      ],
      deepDiveQuestions: [
        "What is a night in your life that felt like a scene out of a movie?",
        "Who is a stranger you met during a night out who left an indelible impression on you?"
      ]
    }
  },

  swimming: {
    badge: "🏊 Poolside & Sun Socializer",
    icon: "🌊",
    title: "Poolside & Summer Games",
    cardLabel: "Pool games: Unlock poolside",
    subtext: `Between pool laps or lounging on the deck chairs, unlock poolside summer polls, beach hot takes, and sun-soaked trivia!`,
    buttonBadge: "Splash Mode",
    bannerStrong: "Pass around the pool deck or lounge chairs",
    bannerSub: "poolside polls and summer trivia under the sun!",
    pills: [
      "🧭 Poolside Compass",
      "☀️ Summer & Beach Hot Takes",
      "🤫 2 Truths & A Vacation",
      "⚡ Island Vibe Rapid Fire",
      "🌊 Best Ocean Memories"
    ],
    games: {
      compassQuestions: [
        "What is the most breathtaking beach or natural swimming spot you've ever dipped into?",
        "Can you do a cannonball or a graceful dive into the pool?",
        "What's your number one tropical island or beach dream vacation?",
        "What was your childhood summer pool ritual that you miss the most?"
      ],
      hotTakes: [
        { statement: "Pool swimming is 10x more relaxing than swimming in the ocean with salty sand.", context: "Water debates" },
        { statement: "Sunscreen smell instantly triggers happy childhood nostalgia.", context: "Summer senses" },
        { statement: "Floating on a pool raft doing nothing is the highest form of summer relaxation.", context: "Chill mode" }
      ],
      twoTruthsPrompts: [
        { title: "Summer Vacations", instruction: "Share 2 real beach trips and 1 fake getaway. Group interrogates!" }
      ],
      rapidFirePrompts: [
        { prompt: "Pool or Ocean?", category: "Water Choice" },
        { prompt: "Popsicle or Ice Cream cone?", category: "Cool Down" },
        { prompt: "Sunglasses or sun hat?", category: "Sun Style" }
      ],
      deepDiveQuestions: [
        "What was the most unforgettable summer of your life, and what made it so special?"
      ]
    }
  },

  playground: {
    badge: "🎈 Family & Playground Socializer",
    icon: "🧸",
    title: "Parent & Playground Icebreakers",
    cardLabel: "Playground games: Unlock at park",
    subtext: `While the kids play at the park or sandbox, gather around the bench and unlock funny parenting confessions, kid logic debates, and easy friendly polls!`,
    buttonBadge: "Play Mode",
    bannerStrong: "Gather at the playground bench or park table",
    bannerSub: "funny parenting moments and kid-logic debates!",
    pills: [
      "🧭 Bench Compass",
      "🧸 Kid Logic Hot Takes",
      "🤫 2 Truths & A Tantrum",
      "⚡ Playground Rapid Fire",
      "✨ Sweet Family Milestones"
    ],
    games: {
      compassQuestions: [
        "What is the funniest or most absurd piece of 'kid logic' you have ever heard a child explain?",
        "What cartoon or kids movie do you secretly enjoy watching even when the kids are asleep?",
        "What was the most ridiculous reason a toddler had a meltdown in public?",
        "What playground game (swings, slide, monkey bars, tag) were you undisputed champion at as a kid?"
      ],
      hotTakes: [
        { statement: "Screen time guilt is completely unnecessary; parents need a break too.", context: "Parenting honesty" },
        { statement: "Snacks are the ultimate currency that solves 99% of playground disputes.", context: "Park diplomacy" }
      ],
      twoTruthsPrompts: [
        { title: "Parenting Confessions", instruction: "Share 2 real funny parenting or childhood mishaps, and 1 made-up story." }
      ],
      rapidFirePrompts: [
        { prompt: "Playground swings or slide?", category: "Playground Classic" },
        { prompt: "Juice box or fruit pouch?", category: "Snack Duty" },
        { prompt: "Morning park trip or late afternoon?", category: "Routine" }
      ],
      deepDiveQuestions: [
        "What is a piece of advice you would give to someone about keeping your sense of humor through chaotic days?"
      ]
    }
  },

  default: {
    badge: "✨ Social Gathering Feature",
    icon: "🎲",
    title: "Meetup Social Icebreakers",
    cardLabel: "Meetup games: Unlock at venue",
    subtext: `When everyone convenes at the gathering, the host clicks <strong style="color: var(--cream-100);">"Unlock the game"</strong> on their phone. Share engaging conversation prompts, group consensus polls, and laughter with new friends!`,
    buttonBadge: "Social Mode",
    bannerStrong: "Keep phone accessible to the group",
    bannerSub: "everyone plays and shares directly from this screen!",
    pills: [
      "🧭 Group Compass",
      "🔥 Hot Takes Poll",
      "🤫 2 Truths & Dream",
      "⚡ Rapid Fire",
      "✨ Deeper Stories"
    ],
    games: {
      compassQuestions: [
        "What is something you are secretly a total nerd about?",
        "If our group had to pull off an Ocean's Eleven-style heist tonight, what would your role be?",
        "What is the strangest or funniest interaction you've ever had with an absolute stranger?",
        "What is a hill you are 100% willing to die on?",
        "If you could teleport this entire group to any city in the world tonight, where are we going?",
        "What is the best $20 you've spent in the last 6 months?",
        "If you had to teach a 1-hour masterclass right now with zero preparation, what topic are you teaching?"
      ],
      hotTakes: [
        { statement: "Texting is superior to phone calls in 99% of situations.", context: "Modern communication" },
        { statement: "Going to cinemas alone is the peak of confidence and enjoyment.", context: "Solo independence" },
        { statement: "Living in a quiet cabin in the woods beats living in a luxury penthouse.", context: "Lifestyle choice" },
        { statement: "Having zero plans on a Friday night is better than going to a crowded party.", context: "Social battery" }
      ],
      twoTruthsPrompts: [
        { title: "Travel Edition", instruction: "Share 2 real travel memories and 1 place you have never visited. Group guesses the lie!" },
        { title: "Odd Jobs Edition", instruction: "Share 2 real jobs or gigs you've had, and 1 completely fake job." }
      ],
      rapidFirePrompts: [
        { prompt: "Sunday Morning Vibe", category: "Quick Association" },
        { prompt: "NYC in One Word", category: "Urban Life" },
        { prompt: "Guilty Pleasure TV Show", category: "Entertainment" },
        { prompt: "A Skill You Wish You Had", category: "Aspirations" }
      ],
      deepDiveQuestions: [
        "What was a turning point in your life that completely changed your trajectory?",
        "What is a lesson you had to learn the hard way that you're now genuinely grateful for?",
        "What does a truly meaningful day look like to you when nobody is watching?"
      ]
    }
  }
};

/**
 * Helper to retrieve tailored game configuration for any meetup
 */
function getMeetupGameConfig(meetup) {
  if (!meetup) return CATEGORY_GAMES_CONFIG["default"];
  const cat = (meetup.category || "").toLowerCase();
  if (CATEGORY_GAMES_CONFIG[cat]) {
    return CATEGORY_GAMES_CONFIG[cat];
  }
  const title = (meetup.title || "").toLowerCase();
  if (title.includes("walk") || title.includes("stroll")) return CATEGORY_GAMES_CONFIG["walk"];
  if (title.includes("soccer") || title.includes("sport") || title.includes("run") || title.includes("jog")) return CATEGORY_GAMES_CONFIG["sports"];
  if (title.includes("coffee") || title.includes("café") || title.includes("cafe")) return CATEGORY_GAMES_CONFIG["coffee"];
  if (title.includes("dinner") || title.includes("lunch") || title.includes("dining") || title.includes("food") || title.includes("brunch")) return CATEGORY_GAMES_CONFIG["dining"];
  if (title.includes("game") || title.includes("board")) return CATEGORY_GAMES_CONFIG["event"];
  if (title.includes("party") || title.includes("night") || title.includes("show")) return CATEGORY_GAMES_CONFIG["nightlife"];
  if (title.includes("dog") || title.includes("pet")) return CATEGORY_GAMES_CONFIG["dogwalk"];
  if (title.includes("swim") || title.includes("pool")) return CATEGORY_GAMES_CONFIG["swimming"];
  if (title.includes("play") || title.includes("parent") || title.includes("kid")) return CATEGORY_GAMES_CONFIG["playground"];

  return CATEGORY_GAMES_CONFIG["default"];
}

if (typeof window !== "undefined") {
  window.MEETUPS_DATA = MEETUPS_DATA;
  window.PROFILES_DATA = PROFILES_DATA;
  window.QUIZ_STEPS = QUIZ_STEPS;
  window.MOCK_CHAT_MESSAGES = MOCK_CHAT_MESSAGES;
  window.COMMUNITY_TESTIMONIALS = COMMUNITY_TESTIMONIALS;
  window.HOST_CURATED_PHOTOS = HOST_CURATED_PHOTOS;
  window.STORAGE_KEY_HOSTED_MEETUPS = STORAGE_KEY_HOSTED_MEETUPS;
  window.getStoredHostedMeetups = getStoredHostedMeetups;
  window.saveHostedMeetup = saveHostedMeetup;
  window.MEETUP_GAMES_DATA = MEETUP_GAMES_DATA;
  window.CATEGORY_GAMES_CONFIG = CATEGORY_GAMES_CONFIG;
  window.getMeetupGameConfig = getMeetupGameConfig;
  window.MEETUP_DAY_OFFSETS = MEETUP_DAY_OFFSETS;
  window.getLocalDateString = getLocalDateString;
  window.calculate4DayBookingWindow = calculate4DayBookingWindow;
  window.syncMeetupsTo4DayWindow = syncMeetupsTo4DayWindow;
  window.LIVE_4_DAY_WINDOW = LIVE_4_DAY_WINDOW;
  window.MEETUP_CODES = MEETUP_CODES;
  window.generateMeetupCode = generateMeetupCode;
  window.ALL_COUNTRIES_195 = ALL_COUNTRIES_195;
  window.LOCATION_PRESETS = LOCATION_PRESETS;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ALL_COUNTRIES_195,
    MEETUPS_DATA,
    PROFILES_DATA,
    QUIZ_STEPS,
    LOCATION_PRESETS,
    MOCK_CHAT_MESSAGES,
    COMMUNITY_TESTIMONIALS,
    HOST_CURATED_PHOTOS,
    STORAGE_KEY_HOSTED_MEETUPS,
    getStoredHostedMeetups,
    saveHostedMeetup,
    MEETUP_GAMES_DATA,
    CATEGORY_GAMES_CONFIG,
    getMeetupGameConfig,
    MEETUP_DAY_OFFSETS,
    MEETUP_CODES,
    generateMeetupCode,
    getLocalDateString,
    calculate4DayBookingWindow,
    syncMeetupsTo4DayWindow,
    LIVE_4_DAY_WINDOW
  };
}
