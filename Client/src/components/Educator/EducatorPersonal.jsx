import React from 'react';
import ParentNavbarSiginIn from '../Parent/ParentNavbarSiginIn'
import { Container, Stack, Typography, Box, TextField, styled, InputAdornment, Checkbox, Button, FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import profileFrame from "../../assets/profileFrame.png";
import background from "../../assets/Frame 12.png"
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Footer from '../Footer/Footer';
import UploadIcon from '@mui/icons-material/Upload';

const EducatorPersonal = () => {
    const StyledTextField = styled(TextField)({
        borderRadius: "8px",
        width: "100%",
        border: "1px solid #CCCCCC",
        '& .MuiInputBase-root': {
            height: "40px",
            padding: "0px",

            '& .MuiInputBase-input': {
                padding: '10px 0px',
            } // Adjust height within the input area
        }
    });

    const StyledSelect = styled(Select)({
        borderRadius: '8px',
        width: '100%',
        border: '1px solid #CCCCCC',
        '& .MuiInputBase-root': {
            height: '40px',
            padding: '0px',

            '& .MuiSelect-select': {
                padding: '10px 0px', // Padding inside the dropdown
            },
        },
    });

    const [selectedValue, setSelectedValue] = React.useState('');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    return (
        <>
            <ParentNavbarSiginIn />
            <Container sx={{ position: "relative" }} maxWidth="x-lg">
                <Box component="img" src={background} sx={{ position: "absolute", top: 110, left: 0, objectFit: 'cover', zIndex: -1 }}></Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                    <Typography variant='h2' color='primary' sx={{ fontSize: "32px", fontWeight: "600", marginTop: "100px" }}>Personal info</Typography>
                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: "30px", height: "293px", flexDirection: "column", marginTop: '10px' }}>
                        <Stack direction="row" sx={{ display: "flex", gap: "25px" }}>
                            <Box sx={{ height: '65px', width: '360px' }}>
                                <label>Educational Qualification</label>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel></InputLabel>
                                    <StyledSelect
                                        value={selectedValue}
                                        onChange={handleChange}
                                        inputProps={{ 'aria-label': 'Option' }}
                                        sx={{ height: "40px" }}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="option1">Option 1</MenuItem>
                                        <MenuItem value="option2">Option 2</MenuItem>
                                        <MenuItem value="option3">Option 3</MenuItem>
                                    </StyledSelect>
                                </FormControl>
                            </Box>
                            <Box sx={{ height: "65px", width: "360px" }}>
                                <label>Years of Experience</label>
                                <StyledTextField sx={{ height: "40px" }} />
                            </Box>
                        </Stack>
                        <Stack direction={'row'} sx={{ display: "flex", gap: "25px" }}>
                            <Box sx={{ height: '65px', width: '360px' }}>
                                <label>Location</label>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel></InputLabel>
                                    <StyledSelect
                                        value={selectedValue}
                                        onChange={handleChange}
                                        inputProps={{ 'aria-label': 'Option' }}
                                        sx={{ height: "40px" }}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="option1">Option 1</MenuItem>
                                        <MenuItem value="option2">Option 2</MenuItem>
                                        <MenuItem value="option3">Option 3</MenuItem>
                                    </StyledSelect>
                                </FormControl>
                            </Box>
                            <Box sx={{ height: '65px', width: '360px' }}>
                                <label>Availability</label>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel></InputLabel>
                                    <StyledSelect
                                        value={selectedValue}
                                        onChange={handleChange}
                                        inputProps={{ 'aria-label': 'Option' }}
                                        sx={{ height: "40px" }}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="option1">Option 1</MenuItem>
                                        <MenuItem value="option2">Option 2</MenuItem>
                                        <MenuItem value="option3">Option 3</MenuItem>
                                    </StyledSelect>
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction={'row'} sx={{ display: "flex", gap: "25px" }}>
                            <Box sx={{ height: "65px", width: "745px" }}>
                                <label>Certification</label>
                                <StyledTextField
                                    sx={{ height: "40px" }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <UploadIcon sx={{ cursor: 'pointer' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                        </Stack>

                    </Box>
                    {/*  */}
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '253px', gap: '10px' }}>
                        <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "10px", height: "40px", width: '150px', padding: '10px 35px' }}>Confirm</Button>
            

                    </Box>
                </Box>

            </Container>
            <Footer />
        </>
    )
}

export default EducatorPersonal
