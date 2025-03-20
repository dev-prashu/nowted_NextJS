import React from "react";
import { Box, Button, Stack } from "@mui/material";
import { Search } from "@mui/icons-material";

function Topbar() {
  return (
    <Stack gap={2} alignItems="center" justifyContent="space-between">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      
      >
        <Box component="img" src="/logo.svg" alt="logo" />
        <Search></Search>
      </Stack>

      <Button
        variant="contained"
        sx={{
          backgroundColor: "#181818",
          color: "white",
          "&:hover": { backgroundColor: "#f0f0f0", color: "black" },
        }}
        fullWidth
      >
        + New Note
      </Button>
    </Stack>
  );
}

export default Topbar;
