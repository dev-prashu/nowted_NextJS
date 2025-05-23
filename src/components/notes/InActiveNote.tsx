import { Stack, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

export default function InActiveNote() {
  return (
    <>
      <Stack
        bgcolor="black"
        color="white"
        width="70%"
        gap={1}
        alignItems="center"
        justifyContent="center"
        flexDirection={"column"}
      >
        <DescriptionIcon sx={{ fontSize: 50 }} />
        <Typography variant="h5" fontWeight="bold">Select a note to view</Typography>
        <Typography variant="body1" color="gray" textAlign="center">
          Choose a note from the list on the left to view its contents, or
          create a new note to add to your collection.
        </Typography>
      </Stack>
    </>
  );
}
