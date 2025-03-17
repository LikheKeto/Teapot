import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Alert, Button, Spinner } from "flowbite-react";
import { toast } from "react-toastify";

const Verification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [verificationStatus, setVerificationStatus] = useState("pending"); // pending, success, error, noParams
  const [errorMessage, setErrorMessage] = useState("");

  const isVerificationAttempted = useRef(false);

  useEffect(() => {
    if (token && email && !isVerificationAttempted.current) {
      isVerificationAttempted.current = true;
      verifyEmail(token, email);
    } else {
      setVerificationStatus("noParams");
    }
  }, [token, email]);

  const verifyEmail = async (token, email) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_ENDPOINT + "/api/auth/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus("success");
      } else {
        setVerificationStatus("error");
        setErrorMessage(
          data.error.email || data.error || "Verification failed."
        );
      }
    } catch (error) {
      setVerificationStatus("error");
      setErrorMessage("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    }
  };

  if (verificationStatus === "pending") {
    return <Spinner size="lg" />;
  }

  if (verificationStatus === "success") {
    return (
      <>
        <div>
          <Alert color="success">Email verified successfully!</Alert>
          <Button
            color="primary"
            className="m-auto mt-8"
            onClick={() => {
              navigate("/login", { replace: true });
            }}
          >
            Continue to login
          </Button>
        </div>
      </>
    );
  }

  if (verificationStatus === "error") {
    return <Alert color="failure">{errorMessage}</Alert>;
  }

  if (verificationStatus === "noParams") {
    return (
      <Alert color="info">
        An email with the verification link has been sent to you. Please verify
        your account by clicking on that link.
      </Alert>
    );
  }

  return null;
};

export default Verification;
