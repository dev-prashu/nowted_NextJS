"use client";
import { getNotes } from "@/api/noteApi";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";

function NoteList() {
  const { folderId }: { folderId: string } = useParams();
  const router = useRouter();

  const { data: notes, isPending } = useQuery({
    queryKey: ["notes", folderId],
    queryFn: () => getNotes({ page: 1, limit: 10, folderId }),
  });

  if (isPending) {
    return (
      <Stack height="100vh" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack spacing={2} width="100%">
      <Typography variant="h5" fontWeight="bold" color="white">
        {notes?.[0]?.folder?.name || "No Folder Selected"}
      </Typography>

      {notes?.length ? (
        notes.map((note) => (
          <Box
            key={note.id}
            sx={{
              padding: 2,
              borderRadius: 2,
              bgcolor: "black",
              color: "white",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              cursor: "pointer",
            }}
            onClick={() => {
              router.push(`/${folderId}/${note.id}`);
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {note.title}
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">
                {new Date(note.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" fontStyle="italic">
                {note.preview?.slice(0, 20) || "No preview"}...
              </Typography>
            </Box>
          </Box>
        ))
      ) : (
        <Typography color="textSecondary">No notes available.</Typography>
      )}
    </Stack>
  );
}

export default NoteList;
