'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {AppBar, Box, Button, Container, IconButton, Toolbar, Typography, useMediaQuery} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {useTheme} from '@mui/material/styles';
import {useState} from 'react';

const navItems = [
  {href: '/', label: 'Dashboard'},
  {href: '/notifications', label: 'Notifications'},
  {href: '/priority-inbox', label: 'Priority Inbox'},
];

export default function NavigationShell({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Box sx={{minHeight: '100vh', backgroundColor: 'background.default'}}>
      <AppBar position="sticky" color="primary" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{justifyContent: 'space-between'}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
              <Typography variant="h6" component="span" sx={{fontWeight: 700}}>
                Notification Center
              </Typography>
            </Box>
            {isMobile ? (
              <Box>
                <IconButton
                  color="inherit"
                  aria-label="open navigation menu"
                  onClick={() => setMenuOpen((current) => !current)}
                >
                  <MenuIcon />
                </IconButton>
                {menuOpen && (
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: 64,
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: 4,
                      p: 1,
                      zIndex: 1200,
                    }}
                  >
                    {navItems.map((item) => (
                      <Button
                        key={item.href}
                        component={Link}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        sx={{display: 'block', width: '100%', justifyContent: 'flex-start', textTransform: 'none'}}
                        color={pathname === item.href ? 'secondary' : 'inherit'}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{display: 'flex', gap: 1}}>
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    color={pathname === item.href ? 'secondary' : 'inherit'}
                    sx={{textTransform: 'none', fontWeight: pathname === item.href ? 700 : 500}}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="xl" sx={{py: {xs: 2, md: 4}}}>
        {children}
      </Container>
    </Box>
  );
}
