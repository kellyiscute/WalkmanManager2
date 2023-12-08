import { libraryContext } from "@/contexts/LibraryContextProvider";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export interface PlaylistEditProps {
  name?: string;
  open: boolean;
  onConfirm?: (name: string) => void;
  onCancel?: () => void;
}

const PlaylistEdit: FC<PlaylistEditProps> = ({ name, open, onCancel, onConfirm }) => {
  const { t } = useTranslation("common");
  const { playlists } = useContext(libraryContext);

  const [playlistName, setPlaylistName] = useState(name ?? "");

  const playlistSet = useMemo(() => new Set(playlists), [playlists]);
  const errorText = useMemo(() => {
    if (!playlistName) {
      return t("field-required");
    }
    if (playlistSet.has(playlistName)) {
      return t("playlist-exists");
    }
    return "";
  }, [playlistSet, playlistName]);
  const error = useMemo(() => !playlistName || playlistSet.has(playlistName), [playlistName]);

  useEffect(() => {
    setPlaylistName(name ?? "");
  }, [open]);

  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogTitle>
        <Typography variant="subtitle1">
          {name ? t("rename-playlist") : t("create-playlist")}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          variant="standard"
          required
          error={error}
          helperText={errorText}
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          label={t("playlist-name")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t("cancel")}</Button>
        <Button disabled={error} onClick={() => onConfirm && onConfirm(playlistName)}>
          {t("done")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlaylistEdit;
