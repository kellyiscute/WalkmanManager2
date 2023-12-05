import {
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { FC, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export interface SongsInfo {
  id: number;
  name: string;
  artist: string;
  path: string;
}

export interface SongsViewArgs {
  SongsInfos: SongsInfo[];
  onDeleteSong?: (songId: number) => void;
  onRemoveFromPlaylist?: (songId: number) => void;
}

const SongsView: FC<SongsViewArgs> = ({ SongsInfos, onDeleteSong, onRemoveFromPlaylist }) => {
  const { t } = useTranslation("common");
  const contextMenuContext = useRef<number | null>(null);

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    songId: number,
  ) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
    contextMenuContext.current = songId;
  };

  const handleDelete = () => {
    // call onDeleteSong(...) when onDeleteSong is not null (condition && )
    onDeleteSong && onDeleteSong(contextMenuContext.current!);
    closeContextMenu();
    console.log("Delete");
  };

  const handleRemoveFromPlaylist = () => {
    onRemoveFromPlaylist && onRemoveFromPlaylist(contextMenuContext.current!);
    closeContextMenu();
    console.log("Remove");
  };

  const closeContextMenu = () => {
    setContextMenu(null);
    contextMenuContext.current = null;
  };

  return (
    <div onClick={closeContextMenu}>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">{t("storage-id")}</TableCell>
              <TableCell align="left">{t("name")}</TableCell>
              <TableCell align="left">{t("artist")}</TableCell>
              <TableCell align="left">{t("path")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {SongsInfos.map((row) => (
              <TableRow
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                key={row.name}
                onContextMenu={(e) => handleContextMenu(e, row.id)}
              >
                <TableCell align="left">{row.id}</TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.artist}</TableCell>
                <TableCell align="left">{row.path}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        open={contextMenu !== null}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
        }
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem onClick={handleRemoveFromPlaylist}>Remove from Playlist</MenuItem>
      </Menu>
    </div>
  );
};

export default SongsView;
