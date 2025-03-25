"use client";
import { Stack, Typography } from "@mui/material";
import React from "react";
import NoteList from "./NoteList";
import { useParams } from "next/navigation";

function NoteContainer() {
  const { folderId } = useParams();

  return (
    <Stack
      height="100vh"
      bgcolor="#1C1C1C"
      width="30%"
      padding={2}
      gap={2}
      overflow="auto"
      display="flex"
      flexDirection="column"
    >
      {folderId ? (
        <NoteList />
      ) : (
        <Typography color="white">Nothing to Show</Typography>
      )}
    </Stack>
  );
}

export default NoteContainer;
