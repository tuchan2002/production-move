import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Chip,
  DialogContentText,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  acceptPackage,
  acceptProduct,
  getAllTransportReceive,
  getAllTransportSend,
} from "../../redux/actions/transportAction";
import moment from "moment";

const Shipping = () => {
  const { auth, transport } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [showShippingState, setShowShippingState] = useState("receive");
  const [openDialog, setOpenDialog] = useState(false);
  const [transportId, setTransportId] = useState("");
  const [isPackageOrProduct, setIsPackageOrProduct] = useState("");

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: showShippingState === "receive" ? "oldUnit" : "newUnit",
      headerName: showShippingState === "receive" ? "Old Unit" : "New Unit",
      width: 150,
      valueGetter: ({ value }) => {
        return value?.name;
      },
    },
    {
      field: "is_shipping",
      headerName: "Status",
      width: 120,
      renderCell: ({ value }) => {
        if (showShippingState === "receive") {
          return value ? (
            <Chip label="Arrival" color="primary" />
          ) : (
            <Chip label="Done" color="success" />
          );
        } else {
          return value ? (
            <Chip label="Shipping" color="primary" />
          ) : (
            <Chip label="Done" color="success" />
          );
        }
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      renderCell: ({ row }) => {
        let id,
          model,
          quantity_in_stock = "";
        if (row.product_transport && !row.package_transport) {
          id = row.product_transport.prod_id;
          model = row.product_transport.productLine_product.model;
        } else if (!row.product_transport && row.package_transport) {
          id = row.package_transport.package_id;
          model = row.package_transport.productLine_package.model;
          quantity_in_stock = row.package_transport.quantity_in_stock;
        }

        return (
          <Box>
            <Typography>{id}</Typography>
            <Typography>{`Model: ${model}`}</Typography>
            {quantity_in_stock && (
              <Typography>{`Quantity in Stock: ${quantity_in_stock}`}</Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "accept_action",
      headerName: showShippingState === "receive" ? "Accept" : "",
      width: showShippingState === "receive" ? 125 : 0,
      renderCell: (params) => params.value,
    },
    {
      field: "time",
      headerName: "Time",
      width: 140,
    },
  ];

  const rows = transport?.transports?.map((tran) => ({
    ...tran,
    id: tran?.product_transport ? `P-${tran.id}` : `PK-${tran.id}`,
    accept_action:
      showShippingState === "receive" &&
      (tran?.is_shipping ? (
        <Button
          color="primary"
          onClick={() =>
            handleClickOpenDialog(
              tran?.id,
              tran?.package_transport?.package_id,
              tran?.product_transport?.prod_id
            )
          }
        >
          Accept
        </Button>
      ) : (
        ""
      )),
    time: moment(tran?.createdAt).fromNow(),
  }));

  useEffect(() => {
    if (showShippingState === "receive") {
      dispatch(getAllTransportReceive({ auth }));
    } else {
      dispatch(getAllTransportSend({ auth }));
    }
  }, [dispatch, showShippingState]);

  const onChangeShippingState = (e) => {
    setShowShippingState(e.target.value);
  };

  const handleClickOpenDialog = (tranId, packageId, prodId) => {
    if (packageId && !prodId) {
      setIsPackageOrProduct("package");
    } else if (!packageId && prodId) {
      setIsPackageOrProduct("product");
    }
    setTransportId(tranId);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleAccept = () => {
    if (isPackageOrProduct === "package") {
      dispatch(acceptPackage({ data: { transportId }, auth }));
    } else if (isPackageOrProduct === "product") {
      dispatch(acceptProduct({ data: { transportId }, auth }));
    }
    handleCloseDialog();
  };

  return (
    <>
      <Box
        p={3}
        sx={{
          height: "calc(100vh - 144px)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ToggleButtonGroup
          size="small"
          sx={{ marginBottom: 3, alignSelf: "end" }}
          color="primary"
          exclusive
          value={showShippingState}
          onChange={onChangeShippingState}
        >
          <ToggleButton value="receive">Arrival</ToggleButton>
          <ToggleButton value="send">Shipping</ToggleButton>
        </ToggleButtonGroup>

        <DataGrid
          sx={{
            "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
              py: "8px",
            },
          }}
          rows={rows}
          columns={columns}
          pageSize={12}
          rowsPerPageOptions={[12]}
          getRowHeight={() => "auto"}
        />
      </Box>
      {/* dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Are you sure you want to accept ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This operation cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button autoFocus onClick={handleAccept}>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Shipping;
