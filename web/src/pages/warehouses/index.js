import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  createWarehouses,
  getAllOwnWarehouse,
} from "../../redux/actions/warehouseAction";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "address",
    headerName: "Address",
    width: 320,
  },
  {
    field: "phone_number",
    headerName: "Phone Number",
    width: 130,
  },
  {
    field: "edit_warehouse",
    headerName: "Edit",
    width: 100,
    renderCell: (params) => {
      return (
        <IconButton color="primary">
          <EditIcon />
        </IconButton>
      );
    },
  },
  {
    field: "delete_warehouse",
    headerName: "Delete",
    width: 100,
    renderCell: (params) => {
      return (
        <IconButton color="error">
          <DeleteIcon />
        </IconButton>
      );
    },
  },
];
const initialState = {
  address: "",
  phone_number: "",
};
const Warehouse = () => {
  const { auth, warehouse } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [openDialog, setOpenDialog] = useState(false);
  const [warehouseData, setWarehouseData] = useState(initialState);
  const { address, phone_number } = warehouseData;
  const onChangeDataInput = (e) => {
    setWarehouseData({
      ...warehouseData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    dispatch(getAllOwnWarehouse({ auth }));
  }, [dispatch]);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setWarehouseData(initialState);
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    dispatch(createWarehouses({ data: warehouseData, auth }));
    handleCloseDialog();
  };

  const rows = warehouse.warehouses;

  return (
    <>
      <Box p={3} sx={{ height: "calc(100vh - 144px)", width: "100%" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ marginBottom: 3 }}
          onClick={handleClickOpenDialog}
        >
          Add Warehouse
        </Button>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </Box>
      {/* dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Add Warehouse</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Address"
            fullWidth
            variant="standard"
            name="address"
            value={address}
            onChange={onChangeDataInput}
          />
          <TextField
            autoFocus
            margin="dense"
            id="phone_number"
            label="Phone Number"
            fullWidth
            variant="standard"
            name="phone_number"
            value={phone_number}
            onChange={onChangeDataInput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button disabled={address ? false : true} onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Warehouse;
