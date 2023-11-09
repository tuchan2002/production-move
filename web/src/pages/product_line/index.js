import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, Button, IconButton, Typography } from "@mui/material";
import ProductLineCard from "../../components/Shared/ProductLineCard";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import {
  createProductLine,
  getAllOwnProductLine,
  getAllProductLine,
} from "../../redux/actions/productLineAction";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import { getAllOwnWarehouse } from "../../redux/actions/warehouseAction";
import {
  destroyImage,
  resetImage,
  uploadImage,
} from "../../redux/actions/uploadAction";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const initialState = {
  model: "",
  ram: "",
  memory: "",
  color: "",
  description: "",
  price: "",
  imageUrl: "",
};
const ProductLine = () => {
  const { auth, productLine, warehouse, upload } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();

  const [productLineData, setProductLineData] = useState(initialState);
  const { model, ram, memory, color, description, price } = productLineData;
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (auth.user.role === 3) {
      dispatch(getAllOwnProductLine({ auth }));
    } else {
      dispatch(getAllProductLine({ auth }));
    }
    dispatch(getAllOwnWarehouse({ auth }));
  }, [dispatch]);

  const isNotBlankFields = () => {
    return model.trim() && ram && memory && color.trim() && price
      ? true
      : false;
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setProductLineData({ ...initialState });
    dispatch(resetImage());
    setOpenDialog(false);
  };

  const onChangeDataInput = (e) => {
    setProductLineData({
      ...productLineData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUploadImage = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);
    dispatch(uploadImage({ data: formData, auth }));
  };

  const handleDestroyImage = () => {
    const imageUrl = upload.images?.secure_url;
    dispatch(destroyImage({ data: { imageUrl }, auth }));
  };

  const handleSubmit = () => {
    dispatch(
      createProductLine({
        data: { ...productLineData, imageUrl: upload.images?.secure_url },
        auth,
      })
    );
    handleCloseDialog();
  };

  return (
    <>
      <Box p={3}>
        {auth.user.role === 1 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ marginBottom: 3 }}
            onClick={handleClickOpenDialog}
          >
            Add product line
          </Button>
        )}

        <Grid container spacing={3}>
          {productLine.productLines.map((productLineElement, index) => (
            <Grid xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
              <ProductLineCard
                productLine={productLineElement}
                warehouses={warehouse.warehouses}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Add product line</DialogTitle>
        <DialogContent>
          <TextField
            required
            margin="dense"
            id="model"
            label="Model"
            fullWidth
            variant="standard"
            name="model"
            value={model}
            onChange={onChangeDataInput}
          />
          <TextField
            required
            margin="dense"
            id="ram"
            label="RAM"
            fullWidth
            variant="standard"
            type="number"
            name="ram"
            value={ram}
            onChange={onChangeDataInput}
          />
          <TextField
            required
            margin="dense"
            id="memory"
            label="Memory"
            fullWidth
            type="number"
            variant="standard"
            name="memory"
            value={memory}
            onChange={onChangeDataInput}
          />
          <TextField
            required
            margin="dense"
            id="color"
            label="Color"
            fullWidth
            variant="standard"
            name="color"
            value={color}
            onChange={onChangeDataInput}
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            fullWidth
            variant="standard"
            name="description"
            value={description}
            onChange={onChangeDataInput}
          />
          <TextField
            required
            margin="dense"
            id="price"
            label="Price"
            fullWidth
            variant="standard"
            name="price"
            type="number"
            value={price}
            onChange={onChangeDataInput}
            sx={{ marginBottom: 3 }}
          />
          {!upload.images?.secure_url && (
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Thumbnail
              <input
                type="file"
                name="file"
                hidden
                onChange={handleUploadImage}
              />
            </Button>
          )}
          <div
            style={{
              position: "relative",
              width: "fit-content",
              display: `${upload.images?.secure_url ? "block" : "none"}`,
            }}
          >
            <img
              style={{
                objectFit: "cover",
                width: "200px",
                height: "200px",
              }}
              src={upload.images?.secure_url}
              alt="thumbnail"
            />
            <IconButton
              onClick={handleDestroyImage}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                transform: "translate(35%, -35%)",
                cursor: "pointer",
              }}
            >
              <CancelIcon color="error" />
            </IconButton>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button disabled={!isNotBlankFields()} onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductLine;
