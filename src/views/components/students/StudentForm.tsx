import { useForm } from "react-hook-form";
import type { CreateStudentDTO } from "../../../models/student.types";
import { useStudents } from "../../../controllers/useStudents";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useState } from "react";
import { Camera, X } from "lucide-react";

interface StudentFormProps {
  onSuccess?: () => void;
}

const StudentForm = ({ onSuccess }: StudentFormProps) => {
  const { createStudent, isCreating } = useStudents();
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<CreateStudentDTO>();
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic client-side validation
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert("Only JPEG, PNG, and JPG are allowed");
        return;
      }

      setPreview(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setValue("image", undefined);
  };

  const onSubmit = (data: CreateStudentDTO) => {
    createStudent(data, {
      onSuccess: () => {
        reset();
        setPreview(null);
        onSuccess?.();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Image Upload Section */}
      <div className="flex justify-center mb-6">
        <div className="relative group">
          <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <Camera className="h-8 w-8 text-gray-400" />
            )}
          </div>
          
          <input 
            type="file" 
            id="student-image" 
            className="hidden" 
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleImageChange}
          />
          
          <label 
            htmlFor="student-image"
            className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 shadow-sm"
          >
            <Camera className="h-4 w-4" />
          </label>

          {preview && (
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm transform translate-x-1/4 -translate-y-1/4"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="John"
          {...register("first_name", { required: "First name is required" })}
          error={errors.first_name?.message}
        />
        <Input
          label="Last Name"
          placeholder="Doe"
          {...register("last_name", { required: "Last name is required" })}
          error={errors.last_name?.message}
        />
      </div>
      
      <Input
        label="Class ID"
        type="number"
        placeholder="1"
        {...register("class_id", { required: "Class ID is required", valueAsNumber: true })}
        error={errors.class_id?.message}
      />

      <Button type="submit" isLoading={isCreating} className="w-full">
        Add Student
      </Button>
    </form>
  );
};

export default StudentForm;
