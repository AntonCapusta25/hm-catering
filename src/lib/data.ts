export interface Ingredient {
    name: string;
    description: string;
    image?: string;
}

export interface MenuItem {
    name: string;
    description: string;
    ingredients: Ingredient[];
}

export interface Menu {
    id: string;
    title: string;
    chef: string;
    price: string;
    image: string;
    badge: string;
    description: string;
    items: MenuItem[];
    soldOut?: boolean;
}

export interface Cuisine {
    id: string;
    title: string;
    image: string;
    description: string;
}

export const cuisines: Cuisine[] = [
    {
        id: "surinami",
        title: "Suriname Soul Food",
        image: "/images/generated/cuisine-suriname.png",
        description: "A vibrant fusion of Creole, Hindustani, and Javanese flavors."
    },
    {
        id: "asian",
        title: "Asian Fusion",
        image: "/images/generated/cuisine-asian.png",
        description: "A bold mix of Eastern flavors with modern culinary techniques."
    },
    {
        id: "indian",
        title: "Authentic Indian",
        image: "/images/generated/cuisine-indian.png",
        description: "Rich curries, aromatic spices, and traditional recipes."
    },
    {
        id: "italian",
        title: "Italian Gourmet",
        image: "/images/generated/cuisine-italian.png",
        description: "Handcrafted pasta, premium sauces, and the true taste of Italy."
    },
    {
        id: "vegetarian",
        title: "Fresh Vegetarian",
        image: "/images/generated/cuisine-vegetarian.png",
        description: "Vibrant, plant-based dishes that celebrate seasonal produce."
    },
    {
        id: "seafood",
        title: "Ocean Treasures",
        image: "/images/generated/cuisine-seafood.png",
        description: "Fresh catches prepared to highlight their natural delicate flavors."
    }
];

export interface Occasion {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    description: string;
    features: string[];
}

