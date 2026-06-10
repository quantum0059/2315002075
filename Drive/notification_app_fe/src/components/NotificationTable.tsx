'use client';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import {Box, Button, Card, CardActions, CardContent, Chip, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {NotificationItem} from '@/data/notifications';

interface NotificationTableProps {
  notifications: NotificationItem[];
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onToggleViewed: (id: string) => void;
}

const priorityColor: Record<NotificationItem['priority'], 'primary' | 'secondary' | 'default'> = {
  High: 'secondary',
  Medium: 'default',
  Low: 'primary',
};

const typeColor: Record<NotificationItem['type'], 'primary' | 'secondary' | 'default'> = {
  Alert: 'secondary',
  Message: 'primary',
  System: 'default',
  Reminder: 'secondary',
  Update: 'default',
};

export default function NotificationTable({
  notifications,
  page,
  pageCount,
  onPageChange,
  onToggleViewed,
}: NotificationTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">No matching notifications</Typography>
          <Typography color="text.secondary">Try adjusting the search, filters, or pagination.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {isMobile ? (
        notifications.map((notification) => (
          <Card key={notification.id} elevation={1}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1}>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1}}>
                    <FiberManualRecordIcon color={notification.viewed ? 'disabled' : 'error'} sx={{fontSize: 12}} />
                    <Typography fontWeight={700}>{notification.title}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                    {notification.description}
                  </Typography>
                </Box>
                <Chip label={notification.type} color={typeColor[notification.type]} size="small" />
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{mt: 1}}>
                <Chip label={notification.priority} icon={<LabelImportantIcon />} color={priorityColor[notification.priority]} size="small" />
                <Chip label={notification.viewed ? 'Viewed' : 'Unviewed'} size="small" />
                <Chip label={new Date(notification.receivedAt).toLocaleString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})} size="small" />
              </Stack>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => onToggleViewed(notification.id)}>
                {notification.viewed ? 'Mark Unviewed' : 'Mark Viewed'}
              </Button>
            </CardActions>
          </Card>
        ))
      ) : (
        <TableContainer sx={{boxShadow: 'none'}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Notification</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Received</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id} hover>
                  <TableCell>
                    <Typography fontWeight={700}>{notification.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {notification.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={notification.type} color={typeColor[notification.type]} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={notification.priority} icon={<LabelImportantIcon />} color={priorityColor[notification.priority]} size="small" />
                  </TableCell>
                  <TableCell>{new Date(notification.receivedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {notification.viewed ? <CheckCircleOutlineIcon color="success" fontSize="small" /> : <FiberManualRecordIcon color="error" sx={{fontSize: 12}} />}
                      <Typography>{notification.viewed ? 'Viewed' : 'Unviewed'}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Button endIcon={<ArrowForwardIosIcon />} onClick={() => onToggleViewed(notification.id)}>
                      {notification.viewed ? 'Mark Unviewed' : 'Mark Viewed'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box display="flex" justifyContent="center" pt={2}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, nextPage) => onPageChange(nextPage)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Box>
    </Stack>
  );
}
