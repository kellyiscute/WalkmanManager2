import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Map, List } from "immutable";
import { Database } from "@/db/database";
import fs from "node:fs/promises";
import { configContext } from "./ConfigContextProvider";
import musicMetadata from "music-metadata";
import { SongsSchema } from "@/db/schemas/songs.schema";
import { isFullfilledPromise } from "@utils";

type SongDetail = Omit<SongsSchema, "id"> & { id: number };

export interface LibraryContextValue {
  ready: boolean;
  getSongDetail: (key: number) => SongDetail | undefined;
  addSong: (path: string) => void;
  // updateSong: () => void;
  deleteSong: (id: number) => void;

  getPlaylists: () => string[];
  createPlaylist: typeof Database["instance"]["createPlaylist"];
  deletePlaylist: (idOrName: string | number) => Promise<void>;
}

export const libraryContext = createContext<LibraryContextValue>(null!);

async function diffSongs(libPath: string) {
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
    deleted,
    new: newSongs,
  };
}

async function loadSongMeta(path: string): Promise<MusicMetadata> {
  const meta = await musicMetadata.parseFile(path);
  return {
    title: meta.common.title,
    artist: meta.common.artist,
    album: meta.common.album,
    duration: meta.format.duration,
  };
}

async function loadPlaylists() {
  const allPlaylists = await Database.instance.playlists.toArray();
  return allPlaylists.map((playlist) => playlist.name);
}

async function loadSongs() {
  const allSongs = await Database.instance.songs.toArray();
  return Map(allSongs.map((song) => [song.id!, { ...song, id: song.id! }]));
}

const LibraryContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { config } = useContext(configContext);

  const [songs, setSongs] = useState(Map<number, SongDetail>());
  const [playlists, setPlaylists] = useState(List<string>());

  const [ready, setReady] = useState(false);

  async function initData(libPath: string) {
    // diff
    const diff = await diffSongs(libPath);
    const deletedSongRows = Database.instance.songs.filter((song) => diff.deleted.has(song.path));
    // update
    await Database.instance.playlistsSongs.bulkDelete(await deletedSongRows.keys() as number[]);
    await deletedSongRows.delete();
    const newSongs = await Promise.allSettled(
      Array.from(diff.new).map(async (path) => {
        const meta = await loadSongMeta(path);
        return {
          path,
          ...meta,
        };
      }),
    );
    await Database.instance.songs.bulkAdd(
      newSongs.filter(isFullfilledPromise).map((song) => song.value),
    );

    // playlists
    const playlists = await loadPlaylists();
    setPlaylists(List(playlists));

    // songs
    const songs = await loadSongs();
    setSongs(songs);
  }

  const getSongDetail = useCallback(
    (key: number) => {
      return songs.get(key);
    },
    [songs],
  );

  const getPlaylists = useCallback(() => {
    return playlists.toArray();
  }, [playlists]);

  const createPlaylist = useCallback(async (name: string) => {
    await Database.instance.createPlaylist(name);
    setPlaylists(playlists.push(name));
  }, []);

  const deletePlaylist = useCallback(async (idOrName: string | number) => {
    await Database.instance.deletePlaylist(idOrName);
    setPlaylists(playlists.filter((name) => name !== idOrName));
  }, []);

  const deleteSong = useCallback(async (id: number) => {
    await Database.instance.songs.delete(id);
    setSongs(songs.delete(id));
  }, []);

  const addSong = useCallback(async (path: string) => {
    const meta = await loadSongMeta(path);
    const song = {
      path,
      ...meta,
    };
    const id = await Database.instance.songs.add(song);
    setSongs(songs.set(id as number, { ...song, id: id as number }));
  }, []);

  useEffect(() => {
    if (config.libraryPath) {
      initData(config.libraryPath).then(() => setReady(true));
    }
  }, [config.libraryPath]);

  return (
    <libraryContext.Provider
      value={{
        ready,
        getSongDetail,
        getPlaylists,
        createPlaylist,
        deleteSong,
        deletePlaylist,
        addSong,
      }}
    >
      {children}
    </libraryContext.Provider>
  );
};

export default LibraryContextProvider;
