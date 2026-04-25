import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Alert } from "@mui/material";
import { loginUser, registerUser } from "../api";

const UI = {
  bgMain: "linear-gradient(135deg, #0f172a, #1e293b)",
  glass: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.1)",
  text: "#e2e8f0",
  accent: "linear-gradient(135deg, #667eea, #764ba2)"
};

const AuthPanel = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || (mode === "register" && !name.trim())) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        email: email.trim().toLowerCase(),
        password: password.trim()
      };

      let response;
      if (mode === "login") {
        response = await loginUser(payload);
      } else {
        response = await registerUser({ ...payload, name: name.trim() });
      }

      const { token, user } = response.data;
      if (!token && mode === "register") {
        setError("Registration succeeded, please log in.");
        setMode("login");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onAuthSuccess(user);
    } catch (err) {
      console.error("Auth failed", err);
      const msg = err.response?.data?.error || "Authentication failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: UI.bgMain,
        overflow: "hidden"
      }}
    >
      {/* Header */}
      <Box
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
        <Typography variant="h6" fontWeight={700}>
          Clinical Trials Intelligence System
        </Typography>
        <Button
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
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
          {mode === "login" ? "Register" : "Login"}
        </Button>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          overflow: "hidden"
        }}
      >
        <Paper
        elevation={0}
        sx={{
          width: { xs: "100%", sm: "420px" },
          p: 4,
          backdropFilter: "blur(20px)",
          background: UI.glass,
          border: `1px solid ${UI.border}`,
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          color: UI.text
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={2}
          sx={{
            color: UI.text,
            fontFamily: "Times New Roman, serif",
            textTransform: "uppercase",
            textAlign: "center",
            letterSpacing: "1px",
            marginBottom: "10px"
          }}
        >
          {mode === "login" ? "Sign in" : "Create account"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: "rgba(239, 68, 68, 0.15)", borderColor: "rgba(239, 68, 68, 0.5)", border: "1px solid", color: "#fca5a5" }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
          {mode === "register" && (
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              sx={{
                backdropFilter: "blur(10px)",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "12px",
                input: { color: UI.text },
                label: { color: "rgba(255,255,255,0.7)" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "& fieldset": {
                    borderColor: UI.border
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
          )}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "12px",
              input: { color: UI.text },
              label: { color: "rgba(255,255,255,0.7)" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": {
                  borderColor: UI.border
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

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "12px",
              input: { color: UI.text },
              label: { color: "rgba(255,255,255,0.7)" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": {
                  borderColor: UI.border
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
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              background: UI.accent,
              borderRadius: "12px",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              transition: "0.3s",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 14px 36px rgba(0,0,0,0.35)"
              }
            }}
          >
            {mode === "login" ? "Sign in" : "Register"}
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, borderTop: `1px solid ${UI.border}`, pt: 3 }}>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
            {mode === "login" ? "New here?" : "Already have an account?"}
          </Typography>
          <Button
            variant="text"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            sx={{
              color: "#667eea",
              textTransform: "none",
              fontWeight: 600,
              transition: "0.3s",
              "&:hover": {
                color: "#764ba2",
                background: "rgba(102, 126, 234, 0.1)"
              }
            }}
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </Button>
        </Box>
      </Paper>
      </Box>
    </Box>
  );
};

export default AuthPanel;