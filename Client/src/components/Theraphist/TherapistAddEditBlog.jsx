import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import TheraphistNavbar from '../Navbar/TheraphistNavbar';

const TherapistAddEditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [blog, setBlog] = useState({
        title: '',
        description: '',
        image: null,
        previewImage: null
    });
    const therapistDetails = JSON.parse(localStorage.getItem('theraphistDetails')) || {};

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:4000/ldss/blog/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const { title, description, image } = response.data.blog;
                    setBlog({
                        title,
                        description,
                        image,
                        previewImage: image ? `http://localhost:4000/uploads/blogs/${image.filename}` : null
                    });
                } catch (error) {
                    console.error('Error fetching blog:', error);
                }
            };
            fetchBlog();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlog(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBlog(prev => ({
                ...prev,
                image: file,
                previewImage: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', blog.title);
            formData.append('description', blog.description);
            formData.append('creatorType', 'theraphist');
            if (blog.image instanceof File) {
                formData.append('image', blog.image);
            }

            if (id) {
                await axios.put(`http://localhost:4000/ldss/blog/edit/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post('http://localhost:4000/ldss/blog/add', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            navigate('/therapist/blogs');
        } catch (error) {
            console.error('Error saving blog:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
      <TheraphistNavbar
        theraphistdetails={therapistDetails}
        navigateToProfile={() => navigate('/therapist/profile')}
      />
            <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    {id ? 'Edit Blog' : 'Add New Blog'}
                </Typography>
                
                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={blog.title}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2 }}
                            />
                            
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={blog.description}
                                onChange={handleChange}
                                required
                                multiline
                                rows={4}
                                sx={{ mb: 2 }}
                            />
                            
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1" sx={{ mb: 1 }}>Blog Image</Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {blog.previewImage && (
                                    <Box sx={{ mt: 2 }}>
                                        <img 
                                            src={blog.previewImage} 
                                            alt="Preview" 
                                            style={{ maxWidth: '100%', maxHeight: 200 }} 
                                        />
                                    </Box>
                                )}
                            </Box>
                            
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{ mt: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : id ? 'Update Blog' : 'Add Blog'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default TherapistAddEditBlog;