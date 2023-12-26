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
import DragHandleIcon from "@mui/icons-material/DragHandle";

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
  const [currentSortTarget, setCurrentSortTarget] = useState<number | null>(null);
  const dropTargetIndicator = useRef<HTMLDivElement | null>(null);

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  useEffect(() => {
    setSelected(Set());
  }, [songs]);

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

  const handleSortDragOver = (event: React.DragEvent<HTMLDivElement>, id: number) => {
    event.preventDefault();
    setCurrentSortTarget(id);
    if (dropTargetIndicator.current) {
      dropTargetIndicator.current.style.display = "block";
      dropTargetIndicator.current.style.top = event.currentTarget.offsetTop + "px";
    }
  };

  const handleSortDrop = (event: React.DragEvent<HTMLDivElement>, id: number) => {
    if (dropTargetIndicator.current) {
      dropTargetIndicator.current.style.display = "none";
    }
  };

  return (
    <>
      <div
        className="absolute border-t border-white border-solid w-full"
        ref={dropTargetIndicator}
      />
      <TableVirtuoso
        data={songs}
        components={{
          Scroller: TableContainer,
          TableBody,
          TableHead,
          Table: (props) => (
            <Table {...props} sx={{ tableLayout: "fixed", borderCollapse: "separate" }} />
          ),
          TableRow: (data) => (
            <TableRow
              {...data}
              hover
              draggable={!sortable}
              onDragStart={!sortable ? (e) => handleDragStart(e, data.item.id!) : undefined}
              onDragOver={sortable ? (e) => handleSortDragOver(e, data.item.id!) : undefined}
              onDragEnd={sortable ? (e) => handleSortDrop(e, data.item.id!) : undefined}
              onContextMenu={(e) => handleContextMenu(e, data.item.id!)}
              onClick={() => toggleSelect(data.item.id!)}
              className="relative"
            >
              <TableCell padding="checkbox">
                {sortable ? (
                  <div draggable={sortable} className="flex justify-center">
                    <DragHandleIcon />
                  </div>
                ) : (
                  <Checkbox
                    checked={selected.has(data.item.id!)}
                    onChange={(e) => handleSelect(e, data.item.id!)}
                  />
                )}
              </TableCell>
              {data.children}
            </TableRow>
          ),
        }}
        fixedHeaderContent={() => (
          <TableRow sx={{ backgroundColor: "background.paper" }}>
            <TableCell padding="checkbox">
              {!sortable && (
                <Checkbox
                  checked={selected.size === songs.length}
                  indeterminate={selected.size > 0 && selected.size < songs.length}
                  onChange={(e) =>
                    setSelected(e.target.checked ? Set(songs.map((song) => song.id!)) : Set())
                  }
                />
              )}
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
