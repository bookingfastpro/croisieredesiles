import { Circuit } from '../types';

/** Price label shown on cards/details, based on the circuit's own data. */
export function formatPrice(circuit: Circuit): string {
  if (circuit.priceOnRequest || !circuit.price) return 'Sur devis';
  return `À partir de ${circuit.price.toLocaleString('fr-FR')} €`;
}
