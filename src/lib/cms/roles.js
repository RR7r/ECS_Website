import { SUPER_ADMIN_EMAIL } from './config';

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  photographer: 'Photographer',
};

export const SECTION_ACCESS = {
  super_admin: ['*'],
  admin: [
    'overview', 'photography', 'projects', 'productions', 'services', 'homepage',
    'media', 'enquiries', 'calendar', 'users', 'access_requests', 'roles', 'audit', 'settings',
  ],
  editor: ['overview', 'photography', 'projects', 'productions', 'services', 'media', 'calendar'],
  photographer: ['overview', 'photography', 'media', 'calendar'],
};

export function resolveRole(user) {
  if (!user) return null;
  if (user.email === SUPER_ADMIN_EMAIL) return 'super_admin';
  if (user.cms_role) return user.cms_role;
  return user.role === 'admin' ? 'admin' : 'editor';
}

export function resolveStatus(user) {
  if (!user) return 'pending';
  if (user.cms_status) return user.cms_status;
  return user.role === 'admin' ? 'approved' : 'pending';
}

export function canAccess(user, section) {
  const role = resolveRole(user);
  if (!role) return false;
  const sections = SECTION_ACCESS[role] || [];
  return sections.includes('*') || sections.includes(section);
}

export function isSuperAdmin(user) {
  return !!user && (user.email === SUPER_ADMIN_EMAIL || user.cms_role === 'super_admin');
}

export const ROLE_MATRIX = [
  { role: 'super_admin', label: 'Super Admin', summary: 'Complete control of the platform, users, roles and settings.', permissions: ['Every section', 'Manage users and roles', 'Publish and delete all content', 'Website settings', 'Audit logs'] },
  { role: 'admin', label: 'Admin', summary: 'Manages the website and approved users. Cannot alter the Super Admin.', permissions: ['All content sections', 'Media library', 'Enquiries and calendar', 'Approve access requests', 'Audit logs', 'Website settings'] },
  { role: 'editor', label: 'Editor', summary: 'Creates and edits content and drafts. Publishes their own entries.', permissions: ['Photography, Projects, Productions, Services', 'Media library', 'Calendar'] },
  { role: 'photographer', label: 'Photographer', summary: 'Manages photography events and covers.', permissions: ['Photography events and covers', 'Media library', 'Calendar'] },
];