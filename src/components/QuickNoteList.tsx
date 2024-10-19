import { Paper, Text, Stack, Group, ActionIcon } from '@mantine/core';
import { QuickNote } from '../types';
import { IconTrash } from '@tabler/icons-react';

interface QuickNoteListProps {
  notes: QuickNote[];
  onDeleteNote: (id: string) => void;
}

export default function QuickNoteList({ notes, onDeleteNote }: QuickNoteListProps) {
  return (
    <Paper shadow="sm" p="md" withBorder>
      <Text size="lg" weight={700} mb="md">Notas Rápidas</Text>
      {notes.length === 0 ? (
        <Text color="dimmed">No hay notas rápidas.</Text>
      ) : (
        <Stack spacing="xs">
          {notes.map((note) => (
            <Group key={note.id} position="apart" noWrap>
              <Text size="sm">{note.content}</Text>
              <ActionIcon color="red" onClick={() => onDeleteNote(note.id)}>
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      )}
    </Paper>
  );
}