import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { getAllOwnProductSold } from "../../redux/actions/productAction";
import { Button, Chip, Tooltip, Typography } from "@mui/material";
import BackButton from "../../components/Shared/BackButton";

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
      return (
        <Tooltip
          title={`Error Description: ${value}`}
          sx={{ cursor: "pointer" }}
        >
          <Chip label="Unrepairable" color="neutral" />
        </Tooltip>
      );
    },
  },
];

const ErrorProducts = () => {
  const { auth, product } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOwnProductSold({ auth }));
  }, [dispatch]);

  const rows = product.products.map((prod) => {
    let errorDescription = prod.soldStatus_product?.errors[0]?.description;
    return { ...prod, error_status: errorDescription };
  });
  return (
    <>
      <Box p={3} sx={{ height: "calc(100vh - 150px)", width: "100%" }}>
        <BackButton to="/" />
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: 500, textAlign: "center" }}
          gutterBottom
        >
          Unrepairable defective products
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.prod_id}
          pageSize={11}
          rowsPerPageOptions={[11]}
          sx={{
            "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
              py: "8px",
            },
          }}
          getRowHeight={() => "auto"}
        />
      </Box>
    </>
  );
};

export default ErrorProducts;
