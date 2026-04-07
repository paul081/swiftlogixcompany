'use server';

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Server Action for tracking a shipment.
 * This is "appropriate" because it can be called directly from a form action,
 * doesn't expose the API endpoint to the client console, and can handle
 * server-side logging/analytics.
 */
export async function trackShipmentAction(trackingNumber: string): Promise<{ data: any; error: string | null }> {
    if (!trackingNumber) {
        return { data: null, error: 'Tracking number is required' };
    }

    try {
        const response = await axios.get(`${API_URL}/shipments/track/${trackingNumber}`);
        return { data: response.data, error: null };
    } catch (error: any) {
        console.error('Tracking Action Error:', error.response?.data || error.message);
        return { 
            data: null, 
            error: error.response?.data?.message || 'Shipment not found' 
        };
    }
}

/**
 * Server Action for admin login.
 * Handles the login server-side, preventing token leakage in client memory
 * and simplifying the login flow.
 */
export async function adminLoginAction(credentials: any): Promise<{ data: any; error: string | null }> {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return { data: response.data, error: null };
    } catch (error: any) {
        console.error('Login Action Error:', error.response?.data || error.message);
        return { 
            data: null, 
            error: error.response?.data?.message || 'Invalid credentials' 
        };
    }
}
