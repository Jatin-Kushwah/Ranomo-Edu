export interface University {
  name: string;
  country: string;
  ranking: string;
}

export const universities: University[] = [
  { name: 'University of Oxford', country: 'UK', ranking: '#1 UK' },
  { name: 'University of Cambridge', country: 'UK', ranking: '#2 UK' },
  { name: 'Imperial College London', country: 'UK', ranking: '#3 UK' },
  { name: 'Massachusetts Institute of Technology', country: 'USA', ranking: '#1 Global' },
  { name: 'Stanford University', country: 'USA', ranking: '#3 Global' },
  { name: 'Harvard University', country: 'USA', ranking: '#4 Global' },
  { name: 'University of Toronto', country: 'Canada', ranking: '#1 Canada' },
  { name: 'McGill University', country: 'Canada', ranking: '#2 Canada' },
  { name: 'University of Melbourne', country: 'Australia', ranking: '#1 Australia' },
  { name: 'Technical University of Munich', country: 'Germany', ranking: '#1 Germany' },
  { name: 'University of Auckland', country: 'New Zealand', ranking: '#1 NZ' },
  { name: 'Trinity College Dublin', country: 'Ireland', ranking: '#1 Ireland' },
  { name: 'University of British Columbia', country: 'Canada', ranking: '#3 Canada' },
  { name: 'Australian National University', country: 'Australia', ranking: '#2 Australia' },
  { name: 'University of Edinburgh', country: 'UK', ranking: '#5 UK' },
];
