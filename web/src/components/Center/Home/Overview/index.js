import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import Overview from "../../../Shared/Home/Overview";

const HomeCenterOverview = ({ t, statisticProduct }) => {
  const calculateNumOfRepairs = () => {
    return statisticProduct?.reduce(
      (total, item) => total + item.numOfRepairs,
      0
    );
  };
  const calculateNumOfSuccessRepairs = () => {
    return statisticProduct?.reduce(
      (total, item) => total + item.numOfSuccessRepairs,
      0
    );
  };
  const calculateNumOfFailureRepairs = () => {
    return statisticProduct?.reduce(
      (total, item) => total + item.numOfFailureRepairs,
      0
    );
  };

  const overviewData = [
    {
      text: t("warranty tickets"),
      value: calculateNumOfRepairs(),
      color: "primary.light",
    },
    {
      text: t("successful warranty tickets"),
      value: calculateNumOfSuccessRepairs(),
      color: "success.light",
    },
    {
      text: t("failed warranty tickets"),
      value: calculateNumOfFailureRepairs(),
      color: "neutral.main",
    },
  ];
  return <Overview overviewData={overviewData} />;
};

export default HomeCenterOverview;
