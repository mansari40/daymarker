const MILESTONE_KEY = "daymarker-milestones";

export function isSupported(): boolean {
  return "Notification" in window;
}

export function getPermission(): NotificationPermission | "unavailable" {
  if (!isSupported()) return "unavailable";
  return Notification.permission;
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!isSupported()) return "denied";
  return await Notification.requestPermission();
}

export function hasOptedIn(): boolean {
  return localStorage.getItem("daymarker-notifications") === "true";
}

export function setOptedIn(value: boolean): void {
  if (value) {
    localStorage.setItem("daymarker-notifications", "true");
  } else {
    localStorage.removeItem("daymarker-notifications");
  }
}

export function sendLocalNotification(title: string, body: string) {
  if (!isSupported() || Notification.permission !== "granted") return;
  new Notification(title, { body, icon: "/check-icon.png" });
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register("/sw.js");
  } catch {
    // SW registration failed silently
  }
}
