// Site Configuration - AnthemHenderson.com
// Brand: Anthem Henderson | Homes By Dr. Jan Duffy

export const siteConfig = {
  name: "Anthem Henderson | Homes By Dr. Jan Duffy",
  fullName: "Berkshire Hathaway HomeServices Nevada Properties",
  tagline: "Anthem Henderson | Homes By Dr. Jan Duffy",
  /** Full brand line for titles and OG */
  brandLine: "Anthem Henderson | Homes By Dr. Jan Duffy",
  brandName: "Anthem Henderson | Homes By Dr. Jan Duffy",
  shortName: "Anthem Henderson",
  url: "https://anthemhenderson.com",
  description:
    "Anthem Henderson | Homes By Dr. Jan Duffy — search Sun City Anthem, Solera, Anthem Country Club, and Anthem Highlands. BHHS Nevada Properties.",
};

export const agentInfo = {
  name: "Dr. Jan Duffy",
  title: "REALTOR®",
  license: "S.0197614.LLC",
  /** Client-facing CTA line */
  phone: "(702) 222-1964",
  phoneFormatted: "(702) 222-1964",
  phoneTel: "tel:+17022221964",
  /** Professional / FUB line — not for public CTAs */
  phoneProfessional: "(702) 500-1942",
  email: "homes@heyberkshire.com",
  brokerage: "Berkshire Hathaway HomeServices Nevada Properties",
};

export const officeInfo = {
  name: "Berkshire Hathaway HomeServices Nevada Properties",
  address: {
    street: "9406 W Lake Mead Blvd, Suite 100",
    city: "Las Vegas",
    state: "NV",
    zip: "89134",
    full: "9406 W Lake Mead Blvd, Suite 100, Las Vegas, NV 89134",
  },
  coordinates: {
    lat: 36.1893,
    lng: -115.2821,
  },
  phone: "(702) 222-1964",
  phoneTel: "tel:+17022221964",
};

// Market Statistics (Updated January 2026) — metro context; call for live Anthem comps
export const marketStats = {
  lastUpdated: "January 2026",
  lasVegas: {
    medianPrice: 450000,
    medianPriceFormatted: "$450,000",
    yearOverYearChange: "+4.2%",
    daysOnMarket: 28,
    activeListings: 4850,
    closedSales: 2340,
    inventoryMonths: 2.1,
  },
  henderson: {
    medianPrice: 485000,
    medianPriceFormatted: "$485,000",
    yearOverYearChange: "+5.1%",
    daysOnMarket: 24,
    activeListings: 1280,
  },
  summerlin: {
    medianPrice: 625000,
    medianPriceFormatted: "$625,000",
    yearOverYearChange: "+6.8%",
    daysOnMarket: 22,
    luxuryMedian: 1200000,
    luxuryMedianFormatted: "$1.2M",
  },
  luxury: {
    medianPrice: 1200000,
    medianPriceFormatted: "$1.2M",
    activeListings: 890,
    daysOnMarket: 45,
    pricePerSqFt: 385,
  },
};

// Agent Stats
export const agentStats = {
  servingSince: 2008,
  transactionsClosed: 500,
  volumeClosed: "$127M+",
  averageRating: 4.9,
  reviewCount: 200,
};

// Value Propositions
export const valuePropositions = {
  main: "When you work with a Berkshire Hathaway HomeServices agent, you're backed by a name synonymous with trust, ethical standards, and financial strength—the same principles that built Warren Buffett's empire.",
  trust:
    "Berkshire Hathaway HomeServices is the only real estate brand backed by Warren Buffett's Berkshire Hathaway Inc. This means unmatched financial stability, ethical standards, and a global referral network of 50,000+ agents.",
  expertise:
    "Serving Las Vegas since 2008 with $127M+ in closed transactions, Dr. Jan Duffy combines deep local market knowledge with the resources of a global brand — including Anthem Henderson's 55+, golf, and foothill neighborhoods.",
};

