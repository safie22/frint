// import axios from "axios";
// import { useFormik } from "formik";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { object, string } from "yup";

// export default function Login() {
//     const [incorrectEmail, setIncorrectEmail] = useState(null);
//     const navigate = useNavigate();

//     const passwordRegex =
//         /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

//     const validationSchema = object({
//         email: string()
//             .required("Email Is Required")
//             .email("Please Enter A Valid Email"),
//         password: string()
//             .required("Password Is required")
//             .matches(
//                 passwordRegex,
//                 "Minimum 8 characters, one uppercase, one lowercase, one number, one special character"
//             ),
//     });

//     async function sendLoginData(values) {
//         const loadingToastId = toast.loading("Please Wait...");
//         try {
//             const options = {
//                 url: "https://ecommerce.routemisr.com/api/v1/auth/signin",
//                 method: "POST",
//                 data: values,
//             };

//             let { data } = await axios.request(options);

//             if (data.message === "success") {
//                 localStorage.setItem("token", data.token);
//                 toast.success("Welcome Back");

//                 // ⬇️ Decode the token to extract the role
//                 const payload = JSON.parse(atob(data.token.split(".")[1]));
//                 const userRole = payload.role;

//                 // Navigate based on role
//                 if (userRole === "admin") {
//                     navigate("/adminDashboard");
//                 } else if (userRole === "landlord") {
//                     navigate("/landlordDashboard");
//                 } else if (userRole === "tenant") {
//                     navigate("/tenantDashboard");
//                 } else {
//                     navigate("/");
//                 }
//             }
//         } catch (error) {
//             toast.error(error.response.data.message);
//             setIncorrectEmail(error.response.data.message);
//         } finally {
//             toast.dismiss(loadingToastId);
//         }
//     }

//     const formik = useFormik({
//         initialValues: {
//             email: "",
//             password: "",
//         },
//         validationSchema,
//         onSubmit: sendLoginData,
//     });

//     return (
//         <>
//             <h1 className="text-xl text-slate-700 font-semibold pt-5 ml-96">
//                 <i className="fa-solid fa-circle-user me-2"></i> Login :
//             </h1>
//             <form className="pt-4 space-y-3 ml-96" onSubmit={formik.handleSubmit}>
//                 {/* Email */}
//                 <div>
//                     <input
//                         className="px-2 py-1 rounded-md border-2 w-[50%]"
//                         type="email"
//                         placeholder="Enter Your Email"
//                         {...formik.getFieldProps("email")}
//                     />
//                     {formik.touched.email && formik.errors.email && (
//                         <p className="text-red-600 text-sm mt-1">*{formik.errors.email}</p>
//                     )}
//                 </div>

//                 {/* Password */}
//                 <div>
//                     <input
//                         className="px-2 py-1 rounded-md border-2 w-[50%]"
//                         type="password"
//                         placeholder="Enter Your Password"
//                         {...formik.getFieldProps("password")}
//                     />
//                     {formik.touched.password && formik.errors.password && (
//                         <p className="text-red-600 text-sm mt-1">
//                             *{formik.errors.password}
//                         </p>
//                     )}
//                     {incorrectEmail && (
//                         <p className="text-red-600 text-sm mt-1">*{incorrectEmail}</p>
//                     )}
//                 </div>

//                 {/* Submit */}
//                 <button
//                     className="px-3 py-1 mb-5 rounded-md bg-blue-600 text-white w-[50%]"
//                     type="submit"
//                 >
//                     Login
//                 </button>
//             </form>
//         </>
//     );
// }


import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { object, string } from "yup";

