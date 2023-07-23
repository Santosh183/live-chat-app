const router = require('express').Router();
const authMiddlewaire = require('../middlewares/authMiddlewaire');
const Chat = require('../models/chatModel');
const Message = require('../models/messagesModel');

// send message 
router.post('/new-message', authMiddlewaire, async (req, res) => {
    try {
        // store messages
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();

        // update chat 
        await Chat.findByIdAndUpdate(
            {
                _id: req.body.chat
            },
            {
                lastMessage: savedMessage,
                $inc: { 'unreadMessagesCount': 1 }
            }
        );

        res.send({
            success: true,
            message: 'Message send successfully',
            data: savedMessage
        });

    } catch (error) {
        res.send({
            success: false,
            message: 'Error while sending message',
            error: error.message
        });
    }
});

router.get("/get-all-messages/:chatId", async (req, res) => {
    try {
        const messages = await Message.find({
            chat: req.params.chatId
        }).sort({ updatedAt: 1 });

        res.send({
            success: true,
            message: 'Fetched message successfully',
            data: messages
        });
    } catch (error) {
        res.send({
            success: false,
            message: 'Error while fetching message',
            error: error.message
        });
    }
});

module.exports = router;
