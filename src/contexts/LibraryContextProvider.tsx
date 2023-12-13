import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Map, List } from "immutable";
import { Database } from "@/db/database";
import fs from "node:fs/promises";
import { configContext } from "./ConfigContextProvider";
import musicMetadata from "music-metadata";
import { SongsSchema } from "@/db/schemas/songs.schema";
import { isFullfilledPromise } from "@utils";
import path from "node:path";

type SongDetail = Omit<SongsSchema, "id"> & { id: number };

export interface LibraryContextValue {
  ready: boolean;
  getSongDetail: (key: number) => SongDetail | undefined;
  addSong: (path: string) => void;
  // updateSong: () => void;
  deleteSong: (id: number) => void;

  getPlaylists: () => string[];
  createPlaylist: (typeof Database)["instance"]["createPlaylist"];
  deletePlaylist: (idOrName: string | number) => Promise<void>;
  renamePlaylist: (idOrName: string | number, newName: string) => Promise<void>;

  playlists: string[];
  songs: SongDetail[];
  songIdMap: Map<number, SongDetail>;
}

export const libraryContext = createContext<LibraryContextValue>(null!);

async function diffSongs(libPath: string) {
  const allSongs = await Database.instance.songs.toArray();
  const songPaths = new Set(allSongs.map((song) => song.path));
  const deleted = new Set<string>();
  const newSongs = new Set<string>();

  const files = new Set(await fs.readdir(libPath));
  for (const file of files) {
    if (!songPaths.has(file)) {
      newSongs.add(file);
    }
  }

  for (const song of allSongs) {
    if (!files.has(song.path)) {
      deleted.add(song.path);
    }
  }

  return {
    deleted,
    new: newSongs,
  };
}

async function loadSongMeta(libPath: string, filename: string): Promise<MusicMetadata> {
  const meta = await musicMetadata.parseFile(path.join(libPath, filename));
  return {
    title: meta.common.title,
    artist: meta.common.artist,
    album: meta.common.album,
    duration: meta.format.duration,
  };
}

async function loadPlaylists(): Promise<[number, string][]> {
  const allPlaylists = await Database.instance.playlists.toArray();
  return allPlaylists.map((playlist) => [playlist.id!, playlist.name]);
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
    await Database.instance.playlistsSongs.bulkDelete((await deletedSongRows.keys()) as number[]);
    await deletedSongRows.delete();
    const newSongs = await Promise.allSettled(
      Array.from(diff.new).map(async (path) => {
        const meta = await loadSongMeta(libPath, path);
        return {
          path,
          ...meta,
        };
      }),
    );
    await Database.instance.songs.bulkAdd(
      newSongs.filter(isFullfilledPromise).map((song) => song.value),
      undefined,
      { allKeys: true },
    );

    // playlists
    const playlists = await loadPlaylists();
    setPlaylists(List(playlists.map(([, name]) => name)));

    // songs
    const songs = await loadSongs();
    setSongs(songs);
  }

  useEffect(() => {
    if (config.libraryPath) {
      initData(config.libraryPath).then(() => setReady(true));
    }
  }, [config.libraryPath]);

  const getSongDetail = useCallback(
    (key: number) => {
      return songs.get(key);
    },
    [songs],
  );

  const getPlaylists = useCallback(() => {
    return playlists.toArray();
  }, [playlists]);

  const createPlaylist = useCallback(
    async (name: string) => {
      await Database.instance.createPlaylist(name);
      const newPlaylists = playlists.push(name);
      setPlaylists(newPlaylists);
    },
    [playlists],
  );

  const deletePlaylist = useCallback(
    async (idOrName: string | number) => {
      await Database.instance.deletePlaylist(idOrName);
      setPlaylists(playlists.filter((name) => name !== idOrName));
    },
    [playlists],
  );

  const deleteSong = useCallback(async (id: number) => {
    await Database.instance.songs.delete(id);
    setSongs(songs.delete(id));
  }, []);

  const renamePlaylist = useCallback(
    async (idOrName: string | number, newName: string) => {
      await Database.instance.renamePlaylist(idOrName, newName);
      const index = playlists.findIndex((name) => name === idOrName);
      const newPlaylists = playlists.set(index, newName);
      setPlaylists(newPlaylists);
    },
    [playlists],
  );

  const addSong = useCallback(async (path: string) => {
    const meta = await loadSongMeta(config.libraryPath!, path);
    const song = {
      path,
      ...meta,
    };
    const id = await Database.instance.songs.add(song);
    setSongs(songs.set(id as number, { ...song, id: id as number }));
  }, []);

  const playlistList = useMemo(() => playlists.toArray(), [playlists]);
  const songList = useMemo(() => songs.valueSeq().toArray(), [songs]);

  return (
    <libraryContext.Provider
      value={{
        ready,
        getSongDetail,
        getPlaylists,
        createPlaylist,
        deleteSong,
        deletePlaylist,
        renamePlaylist,
        addSong,
        playlists: playlistList,
        songs: songList,
        songIdMap: songs,
      }}
    >
      {children}
    </libraryContext.Provider>
  );
};

export default LibraryContextProvider;
