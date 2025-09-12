'use client';

import { useState } from 'react';
import { AlertTriangle, Send, Sparkles, Zap, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';

interface AlertFormData {
  event_name: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  event_slug: string;
}

export default function AlertForm() {
  const [formData, setFormData] = useState<AlertFormData>({
    event_name: '',
    description: '',
    urgency: 'medium',
    event_slug: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urgencyOptions = [
    { value: 'low', label: 'Low - General information' },
    { value: 'medium', label: 'Medium - Important notice' },
    { value: 'high', label: 'High - Urgent attention required' },
    { value: 'critical', label: 'Critical - Emergency action required' },
  ];

  const eventOptions = [
    { value: '', label: 'No specific event' },
    { value: 'xai-vercel-hackathon', label: 'xAI x Vercel Hackathon' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          event_slug: formData.event_slug || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        setFormData({
          event_name: '',
          description: '',
          urgency: 'medium',
          event_slug: '',
        });
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error(result.message || 'Failed to send alert');
      }
    } catch (err) {
      console.error('Error sending alert:', err);
      setError(err instanceof Error ? err.message : 'Failed to send alert');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof AlertFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear errors when user starts typing
    if (error) {
      setError(null);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <Card className="rainbow-border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2 text-red-600" />
            Send Emergency Alert
          </h2>
          {success && (
            <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Alert sent successfully!
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-red-800">Error sending alert</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Name */}
          <Input
            label="Event/Alert Name"
            placeholder="Fire Drill, Evacuation, Weather Alert, etc."
            value={formData.event_name}
            onChange={(e) => updateFormData('event_name', e.target.value)}
            required
            helperText="Short, descriptive name for the alert"
          />

          {/* Description */}
          <Textarea
            label="Alert Message"
            placeholder="Provide clear, actionable instructions for attendees..."
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            rows={4}
            required
            helperText="This message will be delivered via voice call to all registered users"
          />

          {/* Priority and Event Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Urgency Level"
              value={formData.urgency}
              onChange={(e) => updateFormData('urgency', e.target.value as AlertFormData['urgency'])}
              options={urgencyOptions}
              required
            />
            
            <Select
              label="Event Context (Optional)"
              value={formData.event_slug}
              onChange={(e) => updateFormData('event_slug', e.target.value)}
              options={eventOptions}
              helperText="Links alert to specific event FAQ for detailed responses"
            />
          </div>

          {/* Alert Preview */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
              <Zap className="h-4 w-4 mr-2 text-purple-600" />
              Alert Preview
            </h3>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getPriorityIcon(formData.urgency)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    formData.urgency === 'critical' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
                    formData.urgency === 'high' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' :
                    formData.urgency === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                    'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  }`}>
                    {formData.urgency.toUpperCase()}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                    VOICE CALL
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {formData.event_name || 'Event Name'}
                </h4>
                <p className="text-sm text-gray-700 mb-2">
                  {formData.description || 'Alert message will appear here...'}
                </p>
                {formData.event_slug && (
                  <p className="text-xs text-gray-500">
                    Event FAQ: {eventOptions.find(opt => opt.value === formData.event_slug)?.label}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant={formData.urgency === 'critical' ? 'danger' : 'primary'}
              size="lg"
              loading={loading}
              disabled={!formData.event_name.trim() || !formData.description.trim()}
              className="pulse-glow"
            >
              {formData.urgency === 'critical' ? (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Send Critical Alert
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  <Sparkles className="h-4 w-4 mr-2" />
                  Send Alert
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}