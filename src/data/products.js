export const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: 'Sparkles' },
  { id: 'detergents', name: 'Liquid Detergents', icon: 'Droplets' },
  { id: 'pouches', name: 'Eco Refill Pouches', icon: 'Leaf' },
  { id: 'softeners', name: 'Fabric Conditioners', icon: 'HeartHandshake' },
  { id: 'boosters', name: 'Stain Boosters', icon: 'Zap' },
  { id: 'combos', name: 'Value Saver Combos', icon: 'Package' }
];

export const PRODUCTS = [
  {
    id: "wm-blue-ocean",
    name: "White Mist Ocean Fresh Liquid Detergent",
    category: "detergents",
    categoryName: "Liquid Detergent",
    tagline: "Deep Clean & Crisp Ocean Breeze",
    color: "blue",
    accentColor: "#0084FF",
    bgGradient: "linear-gradient(135deg, #E6F3FF 0%, #FFFFFF 100%)",
    badge: "Bestseller",
    rating: 4.9,
    reviewsCount: 1420,
    description: "Formulated with advanced bio-enzymes that penetrate deep into fabric fibers to remove 10x tough stains. Leaves clothes with a refreshing 48-hour ocean breeze fragrance.",
    formats: [
      { id: "bot-2l", name: "2L Ergonomic Bottle", price: 349, mrp: 499, discount: "30% OFF", image: "/assets/images/bottle_blue.png", doses: 50 },
      { id: "pouch-2kg", name: "2kg Eco Refill Pouch", price: 289, mrp: 420, discount: "31% OFF", image: "/assets/images/pouch_blue.png", doses: 50 },
      { id: "bot-1l", name: "1L Starter Pack", price: 189, mrp: 260, discount: "27% OFF", image: "/assets/images/bottle_blue.png", doses: 25 }
    ],
    features: [
      "10x Bio-Enzyme Deep Clean Action",
      "Front & Top Load Washing Machine Approved",
      "Micro-Capsule 48-Hour Ocean Freshness",
      "Fabric Softening & Fiber Protection"
    ],
    fragranceNotes: ["Top: Fresh Citrus & Sea Spray", "Heart: White Jasmine & Water Lily", "Base: Clean Musk & Cedarwood"],
    ingredients: "Aqua, Non-ionic Surfactants (15-30%), Anionic Surfactants (5-15%), Bio-Enzyme Complex (Protease, Amylase, Lipase), Optical Brighteners, Fragrance Micro-capsules.",
    howToUse: {
      regular: "1 Cap (40ml) for standard load (5-6 kg)",
      heavy: "1.5 Caps (60ml) for heavily soiled / large load (8 kg+)",
      handwash: "0.5 Cap (20ml) dissolved in 10L bucket water"
    }
  },
  {
    id: "wm-pink-floral",
    name: "White Mist Floral Bloom Liquid Detergent",
    category: "detergents",
    categoryName: "Liquid Detergent",
    tagline: "Rose Elegance & Delicate Fabric Care",
    color: "pink",
    accentColor: "#F01262",
    bgGradient: "linear-gradient(135deg, #FFEBF2 0%, #FFFFFF 100%)",
    badge: "Most Fragrant",
    rating: 4.85,
    reviewsCount: 980,
    description: "Infused with french rose and lavender essential oil micro-beads. Specially crafted for delicates, silks, cottons, and baby clothes, delivering silkiness with every wash.",
    formats: [
      { id: "bot-2l", name: "2L Ergonomic Bottle", price: 359, mrp: 510, discount: "30% OFF", image: "/assets/images/bottle_pink.png", doses: 50 },
      { id: "pouch-2kg", name: "2kg Eco Refill Pouch", price: 299, mrp: 430, discount: "30% OFF", image: "/assets/images/pouch_pink.png", doses: 50 },
      { id: "bot-1l", name: "1L Starter Pack", price: 195, mrp: 270, discount: "28% OFF", image: "/assets/images/bottle_pink.png", doses: 25 }
    ],
    features: [
      "Dermatologically Safe & Paraben-Free",
      "Ultra Fabric Conditioner Blend Included",
      "Zero Fabric Color Fading Guarantee",
      "Low-Foam Formula for Front Loading Savings"
    ],
    fragranceNotes: ["Top: Rose Petals & Pink Apple", "Heart: Lavender & Peony", "Base: Soft Vanilla & Creamy Sandalwood"],
    ingredients: "Purified Water, Plant-Derived Bio-Surfactants, French Essential Oils, Silk Amino Acid Extract, Anti-Color Transfer Agents.",
    howToUse: {
      regular: "1 Cap (40ml) for normal laundry",
      heavy: "1.5 Caps (60ml) for fluffy towels & bedsheets",
      handwash: "0.5 Cap (20ml) for delicate hand wash"
    }
  },
  {
    id: "wm-yellow-citrus",
    name: "White Mist Citrus Sunshine Liquid Detergent",
    category: "detergents",
    categoryName: "Liquid Detergent",
    tagline: "Tough Stain Destroyer & Sunshine Zing",
    color: "yellow",
    accentColor: "#D97706",
    bgGradient: "linear-gradient(135deg, #FFFDE6 0%, #FFFFFF 100%)",
    badge: "Super Value 2kg",
    rating: 4.92,
    reviewsCount: 1850,
    description: "High-power lemon and zesty citrus formula engineered to eliminate grease, oil, food stains, curry, and sweat odor. Ideal for activewear, school uniforms, and heavy-duty laundry.",
    formats: [
      { id: "bot-2l", name: "2kg Heavy Duty Bottle", price: 349, mrp: 499, discount: "30% OFF", image: "/assets/images/bottle_yellow.png", doses: 50 },
      { id: "pouch-2kg", name: "2kg Super Value Pouch", price: 279, mrp: 399, discount: "30% OFF", image: "/assets/images/pouch_yellow.png", doses: 50 },
      { id: "pouch-prem", name: "2kg Lifestyle Pack", price: 319, mrp: 450, discount: "29% OFF", image: "/assets/images/pouch_yellow_lifestyle.jpg", doses: 50 }
    ],
    features: [
      "Citrus Active Oil Dissolver Tech",
      "Stain Target Bio-Protease Action",
      "Anti-Graying Fabric Brightening",
      "100% Biodegradable & Environment Friendly"
    ],
    fragranceNotes: ["Top: Zesty Lemon & Sweet Orange", "Heart: Bergamot & Mint Leaf", "Base: Warm Amber & White Musk"],
    ingredients: "Bio-Based Surfactants, Natural Citrus Extracts (Limonene), Quad-Enzyme Complex, Water Softening Builders.",
    howToUse: {
      regular: "1 Cap (40ml) for daily active wear",
      heavy: "1.5 Caps (60ml) for muddy sports gear & heavy jeans",
      handwash: "0.5 Cap (20ml) in warm bucket water"
    }
  },
  {
    id: "wm-pouch-yellow-eco",
    name: "White Mist 2kg Citrus Sunshine Refill Pouch",
    category: "pouches",
    categoryName: "Eco Refill Pouch",
    tagline: "70% Less Plastic Waste • Maximum Savings",
    color: "yellow",
    accentColor: "#FFB800",
    bgGradient: "linear-gradient(135deg, #FFFDE6 0%, #FFFFFF 100%)",
    badge: "Eco Pick",
    rating: 4.88,
    reviewsCount: 740,
    description: "Eco-friendly spout refill pouch designed to quickly pour into your original Meridian White Mist bottle. Reduces plastic footprint by 70%.",
    formats: [
      { id: "pouch-2kg", name: "2kg Spout Refill Pouch", price: 279, mrp: 399, discount: "30% OFF", image: "/assets/images/pouch_yellow.png", doses: 50 },
      { id: "pouch-twin", name: "Twin Pack (2kg x 2)", price: 519, mrp: 798, discount: "35% OFF", image: "/assets/images/pouch_yellow.png", doses: 100 }
    ],
    features: ["Leak-Proof Spout Cap", "100% Recyclable Foil Film", "Compact Storage"],
    fragranceNotes: ["Fresh Lemon Zest & Bergamot"],
    ingredients: "Bio-Based Surfactants, Limonene, Quad-Enzyme Complex.",
    howToUse: { regular: "Pour directly into bottle using spout nozzle." }
  },
  {
    id: "wm-pouch-pink-eco",
    name: "White Mist 2kg Floral Bloom Refill Pouch",
    category: "pouches",
    categoryName: "Eco Refill Pouch",
    tagline: "French Rose Essence • Soft Touch",
    color: "pink",
    accentColor: "#F01262",
    bgGradient: "linear-gradient(135deg, #FFEBF2 0%, #FFFFFF 100%)",
    badge: "Eco Saver",
    rating: 4.86,
    reviewsCount: 520,
    description: "Refill pouch infused with silk conditioner and french rose micro-beads. Easy spout pouring.",
    formats: [
      { id: "pouch-2kg", name: "2kg Spout Refill Pouch", price: 299, mrp: 430, discount: "30% OFF", image: "/assets/images/pouch_pink.png", doses: 50 }
    ],
    features: ["70% Plastic Reduction", "Silk Conditioner Added", "Easy Pour Spout"],
    fragranceNotes: ["Rose Petals & Soft Vanilla"],
    ingredients: "Plant-Derived Surfactants, Silk Amino Extract, Rose Oil.",
    howToUse: { regular: "Refill your bottle or measure directly." }
  },
  {
    id: "wm-softener-rose",
    name: "White Mist Ultra Fabric Conditioner (Pink Rose)",
    category: "softeners",
    categoryName: "Fabric Conditioner",
    tagline: "Silk Softness & static-Free Bounce",
    color: "pink",
    accentColor: "#E91E63",
    bgGradient: "linear-gradient(135deg, #FFF0F5 0%, #FFFFFF 100%)",
    badge: "New Launch",
    rating: 4.94,
    reviewsCount: 310,
    description: "Post-wash rinse conditioner that softens clothing fibers, prevents wrinkles, and shields garments from static cling. Delivers luxurious fluffy softness to towels and bed linen.",
    formats: [
      { id: "bot-1.5l", name: "1.5L Conditioner Bottle", price: 249, mrp: 350, discount: "29% OFF", image: "/assets/images/bottle_pink.png", doses: 40 }
    ],
    features: ["Wrinkle Ease Technology", "Static Free Guarantee", "Long-lasting Softness"],
    fragranceNotes: ["Sweet Blossom & Musky Rose"],
    ingredients: "Cationic Surfactants (5-15%), Essential Rose Perfume, Anti-Static Conditioners.",
    howToUse: { regular: "Add 1 cap to final rinse compartment of washing machine." }
  },
  {
    id: "wm-stain-booster-citrus",
    name: "White Mist Oxy-Stain Booster Powder",
    category: "boosters",
    categoryName: "Stain Booster",
    tagline: "Oxygen Active Stain Dissolver",
    color: "yellow",
    accentColor: "#D97706",
    bgGradient: "linear-gradient(135deg, #FFFDE6 0%, #FFFFFF 100%)",
    badge: "High Power",
    rating: 4.91,
    reviewsCount: 410,
    description: "Active oxygen booster additive that works alongside liquid detergent to remove stubborn collar grime, blood stains, wine, and ancient tea spots without color bleaching.",
    formats: [
      { id: "tub-1kg", name: "1kg Oxy Power Tub", price: 229, mrp: 320, discount: "28% OFF", image: "/assets/images/pouch_yellow_lifestyle.jpg", doses: 40 }
    ],
    features: ["Color-Safe Oxygen Bleach", "Removes Collar & Cuff Stain", "Odor Neutralizer"],
    fragranceNotes: ["Sparkling Citrus Clean"],
    ingredients: "Sodium Percarbonate (>30%), TAED Activator, Bio-Protease Enzymes.",
    howToUse: { regular: "Add 1 scoop into washing machine drum along with White Mist liquid." }
  },
  {
    id: "wm-combo-family-pack",
    name: "White Mist Ultimate Saver Combo (4kg Total)",
    category: "combos",
    categoryName: "Value Saver Combo",
    tagline: "2L Bottle + 2kg Pouch + Free Dosing Cup",
    color: "blue",
    accentColor: "#0084FF",
    bgGradient: "linear-gradient(135deg, #E6F3FF 0%, #FFFDE6 100%)",
    badge: "Mega Saver",
    rating: 4.95,
    reviewsCount: 2150,
    description: "The ultimate household laundry bundle. Includes 1x 2L Blue Ocean Bottle + 1x 2kg Yellow Citrus Pouch + Free measuring cap with 39% total price discount.",
    formats: [
      { id: "bundle-4kg", name: "4kg Complete Family Bundle", price: 549, mrp: 899, discount: "39% OFF", image: "/assets/images/bottles_pair.png", doses: 100 }
    ],
    features: ["Includes Bottle + Refill Pouch", "Free Measuring Cap", "Maximum Savings"],
    fragranceNotes: ["Ocean Breeze & Citrus Sparkle"],
    ingredients: "Complete Bio-Enzyme Quad Surfactant System.",
    howToUse: { regular: "Use bottle for daily laundry, refill using 2kg pouch." }
  }
];

