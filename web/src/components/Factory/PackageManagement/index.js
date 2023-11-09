import {
  Box,
  Button,
  DialogContentText,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPackageByCurrentFactory,
  getAllPackageByUnit,
  movePackage,
  recallPackage,
} from "../../../redux/actions/packageAction";
import SendIcon from "@mui/icons-material/Send";
import { getAllWarehouseByUnit } from "../../../redux/actions/warehouseAction";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import { typeErrorCodeList } from "../../../utils/constants";
import ReportIcon from "@mui/icons-material/Report";

const columns = [
  { field: "package_id", headerName: "Package_ID", width: 110 },
  {
    field: "quantity_in_stock",
    headerName: "Quantity in Stock",
    width: 150,
  },
  {
    field: "productLine_package",
    headerName: "Product Line",
    width: 230,
    valueGetter: ({ value }) => {
      const productLine = { ...value };
      return `${productLine.model} - RAM: ${productLine.ram} - Memory: ${productLine.memory} - Color: ${productLine.color}`;
    },
  },
  {
    field: "unit_manage",
    headerName: "Unit Manage",
    width: 150,
  },
  {
    field: "recall",
    headerName: "Recall",
    width: 150,
    renderCell: (params) => params.value,
  },
];
const initialReportState = {
  packageId: "",
  errorDescription: "",
  typeErrorCode: "",
};
const FactoryPackageManagement = () => {
  const { auth, packageReducer } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [errorReportData, setErrorReportData] = useState(initialReportState);
  const [openDialog, setOpenDialog] = useState(false);
  const { errorDescription, typeErrorCode } = errorReportData;

  useEffect(() => {
    dispatch(getAllPackageByCurrentFactory({ auth }));
  }, [dispatch]);

  const isNotBlankFields = () => {
    return errorDescription.trim() && typeErrorCode ? true : false;
  };

  const choosePackage = (packageId) => {
    setErrorReportData({
      ...errorReportData,
      packageId,
    });
  };

  const handleClickOpenDialog = (pk) => {
    choosePackage(pk.package_id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setErrorReportData(initialReportState);
    setOpenDialog(false);
  };

  const onChangeErrorReportDataInput = (e) => {
    setErrorReportData({
      ...errorReportData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRecall = () => {
    dispatch(recallPackage({ data: errorReportData, auth }));
    handleCloseDialog();
  };

  const rows = packageReducer.packages.map((pk) => ({
    ...pk,
    unit_manage: pk.user_package.name,
    recall: !pk.error_id ? (
      <Button
        color="primary"
        startIcon={<ReportIcon />}
        onClick={() => handleClickOpenDialog(pk)}
      >
        Recall
      </Button>
    ) : (
      <Tooltip title={`Error Description ${pk.error_package.description}`}>
        <ReportIcon color="error" />
      </Tooltip>
    ),
  }));

  return (
    <>
      <Box p={3} sx={{ height: "calc(100vh - 72px)", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.package_id}
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
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{`Recall: ${errorReportData.packageId}`}</DialogTitle>
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
            onClick={handleRecall}
            disabled={!isNotBlankFields()}
          >
            Recall
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FactoryPackageManagement;
