import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import styled from 'styled-components';
import './forget.css';

const FormData = styled.div`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  margin-top: 10%;
`;

const FormHeading = styled.div`
  font-size: 34px;
`;

const MessageParagraph = styled.p`
  color: #4a5568;
  font-size: 15px;
  margin-top: 9px;
`;

const FormInput = styled.div`
  label {
    font-weight: 500;
    font-size: 16px;
    position: sticky;
  }

  input {
    width: 100%;
    padding: 11px;
    border: 1px solid #d4d0d0;
    border-radius: 5px;
    outline: none;
    margin-bottom: 15px;
    margin-top: 15px;
    font-size: 14px;
  }
`;

const FormButton = styled.button`
  background-color: #1f4172;
  color: white;
  border-radius: 5px;
  border: none;
  padding: 10px;
  margin: 10px;
  width: 100%;
  height: auto;
`;

const NavLinkToHome = styled.p`
  a {
    color: inherit;
    text-decoration: none;
  }
`;

const ForgotPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);

  const userValid = async () => {
    try {
      console.log("User ID:", id); // Log the value of id
      const res = await fetch(`http://localhost:8080/validateUser/${id}`, {
      method: "GET",
     headers: {
      "Content-Type": "application/json"
    }
   });


      const data = await res.json();

      if (data.status === 201) {
        console.log("User valid");
      } else {
        console.error('Invalid user or expired token. Navigating...');
        navigate("*");
      }
    } catch (error) {
      console.error('Error validating user:', error);
      navigate("*");
    }
  };

  const setVal = (e) => {
    setPassword(e.target.value);
  };

  const sendPassword = async (e) => {
    e.preventDefault();

    if (password === "") {
      toast.error("Password is required!", {
        position: "top-center"
      });
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters!", {
        position: "top-center"
      });
    } else {
      try {
        const res = await fetch(`http://localhost:8080/change-password/${id}/${token}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        });

        const data = await res.json();

        if (data.status === 201) {
          setPassword("");
          setPasswordChanged(true);
        } else {
          toast.error("Token expired. Generate a new link.", {
            position: "top-center"
          });
        }
      } catch (error) {
        console.error('Error sending password:', error);
        toast.error("An error occurred while sending the password.", {
          position: "top-center"
        });
      }
    }
  };

  useEffect(() => {
    if (id) {
      console.log("Effect triggered with ID:", id);
      userValid();
      setTimeout(() => {
        setDataLoaded(true);
      }, 3000);
    }
  }, [id]);
  
  return (
    <>
      {dataLoaded ? (
        <FormData className="form_data">
          <FormHeading>
            <h2 style={{ textAlign: 'center' }}>Enter your new password</h2>
          </FormHeading>

          <form>
            {passwordChanged ? (
              <MessageParagraph style={{ color: "green", fontWeight: "bold" }}>
                Password successfully updated
              </MessageParagraph>
            ) : (
              ""
            )}
            <FormInput>
              <label htmlFor="password">New password</label>
              <input
                type="password"
                value={password}
                onChange={setVal}
                name="password"
                id="password"
                placeholder="Enter your new password"
              />
            </FormInput>

            <FormButton className="btn" onClick={sendPassword}>
              Send
            </FormButton>
          </form>
          <NavLinkToHome>
            <NavLink to="/">Home</NavLink>
          </NavLinkToHome>
          <ToastContainer />
        </FormData>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
          Loading... &nbsp;
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default ForgotPassword;
