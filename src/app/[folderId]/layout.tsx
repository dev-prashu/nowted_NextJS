import NoteContainer from "@/components/notes/NoteContainer";
import { Stack } from "@mui/material";

export default function FolderNotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Stack height="100%" width="75%" direction="row" display="flex" overflow="hidden">
        <NoteContainer />
        {children}
      </Stack>
    </>
  );
}
