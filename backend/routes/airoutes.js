// const express= require("express");
// const {parseInvoiceFromText,generateRemainderEmail,getDashboardSummary} = require("../controllers/aicontroller");
// const {protect} = require("../middlewares/authmiddleware");
// const router = require("./authroutes");


// router.post("/parse-text",protect,parseInvoiceFromText);
// router.post("/generate-remainder",protect,generateRemainderEmail);
// router.post("/dashboard-summary",protect,getDashboardSummary);

// module.exports = router;

const express = require("express");

const {
  parseInvoiceFromText,
  generateRemainderEmail,
  getDashboardSummary,
} = require("../controllers/aicontroller");

const protect = require("../middlewares/authmiddleware");

const router = express.Router();


router.post("/parse-text", protect, parseInvoiceFromText);
router.post("/generate-remainder", protect, generateRemainderEmail);
router.post("/dashboard-summary", protect, getDashboardSummary);

module.exports = router