(async function app() {
  const notificationButton = document.getElementById('push');

  const sendNotification = async () => {
    const notifRegistration = await navigator.serviceWorker.getRegistration();
    notifRegistration.showNotification('My Name is Fluffy', { body: 'Meow!' });
  };

  const enableNotificationButton = () => {
    notificationButton.addEventListener('click', sendNotification);
  };

  const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log(registration);

        if (registration.installing) {
          console.log("Service worker installing");
        } else if (registration.waiting) {
          console.log("Service worker installed");
        } else if (registration.active) {
          console.log("Service worker active");
        }
      } catch (error) {
        console.error(`Registration failed with ${error}`);
      }

      console.log(navigator.serviceWorker.controller);
    }
  };

  const checkNotificationSupport =  () => {
    if ('Notification' in window) {
      console.log('Notifications are supported');
    }
  };

  const requestNotificationPermission = () => {
    return Notification.requestPermission((status) => {
      console.log('Permission Status', status);
    });
  }

  try {
    await registerServiceWorker();
    checkNotificationSupport();
    requestNotificationPermission();
    enableNotificationButton();
  } catch {
    console.log('Not enough support is there.');
  }
})();