// Anthem Henderson sub-communities (primary focus for this site)
export const anthemCommunities = [
  {
    name: "Sun City Anthem",
    slug: "sun-city-anthem",
    description: "Del Webb 55+ active adult community with recreation centers, golf, and resort amenities",
    highlights: ["55+ active adult", "7,000+ homes", "Multiple rec centers", "Golf & pickleball"],
  },
  {
    name: "Solera at Anthem",
    slug: "solera-at-anthem",
    description: "Boutique guard-gated 55+ community with clubhouse, pools, and fitness",
    highlights: ["55+ guard-gated", "~1,000–1,800 homes", "Clubhouse & pools", "Lower scale than SCA"],
  },
  {
    name: "Anthem Country Club",
    slug: "anthem-country-club",
    description: "Guard-gated luxury golf community with custom and semi-custom estates",
    highlights: ["24/7 guard-gated", "Golf course living", "Custom estates", "Luxury inventory"],
  },
  {
    name: "Anthem Highlands",
    slug: "anthem-highlands",
    description: "Established single-family neighborhoods with foothill and valley views",
    highlights: ["Single-family homes", "Foothill setting", "Trail access", "Henderson location"],
  },
];

// Neighborhoods served
export const neighborhoods = [
  {
    name: "Anthem",
    slug: "anthem",
    description: "Henderson's largest master-planned community on the McCullough Range foothills",
    medianPrice: "Call for comps",
    highlights: ["4,775 acres", "14,000+ homes", "55+ & luxury options", "Sloan Canyon access"],
  },
  {
    name: "Henderson",
    slug: "henderson",
    description: "Nevada's second-largest city with master-planned communities and Lake Las Vegas",
    medianPrice: "$485,000",
    highlights: ["Master-planned communities", "Lake Las Vegas", "Green Valley", "Anthem"],
  },
  {
    name: "Summerlin",
    slug: "summerlin",
    description: "Master-planned community with parks, trails, and golf",
    medianPrice: "$625,000",
    highlights: ["Red Rock views", "150+ parks", "Golf courses", "Village living"],
  },
  {
    name: "Green Valley",
    slug: "green-valley",
    description: "Established Henderson community with mature landscaping",
    medianPrice: "$520,000",
    highlights: ["Golf courses", "Walking trails", "Shopping", "Parks"],
  },
  {
    name: "The Ridges",
    slug: "the-ridges",
    description: "Ultra-luxury guard-gated community in Summerlin",
    medianPrice: "$2.5M",
    highlights: ["Celebrity homes", "Custom estates", "Bear's Best Golf", "Strip views"],
  },
  {
    name: "Southern Highlands",
    slug: "southern-highlands",
    description: "Master-planned luxury community with championship golf",
    medianPrice: "$750,000",
    highlights: ["Golf community", "Guard-gated", "Mountain views", "Luxury amenities"],
  },
  {
    name: "Inspirada",
    slug: "inspirada",
    description: "Henderson master-planned community with resort-style living",
    medianPrice: "$525,000",
    highlights: ["Resort pools", "Walking trails", "New construction", "Village amenities"],
  },
  {
    name: "MacDonald Highlands",
    slug: "macdonald-highlands",
    description: "Henderson guard-gated luxury community",
    medianPrice: "Call for comps",
    highlights: ["Guard-gated", "Luxury estates", "Golf", "Henderson foothills"],
  },
];

// Services offered
export const services = [
  {
    name: "Home Buying",
    slug: "buyers",
    description: "Expert guidance through every step of the home buying process",
    icon: "Home",
  },
  {
    name: "Home Selling",
    slug: "sellers",
    description: "Maximize your home's value with professional marketing and negotiation",
    icon: "TrendingUp",
  },
  {
    name: "Luxury Homes",
    slug: "luxury-homes",
    description: "Specialized expertise in Las Vegas luxury real estate",
    icon: "Star",
  },
  {
    name: "New Construction",
    slug: "new-construction",
    description: "Free buyer representation for new home purchases",
    icon: "Building",
  },
  {
    name: "Investment Properties",
    slug: "investment-properties",
    description: "Strategic consulting for rental and investment opportunities",
    icon: "DollarSign",
  },
  {
    name: "Relocation",
    slug: "relocation",
    description: "Comprehensive relocation assistance for moves to Las Vegas",
    icon: "Truck",
  },
  {
    name: "Home Valuation",
    slug: "home-valuation",
    description: "Free property valuations using current market data",
    icon: "Calculator",
  },
  {
    name: "Market Analysis",
    slug: "market-report",
    description: "In-depth Las Vegas real estate market insights",
    icon: "BarChart",
  },
];

