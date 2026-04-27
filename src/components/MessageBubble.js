import React from "react";
import { Box, Typography, Paper, useMediaQuery, useTheme } from "@mui/material";
import ReactMarkdown from "react-markdown";
import ChartComponent from "./ChartComponent";

const UI = {
  text: "#e2e8f0",
  accent: "linear-gradient(135deg, #667eea, #764ba2)",
  border: "rgba(255,255,255,0.1)"
};

const MessageBubble = ({ msg }) => {
  const isUser = msg.type === "user";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.down("md")); // < 900px

  // 📱 Responsive sizing
  const getResponsiveStyles = () => {
    if (isMobile) {
      return {
        maxWidth: "92%",
        px: 1.5,
        py: 1,
        borderRadius: "12px",
        containerPx: 0.5,
        marginBottom: 1.5,
        fontSize: "0.875rem" // smaller text on mobile
      };
    }
    if (isTablet) {
      return {
        maxWidth: "85%",
        px: 2,
        py: 1.25,
        borderRadius: "15px",
        containerPx: 1,
        marginBottom: 1.75,
        fontSize: "0.9375rem"
      };
    }
    return {
      maxWidth: "75%",
      px: 2,
      py: 1.5,
      borderRadius: "18px",
      containerPx: 1,
      marginBottom: 2,
      fontSize: "1rem"
    };
  };

  const responsiveStyles = getResponsiveStyles();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: responsiveStyles.marginBottom,
        px: responsiveStyles.containerPx,
        width: "100%"
      }}
    >
      <Paper
        sx={{
          maxWidth: responsiveStyles.maxWidth,
          width: "100%",
          px: responsiveStyles.px,
          py: responsiveStyles.py,
          borderRadius: responsiveStyles.borderRadius,
          background: isUser
            ? UI.accent
            : "rgba(255,255,255,0.08)",
          color: UI.text,
          backdropFilter: "blur(10px)",
          border: `1px solid ${UI.border}`,
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          transition: "0.3s",
          overflowWrap: "break-word",
          wordWrap: "break-word",
          ...(!isUser && {
            maxHeight: isMobile ? "50vh" : isTablet ? "55vh" : "65vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255,255,255,0.2)",
              borderRadius: "10px"
            }
          }),
          "&:hover": {
            transform: "translateY(-2px)"
          }
        }}
      >
        {/* USER MESSAGE */}
        {isUser && (
          <Typography
            variant="body1"
            sx={{
              fontSize: responsiveStyles.fontSize,
              wordBreak: "break-word"
            }}
          >
            {msg.text}
          </Typography>
        )}

        {/* BOT MESSAGE */}
        {!isUser && (
          <>
            {/* 🔥 Markdown Rendering */}
            <Box
               sx={{
                fontSize: responsiveStyles.fontSize,
                "& h2": {
                  marginTop: isMobile ? "8px" : "12px",
                  marginBottom: isMobile ? "4px" : "6px",
                  fontWeight: 600,
                  fontSize: isMobile ? "1rem" : "1.1rem"
                },
                "& h3": {
                  marginTop: isMobile ? "6px" : "10px",
                  marginBottom: isMobile ? "3px" : "5px",
                  fontSize: isMobile ? "0.95rem" : "1rem"
                },
                "& p": {
                  marginBottom: isMobile ? "6px" : "8px",
                  lineHeight: 1.5,
                  wordBreak: "break-word"
                },
                "& ul": {
                  paddingLeft: isMobile ? "16px" : "20px",
                  marginBottom: isMobile ? "6px" : "8px"
                },
                "& ol": {
                  paddingLeft: isMobile ? "16px" : "20px",
                  marginBottom: isMobile ? "6px" : "8px"
                },
                "& li": {
                  marginBottom: isMobile ? "2px" : "4px",
                  wordBreak: "break-word"
                },
                "& code": {
                  fontSize: isMobile ? "0.8rem" : "0.85rem",
                  padding: "2px 4px",
                  borderRadius: "3px",
                  backgroundColor: "rgba(0,0,0,0.2)"
                },
                "& blockquote": {
                  borderLeft: "3px solid rgba(255,255,255,0.3)",
                  paddingLeft: isMobile ? "8px" : "12px",
                  marginLeft: isMobile ? "8px" : "12px",
                  marginY: isMobile ? "4px" : "8px"
                }
              }}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </Box>

            {/* 📊 Chart */}
            {msg.chart && msg.chart.type && (
              <Box mt={isMobile ? 1.5 : 2}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{
                    fontSize: isMobile ? "0.85rem" : "0.875rem",
                    mb: 1
                  }}
                >
                  📊 {msg.chart.title || "Visualization"}
                </Typography>

                <ChartComponent chart={msg.chart} />
              </Box>
            )}

            {/* Sources */}
            {msg.sources && (
              <Box mt={isMobile ? 1 : 1}>
                <Typography
                  variant="caption"
                  color="gray"
                  sx={{
                    fontSize: isMobile ? "0.75rem" : "0.8rem"
                  }}
                >
                  Sources:
                </Typography>
                {msg.sources.map((s, i) => (
                  <Typography
                    key={i}
                    variant="caption"
                    display="block"
                    sx={{
                      fontSize: isMobile ? "0.75rem" : "0.8rem",
                      wordBreak: "break-word"
                    }}
                  >
                    📄 {s.text?.substring(0, 60)}... (Score: {s.score.toFixed(2)})
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