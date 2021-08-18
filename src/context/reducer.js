import {
  SET_TICKET,
  SET_USER,
  TICKET_TO_UPDATE,
  SET_SINGLE_TICKET,
} from "./action.types";

export default (state, action) => {
  switch (action.type) {
    case SET_TICKET:
      return action.payload == null
        ? { ...state, tickets: [] }
        : {
            ...state,
            tickets: action.payload,
          };
    case TICKET_TO_UPDATE:
      return {
        ...state,
        ticketToUpdate: action.payload,
        ticketToUpdateKey: action.key,
      };
    case SET_USER:
      return action.payload == null
        ? { ...state, user: null }
        : {
            ...state,
            user: action.payload,
          };
    case SET_SINGLE_TICKET:
      return {
        ...state,
        ticket: action.payload,
      };
    default:
      return state;
  }
};
