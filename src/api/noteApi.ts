import axios from "axios";
import {Note} from "../types/note"
const API_URL: string = "https://nowted-server.remotestate.com";


//Fetch Recent Notes
export const getRecentNotes = async (): Promise<Note[]> => {
  try {
    const response = await axios.get(`${API_URL}/notes/recent`);
    return response.data.recentNotes;
  } catch (err) {
    throw new Error(`Unable to fetch recent notes : ${err}`);
  }
};

//Fetch all notes
export const getNotes = async (): Promise<Note[]> => {
  try {
    const response = await axios.get(`${API_URL}/notes`);
    return response.data.notes;
  } catch (err) {
    throw new Error(`Unable to fetch notes : ${err}`);
  }
};

//Create a note
export const createNote = async (note: Partial<Note>) => {
  try {
    await axios.post(`${API_URL}/notes`, note);
  } catch (err) {
    throw new Error(`Unable to create note : ${err}`);
  }
};

//Update a note by Id
export const updateNote = async (id: string, note: Partial<Note>) => {
  try {
    await axios.patch(`${API_URL}/notes/${id}`, note);
  } catch (err) {
    throw new Error(`Unable to update note : ${err}`);
  }
};

//Delete a note by Id
export const deleteNote = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/notes/${id}`);
  } catch (err) {
    throw new Error(`Unable to delete note : ${err}`);
  }
};

//Restore a note by Id
export const restoreNote = async (id: string) => {
  try {
    await axios.post(`${API_URL}/notes/${id}`);
  } catch (err) {
    throw new Error(`Unable to restore a note : ${err}`);
  }
};

//Search Note
export const searchQuery = async (query: string) => {
  try {
    await axios.get(`${API_URL}/notes?search=${query}`);
  } catch (err) {
    throw new Error(`Unable to search note : ${err}`);
  }
};
