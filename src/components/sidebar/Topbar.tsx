"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Input,
  List,
  ListItemButton,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createNote, searchQuery } from "@/api/noteApi";
import { Note } from "@/types/note";

function Topbar() {
  const { folderId } = useParams();
  const router = useRouter();
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const createMutation = useMutation({
    mutationFn: createNote,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["filterNotes", query],
    queryFn: () => searchQuery(query),
    enabled: !!query,
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
    <Stack
      gap={2}
      paddingTop={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Box component="img" src="/logo.svg" alt="logo" />
        <IconButton
          sx={{ color: "white" }}
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search />
        </IconButton>
      </Stack>

      {showSearch ? (
        <Box width="100%" position="relative">
          <Input
            type="text"
            placeholder="Search"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: "100%", color: "white" }}
          />

          {(isLoading || (data && data.length > 0) || query) && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                zIndex: 1,
                backgroundColor: "black",
                maxHeight: "220px",
                overflowY: "auto",
                width: "100%",
                borderRadius: "4px",
                border: "1px solid #333",
              }}
            >
              {isLoading ? (
                <Typography sx={{ color: "white", padding: 1 }}>
                  Loading...
                </Typography>
              ) : data && data.length > 0 ? (
                <List>
                  {data.map((note: Note) => (
                    <ListItemButton
                      key={note.id}
                      onClick={() => {
                        router.push(`/${note.folderId}/${note.id}`);
                      }}
                      sx={{ bgcolor: "black", color: "white", width: "100%" }}
                    >
                      {note.title}
                    </ListItemButton>
                  ))}
                </List>
              ) : (
                query && (
                  <Typography sx={{ color: "white", padding: 1 }}>
                    No results found
                  </Typography>
                )
              )}
            </Paper>
          )}
        </Box>
      ) : (
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
      )}
    </Stack>
  );
}

export default Topbar;
