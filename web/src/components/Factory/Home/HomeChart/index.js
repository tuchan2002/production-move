import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

const initOptions = {
  chart: {
    height: 500,
  },
  title: {
    text: null,
  },
  accessibility: {
    enabled: false,
  },
  xAxis: {
    crosshair: true,
    title: {
      text: null,
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: null,
    },
  },
  series: [],
};

const HomeFactoryChart = ({ t, statisticProduct }) => {
  const [viewChartStatus, setViewChartStatus] = useState("all");

  const onChangeViewChartStatus = (e) => {
    setViewChartStatus(e.target.value);
  };

  const generateOptions = () => {
    const productLineList = statisticProduct?.map((item) => item.model);
    const numOfProduct = statisticProduct?.map((item) =>
      viewChartStatus === "all"
        ? item.numOfProduct
        : item.numOfCreateProductLastM
    );
    const numOfSoldProduct = statisticProduct?.map((item) =>
      viewChartStatus === "all"
        ? item.numOfSoldProduct
        : item.numOfSoldProductLastM
    );
    const numOfErrorProduct = statisticProduct?.map((item) =>
      viewChartStatus === "all"
        ? item.numOfErrorProduct
        : item.numOfErrorProductLastM
    );
    return {
      ...initOptions,
      series: [
        {
          type: "column",
          color: "#42a5f5",
          name: t("created products"),
          data: numOfProduct,
        },
        {
          type: "column",
          color: "#4caf50",
          name: t("sold products"),
          data: numOfSoldProduct,
        },
        {
          type: "column",
          color: "#ef5350",
          name: t("defective products"),
          data: numOfErrorProduct,
        },
      ],
      xAxis: {
        categories: productLineList,
        crosshair: true,
        title: {
          text: null,
        },
      },
    };
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="h5" component="div" sx={{ fontWeight: 500 }}>
        {t("statistics by product line")}
      </Typography>
      <ToggleButtonGroup
        sx={{ mx: "auto" }}
        size="small"
        color="primary"
        exclusive
        value={viewChartStatus}
        onChange={onChangeViewChartStatus}
      >
        <ToggleButton value="all">{t("all")}</ToggleButton>
        <ToggleButton value="last-month">{t("last month")}</ToggleButton>
      </ToggleButtonGroup>
      <HighchartsReact highcharts={Highcharts} options={generateOptions()} />
    </Box>
  );
};

export default HomeFactoryChart;
