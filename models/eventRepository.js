const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "events.json");

const SEED = [
  {
    id: 1,
    title: "Halloween party",
    description: "Annual Halloween party for students.",
    location: "Karner",
    startDate: "2026-10-31T17:00",
    endDate: "2026-11-01T01:00",
    capacity: 60,
    category: "Social",
  },
  {
    id: 2,
    title: "ESN Meetup",
    description: "ESN meetup for members.",
    location: "University library",
    startDate: "2026-12-03T18:30",
    endDate: "2026-12-03T21:00",
    capacity: 40,
    category: "Social",
  },
];

function load() {
  if (!fs.existsSync(DATA_FILE)) {
    save(SEED);
    return structuredClone(SEED);
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function save(events) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));
}

exports.findAll = ({ category, upcomingOnly } = {}) => {
  let events = load();
  if (category) events = events.filter((e) => e.category === category);
  if (upcomingOnly) {
    const now = Date.now();
    events = events.filter((e) => Date.parse(e.endDate) >= now);
  }
  return events.sort(
    (a, b) => Date.parse(a.startDate) - Date.parse(b.startDate),
  );
};

exports.findById = (id) => load().find((e) => e.id === Number(id)) || null;

exports.create = (data) => {
  const events = load();
  const nextId = events.reduce((max, e) => Math.max(max, e.id), 0) + 1;
  const event = { id: nextId, ...data };
  events.push(event);
  save(event);
  return event;
};

exports.update = (id, data) => {
  const events = load();
  const index = events.findIndex((e) => e.id === Number(id));
  if (index === -1) return null;
  events[index] = { id: events[index].id, ...data };
  save(events);
  return events[index];
};

exports.remove = (id) => {
  const events = load();
  const index = events.findIndex((e) => e.id === Number(id));
  if (index === -1) return null;
  const [removed] = events.splice(index, 1);
  save(events);
  return removed;
};
