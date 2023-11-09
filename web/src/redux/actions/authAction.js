import { AUTH, ALERT } from "../types";
import { postDataAPI } from "../../utils/fetchData";

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: ALERT, payload: { loading: true } });
    const res = await postDataAPI("auth/login", data);
    dispatch({
      type: AUTH,
      payload: {
        token: res.data.access_token,
        user: res.data.user,
      },
    });

    localStorage.setItem("loggedIn", true);
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

export const refreshToken = () => async (dispatch) => {
  const loggedIn = localStorage.getItem("loggedIn");
  if (loggedIn) {
    dispatch({ type: ALERT, payload: { loading: true } });

    try {
      const res = await postDataAPI("auth/refresh_token");
      dispatch({
        type: AUTH,
        payload: {
          token: res.data.access_token,
          user: res.data.user,
        },
      });

      dispatch({ type: ALERT, payload: {} });
    } catch (err) {
      dispatch({
        type: ALERT,
        payload: {
          error: err.response.data.errorList[0].msg,
        },
      });
    }
  }
};

export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("loggedIn");
    await postDataAPI("auth/logout");
    window.location.href = "/";
  } catch (err) {
    dispatch({
      type: ALERT,
      payload: {
        error: err.response.data.errorList[0].msg,
      },
    });
  }
};

export const changePassword =
  ({ changePasswordData, auth }) =>
  async (dispatch) => {
    // const isCheck = validateChangePassword(changePasswordData);
    // console.log(isCheck);
    // if (isCheck.errLength > 0) {
    //   return dispatch({ type: ALERT, payload: isCheck.errMsg });
    // }
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await postDataAPI(
        "auth/change_password",
        changePasswordData,
        auth.token
      );
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
