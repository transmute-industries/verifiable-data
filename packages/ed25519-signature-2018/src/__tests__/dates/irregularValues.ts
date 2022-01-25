/**
 * In this test we want to confirm how issuanceDate values are
 * handled when irregular or incrrect values are provided to the
 * suite when signed.
 * In this test we will confirm the operation of Transmute's
 * libraries using fixtures generated from Digital Bazaar's library 
 **/

import { issuedOn, createdOn, exampleCredential } from './date-utils'

const irregularDates:Array<undefined|null|string|number> = [
    undefined,
    null,
    0,
    "",
    "foobar",
]

describe('Handling issuanceDate error handling with irregular values', () => {

    it(`should handle undefined issuanceDate correctly when attempted to sign`, async() => {

    })

    it(`should handle null issuanceDate correctly when attempted to sign`, async() => {

    })

    it(`should handle zero issuanceDate correctly when attempted to sign`, async() => {

    })

    it(`should handle empty string issuanceDate correctly when attempted to sign`, async() => {

    })

    it(`should handle string issuanceDate correctly when attempted to sign`, async() => {

    })

});