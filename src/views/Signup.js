import React, { useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Input,
  FormGroup,
} from "reactstrap";
import logo from "../assets/img/logo.svg";
import login from "../assets/img/login.jpg";

import firebase from "firebase/app";
import { UserContext } from "context/UserContext";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { SET_USER } from "context/action.types";

function Signup() {
  const { state, dispatch } = useContext(UserContext);
  const { user } = state;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        const currUser = {
          email: res.user.email,
          uid: res.user.uid,
          username,
        };
        dispatch({
          type: SET_USER,
          payload: currUser,
        });
      })
      .catch((error) => {
        console.log(error);
        toast(error.message, { type: "error" });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignUp();
  };

  if (user != null) {
    return <Redirect to="/admin/dashboard" />;
  }

  return (
    <div
      className="d-flex align-items-center min-vh-100 py-3 py-md-0"
      id="main-frame"
    >
      <Container>
        <Card className="login-card">
          <Row className="no-gutters">
            <Col md="5">
              <img src={login} alt="login" class="login-card-img" />
            </Col>
            <Col md="7">
              <CardBody>
                <div className="brand-wrapper">
                  <img src={logo} alt="logo" className="logo" />
                </div>
                <p class="login-card-description">Let's get Started!</p>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      placeholder="Email Address"
                    />
                  </FormGroup>
                  <FormGroup className="mb-4">
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      placeholder="Enter Password"
                    />
                  </FormGroup>
                  <FormGroup className="mb-4">
                    <Input
                      type="text"
                      name="username"
                      id="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="form-control"
                      placeholder="Create Username"
                    />
                  </FormGroup>
                  <Input
                    name="login"
                    id="login"
                    class="btn btn-block login-btn mb-4"
                    type="submit"
                    value="Sign Up"
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      fontWeight: "500",
                      fontSize: "15px",
                    }}
                  />
                </Form>
                <p class="login-card-footer-text">
                  Already have an account?{" "}
                  <Link to="/signin" class="text-reset">
                    Login here
                  </Link>
                </p>
                <nav class="login-card-footer-nav">
                  <a href="#!">Terms of use.</a>
                  <a href="#!">Privacy policy</a>
                </nav>
              </CardBody>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
}

export default Signup;
