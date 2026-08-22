// TITAN PROTOCOL - Service Worker for Background Push Notifications & PWA Caching
const CACHE_NAME = 'titan-protocol-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle Background Push Events
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || '🛡️ TITAN PROTOCOL ALERT';
    const options = {
      body: data.body || 'Mission briefing or accountability ultimatum active.',
      icon: '/manifest.json',
      badge: '/manifest.json',
      tag: data.tag || 'titan-alert',
      requireInteraction: data.requireInteraction || false,
      data: {
        url: data.url || '/'
      }
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch {
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('🛡️ TITAN PROTOCOL ALERT', {
        body: text,
        icon: '/manifest.json'
      })
    );
  }
});

// Handle Notification Click (Focus or open app window)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
