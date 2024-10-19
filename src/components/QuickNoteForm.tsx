import { useState } from 'react';
import { TextInput, Button, Group } from '@mantine/core';
import { QuickNote } from '../types';

interface QuickNoteFormProps {
  onAddNote: (note: QuickNote) => void;
  eventId?: string;
}

export default function QuickNoteForm({ onAddNote, eventId }: QuickNoteFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      const newNote: QuickNote = {
        id: Date.now().toString(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        eventId,
      };
      onAddNote(newNote);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Group>
        <TextInput
          placeholder="Añadir nota rápida..."
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Button type="submit">Añadir</Button>
      </Group>
    </form>
  );
}