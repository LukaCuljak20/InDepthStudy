exports.errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);

  res.status(status).render(status === 404 ? "404" : "error", {
    title: status === 404 ? "Not found" : "Error",
    message: err.message,
    status,
  });
};
