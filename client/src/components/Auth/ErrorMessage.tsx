import { Box, Typography, Fade } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface ErrorMessageProps {
  message: string | null;
  sx?: SxProps<Theme>;
}

export function ErrorMessage({ message, sx = {} }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <Fade in>
      <Box sx={{
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        padding: "0.75rem 1rem",
        borderRadius: "8px",
        textAlign: "center",
        fontWeight: 500,
        ...sx,
      }}>
        <Typography variant="body2">{message}</Typography>
      </Box>
    </Fade>
  );
}