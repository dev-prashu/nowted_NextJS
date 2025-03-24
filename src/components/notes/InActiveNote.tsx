import { Stack, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

export default function InActiveNote() {
  return (
    <>
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
        <DescriptionIcon sx={{ fontSize: 50 }} />
        <Typography variant="h5" fontWeight="bold">Select a note to view</Typography>
        <Typography variant="body1" color="gray">
          Choose a note from the list on the left to view its contents, or
          create a new note to add to your collection.
        </Typography>
      </Stack>
    </>
  );
}
