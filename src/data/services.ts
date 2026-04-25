export interface Service {
  slug: string;
  title: string;
  icon: string;
  shortDesc: string;
  longDesc: string;
  includes: string[];
}

export const services: Service[] = [
  {
    slug: 'university-selection',
    title: 'University Selection',
    icon: 'GraduationCap',
    shortDesc: 'Find the perfect universities that match your profile, budget, and career goals.',
    longDesc:
      'We analyze your academic profile, financial situation, and career aspirations to build a tailored list of universities — from safe choices to ambitious targets. Our counselors have detailed knowledge of admission patterns across 200+ universities in 7 countries.',
    includes: [
      'Academic profile assessment',
      'Shortlist of 8–12 universities across reach, match, and safe categories',
      'Detailed comparison report (tuition, scholarships, rankings, placement)',
      'Course-specific guidance',
    ],
  },
  {
    slug: 'application-support',
    title: 'Application Support',
    icon: 'FileText',
    shortDesc: 'End-to-end assistance with applications, essays, and documentation.',
    longDesc:
      'We guide you through every step of the application process — from creating compelling SOPs and LOR briefs to ensuring your transcripts and documents meet each university\'s exact requirements. Our students see a 94% acceptance rate at their shortlisted universities.',
    includes: [
      'Statement of Purpose (SOP) writing guidance and review',
      'Letter of Recommendation (LOR) briefing',
      'Application form review and submission support',
      'Document checklist and verification',
      'Deadline tracking and reminders',
    ],
  },
  {
    slug: 'visa-assistance',
    title: 'Visa Assistance',
    icon: 'Stamp',
    shortDesc: '98% visa success rate with complete documentation guidance.',
    longDesc:
      'Our visa experts stay current with the latest immigration rules across all 7 destination countries. We prepare you for your visa interview, review every document, and ensure your application meets current requirements — giving you the best chance of a successful outcome.',
    includes: [
      'Visa type determination and eligibility check',
      'Document preparation and review',
      'Financial documentation guidance',
      'Mock visa interview preparation',
      'Application tracking and follow-up',
    ],
  },
  {
    slug: 'scholarship-guidance',
    title: 'Scholarship Guidance',
    icon: 'Award',
    shortDesc: 'Identify and apply for scholarships worth thousands in funding.',
    longDesc:
      'We maintain an updated database of 500+ scholarships across government, university, and private sources. Our counselors match you to the best opportunities and guide you through applications, helping students secure an average of ₹5–15 lakh in funding.',
    includes: [
      'Personalized scholarship matching',
      'Scholarship essay and motivation letter guidance',
      'Merit-based and need-based scholarship research',
      'External funding source identification (government, trusts)',
      'Application deadline management',
    ],
  },
  {
    slug: 'test-preparation',
    title: 'Test Preparation',
    icon: 'BookOpen',
    shortDesc: 'IELTS, TOEFL, GRE, GMAT coaching and strategy sessions.',
    longDesc:
      'Achieving the right scores is critical for your dream university. Our partner coaching centers offer structured preparation programs for IELTS, TOEFL, PTE, GRE, and GMAT — with practice tests, one-on-one sessions, and score guarantee programs.',
    includes: [
      'Diagnostic assessment and study plan',
      'IELTS / TOEFL / PTE English proficiency coaching',
      'GRE / GMAT coaching for postgraduate applicants',
      'Practice tests and score analysis',
      'Score improvement strategies',
    ],
  },
  {
    slug: 'pre-departure-support',
    title: 'Pre-Departure Support',
    icon: 'Plane',
    shortDesc: 'Accommodation, travel, banking, and arrival guidance for a smooth start.',
    longDesc:
      'Getting your visa is just the beginning. We ensure you\'re fully prepared for life abroad — from finding safe accommodation to understanding local transportation, opening a bank account, and connecting with our alumni network in your destination city.',
    includes: [
      'Accommodation search and guidance',
      'Travel and health insurance advice',
      'International banking setup',
      'Pre-departure orientation session',
      'Alumni network introduction in destination city',
    ],
  },
];
