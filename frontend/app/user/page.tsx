'use client';

import { useState } from 'react';
import { User, Phone, Heart, FileText, Shield, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import FileUpload from '@/components/ui/FileUpload';
import { UserRegistration } from '@/types/api';

export default function UserRegistrationPage() {
  const [formData, setFormData] = useState<UserRegistration>({
    phoneNumber: '',
    name: '',
    medicalInfo: '',
    emergencyContact: '',
    age: undefined,
  });
  const [idScan, setIdScan] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.age && (formData.age < 0 || formData.age > 120)) {
      newErrors.age = 'Please enter a valid age';
    }

    if (formData.emergencyContact && !/^\+?[\d\s\-\(\)]+$/.test(formData.emergencyContact)) {
      newErrors.emergencyContact = 'Please enter a valid emergency contact phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('phoneNumber', formData.phoneNumber);
      submitData.append('name', formData.name);
      if (formData.medicalInfo) {
        submitData.append('medicalInfo', formData.medicalInfo);
      }
      if (formData.emergencyContact) {
        submitData.append('emergencyContact', formData.emergencyContact);
      }
      if (formData.age) {
        submitData.append('age', formData.age.toString());
      }
      if (idScan) {
        submitData.append('idScan', idScan);
      }

      // TODO: Replace with actual API call
      const response = await fetch('/api/users/register', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          phoneNumber: '',
          name: '',
          medicalInfo: '',
          emergencyContact: '',
          age: undefined,
        });
        setIdScan(null);
      } else {
        throw new Error('Failed to register user');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      // TODO: Add proper error handling
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof UserRegistration, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            You're now registered for event safety alerts. You'll receive important notifications via text or phone call when needed.
          </p>
          <Button
            onClick={() => setSuccess(false)}
            variant="primary"
          >
            Register Another User
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Event Safety Registration
          </h1>
          <p className="text-gray-600">
            Register to receive personalized safety alerts during the event
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-600" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  error={errors.name}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                  error={errors.phoneNumber}
                  required
                  helperText="This is how we'll contact you for safety alerts"
                />
              </div>

              <Input
                label="Age (Optional)"
                type="number"
                placeholder="25"
                value={formData.age || ''}
                onChange={(e) => updateFormData('age', e.target.value ? parseInt(e.target.value) : undefined)}
                error={errors.age}
                helperText="Helps us provide age-appropriate safety information"
              />
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-danger-600" />
                Medical Information
              </h3>
              
              <Textarea
                label="Medical Conditions (Optional)"
                placeholder="List any medical conditions, allergies, or special needs that emergency responders should know about..."
                value={formData.medicalInfo}
                onChange={(e) => updateFormData('medicalInfo', e.target.value)}
                rows={3}
                helperText="This information helps us provide personalized safety alerts and assistance"
              />

              <Input
                label="Emergency Contact Phone (Optional)"
                placeholder="+1 (555) 987-6543"
                value={formData.emergencyContact}
                onChange={(e) => updateFormData('emergencyContact', e.target.value)}
                error={errors.emergencyContact}
                helperText="Someone we can contact in case of emergency"
              />
            </div>

            {/* ID Verification */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-warning-600" />
                Identity Verification
              </h3>
              
              <FileUpload
                label="ID Scan (Optional)"
                accept="image/*,.pdf"
                maxSize={5}
                onFileChange={setIdScan}
                helperText="Upload a scan of your ID for verification. Accepted formats: JPG, PNG, PDF (max 5MB)"
              />
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">
                    Privacy & Security
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your information is encrypted and stored securely. We only use this data to provide 
                    personalized safety alerts and will never share it with third parties without your consent.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={!formData.name.trim() || !formData.phoneNumber.trim()}
              >
                <User className="h-4 w-4 mr-2" />
                Complete Registration
              </Button>
            </div>
          </form>
        </Card>

        {/* Additional Information */}
        <Card className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-gray-600" />
            How It Works
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                1
              </div>
              <p>Register with your contact information and any relevant medical conditions.</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                2
              </div>
              <p>Receive personalized safety alerts via text message or phone call during the event.</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                3
              </div>
              <p>Ask questions and get real-time assistance from our AI safety assistant.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
