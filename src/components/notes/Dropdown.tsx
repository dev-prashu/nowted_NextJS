import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { Note } from "@/types/note";
import { useMutation } from "@tanstack/react-query";
import { deleteNote, updateNote } from "@/api/noteApi";

// Dropdown component that shows options
export default function Options({
  anchorEl,
  open,
  onClose,
  note,
}: {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  note: Note;
}) {
  const updateMutation = useMutation({
    mutationFn: (updatedNote: {
      isFavorite: boolean;
      isArchived: boolean;
      deletedAt: string;
    }) => updateNote(note?.id, updatedNote),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteNote(note?.id),
  });

  const handleFavorite = () => {
    updateMutation.mutate({ ...note, isFavorite: !note?.isFavorite });
    onClose();
  };
  const handleArchive = () => {
    updateMutation.mutate({ ...note, isArchived: !note?.isArchived });
    onClose();
  };

  const handleDelete = () => {
    deleteMutation.mutate();
    onClose();
  };
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "black",
          color: "white",
        },
      }}
    >
      <MenuItem
        onClick={() => {
          handleFavorite();
          console.log(note?.isFavorite);
        }}
      >
        {note?.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleArchive();
        }}
      >
        {note?.isArchived ? "Unarchive" : "Archive"}
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleDelete();
        }}
      >
        Delete
      </MenuItem>
    </Menu>
  );
}
