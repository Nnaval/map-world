"use client";
import { useState, useEffect } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"; // Replace with your Select component path
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

const departments = [
  "Computer Science",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Economics",
  "Biology",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Philosophy",
  "Psychology",
  "Architecture",
];

const EditProfile = () => {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    name: "",
    bio: "",
    about: "",
    department: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (session) {
      setForm({
        name: session.user.name || "",
        bio: session.user.bio || "",
        about: session.user.about || "",
        department: session.user.department || "",
      });
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepartmentSelect = (department) => {
    setForm((prev) => ({
      ...prev,
      department,
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting form:", form);
    // Handle form submission logic here
    router.push("/profile"); // Redirect to profile page after saving changes
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-6">
      <div className="relative w-full max-w-2xl">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Edit Profile
        </h1>
      </div>

      <div className="mt-8 w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="bio"
              className="block text-gray-700 font-medium mb-2"
            >
              Bio
            </label>
            <input
              type="text"
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write a short bio"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="about"
              className="block text-gray-700 font-medium mb-2"
            >
              About
            </label>
            <textarea
              id="about"
              name="about"
              value={form.about}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write about yourself"
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              htmlFor="department"
              className="block text-gray-700 font-medium mb-2"
            >
              Department
            </label>
            <Select
              onValueChange={handleDepartmentSelect}
              defaultValue={form.department}
            >
              <SelectTrigger className="w-full border rounded-lg">
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent className="max-h-40 overflow-y-auto">
                {departments.map((department, index) => (
                  <SelectItem key={index} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
