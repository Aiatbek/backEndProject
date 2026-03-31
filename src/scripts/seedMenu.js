import "dotenv/config";
import mongoose from "mongoose";
import MenuItem from "../models/MenuItem.js";

const MENU_ITEMS = [
  {
    name: "Prime Wagyu Short Rib",
    description: "A5 Wagyu beef short rib marbled to perfection. Rich, buttery flavour that melts in your mouth with every bite. Our most celebrated cut.",
    price: 42.00,
    category: "Wagyu",
    imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
    isAvailable: true,
  },
  {
    name: "Galbi (LA Short Rib)",
    description: "Flanken-cut bone-in short ribs marinated overnight in soy, Asian pear and toasted sesame. A Korean BBQ staple done right.",
    price: 28.00,
    category: "Beef",
    imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80",
    isAvailable: true,
  },
  {
    name: "Samgyeopsal (Pork Belly)",
    description: "Thick-cut heritage pork belly grilled over live charcoal until golden and crispy. Wrap in lettuce with garlic, ssamjang and kimchi.",
    price: 22.00,
    category: "Pork",
    imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80",
    isAvailable: true,
  },
  {
    name: "Chadolbaegi (Brisket)",
    description: "Paper-thin sliced beef brisket that cooks in seconds on the grill. Light, delicate and perfect with sesame oil dipping sauce.",
    price: 24.00,
    category: "Beef",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    isAvailable: true,
  },
  {
    name: "Bulgogi (Marinated Beef)",
    description: "Classic thinly-sliced ribeye in our house bulgogi marinade of soy, pear, ginger and garlic. Sweet, savoury and deeply satisfying.",
    price: 26.00,
    category: "Beef",
    imageUrl: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800&q=80",
    isAvailable: true,
  },
  {
    name: "Spicy Pork Neck (Moksal)",
    description: "Pork neck marinated in our fiery gochujang paste with scallions and sesame. Bold, spicy and wickedly good.",
    price: 21.00,
    category: "Pork",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    isAvailable: true,
  },
  {
    name: "Seafood Pancake (Haemul Pajeon)",
    description: "Crispy green onion pancake loaded with shrimp, squid and clams. Served with our house soy dipping sauce.",
    price: 16.00,
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
    isAvailable: true,
  },
  {
    name: "Doenjang Jjigae (Soybean Stew)",
    description: "Hearty fermented soybean paste stew with tofu, zucchini and mushrooms. The ultimate Korean comfort food.",
    price: 14.00,
    category: "Soups",
    imageUrl: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80",
    isAvailable: true,
  },
  {
    name: "Premium Mushroom Platter",
    description: "King oyster, shiitake and enoki mushrooms grilled tableside. A perfect vegetarian option with incredible umami depth.",
    price: 18.00,
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80",
    isAvailable: true,
  },
  {
    name: "Soju Flight (3 Varieties)",
    description: "Try three different soju flavours — classic, grapefruit and green grape. Served chilled with complimentary anju.",
    price: 22.00,
    category: "Drinks",
    imageUrl: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80",
    isAvailable: true,
  },
];

const seedMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const existing = await MenuItem.countDocuments();
    if (existing > 0) {
      console.log(`Menu already has ${existing} items — skipping seed.`);
      console.log("To reseed, drop the menuitem collection first.");
      process.exit(0);
    }

    await MenuItem.insertMany(MENU_ITEMS);
    console.log(`✓ Seeded ${MENU_ITEMS.length} menu items successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding menu:", error);
    process.exit(1);
  }
};

seedMenu();
