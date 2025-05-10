import { Request, Response } from "express";
import {
  getPurchaseHistoriesByStudentId,
  getFilteredPurchaseHistory
} from "../models/PurchaseHistory";

// ✅ GET by studentId: /api/purchase-history/student/:studentId
export async function fetchPurchaseHistoriesByStudentId(req: Request, res: Response) {
  try {
    const studentId = req.params.studentId;
    const histories = await getPurchaseHistoriesByStudentId(studentId);
    res.status(200).json(histories);
  } catch (error) {
    console.error("Error fetching purchase history by studentId:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// ✅ GET with date range and optional filters: /api/purchase-history/filter?startDate=...&endDate=...&studentId=...&itemName=...&schoolId=...
export async function fetchFilteredPurchaseHistory(req: Request, res: Response) {
  try {
    const {
      startDate,
      endDate,
      studentId,
      itemName,
      schoolId
    } = req.query;

    const history = await getFilteredPurchaseHistory({
      startDate: startDate ? String(startDate) : undefined,
      endDate: endDate ? String(endDate) : undefined,
      studentId: studentId ? String(studentId) : undefined,
      itemName: itemName ? String(itemName) : undefined,
      schoolId: schoolId ? String(schoolId) : undefined,
    });

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching filtered purchase history:", error);
    res.status(500).json({ message: "Server error" });
  }
}
