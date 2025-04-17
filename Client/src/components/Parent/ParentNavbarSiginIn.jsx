
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import LogoHub from "../../assets/logo.png";
import {Link} from "react-router-dom"




const pages = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/aboutus' },
    { label: 'Contact', path: '/contact' }
];

const ParentNavbarSiginIn = ({siginupStyle,loginStyle}) => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
  return (
    <>
       <AppBar position="static" sx={{...siginupStyle,background:"transparent"}}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Link to='/'>
                            <Box component="img" src={LogoHub} alt='logo'
                                sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>

                            </Box>
                            </Link>
                            <Link to='/' style={{textDecoration:"none"}}>
                            <Typography
                                variant="h6"
                                noWrap
                                
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    // color: '#384371',
                                    textDecoration: 'none',
                                    color: '#384371'
                                }}
                            >
                                LearnHub
                            </Typography>
                            </Link>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon sx={{ color: "#384371" }} />
                            </IconButton>
                            
                        </Box>
                        <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Link to="/">
                        <Typography
                            variant="h5"
                            noWrap
                            
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            LearnHub
                        </Typography>
                        </Link>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' },justifyContent: 'flex-end',gap:"50px" }}>
                            {pages.map((page) => (
                                <Link style={{textDecoration:"none"}}
                                    key={page.label}
                                    onClick={handleCloseNavMenu}
                                    to={page.path}
                                   
                                >
                                    <Typography  sx={{ my: 2, color: "#384371",fontSize:"14px",fontWeight:"500",textDecoration:"none", display: 'block',textTransform:"inherit", '&:hover': {
                                        borderBottom:"1px solid #1967D2",
                                        color: '#384371'
                                    } }}>{page.label}</Typography>
                                    
                                </Link>
                            ))}
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                                <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page.label} 
                                    onClick={handleCloseNavMenu}
                                    to={page.path}
                                    >
                                        <Typography color='primary'
                                            sx={{ textAlign: 'center', color: '#1967D2' }}>
                                            {page.label}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
    </>
  )
}

export default ParentNavbarSiginIn
