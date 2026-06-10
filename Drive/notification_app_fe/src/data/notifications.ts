export type NotificationType = 'Alert' | 'Message' | 'System' | 'Reminder' | 'Update';
export type NotificationPriority = 'High' | 'Medium' | 'Low';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  priority: NotificationPriority;
  viewed: boolean;
  receivedAt: string;
}

export const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'System maintenance scheduled',
    description: 'The notification platform will undergo maintenance tonight at 11:30 PM.',
    type: 'System',
    priority: 'High',
    viewed: false,
    receivedAt: '2026-06-10T08:10:00Z',
  },
  {
    id: '2',
    title: 'New message from Priya',
    description: 'Priya sent a message requesting an update on the project timeline.',
    type: 'Message',
    priority: 'Medium',
    viewed: true,
    receivedAt: '2026-06-09T19:45:00Z',
  },
  {
    id: '3',
    title: 'Security alert: sign-in attempt',
    description: 'A sign-in attempt from a new device was detected. Review your login activity.',
    type: 'Alert',
    priority: 'High',
    viewed: false,
    receivedAt: '2026-06-10T07:22:00Z',
  },
  {
    id: '4',
    title: 'Monthly summary available',
    description: 'Your June performance summary is ready to review.',
    type: 'Update',
    priority: 'Low',
    viewed: true,
    receivedAt: '2026-06-08T16:05:00Z',
  },
  {
    id: '5',
    title: 'Reminder: team sync',
    description: 'Don’t forget the team sync meeting tomorrow at 9:00 AM.',
    type: 'Reminder',
    priority: 'Medium',
    viewed: false,
    receivedAt: '2026-06-09T11:00:00Z',
  },
  {
    id: '6',
    title: 'Invoice overdue alert',
    description: 'Your latest invoice is overdue. Please review billing details.',
    type: 'Alert',
    priority: 'High',
    viewed: false,
    receivedAt: '2026-06-07T08:30:00Z',
  },
  {
    id: '7',
    title: 'Welcome to the notification center',
    description: 'Get started by reviewing recent alerts, messages, and reminders.',
    type: 'System',
    priority: 'Low',
    viewed: true,
    receivedAt: '2026-06-05T14:20:00Z',
  },
  {
    id: '8',
    title: 'Project update received',
    description: 'The design team has posted the latest UI mockups.',
    type: 'Update',
    priority: 'Medium',
    viewed: false,
    receivedAt: '2026-06-10T09:15:00Z',
  },
  {
    id: '9',
    title: 'Message from customer support',
    description: 'Support replied to your ticket with an estimated resolution time.',
    type: 'Message',
    priority: 'Medium',
    viewed: true,
    receivedAt: '2026-06-09T12:18:00Z',
  },
  {
    id: '10',
    title: 'Service status update',
    description: 'All systems are operating normally after the scheduled maintenance.',
    type: 'System',
    priority: 'Low',
    viewed: false,
    receivedAt: '2026-06-10T05:50:00Z',
  },
  {
    id: '11',
    title: 'New security policy reminder',
    description: 'Please review the updated security policy for account protection.',
    type: 'Reminder',
    priority: 'High',
    viewed: false,
    receivedAt: '2026-06-09T08:00:00Z',
  },
  {
    id: '12',
    title: 'Message from Dina',
    description: 'Dina shared a document that requires review before Friday.',
    type: 'Message',
    priority: 'Low',
    viewed: true,
    receivedAt: '2026-06-08T13:39:00Z',
  },
  {
    id: '13',
    title: 'Performance alert',
    description: 'Your application has reached 90% of the traffic quota.',
    type: 'Alert',
    priority: 'High',
    viewed: false,
    receivedAt: '2026-06-10T10:04:00Z',
  },
  {
    id: '14',
    title: 'Reminder: password rotation',
    description: 'Your password expires in 3 days. Update it to keep your account secure.',
    type: 'Reminder',
    priority: 'Medium',
    viewed: false,
    receivedAt: '2026-06-09T21:00:00Z',
  },
  {
    id: '15',
    title: 'System notice: feature rollout',
    description: 'A new feature rollout begins tomorrow for selected users.',
    type: 'Update',
    priority: 'Low',
    viewed: true,
    receivedAt: '2026-06-08T10:27:00Z',
  },
];

export const filterTypes = ['All', 'Alert', 'Message', 'System', 'Reminder', 'Update'] as const;
export type NotificationFilterType = typeof filterTypes[number];
