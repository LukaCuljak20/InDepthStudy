const { success } = require("zod/v4");
const repo = require("../models/eventRepository");
const { eventSchema, CATEGORIES } = require("../validators/eventSchema");

const EMPTY_EVENT = {
  title: "",
  description: "",
  location: "",
  startDate: "",
  endDate: "",
  capacity: "",
  category: CATEGORIES[0],
};

function notFound() {
  const err = new Error("Event not found");
  err.status = 404;
  return err;
}

function validate(body) {
  const result = eventSchema.safeParse(body);
  if (result.success) return { data: result.data, errors: null };

  const errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return { data: null, errors };
}

// GET /events?category=Workshop&upcoming=true (index)
exports.index = (req, res) => {
  const { category, upcoming } = req.query;
  const events = repo.findAll({ category, upcomingOnly: upcoming === true });
  res.render("events/index", {
    title: "Events",
    events,
    categories: CATEGORIES,
    filters: { category: category || "", upcoming: upcoming === "true" },
  });
};

// GET /events/:id (Details)
exports.show = (req, res, next) => {
  const event = repo.findById(req.params.id);
  if (!event) return next(notFound());
  res.render("events/show", { title: event.title, event });
};

//GET /events/new (Create GET)
exports.newForm = (req, res) => {
  res.render("events/form", {
    title: "New event",
    heading: "Create event",
    action: "/events",
    event: EMPTY_EVENT,
    errors: {},
    categories: CATEGORIES,
  });
};

// POST /events (Create POST)
exports.create = (req, res) => {
  const { data, errors } = validate(req.body);
  if (errors) {
    return res.status(400).render("events/form", {
      title: "New event",
      heading: "Create event",
      action: "/events",
      event: req.body,
      errors,
      categories: CATEGORIES,
    });
  }
  const created = repo.create(data);
  req.flash("success", `Event "${created.title}" was created.`);
  res.redirect(`/events/${created.id}`);
};

// GET /events/:id/edit (Edit GET)
exports.editForm = (req, res, next) => {
  const event = repo.findById(req.params.id);
  if (!event) return next(notFound());
  res.render("events/form", {
    title: `Edit ${event.title}`,
    heading: "Edit event",
    action: `/events/${event.id}?_method=PUT`,
    event,
    errors: {},
    categories: CATEGORIES,
  });
};

// PUT /events/:id (Edit POST)
exports.update = (req, res, next) => {
  const existing = repo.findById(req.params.id);
  if (!existing) return next(notFound());
  const { data, errors } = validate(req.body);
  if (errors) {
    return res.status(400).render("events/form", {
      title: `Edit ${existing.title}`,
      heading: "Edit event",
      action: `/events/${existing.id}?_method=PUT`,
      event: { ...req.body, id: existing.id },
      errors,
      categories: CATEGORIES,
    });
  }
  const updated = repo.update(existing.id, data);
  req.flash("success", `Event "${updated.title}" was updated.`);
  res.redirect(`/events/${updated.id}`);
};

// DELETE /events/:id (Delete)
exports.destroy = (req, res, next) => {
  const removed = repo.remove(req.params.id);
  if (!removed) return next(notFound());
  req.flash("success", `Event "${removed.title}" was deleted.`);
  res.redirect("/events");
};
