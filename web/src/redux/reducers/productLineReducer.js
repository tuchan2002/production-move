import { PRODUCT_LINE } from "../types";

const initialState = {
  productLines: [],
  productLine: {},
};

const productLineReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_LINE.GET_ALL_PRODUCT_LINE:
      return {
        ...state,
        productLines: action.payload,
      };
    case PRODUCT_LINE.GET_ALL_OWN_PRODUCT_LINE:
      return {
        ...state,
        productLines: action.payload,
      };
    case PRODUCT_LINE.CREATE_PRODUCT_LINE:
      return {
        ...state,
        productLines: [...state.productLines, action.payload],
      };
    case PRODUCT_LINE.DELETE_PRODUCT_LINE:
      return {
        ...state,
        productLines: state.productLines.filter(
          (item) => item.id !== action.payload
        ),
      };
    case PRODUCT_LINE.GET_A_PRODUCT_LINE:
      return {
        ...state,
        productLine: action.payload,
      };
    default:
      return state;
  }
};

export default productLineReducer;
