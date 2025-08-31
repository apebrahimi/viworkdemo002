'use client';

import React, { useState } from 'react';
import { TimeInterval } from '@/types/settings';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { X, Plus, Clock, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface TimeIntervalFormProps {
  timeIntervals: TimeInterval[];
  onChange: (intervals: TimeInterval[]) => void;
  disabled?: boolean;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'یک' },
  { value: 1, label: 'دو' },
  { value: 2, label: 'سه' },
  { value: 3, label: 'چهار' },
  { value: 4, label: 'پنج' },
  { value: 5, label: 'جمعه' },
  { value: 6, label: 'شنبه' },
];

export function TimeIntervalForm({ timeIntervals, onChange, disabled = false }: TimeIntervalFormProps) {
  const { language } = useLanguage();
  const [newInterval, setNewInterval] = useState<Partial<TimeInterval>>({
    name: '',
    startTime: '09:00',
    endTime: '17:00',
    daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
    isActive: true,
  });

  const addInterval = () => {
    if (!newInterval.name) return;
    
    const interval: TimeInterval = {
      id: `interval_${Date.now()}`,
      name: newInterval.name,
      startTime: newInterval.startTime || '09:00',
      endTime: newInterval.endTime || '17:00',
      daysOfWeek: newInterval.daysOfWeek || [1, 2, 3, 4, 5],
      isActive: newInterval.isActive ?? true,
    };

    onChange([...timeIntervals, interval]);
    setNewInterval({
      name: '',
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5],
      isActive: true,
    });
  };

  const updateInterval = (id: string, updates: Partial<TimeInterval>) => {
    onChange(timeIntervals.map(interval => 
      interval.id === id ? { ...interval, ...updates } : interval
    ));
  };

  const removeInterval = (id: string) => {
    onChange(timeIntervals.filter(interval => interval.id !== id));
  };

  const toggleDay = (intervalId: string, day: number) => {
    const interval = timeIntervals.find(i => i.id === intervalId);
    if (!interval) return;

    const newDays = interval.daysOfWeek.includes(day)
      ? interval.daysOfWeek.filter(d => d !== day)
      : [...interval.daysOfWeek, day].sort();

    updateInterval(intervalId, { daysOfWeek: newDays });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {t('timeIntervals', language)}
        </h3>
        <Button
          onClick={addInterval}
          disabled={disabled || !newInterval.name}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('addInterval', language)}
        </Button>
      </div>

      {/* Add new interval form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{language === 'fa' ? 'افزودن فاصله زمانی جدید' : 'Add New Time Interval'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('intervalName', language)}
              placeholder={t('intervalNamePlaceholder', language)}
              value={newInterval.name}
              onChange={(e) => setNewInterval({ ...newInterval, name: e.target.value })}
              disabled={disabled}
            />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={newInterval.isActive ?? true}
                  onChange={(checked) => setNewInterval({ ...newInterval, isActive: checked })}
                  disabled={disabled}
                />
                <span className="text-sm">{t('active', language)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('startTime', language)}
              type="time"
              value={newInterval.startTime}
              onChange={(e) => setNewInterval({ ...newInterval, startTime: e.target.value })}
              disabled={disabled}
            />
            <Input
              label={t('endTime', language)}
              type="time"
              value={newInterval.endTime}
              onChange={(e) => setNewInterval({ ...newInterval, endTime: e.target.value })}
              disabled={disabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('daysOfWeek', language)}</label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => {
                    const newDays = newInterval.daysOfWeek?.includes(day.value)
                      ? newInterval.daysOfWeek.filter(d => d !== day.value)
                      : [...(newInterval.daysOfWeek || []), day.value].sort();
                    setNewInterval({ ...newInterval, daysOfWeek: newDays });
                  }}
                  disabled={disabled}
                  className={`
                    px-3 py-1 rounded-md text-sm font-medium transition-colors
                    ${newInterval.daysOfWeek?.includes(day.value)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing intervals */}
      <div className="space-y-3">
        {timeIntervals.map((interval) => (
          <Card key={interval.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Input
                      value={interval.name}
                      onChange={(e) => updateInterval(interval.id, { name: e.target.value })}
                      disabled={disabled}
                      className="max-w-xs"
                    />
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={interval.isActive}
                        onChange={(checked) => updateInterval(interval.id, { isActive: checked })}
                        disabled={disabled}
                      />
                      <span className="text-sm text-muted-foreground">{t('active', language)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">{language === 'fa' ? 'محدوده زمانی' : 'Time Range'}</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={interval.startTime}
                          onChange={(e) => updateInterval(interval.id, { startTime: e.target.value })}
                          disabled={disabled}
                          className="w-32"
                        />
                        <span className="text-muted-foreground">{language === 'fa' ? 'تا' : 'to'}</span>
                        <Input
                          type="time"
                          value={interval.endTime}
                          onChange={(e) => updateInterval(interval.id, { endTime: e.target.value })}
                          disabled={disabled}
                          className="w-32"
                        />
                      </div>
                    </div>

                                          <div>
                        <label className="block text-sm font-medium mb-1">{language === 'fa' ? 'روزها' : 'Days'}</label>
                      <div className="flex flex-wrap gap-1">
                        {DAYS_OF_WEEK.map((day) => (
                          <button
                            key={day.value}
                            type="button"
                            onClick={() => toggleDay(interval.id, day.value)}
                            disabled={disabled}
                            className={`
                              px-2 py-1 rounded text-xs font-medium transition-colors
                              ${interval.daysOfWeek.includes(day.value)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-accent'
                              }
                              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => removeInterval(interval.id)}
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

      {timeIntervals.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{t('noTimeIntervals', language)}</p>
          <p className="text-sm">{t('noTimeIntervalsDesc', language)}</p>
        </div>
      )}
    </div>
  );
}
