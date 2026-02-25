const express = require('express');
const router = express.Router();
const { createRequest, getProviderRequests, getNGORequests, updateRequestStatus, instantClaimAlert, studentClaim } = require('../controllers/requestController');
const { auth, roleCheck } = require('../middleware/auth');

router.post('/', auth, roleCheck(['ngo']), createRequest);
router.post('/instant-claim', auth, roleCheck(['ngo']), instantClaimAlert);
router.post('/student-claim', auth, roleCheck(['student']), studentClaim);
router.get('/provider', auth, roleCheck(['provider']), getProviderRequests);
router.get('/ngo', auth, roleCheck(['ngo', 'student']), getNGORequests);
router.patch('/:id/status', auth, roleCheck(['provider', 'admin']), updateRequestStatus);

module.exports = router;
