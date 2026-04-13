import React, { useState } from "react";
import { Box } from "@mui/material";
import UploadPanel from "./components/UploadPanel";
import ChatPanel from "./components/ChatPanel";

function App() {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        flexDirection: { xs: "column", md: "row" }
      }}
    >
      <UploadPanel setIsProcessing={setIsProcessing} />
      <ChatPanel isProcessing={isProcessing} />
    </Box>
  );
}

export default App;