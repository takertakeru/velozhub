export type EventInfo = {
  id: string;
  name: string;
  initials: string;
  bg: string;
};

export const events: Record<string, EventInfo> = {
  "1000": {
    id: "1000",
    name: "Bear Hug: Live in Concert",
    initials: "BH",
    bg: "linear-gradient(135deg, #f43f5e, #be123c)",
  },
  "1001": {
    id: "1001",
    name: "Viking People",
    initials: "VP",
    bg: "linear-gradient(135deg, #f59e0b, #b45309)",
  },
  "1002": {
    id: "1002",
    name: "Six Fingers — DJ Set",
    initials: "SF",
    bg: "linear-gradient(135deg, #0ea5e9, #1d4ed8)",
  },
  "1003": {
    id: "1003",
    name: "We All Look The Same",
    initials: "WA",
    bg: "linear-gradient(135deg, #10b981, #047857)",
  },
};

export type Order = {
  id: number;
  url: string;
  date: string;
  amount: { usd: string };
  customer: { name: string; email: string };
  eventId: keyof typeof events;
};

export const orders: Order[] = [
  { id: 3000, url: "/orders/3000", date: "May 9, 2024", amount: { usd: "$80.00" }, customer: { name: "Leslie Alexander", email: "leslie.alexander@example.com" }, eventId: "1000" },
  { id: 3001, url: "/orders/3001", date: "May 5, 2024", amount: { usd: "$299.00" }, customer: { name: "Michael Foster", email: "michael.foster@example.com" }, eventId: "1001" },
  { id: 3002, url: "/orders/3002", date: "Apr 28, 2024", amount: { usd: "$150.00" }, customer: { name: "Dries Vincent", email: "dries.vincent@example.com" }, eventId: "1002" },
  { id: 3003, url: "/orders/3003", date: "Apr 23, 2024", amount: { usd: "$80.00" }, customer: { name: "Lindsay Walton", email: "lindsay.walton@example.com" }, eventId: "1000" },
  { id: 3004, url: "/orders/3004", date: "Apr 18, 2024", amount: { usd: "$114.99" }, customer: { name: "Courtney Henry", email: "courtney.henry@example.com" }, eventId: "1003" },
  { id: 3005, url: "/orders/3005", date: "Apr 14, 2024", amount: { usd: "$299.00" }, customer: { name: "Tom Cook", email: "tom.cook@example.com" }, eventId: "1001" },
  { id: 3006, url: "/orders/3006", date: "Apr 10, 2024", amount: { usd: "$150.00" }, customer: { name: "Whitney Francis", email: "whitney.francis@example.com" }, eventId: "1002" },
  { id: 3007, url: "/orders/3007", date: "Apr 6, 2024", amount: { usd: "$80.00" }, customer: { name: "Leonard Krasner", email: "leonard.krasner@example.com" }, eventId: "1000" },
  { id: 3008, url: "/orders/3008", date: "Apr 3, 2024", amount: { usd: "$80.00" }, customer: { name: "Floyd Miles", email: "floyd.miles@example.com" }, eventId: "1000" },
  { id: 3009, url: "/orders/3009", date: "Mar 29, 2024", amount: { usd: "$114.99" }, customer: { name: "Emily Selman", email: "emily.selman@example.com" }, eventId: "1003" },
  { id: 3010, url: "/orders/3010", date: "Mar 25, 2024", amount: { usd: "$299.00" }, customer: { name: "Kristin Watson", email: "kristin.watson@example.com" }, eventId: "1001" },
  { id: 3011, url: "/orders/3011", date: "Mar 21, 2024", amount: { usd: "$80.00" }, customer: { name: "Emma Dorsey", email: "emma.dorsey@example.com" }, eventId: "1000" },
  { id: 3012, url: "/orders/3012", date: "Mar 16, 2024", amount: { usd: "$150.00" }, customer: { name: "Alicia Bell", email: "alicia.bell@example.com" }, eventId: "1002" },
  { id: 3013, url: "/orders/3013", date: "Mar 12, 2024", amount: { usd: "$299.00" }, customer: { name: "Jenny Wilson", email: "jenny.wilson@example.com" }, eventId: "1001" },
  { id: 3014, url: "/orders/3014", date: "Mar 8, 2024", amount: { usd: "$150.00" }, customer: { name: "Anna Roberts", email: "anna.roberts@example.com" }, eventId: "1002" },
  { id: 3015, url: "/orders/3015", date: "Mar 4, 2024", amount: { usd: "$150.00" }, customer: { name: "Benjamin Russel", email: "benjamin.russel@example.com" }, eventId: "1002" },
  { id: 3016, url: "/orders/3016", date: "Feb 28, 2024", amount: { usd: "$80.00" }, customer: { name: "Jeffrey Webb", email: "jeffrey.webb@example.com" }, eventId: "1000" },
  { id: 3017, url: "/orders/3017", date: "Feb 23, 2024", amount: { usd: "$80.00" }, customer: { name: "Kathryn Murphy", email: "kathryn.murphy@example.com" }, eventId: "1000" },
  { id: 3018, url: "/orders/3018", date: "Feb 19, 2024", amount: { usd: "$114.99" }, customer: { name: "Lawrence Hunter", email: "lawrence.hunter@example.com" }, eventId: "1003" },
  { id: 3019, url: "/orders/3019", date: "Feb 15, 2024", amount: { usd: "$114.99" }, customer: { name: "Yvette Armstrong", email: "yvette.armstrong@example.com" }, eventId: "1003" },
  { id: 3020, url: "/orders/3020", date: "Feb 10, 2024", amount: { usd: "$299.00" }, customer: { name: "Angela Fisher", email: "angela.fisher@example.com" }, eventId: "1001" },
  { id: 3021, url: "/orders/3021", date: "Feb 5, 2024", amount: { usd: "$80.00" }, customer: { name: "Blake Reid", email: "blake.reid@example.com" }, eventId: "1000" },
  { id: 3022, url: "/orders/3022", date: "Feb 1, 2024", amount: { usd: "$114.99" }, customer: { name: "Hector Gibbons", email: "hector.gibbons@example.com" }, eventId: "1003" },
  { id: 3023, url: "/orders/3023", date: "Jan 27, 2024", amount: { usd: "$114.99" }, customer: { name: "Fabricio Mendes", email: "fabricio.mendes@example.com" }, eventId: "1003" },
  { id: 3024, url: "/orders/3024", date: "Jan 22, 2024", amount: { usd: "$114.99" }, customer: { name: "Jillian Steward", email: "jillian.steward@example.com" }, eventId: "1003" },
  { id: 3025, url: "/orders/3025", date: "Jan 18, 2024", amount: { usd: "$114.99" }, customer: { name: "Chelsea Hagon", email: "chelsea.hagon@example.com" }, eventId: "1003" },
];
