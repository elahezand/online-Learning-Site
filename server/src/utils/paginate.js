const paginate = async (Model, { filter = {}, sort = { _id: -1 }, page = 1, limit = 10, populate = [], select } = {}) => {
  const skip = (page - 1) * limit;

  let query = Model.find(filter).sort(sort).skip(skip).limit(limit).lean();
  if (select) query = query.select(select);
  for (const option of populate) query = query.populate(option);

  const [items, total] = await Promise.all([query, Model.countDocuments(filter)]);
  const pages = Math.max(1, Math.ceil(total / limit));

  return {
    items,
    pagination: { page, limit, total, pages, hasNext: page < pages, hasPrev: page > 1 },
  };
};

module.exports = paginate;
