import React, { useState } from "react";
import {
  Box,
  Dialog,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import FactoryIcon from "@mui/icons-material/Factory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { useTranslation } from "react-i18next";

const columns = [
  { field: "idx", headerName: "No", width: 50 },
  {
    field: "name",
    headerName: "Name",
    width: 120,
  },
  {
    field: "show_detail",
    headerName: "Detail",
    width: 100,
    renderCell: (params) => params.value,
  },
];
const UnitTable = ({ title, dataRows }) => {
  const { t } = useTranslation(["common"]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("");

  const handleClickOpenDialog = (unit) => {
    setSelectedUnit(unit);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const rows =
    dataRows?.map((unit, index) => ({
      ...unit,
      idx: index + 1,
      show_detail: (
        <IconButton color="primary" onClick={() => handleClickOpenDialog(unit)}>
          <VisibilityIcon />
        </IconButton>
      ),
    })) || [];

  return (
    <>
      <Box sx={{ height: "400px", width: "100%" }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: 500 }}
          gutterBottom
        >
          {title}
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.idx}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemIcon>
              <FactoryIcon />
            </ListItemIcon>
            <ListItemText primary={selectedUnit.name} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText primary={selectedUnit.email} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText primary={selectedUnit.address} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText primary={selectedUnit.phone_number} />
          </ListItem>
        </List>
        <Divider />
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              {t("warehouses")}
            </ListSubheader>
          }
        >
          {selectedUnit?.user_warehouse?.map((wh) => (
            <ListItem key={wh.id}>
              <ListItemAvatar>
                <Avatar>
                  <WarehouseIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={wh.address} secondary={wh.phone_number} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  );
};

export default UnitTable;
