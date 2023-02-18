import { createHash, randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates the raw secret key.
 *
 * @return
 **/
export default function () {
  return createHash('sha256')
    .update(uuidv4())
    .update(randomBytes(256))
    .digest('hex');
}
