import { Stack, Typography, Button } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreNote } from "@/api/noteApi";
import { Note } from "@/types/note";
import { useParams, useRouter } from "next/navigation";

export default function RestoreNote({
  note,
  setisDeleted,
}: {
  note: Note;
  setisDeleted: (value: boolean) => void;
}) {
  const router = useRouter();
  const {folderId}=useParams();
  const queryClient=useQueryClient();
  const restoreMutation = useMutation({
    mutationFn: () => restoreNote(note?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", folderId] });
    }
  });

  const handleRestore = () => {
    restoreMutation.mutate();
    setisDeleted(false);

    router.push(`/${note?.folderId}/${note?.id}`);
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

    >
      <RestoreIcon sx={{ fontSize: 70, fontWeight: "normal" }} />
      <Typography variant="h5" fontWeight={"bold"}>
        {`Restore  ${note?.title}`}
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
