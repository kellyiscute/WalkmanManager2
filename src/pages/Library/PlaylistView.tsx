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

export interface PlaylistViewProps {
  onPlaylistSelect?: (name?: string) => void;
}

const PlaylistView: FC<PlaylistViewProps> = ({ onPlaylistSelect }) => {
  const { playlists, createPlaylist } = useContext(libraryContext);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [editingPlaylist, setEditingPlaylist] = useState<string | null>(null);
  const [anchorPos, setAnchorPos] = useState<{ top: number; left: number } | null>(null);
  const menuContext = useRef<string | null>(null);

  function selectAllMedia() {
    setSelectedIndex(-1);
  }

  function handleCreatePlaylist() {
    setEditingPlaylist("");
  }

  function handleRenamePlaylist(name: string) {
    setEditingPlaylist(name);
    setAnchorPos(null);
  }

  function handleSelectPlaylist(name: string, index: number) {
    setSelectedIndex(index);
    onPlaylistSelect?.(name);
  }

  function handleRenamePlaylistConfirm(name: string) {
    setEditingPlaylist(null);
    if (editingPlaylist === "") {
      createPlaylist(name);
    }
  }

  return (
    <>
      <List className="absolute h-full w-full overflow-y-auto">
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
            onContextMenu={(e) => { 
              menuContext.current = playlist;
              setAnchorPos({ left: e.clientX, top: e.clientY });
            }}
            onClick={() => handleSelectPlaylist(playlist, index)}
          >
            {playlist}
          </ListItemButton>
        ))}
        <Divider />
        <Menu
          open={!!anchorPos}
          anchorReference="anchorPosition"
          anchorPosition={anchorPos ?? undefined}
          onClose={() => setAnchorPos(null)}
        >
          <MenuItem
            onClick={() => !!menuContext.current && handleRenamePlaylist(menuContext.current)}
          >
            <EditIcon className="mr-2" /> Rename
          </MenuItem>
          <MenuItem
          >
            <DeleteIcon className="mr-2" color="error" />{" "}
            <Typography sx={{ color: "error.main" }}>Delete</Typography>
          </MenuItem>
        </Menu>
      </List>
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
