import { Stack, Typography, Button } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { useMutation } from "@tanstack/react-query";
import { restoreNote } from "@/api/noteApi";

export default function RestoreNote({ noteId }: { noteId: string }) {
  const restoreMutation = useMutation({
    mutationFn: () => restoreNote(noteId),
  });

  const handleRestore = () => {
    restoreMutation.mutate();
    
  };
  return (
    <Stack
      bgcolor="black"
      color="white"
      width="70%"
      alignItems="center"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      height="100vh"
    >
      <RestoreIcon sx={{ fontSize: 70, fontWeight: "normal" }} />
      <Typography variant="h5" fontWeight={"bold"}>
        Restore Note
      </Typography>
      <Typography variant="body2" color="gray">
        Dont want to lose this note? Its not too late! Just click the Restore
        button and it will be added back to your list. Its that simple.
      </Typography>
      <Button
        variant="contained"
        sx={{ bgcolor: "blue" }}
        onClick={handleRestore}
      >
        Restore
      </Button>
    </Stack>
  );
}
