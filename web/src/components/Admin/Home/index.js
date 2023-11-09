import { Box, Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminStatisticProduct,
  getAllUnitInfomation,
} from "../../../redux/actions/statisticAction";
import HomeAdminChart from "./HomeChart";
import HomeAdminOverview from "./Overview";
import UnitManagement from "./UnitManagement";

const AgentHome = () => {
  const { t } = useTranslation(["home"]);
  const { auth, statistic } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdminStatisticProduct({ auth }));
    dispatch(getAllUnitInfomation({ auth }));
  }, [dispatch]);

  const { statisticProduct, unitsByRole } = statistic;

  return (
    <Container maxWidth="xl">
      <Box
        py={3}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <HomeAdminOverview t={t} statisticProduct={statisticProduct} />
        <HomeAdminChart t={t} statisticProduct={statisticProduct} />
        <UnitManagement unitsByRole={unitsByRole} />
      </Box>
    </Container>
  );
};

export default AgentHome;
