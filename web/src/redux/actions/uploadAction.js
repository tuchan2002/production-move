import { ALERT, UPLOAD } from "../types";
import { postDataAPI } from "../../utils/fetchData";

export const uploadImage =
  ({ data, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await postDataAPI("image/upload", data, auth.token);
      dispatch({
        type: UPLOAD.UPLOAD_IMAGE,
        payload: res.images,
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

export const destroyImage =
  ({ data, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await postDataAPI("image/destroy", data, auth.token);
      dispatch({
        type: UPLOAD.RESET_IMAGE,
        payload: "",
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

export const resetImage = () => async (dispatch) => {
  try {
    dispatch({
      type: UPLOAD.RESET_IMAGE,
      payload: "",
    });
  } catch (err) {
    console.log(err);
  }
};
