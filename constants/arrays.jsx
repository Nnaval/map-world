export const departments = [
  "Agricultural Economics",
  "Agricultural Extension",
  "Animal Science and Technology",
  "Crop Science and Technology",
  "Fisheries and Aquaculture Technology",
  "Forestry and Wildlife Technology",
  "Soil Science and Technology",
  "Biochemistry",
  "Biology",
  "Biotechnology",
  "Microbiology",
  "Forensic Science",
  "Computer Engineering (CME)",
  "Electrical (Power Systems) Engineering (EPE)",
  "Electronics Engineering (ELE)",
  "Mechatronics Engineering (MCE)",
  "Telecommunications Engineering (TCE)",
  "Electrical and Electronic Engineering (EEE)",
  "Agricultural and Bioresource Engineering (ABE)",
  "Biomedical Engineering (BME)",
  "Chemical Engineering (CHE)",
  "Civil Engineering (CIE)",
  "Food Science and Technology (FST)",
  "Materials and Metallurgical Engineering (MME)",
  "Mechanical Engineering (MEE)",
  "Mechatronics Engineering (MCE)",
  "Petroleum Engineering (PET)",
  "Polymer and Textile Engineering (PTE)",
  "Dental Technology",
  "Environmental Health Science",
  "Optometry",
  "Prosthetics and Orthodontics",
  "Public Health Technology",
  "Computer Science Department (CSC)",
  "Cyber Security Department (CYB)",
  "Information Technology Department (IFT)",
  "Software Engineering Department (SOE)",
  "Entrepreneurship and Innovation",
  "Logistics and Transport Technology",
  "Maritime Technology and Logistics",
  "Logistics and Supply Chain Management",
  "Project and Management Technology",
  "Chemistry",
  "Geology",
  "Mathematics",
  "Physics",
  "Science Laboratory Technology",
  "Statistics",
  "Human Anatomy",
  "Human Physiology",
  "Architecture",
  "Building Technology",
  "Environmental Management",
  "Quantity Surveying",
  "Surveying and Geoinformatics",
  "Urban and Regional Planning",
  "Environmental Management and Evaluation",
];

export const shopCategories = [
  "Food & Beverage",
  "Clothing & Accessories",
  "Books & Stationery",
  "Electronics & Accessories",
  "Health & Beauty",
  "Events & Entertainment",
  "Secondhand Goods",
  "Services",
  "Tech Services",
];

export const sidebarLinks = [
  {
    imgURL: "/assets/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/shop.svg",
    route: "/shops",
    label: "Stores",
  },

  {
    imgURL: "/assets/map.svg",
    route: "/map",
    label: "Map",
  },
  {
    imgURL: "/assets/user.svg",
    route: "/chat",
    label: "Chat",
  },
  {
    imgURL: "/assets/user.svg",
    route: "/profile",
    label: "Profile",
  },
];

export const DUMMY_CONVERSATIONS = [
  {
    id: 1,
    fullName: "John Doe",
    profilePic: "https://avatar.iran.liara.run/public/boy?username=johndoe",
    emoji: "🎃",
  },
  {
    id: 2,
    fullName: "Jane Doe",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=janedoe",
    emoji: "👻",
  },
  {
    id: 3,
    fullName: "Alice",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=alice",
    emoji: "🦇",
  },
  {
    id: 4,
    fullName: "Bob",
    profilePic: "https://avatar.iran.liara.run/public/boy?username=bob",
    emoji: "🧟‍♂️",
  },
  {
    id: 5,
    fullName: "Charlie",
    profilePic: "https://avatar.iran.liara.run/public/girl?username=charlie",
    emoji: "🧛",
  },
];

export const DUMMY_MESSAGES = [
  {
    id: 1,
    fromMe: false,
    body: "Hello John!",
  },
  {
    id: 2,
    fromMe: true,
    body: "Hi! How's it going?",
  },
  {
    id: 3,
    fromMe: false,
    body: "I'm doing well, thanks for asking. How about you?",
  },
  {
    id: 4,
    fromMe: true,
    body: "I'm good too. Been busy with work.",
  },
  {
    id: 5,
    fromMe: false,
    body: "I can imagine. Have you had any time to relax?",
  },
  {
    id: 6,
    fromMe: true,
    body: "A little bit. I watched a movie last night.",
  },
  {
    id: 7,
    fromMe: false,
    body: "That's great! Which movie did you watch?",
  },
];

export const funEmojis = [
  "👾",
  "⭐",
  "🌟",
  "🎉",
  "🎊",
  "🎈",
  "🎁",
  "🎂",
  "🎄",
  "🎃",
  "🎗",
  "🎟",
  "🎫",
  "🎖",
  "🏆",
  "🏅",
  "🥇",
  "🥈",
  "🥉",
  "⚽",
  "🏀",
  "🏈",
  "⚾",
  "🎾",
  "🏐",
  "🏉",
  "🎱",
  "🏓",
  "🏸",
  "🥅",
  "🏒",
  "🏑",
  "🏏",
  "⛳",
  "🏹",
  "🎣",
  "🥊",
  "🥋",
  "🎽",
  "⛸",
  "🥌",
  "🛷",
  "🎿",
  "⛷",
  "🏂",
  "🏋️",
  "🤼",
  "🤸",
  "🤺",
  "⛹️",
  "🤾",
  "🏌️",
  "🏇",
  "🧘",
];

export const getRandomEmoji = () => {
  return funEmojis[Math.floor(Math.random() * funEmojis.length)];
};
