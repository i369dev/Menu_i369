

import { Project } from '../types';
import { Language, translations } from './translations';

// Helper to get localized projects
export const getProjects = (lang: Language): Project[] => {
    // This function is now a stub. All project data is managed in Firestore.
    // Returning an empty array to ensure no dummy data is accidentally used.
    return [];
};
