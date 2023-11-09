import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getAllPackageByProductLineUnit,
  movePackage,
} from "../../redux/actions/packageAction";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { getUserByRole } from "../../redux/actions/userAction";
import { getAllWarehouseByUnit } from "../../redux/actions/warehouseAction";
import SendIcon from "@mui/icons-material/Send";
import BackButton from "../../components/Shared/BackButton";
import { getProductLineById } from "../../redux/actions/productLineAction";

const columns = [
  { field: "package_id", headerName: "Package_ID", width: 110 },
  {
    field: "quantity_in_stock",
    headerName: "Quantity in Stock",
    width: 140,
  },
  {
    field: "move_to_agent",
    headerName: "Export to Agent",
    width: 180,
    renderCell: (params) => {
      return (
        <Button
          color="primary"
          endIcon={<SendIcon />}
          onClick={params.value.onClick}
        >
          Move
        </Button>
      );
    },
  },
];

const initialState = {
  unitId: "",
  packageId: "",
  warehouseId: "",
  statusCode: "STT-02",
};
const initialFieldValidator = {
  unit: "",
  warehouse: "",
};
const ProductLinePackages = () => {
  const { id } = useParams();
  const { auth, packageReducer, user, warehouse, productLine } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();

  const [shippingData, setShippingData] = useState(initialState);
  const { unitId, packageId, warehouseId } = shippingData;
  const [openDialog, setOpenDialog] = useState(false);
  const [fieldValidator, setFieldValidator] = useState(initialFieldValidator);

  useEffect(() => {
    dispatch(
      getAllPackageByProductLineUnit({ data: { productLineId: id }, auth })
    );
    dispatch(getUserByRole({ data: { role: 3 }, auth }));
    dispatch(getProductLineById({ data: { productLineId: id }, auth }));
  }, [dispatch]);

  const validateField = () => {
    if (unitId === "" || warehouseId === "") {
      setFieldValidator({
        ...fieldValidator,
        unit: unitId === "" ? "Please select a unit" : "",
        warehouse: warehouseId === "" ? "Please select a warehouse" : "",
      });
      return true;
    }
    return false;
  };

  const onChangeDataInput = (e) => {
    if (e.target.name === "unitId") {
      dispatch(
        getAllWarehouseByUnit({ data: { unitId: e.target.value }, auth })
      );
    }
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickOpenDialog = (packageId) => {
    choosePackage(packageId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setFieldValidator(initialFieldValidator);
    setShippingData(initialState);
    setOpenDialog(false);
  };

  const choosePackage = (packageId) => {
    setShippingData({
      ...shippingData,
      packageId,
    });
  };

  const handleMoveToAgent = () => {
    if (!validateField()) {
      dispatch(movePackage({ data: shippingData, auth }));
      handleCloseDialog();
    }
  };

  const rows = packageReducer.packages.map((pk) => ({
    ...pk,
    move_to_agent: {
      onClick: () => handleClickOpenDialog(pk.package_id),
    },
  }));

  return (
    <>
      <Box p={3} sx={{ height: "calc(100vh - 175px)", width: "100%" }}>
        <BackButton to="/product_line" />
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: 500, textAlign: "center" }}
          gutterBottom
        >
          {`${productLine.productLine.model} - RAM: ${productLine.productLine.ram}GB - Memory: ${productLine.productLine.memory}GB - Color: ${productLine.productLine.color}`}
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.package_id}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </Box>
      {/* dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Export to Agent</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="unitId"
            select
            label="Agent"
            fullWidth
            variant="standard"
            name="unitId"
            value={unitId}
            onChange={onChangeDataInput}
            error={fieldValidator.unit ? true : false}
            helperText={fieldValidator.unit}
          >
            {user.users.map((agent) => (
              <MenuItem key={agent.id} value={agent.id}>
                {agent.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            disabled={unitId ? false : true}
            margin="dense"
            id="warehouseId"
            select
            label="Warehouse"
            fullWidth
            variant="standard"
            name="warehouseId"
            value={warehouseId}
            onChange={onChangeDataInput}
            error={fieldValidator.warehouse ? true : false}
            helperText={fieldValidator.warehouse}
          >
            {warehouse.warehouses.map((wh) => (
              <MenuItem key={wh.id} value={wh.id}>
                {wh.address}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button autoFocus onClick={handleMoveToAgent}>
            Move
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductLinePackages;
