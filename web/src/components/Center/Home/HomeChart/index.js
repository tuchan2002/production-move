import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography } from "@mui/material";

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

const HomeCenterChart = ({ t, statisticProduct }) => {
  const generateOptions = () => {
    const productLineList = statisticProduct?.map((item) => item.model);
    return {
      ...initOptions,
      series: [
        {
          type: "column",
          color: "#42a5f5",
          name: t("warranty tickets"),
          data: statisticProduct?.map((item) => item.numOfRepairs),
        },
        {
          type: "column",
          color: "#4caf50",
          name: t("successful warranty tickets"),
          data: statisticProduct?.map((item) => item.numOfSuccessRepairs),
        },
        {
          type: "column",
          color: "#64748B",
          name: t("failed warranty tickets"),
          data: statisticProduct?.map((item) => item.numOfFailureRepairs),
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
    <Box>
      <Typography
        variant="h5"
        component="div"
        sx={{ fontWeight: 500 }}
        gutterBottom
      >
        {t("statistics by product line")}
      </Typography>
      <HighchartsReact highcharts={Highcharts} options={generateOptions()} />
    </Box>
  );
};

export default HomeCenterChart;
