"use client";

import { getNotes } from "@/api/noteApi";
import { Note } from "@/types/note";
import { pageParams } from "@/types/pageParams";
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

function NoteList() {
  const { folderId }: { folderId: string } = useParams();
  const router = useRouter();
  const limit = 10;

  const fetchNotes = async ({ pageParam = 1 }): Promise<Note[]> => {
    const param: pageParams = { page: pageParam, limit };
    if (folderId === "favorite") {
      param.favorite = true;
    } else if (folderId === "trash") {
      param.deleted = true;
    } else if (folderId === "archive") {
      param.archived = true;
    } else {
      param.folderId = folderId;
    }

    const response = await getNotes(param);
    return response;
  };

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    {
      queryKey: ["notes", folderId],
      queryFn: fetchNotes,
      initialPageParam:1,
      getNextPageParam:(lastPage,allPages)=> lastPage.length<10 ? undefined : allPages.length+1,
    }
  );

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const notes = data?.pages.flat(); 

  if (isLoading) {
    return (
      <Stack height="100vh" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (notes?.length === 0) {
    return (
      <Stack height="100vh" alignItems="center" justifyContent="center">
        <Typography variant="h5" fontWeight="bold" color="white">
          No Notes Found
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={2} width="100%">
      <Typography variant="h5" fontWeight="bold" color="white">
        {folderId === "favorite"
          ? "Favorites"
          : folderId === "trash"
          ? "Trash"
          : folderId === "archive"
          ? "Archived"
          : notes?.[0]?.folder?.name}
      </Typography>

      {notes?.length ? (
        notes.map((note) => (
          <Box
            key={`${note.id}`}
            sx={{
              padding: 2,
              borderRadius: 2,
              bgcolor: "black",
              color: "white",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              cursor: "pointer",
            }}
            onClick={() => {
              router.push(`/${folderId}/${note.id}`);
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {note.title}
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">
                {new Date(note.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" fontStyle="italic">
                {note.preview?.slice(0, 20) || "No preview"}...
              </Typography>
            </Box>
          </Box>
        ))
      ) : (
        <Typography color="white">No notes available.</Typography>
      )}

      {hasNextPage && (
        <Button
          variant="contained"
          onClick={loadMore}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </Button>
      )}
    </Stack>
  );
}

export default NoteList;