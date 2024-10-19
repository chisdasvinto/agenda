import { useState } from 'react';
import { TextInput, Button, Select, Group, Text, useMantineTheme, Stack, Transition, Textarea } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { Event } from '../types';
import { IconCalendarEvent, IconX } from '@tabler/icons-react';
import QuickNoteForm from './QuickNoteForm';
import QuickNoteList from './QuickNoteList';

interface EventFormProps {
  onAddEvent: (event: Event) => void;
  onUpdateEvent?: (event: Event) => void;
  onCancel: () => void;
  initialEvent?: Event;
}

export default function EventForm({ onAddEvent, onUpdateEvent, onCancel, initialEvent }: EventFormProps) {
  const theme = useMantineTheme();
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [date, setDate] = useState<Date | null>(initialEvent ? new Date(initialEvent.date) : null);
  const [type, setType] = useState(initialEvent?.type || '');
  const [recurrence, setRecurrence] = useState(initialEvent?.recurrence || 'none');
  const [notes, setNotes] = useState(initialEvent?.notes || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && date && type) {
      const eventData: Event = {
        id: initialEvent?.id || Date.now().toString(),
        title,
        description,
        date: date.toISOString(),
        type,
        recurrence: recurrence as 'none' | 'daily' | 'weekly' | 'monthly',
        notes
      };
      
      if (initialEvent && onUpdateEvent) {
        onUpdateEvent(eventData);
      } else {
        onAddEvent(eventData);
      }
    }
  };

  const addNote = (note: { content: string }) => {
    setNotes([...notes, note.content]);
  };

  const deleteNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  return (
    <Transition mounted={true} transition="fade" duration={400} timingFunction="ease">
      {(styles) => (
        <Stack style={styles}>
          <Text size="xl" weight={700} align="center" variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 45 }}>
            {initialEvent ? 'Editar Evento' : 'Agregar Nuevo Evento'}
          </Text>
          <form onSubmit={handleSubmit}>
            <Stack spacing="md">
              <TextInput
                required
                label="Título"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                placeholder="Ingrese el título del evento"
              />
              <Textarea
                label="Descripción"
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
                placeholder="Ingrese una descripción del evento"
              />
              <DatePicker
                required
                label="Fecha"
                value={date}
                onChange={setDate}
                placeholder="Seleccione la fecha"
              />
              <Select
                required
                label="Tipo"
                value={type}
                onChange={(value) => setType(value || '')}
                data={[
                  { value: 'personal', label: 'Personal' },
                  { value: 'trabajo', label: 'Trabajo' },
                  { value: 'clase', label: 'Clase' },
                  { value: 'experimento', label: 'Experimento' },
                ]}
                placeholder="Seleccione el tipo de evento"
              />
              <Select
                label="Recurrencia"
                value={recurrence}
                onChange={(value) => setRecurrence(value || 'none')}
                data={[
                  { value: 'none', label: 'Sin recurrencia' },
                  { value: 'daily', label: 'Diario' },
                  { value: 'weekly', label: 'Semanal' },
                  { value: 'monthly', label: 'Mensual' },
                ]}
              />
              <Text weight={500}>Notas rápidas</Text>
              <QuickNoteForm onAddNote={addNote} />
              <QuickNoteList 
                notes={notes.map((content, index) => ({ id: index.toString(), content, createdAt: new Date().toISOString() }))} 
                onDeleteNote={(id) => deleteNote(parseInt(id))}
              />
              <Group position="apart" mt="md">
                <Button variant="outline" color="red" onClick={onCancel} leftIcon={<IconX size={18} />}>
                  Cancelar
                </Button>
                <Button type="submit" variant="gradient" gradient={{ from: 'teal', to: 'blue' }} leftIcon={<IconCalendarEvent size={18} />}>
                  {initialEvent ? 'Actualizar Evento' : 'Agregar Evento'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      )}
    </Transition>
  );
}