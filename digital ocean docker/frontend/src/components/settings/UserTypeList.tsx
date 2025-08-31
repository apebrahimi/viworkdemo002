'use client';

import React, { useState } from 'react';
import { UserType } from '@/types/settings';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { 
  Users, 
  Edit, 
  Trash2, 
  Eye, 
  Plus, 
  Clock, 
  MapPin, 
  Shield,
  Smartphone,
  UserCheck,
  Calendar,
  Globe
} from 'lucide-react';

interface UserTypeListProps {
  userTypes: UserType[];
  onEdit: (userType: UserType) => void;
  onDelete: (userType: UserType) => void;
  onView: (userType: UserType) => void;
  onCreate: () => void;
  disabled?: boolean;
}

export function UserTypeList({ 
  userTypes, 
  onEdit, 
  onDelete, 
  onView, 
  onCreate, 
  disabled = false 
}: UserTypeListProps) {
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

  const toggleUserTypeStatus = (userType: UserType) => {
    // This would typically call an API to update the status
    console.log('Toggle status for:', userType.id, !userType.isActive);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (userType: UserType) => {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        userType.isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {userType.isActive ? 'Active' : 'Inactive'}
      </div>
    );
  };

  const getFeatureIcons = (userType: UserType) => {
    const icons = [];
    
    if (userType.requiresMobileVerification) {
      icons.push(<Smartphone key="mobile" className="w-4 h-4 text-blue-500" title="Mobile verification required" />);
    }
    
    if (userType.timeIntervals.length > 0) {
      icons.push(<Clock key="time" className="w-4 h-4 text-orange-500" title="Time restrictions" />);
    }
    
    if (userType.locationRestrictions.length > 0) {
      icons.push(<MapPin key="location" className="w-4 h-4 text-green-500" title="Location restrictions" />);
    }
    
    if (userType.resourceAccess.length > 0) {
      icons.push(<Shield key="resources" className="w-4 h-4 text-purple-500" title="Resource access" />);
    }

    return icons;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" />
          User Types
        </h2>
        <Button
          onClick={onCreate}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create User Type
        </Button>
      </div>

      {userTypes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No User Types</h3>
            <p className="text-gray-600 mb-4">
              Create your first user type to define access controls and permissions.
            </p>
            <Button onClick={onCreate} disabled={disabled}>
              <Plus className="w-4 h-4 mr-2" />
              Create First User Type
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTypes.map((userType) => (
            <Card key={userType.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: userType.color }}
                    >
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{userType.name}</CardTitle>
                      {getStatusBadge(userType)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getFeatureIcons(userType)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {userType.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Max Sessions:</span>
                    <span className="font-medium">{userType.maxConcurrentSessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Session Timeout:</span>
                    <span className="font-medium">{userType.sessionTimeout}m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Time Intervals:</span>
                    <span className="font-medium">{userType.timeIntervals.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Location Rules:</span>
                    <span className="font-medium">{userType.locationRestrictions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Resources:</span>
                    <span className="font-medium">{userType.resourceAccess.length}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={userType.isActive}
                      onChange={() => toggleUserTypeStatus(userType)}
                      disabled={disabled}
                    />
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => onView(userType)}
                      variant="outline"
                      size="sm"
                      disabled={disabled}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onEdit(userType)}
                      variant="outline"
                      size="sm"
                      disabled={disabled}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onDelete(userType)}
                      variant="destructive"
                      size="sm"
                      disabled={disabled}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  Created: {formatDate(userType.createdAt)}
                  {userType.updatedAt !== userType.createdAt && (
                    <span className="block">Updated: {formatDate(userType.updatedAt)}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