export default function Login({ onLogin }) {
    const [loginError, setLoginError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // For demo purposes, we're using a simpler password validation for login
    const validationSchema = object({
        email: string()
            .required("Email is required")
            .email("Please enter a valid email"),
        password: string()
            .required("Password is required"),
    });

    async function handleLogin(values) {
        const loadingToastId = toast.loading("Logging in...");
        try {
            // For demo purpose, we'll use these hardcoded demo credentials
            // In production, replace with actual validation against stored users
            const demoCredentials = [
                { email: "admin@rentmate.com", password: "Admin123!", role: "admin", id: 501, name: "Admin User" },
                { email: "john@example.com", password: "Landlord123!", role: "landlord", id: 101, name: "John Smith" },
                { email: "alice@example.com", password: "Tenant123!", role: "tenant", id: 1, name: "Alice Brown" }
            ];
            
            // Check if credentials match any demo user
            const user = demoCredentials.find(
                user => user.email === values.email && user.password === values.password
            );
            
            if (user) {
                // Store user data in localStorage (in a real app, use JWT or other secure method)
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("userRole", user.role);
                localStorage.setItem("userId", user.id);
                localStorage.setItem("userName", user.name);
                
                // If tenant, set saved properties
                if (user.role === "tenant") {
                    localStorage.setItem("savedProperties", JSON.stringify([1, 3]));
                }
                
                toast.success(`Welcome back, ${user.name}!`);
                
                const redirectPath = location.state?.from;

                onLogin(user.role);
                

                // Navigate based on redirect path or role
                if (redirectPath) {
                    navigate(redirectPath);
                } else if (user.role === "admin") {
                    navigate("/admin/dashboard");
                } else if (user.role === "landlord") {
                    navigate("/landlord/dashboard");
                } else if (user.role === "tenant") {
                    navigate("/tenant/dashboard");
                }
            } else {
                // Check if registered in localStorage (for newly registered users)
                const registeredUsers = JSON.parse(localStorage.getItem("rentmateUsers")) || { 
                    tenants: [], 
                    landlords: [], 
                    admins: [] 
                };
                
                // Find user in any category
                const allUsers = [
                    ...registeredUsers.tenants,
                    ...registeredUsers.landlords,
                    ...registeredUsers.admins
                ];
                
                const registeredUser = allUsers.find(
                    user => user.email === values.email && user.password === values.password
                );
                
                if (registeredUser) {
                    // Check if landlord is approved
                    if (registeredUser.role === "landlord" && registeredUser.status === "pending") {
                        setLoginError("Your landlord account is pending approval");
                        toast.error("Your account is pending admin approval");
                        return;
                    }
                    
                    // Handle successful login for registered user
                    localStorage.setItem("isAuthenticated", "true");
                    localStorage.setItem("userRole", registeredUser.role);
                    localStorage.setItem("userId", registeredUser.id);
                    localStorage.setItem("userName", registeredUser.name);
                    
                    toast.success(`Welcome back, ${registeredUser.name}!`);
                    
                    // Call the onLogin prop to update app state
                    onLogin(registeredUser.role);
                    
                    // Check if there's a redirect path in location state
                    const redirectPath = location.state?.from;
                    
                    // Navigate based on redirect path or role
                    if (redirectPath) {
                        navigate(redirectPath);
                    } else if (registeredUser.role === "admin") {
                        navigate("/admin/dashboard");
                    } else if (registeredUser.role === "landlord") {
                        navigate("/landlord/dashboard");
                    } else if (registeredUser.role === "tenant") {
                        navigate("/tenant/dashboard");
                    }
                } else {
                    setLoginError("Invalid email or password");
                    toast.error("Invalid email or password");
                }
            }
        } catch (error) {
            toast.error("Login failed");
            console.error(error);
            setLoginError("Login failed. Please try again.");
        } finally {
            toast.dismiss(loadingToastId);
        }
    }

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: handleLogin,
    });

    return (
        <div className="max-w-md mx-auto px-4 py-10">
            <h1 className="text-2xl text-gray-800 font-semibold mb-6">
                <i className="fa-solid fa-right-to-bracket mr-2"></i> Login to RentMate
            </h1>
            
            <form className="space-y-5" onSubmit={formik.handleSubmit}>
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        id="email"
                        className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
                        type="email"
                        placeholder="Enter your email"
                        {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-600 text-sm mt-1">*{formik.errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        id="password"
                        className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
                        type="password"
                        placeholder="Enter your password"
                        {...formik.getFieldProps("password")}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-600 text-sm mt-1">
                            *{formik.errors.password}
                        </p>
                    )}
                    {loginError && (
                        <p className="text-red-600 text-sm mt-1">*{loginError}</p>
                    )}
                </div>

                {/* Demo Credentials */}
                <div className="bg-blue-50 p-3 rounded-md text-sm">
                    <p className="font-medium text-blue-800 mb-1">Demo Credentials:</p>
                    <p><strong>Admin:</strong> admin@rentmate.com / Admin123!</p>
                    <p><strong>Landlord:</strong> john@example.com / Landlord123!</p>
                    <p><strong>Tenant:</strong> alice@example.com / Tenant123!</p>
                </div>

                {/* Submit */}
                <button
                    className="w-full px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    type="submit"
                    disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? "Logging in..." : "Log In"}
                </button>
            </form>
        </div>
    );
}