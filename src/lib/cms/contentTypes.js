/**
 * Metadata that drives the dashboard CMS: lists, forms, search and publishing
 * for every content type share one implementation.
 */
export const contentTypes = {
  photography: {
    entity: 'PhotographyEvent',
    label: 'Photography',
    singular: 'Photography Event',
    section: 'photography',
    titleField: 'event_title',
    coverField: 'cover_image',
    publicPath: (r) => `/photography/${r.slug}`,
    searchFields: ['event_title', 'location', 'city', 'category', 'client_name'],
    subtitleField: 'category',
    metaFields: ['date', 'location'],
    filterField: 'category',
    showGallery: true,
    defaults: {
      published: false,
      featured: false,
      display_order: 0,
      gallery_button_text: 'VIEW PHOTOGRAPHY GALLERY',
    },
    sections: [
      {
        title: 'Event Information',
        fields: [
          { name: 'event_title', label: 'Event title', type: 'text', required: true, placeholder: 'ASMITA South Zone 2026' },
          { name: 'slug', label: 'URL slug', type: 'slug', required: true, from: 'event_title', hint: 'Appears at /photography/<slug>' },
          { name: 'category', label: 'Category', type: 'text', placeholder: 'Sports Photography' },
          { name: 'client_name', label: 'Client / organisation', type: 'text', placeholder: 'Optional' },
          { name: 'date', label: 'Event date', type: 'text', placeholder: '23–25 October 2026' },
          { name: 'end_date', label: 'End date', type: 'text', placeholder: 'Optional' },
          { name: 'location', label: 'Location', type: 'text', placeholder: 'Jimmy George Indoor Stadium, Thiruvananthapuram' },
          { name: 'city', label: 'City', type: 'text' },
          { name: 'state', label: 'State', type: 'text' },
          { name: 'short_description', label: 'Short description', type: 'textarea', rows: 3, full: true },
          { name: 'full_description', label: 'Full description', type: 'textarea', rows: 6, full: true },
        ],
      },
      {
        title: 'Cover Image',
        fields: [
          { name: 'cover_image', label: 'Cover image', type: 'image', full: true },
          { name: 'cover_alt', label: 'Image alt text', type: 'text', full: true },
        ],
      },
      {
        title: 'External Gallery',
        fields: [
          { name: 'pixieset_url', label: 'Pixieset gallery URL', type: 'url', full: true, placeholder: 'https://eternalcreativestudio.pixieset.com/…' },
          { name: 'gallery_button_text', label: 'Gallery button text', type: 'text', full: true, placeholder: 'VIEW PHOTOGRAPHY GALLERY' },
        ],
      },
      {
        title: 'SEO',
        fields: [
          { name: 'seo_title', label: 'SEO title', type: 'text', full: true },
          { name: 'meta_description', label: 'Meta description', type: 'textarea', rows: 3, full: true },
          { name: 'social_image', label: 'Social sharing image', type: 'image', full: true },
        ],
      },
      {
        title: 'Publishing',
        fields: [
          { name: 'published', label: 'Published', type: 'toggle' },
          { name: 'featured', label: 'Featured', type: 'toggle' },
          { name: 'display_order', label: 'Display order', type: 'number', hint: 'Lower numbers appear first' },
        ],
      },
    ],
  },

  projects: {
    entity: 'Project',
    label: 'Projects',
    singular: 'Project',
    section: 'projects',
    titleField: 'title',
    coverField: 'cover_image',
    publicPath: (r) => `/work/${r.slug}`,
    searchFields: ['title', 'category', 'client_name', 'location'],
    subtitleField: 'category',
    metaFields: ['date', 'location'],
    filterField: 'client_type',
    defaults: { published: false, featured: false, display_order: 0, client_type: 'Client' },
    sections: [
      {
        title: 'Project Information',
        fields: [
          { name: 'title', label: 'Project title', type: 'text', required: true },
          { name: 'slug', label: 'URL slug', type: 'slug', required: true, from: 'title', hint: 'Appears at /work/<slug>' },
          { name: 'category', label: 'Category', type: 'text', placeholder: 'Brand Film' },
          { name: 'client_type', label: 'Client type', type: 'select', options: ['Client', 'In-house'] },
          { name: 'client_name', label: 'Client name', type: 'text' },
          { name: 'date', label: 'Date', type: 'text', placeholder: '2026' },
          { name: 'location', label: 'Location', type: 'text' },
          { name: 'role', label: 'Role', type: 'text', placeholder: 'Direction, Production, Post' },
        ],
      },
      {
        title: 'Story',
        fields: [
          { name: 'short_description', label: 'Short description', type: 'textarea', rows: 3, full: true },
          { name: 'full_description', label: 'Full description', type: 'textarea', rows: 6, full: true },
          { name: 'services_provided', label: 'Services provided', type: 'textarea', rows: 3, full: true },
          { name: 'credits', label: 'Credits', type: 'textarea', rows: 4, full: true },
        ],
      },
      {
        title: 'Media',
        fields: [
          { name: 'cover_image', label: 'Cover image', type: 'image', full: true },
          { name: 'hero_media', label: 'Hero image', type: 'image', full: true },
          { name: 'gallery_images', label: 'Additional images', type: 'images', full: true },
        ],
      },
      {
        title: 'SEO',
        fields: [
          { name: 'seo_title', label: 'SEO title', type: 'text', full: true },
          { name: 'meta_description', label: 'Meta description', type: 'textarea', rows: 3, full: true },
          { name: 'social_image', label: 'Social sharing image', type: 'image', full: true },
        ],
      },
      {
        title: 'Publishing',
        fields: [
          { name: 'published', label: 'Published', type: 'toggle' },
          { name: 'featured', label: 'Featured', type: 'toggle' },
          { name: 'display_order', label: 'Display order', type: 'number' },
        ],
      },
    ],
  },

  productions: {
    entity: 'Production',
    label: 'Productions',
    singular: 'Production',
    section: 'productions',
    titleField: 'title',
    coverField: 'cover_image',
    publicPath: (r) => `/production/${r.slug}`,
    searchFields: ['title', 'production_number', 'type', 'location'],
    subtitleField: 'type',
    metaFields: ['production_number', 'date'],
    filterField: 'type',
    defaults: { published: false, featured: false, display_order: 0 },
    sections: [
      {
        title: 'Production Information',
        fields: [
          { name: 'production_number', label: 'Reference number', type: 'text', placeholder: 'ECS/03' },
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'slug', label: 'URL slug', type: 'slug', required: true, from: 'title', hint: 'Appears at /production/<slug>' },
          { name: 'type', label: 'Type', type: 'text', placeholder: 'Documentary' },
          { name: 'date', label: 'Date / year', type: 'text' },
          { name: 'location', label: 'Location', type: 'text' },
          { name: 'role', label: 'Role', type: 'text' },
        ],
      },
      {
        title: 'Story',
        fields: [
          { name: 'short_description', label: 'Short description', type: 'textarea', rows: 3, full: true },
          { name: 'full_description', label: 'Full description', type: 'textarea', rows: 6, full: true },
          { name: 'credits', label: 'Credits', type: 'textarea', rows: 4, full: true },
        ],
      },
      {
        title: 'Media',
        fields: [
          { name: 'cover_image', label: 'Cover image', type: 'image', full: true },
          { name: 'hero_media', label: 'Hero image', type: 'image', full: true },
          { name: 'video_url', label: 'Video embed URL', type: 'url', full: true, placeholder: 'https://www.youtube.com/embed/…' },
        ],
      },
      {
        title: 'SEO',
        fields: [
          { name: 'seo_title', label: 'SEO title', type: 'text', full: true },
          { name: 'meta_description', label: 'Meta description', type: 'textarea', rows: 3, full: true },
          { name: 'social_image', label: 'Social sharing image', type: 'image', full: true },
        ],
      },
      {
        title: 'Publishing',
        fields: [
          { name: 'published', label: 'Published', type: 'toggle' },
          { name: 'featured', label: 'Featured', type: 'toggle' },
          { name: 'display_order', label: 'Display order', type: 'number' },
        ],
      },
    ],
  },

  services: {
    entity: 'Service',
    label: 'Services',
    singular: 'Service',
    section: 'services',
    titleField: 'title',
    publicPath: () => '/services',
    searchFields: ['title', 'pillar', 'capabilities'],
    subtitleField: 'pillar',
    metaFields: ['capabilities'],
    filterField: 'pillar',
    defaults: { published: false, display_order: 0, pillar: 'Film' },
    sections: [
      {
        title: 'Service',
        fields: [
          { name: 'title', label: 'Service title', type: 'text', required: true },
          { name: 'slug', label: 'URL slug', type: 'slug', required: true, from: 'title' },
          { name: 'pillar', label: 'Discipline', type: 'select', options: ['Film', 'Media', 'Design', 'Digital'] },
          { name: 'display_order', label: 'Display order', type: 'number' },
        ],
      },
      {
        title: 'Description',
        fields: [
          { name: 'short_description', label: 'Short description', type: 'textarea', rows: 3, full: true },
          { name: 'capabilities', label: 'Capabilities', type: 'textarea', rows: 3, full: true, hint: 'Comma-separated list shown beneath the description' },
        ],
      },
      {
        title: 'SEO',
        fields: [
          { name: 'seo_title', label: 'SEO title', type: 'text', full: true },
          { name: 'meta_description', label: 'Meta description', type: 'textarea', rows: 3, full: true },
        ],
      },
      {
        title: 'Publishing',
        fields: [{ name: 'published', label: 'Published', type: 'toggle' }],
      },
    ],
  },
};

export function getContentType(key) {
  return contentTypes[key] || null;
}