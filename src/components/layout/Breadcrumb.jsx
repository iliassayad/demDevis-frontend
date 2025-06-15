import { Breadcrumb as BSBreadcrumb } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const Breadcrumb = () => {
  const location = useLocation();
  
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    const breadcrumbNameMap = {
      '/clients': 'Clients',
      '/devis': 'Devis',
      '/analytics': 'Analytics'
    };

    return [
      { path: '/', name: 'Accueil', icon: FiHome },
      ...pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        return {
          path: routeTo,
          name: breadcrumbNameMap[routeTo] || name,
        };
      })
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <div className="bg-white border-bottom py-2">
      <div className="container-fluid px-3 px-lg-4">
        <BSBreadcrumb className="mb-0">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const IconComponent = crumb.icon;
            
            return (
              <BSBreadcrumb.Item
                key={crumb.path}
                active={isLast}
                linkAs={isLast ? 'span' : Link}
                linkProps={isLast ? {} : { to: crumb.path }}
                className="d-flex align-items-center"
              >
                {IconComponent && <IconComponent size={14} className="me-1" />}
                {crumb.name}
              </BSBreadcrumb.Item>
            );
          })}
        </BSBreadcrumb>
      </div>
    </div>
  );
};

export default Breadcrumb;