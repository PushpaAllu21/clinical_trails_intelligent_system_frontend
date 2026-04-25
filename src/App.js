import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import UploadPanel from "./components/UploadPanel";
import ChatPanel from "./components/ChatPanel";
import AuthPanel from "./components/AuthPanel";

const UI = {
  bgMain: "linear-gradient(135deg, #0f172a, #1e293b)",
  glass: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.1)",
  text: "#e2e8f0",
  accent: "linear-gradient(135deg, #667eea, #764ba2)"
};

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [sidebarRefreshToken, setSidebarRefreshToken] = useState(0);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      try {
        setUser(JSON.parse(currentUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const triggerSidebarRefresh = () => {
    setSidebarRefreshToken((prev) => prev + 1);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setChatId(null);
    setMessages([]);
  };

  if (!user) {
    return <AuthPanel onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: UI.bgMain, color: UI.text }}>      <Box
        sx={{
          flexShrink: 0,
          backdropFilter: "blur(20px)",
          background: "rgba(15, 23, 42, 0.7)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          px: 3,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: UI.text
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Clinical Trials Intelligence System
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            Signed in as {user.name} ({user.role})
          </Typography>
        </Box>
        <Button
          onClick={handleLogout}
          sx={{
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "10px",
            textTransform: "none",
            transition: "0.3s",
            px: 3,
            py: 1,
            fontWeight: 600,
            "&:hover": {
              background: "rgba(255,255,255,0.1)",
              transform: "translateY(-2px)"
            }
          }}
        >
          Logout
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          flexDirection: { xs: "column", md: "row" }
        }}
      >
        <UploadPanel
          setIsProcessing={setIsProcessing}
          setActiveChatId={setChatId}
          activeChatId={chatId}
          setMessages={setMessages}
          refreshTrigger={sidebarRefreshToken}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <ChatPanel
          chatId={chatId}
          messages={messages}
          setActiveChatId={setChatId}
          setMessages={setMessages}
          isProcessing={isProcessing}
          onChatCreated={triggerSidebarRefresh}
        />
      </Box>
    </Box>
  );
}

export default App;