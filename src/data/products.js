export const CATEGORIES = [
  { id: 'all', name: 'All Products & Refills', icon: 'Sparkles' },
  { id: 'bottles', name: 'Ergonomic Bottles (2L)', icon: 'Droplets' },
  { id: 'pouches', name: 'Eco Spout Refill Pouches', icon: 'Package' },
  { id: 'funwash', name: 'Fun Wash™ Value Packs', icon: 'Zap' },
  { id: 'combos', name: 'Super Saver Combos', icon: 'Layers' }
];

export const PRODUCTS = [
  {
    id: "wm-blue-ocean",
    sku: "WM-LD-2L-BLU",
    modelNumber: "WM-OF2000",
    name: "White Mist Ocean Fresh Liquid Detergent",
    category: "bottles",
    categoryName: "Ergonomic Bottles (2L)",
    tagline: "Deep Bio-Clean & 48-Hour Sea Breeze Scent Lock",
    color: "blue",
    accentColor: "#0084FF",
    bgGradient: "linear-gradient(135deg, #E6F3FF 0%, #FFFFFF 100%)",
    badge: "Bestseller",
    rating: 4.9,
    reviewsCount: 1420,
    price: 349,
    mrp: 499,
    capacity: "2L / 2kg",
    energyRating: "Front & Top Load",
    waterConsumption: "Low Foam Tech",
    noiseLevel: "Color Safe",
    washPrograms: 40,
    warrantyYears: 2,
    description: "Premium bio-enzyme liquid laundry detergent engineered for both Front Load and Top Load washing machines. Removes 10x tough mud, oil, and sweat stains while locking in a fresh sea-breeze fragrance for 48 hours.",
    formats: [
      { id: "bot-2l", name: "2L Ergonomic Handle Bottle", price: 349, mrp: 499, discount: "30% OFF", image: "/assets/images/bottle_blue.png", doses: 40 },
      { id: "pouch-2l", name: "2kg Eco Spout Refill Pouch", price: 289, mrp: 399, discount: "27% OFF", image: "/assets/images/pouch_blue.png", doses: 40 }
    ],
    features: [
      "10x Bio-Enzyme Stain Dissolving Action",
      "Front Load & Top Load Washing Machine Safe",
      "48-Hour Micro-Capsule Fragrance Lock",
      "Color Guard Technology Prevents Fading"
    ],
    specs: [
      { name: "Net Quantity", value: "2 Litres / 2 Kg" },
      { name: "Machine Compatibility", value: "Front & Top Loading Machines" },
      { name: "Fragrance Profile", value: "Ocean Breeze Freshness" },
      { name: "Doses Per Pack", value: "40 Full Load Washes" }
    ]
  },
  {
    id: "wm-pink-floral",
    sku: "WM-LD-2L-PNK",
    modelNumber: "WM-FB2000",
    name: "White Mist Floral Bloom Liquid Detergent",
    category: "bottles",
    categoryName: "Ergonomic Bottles (2L)",
    tagline: "Rose Elegance Scent & Luxurious Fabric Touch",
    color: "pink",
    accentColor: "#F01262",
    bgGradient: "linear-gradient(135deg, #FFEBF2 0%, #FFFFFF 100%)",
    badge: "Top Rated",
    rating: 4.95,
    reviewsCount: 980,
    price: 349,
    mrp: 499,
    capacity: "2L / 2kg",
    energyRating: "Front & Top Load",
    waterConsumption: "Fabric Softener",
    noiseLevel: "Gentle Care",
    washPrograms: 40,
    warrantyYears: 2,
    description: "Enriched with natural floral essential oils and fabric conditioners. Keeps whites glowing white and colors vivid while leaving your clothes velvet-soft with a captivating rose bouquet fragrance.",
    formats: [
      { id: "bot-2l", name: "2L Ergonomic Handle Bottle", price: 349, mrp: 499, discount: "30% OFF", image: "/assets/images/bottle_pink.png", doses: 40 },
      { id: "pouch-2l", name: "2kg Eco Spout Refill Pouch", price: 289, mrp: 399, discount: "27% OFF", image: "/assets/images/pouch_pink.png", doses: 40 }
    ],
    features: [
      "Infused with Rose & Floral Botanical Extracts",
      "Built-in Fabric Softening & Fabric Guard",
      "Phosphate-Free Gentle on Sensitive Skin",
      "Dissolves 100% in Cold & Hot Water"
    ],
    specs: [
      { name: "Net Quantity", value: "2 Litres / 2 Kg" },
      { name: "Machine Compatibility", value: "Front & Top Loading Machines" },
      { name: "Fragrance Profile", value: "Pink Floral Bouquet" },
      { name: "Doses Per Pack", value: "40 Full Load Washes" }
    ]
  },
  {
    id: "wm-yellow-citrus",
    sku: "WM-LD-2L-YLW",
    modelNumber: "WM-CS2000",
    name: "White Mist Citrus Sunshine Liquid Detergent",
    category: "bottles",
    categoryName: "Ergonomic Bottles (2L)",
    tagline: "10x Tough Oil & Grease Destroyer with Lemon Zest",
    color: "yellow",
    accentColor: "#D97706",
    bgGradient: "linear-gradient(135deg, #FFFDE6 0%, #FFFFFF 100%)",
    badge: "Tough Stain Pick",
    rating: 4.88,
    reviewsCount: 1250,
    price: 349,
    mrp: 499,
    capacity: "2L / 2kg",
    energyRating: "Front & Top Load",
    waterConsumption: "Degreasing Formula",
    noiseLevel: "Antibacterial",
    washPrograms: 40,
    warrantyYears: 2,
    description: "Formulated with active citrus degreasers to eliminate oily collar grease, food splatters, and stubborn odor-causing bacteria instantly without pre-soaking.",
    formats: [
      { id: "bot-2l", name: "2L Ergonomic Handle Bottle", price: 349, mrp: 499, discount: "30% OFF", image: "/assets/images/bottle_yellow.png", doses: 40 },
      { id: "pouch-2l", name: "2kg Eco Spout Refill Pouch", price: 289, mrp: 399, discount: "27% OFF", image: "/assets/images/pouch_yellow.png", doses: 40 }
    ],
    features: [
      "Citrus Degreasing Enzymes for Collar & Cuff Grease",
      "99.9% Odor-Causing Bacteria Elimination",
      "High Effiency Low Suicing Liquid Technology",
      "Eco Spout Pouch & Ergonomic Bottle Formats"
    ],
    specs: [
      { name: "Net Quantity", value: "2 Litres / 2 Kg" },
      { name: "Machine Compatibility", value: "Front & Top Loading Machines" },
      { name: "Fragrance Profile", value: "Citrus Lemon Sunshine" },
      { name: "Doses Per Pack", value: "40 Full Load Washes" }
    ]
  },
  {
    id: "funwash-liquid-2kg",
    sku: "FW-LD-2KG-SPOUT",
    modelNumber: "FW-SP2000",
    name: "Fun Wash™ Liquid Detergent 2kg Spout Pouch",
    category: "funwash",
    categoryName: "Fun Wash™ Value Packs",
    tagline: "High Quality Laundry Detergent • Special ₹99 Offer Pack",
    color: "yellow",
    accentColor: "#EAB308",
    bgGradient: "linear-gradient(135deg, #FEF08A 0%, #FFFFFF 100%)",
    badge: "₹99 Special Offer",
    rating: 4.92,
    reviewsCount: 3100,
    price: 99,
    mrp: 199,
    capacity: "2kg Pouch",
    energyRating: "Front & Top Load",
    waterConsumption: "High Efficiency",
    noiseLevel: "Value King",
    washPrograms: 40,
    warrantyYears: 1,
    description: "Mega Value 2kg Spout Refill Pouch by Fun Wash™. Designed for daily laundry, removing tough dirt effortlessly while staying ultra-gentle on your pocket at just ₹99!",
    formats: [
      { id: "pouch-2kg", name: "2kg Eco Spout Refill Pouch", price: 99, mrp: 199, discount: "50% OFF", image: "/assets/images/pouch_yellow_lifestyle.jpg", doses: 40 }
    ],
    features: [
      "Super Saver Offer Pack at ₹99 Only!",
      "Easy Pour Spout with Screw Cap Leak Protection",
      "Works in All Front Load & Top Load Washing Machines",
      "Softens Fabric and Leaves Fresh Long-Lasting Fragrance"
    ],
    specs: [
      { name: "Net Quantity", value: "2 Kg Spout Pouch" },
      { name: "Price Offer", value: "₹99 Special Launch Price" },
      { name: "Compatibility", value: "Front & Top Load Washing Machines" }
    ]
  },
  {
    id: "wm-combo-twin-bottles",
    sku: "WM-COMBO-TWIN-BOT",
    modelNumber: "WM-CB4000",
    name: "White Mist Twin Bottle Super Saver Pack (4L)",
    category: "combos",
    categoryName: "Super Saver Combos",
    tagline: "2x 2L Bottles (Ocean Blue + Floral Pink Combo)",
    color: "blue",
    accentColor: "#3F1B85",
    bgGradient: "linear-gradient(135deg, #E0E7FF 0%, #FFFFFF 100%)",
    badge: "Mega Combo",
    rating: 4.97,
    reviewsCount: 850,
    price: 649,
    mrp: 998,
    capacity: "4L Total",
    energyRating: "Front & Top Load",
    waterConsumption: "Best Value",
    noiseLevel: "Free Shipping",
    washPrograms: 80,
    warrantyYears: 2,
    description: "Get 4 Litres of premium laundry care! Includes 1x 2L Ocean Fresh Bottle + 1x 2L Floral Bloom Bottle. Complete 80-wash solution with maximum savings.",
    formats: [
      { id: "twin-bot-4l", name: "2x 2L Bottle Twin Pack", price: 649, mrp: 998, discount: "35% OFF", image: "/assets/images/bottle_blue.png", doses: 80 }
    ],
    features: [
      "Includes 2 Full Size 2L Ergonomic Bottles",
      "Dual Fragrance Experience (Ocean Fresh & Floral Bloom)",
      "Free Nationwide Delivery Unlocked",
      "Saves ₹349 Compared to MRP"
    ],
    specs: [
      { name: "Combo Contents", value: "2L Ocean Blue + 2L Floral Pink" },
      { name: "Total Washes", value: "80 Full Load Washes" }
    ]
  },
  {
    id: "wm-combo-pouch-duo",
    sku: "WM-COMBO-POUCH-DUO",
    modelNumber: "WM-CP4000",
    name: "White Mist Eco Spout Refill Pouch Duo (4kg)",
    category: "combos",
    categoryName: "Super Saver Combos",
    tagline: "2x 2kg Eco Spout Refill Pouches (Yellow + Pink)",
    color: "pink",
    accentColor: "#F01262",
    bgGradient: "linear-gradient(135deg, #FCE7F3 0%, #FFFFFF 100%)",
    badge: "Eco Saver",
    rating: 4.93,
    reviewsCount: 620,
    price: 539,
    mrp: 798,
    capacity: "4kg Total",
    energyRating: "Front & Top Load",
    waterConsumption: "Eco Friendly",
    noiseLevel: "Zero Plastic Waste",
    washPrograms: 80,
    warrantyYears: 2,
    description: "80% Less Plastic Packaging! Contains 2x 2kg Spout Refill Pouches (Citrus Sunshine + Floral Bloom). Easy to pour directly into your reusable White Mist bottles.",
    formats: [
      { id: "pouch-duo-4kg", name: "2x 2kg Eco Spout Pouch Duo", price: 539, mrp: 798, discount: "32% OFF", image: "/assets/images/pouch_pink.png", doses: 80 }
    ],
    features: [
      "Includes 2x 2kg Eco Spout Refill Pouches",
      "Smart Spout Design with Spill-Proof Cap",
      "Reduces Household Plastic Footprint by 80%",
      "Maximum Value for Daily Household Laundry"
    ],
    specs: [
      { name: "Combo Contents", value: "2kg Citrus Yellow + 2kg Floral Pink" },
      { name: "Total Washes", value: "80 Full Load Washes" }
    ]
  }
];

