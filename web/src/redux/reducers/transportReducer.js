import { TRANSPORT } from "../types";

const initialState = {
  transports: [],
};

const transportReducer = (state = initialState, action) => {
  switch (action.type) {
    case TRANSPORT.GET_ALL_TRANSPORT_RECEIVE:
      return {
        ...state,
        transports: action.payload,
      };
    case TRANSPORT.GET_ALL_TRANSPORT_SEND:
      return {
        ...state,
        transports: action.payload,
      };
    case TRANSPORT.ACCEPT_PACKAGE:
      return {
        ...state,
        transports: state.transports.map((tran) => {
          if (tran.id === action.payload.id) {
            tran.is_shipping = action.payload.is_shipping;
          }
          return tran;
        }),
      };
    case TRANSPORT.ACCEPT_PRODUCT:
      return {
        ...state,
        transports: state.transports.map((tran) => {
          if (tran.id === action.payload.id) {
            tran.is_shipping = action.payload.is_shipping;
          }
          return tran;
        }),
      };
    default:
      return state;
  }
};

export default transportReducer;
