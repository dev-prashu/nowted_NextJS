import { getRecentNotes } from "@/api/noteApi";
import { Note } from "@/types/note";
import { Description } from "@mui/icons-material";

import {
  Stack,
  Typography,
  CircularProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  if (isPending) {
    return (
      <Stack alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }
  if (isError) {
    return <Typography color="error">Failed to load notes</Typography>;
  }

  return (
    <Stack paddingTop={2}>
      <Typography>Recents</Typography>
      <List>
        {notes?.map((note) => (
          <ListItemButton
            key={note.id}
            sx={{
              padding: "0",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
            onClick={() => {
              router.push(`/${note.folderId}/${note.id}`);
            }}
          >
            <ListItemIcon>
              <Description sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary={note.title} />
          </ListItemButton>
        ))}
      </List>
    </Stack>
  );
}

export default RecentNotes;
