import { Delete, Inventory, Star } from "@mui/icons-material";
import { Stack, Typography, Box } from "@mui/material";
import React from "react";

function More() {
  return (
    <Stack gap={2} >
      <Typography>More</Typography>
      <Box display="flex" gap={2}>
        <Star />
        <Typography>Favorites</Typography>
      </Box>
      <Box display="flex" gap={2}>
        <Delete />
        <Typography>Trash</Typography>
      </Box>
      <Box display="flex" gap={2}>
        <Inventory />
        <Typography>Archived Notes</Typography>
      </Box>
    </Stack>
  );
}

export default More;
