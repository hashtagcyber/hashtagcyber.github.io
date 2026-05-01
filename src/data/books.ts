export interface Book {
  title: string;
  authors: string;
  description: string;
  url: string;
}

export const books: Book[] = [
  {
    title: 'Our Iceberg is Melting',
    authors: 'John Kotter, Holger Rathgeber',
    description: 'Leading change, told in a fun way.',
    url: 'https://a.co/d/dKqdaqg',
  },
  {
    title: 'Thats Not How We Do It Here!',
    authors: 'John Kotter, Holger Rathgeber',
    description: 'Follow-up fable to `Our Iceberg is Melting` - this time with Meerkats',
    url: 'https://a.co/d/avv5LgR',
  },
  {
    title: 'The Phoenix Project',
    authors: 'Gene Kim, Kevin Behr, George Spafford',
    description: 'A novel about IT, DevOps, and helping your business win.',
    url: 'https://www.amazon.com/Phoenix-Project-DevOps-Helping-Business/dp/1942788290/',
  },
  {
    title: 'The DevOps Handbook',
    authors: 'Gene Kim, Jez Humble, Patrick Debois, John Willis',
    description: 'How to create world-class agility, reliability, and security in technology organizations.',
    url: 'https://www.amazon.com/DevOps-Handbook-World-Class-Reliability-Organizations/dp/1942788002/',
  },
  {
    title: 'The Pragmatic Programmer',
    authors: 'David Thomas, Andrew Hunt, Anna Katarina',
    description: 'Shipping, Testing, and Team Building.',
    url: 'https://www.amazon.com/DevOps-Handbook-World-Class-Reliability-Organizations/dp/1942788002/',
  },
];
