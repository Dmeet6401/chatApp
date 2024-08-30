const FriendRequest = require('./models/FriendRequest'); // Adjust path as needed
const User = require('./models/User'); // Adjust path as needed

// Send a friend request
const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // Check if the friend request already exists
    const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Create a new friend request
    const friendRequest = new FriendRequest({ sender: senderId, receiver: receiverId });
    await friendRequest.save();

    res.status(201).json({ message: 'Friend request sent successfully', friendRequest });
  } catch (error) {
    console.error('Error sending friend request:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Accept a friend request
const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    // Find the friend request
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Update the request status to accepted
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Add each user to the other's friends list
    const sender = await User.findById(friendRequest.sender);
    const receiver = await User.findById(friendRequest.receiver);

    sender.friends.push(receiver._id);
    receiver.friends.push(sender._id);

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: 'Friend request accepted', friendRequest });
  } catch (error) {
    console.error('Error accepting friend request:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Decline a friend request
const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    // Find the friend request
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Update the request status to declined
    friendRequest.status = 'declined';
    await friendRequest.save();

    res.status(200).json({ message: 'Friend request declined', friendRequest });
  } catch (error) {
    console.error('Error declining friend request:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all pending friend requests for a user
const getPendingFriendRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all pending friend requests for the user
    const pendingRequests = await FriendRequest.find({ receiver: userId, status: 'pending' }).populate('sender', 'firstName lastName username');

    res.status(200).json({ pendingRequests });
  } catch (error) {
    console.error('Error fetching pending friend requests:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getPendingFriendRequests,
};
