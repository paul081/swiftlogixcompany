'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Headset, Loader2 } from 'lucide-react';
import axios from 'axios';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
};

const BOT_KNOWLEDGE = [
    {
        keywords: ['package', 'parcel', 'where', 'status', 'track'],
        response: "To track your package, please enter your tracking number on our 'Track Shipment' page at /track. For additional help, email swift.wideworldlogistics@gmail.com."
    },
    {
        keywords: ['cost', 'price', 'rate', 'how much'],
        response: "Shipping costs depend on weight and destination. Get an instant quote on our 'Services' page! For custom quotes, contact swift.wideworldlogistics@gmail.com."
    },
    {
        keywords: ['international', 'global', 'worldwide', 'countries'],
        response: "Yes! We deliver to 150+ countries. For specific country inquiries, please reach out to swift.wideworldlogistics@gmail.com."
    },
    {
        keywords: ['how long', 'time', 'delivery time', 'speed'],
        response: "Express: 1-3 days. Standard: 3-5 days. For delay inquiries, please mail swift.wideworldlogistics@gmail.com."
    }
];

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi there! I'm SwiftBot. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isEscalated, setIsEscalated] = useState(false);
    const [isEscalating, setIsEscalating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const findBotResponse = (userInput: string) => {
        const input = userInput.toLowerCase();
        
        // Check for escalation first
        if (input.includes('agent') || input.includes('human') || input.includes('support') || input.includes('talk to')) {
            return { action: 'escalate' };
        }

        const match = BOT_KNOWLEDGE.find(k => k.keywords.some(kw => input.includes(kw)));
        return match ? { response: match.response } : { response: "I'm not sure I understand. Would you like to speak to a human agent? You can also email us at swift.wideworldlogistics@gmail.com." };
    };

    const handleEscalation = async (currentMessages: Message[]) => {
        setIsEscalating(true);
        try {
            await axios.post(`${BACKEND_URL}/support/escalate`, {
                messages: currentMessages.map(m => ({
                    text: m.text,
                    sender: m.sender,
                    timestamp: m.timestamp
                }))
            });
            
            const agentResponse: Message = {
                id: Date.now().toString(),
                text: "I've notified our support team! An agent will review this chat shortly. You can also follow up directly at swift.wideworldlogistics@gmail.com.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, agentResponse]);
            setIsEscalated(true);
        } catch (error) {
            console.error('Escalation failed', error);
            const errorMsg: Message = {
                id: Date.now().toString(),
                text: "Sorry, I'm having trouble reaching our human agents. Please try again or contact us via our main support page.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsEscalating(false);
            setIsTyping(false);
        }
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isEscalating) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInputValue('');

        // Prevent bot response if already escalated (unless we handle real-time later)
        if (isEscalated) return;

        setIsTyping(true);
        
        // Artificial delay for realism
        setTimeout(async () => {
            const lastMsg = messages[messages.length - 1];
            const isFallbackPrompt = lastMsg?.text === "I'm not sure I understand. Would you like to speak to a human agent?";
            const isAffirmative = ['yes', 'yeah', 'yep', 'ok', 'sure', 'pls', 'please'].some(word => userMsg.text.toLowerCase().includes(word));

            if (isFallbackPrompt && isAffirmative) {
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Kindly send your issues to our mail: swift.wideworldlogistics@gmail.com. Our support team will get back to you as soon as possible.",
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMsg]);
                setIsTyping(false);
                return;
            }

            const result = findBotResponse(userMsg.text);

            if (result.action === 'escalate') {
                await handleEscalation(updatedMessages);
            } else {
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: result.response!,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMsg]);
                setIsTyping(false);
            }
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
                    >
                        {/* Header */}
                        <div className="bg-blue-600 p-4 text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    {isEscalated ? <Headset size={20} /> : <Bot size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">
                                        {isEscalated ? 'Human Support Escalated' : 'SwiftLogix Assistant'}
                                    </h3>
                                    <span className="text-[10px] text-blue-100 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        Available Now
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm
                                            ${msg.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
                                        >
                                            {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                                        </div>
                                        <div className={`p-3 rounded-2xl text-sm shadow-sm
                                            ${msg.sender === 'user' 
                                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}
                                        >
                                            {msg.text}
                                            <div className={`text-[10px] mt-1 opacity-60 text-right`}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={isEscalating ? "Notifying agent..." : "Type your message..."}
                                disabled={isEscalating}
                                className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isEscalating}
                                className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-blue-100 disabled:hover:text-blue-600"
                            >
                                {isEscalating ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center
                    ${isOpen ? 'bg-red-500 text-white rotate-90' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
}
