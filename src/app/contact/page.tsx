"use client";

import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

// Metadata needs to be in a separate layout or server component if using "use client"
// For simplicity in this file structure, we'll omit export metadata here or use a wrapper.
// Since this is a page.tsx, let's make it a client component for the form.

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send data to a server
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Hero Section */}
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We'd love to hear from you. Whether you have a question about our tools,
                        feedback, or just want to say hello.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {/* Contact Info */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="animate-slide-up">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <Mail className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Email Us</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    For general inquiries and support:
                                </p>
                                <a
                                    href="mailto:newsletter@morefusion.in"
                                    className="text-blue-600 font-medium hover:underline break-all"
                                >
                                    newsletter@morefusion.in
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <MessageSquare className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Social</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Follow us for updates and tips:
                                </p>
                                <div className="flex gap-4">
                                    {/* Social icons would go here, reusing Footer logic if needed */}
                                    <span className="text-sm text-slate-500">@MoreFusion</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

                                {submitted ? (
                                    <div className="bg-green-50 text-green-800 p-6 rounded-xl text-center">
                                        <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                                        <p>Thank you for reaching out. We'll get back to you shortly.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium">Name</label>
                                                <Input id="name" placeholder="Your name" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                                <Input id="email" type="email" placeholder="your@email.com" required />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                                            <Input id="subject" placeholder="What is this regarding?" required />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                                            <Textarea
                                                id="message"
                                                placeholder="How can we help you?"
                                                className="min-h-[150px]"
                                                required
                                            />
                                        </div>

                                        <Button type="submit" className="w-full md:w-auto">
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Message
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
