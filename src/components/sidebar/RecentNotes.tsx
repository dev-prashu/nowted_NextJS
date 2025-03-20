import { getRecentNotes } from "@/api/noteApi";
import { Note } from "@/types/note";
import { Description } from "@mui/icons-material";
import { Stack, Typography, Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import React from "react";

function RecentNotes() {
  const {
    data: notes,
    isPending,
    isError,
  } = useQuery<Note[]>({
    queryKey: ["recent"],
    queryFn: getRecentNotes,
  });

  if (isPending) {
    return <CircularProgress />;
  }
  if (isError) {
    return <Typography color="error">Failed to load notes</Typography>;
  }

  return (
    <Stack>
      <Typography>Recents</Typography>
      {notes?.map((note) => (
        <Box
          key={note.id}
          display="flex"
          alignItems="center"
          gap={2}
          paddingTop={2}
        >
          <Description />
          <Typography
            component="span"
            sx={{
              cursor: "pointer",
              color: "white",
              ":hover": {
                color: "lightblue",
              },
            }}
          >
            {note.title}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

export default RecentNotes;
