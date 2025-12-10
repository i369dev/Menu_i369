
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Project, Page } from '../types';
import { Language } from '../utils/translations';
import { WorkList } from './work/WorkList';
import { ProjectDetail } from './work/ProjectDetail';
import { useContent } from '../context/ContentContext';

interface WorkSectionProps {
    isFirstLoad?: boolean;
    language: Language;
    onLanguageChange: (lang: Language) => void;
    onDetailViewChange?: (isOpen: boolean) => void;
    setPage: (page: Page) => void;
}

export const WorkSection: React.FC<WorkSectionProps> = ({ isFirstLoad = false, language, onLanguageChange, onDetailViewChange, setPage }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { getLocalizedProjects } = useContent();
  const projects = getLocalizedProjects(language);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    window.scrollTo(0, 0); 
  };

  const handleClose = () => {
    setSelectedProject(null);
  };

  const handleNextProject = () => {
      if (!selectedProject) return;
      const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
      const nextIndex = (currentIndex + 1) % projects.length;
      handleProjectSelect(projects[nextIndex]);
  };

  useEffect(() => {
      if (selectedProject) {
          const updated = projects.find(p => p.id === selectedProject.id);
          if (updated) setSelectedProject(updated);
      }
  }, [language, projects]);

  useEffect(() => {
    if (onDetailViewChange) {
        onDetailViewChange(!!selectedProject);
    }
    return () => {
        if (onDetailViewChange) onDetailViewChange(false);
    };
  }, [selectedProject, onDetailViewChange]);

  return (
    <AnimatePresence mode='wait'>
        {!selectedProject ? (
            <WorkList 
                key="list" 
                onSelect={handleProjectSelect} 
                isFirstLoad={isFirstLoad} 
                projects={projects} 
                language={language} 
                onLanguageChange={onLanguageChange}
                setPage={setPage}
            />
        ) : (
            <ProjectDetail 
                key="detail" 
                project={selectedProject} 
                onClose={handleClose} 
                onNext={handleNextProject}
                nextProject={projects[(projects.findIndex(p => p.id === selectedProject.id) + 1) % projects.length]}
                language={language}
            />
        )}
    </AnimatePresence>
  );
};