export const SUPER_SAVER_BUNDLE = {
  id: "wm-combo-saver",
  title: "White Mist Ultimate Saver Combo (4kg Total)",
  subtitle: "1x 2L Blue Ocean Bottle + 1x 2kg Yellow Citrus Pouch + Free Dosing Cup",
  price: 549,
  mrp: 899,
  discount: "39% OFF",
  savings: "Save ₹350 Today",
  image: "/assets/images/bottles_pair.png",
  endsInHours: 6
};

export const PROMO_CODES = {
  "MISTFRESH": { discountPercent: 15, minSpend: 300, description: "15% Instant Discount on All Items" },
  "SUPER30": { discountAmount: 100, minSpend: 600, description: "Flat ₹100 Off on Orders above ₹600" },
  "ECOSAVER": { discountPercent: 20, minSpend: 400, description: "20% Off Eco Refill Pouches" }
};

export const REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    city: "Bangalore",
    rating: 5,
    date: "3 days ago",
    comment: "The Ocean Fresh fragrance is unbelievable! Clothes smell clean even after 3 days in the wardrobe. Removed turmeric stain from my toddler's white shirt in a single wash!",
    variant: "White Mist Ocean Fresh (2L)",
    verified: true
  },
  {
    id: 2,
    name: "Anand R. Verma",
    city: "Mumbai",
    rating: 5,
    date: "1 week ago",
    comment: "Using it in my LG Front Load washer. Very low foam, saves so much water, and no sticky residue left in the machine drawer. The refill pouch is great value.",
    variant: "Citrus Sunshine 2kg Pouch",
    verified: true
  },
  {
    id: 3,
    name: "Sneha Kapadia",
    city: "Delhi NCR",
    rating: 5,
    date: "2 weeks ago",
    comment: "Floral Bloom is so soft on silk sarees and cotton dupattas. Doesn't dull colors like powders used to. Switching permanently to White Mist!",
    variant: "Floral Bloom 2L Bottle",
    verified: true
  }
];
