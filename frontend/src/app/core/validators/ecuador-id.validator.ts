import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador profesional para la cédula ecuatoriana.
 * Implementa el algoritmo de validación de módulo 10 (Algoritmo de Verificación de Cédula de Identidad).
 *
 * El algoritmo consta de:
 * 1. Verificación de longitud (10 dígitos).
 * 2. Verificación de región (dos primeros dígitos entre 01 y 24, o 30).
 * 3. Verificación de tercer dígito (debe ser menor a 6 para personas naturales).
 * 4. Algoritmo de Luhn/Módulo 10 para el dígito verificador.
 */
export function ecuadorIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cedula = control.value;

    if (!cedula) return null;

    // Verificar que sean 10 dígitos numéricos
    if (!/^\d{10}$/.test(cedula)) {
      return { invalidEcuadorId: 'La cédula debe tener exactamente 10 dígitos numéricos.' };
    }

    // El tercer dígito debe ser menor a 6 para personas naturales
    const tercerDigito = Number.parseInt(cedula.substring(2, 3), 10);
    if (tercerDigito >= 6) {
      return { invalidEcuadorId: 'Tercer dígito inválido.' };
    }

    // Verificar código de provincia (01 a 24) o 30
    const provincia = Number.parseInt(cedula.substring(0, 2), 10);
    if (!((provincia >= 1 && provincia <= 24) || provincia === 30)) {
      return { invalidEcuadorId: 'Código de provincia inválido.' };
    }

    // Algoritmo de Módulo 10
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    const verificador = Number.parseInt(cedula.substring(9, 10), 10);
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      let valor = Number.parseInt(cedula.substring(i, i + 1), 10) * coeficientes[i];
      if (valor >= 10) valor -= 9;
      suma += valor;
    }

    const total = suma % 10;
    const resultado = total === 0 ? 0 : 10 - total;

    if (resultado !== verificador) {
      return { invalidEcuadorId: 'Dígito verificador incorrecto.' };
    }

    return null;
  };
}
