import { getNotes } from "@/api/noteApi";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function NoteList() {
  const { data: notes } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  });

  return (
    <Box>
      {notes?.map((note) => (
        <Box
          key={note.id}
          border={2}
          padding={2}
          borderRadius={2}
          marginBottom={2}
          display="flex"
          flexDirection="column"
          gap={2}
         
        >
          <Typography variant="h6" fontWeight="bold" color="white">
            {note.title}
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1" color="white">
              {new Date(note.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" color="white" fontStyle="italic">
              {note.preview
                ? note.preview.length > 20
                  ? note.preview.slice(0, 20) + "..."
                  : note.preview
                : ""}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default NoteList;
