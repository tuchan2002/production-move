import { combineReducers } from "redux";
import authReducer from "./authReducer";
import alertReducer from "./alertReducer";
import userReducer from "./userReducer";
import productLineReducer from "./productLineReducer";
import warehouseReducer from "./warehouseReducer";
import packageReducer from "./packageReducer";
import productReducer from "./productReducer";
import transportReducer from "./transportReducer";
import requestReducer from "./requestReducer";
import statisticReducer from "./statisticReducer";
import uploadReducer from "./uploadReducer";

export default combineReducers({
  auth: authReducer,
  alert: alertReducer,
  user: userReducer,
  productLine: productLineReducer,
  warehouse: warehouseReducer,
  packageReducer: packageReducer,
  product: productReducer,
  transport: transportReducer,
  request: requestReducer,
  statistic: statisticReducer,
  upload: uploadReducer,
});
