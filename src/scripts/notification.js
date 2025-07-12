export function showNotification(message) {
  let notif = document.getElementById('cart-notification');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'cart-notification';
    notif.style.position = 'fixed';
    notif.style.top = '24px';
    notif.style.right = '24px';
    notif.style.background = '#333';
    notif.style.color = '#fff';
    notif.style.padding = '14px 28px';
    notif.style.borderRadius = '6px';
    notif.style.zIndex = '9999';
    notif.style.fontSize = '16px';
    notif.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    notif.style.opacity = '0';
    notif.style.transition = 'opacity 0.3s';
    notif.style.pointerEvents = 'none';
    document.body.appendChild(notif);
  }
  notif.textContent = message;
  notif.style.opacity = '1';
  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => {
      if (notif.parentNode) notif.parentNode.removeChild(notif);
    }, 300);
  }, 1500);
}