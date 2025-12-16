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
        image: "/images/menu-brut.png",
        badge: "Private Dining",
        description: "An intimate and exclusive Christmas dining experience brought to your home by Costanza.",
        items: [
            {
                name: "Chef's Signature Christmas Menu",
                description: "A bespoke culinary journey tailored to your preferences.",
                ingredients: [
                    { name: "Seasonal Specialties", description: "Fresh winter ingredients." },
                    { name: "Personalized Service", description: "Full table service included." }
                ]
            }
        ]
    },
    {
        id: "christmas-box-moms-magic",
        title: "Mom's Magic Christmas Box",
        chef: "Mom's Magic",
        price: "€20 - €30 p.p.",
        image: "/images/menu-south-indian.png",
        badge: "Authentic",
        description: "A heartwarming Christmas feast with authentic flavors. Choose from Veg, Non-Veg, or Premium options.",
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
        title: "La Esquina Dominicana Box",
        chef: "La Esquina Dominicana",
        price: "Price on Request",
        image: "/images/menu-classic.png",
        badge: "Caribbean",
        description: "Celebrate Christmas with the vibrant flavors of the Dominican Republic.",
        items: [
            {
                name: "The Dominican Feast",
                description: "A traditional holiday spread.",
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
        title: "Sprinkle and Swirl Box",
        chef: "Sprinkle and Swirl",
        price: "Price on Request",
        image: "/images/menu-dessert.png",
        badge: "Sweets",
        description: "Delightful sweet treats and baked goods to brighten your holiday season.",
        items: [
            {
                name: "Holiday Treats",
                description: "Assorted baked goods.",
                ingredients: [
                    { name: "Custom Cakes", description: "Festive designs." },
                    { name: "Cupcakes", description: "Holiday flavors." }
                ]
            }
        ]
    },
    {
        id: "christmas-box-bottega",
        title: "Bottega Christmas Box",
        chef: "Bottega",
        price: "Price on Request",
        image: "/images/menu-ron.png",
        badge: "Gourmet",
        description: "Italian gourmet selection for a sophisticated Christmas celebration.",
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
    // --- Sold Out / Fully Booked Menus below ---
    {
        id: "christmas-4-course",
        title: "Christmas 4-course",
        chef: "Bergpaviljoen Bistronomique",
        price: "€64,50 p.p.",
        image: "/images/menu-classic.png",
        badge: "Classic",
        description: "A classic 4-course culinary journey designed to bring the restaurant experience to your dining table.",
        items: [],
        soldOut: true
    },
    {
        id: "brut172",
        title: "Brut172 Christmas",
        chef: "Hans Van Wolde",
        price: "€99,50 p.p.",
        image: "/images/menu-brut.png",
        badge: "Exclusive",
        description: "An exclusive menu curated by Hans Van Wolde, focusing on bold flavors and exquisite presentation.",
        items: [],
        soldOut: true
    },
    {
        id: "ron-gastrobar",
        title: "Ron Gastrobar",
        chef: "Ron Blaauw",
        price: "€31,00 p.p.",
        image: "/images/menu-ron.png",
        badge: "Signature",
        description: "Accessible top-tier dining with Ron Blaauw's signature gastrobar style. Fun, tasty, and unpretentious.",
        items: [],
        soldOut: true
    },
    {
        id: "christmas-veggie",
        title: "Vegetarian Festive Feast",
        chef: "Green Leaf Kitchen",
        price: "€55,00 p.p.",
        image: "/images/menu-veggie.png",
        badge: "Vegetarian",
        description: "A vibrant and hearty plant-based menu that celebrates winter produce.",
        items: [],
        soldOut: true
    },
    {
        id: "seafood-royale",
        title: "Seafood Spectacular",
        chef: "Ocean Blue",
        price: "€85,00 p.p.",
        image: "/images/menu-seafood.png",
        badge: "Seafood",
        description: "A luxurious dive into the ocean's finest offerings. Lobster, oysters, and more.",
        items: [],
        soldOut: true
    },
    {
        id: "asian-fusion",
        title: "Asian Christmas Fusion",
        chef: "Kenji Moto",
        price: "€75,00 p.p.",
        image: "/images/menu-fusion.png",
        badge: "Fusion",
        description: "East meets West in this spectacular fusion menu. Unexpected flavors for a memorable night.",
        items: [],
        soldOut: true
    }
];

export const occasions: Occasion[] = [
    {
        id: "kerst",
        title: "Christmas Specials",
        subtitle: "Seasonal",
        image: "/images/occasion-christmas.png",
        description: "Celebrate the magic of Christmas with our specially curated holiday menus. From traditional roasts to modern gourmet experiences.",
        features: ["Traditional Decor styling included", "Wine pairing options", "Kid-friendly alternatives"]
    },
    {
        id: "shared",
        title: "Shared Dining",
        subtitle: "Social",
        image: "/images/occasion-shared.png",
        description: "Food is best when shared. Enjoy large platters and family-style serving for a warm, communal dining experience.",
        features: ["Large serving platters", "Interactive courses", "Casual atmosphere"]
    },
    {
        id: "newyear",
        title: "New Year's Eve",
        subtitle: "Celebration",
        image: "/images/occasion-newyear.png",
        description: "Ring in the New Year with sparkles and culinary fireworks. A luxurious menu to countdown to midnight.",
        features: ["Champagne toast included", "Late-night snacks", "Festive dessert finale"]
    },
    {
        id: "corporate",
        title: "Corporate Events",
        subtitle: "Professional",
        image: "/images/occasion-corporate.png",
        description: "Impress your colleagues and clients with a high-end culinary experience. Perfect for year-end parties.",
        features: ["Branded menus available", "Professional service staff", "Dietary requirement handling"]
    },
    {
        id: "romantic",
        title: "Romantic Dinner",
        subtitle: "Intimate",
        image: "/images/occasion-romantic.png",
        description: "Waitlists? No thank you. A private chef ensures the most romantic setting possible: your own home.",
        features: ["Candlelit setup", "Premium wine selection", "Discreet service"]
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
        title: "The Seed of Quality",
        description: "It all starts with a seed. We partner with local farmers who treat their crops like gold. No nasties, just pure, sun-soaked goodness grown right here.",
        image: "/images/doodles/seed.svg",
        bgColor: "bg-green-100"
    },
    {
        title: "The Chef's Canvas",
        description: "Our chefs aren't just cooks; they're artists. They take these fresh ingredients and sketch out flavors that dance on your palate. It's culinary wizardry in motion.",
        image: "/images/doodles/chef-art.svg",
        bgColor: "bg-orange-100"
    },
    {
        title: "Your Flavor Profile",
        description: "We don't do cookie-cutter. We listen to your cravings, your quirks, and your dreams to craft a menu that feels like it was made just for you. Because it was.",
        image: "/images/doodles/profile.svg",
        bgColor: "bg-blue-100"
    },
    {
        title: "Magic in the Making",
        description: "Watch as your kitchen transforms. The sizzle, the aroma, the energy—it's a live performance where the grand finale is a meal you'll never forget.",
        image: "/images/doodles/magic.svg",
        bgColor: "bg-purple-100"
    },
    {
        title: "Memories Served",
        description: "The best part? It's not just about the food. It's about the laughter, the stories shared, and the memories created around the table. We just set the stage.",
        image: "/images/doodles/memories.svg",
        bgColor: "bg-yellow-100"
    }
];
