"use client";
import {
  Box,
  Divider,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getNoteById, updateNote } from "@/api/noteApi";
import { Note } from "@/types/note";
import { useEffect, useRef, useState } from "react";
import Options from "./Dropdown";
import RestoreNote from "./RestoreNote";

export default function ActiveNote() {
  const { noteId }: { noteId: string } = useParams();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { data: note } = useQuery({
    queryKey: ["note", noteId],
    queryFn: async () => {
      return await getNoteById(noteId);
    },
  }) as { data: Note };

  const updateMutation = useMutation({
    mutationFn: (updatedNote: { title: string; content: string }) =>
      updateNote(noteId, updatedNote),
  });

  const handleUpdate = (updateTitle: string, updatedContent: string) => {
    setTitle(updateTitle);
    setContent(updatedContent);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      updateMutation.mutate({ title: updateTitle, content: updatedContent });
    }, 2000);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  if (note?.deletedAt) {
    return (
      <>
        <RestoreNote noteId={note?.id} />
      </>
    );
  }
  return (
    <>
      <Stack
        height="100vh"
        bgcolor="black"
        width="70%"
        color="white"
        gap={2}
        padding={2}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Input
            defaultValue={title}
            sx={{
              color: "white",
              fontSize: "2.125rem",
            }}
            onChange={(e) => handleUpdate(e.target.value, content)}
          />

          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={"center"}
          width="25%"
        >
          <Typography variant="body1">Date</Typography>
          <Typography variant="body1">
            {note?.createdAt && new Date(note.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={"center"}
          width="25%"
        >
          <Typography variant="body1">Folder</Typography>
          <Typography variant="body1">{note?.folder.name}</Typography>
        </Box>
        <Input
          defaultValue={content}
          multiline
          rows={10}
          fullWidth
          disableUnderline
          sx={{
            color: "white",
            fontSize: "20px",
          }}
          onChange={(e) => handleUpdate(title, e.target.value)}
        />
      </Stack>
      <Options
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        note={note}
      />
    </>
  );
}
