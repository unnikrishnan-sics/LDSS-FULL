import { Box, Button, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import React, { useState } from 'react'
import AdminSideBar from './Common/AdminSideBar'
import LogoutIcon from '@mui/icons-material/Logout';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
const AdminEditActivity = () => {
    const textFieldStyle = { height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" };
    
    // logout
    const [openLogout, setOpenLogout] = useState(false);
    const handleOpenLogout = () => setOpenLogout(true);
    const handleCloseLogout = () => setOpenLogout(false);
    
    // file upload state
    const [fileName, setFileName] = useState('No file chosen');
    
    // activity category state
    const [category, setCategory] = useState('');
    const categories = [
        'Communication & Cognitive Skills',
        'Language & Creativity',
        'STEM Learning',
        'Mathematical Thinking',
        'Social Studies',
        'Visual Arts',
        'Science & Nature',
        'Communication Skills',
        'Social Skills',
        'Performing Arts',
        'Digital Literacy',
        'Social-Emotional Learning'
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            // Handle file upload logic here
        }
    };

    return (
        <>
            <Box display={"flex"} sx={{ background: "#F6F7F9", p: "13px", height: "100vh", width: "100%",overflowY:"hidden" }}>
                <AdminSideBar />

                {/* Content (right part) */}
                <Box sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "start", padding: "0px 15px", borderRadius: "8px", flexGrow: 1,marginTop:"0px"  }}>
                    <Box sx={{ height: "70px", background: "white", borderRadius: "8px", width: "100%" }} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant='h3' sx={{ fontSize: "24px", fontWeight: "500", ml: "30px" }} color='primary'>Edit Activity </Typography>
                    <Button onClick={handleOpenLogout} variant="text" color='primary' sx={{ borderRadius: "25px", height: "40px", width: '200px', padding: '10px 35px' }} startIcon={<LogoutIcon />}>logout</Button>
                    </Box>
                    
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} sx={{ mt: "20px", height: "394px", background: "white", borderRadius: "8px", width: "100%", p: "30px", gap: "15px" }}>
                        <Typography variant='h3' sx={{ fontSize: "18px", fontWeight: "600" }} color='primary'>Edit Job</Typography>
                        
                        {/* input */}
                        <Box mt={4} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={3}>
                            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={3}>
                                <div style={textFieldStyle}>
                                    <label>Activity name</label>
                                    <input style={{ height: "40px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px' }}
                                        name='activityName'
                                        type='text'
                                    />
                                </div>
                                
                                <div style={textFieldStyle}>
                                    <label>Photo</label>
                                    <Box sx={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid #CCCCCC',
                                        borderRadius: '8px',
                                        height: '40px',
                                        padding: '0 8px'
                                    }}>
                                        <Typography variant="body1" sx={{ flexGrow: 1, color: fileName === 'No file chosen' ? '#999' : 'inherit' }}>
                                            {fileName}
                                        </Typography>
                                        <input 
                                            type="file"
                                            id="file-upload"
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                            name='activityPhoto'
                                        />
                                        <label htmlFor="file-upload">
                                            <Button 
                                                component="span"
                                                sx={{ 
                                                    minWidth: 'auto',
                                                    p: '8px',
                                                    color: 'primary.main'
                                                }}
                                            >
                                                <DriveFolderUploadIcon   />
                                            </Button>
                                        </label>
                                    </Box>
                                </div>
                            </Box>
                            
                            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={3}>
                                <div style={textFieldStyle}>
                                    <label>Description</label>
                                    <input style={{ height: "40px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px' }}
                                        name='description'
                                        type='text'
                                    />
                                </div>
                                
                                <div style={textFieldStyle}>
                                    <label>Activity Category</label>
                                    <FormControl fullWidth>
                                        <Select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            sx={{ 
                                                height: "40px",
                                                borderRadius: "8px",
                                                border: "1px solid #CCCCCC",
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none'
                                                }
                                            }}
                                        >
                                            <MenuItem value="" disabled>
                                                Select category
                                            </MenuItem>
                                            {categories.map((cat) => (
                                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </Box>
                        </Box>
                        
                        <Button 
                            variant='contained' 
                            color='secondary' 
                            sx={{ mt: "20px", borderRadius: "25px", height: "45px", width: '150px', padding: '20px 35px' }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default AdminEditActivity