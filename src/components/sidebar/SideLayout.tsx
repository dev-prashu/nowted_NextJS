import React from "react";
import Topbar from "./Topbar";
import RecentNotes from "./RecentNotes";
import { Stack } from "@mui/material";
import Folders from "../folders/FolderList";
import More from "./More";

function SideLayout() {
  return (
    <Stack
      width="25%"
      height="100%"
      paddingX={2}
      display="flex"
      flexDirection="column"
      bgcolor="black"
      color="white"
    >
      <Topbar />
      <RecentNotes />
      <Folders />
      <More />
    </Stack>
  );
}

export default SideLayout;
