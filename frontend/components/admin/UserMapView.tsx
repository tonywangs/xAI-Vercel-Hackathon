'use client';

import { useEffect, useState, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Users, Wifi, WifiOff } from 'lucide-react';
import Card from '@/components/ui/Card';

interface UserLocation {
  id: string;
  full_name: string;
  phone_number: string;
  latitude: number;
  longitude: number;
  medical_information?: string;
  last_updated: string;
  status: 'online' | 'offline';
}

// Mock GPS data for demonstration - replace with actual API later
const mockUserLocations: UserLocation[] = [
  {
    id: '1',
    full_name: 'Alice Johnson',
    phone_number: '+1555123456',
    latitude: 37.7749,
    longitude: -122.4194,
    medical_information: 'Diabetic - insulin dependent',
    last_updated: '2 min ago',
    status: 'online'
  },
  {
    id: '2', 
    full_name: 'Bob Smith',
    phone_number: '+1555987654',
    latitude: 37.7849,
    longitude: -122.4094,
    last_updated: '5 min ago',
    status: 'online'
  },
  {
    id: '3',
    full_name: 'Carol Davis',
    phone_number: '+1555456789',
    latitude: 37.7649,
    longitude: -122.4294,
    medical_information: 'Asthma - carries inhaler',
    last_updated: '1 min ago',
    status: 'online'
  },
  {
    id: '4',
    full_name: 'David Wilson',
    phone_number: '+1555321654',
    latitude: 37.7949,
    longitude: -122.3994,
    last_updated: '15 min ago',
    status: 'offline'
  },
  {
    id: '5',
    full_name: 'Emma Brown',
    phone_number: '+1555789012',
    latitude: 37.7549,
    longitude: -122.4394,
    medical_information: 'Heart condition',
    last_updated: '3 min ago',
    status: 'online'
  }
];

export default function UserMapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [users, setUsers] = useState<UserLocation[]>(mockUserLocations);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserLocation | null>(null);

  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    if (map) {
      updateMarkers();
    }
  }, [map, users]);

  const initializeMap = async () => {
    if (!mapRef.current) return;

    try {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'your-api-key-here',
        version: 'weekly',
      });

      const { Map } = await loader.importLibrary('maps');
      const { AdvancedMarkerElement, PinElement } = await loader.importLibrary('marker');

      // Center map on San Francisco (hackathon location)
      const mapInstance = new Map(mapRef.current, {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 13,
        mapId: 'AEGIS_MAP_ID', // Required for advanced markers
      });

      setMap(mapInstance);
      setLoading(false);
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      setLoading(false);
    }
  };

  const updateMarkers = async () => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    
    try {
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
      
      const newMarkers: google.maps.Marker[] = [];

      users.forEach(user => {
        // Create custom pin based on user status and medical info
        const pinColor = user.status === 'online' ? '#10B981' : '#6B7280'; // Green for online, gray for offline
        const hasMedical = !!user.medical_information;
        
        const pinElement = new PinElement({
          background: pinColor,
          borderColor: hasMedical ? '#EF4444' : '#FFFFFF', // Red border for medical conditions
          glyphColor: '#FFFFFF',
          glyph: hasMedical ? '🏥' : '👤',
        });

        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: user.latitude, lng: user.longitude },
          content: pinElement.element,
          title: user.full_name,
        });

        // Add click listener
        marker.addListener('click', () => {
          setSelectedUser(user);
          map.panTo({ lat: user.latitude, lng: user.longitude });
        });

        newMarkers.push(marker as any);
      });

      setMarkers(newMarkers);
    } catch (error) {
      console.error('Error creating markers:', error);
    }
  };

  const onlineUsers = users.filter(u => u.status === 'online');
  const usersWithMedical = users.filter(u => u.medical_information);

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <Wifi className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{onlineUsers.length}</p>
              <p className="text-sm text-gray-600">Online Now</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{usersWithMedical.length}</p>
              <p className="text-sm text-gray-600">Medical Conditions</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden">
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
              <div 
                ref={mapRef} 
                className="w-full h-96 lg:h-[500px]"
              />
            </div>
          </Card>
        </div>

        {/* User Details Panel */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Live Locations
            </h3>
            
            {selectedUser ? (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900">{selectedUser.full_name}</h4>
                  <p className="text-sm text-blue-700">{selectedUser.phone_number}</p>
                  <div className="flex items-center mt-2">
                    {selectedUser.status === 'online' ? (
                      <Wifi className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-gray-600 mr-1" />
                    )}
                    <span className="text-xs text-gray-600">
                      {selectedUser.status} • {selectedUser.last_updated}
                    </span>
                  </div>
                  
                  {selectedUser.medical_information && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                      <p className="text-xs font-medium text-red-800">Medical:</p>
                      <p className="text-xs text-red-700">{selectedUser.medical_information}</p>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Clear Selection
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Click on a map marker to view user details
              </p>
            )}
          </Card>

          {/* Legend */}
          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Map Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span>Online User</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
                <span>Offline User</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-red-500 mr-2"></div>
                <span>Medical Condition</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}