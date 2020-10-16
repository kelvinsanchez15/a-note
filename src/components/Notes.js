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
import { formatRelative } from 'date-fns';

export default function Notes({ notes, mutate }) {
  const handleToggle = (_id, completed) => async () => {
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

    mutate();
  };

  const handleDelete = (_id) => async () => {
    const res = await fetch(`/api/notes/${_id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error.message);
    }

    mutate();
  };

  return (
    <List>
      {notes?.data.map((note) => {
        return (
          <ListItem
            key={note._id}
            role={undefined}
            dense
            button
            divider
            disabled={note.clientOnly}
            style={note.errorMsg ? { color: 'red' } : null}
            onClick={handleToggle(note._id, note.completed)}
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
                {note.errorMsg || note.description}
              </Typography>
            </ListItemText>

            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={handleDelete(note._id)}
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
