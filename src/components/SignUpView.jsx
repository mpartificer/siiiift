import "../App.css";
import LogInGreeting from "./multipurpose/LogInGreeting.jsx";
import { supabase } from "../supabaseClient.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios"; // Make sure axios is installed

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";

const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Must be a valid email" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username must be less than 20 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    reenter_password: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.reenter_password, {
    message: "Passwords don't match",
    path: ["reenter_password"],
  });

function SignUpView() {
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      reenter_password: "",
    },
  });

  const checkUsernameAvailability = async (username) => {
    try {
      // Updated to use the correct endpoint path that matches your backend
      const response = await axios.get(`${API_URL}/api/auth/check/${username}`);

      // Check the response structure based on your authEndpoints.js
      // Your authEndpoint returns { success: true, data: data }
      return !response.data.data; // If data exists, username is taken, so return !data
    } catch (error) {
      console.error("Error checking username availability:", error);
      throw new Error("Failed to check username availability");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setUsernameError("");

    try {
      // First check if username is available
      const isUsernameAvailable = await checkUsernameAvailability(
        data.username
      );
      if (!isUsernameAvailable) {
        setUsernameError("Username is already taken");
        setLoading(false);
        return;
      }

      // Proceed with signup, including username in user metadata
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: data.email,
          password: data.password,
          options: {
            data: {
              username: data.username,
            },
          },
        }
      );

      if (signUpError) {
        // Check if the error is related to username conflict
        if (signUpError.message?.includes("Database error saving new user")) {
          setUsernameError("username is already taken");
          return;
        }
        throw signUpError;
      }

      alert("Check your email for the confirmation link!");
      navigate("/login");
    } catch (error) {
      if (!usernameError) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="logInView" onSubmit={handleSubmit(onSubmit)}>
      <LogInGreeting openingTitle="siiiift" />

      <div>
        <input
          className="loginBar"
          type="text"
          placeholder="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          className="loginBar"
          type="text"
          placeholder="username"
          {...register("username")}
        />
        {errors.username && (
          <p className="error-message">{errors.username.message}</p>
        )}
        {usernameError && <p className="error-message">{usernameError}</p>}
      </div>

      <div>
        <input
          className="loginBar"
          type="password"
          placeholder="password"
          {...register("password")}
        />
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}
      </div>

      <div>
        <input
          className="loginBar"
          type="password"
          placeholder="reenter password"
          {...register("reenter_password")}
        />
        {errors.reenter_password && (
          <p className="error-message">{errors.reenter_password.message}</p>
        )}
      </div>

      <button className="bigSubmitButton" type="submit" disabled={loading}>
        {loading ? "Loading..." : "sign up"}
      </button>
    </form>
  );
}

export default SignUpView;
