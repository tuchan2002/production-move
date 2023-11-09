import { UPLOAD } from "../types";

const initialState = {
  images: {
    public_id: "",
    secure_url: "",
  },
};

const uploadReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD.UPLOAD_IMAGE:
      return {
        ...state,
        images: action.payload,
      };
    case UPLOAD.RESET_IMAGE:
      return {
        ...state,
        images: {
          public_id: "",
          secure_url: "",
        },
      };
    default:
      return state;
  }
};

export default uploadReducer;
