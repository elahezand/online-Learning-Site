const withUploadedFile = (req) => (req.file ? { ...req.body, [req.file.fieldname]: req.file } : req.body ?? {});

const SOURCES = {
  params: (req) => req.params,
  query: (req) => req.query,
  body: withUploadedFile,
};

const validate = (schemas = {}) => (req, res, next) => {
  const data = {};
  for (const [source, schema] of Object.entries(schemas)) {
    const result = schema.safeParse(SOURCES[source](req));
    if (!result.success) return next(result.error);
    Object.assign(data, result.data);
  }
  req.parsed = { data: { ...req.parsed?.data, ...data } };
  next();
};

module.exports = validate;