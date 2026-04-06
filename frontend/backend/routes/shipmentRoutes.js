const express = require('express');
const router = express.Router();
const {
    trackShipment,
    createShipment,
    updateShipmentStatus,
    updateShipmentFinancials,
    getAllShipments,
    deleteShipment,
    getUserShipments
} = require('../controllers/shipmentController');
const { protect, admin } = require('../middleware/authMiddleware');

const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.get('/track/:trackingNumber', trackShipment);

// Auth required from here
router.use(protect);

router.get('/my-shipments', getUserShipments);

// Admin required from here
router.use(admin);

router.route('/')
    .get(getAllShipments)
    .post(
        [
            body('senderName').notEmpty().withMessage('Sender name is required'),
            body('receiverName').notEmpty().withMessage('Receiver name is required'),
            body('receiverEmail').isEmail().withMessage('Valid receiver email is required'),
            body('currentLocation').notEmpty().withMessage('Starting location is required')
        ],
        validate,
        createShipment
    );

router.route('/:id/status').put(
    [
        body('status').notEmpty().withMessage('Status is required'),
        body('location').notEmpty().withMessage('Location is required')
    ],
    validate,
    updateShipmentStatus
);

router.route('/:id/financials').put(updateShipmentFinancials);

router.route('/:id').delete(deleteShipment);

module.exports = router;
