import { List, Text, Button, Group, useMantineTheme, Badge, Paper, Stack, Transition, ActionIcon } from '@mantine/core';
import { Event } from '../types';
import { IconTrash, IconEdit } from '@tabler/icons-react';

interface EventListProps {
  events: Event[];
  onDeleteEvent: (id: string) => void;
  onEditEvent: (event: Event) => void;
  filter: string;
}

export default function EventList({ events, onDeleteEvent, onEditEvent, filter }: EventListProps) {
  const theme = useMantineTheme();

  const filteredEvents = filter === 'all' ? events : events.filter(event => event.type === filter);

  return (
    <Paper shadow="sm" radius="md" p="md" withBorder>
      <Text size="xl" weight={700} mb="md" variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 45 }}>
        Lista de Eventos
      </Text>
      {filteredEvents.length === 0 ? (
        <Text align="center" color="dimmed">No hay eventos programados.</Text>
      ) : (
        <Stack spacing="md">
          {filteredEvents.map((event) => (
            <Transition key={event.id} mounted={true} transition="fade" duration={400} timingFunction="ease">
              {(styles) => (
                <Paper shadow="xs" p="md" withBorder style={styles}>
                  <Group position="apart">
                    <div>
                      <Group spacing="xs">
                        <Text weight={500}>{event.title}</Text>
                        <Badge color={getEventColor(event.type)}>{event.type}</Badge>
                        {event.recurrence !== 'none' && (
                          <Badge color="grape">
                            {event.recurrence === 'daily' ? 'Diario' : 
                             event.recurrence === 'weekly' ? 'Semanal' : 'Mensual'}
                          </Badge>
                        )}
                      </Group>
                      <Text size="sm" color="dimmed">
                        {new Date(event.date).toLocaleDateString()}
                      </Text>
                      {event.description && (
                        <Text size="sm" mt="xs">{event.description}</Text>
                      )}
                    </div>
                    <Group>
                      <ActionIcon color="blue" onClick={() => onEditEvent(event)}>
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon color="red" onClick={() => onDeleteEvent(event.id)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Paper>
              )}
            </Transition>
          ))}
        </Stack>
      )}
    </Paper>
  );
}

function getEventColor(type: string): string {
  switch (type) {
    case 'personal':
      return 'blue';
    case 'trabajo':
      return 'green';
    case 'clase':
      return 'orange';
    case 'experimento':
      return 'pink';
    default:
      return 'gray';
  }
}