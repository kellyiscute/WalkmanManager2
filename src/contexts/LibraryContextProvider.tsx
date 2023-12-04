import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { Map, List } from "immutable";
import { Database } from "@/db/database";
import fs from "node:fs/promises";
import { configContext } from "./ConfigContextProvider";

export interface LibraryContextValue {
  ready: boolean;
  loadProgress: number;
  getSongDetail: () => void;
  addSong: () => void;
  updateSong: () => void;
  deleteSong: () => void;

  getPlaylists: () => void;
  createPlaylist: () => void;
  updatePlaylist: () => void;
  deletePlaylist: () => void;
}

export const libraryContext = createContext<LibraryContextValue>(null!);

async function loadData(libPath: string) {
  const allSongs = await Database.instance.songs.toArray();
  const songPaths = new Set(allSongs.map((song) => song.path));
  const deleted = new Set<string>();
  const newSongs = new Set<string>();

  const files = await fs.readdir(libPath);
  for (const file of files) {
    if (songPaths.has(file)) {
      deleted.add(file);
    } else {
      newSongs.add(file);
    }
  }

  return {
    diff: {
      deleted,
      new: newSongs,
    },
  };
}

async function loadPlaylists() {
  const allPlaylists = await Database.instance.playlists.toArray();
  const playlistDetails = new Map<string, number>();
  allPlaylists.forEach((playlist) => {
    playlistDetails.set(playlist.name, playlist.id);
  });
}

const LibraryContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { config } = useContext(configContext);

  const [songs, setSongs] = useState(Map<number, unknown>());
  const [playlists, setPlaylists] = useState(List<string>());
  const [playlistDetails, setPlaylistDetails] = useState(Map<string, number>());

  const [ready, setReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);


  useEffect(() => {
  }, []);

  return (
    <libraryContext.Provider value={{}}>
      {children}
    </libraryContext.Provider>
  );
};

export default LibraryContextProvider;