export const SUPER_SAVER_BUNDLE = {
  id: "wm-super-bundle-laundry",
  title: "White Mist 4kg Mega Saver Laundry Bundle",
  subtitle: "2L Bottle + 2kg Refill Pouch + Free Measuring Cap",
  price: 599,
  mrp: 898,
  savings: "Save ₹299 (33% OFF)",
  image: "/assets/images/bottle_blue.png"
};

export const REVIEWS = [
  {
    id: 1,
    author: "Sunita Deshmukh",
    role: "Verified Buyer",
    city: "Mumbai",
    rating: 5,
    comment: "White Mist Ocean Fresh liquid detergent is fantastic for our front load machine! Dirty cuffs and grease stains wash out easily without scrubbing.",
    date: "2 days ago"
  },
  {
    id: 2,
    author: "Priya Sharma",
    role: "Verified Buyer",
    city: "Delhi NCR",
    rating: 5,
    comment: "The Fun Wash ₹99 2kg pouch offer is unbeatable! Amazing lather, fresh smell, and so economical for daily family laundry.",
    date: "1 week ago"
  },
  {
    id: 3,
    author: "Ananya Iyer",
    role: "Verified Buyer",
    city: "Bangalore",
    rating: 5,
    comment: "Love the Pink Floral Bloom bottle. Leaves clothes so soft and smelling like fresh roses even 2 days after washing.",
    date: "2 weeks ago"
  }
];

export const PROMO_CODES = {
  "MISTWELCOME10": { discount: 10, type: "percent", desc: "10% Welcome Discount" },
  "WHITEMIST2026": { discount: 100, type: "flat", desc: "₹100 Flat Savings" },
  "FUNWASH99": { discount: 50, type: "flat", desc: "₹50 Extra Off on Fun Wash" }
};
