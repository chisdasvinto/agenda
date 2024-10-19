export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
  notes?: string[];
}

export interface QuickNote {
  id: string;
  content: string;
  createdAt: string;
  eventId?: string;
}