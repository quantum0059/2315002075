'use client';

import {createContext, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import {filterTypes, initialNotifications, type NotificationFilterType, type NotificationItem} from '@/data/notifications';

export type ViewFilter = 'all' | 'viewed' | 'unviewed';

interface NotificationContextValue {
  notifications: NotificationItem[];
  visibleNotifications: NotificationItem[];
  page: number;
  pageCount: number;
  pageSize: number;
  searchTerm: string;
  selectedType: NotificationFilterType;
  viewFilter: ViewFilter;
  unreadCount: number;
  totalCount: number;
  highPriorityCount: number;
  typeOptions: readonly NotificationFilterType[];
  onSearchTermChange: (value: string) => void;
  onSelectedTypeChange: (value: NotificationFilterType) => void;
  onViewFilterChange: (value: ViewFilter) => void;
  onPageChange: (value: number) => void;
  toggleViewed: (notificationId: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({children}: {children: ReactNode}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<NotificationFilterType>('All');
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const visibleNotifications = useMemo(() => {
    return notifications
      .slice()
      .sort((a, b) => (new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()))
      .filter((notification) => {
        const matchesType = selectedType === 'All' || notification.type === selectedType;
        const matchesViewed =
          viewFilter === 'all' ||
          (viewFilter === 'viewed' ? notification.viewed : !notification.viewed);
        const matchesSearch =
          normalizedSearch.length === 0 ||
          notification.title.toLowerCase().includes(normalizedSearch) ||
          notification.description.toLowerCase().includes(normalizedSearch) ||
          notification.type.toLowerCase().includes(normalizedSearch);

        return matchesType && matchesViewed && matchesSearch;
      });
  }, [notifications, normalizedSearch, selectedType, viewFilter]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedType, viewFilter]);

  const pageCount = Math.max(1, Math.ceil(visibleNotifications.length / pageSize));

  const paginatedNotifications = useMemo(() => {
    const start = (page - 1) * pageSize;
    return visibleNotifications.slice(start, start + pageSize);
  }, [page, pageSize, visibleNotifications]);

  const unreadCount = notifications.filter((notification) => !notification.viewed).length;
  const highPriorityCount = notifications.filter((notification) => notification.priority === 'High').length;

  function toggleViewed(notificationId: string) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? {...notification, viewed: !notification.viewed}
          : notification,
      ),
    );
  }

  const value: NotificationContextValue = {
    notifications,
    visibleNotifications: paginatedNotifications,
    page,
    pageCount,
    pageSize,
    searchTerm,
    selectedType,
    viewFilter,
    unreadCount,
    totalCount: notifications.length,
    highPriorityCount,
    typeOptions: filterTypes,
    onSearchTermChange: setSearchTerm,
    onSelectedTypeChange: setSelectedType,
    onViewFilterChange: setViewFilter,
    onPageChange: setPage,
    toggleViewed,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
}
