"use client";
import { Delete, Inventory, Star } from "@mui/icons-material";
import { Stack, Typography, Button, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const StyledButton = styled(Button)({
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: "10px",
  borderRadius: "none",
  color: "white",
  width: "100%",
  padding: "2px",
  textTransform: "none",
});

function More() {
  const router = useRouter();
  return (
    <Stack gap={2}>
      <Typography>More</Typography>
      <StyledButton onClick={() => router.push("/favorite")}>
        <Star />
        <Typography>Favorites</Typography>
      </StyledButton>
      <StyledButton onClick={() => router.push("/trash")}>
        <Delete />
        <Typography>Trash</Typography>
      </StyledButton>
      <StyledButton onClick={() => router.push("/archive")}>
        <Inventory />
        <Typography>Archived Notes</Typography>
      </StyledButton>
    </Stack>
  );
}

export default More;
