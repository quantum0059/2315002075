'use client';

import {Box, Card, CardContent, Stack, Typography} from '@mui/material';
import NavigationShell from '@/components/NavigationShell';
import NotificationFilters from '@/components/NotificationFilters';
import NotificationTable from '@/components/NotificationTable';
import {useNotificationContext} from '@/context/NotificationContext';

export default function PriorityInboxPage() {
  const {
    notifications,
    page,
    searchTerm,
    selectedType,
    viewFilter,
    typeOptions,
    onSearchTermChange,
    onSelectedTypeChange,
    onViewFilterChange,
    onPageChange,
    toggleViewed,
  } = useNotificationContext();

  const priorityNotifications = notifications.filter((notification) => notification.priority === 'High');
  const priorityVisible = priorityNotifications
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
    .filter((notification) => {
      const matchesType = selectedType === 'All' || notification.type === selectedType;
      const matchesViewed =
        viewFilter === 'all' ||
        (viewFilter === 'viewed' ? notification.viewed : !notification.viewed);
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        notification.title.toLowerCase().includes(normalizedSearch) ||
        notification.description.toLowerCase().includes(normalizedSearch);
      return matchesType && matchesViewed && matchesSearch;
    });

  return (
    <NavigationShell>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Priority Inbox
          </Typography>
          <Typography color="text.secondary">
            Focus on the most important notifications first. High-priority items are surfaced here.
          </Typography>
        </Box>

        <Card elevation={1}>
          <CardContent>
            <NotificationFilters
              searchTerm={searchTerm}
              selectedType={selectedType}
              viewFilter={viewFilter}
              typeOptions={typeOptions}
              onSearchTermChange={onSearchTermChange}
              onSelectedTypeChange={onSelectedTypeChange}
              onViewFilterChange={onViewFilterChange}
            />
          </CardContent>
        </Card>

        <NotificationTable
          notifications={priorityVisible}
          page={page}
          pageCount={Math.max(1, Math.ceil(priorityVisible.length / 6))}
          onPageChange={onPageChange}
          onToggleViewed={toggleViewed}
        />
      </Stack>
    </NavigationShell>
  );
}
