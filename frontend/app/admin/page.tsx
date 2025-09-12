'use client';

import { useState } from 'react';
import { AlertTriangle, Phone, MessageSquare, Users, Send, Sparkles, Zap, Shield } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { AlertRequest, AlertPriority, AlertMethod, AlertTarget } from '@/types/api';

export default function AdminPage() {
  const [formData, setFormData] = useState<AlertRequest>({
    message: '',
    priority: 'info',
    method: 'text',
    target: {
      type: 'all',
    },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const priorityOptions = [
    { value: 'info', label: 'Info - General information' },
    { value: 'warning', label: 'Warning - Important notice' },
    { value: 'emergency', label: 'Emergency - Immediate action required' },
  ];

  const methodOptions = [
    { value: 'text', label: 'Text Message (SMS)' },
    { value: 'call', label: 'Voice Call' },
  ];

  const targetTypeOptions = [
    { value: 'all', label: 'All Attendees' },
    { value: 'medical_condition', label: 'Specific Medical Conditions' },
    { value: 'age_group', label: 'Age Group' },
    { value: 'location', label: 'Location-based' },
    { value: 'custom', label: 'Custom Selection' },
  ];

  const medicalConditionOptions = [
    { value: 'asthma', label: 'Asthma' },
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'heart_condition', label: 'Heart Condition' },
    { value: 'mobility_issues', label: 'Mobility Issues' },
    { value: 'pregnancy', label: 'Pregnancy' },
    { value: 'other', label: 'Other' },
  ];

  const ageGroupOptions = [
    { value: 'minors', label: 'Minors (Under 18)' },
    { value: 'adults', label: 'Adults (18-65)' },
    { value: 'seniors', label: 'Seniors (65+)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          message: '',
          priority: 'info',
          method: 'text',
          target: { type: 'all' },
        });
      } else {
        throw new Error('Failed to send alert');
      }
    } catch (error) {
      console.error('Error sending alert:', error);
      // TODO: Add proper error handling
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateTarget = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      target: {
        ...prev.target,
        [field]: value,
      },
    }));
  };

  const getPriorityIcon = (priority: AlertPriority) => {
    switch (priority) {
      case 'emergency':
        return <AlertTriangle className="h-5 w-5 text-danger-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning-600" />;
      default:
        return <MessageSquare className="h-5 w-5 text-primary-600" />;
    }
  };

  const getMethodIcon = (method: AlertMethod) => {
    return method === 'call' ? (
      <Phone className="h-5 w-5" />
    ) : (
      <MessageSquare className="h-5 w-5" />
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 floating">
              Aegis Admin Dashboard
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-lg blur opacity-30"></div>
          </div>
          <p className="text-xl text-white/90">
            Send alerts and manage event safety communications
          </p>
        </div>

        {success && (
          <Card className="mb-6 rainbow-border pulse-glow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="relative">
                  <Shield className="h-6 w-6 text-green-600" />
                  <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  Alert sent successfully! ✨
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="rainbow-border">
          <form onSubmit={handleSubmit} className="space-y-6 mx-4 my-4">
            {/* Alert Message */}
            <div>
              <Textarea
                label="Alert Message"
                placeholder="Enter your alert message here..."
                value={formData.message}
                onChange={(e) => updateFormData('message', e.target.value)}
                rows={4}
                required
                helperText="Keep messages clear and actionable. Include specific instructions when possible."
              />
            </div>

            {/* Priority and Method Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Priority Level"
                  value={formData.priority}
                  onChange={(e) => updateFormData('priority', e.target.value as AlertPriority)}
                  options={priorityOptions}
                  required
                />
              </div>
              <div>
                <Select
                  label="Delivery Method"
                  value={formData.method}
                  onChange={(e) => updateFormData('method', e.target.value as AlertMethod)}
                  options={methodOptions}
                  required
                />
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <Select
                label="Target Audience"
                value={formData.target.type}
                onChange={(e) => updateTarget('type', e.target.value)}
                options={targetTypeOptions}
                required
              />
            </div>

            {/* Conditional Target Options */}
            {formData.target.type === 'medical_condition' && (
              <div>
                <Select
                  label="Medical Condition"
                  value={formData.target.value || ''}
                  onChange={(e) => updateTarget('value', e.target.value)}
                  options={medicalConditionOptions}
                  placeholder="Select medical condition"
                  required
                />
              </div>
            )}

            {formData.target.type === 'age_group' && (
              <div>
                <Select
                  label="Age Group"
                  value={formData.target.value || ''}
                  onChange={(e) => updateTarget('value', e.target.value)}
                  options={ageGroupOptions}
                  placeholder="Select age group"
                  required
                />
              </div>
            )}

            {formData.target.type === 'location' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Latitude"
                    type="number"
                    step="any"
                    placeholder="37.7749"
                    value={formData.target.location?.latitude || ''}
                    onChange={(e) => updateTarget('location', {
                      ...formData.target.location,
                      latitude: parseFloat(e.target.value),
                    })}
                    required
                  />
                  <Input
                    label="Longitude"
                    type="number"
                    step="any"
                    placeholder="-122.4194"
                    value={formData.target.location?.longitude || ''}
                    onChange={(e) => updateTarget('location', {
                      ...formData.target.location,
                      longitude: parseFloat(e.target.value),
                    })}
                    required
                  />
                </div>
                <Input
                  label="Radius (meters)"
                  type="number"
                  placeholder="1000"
                  value={formData.target.location?.radius || ''}
                  onChange={(e) => updateTarget('location', {
                    ...formData.target.location,
                    radius: parseInt(e.target.value),
                  })}
                  required
                  helperText="Distance in meters from the specified location"
                />
              </div>
            )}

            {formData.target.type === 'custom' && (
              <div>
                <Input
                  label="Custom Target"
                  placeholder="Enter custom targeting criteria..."
                  value={formData.target.value || ''}
                  onChange={(e) => updateTarget('value', e.target.value)}
                  required
                  helperText="Specify custom targeting criteria (e.g., specific user IDs, groups, etc.)"
                />
              </div>
            )}

            {/* Alert Preview */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-purple-600" />
                Alert Preview
              </h3>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getPriorityIcon(formData.priority)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      formData.priority === 'emergency' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
                      formData.priority === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                      'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    }`}>
                      {formData.priority.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                      {getMethodIcon(formData.method)}
                      <span className="ml-1">{formData.method.toUpperCase()}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    {formData.message || 'Your alert message will appear here...'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Target: {formData.target.type.replace('_', ' ')} {formData.target.value && `- ${formData.target.value}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant={formData.priority === 'emergency' ? 'danger' : 'primary'}
                size="lg"
                loading={loading}
                disabled={!formData.message.trim()}
                className="pulse-glow"
              >
                <Send className="h-4 w-4 mr-2" />
                {formData.priority === 'emergency' ? (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Send Emergency Alert
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Send Alert
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
