import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import styled from 'styled-components';
import './forget.css';

// Styled components
/*
const Section = styled.section`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: self-start;
  width: 60%;
  align-items: center;
  margin-top: 10%;
`;
*/
const FormData = styled.div`
border-radius: 10px;
display: flex;
flex-direction: column;
align-items: self-start;
width: 60%;
align-items: center;
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

  &.login_page {
    padding: 20px;
    margin-top: 20px;
    width: 100%;
  }
`;

const NavLinkToHome = styled.p`
  a {
    color: inherit;
    text-decoration: none;
  }
`;

const ForgotPassword = () => {
  const { id, token } = useParams();
  const history = useNavigate();
  const [data2, setData] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const userValid = async () => {
    const res = await fetch(`http://localhost:8080/ForgotPassword/${id}/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    if (data.status === 201) {
      console.log("user valid");
    } else {
      history("*");
    }
  };

  const setval = (e) => {
    setPassword(e.target.value);
  };

  const sendpassword = async (e) => {
    e.preventDefault();

    if (password === "") {
      toast.error("password is required!", {
        position: "top-center"
      });
    } else if (password.length < 6) {
      toast.error("password must be 6 char!", {
        position: "top-center"
      });
    } else {
      const res = await fetch('http://localhost:8080/sendpasswordlink', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // autres headers si nécessaires
        },
        body: JSON.stringify(data), // si vous envoyez des données
      })
      

      const data = await res.json();

      if (data.status === 201) {
        setPassword("");
        setMessage(true);
      } else {
        toast.error("! Token Expired generate new Link", {
          position: "top-center"
        });
      }
    }
  };

  useEffect(() => {
    userValid();
    setTimeout(() => {
      setData(true);
    }, 3000);
  }, []);

  return (
    <>
      {data2 ? (
        
          <FormData className="form_data">
            <FormHeading>
              <h2 style={{ textAlign: 'center' }}>Entrez votre nouvelle mot de passe</h2>
            </FormHeading>

            <form>
              {message ? (
                <MessageParagraph style={{ color: "green", fontWeight: "bold" }}>
                  Password Successfully Updated
                </MessageParagraph>
              ) : (
                ""
              )}
              <FormInput>
                <label htmlFor="password">New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={setval}
                  name="password"
                  id="password"
                  placeholder="Enter Your new password"
                />
              </FormInput>

              <FormButton className="btn" onClick={sendpassword}>
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
