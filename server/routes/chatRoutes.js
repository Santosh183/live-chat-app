const router = require('express').Router();
const authMiddlewaire = require('../middlewares/authMiddlewaire');
const Chat = require('../models/chatModel');
const Messages = require('../models/messagesModel');


// create new chat 
router.post('/create-new-chat', authMiddlewaire, async (req, res) => {
    try {
        const newChat = new Chat(req.body);
        const savedChat = await newChat.save();
        await savedChat.populate('members');
        res.send({
            success: true,
            message: 'Created chat successfully',
            data: savedChat
        });

    } catch (error) {
        res.send({
            success: false,
            message: 'Error while creating chat',
            error: error.message
        });
    }
});


// get all chats of current user
router.get('/get-all-chats', authMiddlewaire, async (req, res) => {
    try {
        const chats = await Chat.find({
            members: {
                $in: [req.body.userId]
            }
        }).populate('members').populate('lastMessage').sort({ updatedAt: -1 });
        res.send({
            success: true,
            message: 'Fetched chats successfully',
            data: chats
        });

    } catch (error) {
        res.send({
            success: false,
            message: 'Error while fetching chats',
            error: error.message
        });
    }
});

// clear unread messages for chat 
router.post('/clear-unread-messages', authMiddlewaire, async (req, res) => {
    try {
        const chat = await Chat.findById(req.body.chat);
        if (!chat) {
            return res.send({
                success: false,
                message: 'Chat not found',

            })
        }
        const updatedChat = await Chat.findByIdAndUpdate(
            req.body.chat,
            {
                unreadMessagesCount: 0,
            },
            { new: true }

        ).populate('members').populate('lastMessage');


        await Messages.updateMany(
            {
                chat: req.body.chat,
                read: false
            },
            {
                read: true
            }
        );

        res.send({
            success: true,
            message: 'Unread messages cleard successfully',
            data: updatedChat
        });

    } catch (error) {
        res.send({
            success: false,
            message: 'Error while clearing unread messages',
            error: error.message
        });
    }
});

module.exports = router;