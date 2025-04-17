import React from 'react';
import { Box, Button, ButtonGroup, Container, Grid, InputAdornment, Menu, MenuItem, TextField, Typography, alpha, styled } from '@mui/material'
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import adminlogo from "../../assets/adminlogo.png";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import SchoolIcon from '@mui/icons-material/School';
import SpaIcon from '@mui/icons-material/Spa';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const AdminViewEducator = () => {
    
    const StyledTextField = styled(TextField)({
        '& .MuiOutlinedInput-root': {
            borderRadius: '30px', // Custom border radius
            border: "1px solid black"
        },

    })
    // table
    function createData(name, calories, fat, carbs, protein, Address, Action) {
        return { name, calories, fat, carbs, protein, Address, Action };
    }
    // dropdown
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0, "jhj", "gjh"),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),

    ];

    return (
        <>
            <Container maxWidth="x-lg" sx={{ background: "#F6F7F9" }}>
                <Grid container spacing={2} sx={{ height: "100vh", width: "100%" }}>
                    <Grid size={{ xs: 6, md: 2 }} sx={{ height: "100%", background: "white", margin: "15px 0px", borderRadius: "8px" }} display={'flex'} justifyContent={'start'} alignItems={'center'} flexDirection={'column'}>
                        <Box sx={{ width: "122px", height: "30px", marginTop: "30px" }} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'row'}>
                            <Box component="img" src={adminlogo} sx></Box>
                            <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>LearnHub</Typography>
                        </Box>

                        <Box sx={{ height: "340px", marginTop: "20px" }}>
                            <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'}>
                                <DashboardIcon color='primary' sx={{ width: "24px" }} />
                                <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Dashboard</Typography>
                            </Box>
                            <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'}>
                                <SupervisedUserCircleIcon color='primary' sx={{ width: "24px" }} />
                                <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Parent</Typography>
                            </Box>
                            <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'}>
                                <SchoolIcon color='primary' sx={{ width: "24px" }} />
                                <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Educator</Typography>
                            </Box>
                            <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'}>
                                <SpaIcon color='primary' sx={{ width: "24px" }} />
                                <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Therapist</Typography>
                            </Box>
                            <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'}>
                                <ListAltIcon color='primary' sx={{ width: "24px" }} />
                                <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Activity Library</Typography>
                            </Box>
                            <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'}>
                                <NotificationsIcon color='primary' sx={{ width: "24px" }} />
                                <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Noitification</Typography>
                            </Box>

                        </Box>

                    </Grid>
                    {/* Content (right part) */}
                    <Grid item xs={6} md={10} sx={{ height: "100%", display: "flex", justifyContent: "start", alignItems: "center", gap: "30px", flexDirection: "column", padding: "15px 0px", borderRadius: "8px", flexGrow: 1 }}>
                        <Box sx={{ height: "70px", background: "white", borderRadius: "8px", width: "100%" }} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                            <Typography variant='h3' sx={{ fontSize: "24px", fontWeight: "500" }} color='primary'>Educators</Typography>
                            <Button variant="text" color='primary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }} startIcon={<LogoutIcon />}>logout</Button>
                        </Box>
                        <Box>
                            <ButtonGroup
                                disableElevation
                                variant="contained"
                                aria-label="Disabled button group"
                            >
                                <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }}>Requests</Button>
                                <Button variant='contained' color='white' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }}>Educators</Button>
                            </ButtonGroup>
                        </Box>
                        {/* table */}
                        <Box sx={{ height: "562px", width: "100%", background: "red", padding: "20px 10px" }}>
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <Typography variant='h4' color='primary' sx={{ fontSize: '18px', fontWeight: "600" }}> Requests</Typography>
                                <StyledTextField placeholder='search here...' id="outlined-basic" variant="outlined" InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="primary" />

                                        </InputAdornment>
                                    ),
                                }} />

                            </Box>
                            <Box sx={{ height: "320px" }}>
                                {/* table datas */}
                                <TableContainer component={Paper} sx={{ marginTop: "30px" }}>
                                    <Table sx={{ minWidth: 650, border: "none" }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ color: "#1967D2" }}>S.NO</TableCell>
                                                <TableCell align="right" sx={{ color: "#1967D2" }}>Profile</TableCell>
                                                <TableCell align="right" sx={{ color: "#1967D2" }}>Name</TableCell>
                                                <TableCell align="right" sx={{ color: "#1967D2" }}>Phone Number</TableCell>
                                                <TableCell align="right" sx={{ color: "#1967D2" }}>Email Id</TableCell>
                                                <TableCell align="right" sx={{ color: "#1967D2" }} >Address</TableCell>
                                                <TableCell align="right" sx={{ color: "#1967D2" }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow
                                                    key={row.name}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': {
                                                            border: 0, // Remove border for last row
                                                        },
                                                        '& td, & th': {
                                                            border: 'none', // Remove all borders for cells
                                                        }
                                                    }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell align="right">{row.calories}</TableCell>
                                                    <TableCell align="right">{row.fat}</TableCell>
                                                    <TableCell align="right">{row.carbs}</TableCell>
                                                    <TableCell align="right">{row.protein}</TableCell>
                                                    <TableCell align="right">{row.Address}</TableCell>
                                                    <TableCell align="right">{row.Action}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </Box>

                        </Box>
                        <Box>
                            <Box>  
                                <Typography>show</Typography>

                                <Typography>per page</Typography>
                            </Box>
                            <Box>Pagination</Box>
                        </Box>
                    </Grid>

                </Grid>
            </Container>
        </>
    )
}

export default AdminViewEducator
