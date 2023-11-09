import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  DialogContentText,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOwnProductByPl,
  getAllOwnProductSold,
  moveProduct,
  reportErrorProduct,
} from "../../redux/actions/productAction";
import ReportIcon from "@mui/icons-material/Report";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { getUserByRole } from "../../redux/actions/userAction";
import { getAllWarehouseByUnit } from "../../redux/actions/warehouseAction";
import FeedbackIcon from "@mui/icons-material/Feedback";
import SendIcon from "@mui/icons-material/Send";
import { typeErrorCodeList } from "../../utils/constants";

const columns = [
  { field: "prod_id", headerName: "Product_ID", width: 110 },
  { field: "package_id", headerName: "Package_ID", width: 110 },
  {
    field: "productLine_product",
    headerName: "Product Line",
    width: 230,
    valueGetter: ({ value }) => {
      const productLine = { ...value };
      return `${productLine.model} - RAM: ${productLine.ram} - Memory: ${productLine.memory} - Color: ${productLine.color}`;
    },
  },
  {
    field: "error_report",
    headerName: "Error Report",
    width: 130,
    renderCell: (params) => params.value,
  },
  {
    field: "move_to_center",
    headerName: "Guarantee",
    width: 180,
    renderCell: (params) => params.value,
  },
];

const initialReportState = {
  prodId: "",
  errorDescription: "",
  typeErrorCode: "",
};
const initialShippingState = {
  prodId: "",
  unitId: "",
  warehouseId: "",
  statusCode: "STT-05",
};
const initialFieldValidator = {
  unit: "",
  warehouse: "",
};
const ProductsSold = () => {
  const { auth, product, user, warehouse } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOwnProductSold({ auth }));
    dispatch(getUserByRole({ data: { role: 4 }, auth })); // get service center
  }, [dispatch]);

  const [openDialog, setOpenDialog] = useState(false);
  const [isReport, setIsReport] = useState(true);
  const [errorReportData, setErrorReportData] = useState(initialReportState);
  const [shippingData, setShippingData] = useState(initialShippingState);
  const { unitId, warehouseId } = shippingData;
  const { errorDescription, typeErrorCode } = errorReportData;
  const [fieldValidator, setFieldValidator] = useState(initialFieldValidator);

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

  const isNotBlankFields = () => {
    return errorDescription.trim() && typeErrorCode ? true : false;
  };

  const handleClickOpenDialog = (prodId, isReport) => {
    chooseProduct(prodId);
    setIsReport(isReport);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setErrorReportData(initialReportState);
    setFieldValidator(initialFieldValidator);
    setShippingData(initialShippingState);
    setOpenDialog(false);
  };

  const chooseProduct = (prodId) => {
    setErrorReportData({
      ...errorReportData,
      prodId,
    });
    setShippingData({
      ...shippingData,
      prodId,
    });
  };

  const onChangeErrorReportDataInput = (e) => {
    setErrorReportData({
      ...errorReportData,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeShippingDataInput = (e) => {
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

  const handleErrorReport = () => {
    dispatch(reportErrorProduct({ data: errorReportData, auth }));
    handleCloseDialog();
  };

  const handleMoveToCenter = () => {
    if (!validateField()) {
      dispatch(moveProduct({ data: shippingData, auth }));
      handleCloseDialog();
    }
  };

  const rows = product.products?.map((prod, index) => {
    let currentErrorIsDone =
      prod?.soldStatus_product?.errors[0]?.error_soldStt?.isDone;
    let currentErrorIsFixed =
      prod?.soldStatus_product?.errors[0]?.error_soldStt?.isFixed;

    let isNotError =
      (currentErrorIsDone && currentErrorIsFixed) ||
      prod?.soldStatus_product?.errors.length === 0;
    let errDesc = "";
    if (prod?.soldStatus_product?.errors.length > 0) {
      errDesc = prod?.soldStatus_product?.errors[0]?.description;
    }

    return {
      ...prod,
      error_report: !isNotError ? (
        <Tooltip title={`Error Description: ${errDesc}`}>
          <FeedbackIcon color="error" />
        </Tooltip>
      ) : (
        <Button
          color="primary"
          startIcon={<ReportIcon />}
          onClick={() => handleClickOpenDialog(prod.prod_id, true)}
        >
          Report
        </Button>
      ),
      move_to_center: (
        <Button
          color="primary"
          endIcon={<SendIcon />}
          onClick={() => handleClickOpenDialog(prod.prod_id, false)}
          disabled={!isNotError ? false : true}
        >
          Move
        </Button>
      ),
    };
  });

  return (
    <>
      <Box p={3} sx={{ height: "calc(100vh - 72px)", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.prod_id}
          pageSize={12}
          rowsPerPageOptions={[12]}
          sx={{
            "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
              py: "8px",
            },
          }}
          getRowHeight={() => "auto"}
        />
      </Box>
      {/* dialog */}
      {isReport ? (
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
          <DialogTitle>Error Report</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="typeErrorCode"
              select
              label="Type Error Code"
              fullWidth
              variant="standard"
              name="typeErrorCode"
              value={typeErrorCode}
              onChange={onChangeErrorReportDataInput}
            >
              {typeErrorCodeList.map((typeErrCode) => (
                <MenuItem key={typeErrCode} value={typeErrCode}>
                  {typeErrCode}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              autoFocus
              margin="dense"
              id="errorDescription"
              label="Error Description"
              fullWidth
              variant="standard"
              name="errorDescription"
              value={errorDescription}
              onChange={onChangeErrorReportDataInput}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              color="error"
              onClick={handleErrorReport}
              disabled={!isNotBlankFields()}
            >
              Report
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
          <DialogTitle>Transport to Service Center</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              id="unitId"
              select
              label="Service Center"
              fullWidth
              variant="standard"
              name="unitId"
              value={unitId}
              onChange={onChangeShippingDataInput}
              error={fieldValidator.unit ? true : false}
              helperText={fieldValidator.unit}
            >
              {user.users.map((center) => (
                <MenuItem key={center.id} value={center.id}>
                  {center.name}
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
              onChange={onChangeShippingDataInput}
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
            <Button onClick={handleMoveToCenter}>Move</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ProductsSold;
