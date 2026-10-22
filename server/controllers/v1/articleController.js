const fs = require("fs");
const path = require("path");

const articleModel = require("../../models/article");

exports.create = async (req, res, next) => {
  try {
    const { title, description, body, shortName, categoryID } = req.body;
    const cover = req.file;

    await articleModel.validation({ ...req.body, cover }).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const duplicatedShortname = await articleModel.findOne({ shortName });
    if (duplicatedShortname) {
      return res.status(401).json({ message: "duplicated short name" });
    }

    const article = await articleModel.create({
      title,
      description,
      shortName,
      body,
      creator: req.user._id,
      categoryID,
      cover: req.file.filename,
      publish: 1,
    });

    const populatedArticle = await article.populate("creator", "-password");

    return res.status(201).json(populatedArticle);
  } catch (error) {
    next(error);
  }
};

exports.saveDraft = async (req, res, next) => {
  try {
    const { title, description, body, shortName, categoryID } = req.body;

    const duplicatedShortname = await articleModel.findOne({ shortName });
    if (duplicatedShortname) {
      return res.status(401).json({ message: "duplicated short name" });
    }

    const cover = req.file;
    await articleModel.validation({ ...req.body, cover }).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const article = await articleModel.create({
      title,
      description,
      shortName,
      body,
      creator: req.user._id,
      categoryID,
      cover: req.file.filename,
      publish: 0,
    });

    const draftedArticle = await article.populate("creator", "-password");

    return res.status(201).json(draftedArticle);
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const articles = await articleModel
      .find()
      .populate("creator", "-password")
      .sort({ _id: -1 });

    if (articles.length === 0) {
      return res.status(404).json({ message: "No Article Available!" });
    }

    return res.json(articles);
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const article = await articleModel
      .findOne({ shortName: req.params.shortName })
      .populate("categoryID")
      .populate("creator", "-password")
      .lean();

    if (!article) {
      return res.status(404).json({ message: "Article Not Found!" });
    }

    res.json(article);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const deletedArticle = await articleModel.findOneAndRemove({
      _id: req.params.id,
    });
    if (!deletedArticle) {
      return res.status(404).json({ message: "Article Not Found!" });
    }

    const imgPath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "courses",
      "covers",
      deletedArticle.cover
    );
    fs.unlink(imgPath, async (err) => {
      if (err) {
        console.log(err);
      }
    });

    return res.json(deletedArticle);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const article = await articleModel.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article Not Found!" });
    }

    const { title, description, body, shortName, categoryID, publish } = req.body;

    if (shortName && shortName !== article.shortName) {
      const duplicatedShortname = await articleModel.findOne({ shortName });
      if (duplicatedShortname) {
        return res.status(401).json({ message: "duplicated short name" });
      }
    }

    const oldCover = article.cover;

    if (title !== undefined) article.title = title;
    if (description !== undefined) article.description = description;
    if (body !== undefined) article.body = body;
    if (shortName !== undefined) article.shortName = shortName;
    if (categoryID !== undefined) article.categoryID = categoryID;
    if (publish !== undefined) article.publish = Number(publish);
    if (req.file) article.cover = req.file.filename;

    await article.save();

    if (req.file && oldCover) {
      const imgPath = path.join(__dirname, "..", "..", "public", "courses", "covers", oldCover);
      fs.unlink(imgPath, (err) => {
        if (err) console.log(err);
      });
    }

    const updatedArticle = await article.populate("creator", "-password");

    return res.json(updatedArticle);
  } catch (error) {
    next(error);
  }
};