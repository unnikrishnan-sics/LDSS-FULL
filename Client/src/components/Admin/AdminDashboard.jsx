import { Box, Button, Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import React, { useEffect } from 'react';
import adminlogo from "../../assets/adminlogo.png";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import SchoolIcon from '@mui/icons-material/School';
import SpaIcon from '@mui/icons-material/Spa';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import Paper from '@mui/material/Paper';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
};



const AdminDashboard = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem('token');
        // localStorage.removeItem('parentdetails');
        // window.location.reload();
        navigate('/admin/login');
        toast.success("You logged out");

        // logging out and not returning back


    }
    useEffect(() => {
        if (localStorage.getItem("token") == null) {
            navigate("/");
        }
    });
    // table
    function createTheraphistData(siNo, profile, name, phone, email, Address, Action) {
        return { siNo, profile, name, phone, email, Address, Action };
    }
    const theraphistRow = [
        createTheraphistData(1, 159, 6.0, 24, 4.0, "jhj", "gjh"),
        createTheraphistData(2, 237, 9.0, 37, 4.3,"jhj", "gjh"),
        createTheraphistData(3, 262, 16.0, 24, 6.0,"jhj", "gjh"),
        createTheraphistData(4, 305, 3.7, 67, 4.3,"jhj", "gjh"),
        createTheraphistData(5, 356, 16.0, 49, 3.9,"jhj", "gjh")

    ]; 
    function createEducator(siNo, profile, name, phone, email, Address, Action){
        return { siNo, profile, name, phone, email, Address, Action };
    };
    const educatorRow = [
        createEducator(1, 159, 6.0, 24, 4.0, "jhj", "gjh"),
        createEducator(2, 237, 9.0, 37, 4.3,"jhj", "gjh"),
        createEducator(3, 262, 16.0, 24, 6.0,"jhj", "gjh"),
        createEducator(4, 305, 3.7, 67, 4.3,"jhj", "gjh"),
        createEducator(5, 356, 16.0, 49, 3.9,"jhj", "gjh")

    ]; 
    return (
        <>
            <Box display={"flex"} sx={{ background: "#F6F7F9", p: "30px", height: "100%",width:"100%" }}>
                <Box sx={{ background: "white", width: "250px", height: "100%", borderRadius: "15px" ,pl:"20px"}}>
                    <Box sx={{ width: "122px", height: "30px", marginTop: "30px" }} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'row'}>
                        <Box component="img" src={adminlogo} sx></Box>
                        <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>LearnHub</Typography>
                    </Box>

                    <Box sx={{ height: "100%", marginTop: "20px" }}>
                        <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'} gap={2}>
                            <DashboardIcon color='primary' sx={{ width: "24px" }} />
                            <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Dashboard</Typography>
                        </Box>
                        <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'} gap={2}>
                            <SupervisedUserCircleIcon color='primary' sx={{ width: "24px" }} />
                            <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Parent</Typography>
                        </Box>
                        <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'} gap={2}>
                            <SchoolIcon color='primary' sx={{ width: "24px" }} />
                            <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Educator</Typography>
                        </Box>
                        <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'} gap={2}>
                            <SpaIcon color='primary' sx={{ width: "24px" }} />
                            <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Therapist</Typography>
                        </Box>
                        <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'} gap={2}>
                            <ListAltIcon color='primary' sx={{ width: "24px" }} />
                            <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Activity Library</Typography>
                        </Box>
                        <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'} gap={2}>
                            <NotificationsIcon color='primary' sx={{ width: "24px" }} />
                            <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Noitification</Typography>
                        </Box>

                    </Box>
                </Box>

                {/* Content (right part) */}
                <Box sx={{ height: "100%",width:"100%", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "start", padding: "0px 15px", borderRadius: "8px", flexGrow: 1 }}>
                    <Box sx={{ height: "70px", background: "white", borderRadius: "8px", width: "100%" }} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant='h3' sx={{ fontSize: "24px", fontWeight: "500", ml: "30px" }} color='primary'>Dashboard</Typography>
                        <Button onClick={handleOpen} variant="text" color='primary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }} startIcon={<LogoutIcon />}>logout</Button>
                    </Box>

                    <Grid container spacing={2} sx={{ mt: "30px" ,width:"100%"}}>
                        <Grid item xs={6} md={3} width={"24%"}>
                            <Box display={'flex'} justifyContent={'start'} alignItems={'start'} flexDirection={'column'} sx={{ width: "100%", height: "138px", background: "#FFFFFF",p:"20px",gap:"15px" }}>
                                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={"100%"} sx={{}}>
                                    <PeopleOutlineIcon sx={{color:"#1967D2"}} />
                                    <Box display={'flex'} justifyContent={'start'} alignItems={'center'} gap={1}>
                                        <TrendingUpIcon sx={{color: "#4CAF50"}}/>
                                        <Typography variant='h6' sx={{ fontSize: "14px", fontWeight: "500", color: "#4CAF50" }}>12 %</Typography>

                                    </Box>

                                </Box>
                                <Typography color='primary' variant='h6' sx={{ fontSize: "16px", fontWeight: "500" }}>Total Students</Typography>
                                <Typography color='primary' variant='h5' sx={{ fontSize: "24px", fontWeight: "500" }}>1,234</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3} width={"24%"}>
                            <Box display={'flex'} justifyContent={'start'} alignItems={'start'} flexDirection={'column'} sx={{ width: "100%", height: "138px", background: "#FFFFFF",p:"20px",gap:"15px" }}>
                                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={"100%"} sx={{}}>
                                    <SchoolIcon sx={{color:"#1967D2"}} />
                                    <Box display={'flex'} justifyContent={'start'} alignItems={'center'} gap={1}>
                                    <TrendingUpIcon sx={{color: "#4CAF50"}}/>
                                        <Typography variant='h6' sx={{ fontSize: "14px", fontWeight: "500", color: "#4CAF50" }}>12 %</Typography>

                                    </Box>

                                </Box>
                                <Typography color='primary' variant='h6' sx={{ fontSize: "16px", fontWeight: "500" }}>Total Educators</Typography>
                                <Typography color='primary' variant='h5' sx={{ fontSize: "24px", fontWeight: "500" }}>54</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3} width={"24%"}>
                            <Box display={'flex'} justifyContent={'start'} alignItems={'start'} flexDirection={'column'} sx={{ width: "100%", height: "138px", background: "#FFFFFF",p:"20px",gap:"15px" }}>
                                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={"100%"} sx={{}}>
                                    <SpaIcon sx={{color:"#1967D2"}}/>
                                    <Box display={'flex'} justifyContent={'start'} alignItems={'center'} gap={1}>
                                    <TrendingUpIcon sx={{color: "#4CAF50"}}/>
                                        <Typography variant='h6' sx={{ fontSize: "14px", fontWeight: "500", color: "#4CAF50" }}>12 %</Typography>

                                    </Box>

                                </Box>
                                <Typography color='primary' variant='h6' sx={{ fontSize: "16px", fontWeight: "500" }}>Total Theraphist</Typography>
                                <Typography color='primary' variant='h5' sx={{ fontSize: "24px", fontWeight: "500" }}>134</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3} width={"24%"}>
                            <Box display={'flex'} justifyContent={'start'} alignItems={'start'} flexDirection={'column'} sx={{ width: "100%", height: "138px", background: "#FFFFFF",p:"20px",gap:"15px" }}>
                                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={"100%"} sx={{}}>
                                    <PersonIcon sx={{color:"#1967D2"}}/>
                                    <Box display={'flex'} justifyContent={'start'} alignItems={'center'} gap={1}>
                                    <TrendingUpIcon sx={{color: "#4CAF50"}}/>
                                        <Typography variant='h6' sx={{ fontSize: "14px", fontWeight: "500", color: "#4CAF50" }}>12 %</Typography>

                                    </Box>

                                </Box>
                                <Typography color='primary' variant='h6' sx={{ fontSize: "16px", fontWeight: "500" }}>Total Parents</Typography>
                                <Typography color='primary' variant='h5' sx={{ fontSize: "24px", fontWeight: "500" }}>1,034</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    {/* theraphist table starts */}
                    <Box sx={{width:"100%",height:"450px",background:"white",borderRadius:"15px",mt:"15px"}}>
                        <Typography sx={{fontSize:"18px",fontWeight:"600",pl:"20px",pt:"20px"}} color='primary' variant='h4'>Theraphist Request</Typography>
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
                                            {theraphistRow.map((row) => (
                                                <TableRow
                                                    key={row.siNo}
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
                                                        {row.siNo}
                                                    </TableCell>
                                                    <TableCell align="right">{row.profile}</TableCell>
                                                    <TableCell align="right">{row.name}</TableCell>
                                                    <TableCell align="right">{row.email}</TableCell>
                                                    <TableCell align="right">{row.Address}</TableCell>
                                                    <TableCell align="right">{row.phone}</TableCell>
                                                    <TableCell align="right">{row.Action}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                    </Box>
                    {/* theraphist table ends */}

                    {/* educator table starts */}
                    <Box sx={{width:"100%",height:"450px",background:"white",borderRadius:"15px",mt:"15px"}}>
                        <Typography sx={{fontSize:"18px",fontWeight:"600",pl:"20px",pt:"20px"}} color='primary' variant='h4'>Theraphist Request</Typography>
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
                                            {educatorRow.map((row) => (
                                                <TableRow
                                                    key={row.siNo}
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
                                                        {row.siNo}
                                                    </TableCell>
                                                    <TableCell align="right">{row.profile}</TableCell>
                                                    <TableCell align="right">{row.name}</TableCell>
                                                    <TableCell align="right">{row.phone}</TableCell>
                                                    <TableCell align="right">{row.email}</TableCell>
                                                    <TableCell align="right">{row.Address}</TableCell>
                                                    <TableCell align="right">{row.Action}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                    </Box>
                    {/* educator table ends */}
                </Box>
                {/* logout modal */}
                <div>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                            backdrop: {
                                timeout: 500,
                            },
                        }}
                    >
                        <Fade in={open}>
                            <Box sx={style}>
                                <Box display={"flex"} justifyContent={"space-between"} alignItems={"space-between"}>
                                    <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Logout</Typography>
                                    <CloseIcon onClick={handleClose} sx={{ fontSize: "18px" }} />
                                </Box>
                                <hr />
                                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"}>
                                    <Typography color='primary' sx={{ fontSize: "12px", fontWeight: '500' }} variant='p'>Are you sure you want to log out ? </Typography>
                                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ gap: "10px" }}>
                                        <Button variant='outlined' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleLogOut}>yes</Button>
                                        <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleClose}>no</Button>
                                    </Box>
                                </Box>

                            </Box>
                        </Fade>
                    </Modal>
                </div>
            </Box>
        </>
    )
}

export default AdminDashboard
