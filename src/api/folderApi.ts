import axios from "axios";
import { FolderType } from "../types/folder";

// const API_URL: string = "https://nowted-server.remotestate.com";
const API_URL:string="http://localhost:3000/api"


export const getFolders = async (): Promise<FolderType[]> => {
  try {
    const response = await axios.get(`${API_URL}/folders`);
    return response.data.folders;
  } catch (err) {
    throw new Error(`Unable to fetch folders : ${err}`);
  }
};

export const createFolder = async (folder: Partial<FolderType>) => {
  try {
    await axios.post(`${API_URL}/folders`, folder);
  } catch (err) {
    throw new Error(`Unable to create folder : ${err}`);
  }
};

export const updateFolder = async (id: string, folder: Partial<FolderType>) => {
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
