'use client';

import Link from 'next/link';
import { Shield, Users, AlertTriangle, MessageSquare, Sparkles, Zap } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`,
          }}
        />
      ))}

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="relative">
                <Shield className="h-8 w-8 text-white mr-3 pulse-glow" />
                <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">Aegis</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/user" className="text-white/90 hover:text-white transition-colors duration-300 font-medium">
                User Registration
              </Link>
              <Link href="/admin" className="text-white/90 hover:text-white transition-colors duration-300 font-medium">
                Admin Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 floating">
              AI-Mediated Event Safety Platform
            </h2>
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-lg blur opacity-30"></div>
          </div>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Transform event alerts into personalized, two-way conversations. 
            Get tailored safety instructions based on your location, medical conditions, and real-time conditions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center rainbow-border floating" style={{ animationDelay: '0s' }}>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <MessageSquare className="h-12 w-12 text-indigo-600" />
                <Zap className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Smart Alerts
            </h3>
            <p className="text-gray-600">
              Receive personalized safety alerts via text or voice call, 
              tailored to your specific needs and location.
            </p>
          </Card>

          <Card className="text-center rainbow-border floating" style={{ animationDelay: '2s' }}>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Users className="h-12 w-12 text-pink-600" />
                <Sparkles className="h-6 w-6 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Two-Way Communication
            </h3>
            <p className="text-gray-600">
              Ask questions and get real-time assistance from our AI safety 
              assistant that knows your context and needs.
            </p>
          </Card>

          <Card className="text-center rainbow-border floating" style={{ animationDelay: '4s' }}>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <AlertTriangle className="h-12 w-12 text-orange-600" />
                <Zap className="h-6 w-6 text-red-400 absolute -top-1 -right-1 animate-ping" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Context-Aware
            </h3>
            <p className="text-gray-600">
              AI considers your medical conditions, location, weather, 
              and emergency contacts to provide the most relevant guidance.
            </p>
          </Card>
        </div>

        {/* CTA Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="text-center rainbow-border pulse-glow">
            <div className="flex justify-center mb-4">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              For Event Attendees
            </h3>
            <p className="text-gray-600 mb-6">
              Register to receive personalized safety alerts and get instant help when you need it.
            </p>
            <Link href="/user">
              <Button variant="primary" size="lg" className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Register Now
              </Button>
            </Link>
          </Card>

          <Card className="text-center rainbow-border pulse-glow">
            <div className="flex justify-center mb-4">
              <Shield className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              For Event Organizers
            </h3>
            <p className="text-gray-600 mb-6">
              Send targeted alerts and manage event safety communications with our admin dashboard.
            </p>
            <Link href="/admin">
              <Button variant="secondary" size="lg" className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Button>
            </Link>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/10 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-white/80">
            <p>&copy; 2024 Aegis. Built for the xAI Vercel Hackathon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
