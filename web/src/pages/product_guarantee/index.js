import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  DialogContentText,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fixProduct,
  getAllOwnProductSold,
  moveProduct,
} from "../../redux/actions/productAction";
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
import BuildIcon from "@mui/icons-material/Build";
import VerifiedIcon from "@mui/icons-material/Verified";

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
    field: "error_status",
    headerName: "Status",
    width: 130,
    renderCell: ({ value }) => {
      const { errorStatus, errorDescription } = value;
      if (errorStatus === "error") {
        return (
          <Tooltip
            title={`Error Description: ${errorDescription}`}
            sx={{ cursor: "pointer" }}
          >
            <Chip label="error" color="error" />
          </Tooltip>
        );
      } else if (errorStatus === "success") {
        return <Chip label="success" color="success" />;
      } else if (errorStatus === "Unrepairable") {
        return (
          <Tooltip
            title={`Error Description: ${errorDescription}`}
            sx={{ cursor: "pointer" }}
          >
            <Chip label="Unrepairable" color="neutral" />
          </Tooltip>
        );
      }
    },
  },
  {
    field: "edit_status",
    headerName: "Edit Status",
    width: 140,
    renderCell: (params) => params.value,
  },
  {
    field: "move_to_agent",
    headerName: "Back to Agent",
    width: 160,
    renderCell: (params) => params.value,
  },
  {
    field: "move_to_factory",
    headerName: "Back to Factory",
    width: 150,
    renderCell: (params) => params.value,
  },
];

// stt-06: sua thanh cong, gui ve agent
// stt-08: khong sua duoc gui ve factory
const initialShippingState = {
  prodId: "",
  unitId: "",
  warehouseId: "",
  statusCode: "",
};
const initialFixedState = {
  prodId: "",
  isFixed: true,
};
const initialFieldValidator = {
  warehouse: "",
};
const ProductGuarantee = () => {
  const { auth, product, warehouse } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [shippingData, setShippingData] = useState(initialShippingState);
  const [unitName, setUnitName] = useState("");
  const [openFixedDialog, setOpenFixedDialog] = useState(false);
  const [fixedData, setFixedData] = useState(initialFixedState);
  const [errorDesc, setErrorDesc] = useState("");
  const { isFixed } = fixedData;
  const [openDialog, setOpenDialog] = useState(false);
  const [fieldValidator, setFieldValidator] = useState(initialFieldValidator);

  useEffect(() => {
    dispatch(getAllOwnProductSold({ auth }));
  }, [dispatch]);

  const validateField = () => {
    if (shippingData.warehouseId === "") {
      setFieldValidator({
        ...fieldValidator,
        warehouse:
          shippingData.warehouseId === "" ? "Please select a warehouse" : "",
      });
      return true;
    }
    return false;
  };

  const handleClickOpenDialog = (prod, statusCode) => {
    const unitSelected =
      statusCode === "STT-08"
        ? prod?.package_product?.userCreated_package
        : prod?.soldStatus_product?.store_soldStatus;

    setShippingData({
      ...shippingData,
      unitId: unitSelected?.id,
      prodId: prod?.prod_id,
      statusCode,
    });

    dispatch(
      getAllWarehouseByUnit({
        data: { unitId: unitSelected?.id },
        auth,
      })
    );
    setUnitName(unitSelected?.name);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setFieldValidator(initialFieldValidator);
    setShippingData(initialShippingState);
    setOpenDialog(false);
  };

  const handleClickOpenFixedDialog = (prod) => {
    setFixedData({ ...fixedData, prodId: prod?.prod_id });
    setErrorDesc(prod.soldStatus_product?.errors[0]?.description);
    setOpenFixedDialog(true);
  };

  const handleCloseFixedDialog = () => {
    setFixedData(initialFixedState);
    setOpenFixedDialog(false);
  };

  const onChangeShippingDataInput = (e) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeFixedDataInput = (e) => {
    setFixedData({
      ...fixedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFixProduct = () => {
    dispatch(fixProduct({ data: { prodId: fixedData.prodId, isFixed }, auth }));
    handleCloseFixedDialog();
  };

  const handleMove = () => {
    if (!validateField()) {
      dispatch(moveProduct({ data: shippingData, auth }));
      handleCloseDialog();
    }
  };

  const generateErrorStatus = (prod) => {
    let isDone = prod.soldStatus_product?.errors[0]?.error_soldStt?.isDone;
    let isFixed = prod.soldStatus_product?.errors[0]?.error_soldStt?.isFixed;
    let errorDescription = prod.soldStatus_product?.errors[0]?.description;
    if (!isDone) {
      return { errorStatus: "error", errorDescription };
    } else {
      return isFixed
        ? { errorStatus: "success", errorDescription }
        : { errorStatus: "Unrepairable", errorDescription };
    }
  };

  const rows = product.products.map((prod) => {
    let currentErrorIsDone =
      prod.soldStatus_product?.errors[0]?.error_soldStt?.isDone;
    let currentErrorIsFixed =
      prod.soldStatus_product?.errors[0]?.error_soldStt?.isFixed;
    return {
      ...prod,
      error_status: generateErrorStatus(prod),
      edit_status: (
        <Button
          color="primary"
          onClick={() => handleClickOpenFixedDialog(prod)}
          disabled={currentErrorIsDone ? true : false}
        >
          Edit Status
        </Button>
      ),
      move_to_agent: (
        <Button
          color="primary"
          endIcon={<SendIcon />}
          onClick={() => handleClickOpenDialog(prod, "STT-06")}
          disabled={currentErrorIsDone && currentErrorIsFixed ? false : true}
        >
          Move
        </Button>
      ),
      move_to_factory: (
        <Button
          color="primary"
          endIcon={<SendIcon />}
          onClick={() => handleClickOpenDialog(prod, "STT-08")}
          disabled={currentErrorIsDone && !currentErrorIsFixed ? false : true}
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
          pageSize={10}
          rowsPerPageOptions={[10]}
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
        <DialogTitle>{`${
          shippingData.statusCode === "STT-06"
            ? "Back to Agent"
            : "Back to Factory"
        }`}</DialogTitle>
        <DialogContent>
          <DialogContentText>{unitName}</DialogContentText>
          <TextField
            margin="dense"
            id="warehouseId"
            select
            label="Warehouse"
            fullWidth
            variant="standard"
            name="warehouseId"
            value={shippingData.warehouseId}
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
          <Button onClick={handleMove}>Move</Button>
        </DialogActions>
      </Dialog>

      {/* fixed dialog */}
      <Dialog open={openFixedDialog} onClose={handleCloseFixedDialog} fullWidth>
        <DialogTitle>Edit Error Status</DialogTitle>
        <DialogContent>
          <DialogContentText>{`Error Description: ${errorDesc}`}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="isFixed"
            select
            label="Status"
            fullWidth
            variant="standard"
            name="isFixed"
            value={isFixed}
            onChange={onChangeFixedDataInput}
          >
            <MenuItem value={true}>Success</MenuItem>
            <MenuItem value={false}>Unrepairable</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFixedDialog}>Cancel</Button>
          <Button onClick={handleFixProduct}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductGuarantee;
