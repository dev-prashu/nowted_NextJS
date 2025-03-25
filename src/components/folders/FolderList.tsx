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
import React, { useEffect, useState } from "react";

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
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null); 

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

  const handleCreateFolder = () => {
    const folder: Partial<FolderType> = { name: newFolderName };
    createMutation.mutate(folder);
    setIsCreatingFolder(false);
  };

  
  useEffect(() => {
    if (folders && folders.length > 0) {
      router.push(`/${folders[0].id}`);
    }
  }, [folders, router]);

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
      <Stack spacing={1}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Typography>Folders</Typography>
          <IconButton
            sx={{ color: "white" }}
            onClick={() => setIsCreatingFolder((prev) => !prev)}
          >
            <CreateNewFolder />
          </IconButton>
        </Box>
        {isCreatingFolder && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateFolder();
                }
              }}
              autoFocus
              fullWidth
              sx={{
                color: "white",
                marginBottom: "10px",
              }}
            />
          </Box>
        )}

        <List sx={{ overflowY: "auto", maxHeight: "240px", gap: "10px" }}>
          {folders?.map((folder) => (
            <ListItemButton
              key={folder.id}
              sx={{
                padding: "0",
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                backgroundColor: selectedFolderId === folder.id ? "blue" : "transparent"
              }}
              onClick={() => {
                setSelectedFolderId(folder.id); 
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
