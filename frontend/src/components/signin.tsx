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


export function SignIn() {
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

  const handleSignIn = async (e) => {
    e.preventDefault();

    const encryptedPassword = encryptPassword(formData.password);

    const encryptedFormData = {
      ...formData,
      password: encryptedPassword,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(encryptedFormData),
      });

      if (response.ok) {
        const responseData = await response.json();
        Cookies.set("authToken", responseData.token);
        window.location.href = "/";
      } else {
        const responseData = await response.json();
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error("Error during Signin");
      console.error("Error during Signin:", error);
    }
  };
  return (
    <ThemeProvider>
      <Navbar />
      <section className="grid h-screen items-center lg:grid-cols-2">
        <div className="my-auto p-8 text-center sm:p-10 md:p-20 xl:px-32 xl:py-24">
          <ToastContainer />
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Welcome back
          </Typography>
          <Typography className="font-normal mb-16 text-blue-gray-800">
            Welcome back, please enter your details.
          </Typography>

          <form onSubmit={handleSignIn} className="mx-auto max-w-[24rem] text-left">
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
            <Button size="lg" className="mt-6" fullWidth type="submit">
              sign in
            </Button>
          </form>
        </div>
        <img
          src="https://images.unsplash.com/photo-1454789476662-53eb23ba5907?q=80&w=1952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="background image"
          className="hidden h-screen w-full object-cover lg:block"
        />
      </section>
    
    </ThemeProvider>
  );
}

export default SignIn;
