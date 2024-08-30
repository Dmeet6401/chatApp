const express = require('express');
const router = express.Router();
const {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getPendingFriendRequests,
} = require('../Controllers/friendRequestController'); // Adjust path as needed

// Route to send a friend request
router.post('/send', sendFriendRequest);

// Route to accept a friend request
router.post('/accept', acceptFriendRequest);

// Route to decline a friend request
router.post('/decline', declineFriendRequest);

// Route to get all pending friend requests for a user
router.get('/pending/:userId', getPendingFriendRequests);

module.exports = router;
