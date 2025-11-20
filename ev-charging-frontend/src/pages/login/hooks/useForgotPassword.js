import { useState } from "react";
import { forgotPasswordApi } from "../services/authService";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const sendEmail = async (emailInput) => {
    setLoading(true);
    try {
      const res = await forgotPasswordApi(emailInput);
      setEmail(emailInput);
      setEmailSent(true); 
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  return { sendEmail, loading, emailSent, email };
};
