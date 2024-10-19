import { useState } from 'react';
import { AppShell, Navbar, Header, Text, MediaQuery, Burger, useMantineTheme, Container, Grid, ColorSchemeProvider, ColorScheme, MantineProvider, Button, Group, Paper, Transition, ActionIcon, Select, Tabs } from '@mantine/core';
import { IconSun, IconMoonStars, IconCalendar, IconList, IconPlus, IconChevronLeft, IconChevronRight, IconNotes } from '@tabler/icons-react';
import Calendar from './components/Calendar';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import WeeklyView from './components/WeeklyView';
import QuickNoteForm from './components/QuickNoteForm';
import QuickNoteList from './components/QuickNoteList';
import { Event, QuickNote } from './types';
import { addWeeks, subWeeks } from 'date-fns';

export default function App() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>([]);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [activeTab, setActiveTab] = useState<string>('calendar');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [filter, setFilter] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
    setShowForm(false);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    setShowForm(false);
    setEditingEvent(null);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    setQuickNotes(quickNotes.filter(note => note.eventId !== id));
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const addQuickNote = (note: QuickNote) => {
    setQuickNotes([...quickNotes, note]);
    if (note.eventId) {
      setEvents(events.map(event => 
        event.id === note.eventId 
          ? { ...event, notes: [...(event.notes || []), note.content] }
          : event
      ));
    }
  };

  const deleteQuickNote = (id: string) => {
    const noteToDelete = quickNotes.find(note => note.id === id);
    setQuickNotes(quickNotes.filter(note => note.id !== id));
    if (noteToDelete?.eventId) {
      setEvents(events.map(event => 
        event.id === noteToDelete.eventId 
          ? { ...event, notes: event.notes?.filter(n => n !== noteToDelete.content) }
          : event
      ));
    }
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme, primaryColor: 'teal' }} withGlobalStyles withNormalizeCSS>
        <AppShell
          styles={{
            main: {
              background: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            },
          }}
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="sm"
          navbar={
            <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 250, lg: 300 }}>
              <Navbar.Section>
                <Button 
                  fullWidth 
                  leftIcon={<IconPlus size={18} />} 
                  onClick={() => {
                    setEditingEvent(null);
                    setShowForm(true);
                  }}
                  mb="md"
                  variant="gradient"
                  gradient={{ from: 'teal', to: 'blue' }}
                >
                  Nuevo Evento
                </Button>
              </Navbar.Section>
              <Navbar.Section grow mt="md">
                <QuickNoteForm onAddNote={addQuickNote} />
                <QuickNoteList notes={quickNotes} onDeleteNote={deleteQuickNote} />
              </Navbar.Section>
            </Navbar>
          }
          header={
            <Header height={{ base: 60, md: 70 }} p="md">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                <Group>
                  <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <Burger
                      opened={opened}
                      onClick={() => setOpened((o) => !o)}
                      size="sm"
                      color={theme.colors.gray[6]}
                      mr="xl"
                    />
                  </MediaQuery>
                  <Text size="lg" weight={700} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 45 }}>
                    Agenda del Profesor de Ciencias
                  </Text>
                </Group>
                <Group>
                  <ActionIcon
                    variant="outline"
                    color={colorScheme === 'dark' ? 'yellow' : 'blue'}
                    onClick={() => toggleColorScheme()}
                    title="Toggle color scheme"
                  >
                    {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} />}
                  </ActionIcon>
                </Group>
              </div>
            </Header>
          }
        >
          <Container size="xl" py="md">
            <Tabs value={activeTab} onTabChange={setActiveTab}>
              <Tabs.List>
                <Tabs.Tab value="calendar" icon={<IconCalendar size={14} />}>Calendario</Tabs.Tab>
                <Tabs.Tab value="list" icon={<IconList size={14} />}>Lista</Tabs.Tab>
                <Tabs.Tab value="weekly" icon={<IconCalendar size={14} />}>Semanal</Tabs.Tab>
                <Tabs.Tab value="notes" icon={<IconNotes size={14} />}>Notas</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="calendar" pt="xs">
                <Calendar events={events.filter(event => filter === 'all' || event.type === filter)} />
              </Tabs.Panel>

              <Tabs.Panel value="list" pt="xs">
                <EventList events={events} onDeleteEvent={deleteEvent} onEditEvent={handleEditEvent} filter={filter} />
              </Tabs.Panel>

              <Tabs.Panel value="weekly" pt="xs">
                <WeeklyView events={events.filter(event => filter === 'all' || event.type === filter)} currentDate={currentDate} />
              </Tabs.Panel>

              <Tabs.Panel value="notes" pt="xs">
                <QuickNoteForm onAddNote={addQuickNote} />
                <QuickNoteList notes={quickNotes} onDeleteNote={deleteQuickNote} />
              </Tabs.Panel>
            </Tabs>
          </Container>
          <Transition mounted={showForm} transition="fade" duration={400} timingFunction="ease">
            {(styles) => (
              <Paper
                shadow="md"
                p="xl"
                sx={(theme) => ({
                  position: 'fixed',
                  zIndex: 1000,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '90%',
                  maxWidth: '500px',
                  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                })}
                style={styles}
              >
                <EventForm
                  onAddEvent={addEvent}
                  onUpdateEvent={updateEvent}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingEvent(null);
                  }}
                  initialEvent={editingEvent || undefined}
                />
              </Paper>
            )}
          </Transition>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}