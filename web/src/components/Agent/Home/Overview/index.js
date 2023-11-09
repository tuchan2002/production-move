import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import Overview from "../../../Shared/Home/Overview";

const HomeAgentOverview = ({ t, statisticProduct }) => {
  const calculateNumOfProducts = () => {
    return statisticProduct?.reduce(
      (total, item) => total + item.numOfProduct,
      0
    );
  };
  const calculateNumOfSoldProducts = () => {
    return statisticProduct?.reduce(
      (total, item) => total + item.numOfSoldProduct,
      0
    );
  };
  const calculateNumOfErrorProducts = () => {
    return statisticProduct?.reduce(
      (total, item) => total + item.numOfErrorProduct,
      0
    );
  };

  const overviewData = [
    {
      text: t("imported products"),
      value: calculateNumOfProducts(),
      color: "primary.light",
    },
    {
      text: t("sold products"),
      value: calculateNumOfSoldProducts(),
      color: "success.light",
    },
    {
      text: t("defective products"),
      value: calculateNumOfErrorProducts(),
      color: "error.light",
    },
  ];
  return <Overview overviewData={overviewData} />;
};

export default HomeAgentOverview;
