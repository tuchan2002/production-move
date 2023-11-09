import { ALERT, PACKAGE } from "../types";
import { postDataAPI, getDataAPI, deleteDataAPI } from "../../utils/fetchData";

export const createPackage =
  ({ data, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await postDataAPI("products", data, auth.token);
      dispatch({
        type: PACKAGE.CREATE_PACKAGE,
        payload: res.data,
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

export const getAllPackageByProductLineUnit =
  ({ data, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await getDataAPI(
        `packages/own/${data.productLineId}`,
        auth.token
      );
      dispatch({
        type: PACKAGE.GET_ALL_PACKAGE_BY_PL_UNIT,
        payload: res.data.packages,
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
export const getAllPackageByUnit =
  ({ auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await getDataAPI(`packages/own`, auth.token);
      dispatch({
        type: PACKAGE.GET_ALL_PACKAGE_BY_UNIT,
        payload: res.data.packages,
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
export const getAllPackageByCurrentFactory =
  ({ auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await getDataAPI(`packages/factory/created`, auth.token);
      dispatch({
        type: PACKAGE.GET_ALL_PACKAGE_BY_CURRENT_FACTORY,
        payload: res.data.packages,
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

export const movePackage =
  ({ data, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await postDataAPI(`packages/move`, data, auth.token);
      dispatch({
        type: PACKAGE.MOVE_PACKAGE,
        payload: res.data.transportSaved,
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

export const recallPackage =
  ({ data, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await postDataAPI(`packages/recall`, data, auth.token);
      dispatch({
        type: PACKAGE.RECALL_PACKAGE,
        payload: res.data.package,
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
