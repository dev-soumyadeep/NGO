import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { School } from "@/types";
import {
  MapPin,
  Mail,
  Phone,
  Users,
  ExternalLink,
  Trash2,
  Tag,
  Edit,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { deleteSchool } from "@/api/schoolService";
import { useToast } from "@/hooks/use-toast";
import { updateSchool } from "@/api/schoolService";
interface SchoolCardProps {
  school: School;
  onSchoolDeleted: () => void;
  onSchoolUpdated: () => void;
}

const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  onSchoolDeleted,
  onSchoolUpdated,
}) => {
  const { state } = useAuth();
  const { toast } = useToast();
  const isAdmin = state.isAuthenticated && state.user?.role === "admin";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState<Partial<School>>({
    ...school,
  });
  const handleDelete = async () => {
    try {
      await deleteSchool(school.id, state.token || "");
      toast({
        title: "Success",
        description: "School deleted successfully",
      });
      onSchoolDeleted();
    } catch (error) {
      console.error("Error deleting school or transactions:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete school. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updateSchool(school.id, editedFields, state.token || "")
      .then(() => {
        toast({
          title: "Success",
          description: "School details updated successfully",
        });
        setIsEditing(false);
        onSchoolUpdated();
      })
      .catch((error) => {
        console.error("Error updating school:", error);
        toast({
          title: "Error",
          description: "Failed to update school details. Please try again.",
          variant: "destructive",
        });
      });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="bg-brand-blue text-white p-4">
        <CardTitle className="text-xl font-bold">{school.name}</CardTitle>
      </CardHeader>
      {isEditing ? (
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start space-x-2">
            <Tag className="h-5 w-5 text-gray-500 mt-0.5" />
            <span className="text-gray-700">{school.id}</span>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
            <label htmlFor="contactEmail" className="text-gray-700">
              Enter new Address:
            </label>
            <input
              type="text"
              name="location"
              value={editedFields.location}
              className="border border-brand-blue/50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              onChange={handleChange}
            />
          </div>
          <div className="flex items-start space-x-2">
            <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
            <label htmlFor="contactEmail" className="text-gray-700">
              Enter new Email:
            </label>
            <input
              type="email"
              name="contactEmail"
              value={editedFields.contactEmail}
              className="border border-brand-blue/50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              onChange={handleChange}
            />
          </div>
          <div className="flex items-start space-x-2">
            <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
            <label htmlFor="contactNumber" className="text-gray-700">
              Enter new Number:
            </label>
            <input
              type="text"
              name="contactNumber"
              value={editedFields.contactNumber}
              className="border border-brand-blue/50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              onChange={handleChange}
            />
          </div>

          <div className="flex items-start space-x-2">
            <Users className="h-5 w-5 text-gray-500 mt-0.5" />
            <span className="text-gray-700">
              {school.numberOfStudents} Students
            </span>
          </div>
          <div className="flex space-x-2 mt-2">
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </CardContent>
      ) : (
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start space-x-2">
            <Tag className="h-5 w-5 text-gray-500 mt-0.5" />
            <span className="text-gray-700">{school.id}</span>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
            <span className="text-gray-700">{school.location}</span>
          </div>
          <div className="flex items-start space-x-2">
            <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
            <span className="text-gray-700">{school.contactEmail}</span>
          </div>
          <div className="flex items-start space-x-2">
            <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
            <span className="text-gray-700">{school.contactNumber}</span>
          </div>
          <div className="flex items-start space-x-2">
            <Users className="h-5 w-5 text-gray-500 mt-0.5" />
            <span className="text-gray-700">
              {school.numberOfStudents} Students
            </span>
          </div>
        </CardContent>
      )}

      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 justify-between items-center">
        {isAdmin && (
          <>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center space-x-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-1"
            >
              <Edit className="h-4 w-4" />
              <span>{isEditing ? "Cancel" : "Edit"}</span>
            </Button>
            <Button
              asChild
              variant="outline"
              className="text-brand-blue border-brand-blue hover:bg-brand-blue hover:text-white"
            >
              <Link
                to={`/finance/${school.id}`}
                className="flex items-center space-x-1"
              >
                <span>View Finance</span>
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
            >
              <Link
                to={`/students/${school.id}`}
                className="flex items-center space-x-1"
              >
                <span>Students</span>
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </>
        )}
      </CardFooter>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this school? This action will also
            delete all related transactions and students and cannot be undone.
          </p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SchoolCard;
