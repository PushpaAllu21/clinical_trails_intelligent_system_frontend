import React, { useState, useEffect } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChatIcon from "@mui/icons-material/Chat";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Box
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import API, { uploadDocument } from "../api";

const UploadPanel = ({
  setIsProcessing,
  setActiveChatId,
  activeChatId,
  setMessages,
  refreshTrigger,
  sidebarOpen,
  setSidebarOpen
}) => {
  const [file, setFile] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // 🔥 Chat states
  const [chats, setChats] = useState([]);

  // 🚀 Fetch chats
 const fetchChats = async () => {
  try {
    const res = await API.get("/chat");
    setChats(res.data);
  } catch (err) {
    console.error("Failed to fetch chats", err);
  }
};

useEffect(() => {
    fetchChats();
  }, [refreshTrigger]);

  // 🚀 Start a new chat session locally
  const createNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
  };

  // 🚀 Upload file
  const handleUpload = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setIsProcessing(true);
      setStatusMsg(`📤 Uploading ${file.name}...`);

      await uploadDocument(formData);

      setStatusMsg("⚙️ Processing document...");

      setTimeout(() => {
        setIsProcessing(false);
        setLoading(false);
        setStatusMsg("Document ready ✅");
      }, 5000);
    } catch (err) {
      console.error(err);
      setStatusMsg("Upload failed ❌");
      setIsProcessing(false);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/chat/${deleteId}`);

      if (deleteId === activeChatId) {
        setActiveChatId(null);
        setMessages([]);
      }

      setDeleteId(null);
      fetchChats();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const saveTitle = async (id) => {
    try {
      const trimmedTitle = editTitle.trim().slice(0, 50);
      if (!trimmedTitle) {
        setEditId(null);
        return;
      }

      await API.put(`/chat/${id}`, {
        title: trimmedTitle
      });

      setEditId(null);
      setEditTitle("");
      fetchChats();
    } catch (err) {
      console.error("Rename failed", err);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: { xs: sidebarOpen ? "100%" : 0, md: sidebarOpen ? 280 : 80 },
        flexShrink: 0,
        transition: "all 0.3s ease",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        p: sidebarOpen ? 2 : 1,
        height: "100%",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        color: "#fff",
        position: { xs: "absolute", md: "relative" },
        zIndex: { xs: sidebarOpen ? 100 : -1, md: "auto" },
        "&::-webkit-scrollbar": {
          width: "6px"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: "10px"
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "space-between" : "center",
          mb: 2
        }}
      >
        {sidebarOpen && (
          <Typography fontWeight={700}>
            Query Sphere AI
          </Typography>
        )}

        <IconButton
          onClick={() => setSidebarOpen(!sidebarOpen)}
          sx={{ color: "#fff" }}
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      {sidebarOpen && (
        <>

      {/* 🚀 FILE UPLOAD */}
      <Box
        component="label"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          width: "100%",
          py: 2,
          px: 2,
          borderRadius: "16px",
          border: file
            ? "2px solid rgba(102, 126, 234, 0.6)"
            : "2px dashed rgba(255,255,255,0.3)",
          background: file
            ? "rgba(102, 126, 234, 0.12)"
            : "rgba(255,255,255,0.04)",
          backdropFilter: "blur(10px)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          textAlign: "center",
          "&:hover": {
            borderColor: "#667eea",
            background: "rgba(102, 126, 234, 0.08)",
            transform: "translateY(-2px)",
            boxShadow: "0 10px 30px rgba(102, 126, 234, 0.2)"
          }
        }}
      >
        <input
          hidden
          type="file"
          accept=".pdf,.csv,.xlsx,.jpg,.jpeg,.png"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (!selectedFile) return;

            const allowedTypes = [
              "application/pdf",
              "text/csv",
              "application/vnd.ms-excel",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "image/jpeg",
              "image/png"
            ];

            if (!allowedTypes.includes(selectedFile.type)) {
              alert("Only PDF, CSV, XLSX, JPG, PNG files are allowed");
              return;
            }

            setFile(selectedFile);
          }}
        />

        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            boxShadow: "0 6px 20px rgba(102, 126, 234, 0.35)",
            mb: 0.5
          }}
        >
          <UploadFileIcon sx={{ color: "#fff", fontSize: 26 }} />
        </Box>

        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ color: file ? "#c7d2fe" : "#e2e8f0" }}
        >
          {file ? "Change File" : "Click or Drop File Here"}
        </Typography>

        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
          {file ? file.name : "PDF, CSV, XLSX, JPG, PNG up to 10MB"}
        </Typography>
      </Box>
      {/* 📄 FILE PREVIEW */}
      {file && (
        <Box
          sx={{
            p: 1.5,
            color: "#f5f5f5",
            borderRadius: 2
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            {file.name}
          </Typography>
          <Typography variant="caption">
            {(file.size / 1024).toFixed(2)} KB
          </Typography>
        </Box>
      )}


      {/* 🚀 UPLOAD BUTTON */}
      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 1,
          background: "linear-gradient(45deg, #667eea, #764ba2)",
          borderRadius: "12px",
          marginBottom: "10px",
          textTransform: "none",
          fontWeight: 600,
          transition: "0.3s",
          "&:hover": {
            background: "linear-gradient(45deg, #5a4acd, #00b4e6)",
            transform: "translateY(-2px)",
            boxShadow: "0 14px 30px rgba(0,0,0,0.25)"
          }
        }}
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? <CircularProgress size={24} /> : "Upload"}
      </Button>

      {/* STATUS */}
      <Typography color="text.secondary">
        {statusMsg}
      </Typography>

      {/* 🔥 NEW CHAT BUTTON */}
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        sx={{
          background: "linear-gradient(45deg, #667eea, #764ba2)",
          borderRadius: "12px",
          textTransform: "none",
          marginBottom: "20px",
          fontWeight: 600,
          transition: "0.3s",
          "&:hover": {
            background: "linear-gradient(45deg, #5a4acd, #00b4e6)",
            transform: "translateY(-2px)",
            boxShadow: "0 14px 30px rgba(0,0,0,0.25)"
          }
        }}
        onClick={createNewChat}
      >
        + New Chat
      </Button>

      {/* 🔥 CHAT HISTORY */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
  {chats.map((chat) => (
    <Box
      key={chat._id}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1,
        borderRadius: 2,
        mb: 1,
        cursor: "pointer",
        transition: "0.2s",
        backgroundColor: chat._id === activeChatId ? "rgba(255,255,255,0.15)" : "transparent",
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0.1)"
        },
        "&:hover .actions": {
          opacity: 1
        }
      }}
      onClick={() => setActiveChatId(chat._id)}
    >
      {editId === chat._id ? (
        <TextField
          size="small"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={() => saveTitle(chat._id)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveTitle(chat._id);
          }}
          autoFocus
          fullWidth
        />
      ) : (
        <Typography
          variant="body2"
          noWrap
          onClick={() => setActiveChatId(chat._id)}
        >
          {chat.title || "New Chat"}
        </Typography>
      )}

      <Box
        className="actions"
        sx={{
          display: "flex",
          gap: 0.5,
          opacity: 0
        }}
      >
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setEditId(chat._id);
            setEditTitle(chat.title || "");
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteId(chat._id);
          }}
        >
          <DeleteOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  ))}
</Box>

{/* 🔥 DELETE CONFIRMATION DIALOG */}
<Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
  <DialogTitle>Delete this chat?</DialogTitle>

  <DialogActions>
    <Button onClick={() => setDeleteId(null)}>Cancel</Button>
    <Button color="error" onClick={handleDelete}>
      Delete
    </Button>
  </DialogActions>
</Dialog>

      {/* FOOTER */}
      <Typography
        variant="caption"
        sx={{
          textAlign: "center",
          opacity: 0.7
        }}
      >
        © 2026 Query Sphere AI <br />
        Developed by Chandra Sekhar.
      </Typography>
        </>
      )}

      {!sidebarOpen && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 2
          }}
        >
          <IconButton
            onClick={() => document.getElementById("file-input").click()}
            sx={{ color: "#fff" }}
          >
            <UploadFileIcon />
          </IconButton>
          <IconButton
            onClick={createNewChat}
            sx={{ color: "#fff" }}
          >
            <ChatIcon />
          </IconButton>
        </Box>
      )}
    </Paper>
  );
};

export default UploadPanel;