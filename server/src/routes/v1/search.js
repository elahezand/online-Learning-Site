const { Router } = require("express");
const publicSearch = require("../../controllers/public/search.controller");

const router = Router();

router.get("/:value", publicSearch.search);

module.exports = router;
