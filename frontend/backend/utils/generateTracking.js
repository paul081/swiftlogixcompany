/**
 * Generates a unique tracking number for SwiftLogix
 * Format: SLX + 10-12 random alphanumeric characters
 * Total length: 13-15 characters
 */
const generateTrackingNumber = () => {
    const prefix = 'SLX';
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing O, 0, I, 1
    
    // Generate between 10 and 12 random characters (total length 13-15)
    const randomLength = Math.floor(Math.random() * 3) + 10; 
    
    let result = prefix;
    for (let i = 0; i < randomLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
};

module.exports = { generateTrackingNumber };
