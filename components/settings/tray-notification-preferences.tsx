'use client';

import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Languages, AlertTriangle, RefreshCw, Users, Newspaper, Gamepad2, Moon, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  getNotificationPrefs,
  saveNotificationPrefs,
  sendTrayNotification,
  TrayNotificationType,
  NotificationPreferences,
} from '@/lib/notifications/tray-notifications';

interface NotificationTypeConfig {
  key: keyof NotificationPreferences;
  type: TrayNotificationType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NOTIFICATION_TYPES: NotificationTypeConfig[] = [
  { key: 'chatMessages', type: 'chat_message', label: 'Сообщения чата', description: 'Уведомления при получении сообщений в чате сообщества', icon: MessageSquare },
  { key: 'translationCompleted', type: 'translation_completed', label: 'Завершенные переводы', description: 'Уведомление при успешном завершении перевода', icon: Languages },
  { key: 'translationFailed', type: 'translation_failed', label: 'Ошибки перевода', description: 'Уведомление при сбое перевода', icon: AlertTriangle },
  { key: 'systemErrors', type: 'system_error', label: 'Системные ошибки', description: 'Уведомления о критических системных ошибках', icon: AlertTriangle },
  { key: 'appUpdates', type: 'app_update', label: 'Обновления приложения', description: 'Уведомление о доступности новой версии STORM GAME TRANSLATOR', icon: RefreshCw },
  { key: 'gameUpdates', type: 'game_update', label: 'Обновления игр', description: 'Уведомление, если обновление игры могло нарушить работу патча', icon: Gamepad2 },
  { key: 'friendOnline', type: 'friend_online', label: 'Друзья онлайн', description: 'Уведомление, когда друг появляется в сети', icon: Users },
  { key: 'news', type: 'news', label: 'Новости', description: 'Уведомления о новостях и обновлениях сообщества', icon: Newspaper },
];

export function TrayNotificationPreferences() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(getNotificationPrefs());
  const [testSending, setTestSending] = useState(false);

  useEffect(() => {
    setPrefs(getNotificationPrefs());
  }, []);

  const updatePref = (key: keyof NotificationPreferences, value: boolean | string) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    saveNotificationPrefs(updated);
  };

  const handleTestNotification = async () => {
    setTestSending(true);
    try {
      await sendTrayNotification({
        type: 'news',
        title: '🔔 Тестовое уведомление',
        body: 'Если вы видите это сообщение, уведомления в трее работают отлично!',
      });
    } catch { /* ignore */ }
    setTimeout(() => setTestSending(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2" className="flex items-center gap-2 text-base">
          <Bell className="h-5 w-5" />
          Уведомления в системном трее
        </CardTitle>
        <CardDescription>
          Настройте события, для которых создаются системные уведомления ОС Windows.
          Уведомления отображаются в трее и в центре уведомлений.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Уведомления в трее включены</Label>
            <p className="text-xs text-muted-foreground">Включить или отключить все системные уведомления</p>
          </div>
          <Switch
            checked={prefs.enabled}
            onCheckedChange={(v) => updatePref('enabled', v)}
          />
        </div>

        <Separator />

        {/* Per-type toggles */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Типы уведомлений</h3>
          {NOTIFICATION_TYPES.map(({ key, type, label, description, icon: Icon }) => (
            <div
              key={key}
              className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                !prefs.enabled ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{label}</Label>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
              <Switch
                checked={!!prefs[key]}
                disabled={!prefs.enabled}
                onCheckedChange={(v) => updatePref(key, v)}
              />
            </div>
          ))}
        </div>

        <Separator />

        {/* Quiet Hours */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Тихие часы</Label>
            </div>
            <Switch
              checked={prefs.quietHoursEnabled}
              disabled={!prefs.enabled}
              onCheckedChange={(v) => updatePref('quietHoursEnabled', v)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            В тихие часы всплывающие уведомления отключаются (критические ошибки по-прежнему отображаются).
          </p>
          {prefs.quietHoursEnabled && (
            <div className="flex items-center gap-3 pl-6">
              <div className="flex items-center gap-2">
                <Label className="text-xs">С</Label>
                <Input
                  type="time"
                  value={prefs.quietHoursStart}
                  onChange={(e) => updatePref('quietHoursStart', e.target.value)}
                  className="h-8 w-28 text-xs"
                />
              </div>
              <span className="text-xs text-muted-foreground">до</span>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={prefs.quietHoursEnd}
                  onChange={(e) => updatePref('quietHoursEnd', e.target.value)}
                  className="h-8 w-28 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Test button */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestNotification}
            disabled={!prefs.enabled || testSending}
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            {testSending ? 'Отправка...' : 'Отправить тестовое уведомление'}
          </Button>
          <span className="text-xs text-muted-foreground">
            Проверьте корректность работы всплывающих уведомлений в Windows
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

