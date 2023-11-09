import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomAlert from "./CustomAlert";
import Loading from "./Loading";

const GlobalAlert = () => {
  const { alert } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <div>
      {alert.loading && <Loading />}

      {alert.error && <CustomAlert message={alert.error} success={false} />}

      {alert.success && <CustomAlert message={alert.success} success={true} />}
    </div>
  );
};

export default GlobalAlert;
