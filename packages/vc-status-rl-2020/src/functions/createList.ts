import { RevocationList2020 } from '../RevocationList2020';

export async function createList({ length }: { length: number }) {
  return new RevocationList2020({ length });
}
