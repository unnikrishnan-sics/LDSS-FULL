import React, { useEffect, useState } from 'react'
import EducatorNavbar from '../Navbar/EducatorNavbar';
import { Box, Breadcrumbs, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const EducatorLearningPlan = () => {
    const textFieldStyle = { height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }
    const [educatorDetails, setEducatorDetails] = useState({});
    useEffect(() => {
        const educatorDetails = localStorage.getItem("educatorDetails");
        setEducatorDetails(JSON.parse(educatorDetails));
    }, [])
    return (
        <>
            <EducatorNavbar educatorDetails={educatorDetails} />
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ height: "46px", background: "#DBE8FA" }}>
                <Typography color='primary' textAlign={"center"} sx={{ fontSize: "18px", fontWeight: "600" }}>Learning Plan</Typography>
            </Box>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"start"} sx={{ mt: "30px", ml: "50px", mr: "50px" }}>
                <Breadcrumbs aria-label="breadcrumb" separator="›">
                    <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} underline="hover" to="/educator/home">
                        Home
                    </Link>
                    <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} underline="hover" to="/educator/home">
                        All Students
                    </Link>
                    <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>Learning Plan</Typography>
                </Breadcrumbs>
            </Box>

            <Box display={'flex'} gap={3} alignItems={"center"} flexDirection={"column"} sx={{ width: "774px",mx:"auto" }}>
                <Typography color='primary' sx={{ fontSize: "24px", fontWeight: "500" }}>Add Learning Plan</Typography>

                <Stack direction="row" sx={{ display: "flex", gap: "25px" }}>

                    <div style={textFieldStyle}>
                        <label>Goal</label>
                        <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                            // onChange={handleDataChange}
                            name='goal'
                            // value={data.name}
                            type='text'

                        />
                        {/* {error.name && <span style={{ color: 'red', fontSize: '12px' }}>{error.name}</span>} */}
                    </div>

                    <div style={textFieldStyle}>
                        <label>Plan Duration(Weekly)</label>
                        <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                            // onChange={handleDataChange}
                            name='planDuration'
                        // value={data.address}

                        />
                        {/* {error.address && <span style={{ color: 'red', fontSize: '12px' }}>{error.address}</span>} */}
                    </div>
                </Stack>
                <Box sx={{ borderBottom: "1px solid black", width: "100%" }}></Box>

                <Typography color='primary' sx={{ fontSize: "18px", fontWeight: "600" }}>Week 1</Typography>
                <Stack direction="row" sx={{ display: "flex", gap: "25px" }}>

                    <div style={textFieldStyle}>
                        <label style={{fontSize:"14px",fontWeight:"500"}}>Activity 1</label>
                    
                    </div>

                    <div style={textFieldStyle}>
                        <label style={{fontSize:"14px",fontWeight:"500"}}>Activity 2</label>
                    
                    </div>
                </Stack>
                <Stack direction="row" sx={{ display: "flex", gap: "25px" }}>

                    <div style={textFieldStyle}>
                        <label>Title</label>
                        <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                            // onChange={handleDataChange}
                            name='title'
                            // value={data.name}
                            type='text'

                        />
                        {/* {error.name && <span style={{ color: 'red', fontSize: '12px' }}>{error.name}</span>} */}
                    </div>

                    <div style={textFieldStyle}>
                        <label>Title</label>
                        <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                            // onChange={handleDataChange}
                            name='title'
                        // value={data.address}

                        />
                        {/* {error.address && <span style={{ color: 'red', fontSize: '12px' }}>{error.address}</span>} */}
                    </div>
                </Stack>


            </Box>


        </>
    )
}

export default EducatorLearningPlan
