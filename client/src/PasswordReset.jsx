import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate depuis react-router-dom
import './PasswordReset_ForgotPassword.css';

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialisez useNavigate

  const setVal = (e) => {
    setEmail(e.target.value);
  }

  const sendLink = async (e) => {
    e.preventDefault();

    if (email === "") {
      toast.error("Email is required!", {
        position: "top-center"
      });
    } else if (!email.includes("@")) {
      toast.warning("Include @ in your email!", {
        position: "top-center"
      });
    } else {
      try {
        const res = await fetch("http://localhost:8080/sendpasswordlink", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (data.status === 201) {
          setEmail("");
          setMessage(true);
          // Redirigez vers la page de vérification
          navigate("/VerificationPage"); // Assurez-vous que "/verification" est le chemin approprié
        } else {
          toast.error(data.message || "Failed to send the password reset link.", {
            position: "top-center"
          });
        }

      } catch (error) {
        console.error('Error sending password reset email:', error);
        toast.error("Failed to send the password reset link.", {
          position: "top-center"
        });
      }
    }
  }

  return (
    <>
      <div className="form_data">
        <div className="form_heading">
          <h2 style={{ textAlign: 'center' }}>Entrez votre Email</h2>
        </div>

        {message ? <p style={{ color: "green", fontWeight: "bold" }}>Password reset link sent successfully in your email</p> : ""}
        <form>
          <div className="form_input">
            <label htmlFor="email">Email:</label>
            <input type="email" value={email} onChange={setVal} name="email" id="email" placeholder='Entrez votre Email' />
          </div>

          <button className='btn' onClick={sendLink}>Send</button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default PasswordReset;
