"use client";
import {
  createFolder,
  deleteFolder,
  getFolders,
  updateFolder,
} from "@/api/folderApi";
import { FolderType } from "@/types/folder";
import { CreateNewFolder, Delete, Folder } from "@mui/icons-material";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Input,
  IconButton,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function FolderList() {
  const queryClient = useQueryClient();
  const {
    data: folders,
    isPending,
    isError,
    error,
  } = useQuery<FolderType[]>({
    queryKey: ["folders"],
    queryFn: getFolders,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (variables: { id: string; folder: Partial<FolderType> }) =>
      updateFolder(variables.id, variables.folder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (folder: Partial<FolderType>) => createFolder(folder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  const router = useRouter();
  const [editFolderId, setEditFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState<string>("");

  const handleDoubleClick = (folderId: string, folderName: string) => {
    setEditFolderId(folderId);
    setNewFolderName(folderName);
  };

  const handleUpdateFolder = (folderId: string) => {
    const folder: Partial<FolderType> = { name: newFolderName };
    updateMutation.mutate({ id: folderId, folder });
  };
  const handleBlur = () => {
    setEditFolderId(null);
  };

  if (isPending) {
    return (
      <Stack alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (isError) {
    return <Typography>{error.message}</Typography>;
  }
  return (
    <>
      <Stack gap={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Typography>Folders</Typography>
          <IconButton sx={{color:"white"}}>
            <CreateNewFolder />
          </IconButton>
        </Box>

        <List sx={{ overflowY: "auto", maxHeight: "240px" }}>
          {folders?.map((folder) => (
            <ListItemButton
              key={folder.id}
              sx={{
                padding: "0",
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
              onClick={() => {
                router.push(`/${folder.id}`);
              }}
              onDoubleClick={() => handleDoubleClick(folder.id, folder.name)}
            >
              <ListItemIcon>
                <Folder sx={{ color: "white" }} />
              </ListItemIcon>
              {editFolderId === folder.id ? (
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdateFolder(folder.id);
                      handleBlur();
                    }
                  }}
                  autoFocus
                  fullWidth
                  sx={{ color: "white" }}
                />
              ) : (
                <ListItemText primary={folder.name} />
              )}
              <ListItemIcon onClick={() => deleteMutation.mutate(folder.id)}>
                <Delete sx={{ color: "white" }} />
              </ListItemIcon>
            </ListItemButton>
          ))}
        </List>
      </Stack>
    </>
  );
}

export default FolderList;
