import { Box, Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAgentStatisticProduct } from "../../../redux/actions/statisticAction";
import HomeAgentChart from "./HomeChart";
import HomeAgentOverview from "./Overview";

const AdminHome = () => {
  const { t } = useTranslation(["home"]);
  const { auth, statistic } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAgentStatisticProduct({ auth }));
  }, [dispatch]);

  const { statisticProduct } = statistic;

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
        <HomeAgentOverview t={t} statisticProduct={statisticProduct} />
        <HomeAgentChart t={t} statisticProduct={statisticProduct} />
      </Box>
    </Container>
  );
};

export default AdminHome;
