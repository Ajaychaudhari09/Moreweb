import { Metadata } from "next";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HelpCircle, Mail, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
    title: "Help & FAQ - MoreFusion",
    description: "Frequently asked questions and support for MoreFusion tools.",
};

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Hero Section */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
                        <HelpCircle className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
                        How can we help you?
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Find answers to common questions about our tools, account management, and more.
                    </p>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-12 animate-slide-up">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900">Frequently Asked Questions</h2>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg font-medium">Is MoreFusion free to use?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 leading-relaxed">
                                Yes! The vast majority of our tools, including the Resume Maker, Calculators, and Text Editor, are completely free to use. We believe in making productivity accessible to everyone.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg font-medium">Do I need to create an account?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 leading-relaxed">
                                No, you can use most of our tools without an account. However, creating a free account allows you to save your work (like resumes or documents) and access it from any device.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg font-medium">Is my data private and secure?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 leading-relaxed">
                                Absolutely. We prioritize your privacy. Most of our tools process data locally in your browser, meaning your files often never leave your device. For features that require server processing, we use industry-standard encryption and do not sell your personal data. Check our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> for more details.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4">
                            <AccordionTrigger className="text-lg font-medium">Can I suggest a new tool?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 leading-relaxed">
                                We love hearing from our community! If you have an idea for a tool that would make your life easier, please send us a message via our contact form. We regularly build new tools based on user feedback.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-5">
                            <AccordionTrigger className="text-lg font-medium">How accurate are the calculators?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 leading-relaxed">
                                Our calculators (BMI, EMI, etc.) use standard, verified formulas. However, they are intended for informational purposes only. For financial or health decisions, we always recommend consulting with a professional.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Contact Options */}
                <div className="grid md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Mail className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold">Email Support</h3>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Have a specific question or issue? Drop us an email and we'll get back to you within 24-48 hours.
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <a href="mailto:newsletter@morefusion.in">Contact Support</a>
                        </Button>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <MessageSquare className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold">Community</h3>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Join our community to discuss tools, share tips, and connect with other productivity enthusiasts.
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/contact">Get Involved</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
