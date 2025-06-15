import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, ProgressBar } from 'react-bootstrap';
import { 
  FiUsers, 
  FiFileText, 
  FiDollarSign, 
  FiTrendingUp, 
  FiCalendar,
  FiMapPin,
  FiRefreshCw,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiMail,
  FiEdit3,
  FiSend
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useDevis } from '../hooks/useDevis';
import { useClients } from '../hooks/useClients';

const Dashboard = () => {
  const { devis, loading: devisLoading } = useDevis();
  const { clients, loading: clientsLoading } = useClients();
  const [refreshTime, setRefreshTime] = useState(new Date());

  // Calculs basés sur les vraies données
  const calculateStats = () => {
    if (!devis || !clients) return null;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Devis du mois actuel
    const devisThisMonth = devis.filter(d => {
      const devisDate = new Date(d.dateDevis);
      return devisDate.getMonth() === currentMonth && devisDate.getFullYear() === currentYear;
    });

    // Devis du mois dernier
    const devisLastMonth = devis.filter(d => {
      const devisDate = new Date(d.dateDevis);
      return devisDate.getMonth() === lastMonth && devisDate.getFullYear() === lastMonthYear;
    });

    // Calcul du chiffre d'affaires (devis acceptés uniquement)
    const chiffreAffaires = devis
      .filter(d => d.statut === 'ACCEPTE')
      .reduce((total, d) => total + (d.prixTTC || 0), 0);

    const chiffreAffairesLastMonth = devis
      .filter(d => {
        const devisDate = new Date(d.dateDevis);
        return d.statut === 'ACCEPTE' && 
               devisDate.getMonth() === lastMonth && 
               devisDate.getFullYear() === lastMonthYear;
      })
      .reduce((total, d) => total + (d.prixTTC || 0), 0);

    // Taux de conversion
    const devisEnvoyes = devis.filter(d => d.statut === 'ENVOYE' || d.statut === 'ACCEPTE' || d.statut === 'REFUSE').length;
    const devisAcceptes = devis.filter(d => d.statut === 'ACCEPTE').length;
    const tauxConversion = devisEnvoyes > 0 ? Math.round((devisAcceptes / devisEnvoyes) * 100) : 0;

    // Calcul des pourcentages de changement
    const changeDevis = devisLastMonth.length > 0 ? 
      Math.round(((devisThisMonth.length - devisLastMonth.length) / devisLastMonth.length) * 100) : 
      (devisThisMonth.length > 0 ? 100 : 0);

    const changeCA = chiffreAffairesLastMonth > 0 ? 
      Math.round(((chiffreAffaires - chiffreAffairesLastMonth) / chiffreAffairesLastMonth) * 100) : 
      (chiffreAffaires > 0 ? 100 : 0);

    return {
      totalClients: clients.length,
      devisThisMonth: devisThisMonth.length,
      chiffreAffaires,
      tauxConversion,
      changeDevis,
      changeCA,
      devisParStatut: {
        brouillon: devis.filter(d => d.statut === 'BROUILLON').length,
        envoye: devis.filter(d => d.statut === 'ENVOYE').length,
        accepte: devis.filter(d => d.statut === 'ACCEPTE').length,
        refuse: devis.filter(d => d.statut === 'REFUSE').length,
        expire: devis.filter(d => d.statut === 'EXPIRE').length
      }
    };
  };

  // Données pour les graphiques basées sur les vraies données
  const getMonthlyData = () => {
    if (!devis) return [];

    const monthlyStats = {};
    const currentDate = new Date();
    
    // Initialiser les 6 derniers mois
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyStats[key] = {
        name: date.toLocaleDateString('fr-FR', { month: 'short' }),
        devis: 0,
        revenus: 0
      };
    }

    // Calculer les stats réelles
    devis.forEach(d => {
      const devisDate = new Date(d.dateDevis);
      const key = `${devisDate.getFullYear()}-${devisDate.getMonth()}`;
      
      if (monthlyStats[key]) {
        monthlyStats[key].devis += 1;
        if (d.statut === 'ACCEPTE') {
          monthlyStats[key].revenus += d.prixTTC || 0;
        }
      }
    });

    return Object.values(monthlyStats);
  };

  const getPieData = () => {
    const stats = calculateStats();
    if (!stats) return [];

    return [
      { name: 'Acceptés', value: stats.devisParStatut.accepte, color: '#28a745' },
      { name: 'En attente', value: stats.devisParStatut.envoye, color: '#17a2b8' },
      { name: 'Refusés', value: stats.devisParStatut.refuse, color: '#dc3545' },
      { name: 'Brouillons', value: stats.devisParStatut.brouillon, color: '#ffc107' },
      { name: 'Expirés', value: stats.devisParStatut.expire, color: '#6c757d' }
    ].filter(item => item.value > 0);
  };

  const getRecentDevis = () => {
    if (!devis) return [];
    
    return [...devis]
      .sort((a, b) => new Date(b.dateDevis) - new Date(a.dateDevis))
      .slice(0, 5);
  };

  const handleRefresh = () => {
    setRefreshTime(new Date());
    window.location.reload(); // Force refresh des données
  };

  const stats = calculateStats();
  const monthlyData = getMonthlyData();
  const pieData = getPieData();
  const recentDevis = getRecentDevis();

  if (devisLoading || clientsLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement du dashboard...</p>
        </div>
      </Container>
    );
  }

  if (!stats) {
    return (
      <Container className="mt-4">
        <div className="alert alert-warning">
          Aucune donnée disponible pour le dashboard.
        </div>
      </Container>
    );
  }

  const statsCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients.toString(),
      change: null,
      changeType: 'neutral',
      icon: FiUsers,
      color: 'primary',
      description: 'Clients enregistrés'
    },
    {
      title: 'Devis Ce Mois',
      value: stats.devisThisMonth.toString(),
      change: stats.changeDevis > 0 ? `+${stats.changeDevis}%` : stats.changeDevis < 0 ? `${stats.changeDevis}%` : '0%',
      changeType: stats.changeDevis > 0 ? 'positive' : stats.changeDevis < 0 ? 'negative' : 'neutral',
      icon: FiFileText,
      color: 'success',
      description: 'vs mois dernier'
    },
    {
      title: 'Chiffre d\'Affaires',
      value: new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR',
        maximumFractionDigits: 0
      }).format(stats.chiffreAffaires),
      change: stats.changeCA > 0 ? `+${stats.changeCA}%` : stats.changeCA < 0 ? `${stats.changeCA}%` : '0%',
      changeType: stats.changeCA > 0 ? 'positive' : stats.changeCA < 0 ? 'negative' : 'neutral',
      icon: FiDollarSign,
      color: 'warning',
      description: 'Devis acceptés'
    },
    {
      title: 'Taux de Conversion',
      value: `${stats.tauxConversion}%`,
      change: null,
      changeType: 'neutral',
      icon: FiTrendingUp,
      color: 'info',
      description: 'Devis acceptés/envoyés'
    }
  ];

  return (
    <Container fluid className="mt-4 px-3 px-lg-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted">Vue d'ensemble de votre activité</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <small className="text-muted">
            Dernière mise à jour : {refreshTime.toLocaleTimeString('fr-FR')}
          </small>
          <Button variant="outline-primary" size="sm" onClick={handleRefresh}>
            <FiRefreshCw className="me-1" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Col key={index} xs={12} sm={6} lg={3} className="mb-3">
              <Card className="h-100 shadow-sm border-0 hover-shadow">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <p className="text-muted mb-1 small">{stat.title}</p>
                      <h4 className="mb-1 fw-bold">{stat.value}</h4>
                      {stat.change && (
                        <small className={`text-${stat.changeType === 'positive' ? 'success' : stat.changeType === 'negative' ? 'danger' : 'muted'}`}>
                          {stat.change} {stat.description}
                        </small>
                      )}
                      {!stat.change && (
                        <small className="text-muted">{stat.description}</small>
                      )}
                    </div>
                    <div className={`bg-${stat.color} bg-opacity-10 rounded-circle p-3 flex-shrink-0`}>
                      <IconComponent className={`text-${stat.color}`} size={24} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Graphiques */}
      <Row className="mb-4">
        {/* Évolution mensuelle */}
        <Col lg={8} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-transparent border-0 pb-0">
              <h5 className="mb-0">Évolution Mensuelle</h5>
              <small className="text-muted">Devis et revenus des 6 derniers mois</small>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenus' ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value) : value,
                      name === 'devis' ? 'Nombre de devis' : 'Revenus'
                    ]}
                  />
                  <Bar yAxisId="left" dataKey="devis" fill="#198754" />
                  <Line yAxisId="right" type="monotone" dataKey="revenus" stroke="#fd7e14" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Répartition par statut */}
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-transparent border-0 pb-0">
              <h5 className="mb-0">Répartition des Devis</h5>
              <small className="text-muted">Par statut</small>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3">
                {pieData.map((item, index) => (
                  <div key={index} className="d-flex align-items-center justify-content-between mb-1">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle me-2" 
                        style={{ width: 12, height: 12, backgroundColor: item.color }}
                      />
                      <small>{item.name}</small>
                    </div>
                    <small className="fw-medium">{item.value}</small>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Devis récents */}
      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-transparent border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">Devis Récents</h5>
                  <small className="text-muted">5 derniers devis créés</small>
                </div>
                <Button variant="outline-primary" size="sm" href="/devis">
                  <FiEye className="me-1" />
                  Voir tout
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {recentDevis.length === 0 ? (
                <div className="text-center py-3 text-muted">
                  Aucun devis récent
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="mb-0" hover>
                    <thead className="table-light">
                      <tr>
                        <th>Client</th>
                        <th>Trajet</th>
                        <th>Prix</th>
                        <th>Statut</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDevis.map((devis) => (
                        <tr key={devis.id}>
                          <td>
                            <div className="fw-medium">{devis.clientNom}</div>
                            <small className="text-muted">{devis.clientEmail}</small>
                          </td>
                          <td>
                            <small>{devis.villeDepart} → {devis.villeArrivee}</small>
                          </td>
                          <td>
                            <span className="fw-medium text-success">
                              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(devis.prixTTC)}
                            </span>
                          </td>
                          <td>
                            <Badge bg={
                              devis.statut === 'ACCEPTE' ? 'success' :
                              devis.statut === 'REFUSE' ? 'danger' :
                              devis.statut === 'ENVOYE' ? 'info' :
                              devis.statut === 'EXPIRE' ? 'secondary' : 'warning'
                            }>
                              {devis.statut === 'BROUILLON' ? 'Brouillon' :
                               devis.statut === 'ENVOYE' ? 'Envoyé' :
                               devis.statut === 'ACCEPTE' ? 'Accepté' :
                               devis.statut === 'REFUSE' ? 'Refusé' : 'Expiré'}
                            </Badge>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(devis.dateDevis).toLocaleDateString('fr-FR')}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;