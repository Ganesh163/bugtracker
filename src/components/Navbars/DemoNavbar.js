import { UserContext } from "context/UserContext";
import React, { useState, useContext, useEffect } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import { SET_USER } from "context/action.types";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
} from "reactstrap";

import routes from "routes.js";
import firebase from "firebase/app";
import { toast } from "react-toastify";

function Header(props) {
  const { state, dispatch } = useContext(UserContext);
  const { user } = state;

  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [color, setColor] = React.useState("transparent");
  const sidebarToggle = React.useRef();
  const location = useLocation();

  const getUserdetails = async () => {
    if (user.username != "") {
      firebase.auth().onAuthStateChanged((userfb) => {
        if (userfb) {
          firebase
            .database()
            .ref("users/" + userfb.uid)
            .set({
              email: userfb.email,
              username: user.username,
            });
        } else {
          toast("Cant Load User to database", { type: "error" });
        }
      });
    } else {
      await firebase.auth().onAuthStateChanged((userfb) => {
        if (userfb) {
          var userref = firebase.database().ref("users/" + userfb.uid);
          userref.on("value", (snapshot) => {
            const data = snapshot.val();
            const currUser = {
              email: userfb.email,
              uid: userfb.uid,
              username: data.username,
            };
            dispatch({
              type: SET_USER,
              payload: currUser,
            });
          });
        } else {
          toast("Cant Load User", { type: "error" });
        }
      });
    }
  };

  useEffect(() => {
    getUserdetails();
  }, []);

  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("dark");
    }
    setIsOpen(!isOpen);
  };
  const dropdownToggle = (e) => {
    setDropdownOpen(!dropdownOpen);
  };
  const getBrand = () => {
    let brandName = "Default Brand";
    routes.map((prop, key) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }
      return null;
    });
    return brandName;
  };
  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };
  // function that adds color dark/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("dark");
    } else {
      setColor("transparent");
    }
  };
  React.useEffect(() => {
    window.addEventListener("resize", updateColor.bind(this));
  });
  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);
  return (
    // add or remove classes depending if we are on full-screen-maps page or not
    <Navbar
      color={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "dark"
          : color
      }
      expand="lg"
      className={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "navbar-absolute fixed-top"
          : "navbar-absolute fixed-top " +
            (color === "transparent" ? "navbar-transparent " : "")
      }
    >
      <Container fluid>
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => openSidebar()}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <NavbarBrand href="/">{getBrand()}</NavbarBrand>
        </div>
        <NavbarToggler onClick={toggle}>
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </NavbarToggler>
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
          <form>
            <InputGroup className="no-border">
              <Input placeholder="Search..." />
              <InputGroupAddon addonType="append">
                <InputGroupText>
                  <i className="nc-icon nc-zoom-split" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </form>
          <Nav navbar>
            <Dropdown
              nav
              isOpen={dropdownOpen}
              toggle={(e) => dropdownToggle(e)}
            >
              <DropdownToggle caret nav className="ml-4">
                <p style={{ textTransform: "capitalize", fontSize: "17px" }}>
                  {user.username ? user.username : ""}
                </p>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem tag="a">
                  <Link to="/admin/user-page" style={{ color: "gray" }}>
                    <NavItem>Profile</NavItem>
                  </Link>
                </DropdownItem>
                <DropdownItem tag="a">
                  <Link
                    onClick={() => {
                      dispatch({
                        type: SET_USER,
                        payload: null,
                      });
                    }}
                    to="/signin"
                  >
                    <NavItem>Logout</NavItem>
                  </Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
