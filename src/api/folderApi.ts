import axios from "axios";
import { folder } from "../types/folder";

const API_URL: string = "https://nowted-server.remotestate.com";

export const getFolders = async (): Promise<folder[]> => {
  try {
    const response = await axios.get(`${API_URL}/folders`);
    return response.data.folders;
  } catch (err) {
    throw new Error(`Unable to fetch folders : ${err}`);
  }
};

export const createFolder = async (folder: Partial<folder>) => {
  try {
    await axios.post(`${API_URL}/folders`, folder);
  } catch (err) {
    throw new Error(`Unable to create folder : ${err}`);
  }
};

export const updateFolder = async (id: string, folder: Partial<folder>) => {
  try {
    await axios.patch(`${API_URL}/folders/${id}`, folder);
  } catch (err) {
    throw new Error(`Unable to update folder : ${err}`);
  }
};

export const deleteFolder = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/folders/${id}`);
  } catch (err) {
    throw new Error(`Unable to delete folder : ${err}`);
  }
};
