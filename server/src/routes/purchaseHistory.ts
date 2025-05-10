import express from "express";
import {
fetchFilteredPurchaseHistory
} from "../controller/purchaseHistoryController";

const router = express.Router();

// /api/purchase-history/filter?startDate=...&endDate=...&studentId=...&itemName=...&schoolId=...
router.get("/filter", fetchFilteredPurchaseHistory);

export default router;
