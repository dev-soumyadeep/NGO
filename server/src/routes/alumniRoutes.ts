import express from "express";
import { addAlumniController, removeAlumniController, getAlumniListController } from "../controller/alumniController";

const router = express.Router();

router.post("/add", addAlumniController);
router.delete("/:id", removeAlumniController);
router.get("/list", getAlumniListController);


export default router;