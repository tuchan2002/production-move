import { ALERT, WAREHOUSE } from "../types";
import { postDataAPI, getDataAPI, deleteDataAPI } from "../../utils/fetchData";

export const createWarehouses =
  ({ data, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await postDataAPI("warehouses", data, auth.token);
      dispatch({
        type: WAREHOUSE.CREATE_WAREHOUSE,
        payload: res.data.newWarehouse,
      });

      dispatch({
        type: ALERT,
        payload: {
          success: res.message,
        },
      });
    } catch (err) {
      dispatch({
        type: ALERT,
        payload: {
          error: err.response.data.errorList[0].msg,
        },
      });
    }
  };

export const getAllOwnWarehouse =
  ({ auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await getDataAPI(`warehouses/own`, auth.token);
      dispatch({
        type: WAREHOUSE.GET_ALL_OWN_WAREHOUSE,
        payload: res.data.warehouses,
      });
      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err) {
      dispatch({
        type: ALERT,
        payload: {
          error: err.response.data.errorList[0].msg,
        },
      });
    }
  };
export const getAllWarehouseByUnit =
  ({ data, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await getDataAPI(
        `warehouses/unit/${data.unitId}`,
        auth.token
      );
      dispatch({
        type: WAREHOUSE.GET_ALL_WAREHOUSE_BY_UNIT,
        payload: res.data.warehouses,
      });
      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err) {
      dispatch({
        type: ALERT,
        payload: {
          error: err.response.data.errorList[0].msg,
        },
      });
    }
  };

export const deleteWarehouseById =
  ({ id, auth }) =>
  async (dispatch) => {
    try {
      const res = await deleteDataAPI(`warehouses/${id}`, auth.token);
      dispatch({
        type: WAREHOUSE.DELETE_WAREHOUSE,
        payload: id,
      });
      dispatch({
        type: ALERT,
        payload: {
          success: res.message,
        },
      });
    } catch (err) {
      dispatch({
        type: ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };
