const { Router } = require("express");
const validate = require("../../middlewares/validate");
const { searchParams } = require("../../validators/search");
const publicSearch = require("../../controllers/public/search.controller");

const router = Router();

router.get("/:value", validate({ params: searchParams }), publicSearch.search);

module.exports = router;
