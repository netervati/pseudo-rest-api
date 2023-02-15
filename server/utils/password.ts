import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

/**
 * Hashes a password.
 *
 * @param password
 * @return
 **/
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

  return `${buffer.toString('hex')}.${salt}`;
}

/**
 * Verifies if the passed password matches the hashed password.
 *
 * @param storedPassword
 * @param suppliedPassword
 * @return
 **/
export async function verifyPassword(
  storedPassword: string,
  suppliedPassword: string
): Promise<boolean> {
  const [hashedPassword, salt] = storedPassword.split('.');
  const hashedPasswordBuffer = Buffer.from(hashedPassword, 'hex');
  const suppliedPasswordBuffer = (await scryptAsync(
    suppliedPassword,
    salt,
    64
  )) as Buffer;

  return timingSafeEqual(hashedPasswordBuffer, suppliedPasswordBuffer);
}
