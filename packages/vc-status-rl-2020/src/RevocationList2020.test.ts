/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import { RevocationList2020 } from './RevocationList2020';

const encodedList100k =
  'H4sIAAAAAAAAA-3BMQEAAADCoPVPbQsvoAAAAAAAAAAAAAAAAP4GcwM92tQwAAA';
const encodedList100KWith50KthRevoked =
  'H4sIAAAAAAAAA-3OMQ0AAAgDsOHfNB72EJJWQRMAAAAAAIDWXAcAAAAAAIDHFrc4zDz' +
  'UMAAA';

describe('RevocationList2020', () => {
  it('should create an instance', async () => {
    const list = new RevocationList2020({ length: 8 });
    expect(list.length).toBe(8);
  });

  it('should fail to create an instance if no length', async () => {
    try {
      new RevocationList2020();
    } catch (e) {
      expect(e.name).toBe('TypeError');
    }
  });

  it('should encode', async () => {
    const list = new RevocationList2020({ length: 100000 });
    const encodedList = await list.encode();
    expect(encodedList).toBe(encodedList100k);
  });

  it('should decode', async () => {
    const list = await RevocationList2020.decode({
      encodedList: encodedList100k,
    });
    expect(list.length).toBe(100000);
  });

  it('should mark a credential revoked', async () => {
    const list = new RevocationList2020({ length: 8 });
    for (let i = 0; i < list.length; i++) {
      expect(list.isRevoked(i)).toBe(false);
    }
    list.setRevoked(4, true);
    for (let i = 0; i < list.length; i++) {
      if (i === 4) {
        expect(list.isRevoked(i)).toBe(true);
      } else {
        expect(list.isRevoked(i)).toBe(false);
      }
    }
  });

  it('should fail to mark a credential revoked', async () => {
    const list: any = new RevocationList2020({ length: 8 });
    try {
      list.setRevoked(0);
    } catch (e) {
      expect(e.name).toBe('TypeError');
    }
  });

  it('should fail to get a credential status out of range', async () => {
    const list: any = new RevocationList2020({ length: 8 });
    try {
      list.isRevoked(8);
    } catch (e) {
      expect(e.name).toBe('Error');
    }
  });

  it('should mark a credential revoked, encode and decode', async () => {
    const list = new RevocationList2020({ length: 100000 });
    expect(list.isRevoked(50000)).toBe(false);

    list.setRevoked(50000, true);
    expect(list.isRevoked(50000)).toBe(true);

    const encodedList = await list.encode();
    expect(encodedList).toBe(encodedList100KWith50KthRevoked);
    const decodedList = await RevocationList2020.decode({ encodedList });
    expect(decodedList.isRevoked(50000)).toBe(true);
  });
});
