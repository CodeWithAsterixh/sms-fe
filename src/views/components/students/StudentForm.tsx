import { useForm } from "react-hook-form";
import type { CreateStudentDTO } from "../../../models/student.types";
import { useStudents } from "../../../controllers/useStudents";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface StudentFormProps {
  onSuccess?: () => void;
}

const StudentForm = ({ onSuccess }: StudentFormProps) => {
  const { createStudent, isCreating } = useStudents();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateStudentDTO>();

  const onSubmit = (data: CreateStudentDTO) => {
    createStudent(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
