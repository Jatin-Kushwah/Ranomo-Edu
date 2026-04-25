export interface Destination {
  slug: string;
  name: string;
  isoCode: string;
  heroImage: string;
  tagline: string;
  overview: string;
  topUniversities: string[];
  popularCourses: string[];
  entryRequirements: string;
  intakes: string[];
  avgTuitionRange: string;
  avgLivingCost: string;
}

export const destinations: Destination[] = [
  {
    slug: 'uk',
    name: 'United Kingdom',
    isoCode: 'gb',
    heroImage: '/images/destinations/uk.webp',
    tagline: 'World-class universities, globally respected degrees',
    overview:
      'The UK is home to some of the world\'s oldest and most prestigious universities. With shorter degree programs (3 years for bachelor\'s, 1 year for master\'s), students save both time and money while earning globally recognized qualifications.',
    topUniversities: ['University of Oxford', 'University of Cambridge', 'Imperial College London', 'University College London', 'University of Edinburgh'],
    popularCourses: ['Business & Management', 'Engineering', 'Law', 'Medicine', 'Computer Science', 'Finance'],
    entryRequirements: 'IELTS 6.0–7.5 (varies by university). Undergraduate: 12th grade with 65–85%. Postgraduate: bachelor\'s degree with 55–70%.',
    intakes: ['September (main)', 'January (limited)'],
    avgTuitionRange: '£10,000 – £38,000 per year',
    avgLivingCost: '£12,000 – £15,000 per year',
  },
  {
    slug: 'usa',
    name: 'United States',
    isoCode: 'us',
    heroImage: '/images/destinations/usa.webp',
    tagline: 'Innovation-driven education at the world\'s top research universities',
    overview:
      'The USA offers unparalleled research opportunities, a vibrant campus culture, and access to the world\'s largest economy for career development. With over 4,000 accredited universities, there is a perfect fit for every student.',
    topUniversities: ['Massachusetts Institute of Technology', 'Stanford University', 'Harvard University', 'University of California Berkeley', 'Columbia University'],
    popularCourses: ['Computer Science & AI', 'Business Administration', 'Engineering', 'Data Science', 'Public Health', 'Film & Media'],
    entryRequirements: 'TOEFL 80–100 or IELTS 6.5–7.5. SAT/ACT for undergrad. GRE/GMAT for postgrad. 60–85% in previous academics.',
    intakes: ['August/September (Fall)', 'January (Spring)'],
    avgTuitionRange: '$20,000 – $60,000 per year',
    avgLivingCost: '$15,000 – $25,000 per year',
  },
  {
    slug: 'canada',
    name: 'Canada',
    isoCode: 'ca',
    heroImage: '/images/destinations/canada.webp',
    tagline: 'Safe, multicultural, with clear pathways to permanent residency',
    overview:
      'Canada combines high-quality education with one of the world\'s most welcoming immigration policies. Post-graduation work permits and a clear PR pathway make Canada the top choice for students planning to build a career abroad.',
    topUniversities: ['University of Toronto', 'University of British Columbia', 'McGill University', 'University of Waterloo', 'McMaster University'],
    popularCourses: ['Computer Science', 'Engineering', 'Business', 'Healthcare', 'Environmental Studies', 'Artificial Intelligence'],
    entryRequirements: 'IELTS 6.0–7.0. 65–80% in previous academics. Some programs require GRE/GMAT for graduate admission.',
    intakes: ['September (main)', 'January', 'May (some programs)'],
    avgTuitionRange: 'CAD 15,000 – CAD 40,000 per year',
    avgLivingCost: 'CAD 12,000 – CAD 18,000 per year',
  },
  {
    slug: 'australia',
    name: 'Australia',
    isoCode: 'au',
    heroImage: '/images/destinations/australia.webp',
    tagline: 'Sun, quality of life, and globally ranked universities',
    overview:
      'Australia offers an exceptional quality of life alongside world-class universities. Students benefit from a safe, multicultural environment, generous post-study work rights (2–4 years), and proximity to Asia\'s booming economies.',
    topUniversities: ['University of Melbourne', 'Australian National University', 'University of Sydney', 'University of Queensland', 'Monash University'],
    popularCourses: ['Engineering', 'Business', 'Information Technology', 'Medicine & Nursing', 'Architecture', 'Agriculture'],
    entryRequirements: 'IELTS 6.0–7.5. 65–80% in 12th/bachelor\'s. PTE accepted as alternative to IELTS.',
    intakes: ['February (Semester 1)', 'July (Semester 2)'],
    avgTuitionRange: 'AUD 20,000 – AUD 45,000 per year',
    avgLivingCost: 'AUD 18,000 – AUD 25,000 per year',
  },
  {
    slug: 'germany',
    name: 'Germany',
    isoCode: 'de',
    heroImage: '/images/destinations/germany.webp',
    tagline: 'Affordable tuition, engineering excellence, and Europe\'s heart',
    overview:
      'Germany is famous for its engineering and technical universities and offers tuition-free or very low-cost education at public universities. With a growing number of English-taught programs and a booming economy, it\'s a rising star for international students.',
    topUniversities: ['Technical University of Munich', 'Ludwig Maximilian University of Munich', 'Heidelberg University', 'Humboldt University of Berlin', 'RWTH Aachen'],
    popularCourses: ['Engineering & Technology', 'Natural Sciences', 'Business & Economics', 'Computer Science', 'Architecture', 'Medicine'],
    entryRequirements: 'English programs: IELTS 6.0–7.0. German programs: TestDaF or DSH. APS certificate required for Indian students.',
    intakes: ['October (Winter Semester)', 'April (Summer Semester)'],
    avgTuitionRange: '€0 – €3,000 per semester (public universities)',
    avgLivingCost: '€700 – €1,200 per month (€8,400 – €14,400/year)',
  },
  {
    slug: 'new-zealand',
    name: 'New Zealand',
    isoCode: 'nz',
    heroImage: '/images/destinations/new-zealand.webp',
    tagline: 'Stunning landscapes, safe campuses, and work-friendly visas',
    overview:
      'New Zealand offers a safe, friendly environment with internationally recognized qualifications. Students enjoy breathtaking natural beauty alongside strong academic programs, and can work up to 20 hours per week during studies.',
    topUniversities: ['University of Auckland', 'University of Otago', 'Victoria University of Wellington', 'University of Canterbury', 'Massey University'],
    popularCourses: ['Agriculture & Veterinary Science', 'Business', 'Tourism & Hospitality', 'Engineering', 'Computer Science', 'Environmental Science'],
    entryRequirements: 'IELTS 6.0–7.0. 65–75% in previous academics.',
    intakes: ['February (Semester 1)', 'July (Semester 2)'],
    avgTuitionRange: 'NZD 22,000 – NZD 35,000 per year',
    avgLivingCost: 'NZD 15,000 – NZD 20,000 per year',
  },
  {
    slug: 'ireland',
    name: 'Ireland',
    isoCode: 'ie',
    heroImage: '/images/destinations/ireland.webp',
    tagline: 'English-speaking EU country with tech-hub career opportunities',
    overview:
      'Ireland is the only English-speaking country in the EU, home to European headquarters of companies like Google, Apple, Facebook, and Pfizer. This makes it a strategic choice for students seeking EU residency pathways and access to multinational employers.',
    topUniversities: ['Trinity College Dublin', 'University College Dublin', 'University College Cork', 'NUI Galway', 'Dublin City University'],
    popularCourses: ['Computer Science & IT', 'Pharmaceutical Sciences', 'Business', 'Engineering', 'Data Analytics', 'Finance'],
    entryRequirements: 'IELTS 6.0–7.0. 60–75% in previous academics.',
    intakes: ['September (main)', 'January (some programs)'],
    avgTuitionRange: '€10,000 – €25,000 per year',
    avgLivingCost: '€12,000 – €16,000 per year',
  },
];
