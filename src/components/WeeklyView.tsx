import { Paper, Text, Grid, Group, Badge } from '@mantine/core';
import { Event } from '../types';
import { startOfWeek, addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeeklyViewProps {
  events: Event[];
  currentDate: Date;
}

export default function WeeklyView({ events, currentDate }: WeeklyViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <Paper shadow="sm" radius="md" p="md" withBorder>
      <Text size="xl" weight={700} mb="md" variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 45 }}>
        Vista Semanal
      </Text>
      <Grid>
        {weekDays.map((day, index) => (
          <Grid.Col key={index} span={12 / 7}>
            <Paper shadow="xs" p="sm" withBorder>
              <Text weight={500} align="center" mb="xs">
                {format(day, 'EEEE', { locale: es })}
              </Text>
              <Text align="center" size="sm" color="dimmed" mb="sm">
                {format(day, 'd MMM', { locale: es })}
              </Text>
              {events
                .filter(event => new Date(event.date).toDateString() === day.toDateString())
                .map((event, eventIndex) => (
                  <Group key={eventIndex} mb="xs">
                    <Badge color={getEventColor(event.type)}>{event.type}</Badge>
                    <Text size="sm">{event.title}</Text>
                  </Group>
                ))}
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
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