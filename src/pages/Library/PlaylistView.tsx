import PlaylistEdit from "@/components/PlaylistEdit";
import { libraryContext } from "@/contexts/LibraryContextProvider";
import { Add } from "@mui/icons-material";
import {
  List,
  ListSubheader,
  ListItem,
  ListItemButton,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { FC, useContext, useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { backgroundTaskContext } from "@/contexts/BackgroundTaskContextProvider";
import { Database } from "@/db/database";

export interface PlaylistViewProps {
  onPlaylistSelect?: (name?: string) => void;
}

const PlaylistView: FC<PlaylistViewProps> = ({ onPlaylistSelect }) => {
  const { playlists, createPlaylist, renamePlaylist, deletePlaylist } = useContext(libraryContext);
  const { addTask } = useContext(backgroundTaskContext);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [editingPlaylist, setEditingPlaylist] = useState<string | null>(null);
  const [anchorPos, setAnchorPos] = useState<{ top: number; left: number } | null>(null);
  const [dragHl, setDragHl] = useState<number | null>(null);
  const menuContext = useRef<{ name: string; index: number } | null>(null);

  function selectAllMedia() {
    setSelectedIndex(-1);
    onPlaylistSelect?.();
  }

  function handleCreatePlaylist() {
    setEditingPlaylist("");
  }

  function handleRenamePlaylist(name: string) {
    setAnchorPos(null);
    setEditingPlaylist(name);
  }

  function handleSelectPlaylist(name: string, index: number) {
    setSelectedIndex(index);
    onPlaylistSelect?.(name);
  }

  function handleRenamePlaylistConfirm(name: string) {
    setEditingPlaylist(null);
    if (editingPlaylist === "") {
      createPlaylist(name);
    } else if (editingPlaylist != null) {
      renamePlaylist(editingPlaylist, name);
    }
  }

  function handleDeletePlaylist(name: string, index: number) {
    if (index === selectedIndex) {
      selectAllMedia();
    } else if (index < selectedIndex) {
      setSelectedIndex(selectedIndex - 1);
    }

    addTask("delete playlist", () => deletePlaylist(name));
    setAnchorPos(null);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>, index: number) {
    event.preventDefault();
    setDragHl(index);
  };

  async function handleDrop(event: React.DragEvent<HTMLDivElement>, playlistName: string) {
    event.preventDefault();
    setDragHl(null);
    const isMultiple = event.dataTransfer.getData("songDragMultiple") === "true";
    if (isMultiple) {
      const songIds = JSON.parse(event.dataTransfer.getData("songs")) as number[];
      for (const songId of songIds) {
        await Database.instance.addSongToPlaylist(songId, playlistName);
      }
    } else {
      const songId = event.dataTransfer.getData("song");
      await Database.instance.addSongToPlaylist(parseInt(songId), playlistName);
    }
  };

  return (
    <>
      <List className="absolute h-full w-full overflow-y-auto pt-0">
        <ListSubheader>Your Library</ListSubheader>
        <ListItem disablePadding>
          <ListItemButton selected={selectedIndex === -1} onClick={selectAllMedia}>
            All Media
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListSubheader>
          <div className="flex justify-between align-center">
            <span>Playlists</span>
            <span>
              <IconButton
                className="aspect-square"
                size="small"
                style={{ flex: "none" }}
                onClick={handleCreatePlaylist}
              >
                <Add fontSize="small" />
              </IconButton>
            </span>
          </div>
        </ListSubheader>
        <Divider />
        {playlists.map((playlist, index) => (
          <ListItemButton
            key={playlist}
            selected={index === selectedIndex}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={() => setDragHl(null)}
            onDrop={(e) => handleDrop(e, playlist)}
            onContextMenu={(e) => {
              menuContext.current = { name: playlist, index };
              setAnchorPos({ left: e.clientX, top: e.clientY });
            }}
            style={{ backgroundColor: index === dragHl ? "rgba(255,255,255,0.2)" : undefined }}
            onClick={() => handleSelectPlaylist(playlist, index)}
          >
            {playlist}
          </ListItemButton>
        ))}
        <Divider />
      </List>

      <Menu
        open={!!anchorPos}
        anchorReference="anchorPosition"
        anchorPosition={anchorPos ?? undefined}
        onClose={() => setAnchorPos(null)}
      >
        <MenuItem
          onClick={() => !!menuContext.current && handleRenamePlaylist(menuContext.current.name)}
        >
          <EditIcon className="mr-2" /> Rename
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleDeletePlaylist(menuContext.current!.name, menuContext.current!.index)
          }
        >
          <DeleteIcon className="mr-2" color="error" />{" "}
          <Typography sx={{ color: "error.main" }}>Delete</Typography>
        </MenuItem>
      </Menu>

      <PlaylistEdit
        open={editingPlaylist != null}
        name={editingPlaylist!}
        onConfirm={handleRenamePlaylistConfirm}
        onCancel={() => setEditingPlaylist(null)}
      />
    </>
  );
};

export default PlaylistView;
