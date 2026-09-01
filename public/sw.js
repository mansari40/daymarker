const CACHE_NAME = "daymarker-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/desk") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/desk");
      }
    })
  );
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "daymarker-daily") {
    event.waitUntil(sendMorningNotification());
  }
});

async function sendMorningNotification() {
  const now = new Date();
  const hour = now.getHours();
  if (hour !== 8) return;

  const lastFired = await caches.open(CACHE_NAME).then(async (cache) => {
    const resp = await cache.match("last-notification");
    if (resp) return resp.text();
    return null;
  });

  const today = now.toISOString().split("T")[0];
  if (lastFired === today) return;

  const cache = await caches.open(CACHE_NAME);
  await cache.put("last-notification", new Response(today));

  self.registration.showNotification("Daymarker", {
    body: "What's your mark for today?",
    icon: "/check-icon.png",
    badge: "/check-icon.png",
    tag: "daymarker-daily",
  });
}
