import { SongsSchema } from "@/db/schemas/songs.schema";
import {
  Checkbox,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Set } from "immutable";
import React, { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TableVirtuoso } from "react-virtuoso";

export interface SongsViewArgs {
  songs: SongsSchema[];
  onDeleteSong?: (songId: number) => void;
  onRemoveFromPlaylist?: (songId: number) => void;
  sortable?: boolean;
}

const SongsView: FC<SongsViewArgs> = ({
  songs,
  onDeleteSong,
  onRemoveFromPlaylist,
  sortable = false,
}) => {
  const { t } = useTranslation("common");
  const contextMenuContext = useRef<number | null>(null);
  const [selected, setSelected] = useState<Set<number>>(Set());

  useEffect(() => {
    setSelected(Set());
  }, [songs]);

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

  const handleDragStart = (event: React.DragEvent<HTMLTableRowElement>, songId: number) => {
    if (selected.size > 0) {
      event.dataTransfer.setData("songDragMultiple", "true");
      event.dataTransfer.setData("songs", JSON.stringify(Array.from(selected)));
    } else {
      event.dataTransfer.setData("song", songId.toString());
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    console.log(id, e.target.checked);
    setSelected(e.target.checked ? selected.add(id) : selected.delete(id));
  };

  const toggleSelect = (id: number) => {
    setSelected(selected.has(id) ? selected.delete(id) : selected.add(id));
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
            <TableRow
              hover
              draggable
              onDragStart={(e) => handleDragStart(e, data.item.id!)}
              {...data}
              onContextMenu={(e) => handleContextMenu(e, data.item.id!)}
              onClick={() => toggleSelect(data.item.id!)}
            >
              <TableCell padding="checkbox">
                {sortable ? null : (
                  <Checkbox
                    checked={selected.has(data.item.id!)}
                    onChange={(e) => handleSelect(e, data.item.id!)}
                  />
                )}
              </TableCell>
              {data.children}
            </TableRow>
          ),
          TableBody,
        }}
        fixedHeaderContent={() => (
          <TableRow sx={{ backgroundColor: "background.paper" }}>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selected.size === songs.length}
                indeterminate={selected.size > 0 && selected.size < songs.length}
                onChange={(e) =>
                  setSelected(e.target.checked ? Set(songs.map((song) => song.id!)) : Set())
                }
              />
            </TableCell>
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
