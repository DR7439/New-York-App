import React from "react";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { Link } from "react-router-dom";

const PasswordResetRequest = () => {
  return (
    <div className="space-y-6 mx-auto max-w-xl w-full">
      <div>
        <h1 className="text-4xl font-medium">Forgot Your Password?</h1>
        <p className="text-sm text-neutral-500 mt-2">
          Enter your email address to request the link to reset password.
        </p>
      </div>
      <ResetPasswordForm />
      <p>
        <span>Know your password? </span>
        <Link to="/login" className="text-blue-600">
          Sign in now
        </Link>
      </p>
    </div>
  );
};

export default PasswordResetRequest;
