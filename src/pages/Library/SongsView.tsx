import { SongsSchema } from "@/db/schemas/songs.schema";
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
import { TableVirtuoso } from "react-virtuoso";

export interface SongsViewArgs {
  songs: SongsSchema[];
  onDeleteSong?: (songId: number) => void;
  onRemoveFromPlaylist?: (songId: number) => void;
}

const SongsView: FC<SongsViewArgs> = ({ songs, onDeleteSong, onRemoveFromPlaylist }) => {
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
    <>
      <TableVirtuoso
        data={songs}
        components={{
          Scroller: TableContainer,
          Table: (props) => (
            <Table {...props} sx={{ tableLayout: "fixed", borderCollapse: "separate" }} />
          ),
          TableHead,
          TableRow: (data) => (
            <TableRow hover {...data} onContextMenu={(e) => handleContextMenu(e, data.item.id!)} />
          ),
          TableBody,
        }}
        fixedHeaderContent={() => (
          <TableRow sx={{ backgroundColor: "background.paper" }}>
            <TableCell align="left">{t("name")}</TableCell>
            <TableCell align="left">{t("artist")}</TableCell>
            <TableCell align="left">{t("album")}</TableCell>
          </TableRow>
        )}
        itemContent={(_, data) => (
          <>
            <TableCell align="left">{data.title}</TableCell>
            <TableCell align="left">{data.artist}</TableCell>
            <TableCell align="left">{data.album}</TableCell>
          </>
        )}
      />

      <Menu
        open={contextMenu !== null}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
        }
        onClose={closeContextMenu}
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem onClick={handleRemoveFromPlaylist}>Remove from Playlist</MenuItem>
      </Menu>
    </>
  );
};

export default SongsView;
