import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { uploadDocument } from "../api";

const UploadPanel = ({ setIsProcessing }) => {
  const [file, setFile] = useState(null);
  const [trialId, setTrialId] = useState("");
  const [docType, setDocType] = useState("");
  const [version, setVersion] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("trial_id", trialId);
    formData.append("document_type", docType);
    formData.append("version", version);

    try {
      setLoading(true);
      setIsProcessing(true);
      setStatusMsg("Uploading... ⏳");

      await uploadDocument(formData);

      setStatusMsg("Processing document... ⚙️");

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

  return (
    <Paper
      elevation={3}
      sx={{
        width: { xs: "100%", md: "28%" },
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100vh"
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        Upload Document
      </Typography>

      {/* File Upload */}
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadFileIcon />}
        fullWidth
      >
        Select File
        <input hidden type="file" onChange={(e) => setFile(e.target.files[0])} />
      </Button>

      {/* Inputs (FIXED ✅) */}
      <TextField
        label="Trial ID"
        value={trialId}
        onChange={(e) => setTrialId(e.target.value)}
        fullWidth
      />

      <TextField
        label="Document Type"
        value={docType}
        onChange={(e) => setDocType(e.target.value)}
        fullWidth
      />

      <TextField
        label="Version"
        value={version}
        onChange={(e) => setVersion(e.target.value)}
        fullWidth
      />

      {/* Upload Button (FIXED loading usage ✅) */}
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 1, py: 1.5 }}
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Upload"}
      </Button>

      {/* Status */}
      <Typography color="text.secondary" mt={1}>
        {statusMsg}
      </Typography>

      {/* Footer */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          mt: "auto",
          textAlign: "center",
          fontSize: "0.7rem",
          opacity: 0.7
        }}
      >
        © 2026 Clinical Trials Intelligence System. All rights reserved, Developed by Pushpa ❤️.
      </Typography>
    </Paper>
  );
};

export default UploadPanel;