export const menus: Menu[] = [
    {
        id: "costanza-private",
        title: "Private Dining by Costanza",
        chef: "Costanza",
        price: "Price on Request",
        image: "/images/generated/cuisine-italian.png",
        badge: "Private Dining",
        description: "An intimate and exclusive dining experience for your special event, crafted by Costanza.",
        items: [
            {
                name: "Chef's Signature Catering Menu",
                description: "A bespoke culinary journey tailored to your event's preferences.",
                ingredients: [
                    { name: "Seasonal Specialties", description: "Fresh seasonal ingredients." },
                    { name: "Personalized Service", description: "Full table service included." }
                ]
            }
        ]
    },
    {
        id: "christmas-box-moms-magic",
        title: "Mom's Magic Catering Package",
        chef: "Mom's Magic",
        price: "Price on Request",
        image: "/images/generated/cuisine-indian.png",
        badge: "Authentic",
        description: "A heartwarming feast with authentic flavors perfect for any celebration. Choose from Veg, Non-Veg, or Premium options.",
        items: [
            {
                name: "Appetizers",
                description: "Starters to spark your appetite.",
                ingredients: [
                    { name: "Paneer / Chicken Tikka", description: "Marinated and grilled to perfection." },
                    { name: "Veg / Beef Cutlets", description: "Crispy and savory." }
                ]
            },
            {
                name: "Main Course",
                description: "Hearty traditional mains.",
                ingredients: [
                    { name: "Chappathi & Curry", description: "Mutton Curry or Paneer Butter Masala." },
                    { name: "Appam & Stew", description: "Chicken or Veg Stew." },
                    { name: "Biriyani", description: "Chicken, Prawns, Paneer, or Mushroom." }
                ]
            },
            {
                name: "Dessert & Drinks",
                description: "Sweet endings.",
                ingredients: [
                    { name: "Gulab Jamun", description: "Sweet dumplings." },
                    { name: "Carrot Halwa", description: "Rich carrot pudding." },
                    { name: "Mango Lassi", description: "Refreshing yogurt drink." }
                ]
            }
        ]
    },
    {
        id: "christmas-box-la-esquina",
        title: "La Esquina Dominicana Package",
        chef: "La Esquina Dominicana",
        price: "Price on Request",
        image: "/images/generated/cuisine-suriname.png",
        badge: "Caribbean",
        description: "Celebrate your event with the vibrant flavors of the Dominican Republic.",
        items: [
            {
                name: "The Dominican Feast",
                description: "A traditional festive spread.",
                ingredients: [
                    { name: "Moro", description: "Classic rice and beans." },
                    { name: "Russian Salad", description: "Creamy potato salad with vegetables." },
                    { name: "Roast Pork Shoulder", description: "Slow-roasted pernil." },
                    { name: "Flan (Optional)", description: "Caramel custard dessert." }
                ]
            }
        ]
    },
    {
        id: "christmas-box-sprinkle-swirl",
        title: "Sprinkle and Swirl Dessert Package",
        chef: "Sprinkle and Swirl",
        price: "Price on Request",
        image: "/images/generated/occasion-party.png",
        badge: "Sweets",
        description: "Delightful sweet treats and baked goods to elevate any celebration.",
        items: [
            {
                name: "Celebration Treats",
                description: "Assorted baked goods.",
                ingredients: [
                    { name: "Custom Cakes", description: "Personalized designs." },
                    { name: "Cupcakes", description: "Gourmet flavors." }
                ]
            }
        ]
    },
    {
        id: "christmas-box-bottega",
        title: "Bottega Gourmet Package",
        chef: "Bottega",
        price: "Price on Request",
        image: "/images/generated/cuisine-italian.png",
        badge: "Gourmet",
        description: "Italian gourmet selection for sophisticated events and celebrations.",
        items: [
            {
                name: "Italian Specialties",
                description: "Curated gourmet items.",
                ingredients: [
                    { name: "Artisanal Pasta", description: "Handcrafted." },
                    { name: "Premium Sauces", description: "Authentic family recipes." }
                ]
            }
        ]
    },
    // --- Sold Out / Fully Booked Packages below ---
    {
        id: "christmas-4-course",
        title: "Classic 4-Course Package",
        chef: "Bergpaviljoen Bistronomique",
        price: "€64,50 p.p.",
        image: "/images/generated/hero-detail.png",
        badge: "Classic",
        description: "A classic 4-course culinary journey designed to bring the restaurant experience to your event.",
        items: [],
        soldOut: true
    },
    {
        id: "brut172",
        title: "Brut172 Exclusive Package",
        chef: "Hans Van Wolde",
        price: "€99,50 p.p.",
        image: "/images/generated/hero-secondary.png",
        badge: "Exclusive",
        description: "An exclusive catering package curated by Hans Van Wolde, focusing on bold flavors and exquisite presentation.",
        items: [],
        soldOut: true
    },
    {
        id: "ron-gastrobar",
        title: "Ron Gastrobar",
        chef: "Ron Blaauw",
        price: "€31,00 p.p.",
        image: "/images/generated/hero-social.png",
        badge: "Signature",
        description: "Accessible top-tier dining with Ron Blaauw's signature gastrobar style. Fun, tasty, and unpretentious.",
        items: [],
        soldOut: true
    },
    {
        id: "christmas-veggie",
        title: "Vegetarian Celebration Package",
        chef: "Green Leaf Kitchen",
        price: "€55,00 p.p.",
        image: "/images/generated/cuisine-vegetarian.png",
        badge: "Vegetarian",
        description: "A vibrant and hearty plant-based menu that celebrates seasonal produce.",
        items: [],
        soldOut: true
    },
    {
        id: "seafood-royale",
        title: "Seafood Spectacular",
        chef: "Ocean Blue",
        price: "€85,00 p.p.",
        image: "/images/generated/cuisine-seafood.png",
        badge: "Seafood",
        description: "A luxurious dive into the ocean's finest offerings. Lobster, oysters, and more.",
        items: [],
        soldOut: true
    },
    {
        id: "asian-fusion",
        title: "Asian Fusion Package",
        chef: "Kenji Moto",
        price: "€75,00 p.p.",
        image: "/images/generated/cuisine-asian.png",
        badge: "Fusion",
        description: "East meets West in this spectacular fusion menu. Unexpected flavors for a memorable event.",
        items: [],
        soldOut: true
    }
];

