import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Checkbox,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { formatRelative } from 'date-fns';

export default function Notes({ notes, loadingNotes, mutate }) {
  const handleToggle = (_id, completed) => async () => {
    // Optimistic update
    mutate(
      (cacheData) => ({
        ...cacheData,
        data: cacheData.data.map((note) =>
          note._id === _id
            ? { ...note, completed: !completed, updatedAt: new Date() }
            : note
        ),
      }),
      false
    );

    try {
      // Save changes to the server
      const res = await fetch(`/api/notes/${_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: !completed,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error.message);
      }
    } catch (error) {
      // Append error to failed note
      mutate(
        (cacheData) => ({
          ...cacheData,
          data: notes.data.map((note) =>
            note._id === _id
              ? { ...note, errorMsg: "Couldn't update, please try again!" }
              : note
          ),
        }),
        false
      );
    }
  };

  const handleDelete = (_id, index) => async () => {
    // Optimistic update
    mutate(
      (cacheData) => ({
        ...cacheData,
        data: [
          ...cacheData.data.slice(0, index),
          ...cacheData.data.slice(index + 1),
        ],
      }),
      false
    );

    try {
      const res = await fetch(`/api/notes/${_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error.message);
      }
    } catch (error) {
      // Append error to failed note
      mutate(
        (cacheData) => ({
          ...cacheData,
          data: notes.data.map((note) =>
            note._id === _id
              ? { ...note, errorMsg: "Couldn't delete, please try again!" }
              : note
          ),
        }),
        false
      );
    }
  };

  if (loadingNotes) {
    return (
      <List>
        {Array.from(new Array(8)).map((e, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <ListItem key={i} dense button divider>
            <ListItemIcon>
              <Checkbox edge="start" disabled />
            </ListItemIcon>

            <ListItemText disableTypography>
              <Typography
                variant="caption"
                color="textSecondary"
                display="block"
              >
                <Skeleton />
              </Typography>

              <Typography variant="body1" display="block">
                <Skeleton />
              </Typography>
            </ListItemText>

            <ListItemSecondaryAction>
              <IconButton edge="end" disabled>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <List>
      {notes?.data.map((note, index) => {
        return (
          <ListItem
            key={note._id}
            role={undefined}
            dense
            button
            divider
            disabled={note.clientOnly}
            style={note.errorMsg ? { color: 'red' } : null}
            onClick={handleToggle(note._id, note.completed, index)}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={note.completed}
                disableRipple
                tabIndex={-1}
              />
            </ListItemIcon>

            <ListItemText id={note._id} disableTypography>
              <Typography
                variant="caption"
                color="textSecondary"
                display="block"
              >
                {note.updatedAt
                  ? formatRelative(new Date(note.updatedAt), new Date(), {
                      addSuffix: true,
                    })
                  : 'today at'}
              </Typography>

              <Typography variant="body1" display="block">
                {note.description}
              </Typography>

              <Typography variant="caption" color="error" display="block">
                {note.errorMsg}
              </Typography>
            </ListItemText>

            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={handleDelete(note._id, index)}
                disabled={note.clientOnly}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}
