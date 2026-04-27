import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import API, { askQuestion } from "../api";
import MessageBubble from "./MessageBubble";

const UI = {
  bgMain: "linear-gradient(135deg, #0f172a, #1e293b)",
  glass: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.1)",
  text: "#e2e8f0",
  accent: "linear-gradient(135deg, #667eea, #764ba2)"
};

const ChatPanel = ({ chatId, messages, setActiveChatId, setMessages, isProcessing, onChatCreated }) => {
  const endRef = useRef();

  const [question, setQuestion] = useState("");

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const loadChat = async () => {
      try {
        const res = await API.get(`/chat/${chatId}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Failed to load chat:", err);
      }
    };

    loadChat();
  }, [chatId, setMessages]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const cleanQuestion = question.trim();
    if (cleanQuestion.length > 1000) {
      alert("Question is too long. Please keep it under 1000 characters.");
      return;
    }

    const userMsg = { type: "user", text: cleanQuestion };
    setMessages((prev) => [...prev, userMsg]);

    try {
      let currentChatId = chatId;
      let createdNewChat = false;

      if (!currentChatId) {
        const newChat = await API.post("/chat", {
          title: cleanQuestion.slice(0, 40)
        });

        currentChatId = newChat.data._id;
        createdNewChat = true;
      }

      const res = await askQuestion({
        question: cleanQuestion,
        chatId: currentChatId
      });

      const botMsg = {
        type: "bot",
        text: res.data.answer,
        chart: res.data.chart,
        sources: res.data.sources
      };

      setMessages((prev) => [...prev, botMsg]);
      setQuestion("");

      if (createdNewChat && res.data.chat) {
        onChatCreated?.();
      }
    } catch (err) {
      console.error("Query failed:", err);
      const errorMsg = {
        type: "bot",
        text: "Sorry, I encountered an error processing your question. Please try again.",
        chart: null,
        sources: []
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        p: 3,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: UI.bgMain,
        color: UI.text
      }}
    >
      <Typography variant="h6" fontWeight={600} sx={{ color: UI.text }}>
        RAG Agent System
      </Typography>

      {/* Chat Area */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          mt: 2,
          p: 2,
          pb: 3,
          borderRadius: "16px",
          backdropFilter: "blur(20px)",
          background: UI.glass,
          border: `1px solid ${UI.border}`,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.2)",
            borderRadius: "10px"
          }
        }}
      >
        <Box sx={{ px: 1, flex: 1 }}>
          {messages.length === 0 && (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                fontSize: "16px"
              }}
            >
              🚀 Transform data into decisions. Start by asking a question.
            </Box>
          )}

          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <MessageBubble msg={msg} />
            </motion.div>
          ))}

          {/* ✅ AUTO SCROLL TARGET */}
          <div ref={endRef} />
        </Box>
      </Paper>

      {/* Input Section */}
      <Box
        sx={{
          flexShrink: 0,
          mt: 3,
          display: "flex",
          gap: 1,
          alignItems: "center",
          borderTop: `1px solid ${UI.border}`,
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
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "12px",
            input: { color: "#fff" },
            ".MuiOutlinedInput-root": {
              borderRadius: "12px",
              "& fieldset": {
                borderColor: "rgba(255,255,255,0.2)"
              },
              "&:hover fieldset": {
                borderColor: "#667eea"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#667eea"
              }
            }
          }}
        />

        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleAsk}
          disabled={isProcessing}
          sx={{
            background: UI.accent,
            borderRadius: "12px",
            color: "#fff",
            px: 3,
            height: "56px",
            textTransform: "none",
            transition: "0.3s",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 14px 36px rgba(0,0,0,0.35)"
            }
          }}
        >
          Ask
        </Button>
      </Box>
    </Box>
  );
};

export default ChatPanel;