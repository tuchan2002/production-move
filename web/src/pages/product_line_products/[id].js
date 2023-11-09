import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, DialogContentText, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOwnProductByPl,
  sellProduct,
} from "../../redux/actions/productAction";
import SellIcon from "@mui/icons-material/Sell";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import BackButton from "../../components/Shared/BackButton";
import { getProductLineById } from "../../redux/actions/productLineAction";

const columns = [
  { field: "prod_id", headerName: "Product_ID", width: 110 },
  { field: "package_id", headerName: "Package_ID", width: 110 },
  {
    field: "sell_product",
    headerName: "Sell",
    width: 130,
    renderCell: (params) => {
      return (
        <Button
          color="primary"
          startIcon={<SellIcon />}
          onClick={params.value.onClick}
        >
          Sell
        </Button>
      );
    },
  },
];

const initialState = {
  prodId: "",
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  customerEmail: "",
};
const initialFieldValidator = {
  name: "",
  phoneNumber: "",
  address: "",
  email: "",
};
const ProductLineProducts = () => {
  const { auth, product, productLine } = useSelector((state) => state);
  const { id } = useParams();
  const dispatch = useDispatch();

  const [openDialog, setOpenDialog] = useState(false);
  const [salesData, setSalesData] = useState(initialState);
  const {
    prodId,
    customerName,
    customerPhone,
    customerAddress,
    customerEmail,
  } = salesData;
  const [fieldValidator, setFieldValidator] = useState(initialFieldValidator);

  useEffect(() => {
    dispatch(getAllOwnProductByPl({ data: { productLineId: id }, auth }));
    dispatch(getProductLineById({ data: { productLineId: id }, auth }));
  }, [dispatch]);

  const validateField = () => {
    if (
      customerName.trim() === "" ||
      customerPhone.trim() === "" ||
      customerAddress.trim() === "" ||
      customerEmail.trim() === ""
    ) {
      setFieldValidator({
        ...fieldValidator,
        name: customerName === "" ? "Name cannot be blank" : "",
        phoneNumber: customerPhone === "" ? "Phone Number cannot be blank" : "",
        address: customerAddress === "" ? "Address cannot be blank" : "",
        email: customerEmail === "" ? "Email cannot be blank" : "",
      });
      return true;
    }
    return false;
  };

  const handleClickOpenDialog = (prodId) => {
    chooseProduct(prodId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setFieldValidator(initialFieldValidator);
    setSalesData(initialState);
    setOpenDialog(false);
  };

  const chooseProduct = (prodId) => {
    setSalesData({
      ...salesData,
      prodId,
    });
  };

  const handleSellProduct = () => {
    if (!validateField()) {
      dispatch(sellProduct({ data: salesData, auth }));
      handleCloseDialog();
    }
  };

  const onChangeDataInput = (e) => {
    setSalesData({
      ...salesData,
      [e.target.name]: e.target.value,
    });
  };

  const rows = product.products.map((prod) => ({
    ...prod,
    sell_product: { onClick: () => handleClickOpenDialog(prod.prod_id) },
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
          getRowId={(row) => row.prod_id}
          pageSize={12}
          rowsPerPageOptions={[12]}
        />
      </Box>
      {/* dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Sell Product</DialogTitle>
        <DialogContent>
          <DialogContentText>Customer Information:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="customerName"
            label="Name"
            fullWidth
            variant="standard"
            name="customerName"
            value={customerName}
            onChange={onChangeDataInput}
            error={fieldValidator.name ? true : false}
            helperText={fieldValidator.name}
          />
          <TextField
            autoFocus
            margin="dense"
            id="customerPhone"
            label="Phone Number"
            fullWidth
            variant="standard"
            name="customerPhone"
            value={customerPhone}
            onChange={onChangeDataInput}
            error={fieldValidator.phoneNumber ? true : false}
            helperText={fieldValidator.phoneNumber}
          />
          <TextField
            autoFocus
            margin="dense"
            id="customerEmail"
            label="Email"
            fullWidth
            variant="standard"
            type="email"
            name="customerEmail"
            value={customerEmail}
            onChange={onChangeDataInput}
            error={fieldValidator.email ? true : false}
            helperText={fieldValidator.email}
          />
          <TextField
            autoFocus
            margin="dense"
            id="customerAddress"
            label="Address"
            fullWidth
            variant="standard"
            name="customerAddress"
            value={customerAddress}
            onChange={onChangeDataInput}
            error={fieldValidator.address ? true : false}
            helperText={fieldValidator.address}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSellProduct}>Sell</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductLineProducts;
