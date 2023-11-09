import { IconButton, Link } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = ({ to }) => {
  return (
    <Link
      component={RouterLink}
      to={to}
      sx={{
        textDecoration: "none",
      }}
    >
      <IconButton color="primary">
        <ArrowBackIcon fontSize="large" />
      </IconButton>
    </Link>
  );
};

export default BackButton;
