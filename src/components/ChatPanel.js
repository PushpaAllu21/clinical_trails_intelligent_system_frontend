import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { askQuestion } from "../api";
import MessageBubble from "./MessageBubble";

const ChatPanel = ({ isProcessing }) => {
  const endRef = useRef();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async () => {
    if (!question) return;

    const userMsg = { type: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await askQuestion(question);

      const botMsg = {
        type: "bot",
        text: res.data.answer,
        sources: res.data.sources
      };

      setMessages((prev) => [...prev, botMsg]);
      setQuestion("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "72%" },
        p: 3,
        display: "flex",
        flexDirection: "column",
        height: "100vh"
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        Clinical Trails RAG Agent System
      </Typography>

      {/* Chat Area */}
      <Paper
        elevation={2}
        sx={{
          flex: 1,
          mt: 2,
          p: 2,
          pb: 3,
          borderRadius: 2,
          overflowY: "auto",
          backgroundColor: "#e5ddd5",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Box sx={{ px: 1 }}>
          {messages.length === 0 && (
            <Typography color="text.secondary">
              Ask a question to begin...
            </Typography>
          )}

          {messages.map((msg, index) => (
            <MessageBubble key={index} msg={msg} />
          ))}

          {/* ✅ AUTO SCROLL TARGET */}
          <div ref={endRef} />
        </Box>
      </Paper>

      {/* Input Section */}
      <Box
        mt={3}
        sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            borderTop: "1px solid #ddd",   
            pt: 2                          
        }}
      >
        <TextField
          fullWidth
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={
            isProcessing
              ? "Processing document..."
              : "Ask a question..."
          }
          disabled={isProcessing}
          sx={{
            backgroundColor: "#fff",
            borderRadius: 1
          }}
        />

        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleAsk}
          disabled={isProcessing}
          sx={{
            px: 3,
            height: "56px"
          }}
        >
          Ask
        </Button>
      </Box>
    </Box>
  );
};

export default ChatPanel;