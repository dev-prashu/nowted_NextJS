import React from "react";
import Topbar from "./Topbar";
import RecentNotes from "./RecentNotes";
import { Stack } from "@mui/material";
import Folders from "../folders/Folders";
import More from "./More";

function SideLayout() {
  return (
    <Stack
      width="25%"
      padding={2}
      gap={2}
      display="flex"
      flexDirection="column"
      rowGap={2}
    >
      <Topbar />
      <RecentNotes />
      <Folders />
      <More />
    </Stack>
  );
}

export default SideLayout;
