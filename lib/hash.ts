// SHA-256 hash with project salt. Used for any future analytics that
// need a stable per-email identifier without storing the email itself.
// The library table itself already excludes email via the public_library view.

import { createHash } from 'crypto';

const DEFAULT_SALT = 'hiring-diagnostic-default-salt-v1';

export function hashEmail(email: string): string {
  const salt = process.env.LIBRARY_HASH_SALT || DEFAULT_SALT;
  const normalised = email.trim().toLowerCase();
  return createHash('sha256').update(`${salt}:${normalised}`).digest('hex');
}