export const occasions: Occasion[] = [
    {
        id: "kerst",
        title: "Holiday Events",
        subtitle: "Seasonal",
        image: "/images/generated/occasion-holiday.png",
        description: "Celebrate the magic of the holidays with our specially curated seasonal menus. From traditional favorites to modern gourmet experiences.",
        features: ["Festive presentation styling", "Wine pairing options", "Dietary alternatives available"]
    },
    {
        id: "shared",
        title: "Family-Style Dining",
        subtitle: "Social",
        image: "/images/generated/occasion-family.png",
        description: "Food is best when shared. Enjoy large platters and family-style serving for a warm, communal dining experience at your event.",
        features: ["Large serving platters", "Interactive courses", "Casual atmosphere"]
    },
    {
        id: "newyear",
        title: "Celebrations & Parties",
        subtitle: "Celebration",
        image: "/images/generated/occasion-party.png",
        description: "Make your celebration unforgettable with sparkles and culinary excellence. A luxurious menu for any special occasion.",
        features: ["Champagne service available", "Late-night snacks", "Festive dessert finale"]
    },
    {
        id: "corporate",
        title: "Corporate Events",
        subtitle: "Professional",
        image: "/images/generated/occasion-corporate.png",
        description: "Impress your colleagues and clients with a high-end culinary experience. Perfect for business meetings, conferences, and corporate gatherings.",
        features: ["Branded menus available", "Professional service staff", "Dietary requirement handling"]
    },
    {
        id: "romantic",
        title: "Private Dining",
        subtitle: "Intimate",
        image: "/images/generated/occasion-romantic.png",
        description: "Create the perfect intimate setting with our private dining service. Exceptional food in the comfort of your chosen venue.",
        features: ["Elegant setup", "Premium beverage selection", "Discreet service"]
    }
];

export interface Chef {
    name: string;
    image: string;
    description: string;
}

export const chefs: Chef[] = [
    {
        name: "Hans Van Wolde",
        image: "/images/chefs/hans.png",
        description: "Michelin Star Chef known for Brut172."
    },
    {
        name: "Ron Blaauw",
        image: "/images/chefs/ron.png",
        description: "Famous for his gastrobar concept."
    },
    {
        name: "Bergpaviljoen",
        image: "/images/chefs/berg.png",
        description: "Bistronomique excellence."
    },
    {
        name: "Kenji Moto",
        image: "/images/chefs/kenji.png",
        description: "Asian fusion innovator."
    },
    {
        name: "Patisserie Marie",
        image: "/images/chefs/marie.png",
        description: "Queen of sweets."
    },
    {
        name: "Ocean Blue",
        image: "/images/chefs/ocean.png",
        description: "Seafood specialist."
    }
];

export interface DoodleStory {
    title: string;
    description: string;
    image: string;
    bgColor: string;
}

export const doodleStories = [
    {
        title: "Premium Ingredients",
        description: "Quality starts at the source. We partner with trusted suppliers and local farmers who share our commitment to excellence. Every ingredient is carefully selected for your event.",
        image: "/images/doodles/seed.svg",
        bgColor: "bg-green-100"
    },
    {
        title: "Expert Preparation",
        description: "Our professional chefs bring years of culinary expertise to every event. They transform premium ingredients into extraordinary dishes that wow your guests.",
        image: "/images/doodles/chef-art.svg",
        bgColor: "bg-orange-100"
    },
    {
        title: "Tailored to You",
        description: "Every event is unique. We work closely with you to understand your vision, preferences, and requirements to craft a menu that perfectly matches your occasion.",
        image: "/images/doodles/profile.svg",
        bgColor: "bg-blue-100"
    },
    {
        title: "Flawless Execution",
        description: "From setup to service to cleanup, we handle every detail with precision. Your event runs smoothly while you focus on what matters—your guests.",
        image: "/images/doodles/magic.svg",
        bgColor: "bg-purple-100"
    },
    {
        title: "Memorable Moments",
        description: "Great catering creates lasting impressions. It's about the conversations sparked, the compliments shared, and the memories made around exceptional food.",
        image: "/images/doodles/memories.svg",
        bgColor: "bg-yellow-100"
    }
];
