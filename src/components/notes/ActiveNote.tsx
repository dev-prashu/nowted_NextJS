"use client";
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  Input,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  styled,
  Typography,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNoteById, updateNote } from "@/api/noteApi";
import { Note } from "@/types/note";
import { useEffect, useRef, useState } from "react";
import Options from "./Dropdown";
import RestoreNote from "./RestoreNote";
import { FolderType } from "@/types/folder";

const InputArea = styled(Input)({
  "& .MuiInputBase-input": {
    color: "white",
    fontSize: "20px",
    height: "100%",
    overflow: "auto",
    padding:"10px",
    paddingBottom:"20px",
  },
});

export default function ActiveNote() {
  const { noteId, folderId }: { noteId: string; folderId: string } =
    useParams();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDeleted, setisDeleted] = useState<boolean>(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string>(folderId);
  const router = useRouter();

  const queryClient = useQueryClient();

  const folders = queryClient.getQueryData<FolderType[]>(["folders"]);
  const { data: note } = useQuery({
    queryKey: ["note", noteId],
    queryFn: async () => {
      return await getNoteById(noteId);
    },
  }) as { data: Note };
  const updateMutation = useMutation({
    mutationFn: (updatedNote: {
      title: string;
      content: string;
      folderId: string;
    }) => updateNote(noteId, updatedNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", folderId] });
    },
  });

  const handleUpdate = (updateTitle: string, updatedContent: string) => {
    setTitle(updateTitle);
    setContent(updatedContent);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      updateMutation.mutate({
        title: updateTitle,
        content: updatedContent,
        folderId: selectedFolderId,
      });
    }, 2000);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFolderChange = (event: SelectChangeEvent<string>) => {
    setSelectedFolderId(event.target.value as string);

    updateMutation.mutate({
      title: title,
      content: content,
      folderId: event.target.value as string,
    });
    router.push(`/${event.target.value}/${noteId}`);
  };

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSelectedFolderId(note.folderId);
    }
  }, [note, folderId]);
  if (note?.deletedAt || isDeleted) {
    return (
      <>
        <RestoreNote note={note} setisDeleted={setisDeleted} />
      </>
    );
  }

  return (
    <>
      <Stack
        height="100vh" // Changed to viewport height
        bgcolor="black"
        width="70%"
        color="white"
        gap={2}
        padding={2}
        sx={{
          overflow: "hidden", // Prevent outer container from scrolling
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Input
            defaultValue={title}
            sx={{
              color: "white",
              fontSize: "2.125rem",
              flexGrow: 1,
              mr: 2,
            }}
            onChange={(e) => handleUpdate(e.target.value, content)}
          />

          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
        <Box
          display="flex"
          alignItems={"center"}
          justifyContent={"space-between"}
          width="20%"
        >
          <Typography variant="body1">Date</Typography>
          <Typography variant="body1">
            {note?.createdAt && new Date(note.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
        <Divider
          sx={{ borderColor: "rgba(255, 255, 255, 0.1)", border: "solid 1px" }}
        />
        <Box
          display="flex"
          alignItems={"center"}
          gap={5}
          width="fit-content"
          justifyContent={"space-between"}
        >
          <Typography variant="body1">Folder</Typography>
          <FormControl variant="standard" fullWidth>
            <Select
              id="select-folder"
              value={selectedFolderId}
              onChange={handleFolderChange}
              sx={{ color: "white" }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    overflow: "auto",
                  },
                },
              }}
            >
              {folders?.map((folder) => (
                <MenuItem key={folder.id} value={folder.id}>
                  {folder.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
           
          }}
          padding={2}
        >
          <InputArea
            defaultValue={content}
            multiline
            fullWidth
            disableUnderline
            sx={{
              height: "100%",
              "& .MuiInputBase-input": {
                minHeight: "100%",
              },
             
            }}
            onChange={(e) => handleUpdate(title, e.target.value)}
          />
        </Box>
      </Stack>
      <Options
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        note={note}
        setisDeleted={setisDeleted}
      />
    </>
  );
}
