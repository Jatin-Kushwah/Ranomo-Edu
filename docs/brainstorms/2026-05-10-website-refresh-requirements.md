---
date: 2026-05-10
topic: website-refresh
---

# Website Refresh — Brand, Content & AI Positioning

## Problem Frame

The Ranamo Edu website needs a content and brand refresh to: (1) position AI as a core differentiator, (2) reduce inflated social-proof numbers to credible values, (3) simplify navigation by removing low-traffic sections, and (4) modernise the logo and brand typography. The site is a fully static Astro build with no CMS — all changes are file-level edits.

## Requirements

**Logo & Brand**

- R1. Replace the current globe SVG logo in the header and footer with a new inline SVG: a stylised cursive "R" whose leg/tail flows into a small rocket pointing upper-right, on a rounded blue (#1e40af) background. The rocket nose uses amber (#fbbf24) and the flame uses (#f59e0b). No external image files — pure inline SVG at 32×32 display size.
- R2. Update the "Ranamo Edu" wordmark in both header and footer: render "Ranamo" in the primary blue and "Edu" in the accent amber, using `font-extrabold tracking-tight`. The overall style should feel premium and modern within the Inter typeface already loaded.

**Hero Section (`src/components/sections/Hero.astro`)**

- R3. Change the trust badge from "Trusted by 5,000+ Students" → "Trusted by 2,000+ Students".
- R4. Replace the hero subtitle: "Expert study abroad counseling for UK, USA, Canada, Australia, Germany, New Zealand, and Ireland. From university selection to visa approval — we guide you every step of the way." → "Explore, compare, and apply to top global universities and courses—powered by AI and guided by expert counsellors."
- R5. Change the primary CTA button label: "Book Free Consultation" → "Book Consultation".
- R6. Update the four hero stats strip:
  - "5,000+ / Students Placed" → "2,000+ / Dreams Turned Into Reality"
  - "200+ / Universities" → "500+ / Top Universities Worldwide"
  - "15+ / Countries" — unchanged
  - "98% / Visa Success" → "98% / Visa Approval Success"
- R7. In the hero card, remove the "University of Toronto" subtitle line beneath "Application Submitted".
- R8. Replace the hero card step list (was 4 steps) with these 5 steps in order: "Profile Assessment with AI", "University Shortlisting", "Application Submitted", "Offer Received", "Visa Filing". First 3 steps show a ✓ checkmark; steps 4 and 5 show their step number (4, 5) in a muted style.

**Destinations Section (`src/components/sections/DestinationsStrip.astro`)**

- R9. Remove the small eyebrow label "Where Will You Study?" above the "Top Study Destinations" heading.

**Services Section (`src/components/sections/ServicesSection.astro`)**

- R10. Remove the eyebrow label "What We Offer".
- R11. Change the section heading: "Comprehensive Study Abroad Services" → "Why We're the Best Choice".
- R12. Change the section description: "From your first country shortlist to the day you land — we provide end-to-end support so you can focus on your future." → "We combine technology, expertise, and a student-first mindset to make studying abroad simpler, smarter, and more successful."

**How It Works Section (`src/components/sections/HowItWorks.astro`)**

- R13. Remove the eyebrow label "The Process".
- R14. Rename Step 01: "Profile Assessment" → "AI-Powered Profile Assessment". Update its description to: "Our AI analyzes your academics, test scores, budget, and career goals to build a comprehensive picture of your potential."
- R15. Update the section sub-description count: "5,000+ students" → "2,000+ students".

**Stats Section (`src/components/sections/StatsSection.astro`)**

- R16. Update all four stats to mirror the hero section numbers and add updated labels:
  - 5000+ Students Placed → 2000+ Dreams Turned Into Reality (desc: "Across 15+ countries")
  - 200+ University Partners → 500+ Top Universities Worldwide (desc: "Top-ranked institutions")
  - 98% Visa Success Rate → 98% Visa Approval Success (desc: "Student visa approvals")
  - 500+ Scholarships Secured → 500+ Scholarships Rewarded (desc: "Worth ₹50+ crore")

**Navigation — Remove Blog & Success Stories**

- R17. Remove "Success Stories" and "Blog" from the header nav links array (both desktop and mobile menus).
- R18. Remove "Success Stories" and "Blog" from the footer Quick Links list.
- R19. Remove `<Testimonials />` and `<BlogTeaser />` component imports and usages from `src/pages/index.astro`.

**CTA Section (`src/components/sections/CTASection.astro`)**

- R20. Change button label "Book Free Consultation" → "Book Consultation".
- R21. Change the section description from "Book a free 30-minute consultation…" → "Book a consultation with our expert counselors. Get instant, personalized AI-powered advice on the right universities, countries, and scholarships for your profile."
- R22. Update the three trust badges below the buttons:
  - "Free consultation" → "AI-Guided Counseling"
  - "No obligation" — unchanged
  - "Response within 24 hours" → "Instant Response"

**Footer (`src/components/Footer.astro`)**

- R23. Apply the new logo SVG and wordmark (same as R1, R2) to the footer brand column.
- R24. Replace the footer brand description: "Helping students achieve their dream of studying abroad since 2015. Expert counseling for UK, USA, Canada, Australia, Germany, New Zealand, and Ireland." → "Explore, compare, and apply to top global universities and courses—powered by AI and guided by expert counsellors."
- R25. Remove Facebook and X (Twitter) social icon links; keep only Instagram and LinkedIn.
- R26. In the footer Contact section, remove the physical address block ("123 MG Road, Bengaluru, Karnataka 560001, India").

**About Page (`src/pages/about.astro`)**

- R27. Change the hero subtitle: "Empowering Indian students to access world-class education since 2015." → "Empowering Indian students to access world-class education through AI-powered guidance and expert counseling."
- R28. Replace the three mission body paragraphs with:
  > "We are on a mission to revolutionize the way students pursue their study abroad journey by combining the power of AI with the expertise of experienced counsellors. Our platform simplifies complex decisions and empowers students with the right insights to confidently choose their future.
  >
  > With a strong student-first approach, we are committed to delivering exceptional service and ensuring a smooth, transparent, and stress-free experience for every student."
- R29. Change the "5,000+" stat card to "2,000+" (label stays "Students Placed"). Update the page meta description to reflect 2,000+ students.
- R30. Remove the entire "Meet the Team" section.
- R31. Remove the entire "Accreditations & Affiliations" section.
- R32. Update the About page CTA button: "Book Free Consultation →" → "Book Consultation →"; update the sub-copy "Book a free consultation with our team today." → "Book a consultation with our team today."

**Services Page (`src/pages/services.astro`)**

- R33. Update the services page CTA: "Get Started with a Free Consultation" → "Get Started with a Consultation"; "Book Free Consultation →" → "Book Consultation →".
- R34. Update the trust strip "5,000+" → "2,000+" Students Placed.

**Contact Page (`src/pages/contact.astro`)**

- R35. Update the hero subtitle: "Book a free consultation or drop us a message. Our counselors will respond within 24 hours." → "Book a consultation or drop us a message. Our AI-powered platform and expert counselors are ready to help."
- R36. Update the trust strip: "5,000+" → "2,000+"; "Free / Initial Consultation" → "Expert Consultation"; "24hr / Response Time" → "Instant Response".

**Header Dialog (`src/components/Header.astro`)**

- R37. Change "Book a Free Consultation" button label inside the AI Counselor dialog → "Book a Consultation".
- R38. Change the header desktop CTA button "Free Consultation" → "Book Consultation".

**AI Positioning (Global)**

- R39. Ensure AI is mentioned naturally and consistently where listed above (R4, R8, R14, R21, R22, R24, R27, R28) without forcing it into sections where it does not fit. Do not add AI mentions to the destinations strip, visa assistance service description, or test preparation service — those remain unchanged.

## Success Criteria

- Every instance of "Free Consultation" across all pages is replaced with "Book Consultation" (or equivalent non-"Free" phrasing).
- All social proof numbers are consistent across hero, stats section, about, services, and contact pages: 2,000+ students, 500+ universities, 98% visa approval, 500+ scholarships.
- Blog and Success Stories links are absent from both desktop nav, mobile nav, and footer.
- The new logo renders cleanly in both the white header and dark footer contexts.
- The About page shows no Team section and no Accreditations section.
- AI is mentioned in 5+ distinct, natural touchpoints across the site without feeling repetitive or forced.

## Scope Boundaries

- Do not delete the `src/pages/blog/` or `src/pages/success-stories.astro` page files — only remove their navigation links and homepage sections.
- Do not change the site's color palette, font family, or Tailwind configuration.
- Do not add new pages, new routes, or new data files.
- Do not alter the contact form logic, Netlify Forms integration, or WhatsApp button.
- Do not change the destinations data or university logos section.
- The services data file (`src/data/services.ts`) is not changed — only the section heading/description in `ServicesSection.astro`.
- The physical address in `src/pages/contact.astro` contact info card is retained (only the footer address block is removed per R26).

## Key Decisions

- **Logo as inline SVG, not image file**: Keeps zero-dependency static build; avoids a new asset pipeline entry; allows color via Tailwind classes.
- **"Book Consultation" (not "Schedule" or "Request")**: Matches existing UX pattern; "Book" implies commitment without the friction of "Schedule". "Free" is dropped because it may undermine perceived quality.
- **2,000+ not 5,000+**: More credible; aligns with the brand's early-growth positioning. Consistent across all pages.
- **500+ universities** (up from 200+): Reflects broader global reach and strengthens the comparison/AI-matching value prop.
- **Keep blog/success-stories pages, remove from nav**: Avoids dead links from external sources while decluttering navigation.
- **AI mentions kept to process and guidance touchpoints**: AI in profile assessment, university shortlisting, counseling delivery — not in visa filing or test prep, where AI is not a differentiator.

## Outstanding Questions

### Deferred to Planning

- [Affects R1][Technical] Exact SVG path data for the stylised R + rocket — planner should render and verify at 32px display size; the shape concept is clear (flowing R tail becomes rocket launch trajectory, amber nose, amber flame).
- [Affects R19][Needs research] Confirm that removing `<Testimonials />` and `<BlogTeaser />` from `index.astro` does not leave orphaned CSS or JS that causes build errors.

## Next Steps
→ `/ce:plan` for structured implementation planning
