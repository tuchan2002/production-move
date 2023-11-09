import { Box, Container, Link, Typography } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: 3,
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1">BigCorp website</Typography>
        <Typography variant="body2" color="text.secondary">
          {"Copyright © "}
          <Link
            color="inherit"
            href="https://github.com/tuchan2002"
            sx={{ fontWeight: 600, textDecoration: "none" }}
          >
            tuchan2002
          </Link>{" "}
          {" and "}
          <Link
            color="inherit"
            href="https://github.com/ThinhNguyen1102"
            sx={{ fontWeight: 600, textDecoration: "none" }}
          >
            ThinhNguyen1102
          </Link>
          {"."}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
