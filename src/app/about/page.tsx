import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Zap, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about MoreFusion and our mission to provide free productivity tools and tech insights.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About MoreFusion
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering productivity through innovative tools and insightful content
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12 animate-slide-up">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              At MoreFusion, we believe that productivity should be accessible to everyone. 
              Our mission is to provide free, high-quality tools and educational content that 
              help individuals and teams work more efficiently and stay informed about the 
              latest developments in technology.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Target className="h-8 w-8 text-blue-500" />
                <h3 className="text-xl font-semibold">Precision</h3>
              </div>
              <p className="text-muted-foreground">
                We ensure accuracy in all our calculations and provide reliable information 
                you can trust for important decisions.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Zap className="h-8 w-8 text-yellow-500" />
                <h3 className="text-xl font-semibold">Speed</h3>
              </div>
              <p className="text-muted-foreground">
                Our tools are optimized for performance, providing instant results 
                without compromising on functionality.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Users className="h-8 w-8 text-green-500" />
                <h3 className="text-xl font-semibold">Community</h3>
              </div>
              <p className="text-muted-foreground">
                We build tools and create content with our community in mind, 
                always listening to feedback and evolving based on user needs.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Heart className="h-8 w-8 text-red-500" />
                <h3 className="text-xl font-semibold">Passion</h3>
              </div>
              <p className="text-muted-foreground">
                We&apos;re passionate about technology and productivity, and this 
                enthusiasm drives us to create the best possible experience.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Offer */}
        <Card className="animate-slide-up">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">Productivity Tools</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• BMI & Calorie Calculators for health tracking</li>
                  <li>• Resume builder with ATS-friendly templates</li>
                  <li>• EMI calculator for financial planning</li>
                  <li>• Text editor with PDF export functionality</li>
                  <li>• Date & time calculations</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-600">Tech Content</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• AI and machine learning insights</li>
                  <li>• Web development tutorials and guides</li>
                  <li>• Coding best practices and tips</li>
                  <li>• Entertainment and tech news</li>
                  <li>• Product reviews and comparisons</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
