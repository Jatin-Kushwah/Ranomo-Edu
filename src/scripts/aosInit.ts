import AOS from 'aos';

export function aosInit(): void {
  try {
    AOS.init({
      duration: 700,
      easing: 'ease-in-out',
      once: true,
      offset: 80,
    });
  } catch (e) {
    // Degrade gracefully if AOS fails
  }
}
