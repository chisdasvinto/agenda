import { Calendar as MantineCalendar } from '@mantine/dates';
import { Event } from '../types';
import { Paper, Text, useMantineTheme, Group, Badge, Popover, Box } from '@mantine/core';
import { useState } from 'react';

interface CalendarProps {
  events: Event[];
}

export default function Calendar({ events }: CalendarProps) {
  const theme = useMantineTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <Paper shadow="sm" radius="md" p="md" withBorder>
      <Text size="xl" weight={700} mb="md" variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 45 }}>
        Calendario de Eventos
      </Text>
      <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
        <MantineCalendar
          size="xl"
          styles={(theme) => ({
            calendarBase: {
              width: '100%'
            },
            day: {
              '&[data-selected]': {
                backgroundColor: theme.colors.teal[6],
                color: theme.white,
              },
            },
          })}
          value={selectedDate}
          onChange={setSelectedDate}
          renderDay={(date) => {
            const day = date.getDate();
            const dayEvents = events.filter(
              (event) => new Date(event.date).toDateString() === date.toDateString()
            );
            return (
              <Popover width={200} position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <div style={{ position: 'relative', cursor: 'pointer' }}>
                    {day}
                    {dayEvents.length > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 2,
                          right: 2,
                          display: 'flex',
                          gap: 2,
                        }}
                      >
                        {dayEvents.map((event, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: getEventColor(event.type),
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event, index) => (
                      <Text key={index} size="sm" mb={5}>
                        <Badge color={getEventColor(event.type)} mr={5}>{event.type}</Badge>
                        {event.title}
                      </Text>
                    ))
                  ) : (
                    <Text size="sm">No hay eventos para este día</Text>
                  )}
                </Popover.Dropdown>
              </Popover>
            );
          }}
        />
      </Box>
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