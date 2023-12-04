import Dexie, { Table } from "dexie";
import { PlaylistsSchema } from "./schemas/playlists.schema";
import { SongsSchema } from "./schemas/songs.schema";
import { PlaylistSongsSchema } from "./schemas/playlist-songs.schema";

export class Database extends Dexie {
  songs!: Table<SongsSchema>;
  playlists!: Table<PlaylistsSchema>;
  playlistsSongs!: Table<PlaylistSongsSchema>;

  private static _instance: Database;

  static get instance(): Database {
    if (!Database._instance) {
      Database._instance = new Database();
    }
    return Database._instance;
  }

  constructor() {
    super("main");
    this.version(1).stores({
      songs: "++id, title, artist, album, duration, path",
      playlists: "++id, name",
      playlistsSongs: "++id, playlistId, songId",
    });
  }
}
