'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Users, Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';

interface UserLocation {
  user_id: string;
  user_name: string;
  phone_number: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  last_updated: string;
  status: 'online' | 'offline';
}

interface LocationsResponse {
  total_locations: number;
  locations: UserLocation[];
}

export default function UserMapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [users, setUsers] = useState<UserLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeMap();
    fetchUserLocations();
    
    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(fetchUserLocations, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (map) {
      updateMarkers();
    }
  }, [map, users, updateMarkers]);

  const fetchUserLocations = async () => {
    try {
      // Fetch both locations and users data to get medical information
      const [locationsResponse, usersResponse] = await Promise.all([
        fetch('/api/locations'),
        fetch('/api/users')
      ]);

      if (!locationsResponse.ok || !usersResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const locationsData: LocationsResponse = await locationsResponse.json();
      const usersData = await usersResponse.json();

      // Create a map of user medical information
      const userMedicalInfo: Record<string, string> = {};
      usersData.users.forEach((user: any) => {
        if (user.medical_information) {
          userMedicalInfo[user.id] = user.medical_information;
        }
      });

      // Enhance location data with medical information
      const enhancedLocations = locationsData.locations.map(location => ({
        ...location,
        medical_information: userMedicalInfo[location.user_id]
      }));

      setUsers(enhancedLocations);
      setError(null);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

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

  const updateMarkers = useCallback(async () => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    
    try {
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
      
      const newMarkers: google.maps.Marker[] = [];

      users.forEach(user => {
        // Create custom pin based on user status and medical info
        const pinColor = user.status === 'online' ? '#10B981' : '#6B7280'; // Green for online, gray for offline
        const hasMedical = !!(user as any).medical_information;
        
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
          title: user.user_name,
        });

        // Add click listener with proper closure
        marker.addListener('click', ((currentUser) => () => {
          console.log('Marker clicked for user:', currentUser.user_name, currentUser.user_id);
          setSelectedUser(currentUser);
          map.panTo({ lat: currentUser.latitude, lng: currentUser.longitude });
        })(user));

        newMarkers.push(marker as any);
      });

      setMarkers(newMarkers);
    } catch (error) {
      console.error('Error creating markers:', error);
    }
  }, [map, users, markers]);

  const onlineUsers = users.filter(u => u.status === 'online');
  const usersWithMedical = users.filter(u => (u as any).medical_information);

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error loading locations</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={fetchUserLocations}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </Card>
      )}

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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Live Locations
              </h3>
              <button
                onClick={fetchUserLocations}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                title="Refresh locations"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            
            {selectedUser ? (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900">{selectedUser.user_name}</h4>
                  <p className="text-sm text-blue-700">{selectedUser.phone_number}</p>
                  <div className="flex items-center mt-2">
                    {selectedUser.status === 'online' ? (
                      <Wifi className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-gray-600 mr-1" />
                    )}
                    <span className="text-xs text-gray-600">
                      {selectedUser.status} • {new Date(selectedUser.last_updated).toLocaleString()}
                    </span>
                  </div>
                  
                  {selectedUser.accuracy && (
                    <div className="mt-2 text-xs text-gray-600">
                      Accuracy: ±{Math.round(selectedUser.accuracy)}m
                    </div>
                  )}
                  
                  {(selectedUser as any).medical_information && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                      <p className="text-xs font-medium text-red-800">Medical:</p>
                      <p className="text-xs text-red-700">{(selectedUser as any).medical_information}</p>
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