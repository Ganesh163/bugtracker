import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import firebase from "firebase/app";
import AddTicket from "layouts/AddTicket";
import { UserContext } from "context/UserContext";
import {
  SET_TICKET,
  TICKET_TO_UPDATE,
  SET_SINGLE_TICKET,
} from "context/action.types";
import { MdDelete, MdEdit } from "react-icons/md";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";
import "../assets/css/table.css";
import { useHistory } from "react-router";

function Tables() {
  const { state, dispatch } = useContext(UserContext);
  const { tickets, ticket } = state;
  const history = useHistory();

  const getTickets = async () => {
    const ticketsRef = await firebase.database().ref("/tickets");
    ticketsRef.on("value", (snapshot) => {
      dispatch({
        type: SET_TICKET,
        payload: snapshot.val(),
      });
    });
  };

  useEffect(() => {
    getTickets();
  }, []);

  const deleteTicket = (ticketKey) => {
    firebase
      .database()
      .ref(`/tickets/${ticketKey}`)
      .remove()
      .then(() => {
        toast("Deleted Succesfully", { type: "warning" });
      })
      .catch((error) => console.log(error));
  };

  const updateTicket = (ticket, ticketKey) => {
    dispatch({
      type: TICKET_TO_UPDATE,
      payload: ticket,
      key: ticketKey,
    });
    history.push("/admin/addticket");
  };

  const viewSingleTicket = (ticket) => {
    dispatch({
      type: SET_SINGLE_TICKET,
      payload: ticket,
    });
    //TODO: Add View Page
    history.push("/admin/addticket");
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Active Tickets</CardTitle>
              </CardHeader>
              <CardBody>
                {tickets.length === 0 ? (
                  <div className="Center text-large text-primary">
                    No Tickets Found
                  </div>
                ) : (
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Title</th>
                        <th>User Assigned</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(tickets).map(([key, value]) => (
                        <tr
                          className="tablerow"
                          onClick={() => {
                            viewSingleTicket(value);
                          }}
                        >
                          <td>{value.title}</td>
                          <td>{value.selectuserid}</td>
                          <td>
                            <MdDelete
                              onClick={() => {
                                deleteTicket(key);
                              }}
                              color="danger"
                              className="text-danger icon mat-icon"
                            />
                            <MdEdit
                              onClick={() => {
                                updateTicket(value, key);
                              }}
                              className="icon text-info ml-2 mat-icon"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Tables;
