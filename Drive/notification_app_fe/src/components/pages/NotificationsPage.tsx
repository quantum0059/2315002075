'use client';

import {Box, Card, CardContent, Stack, Typography} from '@mui/material';
import NavigationShell from '@/components/NavigationShell';
import NotificationFilters from '@/components/NotificationFilters';
import NotificationTable from '@/components/NotificationTable';
import {useNotificationContext} from '@/context/NotificationContext';

export default function NotificationsPage() {
  const {
    visibleNotifications,
    page,
    pageCount,
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

  return (
    <NavigationShell>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Notifications
          </Typography>
          <Typography color="text.secondary">
            Browse, search, and filter all notifications. Mark notifications as viewed or unviewed instantly.
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
          notifications={visibleNotifications}
          page={page}
          pageCount={pageCount}
          onPageChange={onPageChange}
          onToggleViewed={toggleViewed}
        />
      </Stack>
    </NavigationShell>
  );
}
