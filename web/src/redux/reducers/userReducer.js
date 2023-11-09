import { USER } from "../types";

const initialState = {
  users: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER.GET_ALL_USER:
      return {
        ...state,
        users: action.payload,
      };
    case USER.GET_USER_BY_ROLE:
      return {
        ...state,
        users: action.payload,
      };
    case USER.CREATE_USER:
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case USER.DELETE_USER_BY_ID:
      return {
        ...state,
        users: state.users.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
};

export default userReducer;
