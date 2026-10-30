const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

export const SUPER_ADMIN_EMAIL = 'rohith.satheesh.sa@gmail.com';

export const DEFAULT_HOMEPAGE = {
  hero_eyebrow: 'Film • Media • Design • Digital',
  hero_line1: 'Eternal',
  hero_line2: 'Creative Studio',
  hero_tagline: 'Stories. Visuals. Ideas.',
  hero_image: 'https://media.db.com/images/public/6aabededfb495e66b0aa0b93/8e317b938_generated_613c169b.jpg',
  intro_text:
    'Eternal Creative Studio is a creative studio working across Film, Media, Design and Digital — creating stories, visuals and ideas with intention.',
};

export const DEFAULT_SETTINGS = {
  site_title: 'Eternal Creative Studio',
  seo_title: 'Eternal Creative Studio — Film • Media • Design • Digital',
  meta_description:
    'Eternal Creative Studio is a creative studio in Thiruvananthapuram working across Film, Media, Design and Digital.',
  social_image: '',
  instagram_url: 'https://instagram.com/eternal.creativestudio',
  contact_email: '',
  contact_phone: '',
  address: 'Thiruvananthapuram, Kerala',
  footer_note: 'A company of Eternal Groups',
};