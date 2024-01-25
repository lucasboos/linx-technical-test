import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ThemeProvider from "./theme-provider";
import Navbar from "./defaultNavbar";
import {
  Typography,
  Input,
  Button
} from "@material-tailwind/react";
import {
  ToastContainer,
  toast
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    isUserLoggedIn();
  }, []);

  const isUserLoggedIn = () => {
    if (!!Cookies.get("authToken")) return window.location.href = "/";
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const encryptPassword = (password: string): string => {
    return btoa(password); // Base64 encoding for simplicity, not secure!
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const encryptedPassword = encryptPassword(formData.password);

    const encryptedFormData = {
      ...formData,
      password: encryptedPassword,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(encryptedFormData),
      });

      if (response.ok) {
        window.location.href = "/login";
      } else {
        const responseData = await response.json();
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error("Error during signup");
      console.error("Error during signup:", error);
    }
  };

  return (
    <ThemeProvider>
      <Navbar />
      <section className="grid h-screen items-center p-8">
        <ToastContainer />
        <div className="text-center">
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Sign up to know the temperature
          </Typography>
          <Typography className="font-normal mb-12 text-blue-gray-800">
            Enter your username and password to register.
          </Typography>
          <form onSubmit={handleSignUp} className="mx-auto max-w-[24rem] text-left">
            <div className="mb-4">
              <Input
                color="black"
                size="lg"
                label="Username"
                type="name"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                crossOrigin
              />
            </div>
            <div className="mb-4">
              <Input
                color="black"
                size="lg"
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                crossOrigin
              />
            </div>
            <Button size="lg" className="mt-4" fullWidth type="submit">
              Sign up
            </Button>
            <Typography color="gray" className="mt-6 text-center font-normal">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-dark transition-colors hover:text-blue-700"
              >
                Log in
              </a>
            </Typography>
          </form>
        </div>
      </section>
    </ThemeProvider>
  );
}

export default SignUp;
