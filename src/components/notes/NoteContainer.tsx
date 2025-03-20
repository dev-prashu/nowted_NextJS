import { Stack } from '@mui/material'
import React from 'react'
import NoteList from './NoteList'

function NoteContainer() {
  return (
    <Stack height="100vh" bgcolor="#1C1C1C" width="25%" padding={2} gap={2} overflow="scroll">
      
      <NoteList/>
        
    </Stack>
  )
}

export default NoteContainer