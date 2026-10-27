const Article = require("../../models/article");
const AppError = require("../../utils/AppError");
const paginate = require("../../utils/paginate");
const { PUBLIC_USER } = require("../shared/selects");
const { searchFilter, categoryFilter } = require("../shared/filter");

const SORTS = {
  newest: { _id: -1 },
  oldest: { _id: 1 },
  title: { title: 1 },
};

const STATUS = {
  published: { publish: 1 },
  draft: { publish: 0 },
  all: {},
};

const POPULATE = [{ path: "creator", select: PUBLIC_USER }, { path: "categoryID" }];

const isAdmin = (user) => user?.role === "ADMIN";

const buildFilter = async ({ search, category, status }, user) => ({
  ...searchFilter("title", search),
  ...(await categoryFilter(category)),
  ...STATUS[isAdmin(user) ? status : "published"],
});

const list = async ({ page, limit, sort, ...query }, user) =>
  paginate(Article, {
    filter: await buildFilter(query, user),
    sort: SORTS[sort],
    page,
    limit,
    populate: POPULATE,
  });

const getByShortName = async (shortName, user) => {
  const filter = isAdmin(user) ? { shortName } : { shortName, publish: 1 };
  const article = await Article.findOne(filter).populate(POPULATE).lean();
  if (!article) throw AppError.notFound("Article not found");
  return article;
};

module.exports = { list, getByShortName };
