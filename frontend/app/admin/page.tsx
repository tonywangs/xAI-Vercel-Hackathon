'use client';

import { useState } from 'react';
import { AlertTriangle, Phone, MessageSquare, Users, Send } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Aegis Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Send alerts and manage event safety communications
          </p>
        </div>

        {success && (
          <Card className="mb-6 border-success-200 bg-success-50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-success-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-success-800">
                  Alert sent successfully!
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Alert Preview</h3>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getPriorityIcon(formData.priority)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      formData.priority === 'emergency' ? 'bg-danger-100 text-danger-800' :
                      formData.priority === 'warning' ? 'bg-warning-100 text-warning-800' :
                      'bg-primary-100 text-primary-800'
                    }`}>
                      {formData.priority.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {getMethodIcon(formData.method)}
                      <span className="ml-1">{formData.method.toUpperCase()}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {formData.message || 'Your alert message will appear here...'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
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
              >
                <Send className="h-4 w-4 mr-2" />
                Send Alert
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
