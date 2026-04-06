const nodemailer = require('nodemailer');

exports.escalateToAgent = async (req, res) => {
    try {
        const { messages, userEmail = 'Not Provided' } = req.body;

        // Configure Nodemailer for Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SUPPORT_GMAIL_USER, // e.g., 'your-support@gmail.com'
                pass: process.env.SUPPORT_GMAIL_PASS, // e.g., 'your-app-password'
            },
        });

        // Format conversation history for email
        const chatHistoryHtml = messages
            .map(
                (msg) =>
                    `<div style="margin-bottom: 15px; border-left: 4px solid ${
                        msg.sender === 'user' ? '#3B82F6' : '#10B981'
                    }; padding-left: 10px;">
                        <b style="color: ${msg.sender === 'user' ? '#3B82F6' : '#10B981'};">
                            ${msg.sender.toUpperCase()}:
                        </b>
                        <p style="margin: 5px 0;">${msg.text}</p>
                        <small style="color: #6B7280;">${new Date(msg.timestamp).toLocaleString()}</small>
                    </div>`
            )
            .join('');

        const mailOptions = {
            from: process.env.SUPPORT_GMAIL_USER,
            to: process.env.SUPPORT_GMAIL_USER, // In a real scenario, this would go to a specialized support inbox
            subject: `[Support Escalation] Chat with ${userEmail}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; color: #1F2937;">
                    <h2 style="color: #3B82F6; border-bottom: 2px solid #E5E7EB; padding-bottom: 10px;">
                        New Support Escalation
                    </h2>
                    <p><b>User Email:</b> ${userEmail}</p>
                    <p><b>Status:</b> Immediate attention required.</p>
                    
                    <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <h3 style="margin-top: 0;">Conversation History</h3>
                        ${chatHistoryHtml}
                    </div>
                    
                    <p style="margin-top: 30px; border-top: 1px solid #E5E7EB; padding-top: 15px; font-size: 12px; color: #9CA3AF;">
                        Sent automatically by SwiftLogix Support AI. 
                        Reply to this email to continue the conversation if integrated with a helpdesk system.
                    </p>
                </div>
            `,
        };

        // If credentials are missing, we log but still return success for demo purposes
        if (!process.env.SUPPORT_GMAIL_USER || !process.env.SUPPORT_GMAIL_PASS) {
            console.warn('GMAIL CREDENTIALS MISSING: Skipping real email send, but chat history captured.');
            return res.status(200).json({ 
                success: true, 
                message: 'Support escalation simulated (credentials missing).',
                capturedHistory: messages.length
            });
        }

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Support agent notified successfully.' });

    } catch (error) {
        console.error('Support Escalation Error:', error);
        res.status(500).json({ success: false, message: 'Failed to notify support agent.' });
    }
};
