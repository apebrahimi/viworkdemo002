'use client';

import React, { useState } from 'react';
import { LocationRestriction } from '@/types/settings';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { X, Plus, MapPin, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface LocationRestrictionFormProps {
  locationRestrictions: LocationRestriction[];
  onChange: (restrictions: LocationRestriction[]) => void;
  disabled?: boolean;
}

const LOCATION_TYPES = [
  { value: 'country', label: 'کشور' },
  { value: 'region', label: 'منطقه/استان' },
  { value: 'city', label: 'شهر' },
  { value: 'ip_range', label: 'محدوده IP' },
  { value: 'coordinates', label: 'مختصات' },
];

const COUNTRIES = [
  { value: 'US', label: 'ایالات متحده' },
  { value: 'CA', label: 'کانادا' },
  { value: 'GB', label: 'بریتانیا' },
  { value: 'DE', label: 'آلمان' },
  { value: 'FR', label: 'فرانسه' },
  { value: 'JP', label: 'ژاپن' },
  { value: 'AU', label: 'استرالیا' },
  { value: 'IR', label: 'ایران' },
  { value: 'TR', label: 'ترکیه' },
  { value: 'AE', label: 'امارات متحده عربی' },
];

export function LocationRestrictionForm({ locationRestrictions, onChange, disabled = false }: LocationRestrictionFormProps) {
  const { language } = useLanguage();
  const [newRestriction, setNewRestriction] = useState<Partial<LocationRestriction>>({
    name: '',
    type: 'country',
    value: '',
    isAllowed: true,
    isActive: true,
  });

  const addRestriction = () => {
    if (!newRestriction.name || !newRestriction.value) return;
    
    const restriction: LocationRestriction = {
      id: `location_${Date.now()}`,
      name: newRestriction.name,
      type: newRestriction.type || 'country',
      value: newRestriction.value,
      isAllowed: newRestriction.isAllowed ?? true,
      isActive: newRestriction.isActive ?? true,
    };

    onChange([...locationRestrictions, restriction]);
    setNewRestriction({
      name: '',
      type: 'country',
      value: '',
      isAllowed: true,
      isActive: true,
    });
  };

  const updateRestriction = (id: string, updates: Partial<LocationRestriction>) => {
    onChange(locationRestrictions.map(restriction => 
      restriction.id === id ? { ...restriction, ...updates } : restriction
    ));
  };

  const removeRestriction = (id: string) => {
    onChange(locationRestrictions.filter(restriction => restriction.id !== id));
  };

  const getValueOptions = (type: string) => {
    switch (type) {
      case 'country':
        return COUNTRIES;
      case 'region':
        return [
          { value: 'CA-ON', label: 'Ontario' },
          { value: 'CA-QC', label: 'Quebec' },
          { value: 'US-CA', label: 'California' },
          { value: 'US-NY', label: 'New York' },
          { value: 'US-TX', label: 'Texas' },
        ];
      case 'city':
        return [
          { value: 'toronto', label: 'Toronto' },
          { value: 'montreal', label: 'Montreal' },
          { value: 'vancouver', label: 'Vancouver' },
          { value: 'new-york', label: 'New York' },
          { value: 'los-angeles', label: 'Los Angeles' },
        ];
      default:
        return [];
    }
  };

  const renderValueInput = (type: string, value: string, onChange: (value: string) => void) => {
    switch (type) {
      case 'country':
      case 'region':
      case 'city':
        const options = getValueOptions(type);
        return (
          <Select
            options={options}
            value={value}
            onChange={onChange}
            placeholder={`Select ${type}`}
            disabled={disabled}
          />
        );
      case 'ip_range':
        return (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., 192.168.1.0/24 or 10.0.0.1-10.0.0.255"
            disabled={disabled}
          />
        );
      case 'coordinates':
        return (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., 43.6532,-79.3832 (lat,lng)"
            disabled={disabled}
          />
        );
      default:
        return (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter value"
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {t('locationRestrictions', language)}
        </h3>
        <Button
          onClick={addRestriction}
          disabled={disabled || !newRestriction.name || !newRestriction.value}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('addRestriction', language)}
        </Button>
      </div>

      {/* Add new restriction form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{language === 'fa' ? 'افزودن محدودیت مکانی جدید' : 'Add New Location Restriction'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('restrictionName', language)}
              placeholder={t('restrictionNamePlaceholder', language)}
              value={newRestriction.name}
              onChange={(e) => setNewRestriction({ ...newRestriction, name: e.target.value })}
              disabled={disabled}
            />
            <Select
              label={t('locationType', language)}
              options={LOCATION_TYPES}
              value={newRestriction.type}
              onChange={(value) => setNewRestriction({ ...newRestriction, type: value as any, value: '' })}
              disabled={disabled}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('locationValue', language)}</label>
              {renderValueInput(
                newRestriction.type || 'country',
                newRestriction.value || '',
                (value) => setNewRestriction({ ...newRestriction, value })
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={newRestriction.isAllowed ?? true}
                  onChange={(checked) => setNewRestriction({ ...newRestriction, isAllowed: checked })}
                  disabled={disabled}
                />
                <span className="text-sm">
                  {newRestriction.isAllowed ? t('allow', language) : t('block', language)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={newRestriction.isActive ?? true}
                  onChange={(checked) => setNewRestriction({ ...newRestriction, isActive: checked })}
                  disabled={disabled}
                />
                <span className="text-sm">{t('active', language)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing restrictions */}
      <div className="space-y-3">
        {locationRestrictions.map((restriction) => (
          <Card key={restriction.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Input
                      value={restriction.name}
                      onChange={(e) => updateRestriction(restriction.id, { name: e.target.value })}
                      disabled={disabled}
                      className="max-w-xs"
                    />
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={restriction.isAllowed}
                          onChange={(checked) => updateRestriction(restriction.id, { isAllowed: checked })}
                          disabled={disabled}
                        />
                        <span className={`text-sm font-medium ${restriction.isAllowed ? 'text-green-600' : 'text-red-600'}`}>
                          {restriction.isAllowed ? t('allow', language) : t('block', language)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={restriction.isActive}
                          onChange={(checked) => updateRestriction(restriction.id, { isActive: checked })}
                          disabled={disabled}
                        />
                        <span className="text-sm text-muted-foreground">{t('active', language)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">{t('locationType', language)}</label>
                      <Select
                        options={LOCATION_TYPES}
                        value={restriction.type}
                        onChange={(value) => updateRestriction(restriction.id, { type: value as any, value: '' })}
                        disabled={disabled}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">{t('locationValue', language)}</label>
                      {renderValueInput(
                        restriction.type,
                        restriction.value,
                        (value) => updateRestriction(restriction.id, { value })
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => removeRestriction(restriction.id)}
                  variant="destructive"
                  size="sm"
                  disabled={disabled}
                  className="ml-4"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {locationRestrictions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{t('noLocationRestrictions', language)}</p>
          <p className="text-sm">{t('noLocationRestrictionsDesc', language)}</p>
        </div>
      )}
    </div>
  );
}
