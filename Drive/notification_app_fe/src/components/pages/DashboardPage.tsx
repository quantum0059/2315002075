'use client';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {Box, Card, CardContent, Grid, Paper, Stack, Typography} from '@mui/material';
import NavigationShell from '@/components/NavigationShell';
import {useNotificationContext} from '@/context/NotificationContext';

function SummaryCard({title, value, description, icon}: {title: string; value: string; description: string; icon: React.ReactNode}) {
  return (
    <Paper sx={{p: 3, height: '100%'}} elevation={1}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {icon}
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
        </Stack>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default function DashboardPage() {
  const {notifications, unreadCount, highPriorityCount} = useNotificationContext();

  const latestNotifications = [...notifications]
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
    .slice(0, 5);

  return (
    <NavigationShell>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography color="text.secondary">
            Overview of your notifications, unread alerts, and the latest activity.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <SummaryCard
              title="Total Notifications"
              value={notifications.length.toString()}
              description="All items across the application."
              icon={<NotificationsActiveIcon color="primary" />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard
              title="Unread"
              value={unreadCount.toString()}
              description="Notifications that still need your attention."
              icon={<NotificationsActiveIcon color="secondary" />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard
              title="Priority Inbox"
              value={highPriorityCount.toString()}
              description="High-priority notifications across the system."
              icon={<PriorityHighIcon color="error" />}
            />
          </Grid>
        </Grid>

        <Box>
          <Paper elevation={1} sx={{p: {xs: 2, sm: 3}}}>
            <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems={{xs: 'flex-start', sm: 'center'}} spacing={2}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Recent notifications
                </Typography>
                <Typography color="text.secondary">Quickly scan the latest alerts, messages, and system updates.</Typography>
              </Box>
            </Stack>
            <Grid container spacing={2} sx={{mt: 1}}>
              {latestNotifications.map((item) => (
                <Grid item xs={12} md={6} key={item.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography fontWeight={700}>{item.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(item.receivedAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Typography variant="caption" color="text.secondary">
                            {item.type}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.priority} priority
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.viewed ? 'Viewed' : 'Unviewed'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      </Stack>
    </NavigationShell>
  );
}
