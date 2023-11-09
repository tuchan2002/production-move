import { ALERT, TRANSPORT } from "../types";
import { getDataAPI, postDataAPI } from "../../utils/fetchData";

export const getAllTransportReceive =
  ({ auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const productResponse = await getDataAPI(
        `transports/product/own/receive`,
        auth.token
      );
      const packageResponse = await getDataAPI(
        `transports/package/own/receive`,
        auth.token
      );
      dispatch({
        type: TRANSPORT.GET_ALL_TRANSPORT_RECEIVE,
        payload: [
          ...productResponse.data.transports,
          ...packageResponse.data.transports,
        ],
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

export const getAllTransportSend =
  ({ auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const productResponse = await getDataAPI(
        `transports/product/own/send`,
        auth.token
      );
      const packageResponse = await getDataAPI(
        `transports/package/own/send`,
        auth.token
      );
      dispatch({
        type: TRANSPORT.GET_ALL_TRANSPORT_SEND,
        payload: [
          ...productResponse.data.transports,
          ...packageResponse.data.transports,
        ],
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

export const acceptProduct =
  ({ data, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await postDataAPI(`products/accept`, data, auth.token);
      dispatch({
        type: TRANSPORT.ACCEPT_PRODUCT,
        payload: res.data.transport,
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

export const acceptPackage =
  ({ data, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await postDataAPI(`packages/accept`, data, auth.token);
      dispatch({
        type: TRANSPORT.ACCEPT_PACKAGE,
        payload: res.data.transport,
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
