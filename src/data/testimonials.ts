export interface Testimonial {
  name: string;
  origin: string;
  destination: string;
  quote: string;
  year: number;
  photo: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Priya Sharma',
    origin: 'Delhi, India',
    destination: 'University of Toronto, Canada',
    quote:
      'Ranamo Edu made my dream of studying in Canada a reality. From university selection to visa approval, every step was handled professionally. I got a 50% scholarship on top of it!',
    year: 2024,
    photo: '/images/testimonials/priya.webp',
  },
  {
    name: 'Rahul Mehta',
    origin: 'Mumbai, India',
    destination: 'University of Manchester, UK',
    quote:
      'I was confused about which country to choose. My counselor helped me compare costs, job prospects, and visa rules. The clarity I got in just two sessions was priceless.',
    year: 2024,
    photo: '/images/testimonials/rahul.webp',
  },
  {
    name: 'Ayesha Nair',
    origin: 'Kochi, India',
    destination: 'Technical University of Munich, Germany',
    quote:
      'Germany was not even on my radar initially. Ranamo Edu showed me I could get a world-class engineering degree for almost no tuition. My SOP was refined through 5 rounds — worth every revision.',
    year: 2023,
    photo: '/images/testimonials/ayesha.webp',
  },
  {
    name: 'Karan Singh',
    origin: 'Chandigarh, India',
    destination: 'University of Melbourne, Australia',
    quote:
      'The visa process for Australia is notoriously complex. The team prepared every single document and did three mock interviews with me. Got my visa in 3 weeks!',
    year: 2024,
    photo: '/images/testimonials/karan.webp',
  },
  {
    name: 'Sneha Reddy',
    origin: 'Hyderabad, India',
    destination: 'Trinity College Dublin, Ireland',
    quote:
      'As a working professional making a career shift, I needed a counselor who understood my situation. Ranamo Edu helped me craft a compelling SOP that explained my career break perfectly.',
    year: 2023,
    photo: '/images/testimonials/sneha.webp',
  },
  {
    name: 'Arjun Verma',
    origin: 'Pune, India',
    destination: 'Stanford University, USA',
    quote:
      'Stanford was a long shot but my counselor believed in my profile. They helped me tailor every part of my application — and I got in with a research assistantship. Life-changing.',
    year: 2023,
    photo: '/images/testimonials/arjun.webp',
  },
];
