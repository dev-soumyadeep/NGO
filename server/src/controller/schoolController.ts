import { Request, Response } from "express";
import {
  School,
  createSchool,
  updateSchool,
  getAllSchools,
  getSchoolById,
  deleteSchool,
} from "../models/School.ts";

// Add a new school
export const addSchool = async (req: Request, res: Response) => {
  const { id, name, location, contactNumber, contactEmail } = req.body;

  try {
    if (
      typeof id !== "string" ||
      !name ||
      !location ||
      !contactNumber ||
      !contactEmail
    ) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    // Check for duplicate school name
    const existingSchools = await getAllSchools();
    if (existingSchools.some((s) => s.name === name)) {
      return res.status(400).json({ message: "School already exists" });
    }

    const newSchool: School = {
      id,
      name,
      location,
      contactNumber,
      contactEmail,
      numberOfStudents: 0,
    };

    await createSchool(newSchool);

    res.status(201).json({
      message: "School added successfully",
      school: newSchool,
    });
  } catch (error) {
    console.error("Error adding school:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an existing school
export const updateSchoolController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { location, contactNumber, contactEmail } = req.body;

  try {
    if (!id || !location || !contactNumber || !contactEmail) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const school = await getSchoolById(id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // Update the school details
    school.location = location;
    school.contactNumber = contactNumber;
    school.contactEmail = contactEmail;

    await updateSchool(school);

    res.status(200).json({
      message: "School updated successfully",
      school,
    });
  } catch (error) {
    console.error("Error updating school:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all schools
export const getSchools = async (req: Request, res: Response) => {
  try {
    const schools = await getAllSchools();
    res.status(200).json({
      message: "Schools fetched successfully",
      schools,
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a school by ID
export const getSchoolByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({ message: "Invalid school ID" });
    }

    const school = await getSchoolById(id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    res.status(200).json({
      message: "School fetched successfully",
      school,
    });
  } catch (error) {
    console.error("Error fetching school:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a school by ID
export const deleteSchoolController = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid school ID" });
    }

    const school = await getSchoolById(id);
    if (!school) {
      return res
        .status(404)
        .json({ success: false, message: "School not found" });
    }

    await deleteSchool(id);
    return res
      .status(200)
      .json({ success: true, message: "School deleted successfully" });
  } catch (error) {
    console.error("Error deleting school:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getSchoolNameByIdController = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({ message: "Invalid school ID" });
    }

    const school = await getSchoolById(id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // Only return the school name
    res.status(200).json({
      schoolName: school.name,
    });
  } catch (error) {
    console.error("Error fetching school name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
