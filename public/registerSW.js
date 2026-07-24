/*
 * Compatibility clean-up for HTML cached by the portfolio's former PWA.
 * The old shell loads this path automatically.
 */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map((registration) => registration.update()),
    );
  });
}
