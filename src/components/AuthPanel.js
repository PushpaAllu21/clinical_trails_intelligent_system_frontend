import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Alert, IconButton, LinearProgress } from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle, Error } from "@mui/icons-material";
import { loginUser, registerUser } from "../api";

const UI = {
  bgMain: "linear-gradient(135deg, #0f172a, #1e293b)",
  glass: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.1)",
  text: "#e2e8f0",
  accent: "linear-gradient(135deg, #667eea, #764ba2)",
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b"
};

const AuthPanel = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const getPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordStrengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const passwordStrengthColors = ["#ef4444", "#f59e0b", "#f59e0b", "#10b981", "#10b981"];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setValidationErrors({});

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

      console.log(`🔐 Attempting ${mode}...`);

      let response;
      if (mode === "login") {
        response = await loginUser(payload);
      } else {
        response = await registerUser({ ...payload, name: name.trim() });
      }

      const { token, user } = response.data;
      if (!token) {
        setError("Authentication failed. Please try again.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log(`✅ ${mode} successful for ${user.email}`);
      onAuthSuccess(user);
    } catch (err) {
      console.error("❌ Auth Error Details:", {
        message: err.message,
        code: err.code,
        status: err.response?.status,
        data: err.response?.data
      });

      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        setError("🌐 Cannot reach the backend server.");
        console.error("🌐 Network Error: Backend may be down or wrong API URL.");
        return;
      }

      if (!err.response) {
        setError("⚠️ Backend server not responding.");
        console.error("⚠️ No Response: Server down, CORS issue, or wrong API URL.");
        return;
      }

      if (err.response?.data?.details) {
        const errors = {};
        err.response.data.details.forEach(detail => {
          errors[detail.path] = detail.msg;
        });
        setValidationErrors(errors);
        setError("❌ Please check the form for errors.");
        return;
      }

      if (err.response?.status >= 500) {
        setError(`❌ Server error (${err.response.status}). Please try again later.`);
        console.error(`❌ Server ${err.response.status}: ${err.response.data?.error || 'Unknown'}`);
        return;
      }

      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Authentication failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setValidationErrors({});
    setName("");
    setEmail("");
    setPassword("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          Query Sphere AI
        </Typography>
        <Button
          onClick={handleModeSwitch}
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
            width: { xs: "100%", sm: "450px" },
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
            <Alert
              severity="error"
              sx={{
                mb: 2,
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                borderColor: "rgba(239, 68, 68, 0.5)",
                border: "1px solid",
                color: "#fca5a5"
              }}
            >
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
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                sx={{
                  backdropFilter: "blur(10px)",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  input: { color: UI.text },
                  label: { color: "rgba(255,255,255,0.7)" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: validationErrors.name ? UI.error : UI.border
                    },
                    "&:hover fieldset": {
                      borderColor: validationErrors.name ? UI.error : "#667eea"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: validationErrors.name ? UI.error : "#667eea"
                    }
                  },
                  "& .MuiFormHelperText-root": {
                    color: UI.error
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
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              sx={{
                backdropFilter: "blur(10px)",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "12px",
                input: { color: UI.text },
                label: { color: "rgba(255,255,255,0.7)" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "& fieldset": {
                    borderColor: validationErrors.email ? UI.error : UI.border
                  },
                  "&:hover fieldset": {
                    borderColor: validationErrors.email ? UI.error : "#667eea"
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: validationErrors.email ? UI.error : "#667eea"
                  }
                },
                "& .MuiFormHelperText-root": {
                  color: UI.error
                }
              }}
            />

            <Box sx={{ position: "relative" }}>
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                sx={{
                  backdropFilter: "blur(10px)",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  "& .MuiInputBase-input": {
                    color: UI.text,
                    paddingRight: "40px"
                  },
                  label: {
                    color: "rgba(255,255,255,0.7)"
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: validationErrors.password
                        ? "rgba(239,68,68,0.5)"
                        : UI.border,
                      transition: "0.3s"
                    },
                    "&:hover fieldset": {
                      borderColor: validationErrors.password
                        ? "#ef4444"
                        : "#667eea"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: validationErrors.password
                        ? "#ef4444"
                        : "#667eea",
                      boxShadow: validationErrors.password
                        ? "0 0 0 1px rgba(239,68,68,0.25)"
                        : "0 0 0 1px rgba(102,126,234,0.25)"
                    }
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#fca5a5",
                    marginLeft: "2px"
                  }
                }}
              />
              <IconButton
                onClick={togglePasswordVisibility}
                onMouseDown={(e) => e.preventDefault()}
                sx={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: validationErrors.password
                    ? "rgba(239,68,68,0.8)"
                    : "rgba(255,255,255,0.7)",
                  transition: "0.2s",
                  "&:hover": {
                    color: validationErrors.password
                      ? "#ef4444"
                      : "#667eea",
                    backgroundColor: "transparent"
                  },
                  zIndex: 2
                }}
                size="small"
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </Box>

            {mode === "register" && password && (
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mr: 1 }}>
                    Password Strength:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: passwordStrengthColors[passwordStrength - 1] || UI.error,
                      fontWeight: 600
                    }}
                  >
                    {passwordStrengthText[passwordStrength - 1] || "Very Weak"}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(passwordStrength / 5) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: passwordStrengthColors[passwordStrength - 1] || UI.error,
                      borderRadius: 3
                    }
                  }}
                />
                <Box sx={{ mt: 1, display: "grid", gap: 0.5 }}>
                  {[
                    { test: password.length >= 6, label: "At least 6 characters" },
                    { test: /[a-z]/.test(password), label: "One lowercase letter" },
                    { test: /[A-Z]/.test(password), label: "One uppercase letter" },
                    { test: /\d/.test(password), label: "One number" },
                    { test: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password), label: "One special character" }
                  ].map((item, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
                      {item.test ? (
                        <CheckCircle sx={{ fontSize: 16, color: UI.success, mr: 1 }} />
                      ) : (
                        <Error sx={{ fontSize: 16, color: UI.error, mr: 1 }} />
                      )}
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

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
                },
                "&:disabled": {
                  background: "rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.5)"
                }
              }}
            >
              {loading ? "Processing..." : (mode === "login" ? "Sign in" : "Create Account")}
            </Button>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, borderTop: `1px solid ${UI.border}`, pt: 3 }}>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
              {mode === "login" ? "New here?" : "Already have an account?"}
            </Typography>
            <Button
              variant="text"
              onClick={handleModeSwitch}
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

