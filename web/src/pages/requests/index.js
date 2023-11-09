import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Chip,
  DialogContentText,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import {
  acceptRequest,
  createRequest,
  getAllRequestReceive,
  getAllRequestSend,
} from "../../redux/actions/requestAction";
import { getUserByRole } from "../../redux/actions/userAction";
import { roles } from "../../utils/constants";
import moment from "moment";

const initialRequestState = {
  receiverId: "",
  content: "",
};
const initialAcceptRequestState = {
  requestId: "",
  isAccept: "true",
};
const Requests = () => {
  const { auth, request, user } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [showRequestState, setShowRequestState] = useState("send");
  const [openDialog, setOpenDialog] = useState(false);
  const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
  const [role, setRole] = useState("");
  const [requestData, setRequestData] = useState(initialRequestState);
  const { receiverId, content } = requestData;
  const [acceptRequestData, setAcceptRequestData] = useState(
    initialAcceptRequestState
  );
  const { requestId, isAccept } = acceptRequestData;

  useEffect(() => {
    if (showRequestState === "receive") {
      dispatch(getAllRequestReceive({ auth }));
    } else {
      dispatch(getAllRequestSend({ auth }));
    }
  }, [dispatch, showRequestState]);

  const isNotBlankFields = () => {
    return receiverId && role ? true : false;
  };

  const onChangeRequestState = (e) => {
    setShowRequestState(e.target.value);
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRequestData(initialRequestState);
  };

  const handleClickOpenAcceptDialog = (requestId) => {
    setAcceptRequestData({ ...acceptRequestData, requestId });
    setOpenAcceptDialog(true);
  };

  const handleCloseAcceptDialog = () => {
    setOpenAcceptDialog(false);
    setAcceptRequestData(initialAcceptRequestState);
  };

  const onChangeRoleInput = (e) => {
    dispatch(getUserByRole({ data: { role: e.target.value }, auth }));
    setRole(e.target.value);
  };

  const onChangeRequestDataInput = (e) => {
    setRequestData({
      ...requestData,
      [e.target.name]: e.target.value,
    });
  };
  const onChangeAcceptRequestDataInput = (e) => {
    setAcceptRequestData({
      ...acceptRequestData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitRequest = () => {
    dispatch(createRequest({ data: requestData, auth }));
    handleCloseDialog();
  };

  const handleAcceptRequest = () => {
    dispatch(acceptRequest({ data: acceptRequestData, auth }));
    handleCloseAcceptDialog();
  };

  const generateRequestStatus = (isDone, isAccept) => {
    if (!isDone) {
      return "waiting";
    } else {
      return isAccept ? "approved" : "refused";
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    {
      field:
        showRequestState === "receive" ? "sender_request" : "receiver_request",
      headerName: showRequestState === "receive" ? "Sender" : "Receiver",
      width: 150,
      valueGetter: ({ value }) => {
        return value?.name;
      },
    },
    {
      field: "content",
      headerName: "Content",
      width: 250,
    },
    {
      field: "request_status",
      headerName: "Status",
      width: 120,
      renderCell: ({ value }) => {
        if (value === "waiting") {
          return <Chip label="waiting" color="primary" />;
        } else if (value === "approved") {
          return <Chip label="approved" color="success" />;
        } else if (value === "refused") {
          return <Chip label="refused" color="neutral" />;
        }
      },
    },
    {
      field: "edit_status",
      headerName: showRequestState === "receive" ? "Edit Status" : "",
      width: showRequestState === "receive" ? 140 : 0,
      renderCell: (params) => params.value,
    },
    {
      field: "time",
      headerName: "Created At",
      width: 140,
    },
  ];

  const rows = request.requests?.map((req) => ({
    ...req,
    request_status: generateRequestStatus(req.isDone, req.isAccept),
    edit_status: showRequestState === "receive" && (
      <Button
        color="primary"
        onClick={() => handleClickOpenAcceptDialog(req?.id)}
      >
        Edit Status
      </Button>
    ),
    time: moment(req?.createdAt).fromNow(),
  }));
  return (
    <>
      <Box p={3} sx={{ height: "calc(100vh - 144px)", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent:
              showRequestState === "send" ? "space-between" : "end",
            marginBottom: 3,
          }}
        >
          {showRequestState === "send" && (
            <Button
              variant="contained"
              sx={{ alignSelf: "end" }}
              startIcon={<AddIcon />}
              onClick={handleClickOpenDialog}
            >
              Create Request
            </Button>
          )}
          <ToggleButtonGroup
            size="small"
            color="primary"
            exclusive
            value={showRequestState}
            onChange={onChangeRequestState}
          >
            <ToggleButton value="send">Send</ToggleButton>
            <ToggleButton value="receive">Receive</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <DataGrid
          sx={{
            "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
              py: "8px",
            },
          }}
          getRowHeight={() => "auto"}
          rows={rows}
          columns={columns}
          pageSize={12}
          rowsPerPageOptions={[12]}
        />
      </Box>
      {/* dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Create Request</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="role"
            select
            label="Role"
            fullWidth
            variant="standard"
            name="role"
            value={role}
            onChange={onChangeRoleInput}
          >
            {roles.map((r) => {
              if (r.roleValue !== 1 && r.roleValue !== auth.user.role) {
                return (
                  <MenuItem key={r.roleValue} value={r.roleValue}>
                    {r.text}
                  </MenuItem>
                );
              }
            })}
          </TextField>
          <TextField
            disabled={role ? false : true}
            margin="dense"
            id="receiverId"
            select
            label="Unit"
            fullWidth
            variant="standard"
            name="receiverId"
            value={receiverId}
            onChange={onChangeRequestDataInput}
          >
            {user.users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            multiline
            maxRows={4}
            margin="dense"
            id="content"
            label="Content"
            variant="standard"
            fullWidth
            name="content"
            value={content}
            onChange={onChangeRequestDataInput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button disabled={!isNotBlankFields()} onClick={handleSubmitRequest}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* accept dialog */}
      <Dialog
        open={openAcceptDialog}
        onClose={handleCloseAcceptDialog}
        fullWidth
      >
        <DialogTitle>Edit Status Request</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="isAccept"
            select
            label="Status"
            fullWidth
            variant="standard"
            name="isAccept"
            value={isAccept}
            onChange={onChangeAcceptRequestDataInput}
          >
            <MenuItem value={"true"}>Approved</MenuItem>
            <MenuItem value={"false"}>Refused</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAcceptDialog}>Cancel</Button>
          <Button onClick={handleAcceptRequest}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Requests;
