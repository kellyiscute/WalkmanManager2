import Dexie, { Table } from "dexie";
import { PlaylistsSchema } from "./schemas/playlists.schema";
import { SongsSchema } from "./schemas/songs.schema";
import { PlaylistSongsSchema } from "./schemas/playlist-songs.schema";

export class Database extends Dexie {
  songs!: Table<SongsSchema, number>;
  playlists!: Table<PlaylistsSchema, number>;
  playlistsSongs!: Table<PlaylistSongsSchema, number>;

  private static _instance: Database;

  static get instance(): Database {
    if (!Database._instance) {
      Database._instance = new Database();
    }
    return Database._instance;
  }

  async deletePlaylist(id: number): Promise<void>;
  async deletePlaylist(name: string): Promise<void>;
  async deletePlaylist(idOrName: string | number): Promise<void>;
  async deletePlaylist(idOrName: string | number): Promise<void> {
    if (typeof idOrName === "number") {
      await this.playlistsSongs.where("playlistId").equals(idOrName).delete();
      await this.playlists.where("id").equals(idOrName).delete();
    } else {
      const playlist = await this.playlists.where("id").equals(idOrName).first();
      if (!playlist) return;
      await this.playlistsSongs.where("playlistId").equals(playlist.id!).delete();
      await this.playlists.delete(playlist.id!);
    }
  }

  async createPlaylist(name: string): Promise<void> {
    await this.playlists.add({ name });
  }

  async renamePlaylist(name: string, newName: string): Promise<void>;
  async renamePlaylist(id: number, newName: string): Promise<void>;
  async renamePlaylist(idOrName: number | string, newName: string): Promise<void>
  async renamePlaylist(idOrName: number | string, newName: string): Promise<void> {
    if (typeof idOrName === "number") {
      await this.playlists.where("id").equals(idOrName).modify({ name: newName });
    } else {
      await this.playlists.where("name").equals(idOrName).modify({ name: newName });
    }
  }

  async updatePlaylist(id: number, songs: number[]) {
    await this.playlistsSongs.where("playlistId").equals(id).delete();
    await this.playlistsSongs.bulkAdd(
      songs.map((songId, index) => ({ playlistId: id, songId, order: index })),
    );
  }

  async getPlaylistSongs(name: string): Promise<number[]>;
  async getPlaylistSongs(id: number): Promise<number[]>;
  async getPlaylistSongs(idOrName: string | number): Promise<number[]> {
    let playlistId = idOrName;
    if (typeof idOrName === "string") {
      const pl = await this.playlists.where("name").equals(idOrName).first();
      if (!pl) throw new Error("Playlist not found");
      playlistId = pl.id!;
    }

    const songs = await this.playlistsSongs.where("playlistId").equals(playlistId).sortBy("order");
    return songs.map((s) => s.songId);
  }

  async deleteSong(id: number) {
    await this.playlistsSongs.where("songId").equals(id).delete();
    await this.songs.where("id").equals(id).delete();
  }

  async removeSongFromPlaylist(songId: number, playlistId: number) {
    await this.playlistsSongs
      .where("songId")
      .equals(songId)
      .and((s) => s.playlistId === playlistId)
      .delete();
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
