export const FORMULES = [
  { value: 'ECONOMIC', label: 'Économique', color: 'success' },
  { value: 'ECONOMIC_PLUS', label: 'Économique Plus', color: 'info' },
  { value: 'SOLO', label: 'Solo', color: 'warning' },
  { value: 'CONFORT', label: 'Confort', color: 'primary' },
  { value: 'LUXE', label: 'Clé en main', color: 'danger' }
];

export const getFormuleLabel = (value) => {
  return FORMULES.find(f => f.value === value)?.label || value;
};

export const getFormuleColor = (value) => {
  return FORMULES.find(f => f.value === value)?.color || 'secondary';
};