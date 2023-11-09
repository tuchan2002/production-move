import { Grid } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import UnitTable from "./UnitTable";

const UnitManagement = ({ unitsByRole }) => {
  const { t } = useTranslation(["common"]);

  const { factories, agents, serviceCenters } = unitsByRole;
  return (
    <Grid container spacing={3} marginBottom={3}>
      <Grid item md={4} xs={12}>
        <UnitTable title={t("factory")} dataRows={factories} />
      </Grid>
      <Grid item md={4} xs={12}>
        <UnitTable title={t("agent")} dataRows={agents} />
      </Grid>
      <Grid item md={4} xs={12}>
        <UnitTable title={t("center")} dataRows={serviceCenters} />
      </Grid>
    </Grid>
  );
};

export default UnitManagement;
