'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Heart, FileText, Shield, CheckCircle, Sparkles, Zap, Star, AlertTriangle, MapPin } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import FileUpload from '@/components/ui/FileUpload';
import { UserRegistration, IDProcessingResponse } from '@/types/api';
import { useGeolocation } from '@/hooks/useGeolocation';

export default function UserRegistrationPage() {
  const [formData, setFormData] = useState<UserRegistration>({
    phoneNumber: '',
    name: '',
    medicalInfo: '',
    emergencyContact: '',
    age: undefined,
    gender: '',
  });
  const [idScan, setIdScan] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState(false);

  // GPS location tracking
  const { latitude, longitude, accuracy, error: gpsError, loading: gpsLoading, refresh: refreshGPS } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 60000, // 1 minute cache
  });

  // Log GPS coordinates every minute
  useEffect(() => {
    const logGPSLocation = () => {
      if (latitude !== null && longitude !== null) {
        console.log('📍 GPS Location Update:', {
          timestamp: new Date().toISOString(),
          latitude: latitude,
          longitude: longitude,
          accuracy: accuracy ? `${Math.round(accuracy)}m` : 'unknown',
          coordinates: `${latitude}, ${longitude}`
        });
      } else if (gpsError) {
        console.log('❌ GPS Error:', gpsError);
      } else {
        console.log('🔍 GPS Loading...');
      }
    };

    // Log immediately on first load
    logGPSLocation();

    // Set up interval to log every minute (60000ms)
    const intervalId = setInterval(() => {
      refreshGPS(); // Refresh GPS position
      logGPSLocation();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [latitude, longitude, accuracy, gpsError, refreshGPS]);

  const processIdImage = async (file: File) => {
    setProcessingId(true);
    try {
      const formData = new FormData();
      formData.append('idImage', file);

      const response = await fetch('/api/process-id', {
        method: 'POST',
        body: formData,
      });

      const result: IDProcessingResponse = await response.json();

      if (result.success && result.data) {
        // Update form with extracted data
        setFormData(prev => ({
          ...prev,
          name: result.data?.fullName || prev.name,
          age: result.data?.age || prev.age,
          gender: result.data?.gender || prev.gender,
        }));
      } else {
        console.error('ID processing failed:', result.error);
        // Don't show error to user, just silently fail
      }
    } catch (error) {
      console.error('Error processing ID:', error);
      // Don't show error to user, just silently fail
    } finally {
      setProcessingId(false);
    }
  };
  const [submitError, setSubmitError] = useState('');

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
    setSubmitError('');

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

      const response = await fetch('/api/users/register', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        setSuccessMessage(result.message || 'Registration successful!');
        setFormData({
          phoneNumber: '',
          name: '',
          medicalInfo: '',
          emergencyContact: '',
          age: undefined,
          gender: '',
        });
        setIdScan(null);
      } else {
        throw new Error(result.message || 'Failed to register user');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setSubmitError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof UserRegistration, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleIdUpload = (file: File | null) => {
    setIdScan(file);
    if (file) {
      processIdImage(file);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <Card className="max-w-md w-full text-center rainbow-border pulse-glow relative z-10">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-green-600" />
              <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Successful! ✨
          </h2>
          <p className="text-gray-600 mb-6">
            {successMessage || "You're now registered for event safety alerts. You'll receive important notifications via phone call when needed."}
          </p>
          <Button
            onClick={() => setSuccess(false)}
            variant="primary"
            className="w-full"
          >
            <Star className="h-4 w-4 mr-2" />
            Register Another User
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden py-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 floating">
              Event Safety Registration
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-lg blur opacity-30"></div>
          </div>
          <p className="text-xl text-white/90 mb-4">
            Register to receive personalized safety alerts during the event
          </p>
          
          {/* GPS Status Indicator */}
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20">
            <MapPin className={`h-4 w-4 mr-2 ${
              gpsError ? 'text-red-400' : 
              latitude !== null ? 'text-green-400' : 'text-yellow-400'
            }`} />
            <span className="text-white">
              {gpsError ? 'Location Access Denied' :
               latitude !== null ? `Location: ${latitude.toFixed(4)}, ${longitude?.toFixed(4)}` :
               'Getting Location...'}
            </span>
            {latitude !== null && accuracy && (
              <span className="ml-2 text-white/70 text-xs">
                ±{Math.round(accuracy)}m
              </span>
            )}
          </div>
        </div>

        <Card className="rainbow-border">
          <form onSubmit={handleSubmit} className="space-y-6 mx-4 my-4">
            {/* Error Display */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">Registration Error</p>
                    <p className="text-sm text-red-700 mt-1">{submitError}</p>
                  </div>
                </div>
              </div>
            )}
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <div className="relative">
                  <User className="h-5 w-5 mr-2 text-indigo-600" />
                  <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Age (Optional)"
                  type="number"
                  placeholder="25"
                  value={formData.age || ''}
                  onChange={(e) => updateFormData('age', e.target.value ? parseInt(e.target.value) : undefined)}
                  error={errors.age}
                  helperText="Helps us provide age-appropriate safety information"
                />
                <Input
                  label="Gender (Optional)"
                  placeholder="Male/Female/Other"
                  value={formData.gender || ''}
                  onChange={(e) => updateFormData('gender', e.target.value)}
                  helperText="Will be auto-filled from ID if available"
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <div className="relative">
                  <Heart className="h-5 w-5 mr-2 text-pink-600" />
                  <Zap className="h-3 w-3 text-red-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
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
                <div className="relative">
                  <Shield className="h-5 w-5 mr-2 text-orange-600" />
                  <Star className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
                </div>
                Identity Verification
              </h3>
              
              <FileUpload
                label="ID Scan (Optional)"
                accept="image/*,.pdf"
                maxSize={5}
                onFileChange={handleIdUpload}
                helperText="Upload a scan of your ID for verification. Accepted formats: JPG, PNG, PDF (max 5MB). Form will auto-fill from ID data."
              />
              
              {processingId && (
                <div className="flex items-center text-sm text-blue-600 mt-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Processing ID image...
                </div>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Shield className="h-6 w-6 text-blue-500" />
                    <Sparkles className="h-4 w-4 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">
                    Privacy & Security ✨
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
                className="pulse-glow"
              >
                <User className="h-4 w-4 mr-2" />
                <Sparkles className="h-4 w-4 mr-2" />
                Complete Registration
              </Button>
            </div>
          </form>
        </Card>

        {/* Additional Information */}
        <Card className="mt-6 rainbow-border">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <div className="relative">
              <FileText className="h-5 w-5 mr-2 text-indigo-600" />
              <Zap className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            How It Works
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                1
              </div>
              <p>Register with your contact information and any relevant medical conditions.</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                2
              </div>
              <p>Receive personalized safety alerts via text message or phone call during the event.</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
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
