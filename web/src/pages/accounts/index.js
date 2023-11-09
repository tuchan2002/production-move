import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { Button, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createUser, getAllUser } from "../../redux/actions/userAction";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { roles } from "../../utils/constants";

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "email",
    headerName: "Email",
    width: 250,
  },
  {
    field: "phone_number",
    headerName: "Phone Number",
    width: 130,
  },
  {
    field: "role",
    headerName: "Role",
    width: 80,
  },
  {
    field: "address",
    headerName: "Address",
    width: 280,
  },
  {
    field: "edit_account",
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
    field: "delete_account",
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
  name: "",
  email: "",
  address: "",
  phone_number: "",
  role: 1,
  password: "",
  confirmPassword: "",
};
const Accounts = () => {
  const { auth, user } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [openDialog, setOpenDialog] = useState(false);
  const [matchPassword, setMatchPassword] = useState("");
  const [userData, setUserData] = useState(initialState);
  const {
    name,
    email,
    address,
    phone_number,
    role,
    password,
    confirmPassword,
  } = userData;

  useEffect(() => {
    dispatch(getAllUser({ auth }));
  }, [dispatch]);

  const isNotBlankFields = () => {
    return name.trim() &&
      email.trim() &&
      address.trim() &&
      email.trim() &&
      phone_number.trim() &&
      password.trim()
      ? true
      : false;
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setMatchPassword("");
    setUserData(initialState);
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    if (confirmPassword.trim() !== password.trim()) {
      setMatchPassword("Please make sure passwords match");
    } else {
      dispatch(createUser({ data: userData, auth }));
      handleCloseDialog();
    }
  };

  const onChangeDataInput = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const rows = user.users;
  return (
    <>
      <Box p={3} sx={{ height: "calc(100vh - 144px)", width: "100%" }}>
        <Button
          variant="contained"
          startIcon={<PersonAddAlt1Icon />}
          sx={{ marginBottom: 3 }}
          onClick={handleClickOpenDialog}
        >
          Add account
        </Button>

        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={11}
          rowsPerPageOptions={[11]}
        />
      </Box>

      {/* dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Add account</DialogTitle>
        <DialogContent>
          <TextField
            required
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            variant="standard"
            name="name"
            value={name}
            onChange={onChangeDataInput}
          />
          <TextField
            required
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            name="email"
            value={email}
            onChange={onChangeDataInput}
          />
          <TextField
            required
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
            required
            margin="dense"
            id="phone_number"
            label="Phone Number"
            fullWidth
            variant="standard"
            name="phone_number"
            value={phone_number}
            onChange={onChangeDataInput}
          />
          <TextField
            margin="dense"
            id="role"
            select
            label="Role"
            fullWidth
            variant="standard"
            name="role"
            value={role}
            onChange={onChangeDataInput}
          >
            {roles.map((option) => (
              <MenuItem key={option.roleValue} value={option.roleValue}>
                {option.text}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            name="password"
            value={password}
            onChange={onChangeDataInput}
          />
          <TextField
            required
            margin="dense"
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            fullWidth
            variant="standard"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChangeDataInput}
            error={matchPassword ? true : false}
            helperText={matchPassword}
          />
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

export default Accounts;
