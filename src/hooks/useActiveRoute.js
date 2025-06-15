import { useLocation } from 'react-router-dom';

export const useActiveRoute = () => {
  const location = useLocation();

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getActiveRouteTitle = () => {
    const routes = {
      '/': 'Dashboard',
      '/clients': 'Gestion des Clients',
      '/devis': 'Gestion des Devis',
      '/analytics': 'Analytics'
    };

    for (const [path, title] of Object.entries(routes)) {
      if (isActiveRoute(path)) {
        return title;
      }
    }
    return 'DevisDem';
  };

  return {
    isActiveRoute,
    getActiveRouteTitle,
    currentPath: location.pathname
  };
};