import Link from 'next/link';
import { Shield, Users, AlertTriangle, MessageSquare } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Aegis</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/user" className="text-gray-600 hover:text-gray-900">
                User Registration
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                Admin Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Mediated Event Safety Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform event alerts into personalized, two-way conversations. 
            Get tailored safety instructions based on your location, medical conditions, and real-time conditions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <div className="flex justify-center mb-4">
              <MessageSquare className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Smart Alerts
            </h3>
            <p className="text-gray-600">
              Receive personalized safety alerts via text or voice call, 
              tailored to your specific needs and location.
            </p>
          </Card>

          <Card className="text-center">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Two-Way Communication
            </h3>
            <p className="text-gray-600">
              Ask questions and get real-time assistance from our AI safety 
              assistant that knows your context and needs.
            </p>
          </Card>

          <Card className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-primary-600" />
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
          <Card className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              For Event Attendees
            </h3>
            <p className="text-gray-600 mb-6">
              Register to receive personalized safety alerts and get instant help when you need it.
            </p>
            <Link href="/user">
              <Button variant="primary" size="lg">
                Register Now
              </Button>
            </Link>
          </Card>

          <Card className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              For Event Organizers
            </h3>
            <p className="text-gray-600 mb-6">
              Send targeted alerts and manage event safety communications with our admin dashboard.
            </p>
            <Link href="/admin">
              <Button variant="secondary" size="lg">
                Admin Dashboard
              </Button>
            </Link>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Aegis. Built for the xAI Vercel Hackathon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
