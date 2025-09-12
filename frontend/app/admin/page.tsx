'use client';

import { useState, useEffect } from 'react';
import { Users, Map, AlertTriangle, Shield, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import UserList from '@/components/admin/UserList';
import UserMapView from '@/components/admin/UserMapView';
import AlertForm from '@/components/admin/AlertForm';

type ActiveTab = 'overview' | 'users' | 'map' | 'alerts';

interface UserStats {
  totalUsers: number;
  usersWithMedicalConditions: number;
  onlineUsers: number;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    usersWithMedicalConditions: 0,
    onlineUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }
      const data = await response.json();
      
      // Calculate stats from user data
      const totalUsers = data.total_users;
      const usersWithMedicalConditions = data.users.filter(
        (user: any) => user.medical_information && user.medical_information.trim()
      ).length;
      
      // Mock online users for now (you can implement this later with real location data)
      const onlineUsers = Math.floor(totalUsers * 0.8); // Assume 80% are "online"
      
      setUserStats({
        totalUsers,
        usersWithMedicalConditions,
        onlineUsers,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Shield },
    { id: 'users' as const, label: 'User List', icon: Users },
    { id: 'map' as const, label: 'Map View', icon: Map },
    { id: 'alerts' as const, label: 'Send Alert', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden py-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 floating">
              Aegis Admin Dashboard
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-lg blur opacity-30"></div>
          </div>
          <p className="text-xl text-white/90">
            Monitor users and manage event safety communications
          </p>
        </div>

        {/* Navigation Tabs */}
        <Card className="mb-8 rainbow-border">
          <div className="flex flex-wrap justify-center gap-4 p-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? 'primary' : 'secondary'}
                  className={`flex items-center space-x-2 ${
                    activeTab === tab.id ? 'pulse-glow' : ''
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 rainbow-border">
                  <div className="flex items-center">
                    <Users className="h-12 w-12 text-blue-600 mr-4" />
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {loading ? (
                          <span className="animate-pulse bg-gray-300 rounded w-8 h-8 inline-block"></span>
                        ) : (
                          userStats.totalUsers
                        )}
                      </p>
                      <p className="text-gray-600">Registered Users</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 rainbow-border">
                  <div className="flex items-center">
                    <Map className="h-12 w-12 text-green-600 mr-4" />
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {loading ? (
                          <span className="animate-pulse bg-gray-300 rounded w-8 h-8 inline-block"></span>
                        ) : (
                          userStats.onlineUsers
                        )}
                      </p>
                      <p className="text-gray-600">Active Locations</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 rainbow-border">
                  <div className="flex items-center">
                    <AlertTriangle className="h-12 w-12 text-red-600 mr-4" />
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {loading ? (
                          <span className="animate-pulse bg-gray-300 rounded w-8 h-8 inline-block"></span>
                        ) : (
                          userStats.usersWithMedicalConditions
                        )}
                      </p>
                      <p className="text-gray-600">Medical Conditions</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Welcome Message */}
              <Card className="p-8 text-center rainbow-border pulse-glow">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Shield className="h-16 w-16 text-purple-600" />
                    <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Aegis Admin Dashboard
                </h2>
                <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                  Monitor registered users, track their real-time locations, and manage emergency communications 
                  for your event. Switch between tabs to view detailed user information and interactive maps.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => setActiveTab('users')}
                    variant="primary"
                    className="pulse-glow"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View {userStats.totalUsers} Users
                  </Button>
                  <Button
                    onClick={() => setActiveTab('map')}
                    variant="secondary"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    View Map
                  </Button>
                  <Button
                    onClick={fetchUserStats}
                    variant="secondary"
                    disabled={loading}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Refresh Stats
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'users' && <UserList />}

          {activeTab === 'map' && <UserMapView />}

          {activeTab === 'alerts' && <AlertForm />}
        </div>
      </div>
    </div>
  );
}