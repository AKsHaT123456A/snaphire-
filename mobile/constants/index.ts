export const API_BASE_URL = "https://snaphire-1.onrender.com";

export const SKILL_CATEGORIES = [
  { value: "mason", label: "Mason", icon: "🧱", labelHi: "राजमिस्त्री" },
  { value: "carpenter", label: "Carpenter", icon: "🪚", labelHi: "बढ़ई" },
  { value: "electrician", label: "Electrician", icon: "⚡", labelHi: "इलेक्ट्रीशियन" },
  { value: "painter", label: "Painter", icon: "🎨", labelHi: "पेंटर" },
  { value: "plumber", label: "Plumber", icon: "🔧", labelHi: "प्लंबर" },
  { value: "welder", label: "Welder", icon: "🔥", labelHi: "वेल्डर" },
  { value: "tile_worker", label: "Tile Worker", icon: "🏗️", labelHi: "टाइल वर्कर" },
  { value: "driver", label: "Driver", icon: "🚗", labelHi: "ड्राइवर" },
  { value: "labour_helper", label: "Labour Helper", icon: "💪", labelHi: "मजदूर" },
  { value: "ac_technician", label: "AC Technician", icon: "❄️", labelHi: "AC टेक्नीशियन" },
];

export const INDIAN_CITIES = [
  "Delhi", "Mumbai", "Bengaluru", "Pune", "Lucknow",
  "Jaipur", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad",
];

export const WAGE_RANGES = {
  mason: { min: 600, max: 1200 },
  carpenter: { min: 700, max: 1500 },
  electrician: { min: 600, max: 1400 },
  painter: { min: 500, max: 1000 },
  plumber: { min: 600, max: 1200 },
  welder: { min: 700, max: 1600 },
  tile_worker: { min: 600, max: 1200 },
  driver: { min: 500, max: 1000 },
  labour_helper: { min: 400, max: 700 },
  ac_technician: { min: 700, max: 1500 },
};

export const HIRE_STATUS_LABELS: Record<string, string> = {
  pending: "Request Sent",
  accepted: "Accepted",
  rejected: "Rejected",
  on_the_way: "On the Way",
  started: "Work Started",
  completed: "Completed",
  payment_pending: "Payment Pending",
  payment_done: "Paid",
  cancelled: "Cancelled",
};

export const HIRE_STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  accepted: "#3B82F6",
  rejected: "#EF4444",
  on_the_way: "#8B5CF6",
  started: "#FF6B00",
  completed: "#22C55E",
  payment_pending: "#F59E0B",
  payment_done: "#22C55E",
  cancelled: "#9E9E9E",
};
