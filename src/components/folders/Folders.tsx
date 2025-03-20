import { getFolders } from "@/api/folderApi";
import { folder } from "@/types/folder";
import { CreateNewFolder, Delete, Folder } from "@mui/icons-material";
import {
  Stack,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function Folders() {
  const {
    data: folders,
    isPending,
    isError,
    error,
  } = useQuery<folder[]>({
    queryKey: ["folders"],
    queryFn: getFolders,
  });

  if (isPending) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Typography>{error.message}</Typography>;
  }
  return (
    <Stack>
      <Box display="flex" justifyContent="space-between" width="100%">
        <Typography>Folders</Typography>
        <CreateNewFolder />
      </Box>

      <List sx={{overflowY:"auto"}}>
        {folders?.map((folder) => (
          <ListItemButton key={folder.id} sx={{padding:"0"}}>
            <ListItemIcon>
              <Folder sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary={folder.name} />
            <ListItemIcon>
              <Delete sx={{ color: "white" }} />
            </ListItemIcon>
          </ListItemButton>
        ))}
      </List>
    </Stack>
  );
}

export default Folders;
