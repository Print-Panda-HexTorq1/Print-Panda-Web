self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {};
  }

  const title = payload.title || "Print Panda update";
  const options = {
    body: payload.body || "Your print job status changed.",
    data: {
      url: payload.url || "/",
      jobId: payload.jobId || null
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification?.data?.url || "/", self.location.origin).href;

  event.waitUntil((async () => {
    const windowClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
    const existing = windowClients.find((client) => client.url === targetUrl);
    if (existing) {
      await existing.focus();
      return;
    }
    await clients.openWindow(targetUrl);
  })());
});
