import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
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
      gap: 2, // 🔥 adds spacing between fields
      height: "100vh"
    }}
  >
    <Typography variant="h6" fontWeight={600}>
      Upload Document
    </Typography>

    <Button
      variant="outlined"
      component="label"
      startIcon={<UploadFileIcon />}
      fullWidth
    >
      Select File
      <input hidden type="file" onChange={(e) => setFile(e.target.files[0])} />
    </Button>

    <TextField label="Trial ID" fullWidth />
    <TextField label="Document Type" fullWidth />
    <TextField label="Version" fullWidth />

    <Button
      variant="contained"
      fullWidth
      sx={{ mt: 1, py: 1.5 }}
      onClick={handleUpload}
    >
      Upload
    </Button>

    <Typography color="text.secondary" mt={1}>
      {statusMsg}
    </Typography>

    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        mt: 'auto',
        textAlign: 'center',
        fontSize: '0.7rem',
        opacity: 0.7
      }}
    >
      © 2026 Clinical Trials Intelligence System. All rights reserved, Developed by Pushpa ❤️.
    </Typography>
  </Paper>
);
};

export default UploadPanel;