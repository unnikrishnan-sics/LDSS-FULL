// chatController.js

const Conversation = require('../models/chatModel');

const ChatController = {
// In chatController.js - createConversation
async createConversation(req, res) {
  try {
    const { participants, participantModels, student } = req.body; // Changed 'child' to 'student'
    
    // Validate inputs
    if (!participants || !participantModels || 
        participants.length !== 2 || participantModels.length !== 2) {
      return res.status(400).json({ message: 'Exactly two participants required' });
    }

    // Check for existing conversation
    const existing = await Conversation.findOne({
      participants: { $all: participants },
      participantModels: { $all: participantModels },
      // Add student to existing conversation check for parent chats
      ...(participantModels.includes('parent') && student && { student: student })
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    // Validate student for parent conversations
    if (participantModels.includes('parent') && !student) { // Changed 'child' to 'student'
      return res.status(400).json({ 
        message: 'student reference required for parent conversations' // Changed 'child' to 'student'
      });
    }

    const conversation = await Conversation.create({
      participants,
      participantModels: participantModels.map(m => m.toLowerCase()), // Ensure lowercase
      student, // Changed 'child' to 'student'
      messages: []
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},

  async getUserConversations(req, res) {
    const { userId } = req.params;
    const convs = await Conversation.find({ participants: userId })
      .populate('participants')
      .populate('student') // Changed from 'child' to 'student'
      .sort({ updatedAt: -1 });

    res.json(convs);
  },

  async getConversation(req, res) {
    const { id } = req.params;
    const conv = await Conversation.findById(id)
      .populate('participants')
      .populate('student'); // Changed from 'child' to 'student'

    if (!conv) throw new NotFoundError('Conversation not found');
    res.json(conv);
  },

async  addMessage(req, res, next) {
  try {
    const { id } = req.params;
    const { sender, senderModel, content } = req.body;

    // Validate senderModel against allowed values
    const allowedModels = ['parent', 'educator', 'theraphist'];
    const normalizedSenderModel = senderModel.toLowerCase();
    
    if (!allowedModels.includes(normalizedSenderModel)) {
      return res.status(400).json({ 
        message: `Invalid sender model. Allowed values are: ${allowedModels.join(', ')}` 
      });
    }

    const conv = await Conversation.findById(id);
    if (!conv) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!conv.participants.includes(sender)) {
      return res.status(403).json({ message: 'Sender not part of this conversation' });
    }

    const newMessage = {
      sender,
      senderModel: normalizedSenderModel, // Use normalized lowercase value
      content,
      timestamp: new Date(),
      read: false
    };

    // Add message to conversation and save
    const updatedConv = await conv.addMessage(newMessage);

    res.status(201).json({
      message: 'Message added successfully',
      conversation: updatedConv,
      newMessage
    });

  } catch (error) {
    console.error('Error adding message:', error);
    
    // Handle mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
},
  async markAsRead(req, res) {
    const { id } = req.params;
    const { userId } = req.body;
    const conv = await Conversation.findById(id);
    if (!conv) throw new NotFoundError('Conversation not found');

    let changed = false;
    conv.messages.forEach(msg => {
      if (!msg.sender.equals(userId) && !msg.read) {
        msg.read = true;
        changed = true;
      }
    });

    if (changed) {
      conv.markModified('messages');
      await conv.save();
    }

    res.json({ message: 'Messages marked as read' });
  }
};

module.exports = ChatController;