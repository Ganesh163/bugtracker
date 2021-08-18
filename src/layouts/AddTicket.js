import React, { useState, useContext, useEffect } from "react";
import firebase from "firebase/app";
import {
  Col,
  Container,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  Row,
  Button,
} from "reactstrap";
import { v4 } from "uuid";

//context
import { UserContext } from "context/UserContext";
import { TICKET_TO_UPDATE } from "context/action.types";
import { toast } from "react-toastify";
import { useHistory } from "react-router";

const AddTicket = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const { ticketToUpdate, ticketToUpdateKey } = state;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectuserid, setSelectuserid] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const history = useHistory();

  const getUsers = async () => {
    const usrRef = await firebase.database().ref("/users");
    usrRef.on("value", (snapshot) => {
      setUsers(snapshot.val());
    });
  };

  useEffect(() => {
    if (ticketToUpdate) {
      setTitle(ticketToUpdate.title);
      setDescription(ticketToUpdate.description);
      setSelectuserid(ticketToUpdate.selectuserid);
      setIsUpdate(true);
    }
  }, [ticketToUpdate]);

  useEffect(() => {
    getUsers();
  }, []);

  const addTicket = async () => {
    try {
      firebase
        .database()
        .ref("tickets/" + v4())
        .set({
          title,
          description,
          selectuserid,
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateTicket = async () => {
    try {
      firebase
        .database()
        .ref("tickets/" + ticketToUpdateKey)
        .set({
          title,
          description,
          selectuserid,
        });
    } catch (error) {
      toast("Oooops...", { type: "error" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isUpdate ? updateTicket() : addTicket();
    dispatch({
      type: TICKET_TO_UPDATE,
      payload: null,
      key: null,
    });
    history.push("/admin/dashboard");
  };

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  return (
    <Container fluid className="mt-5">
      <Row>
        <Col md="10" className="offset-md-1 p-5">
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Input
                type="text"
                name="title"
                id="tickettitle"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mt-4">
              <Input
                type="textarea"
                name="description"
                id="ticketdescription"
                className="form-control"
                placeholder="Description"
                rows={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>
            <FormGroup style={{ width: "40%" }} className="mt-4">
              <Input
                isOpen={dropdownOpen}
                toggle={toggle}
                type="select"
                name="assignuser"
                value={selectuserid}
                onChange={(e) => setSelectuserid(e.target.value)}
              >
                <option>Assign User...</option>
                {Object.entries(users).map(([key, value]) => (
                  <option>{value.username}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup className="mt-4">
              <Button className="btn-round" color="primary" type="submit">
                Add Ticket
              </Button>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddTicket;
