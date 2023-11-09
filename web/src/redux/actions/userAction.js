import { ALERT, USER } from "../types";
import { postDataAPI, getDataAPI, deleteDataAPI } from "../../utils/fetchData";

export const createUser =
  ({ data, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await postDataAPI("auth/register", data, auth.token);
      dispatch({
        type: USER.CREATE_USER,
        payload: res.data.user,
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

export const getAllUser =
  ({ auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await getDataAPI(`users`, auth.token);
      dispatch({
        type: USER.GET_ALL_USER,
        payload: res.users,
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

export const getUserByRole =
  ({ data, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await getDataAPI(`users/role/${data.role}`, auth.token);

      dispatch({
        type: USER.GET_USER_BY_ROLE,
        payload: res.users,
      });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err) {
      dispatch({
        type: ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const deleteUserById =
  ({ id, auth }) =>
  async (dispatch) => {
    try {
      const res = await deleteDataAPI(`users/${id}`, auth.token);
      dispatch({
        type: USER.DELETE_USER_BY_ID,
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };
