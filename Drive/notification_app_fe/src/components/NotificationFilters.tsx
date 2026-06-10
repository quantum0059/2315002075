'use client';

import SearchIcon from '@mui/icons-material/Search';
import {FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from '@mui/material';
import {NotificationFilterType} from '@/data/notifications';
import {ViewFilter} from '@/context/NotificationContext';

interface NotificationFiltersProps {
  searchTerm: string;
  selectedType: NotificationFilterType;
  viewFilter: ViewFilter;
  typeOptions: readonly NotificationFilterType[];
  onSearchTermChange: (value: string) => void;
  onSelectedTypeChange: (value: NotificationFilterType) => void;
  onViewFilterChange: (value: ViewFilter) => void;
}

export default function NotificationFilters({
  searchTerm,
  selectedType,
  viewFilter,
  typeOptions,
  onSearchTermChange,
  onSelectedTypeChange,
  onViewFilterChange,
}: NotificationFiltersProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={5}>
        <TextField
          label="Search notifications"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={6} md={4}>
        <FormControl fullWidth>
          <InputLabel id="type-filter-label">Type</InputLabel>
          <Select
            labelId="type-filter-label"
            value={selectedType}
            label="Type"
            onChange={(event: SelectChangeEvent<NotificationFilterType>) =>
              onSelectedTypeChange(event.target.value as NotificationFilterType)
            }
          >
            {typeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} md={3}>
        <FormControl fullWidth>
          <InputLabel id="view-filter-label">Viewed</InputLabel>
          <Select
            labelId="view-filter-label"
            value={viewFilter}
            label="Viewed"
            onChange={(event: SelectChangeEvent<ViewFilter>) => onViewFilterChange(event.target.value as ViewFilter)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="unviewed">Unviewed</MenuItem>
            <MenuItem value="viewed">Viewed</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
