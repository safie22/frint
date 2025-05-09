import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { object, ref, string } from "yup";

export default function Signup() {
  const [accountExistError, setAccountExistError] = useState(null);
  const navigate = useNavigate();

  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  const phoneRegex = /^(02)?01[0125][0-9]{8}$/;

  const validationSchema = object({
    name: string()
      .required("Name Is Required")
      .min(3, "Name Must be At Least 3 Characters")
      .max(25, "Name Can Not Be More Than 25 Characters"),
    email: string()
      .required("Email Is Required")
      .email("Please Enter A Valid Email"),
    password: string()
      .required("Password Is required")
      .matches(
        passwordRegex,
        "Minimum 8 characters, one uppercase, one lowercase, one number, one special character"
      ),
    rePassword: string()
      .required("Confirm Password Is Required")
      .oneOf([ref("password")], "Passwords Must Match"),
    phone: string()
      .required("Phone Is Required")
      .matches(phoneRegex, "Only Egyptian phone numbers are allowed"),
    role: string().required("Role is required"),
  });

  async function registerUser(values) {
    const loadingToastId = toast.loading("Creating account...");
    try {
      // Get existing users from localStorage or initialize empty object
      const existingUsers = JSON.parse(localStorage.getItem("rentmateUsers")) || {
        tenants: [],
        landlords: [],
        admins: []
      };
      
      // Check if email already exists
      const allUsers = [
        ...existingUsers.tenants, 
        ...existingUsers.landlords, 
        ...existingUsers.admins
      ];
      
      const emailExists = allUsers.some(user => user.email === values.email);
      
      if (emailExists) {
        setAccountExistError("Email already in use");
        toast.error("Email already in use");
        return;
      }
      
      // Create new user object
      const newUser = {
        id: Date.now(), // Generate unique ID
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password, // Note: In a real app, never store plain passwords
      };
      
      // Add role-specific properties
      if (values.role === "tenant") {
        newUser.savedProperties = [];
        newUser.applications = [];
        existingUsers.tenants.push(newUser);
      } else if (values.role === "landlord") {
        newUser.properties = [];
        newUser.status = "pending"; // New landlords need admin approval
        existingUsers.landlords.push(newUser);
      } else if (values.role === "admin") {
        existingUsers.admins.push(newUser);
      }
      
      // Save updated users to localStorage
      localStorage.setItem("rentmateUsers", JSON.stringify(existingUsers));
      
      toast.success("Account created successfully");
      
      // For landlords, show a special message
      if (values.role === "landlord") {
        toast.success("Your account is pending admin approval", { duration: 5000 });
      }
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      toast.error("Error creating account");
      console.error(error);
    } finally {
      toast.dismiss(loadingToastId);
    }
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
      role: "",
    },
    validationSchema,
    onSubmit: registerUser,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl text-gray-800 font-semibold mb-6">
        <i className="fa-solid fa-user-plus mr-2"></i> Create Your RentMate Account
      </h1>
      
      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            id="name"
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
            type="text"
            placeholder="Enter your full name"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-600 text-sm mt-1">*{formik.errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            id="email"
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
            type="email"
            placeholder="Enter your email address"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-600 text-sm mt-1">*{formik.errors.email}</p>
          )}
          {accountExistError && (
            <p className="text-red-600 text-sm mt-1">*{accountExistError}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
            type="password"
            placeholder="Create a secure password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-600 text-sm mt-1">
              *{formik.errors.password}
            </p>
          )}
        </div>

        {/* Re-Password */}
        <div>
          <label htmlFor="rePassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            id="rePassword"
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
            type="password"
            placeholder="Confirm your password"
            {...formik.getFieldProps("rePassword")}
          />
          {formik.touched.rePassword && formik.errors.rePassword && (
            <p className="text-red-600 text-sm mt-1">
              *{formik.errors.rePassword}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            id="phone"
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
            type="tel"
            placeholder="Enter your phone number"
            {...formik.getFieldProps("phone")}
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-600 text-sm mt-1">*{formik.errors.phone}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
          <select
            id="role"
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
            {...formik.getFieldProps("role")}
          >
            <option value="">Select your role</option>
            <option value="tenant">Tenant - Looking for properties</option>
            <option value="landlord">Landlord - Listing properties</option>
            <option value="admin">Admin</option>
          </select>
          {formik.touched.role && formik.errors.role && (
            <p className="text-red-600 text-sm mt-1">*{formik.errors.role}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          className="w-full px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="submit"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}

