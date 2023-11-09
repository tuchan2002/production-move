import { STATISTIC } from "../types";

const initialState = {
  statisticProduct: [],
  unitsByRole: {},
};

const statisticReducer = (state = initialState, action) => {
  switch (action.type) {
    case STATISTIC.GET_ALL_UNIT_INFO:
      return {
        ...state,
        unitsByRole: action.payload,
      };
    case STATISTIC.GET_ADMIN_STATISTIC_PRODUCT:
      return {
        ...state,
        statisticProduct: action.payload,
      };
    case STATISTIC.GET_AGENT_STATISTIC_PRODUCT:
      return {
        ...state,
        statisticProduct: action.payload,
      };
    case STATISTIC.GET_FACTORY_STATISTIC_PRODUCT:
      return {
        ...state,
        statisticProduct: action.payload,
      };
    case STATISTIC.GET_CENTER_STATISTIC_PRODUCT:
      return {
        ...state,
        statisticProduct: action.payload,
      };
    default:
      return state;
  }
};

export default statisticReducer;
