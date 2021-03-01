import { RevocationList2020 } from '../RevocationList2020';

export async function decodeList({ encodedList }: { encodedList: string }) {
  return RevocationList2020.decode({ encodedList });
}