// Expert quotes from Dr. Jan Duffy
export const expertQuotes = {
  market: `"Anthem buyers need sub-community clarity first — Sun City Anthem, Solera, Country Club, and Highlands price and live very differently. I pull live comps by floor plan and lot before anyone tours."`,
  buyers: `"My job isn't just to show you houses—it's to make sure you don't overpay, that you understand what you're buying, and that you're protected through every step of the transaction."`,
  sellers: `"Pricing your home correctly from day one is the single most important factor in getting top dollar. Overpriced homes sit, and every day on market costs you money."`,
  luxury: `"Luxury buyers expect discretion, market expertise, and flawless execution. In this price range, one wrong move can cost hundreds of thousands of dollars."`,
  investment: `"Las Vegas rental yields are among the best in the country right now. But you need to know which neighborhoods are appreciating and which have peaked."`,
  relocation: `"Moving to a new city is stressful enough. I handle everything from neighborhood tours to contractor referrals so you can focus on your new beginning."`,
  newConstruction: `"Builders have sales agents who work for them, not you. Having your own representation costs you nothing but can save you tens of thousands in upgrades and negotiations."`,
  valueProposition: `"When clients ask why they should choose a Berkshire Hathaway HomeServices agent, I tell them: you're not just getting me—you're getting a global network of 50,000 agents, world-class marketing, and a brand that's synonymous with trust."`,
};

// Common FAQs
export const commonFAQs = {
  general: [
    {
      question: "Why should I choose a Berkshire Hathaway HomeServices agent?",
      answer:
        "Berkshire Hathaway HomeServices is the only real estate brand backed by Warren Buffett's Berkshire Hathaway Inc. This means unmatched financial stability, ethical standards, and a global referral network of 50,000+ agents. When you're making the biggest purchase of your life, that trust matters.",
    },
    {
      question: "What areas does Berkshire Hathaway HomeServices Nevada Properties cover?",
      answer:
        "BHHS Nevada Properties serves all of Las Vegas, Henderson, North Las Vegas, and surrounding areas, with specialized expertise in Anthem Henderson, Summerlin, The Ridges, Skye Canyon, Southern Highlands, Green Valley, and Henderson's master-planned communities.",
    },
    {
      question: "How do Berkshire Hathaway HomeServices agents get paid?",
      answer:
        "Commission structures are negotiable. Dr. Jan Duffy offers transparent pricing and will walk you through all costs before you sign anything. For buyers, our services are typically free as commissions are paid by the seller.",
    },
    {
      question: "What is Dr. Jan Duffy's experience in Las Vegas real estate?",
      answer:
        "Dr. Jan Duffy has been serving Las Vegas since 2008, with $127M+ in closed transactions and 500+ satisfied clients. Her expertise spans residential, luxury, investment, and new construction properties throughout Southern Nevada.",
    },
  ],
  buying: [
    {
      question: "How long does the home buying process take in Las Vegas?",
      answer:
        "Typically 30-45 days from offer acceptance to closing. Cash purchases can close in as little as 7-14 days. The timeline depends on financing, inspections, and other contingencies.",
    },
    {
      question: "Do I need a pre-approval before looking at homes?",
      answer:
        "Yes, a pre-approval letter is essential. It shows sellers you're serious and gives you a clear budget. Dr. Jan can connect you with trusted local lenders who offer competitive rates.",
    },
    {
      question: "How much do I need for a down payment?",
      answer:
        "Down payment requirements vary: FHA loans require 3.5%, conventional loans typically 3-20%, and VA/USDA loans may require 0% down. Dr. Jan can connect you with lenders who specialize in various loan programs.",
    },
  ],
  selling: [
    {
      question: "What is my home worth in today's Las Vegas market?",
      answer:
        "Home values depend on location, condition, size, and recent comparable sales. Dr. Jan provides free, comprehensive home valuations using current MLS data and her expertise serving Las Vegas since 2008.",
    },
    {
      question: "How long will it take to sell my home?",
      answer:
        "Currently, well-priced homes in Las Vegas are selling in an average of 28 days. Luxury homes may take longer (45+ days). Pricing strategy is crucial—overpriced homes can sit for months.",
    },
    {
      question: "What do I need to do to prepare my home for sale?",
      answer:
        "Dr. Jan provides a personalized preparation checklist for every listing. Generally, decluttering, minor repairs, fresh paint, and professional photography are the highest-ROI improvements.",
    },
  ],
};
