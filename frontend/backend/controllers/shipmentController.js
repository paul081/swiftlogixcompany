const Shipment = require('../models/Shipment');
const User = require('../models/User');
const TrackingHistory = require('../models/TrackingHistory');
const { generateTrackingNumber } = require('../utils/generateTracking');

// @desc    Track shipment
// @route   GET /api/shipments/track/:trackingNumber
// @access  Public
const trackShipment = async (req, res) => {
    try {
        const trackingNumber = req.params.trackingNumber.trim().toUpperCase();
        const shipment = await Shipment.findOne({ 
            where: { trackingNumber },
            include: [{
                model: TrackingHistory,
                as: 'history',
                attributes: ['location', 'status', 'description', 'timestamp']
            }]
        });

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        res.status(200).json(shipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new shipment
// @route   POST /api/shipments
// @access  Private/Admin
const createShipment = async (req, res) => {
    try {
        const { 
            senderName, senderAddress, receiverName, receiverEmail, receiverAddress, 
            packageWeight, packageType, originCountry, destinationCountry, currentLocation 
        } = req.body;

        let trackingNumber;
        let isUnique = false;
        
        // Retry logic to guarantee uniqueness
        while (!isUnique) {
            trackingNumber = generateTrackingNumber();
            const exists = await Shipment.findOne({ where: { trackingNumber } });
            if (!exists) isUnique = true;
        }

        const shipment = await Shipment.create({
            trackingNumber,
            senderName,
            senderAddress,
            receiverName,
            receiverEmail: receiverEmail || 'customer@example.com',
            receiverAddress,
            packageWeight,
            packageType,
            originCountry: originCountry || 'Nigeria',
            destinationCountry: destinationCountry || 'United States',
            shipmentStatus: 'Register/Creating',
            currentLocation: currentLocation || 'Origin Hub',
            createdBy: req.user.id
        });

        // Add initial tracking history
        await TrackingHistory.create({
            trackingNumber,
            location: currentLocation || 'Origin Hub',
            status: 'Register/Creating',
            description: `Shipment registered and being processed for pickup from ${originCountry || 'Nigeria'}`,
            updatedBy: req.user.id
        });

        res.status(201).json(shipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update shipment status
// @route   PUT /api/shipments/:id/status
// @access  Private/Admin
const updateShipmentStatus = async (req, res) => {
    try {
        const { status, location, description } = req.body;
        const shipment = await Shipment.findByPk(req.params.id);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        await shipment.update({
            shipmentStatus: status,
            currentLocation: location
        });

        // Create a new entry in TrackingHistory
        await TrackingHistory.create({
            trackingNumber: shipment.trackingNumber,
            location,
            status,
            description,
            updatedBy: req.user.id
        });

        // NOTIFICATION SYSTEM
        try {
            const receiver = await User.findOne({ where: { email: shipment.receiverEmail } });
            if (receiver) {
                const Notification = require('../models/Notification');
                const msg = `Your SwiftLogix shipment ${shipment.trackingNumber} has reached ${location} (Status: ${status})`;
                
                // 1. Dashboard Notification
                await Notification.create({
                    userId: receiver.id,
                    title: 'Shipment Update',
                    message: msg,
                    type: 'status_update',
                    relatedId: shipment.trackingNumber
                });

                // 2. Mock Email Notification
                console.log('--------------------------------------------------');
                console.log(`[EMAIL SENT TO: ${shipment.receiverEmail}]`);
                console.log(`Subject: SwiftLogix Status Update - ${shipment.trackingNumber}`);
                console.log(`Body: ${msg}`);
                console.log('--------------------------------------------------');
            }
        } catch (notifErr) {
            console.error('Notification Error:', notifErr);
        }

        res.status(200).json(shipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all shipments for authenticated user
// @route   GET /api/shipments/my-shipments
// @access  Private
const getUserShipments = async (req, res) => {
    try {
        const shipments = await Shipment.findAll({
            where: { receiverEmail: req.user.email },
            include: [{
                model: TrackingHistory,
                as: 'history',
                attributes: ['location', 'status', 'description', 'timestamp']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(shipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all shipments (Admin)
// @route   GET /api/shipments
// @access  Private/Admin
const getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipment.findAll({
            include: [{
                model: User,
                as: 'creator',
                attributes: ['name', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(shipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateShipmentFinancials = async (req, res) => {
    try {
        const { 
            customsFees, insuranceFees, deliveryCharges, storageFees, showFinancials 
        } = req.body;
        const shipment = await Shipment.findByPk(req.params.id);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        await shipment.update({
            customsFees: customsFees !== undefined ? customsFees : shipment.customsFees,
            insuranceFees: insuranceFees !== undefined ? insuranceFees : shipment.insuranceFees,
            deliveryCharges: deliveryCharges !== undefined ? deliveryCharges : shipment.deliveryCharges,
            storageFees: storageFees !== undefined ? storageFees : shipment.storageFees,
            showFinancials: showFinancials !== undefined ? showFinancials : shipment.showFinancials
        });

        // Optional: Notify user about financial update if visibility is toggled on
        if (showFinancials) {
            try {
                const receiver = await User.findOne({ where: { email: shipment.receiverEmail } });
                if (receiver) {
                    const Notification = require('../models/Notification');
                    await Notification.create({
                        userId: receiver.id,
                        title: 'Billing Update',
                        message: `Financial details for shipment ${shipment.trackingNumber} are now available for review in your dashboard.`,
                        type: 'billing',
                        relatedId: shipment.trackingNumber
                    });
                }
            } catch (nErr) { console.error(nErr); }
        }

        res.status(200).json(shipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findByPk(req.params.id);
        if (shipment) {
            await shipment.destroy();
            res.json({ message: 'Shipment removed' });
        } else {
            res.status(404).json({ message: 'Shipment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    trackShipment,
    createShipment,
    updateShipmentStatus,
    updateShipmentFinancials,
    getAllShipments,
    deleteShipment,
    getUserShipments
};
