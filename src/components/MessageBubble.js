import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const MessageBubble = ({ msg }) => {
  const isUser = msg.type === "user";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
        px: 1
      }}
    >
      <Paper
        elevation={2}
        sx={{
          maxWidth: "70%",
          px: 2,
          py: 1.5,
          borderRadius: 3,
          bgcolor: isUser ? "#1976d2" : "#ffffff",
          color: isUser ? "#fff" : "#000",

          // 👇 WhatsApp bubble shape
          borderTopRightRadius: isUser ? "4px" : "16px",
          borderTopLeftRadius: isUser ? "16px" : "4px",

          boxShadow: isUser
            ? "0px 2px 6px rgba(0,0,0,0.2)"
            : "0px 2px 4px rgba(0,0,0,0.1)"
        }}
      >
        {/* Message Text */}
        <Typography variant="body1">{msg.text}</Typography>

        {/* Sources (only for AI) */}
        {!isUser && msg.sources && (
          <Box mt={1}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "gray" }}
            >
              Sources:
            </Typography>

            {msg.sources.map((s, i) => (
              <Typography
                key={i}
                variant="caption"
                display="block"
                sx={{ color: "#555" }}
              >
                📄 {s.trial_id} (Score: {s.score.toFixed(2)})
              </Typography>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MessageBubble;
