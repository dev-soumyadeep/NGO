import { Request, Response } from "express";
import { addAlumni, removeAlumni, getAlumniList, Alumni } from "../models/Alumni";


export async function addAlumniController(req: Request, res: Response) {
  try {
    const alumni: Alumni = req.body;
    await addAlumni(alumni);
    res.status(201).json({ message: "Alumni added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add alumni", error });
  }
}


export async function removeAlumniController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await removeAlumni(id);
    res.json({ message: "Alumni removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove alumni", error });
  }
}

export async function getAlumniListController(req: Request, res: Response) {
  try {
    const alumniList = await getAlumniList();
    res.json(alumniList);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch alumni list", error });
  }
}


