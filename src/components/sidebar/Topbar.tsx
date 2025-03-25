"use client";
import React from "react";
import { Box, Button, Stack } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createNote } from "@/api/noteApi";
import { Note } from "@/types/note";

function Topbar() {
  const { folderId } = useParams();
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: createNote,
  });

  const handleCreateNote = () => {
    const newNote: Partial<Note> = {
      folderId: folderId! as string,
      title: "Untitled Note",
      content: "Start Writing......",
      isFavorite: false,
      isArchived: false,
    };

    createMutation.mutate(newNote, {
      onSuccess: (id) => {
        router.push(`/${folderId}/${id}`);
      },
    });
  };
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
          backgroundColor: "#333333",
          color: "white",
          "&:hover": { backgroundColor: "#f0f0f0", color: "black" },
        }}
        fullWidth
        onClick={handleCreateNote}
      >
        + New Note
      </Button>
    </Stack>
  );
}

export default Topbar;
