'use client';

import { useEffect, useState } from 'react';
import { User, Phone, Clock, MapPin, Heart, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';

interface RegisteredUser {
  id: string;
  full_name: string;
  phone_number: string;
  age?: number;
  gender?: string;
  medical_information?: string;
  emergency_contact?: string;
  id_information?: string;
  registered_at: string;
}

interface UsersResponse {
  total_users: number;
  users: RegisteredUser[];
  hardcoded_numbers: string[];
}

export default function UserList() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [hardcodedNumbers, setHardcodedNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data: UsersResponse = await response.json();
      setUsers(data.users);
      setHardcodedNumbers(data.hardcoded_numbers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMedicalIcon = (medicalInfo?: string) => {
    if (!medicalInfo) return null;
    
    const info = medicalInfo.toLowerCase();
    if (info.includes('asthma')) return '🫁';
    if (info.includes('diabetes')) return '💉';
    if (info.includes('heart')) return '❤️';
    if (info.includes('allerg')) return '⚠️';
    return '🏥';
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-semibold">Error Loading Users</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <User className="h-6 w-6 mr-2" />
          Registered Users
        </h2>
        <div className="flex items-center space-x-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {users.length} Registered
          </span>
          {hardcodedNumbers.length > 0 && (
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {hardcodedNumbers.length} Admin Numbers
            </span>
          )}
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl font-semibold text-gray-600">No Users Registered</p>
          <p className="text-gray-500">Users will appear here after registering for event alerts.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.full_name}
                    </h3>
                    {user.medical_information && (
                      <span className="text-lg" title={user.medical_information}>
                        {getMedicalIcon(user.medical_information)}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-green-600" />
                      {user.phone_number}
                    </div>
                    
                    {user.age && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-blue-600" />
                        {user.age} years old
                        {user.gender && ` • ${user.gender}`}
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      {formatDate(user.registered_at)}
                    </div>
                  </div>

                  {user.medical_information && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-red-600" />
                        <span className="text-sm font-medium text-red-800">Medical Info:</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">{user.medical_information}</p>
                    </div>
                  )}

                  {user.emergency_contact && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Emergency Contact:</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">{user.emergency_contact}</p>
                    </div>
                  )}

                  {user.id_information && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">ID Info:</span>
                      </div>
                      <p className="text-sm text-blue-700 mt-1">{user.id_information}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full" title="Active"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hardcodedNumbers.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Numbers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hardcodedNumbers.map((number, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <Phone className="h-4 w-4 mr-2 text-gray-600" />
                <span className="text-gray-900">{number}</span>
                <span className="ml-auto text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  Admin
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}