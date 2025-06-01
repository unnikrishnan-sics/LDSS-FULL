import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  Box, Typography, Avatar, TextField, IconButton,
  Divider, CircularProgress, Button
} from '@mui/material';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ParentNavbar from '../Navbar/ParentNavbar';
import EmailIcon from '@mui/icons-material/Email';
import ParentChatSideBar from './Common/ParentChatSideBar';

// Date formatting utility function
const formatMessageDate = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const messageDate = new Date(dateString);
  messageDate.setHours(0, 0, 0, 0);

  const diffTime = today - messageDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const day = messageDate.getDate();
  const month = monthNames[messageDate.getMonth()];

  if (diffDays === 0) {
    return `Today, ${month} ${day}`;
  } else if (diffDays === 1) {
    return `Yesterday, ${month} ${day}`;
  } else {
    return `${month} ${day}`;
  }
};

const ParentChat = () => {
  const { id } = useParams(); // `id` is the participant ID (educator or therapist)
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Initialize parentDetails from localStorage, but expect it to be fetched if not found
  const [parentDetails, setParentDetails] = useState(() => {
    const cachedData = localStorage.getItem("parentDetails");
    return cachedData ? JSON.parse(cachedData) : null;
  });

  const [participantDetails, setParticipantDetails] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false); // Controls chat content loading
  const [initialLoading, setInitialLoading] = useState(true); // Controls overall initial loading (parent details)
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState(null);

  // Extract these from location.state once, as they are part of the current chat context
  const userType = location.state?.userType;
  const studentIdFromState = location.state?.studentId;

  const fetchParticipantDetails = async (participantId) => {
    console.log('fetchParticipantDetails called for ID:', participantId, 'userType:', userType);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      let endpoint = '';
      if (userType === 'educator') {
        endpoint = `http://localhost:4000/ldss/educator/geteducator/${participantId}`;
      } else if (userType === 'theraphist') { // This correctly matches 'theraphist' from sidebar
        endpoint = `http://localhost:4000/ldss/theraphist/gettheraphist/${participantId}`;
      } else {
        setError('Invalid participant type provided. User type:', userType);
        console.error('Invalid participant type provided. userType:', userType);
        return;
      }
      console.log('Fetching participant details from endpoint:', endpoint);

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        console.log('Participant details response data:', response.data);
        // Correctly access data based on the dynamic userType
        setParticipantDetails(response.data[userType]); // e.g., response.data.educator or response.data.theraphist
        setStudentName(location.state?.studentName || '');
      }
    } catch (error) {
      console.error('Error fetching participant details:', error);
      setError('Failed to load participant details.');
      setLoading(false);
    }
  };

  const getOrCreateConversation = async () => {
    console.log('getOrCreateConversation called.');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return null;
      }

      const decoded = jwtDecode(token);
      const parentUserId = decoded.id;

      console.log('Participant ID (educator/therapist from URL params):', id);
      console.log('Current Parent User ID (from token):', parentUserId);
      console.log('Student ID from location state:', studentIdFromState);
      console.log('User Type from location state:', userType);

      // Crucial check: for parent chats, studentId is required by backend.
      if (!studentIdFromState) {
        setError('Cannot start conversation: A specific student is required for parent chats. This parent might not have an associated student for you to chat about.');
        console.error('getOrCreateConversation failed: Missing studentIdFromState.');
        return null;
      }

      // First try to find existing conversation
      const existingConvsRes = await axios.get(
        `http://localhost:4000/ldss/conversations/user/${parentUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('All existing conversations for current parent:', existingConvsRes.data);

      const existingConv = existingConvsRes.data.find(conv => {
        const isParticipant1 = conv.participants.includes(id); // Checks if educator/therapist is participant
        const isParticipant2 = conv.participants.includes(parentUserId); // Checks if parent is participant
        // Ensure to compare student IDs, handling both populated object and direct ID string
        const studentMatches = conv.student ? String(conv.student._id || conv.student) === String(studentIdFromState) : false;
        
        console.log(`- Checking conversation (ID: ${conv._id}):`);
        console.log(`  - Participants include selected ID (${id}): ${isParticipant1}`);
        console.log(`  - Participants include parent ID (${parentUserId}): ${isParticipant2}`);
        console.log(`  - Student ID match (DB: ${conv.student?._id || conv.student}, State: ${studentIdFromState}): ${studentMatches}`);
        
        return isParticipant1 && isParticipant2 && studentMatches;
      });

      if (existingConv) {
        console.log('Found existing conversation:', existingConv._id);
        setConversationId(existingConv._id);
        setMessages(existingConv.messages || []);
        return existingConv._id;
      }

      console.log('No existing conversation found matching criteria. Attempting to create new one.');
      const requestData = {
        participants: [parentUserId, id], // Parent ID and Educator/Therapist ID
        participantModels: ['parent', userType], // userType will be 'educator' or 'theraphist'
        student: studentIdFromState // Include student ID for new conversation
      };
      console.log('New conversation request data:', requestData);
      
      const newConv = await axios.post(
        'http://localhost:4000/ldss/conversations',
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Successfully created new conversation:', newConv.data._id);
      setConversationId(newConv.data._id);
      return newConv.data._id;
    } catch (error) {
      console.error('Error handling conversation (getOrCreateConversation):', error);
      setError(error.response?.data?.message || 'Failed to create conversation. Please try again.');
      return null;
    }
  };

  const fetchMessages = async (convId) => {
    if (!convId) return;
    console.log('Fetching messages for conversation ID:', convId);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:4000/ldss/conversations/${convId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        console.log('Messages fetched:', response.data.messages);
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) {
      console.warn('Cannot send message: Message is empty or conversationId is missing.');
      return;
    }
    console.log('Attempting to send message:', newMessage);

    const tempId = Date.now().toString(); // Temporary ID for optimistic update
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);

      const newMsg = {
        sender: decoded.id, // Parent's ID
        senderModel: 'parent',
        content: newMessage.trim()
      };

      // Optimistic update: Add message to UI immediately
      setMessages(prev => [...prev, {
        ...newMsg,
        _id: tempId,
        timestamp: new Date().toISOString(),
        read: false
      }]);
      setNewMessage("");
      console.log('Optimistically updated messages. Sending to backend...');

      // Send message to backend
      await axios.post(
        `http://localhost:4000/ldss/conversations/${conversationId}/messages`,
        newMsg,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Message sent successfully to backend. Re-fetching messages.');

      // Re-fetch messages to get the actual _id and ensure consistency
      fetchMessages(conversationId);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg._id !== tempId)); // Revert optimistic update
      setError('Failed to send message.');
      if (error.response && error.response.data && error.response.data.message) {
        console.error('Backend error message:', error.response.data.message);
        setError(`Failed to send message: ${error.response.data.message}`);
      }
    }
  };

  // Main effect hook to manage data fetching and loading states
  useEffect(() => {
    const fetchAllChatData = async () => {
      console.log('fetchAllChatData triggered.');
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        setInitialLoading(false);
        return;
      }

      // 1. Fetch parent details if not already loaded from cache
      if (!parentDetails) {
        console.log('Parent details not in state, fetching from API...');
        try {
          const decoded = jwtDecode(token);
          const parentId = decoded.id;
          const response = await axios.get(`http://localhost:4000/ldss/parent/getparent/${parentId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data?.parent) {
            setParentDetails(response.data.parent);
            localStorage.setItem("parentDetails", JSON.stringify(response.data.parent));
            console.log('Parent details fetched and cached:', response.data.parent);
          } else {
            setError('Failed to load parent profile. Data incomplete.');
            setInitialLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error fetching parent details:', err);
          setError('Failed to load parent profile. Please check your connection or try again.');
          setInitialLoading(false);
          return;
        }
      }

      // 2. Fetch chat-specific data if a participant `id` is provided
      if (id && userType && studentIdFromState) { // Ensure all necessary state from sidebar is present
        console.log('Chat-specific parameters available: id=', id, 'userType=', userType, 'studentIdFromState=', studentIdFromState);
        setLoading(true);
        setError(null); // Clear error for new chat selection
        try {
          await fetchParticipantDetails(id);
          const convId = await getOrCreateConversation();
          if (convId) {
            await fetchMessages(convId);
          } else {
            // getOrCreateConversation already set an error if it returned null
            console.warn('Conversation ID not obtained. Chat will not load messages.');
          }
        } catch (err) {
          console.error('An unexpected error occurred during chat setup:', err);
          setError(prev => prev || 'An unexpected error occurred during chat setup.');
        } finally {
          setLoading(false);
        }
      } else if (id && (!userType || !studentIdFromState)) {
         setError('Incomplete chat information. Please select a chat from the sidebar. (Missing userType or studentId)');
         console.error('Incomplete chat information for selected ID:', id, 'userType:', userType, 'studentIdFromState:', studentIdFromState);
         setLoading(false);
      }
      else {
        console.log('No chat selected or parameters missing for initial load.');
        setLoading(false); // No specific chat selected, stop chat content loading
      }
      setInitialLoading(false); // Overall initial loading is complete
    };

    fetchAllChatData();
  }, [id, location.state, navigate, parentDetails, userType, studentIdFromState]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Display initial loading spinner until parent details are loaded
  if (initialLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <ParentNavbar
        parentdetails={parentDetails}
        navigateToProfile={() => navigate('/parent/profile')}
      />
      <Box sx={{
        background: '#F6F7F9',
        width: "100%",
        height: "90.5vh",
        overflow: 'hidden',
        display: 'flex'
      }}>
        {/* Sidebar */}
        <Box flexBasis="20%" sx={{ height: "100%" }}>
          {parentDetails ? (
            <ParentChatSideBar parentDetails={parentDetails} />
          ) : (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              backgroundColor: 'white',
              borderRadius: "12px",
              margin: "15px"
            }}>
              <CircularProgress />
            </Box>
          )}
        </Box>

        {/* Main Chat Area */}
        <Box flexBasis="80%" sx={{
          height: "100%",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {error ? (
            <Box sx={{
              backgroundColor: "white",
              padding: "20px",
              margin: "15px",
              borderRadius: "12px",
              width: "100%",
              height: "90%",
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <Typography color="error" variant="h6" sx={{ mb: 2 }}>
                Error: {error}
              </Typography>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
                sx={{ mt: 2 }}
              >
                Refresh Page
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/parent/chat')}
                sx={{ mt: 2 }}
              >
                Back to Chat List
              </Button>
            </Box>
          ) : id && participantDetails ? (
            // Main chat window when a participant is selected
            <Box sx={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "100%",
              height: "90%",
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <Box sx={{
                p: 2,
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => navigate('/parent/chat')} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Avatar sx={{
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem',
                    bgcolor: '#384371'
                  }}>
                    {participantDetails.name?.charAt(0) || ''}
                  </Avatar>
                  <Typography variant="h6" sx={{
                    color: '#384371',
                    ml: 1
                  }}>
                    {participantDetails.name}
                  </Typography>
                </Box>
                {studentName && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{
                      color: '#384371',
                      fontWeight: 500,
                      mr: 0.5
                    }}>
                      {studentName}'s {userType === 'parent' ? 'Parent' : (userType === 'theraphist' ? 'Therapist' : 'Educator')}
                    </Typography>
                    <Avatar sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.875rem',
                      bgcolor: '#384371',
                    }}>
                      {studentName.charAt(0)}
                    </Avatar>
                  </Box>
                )}
              </Box>

              {/* Chat Content Area */}
              {loading ? (
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{
                  flex: 1,
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  },
                  p: 2
                }}>
                  {/* Profile Section (always visible at top of chat content) */}
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    pt: 4,
                  }}>
                    <Avatar sx={{
                      width: 80,
                      height: 80,
                      fontSize: '2rem',
                      bgcolor: '#384371',
                      mb: 2
                    }}>
                      {participantDetails.name?.charAt(0) || ''}
                    </Avatar>
                    <Typography variant="h5" sx={{
                      color: '#384371',
                      fontWeight: 500,
                      textAlign: 'center'
                    }}>
                      {participantDetails.name}
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt: 1
                    }}>
                      <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1" color="text.secondary">
                        {participantDetails.email}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Messages */}
                  <Box sx={{ py: 2 }}>
                    {messages.map((msg, idx) => {
                      const showDate = idx === 0 ||
                        new Date(messages[idx - 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString();

                      const isParent = msg.senderModel === 'parent';

                      return (
                        <React.Fragment key={msg._id || idx}>
                          {showDate && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                              <Typography variant="h5" sx={{
                                color: '#384371',
                                px: 2,
                                py: 0.5,
                                fontSize: '0.8em',
                                backgroundColor: '#E0E0E0',
                                borderRadius: '15px'
                              }}>
                                {formatMessageDate(msg.timestamp)}
                              </Typography>
                            </Box>
                          )}

                          <Box sx={{
                            display: 'flex',
                            mb: 2,
                            flexDirection: isParent ? 'row-reverse' : 'row',
                            alignItems: 'flex-end',
                            gap: 1
                          }}>
                            {!isParent && (
                              <Avatar sx={{
                                width: 32,
                                height: 32,
                                fontSize: '0.875rem',
                                bgcolor: '#384371'
                              }}>
                                {participantDetails.name?.charAt(0) || ''}
                              </Avatar>
                            )}

                            <Box sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: isParent ? 'flex-end' : 'flex-start',
                              minWidth: 0,
                              flexGrow: 1
                            }}>
                              <Typography variant="caption" sx={{
                                color: 'text.secondary',
                                mb: 0.5,
                                alignSelf: isParent ? 'flex-end' : 'flex-start'
                              }}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                              <Box sx={{
                                backgroundColor: isParent ? '#1976d2' : '#F0F6FE', // Use primary color for parent messages
                                color: isParent ? 'white' : 'black',
                                px: 2,
                                py: 1,
                                borderRadius: '20px',
                                maxWidth: '70%',
                                overflowWrap: 'break-word',
                                wordBreak: 'normal'
                              }}>
                                {msg.content}
                              </Box>
                            </Box>
                          </Box>
                        </React.Fragment>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </Box>
                </Box>
              )}

              {/* Message Input */}
              <Divider sx={{backgroundColor: '#f0f0f0'}} />
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newMessage.trim()) handleSendMessage();
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '35px',
                      backgroundColor: '#FFFFFF',
                      pr: '45px',
                    },
                    flexGrow: 1
                  }}
                />
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  sx={{
                    ml: -5,
                    p: 1
                  }}
                >
                  <SendOutlinedIcon color={newMessage.trim() ? "primary" : "disabled"} />
                </IconButton>
              </Box>
            </Box>
          ) : (
            // Default view when no chat is selected
            <Box
              sx={{
                backgroundColor: "white",
                padding: "10px",
                margin: "15px",
                borderRadius: "12px",
                width: "100%",
                height: "90%",
              }}
              display="flex"
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
              gap={5}
            >
              <Typography sx={{
                color: 'black',
                fontSize: '24px',
                fontWeight: "600",
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                Welcome <WavingHandIcon sx={{ color: "gold", fontSize: 30 }} /> {parentDetails?.name || 'Parent'} <AutoAwesomeIcon sx={{ color: "gold", fontSize: 30 }} />
              </Typography>
              <Typography sx={{
                color: 'text.secondary',
                fontSize: '18px',
                fontWeight: "500"
              }}>
                Select a chat from the sidebar to start messaging.
              </Typography>
              <ChatIcon sx={{ fontSize: 80, color: 'action.disabled' }} />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ParentChat;