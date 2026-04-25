import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import ReactMarkdown from "react-markdown";
import ChartComponent from "./ChartComponent";

const UI = {
  text: "#e2e8f0",
  accent: "linear-gradient(135deg, #667eea, #764ba2)",
  border: "rgba(255,255,255,0.1)"
};

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
        sx={{
          maxWidth: "75%",
          px: 2,
          py: 1.5,
          borderRadius: "18px",
          background: isUser
            ? UI.accent
            : "rgba(255,255,255,0.08)",
          color: UI.text,
          backdropFilter: "blur(10px)",
          border: `1px solid ${UI.border}`,
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-2px)"
          }
        }}
      >
        {/* USER MESSAGE */}
        {isUser && (
          <Typography variant="body1">
            {msg.text}
          </Typography>
        )}

        {/* BOT MESSAGE */}
        {!isUser && (
          <>
            {/* 🔥 Markdown Rendering */}
            <Box
               sx={{
                "& h2": {
                  marginTop: "12px",
                  marginBottom: "6px",
                  fontWeight: 600
                },
                "& p": {
                  marginBottom: "8px",
                  lineHeight: 1.5
                },
                "& ul": {
                  paddingLeft: "20px",
                  marginBottom: "8px"
                },
                "& li": {
                  marginBottom: "4px"
                }
              }}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </Box>

            {/* 📊 Chart */}
            {msg.chart && msg.chart.type && (
              <Box mt={2}>
                <Typography variant="subtitle2" fontWeight={600}>
                  📊 {msg.chart.title || "Visualization"}
                </Typography>

                <ChartComponent chart={msg.chart} />
              </Box>
            )}

            {/* Sources */}
            {msg.sources && (
              <Box mt={1}>
                <Typography variant="caption" color="gray">
                  Sources:
                </Typography>
                {msg.sources.map((s, i) => (
                  <Typography key={i} variant="caption" display="block">
                    📄 {s.trial_id} (Score: {s.score.toFixed(2)})
                  </Typography>
                ))}
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default MessageBubble;