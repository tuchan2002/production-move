import { WAREHOUSE } from "../types";

const initialState = {
  warehouses: [],
};

const productLineReducer = (state = initialState, action) => {
  switch (action.type) {
    case WAREHOUSE.GET_ALL_OWN_WAREHOUSE:
      return {
        ...state,
        warehouses: action.payload,
      };
    case WAREHOUSE.GET_ALL_WAREHOUSE_BY_UNIT:
      return {
        ...state,
        warehouses: action.payload,
      };
    case WAREHOUSE.CREATE_WAREHOUSE:
      return {
        ...state,
        warehouses: [...state.warehouses, action.payload],
      };
    case WAREHOUSE.DELETE_WAREHOUSE:
      return {
        ...state,
        warehouses: state.warehouses.filter(
          (item) => item.id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default productLineReducer;
