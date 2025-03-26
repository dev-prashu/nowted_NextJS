"use Client";
import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { Note } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote, updateNote } from "@/api/noteApi";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Options({
  anchorEl,
  open,
  onClose,
  note,
  setisDeleted,
}: {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  note: Note;
  setisDeleted: (value: boolean) => void;
}) {
  const { folderId } = useParams();
  const router = useRouter();

  const updateMutation = useMutation({
    mutationFn: (updatedNote: {
      isFavorite: boolean;
      isArchived: boolean;
      deletedAt: string;
    }) => updateNote(note?.id, updatedNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", folderId] });
      queryClient.invalidateQueries({ queryKey: ["note", note?.id] });
    },
  });
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteNote(note?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", folderId] });
    },
  });

  const handleFavorite = () => {
    updateMutation.mutate({ ...note, isFavorite: !note?.isFavorite });
    onClose();
  };
  const handleArchive = () => {
    updateMutation.mutate({ ...note, isArchived: !note?.isArchived });

    router.push(`/${folderId}`);
    onClose();
  };

  const handleDelete = () => {
    deleteMutation.mutate();
    setisDeleted(true);
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
