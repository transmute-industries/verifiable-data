#include <stdlib.h>
#include <stddef.h>
#include <stdint.h>
#include <string.h>
#include <stdio.h>
#include <stdbool.h>

#include "../ref/params.h"
#include "../ref/sign.h"
#include "../ref/fips202.h"
#include "common.h"
#include "base64.h"
#include "keypair.h"
#include "uapi.h"
#include "cli.h"

/*************************************************
* Name:         version
*
* Description:  Returns the API Version.
*
* Returns       Integer version number
**************************************************/
int version(void)
{
    return API_VERSION;
}

/*************************************************
* Name:         generate
*
* Description:  Generates a public and private keypair along with SHAKE256 hashes of each.
*
* Arguments:    - struct Keypair keypair: the Keypair struct in which to return the keys
*
* Returns        0  (success)
*               -1  (failure)
**************************************************/
int generate(struct Keypair *keypair)
{
    if (VDEBUG)
        printf("Entering api:generate\n");
    uint8_t pk[CRYPTO_PUBLICKEYBYTES];
    uint8_t sk[CRYPTO_SECRETKEYBYTES];
    uint8_t pk_shake[CRYPTO_SHAKEBYTES];
    uint8_t sk_shake[CRYPTO_SHAKEBYTES];

    int ret = 0;
    if (VDEBUG)
        printf("\tapi:generate::variables_initialized\n");

    ret = crypto_sign_keypair(pk, sk);

    if (VDEBUG)
        printf("\tapi:generate::keys_generated\n");
    if (ret != 0)
    {
        return -1;
    }
    if (VDEBUG)
        printf("\tapi:generate::shaking\n");
    shake256(pk_shake, 32, pk, CRYPTO_PUBLICKEYBYTES);
    shake256(sk_shake, 32, sk, CRYPTO_SECRETKEYBYTES);

    if (VDEBUG)
        printf("\tapi:generate::encoding\n");
    Base64encode(keypair->xs, (const char *)pk_shake, CRYPTO_SHAKEBYTES);
    Base64encode(keypair->ds, (const char *)sk_shake, CRYPTO_SHAKEBYTES);
    Base64encode(keypair->x, (const char *)pk, CRYPTO_PUBLICKEYBYTES);
    Base64encode(keypair->d, (const char *)sk, CRYPTO_SECRETKEYBYTES);

    strcpy(keypair->kty, "PQK");
    strcpy(keypair->alg, "CRYDI");
    strcpy(keypair->pset, "3");

    if (VDEBUG)
        printf("\tapi:generate::encoded\n");
    if (VDEBUG)
    {
        int j = 0;
        printf("\npk_s = \"");
        for (j = 0; j < CRYPTO_SHAKEBYTES; ++j)
            printf("%02x", pk_shake[j]);
        printf("\"\n");

        printf("\nsk_s = \"");
        for (j = 0; j < CRYPTO_SHAKEBYTES; ++j)
            printf("%02x", sk_shake[j]);
        printf("\"\n");

        printf("\npk = \"");
        for (j = 0; j < CRYPTO_PUBLICKEYBYTES; ++j)
            printf("%02x", pk[j]);
        printf("\"\n");
        printf("\nsk = \"");
        for (j = 0; j < CRYPTO_SECRETKEYBYTES; ++j)
            printf("%02x", sk[j]);
        printf("\"\n");
    }
    return 0;
}

/*************************************************
* Name:        sign
*
* Description: Generates a signature of a message using a private key.
*
* Arguments:   - char *sm: pointer to ouput for the signature in base64 encoding
*              - const char *m: pointer to the message itself that was signed
*              - const char *sk: pointer to the secret key in base64 encoding
*
* Returns    0  (success)
*           -1  (failure)
*           -2  (failure, err encoding signature)
*           -3  (failure, err decoding secret key)
**************************************************/
int sign(char *sm, const char *m, const char *sk)
{
    if (VDEBUG)
        printf("Entering api:sign\n");
    size_t siglen;
    size_t mlen = strlen(m);
    uint8_t sig[CRYPTO_BYTES];
    uint8_t sk_d[CRYPTO_PUBLICKEYBYTES];
    char sig_e[CRYPTO_BYTES_B64];
    int ret = 0;

    if (VDEBUG)
        printf("\tapi:sign::variables_initialized\n");

    if (Base64decode((char *)sk_d, (const char *)sk) != CRYPTO_SECRETKEYBYTES)
    {
        return -3;
    }

    if (VDEBUG)
        printf("\tapi:sign::decoded_sk::%s\n", sk);

    if (crypto_sign_signature(sig, &siglen, (unsigned char *)m, mlen, sk_d) != 0)
    {
        return -1;
    }

    if (VDEBUG)
        printf("\tapi:sign::signed\n");

    if (Base64encode(sig_e, (const char *)sig, CRYPTO_BYTES) != CRYPTO_BYTES_B64)
    {
        return -2;
    }

    if (VDEBUG)
        printf("\tapi:sign::encoded_sig::%s\n", sig_e);

    memcpy(sm, sig_e, CRYPTO_BYTES_B64);

    if (VDEBUG)
        printf("\tapi:sign::copied_sig\n");
    if (VDEBUG)
        printf("\tapi:sign::return:%d\n", ret);

    return ret;
}

/*************************************************
* Name:        verify
*
* Description: Verifies the signature of a message using a public key.
*
* Arguments:   - const char *sig: pointer to the signature of the message in base64 encoding
*              - const char *m: pointer to the message itself that was signed
*              - const char *pk: pointer to the public key in base64 encoding
*
* Returns    0  (success)
*           -1  (failure)
*           -2  (failure, err decoding signature)
*           -3  (failure, err decoding public key)
**************************************************/
int verify(const char *sig, const char *m, const char *pk)
{
    size_t mlen = strlen(m);

    uint8_t sig_d[CRYPTO_BYTES_B64];
    uint8_t pk_d[CRYPTO_PUBLICKEYBYTES_B64];

    int ret, sig_err, pk_err = 0;

    sig_err = Base64decode((char *)sig_d, (char *)sig);
    pk_err = Base64decode((char *)pk_d, (char *)pk);

    if (sig_err != CRYPTO_BYTES)
    {
        if (DEBUG)
            printf("Error with sig, got %d bytes, expected %d", sig_err, CRYPTO_BYTES);
        return -2;
    }
    if (pk_err != CRYPTO_PUBLICKEYBYTES)
    {
        if (DEBUG)
            printf("Error with sig, got %d bytes, expected %d", pk_err, CRYPTO_PUBLICKEYBYTES);
        return -3;
    }

    ret = crypto_sign_verify(sig_d, CRYPTO_BYTES, (uint8_t *)m, mlen, pk_d);
    return ret;
}

/*************************************************
* Name:        shake256Bytes
*
* Description: Gets the shake256() of a set of bytes.
*
* Arguments:   - const char *shaken: pointer to the output of shake256()
*              - const char *byte: pointer to the bytes that should be shaken
*
* Returns    0  (success)
**************************************************/
int shake256Bytes(char *shaken, const char *bytes)
{
    shake256((uint8_t *)shaken, CRYPTO_SHAKEBYTES, (const uint8_t *)bytes, strlen(bytes));
    return 0;
}

/*************************************************
* Name:        shake256B64Bytes
*
* Description: Gets the shake256() of a set of base64 encoded bytes, then returns the
               Base64 encoded shake output.
*
* Arguments:   - const char *shaken: pointer to the output of shake256()
*              - const char *byte: pointer to the bytes that should be shaken
*
* Returns    0  (success)
**************************************************/
int shake256B64Bytes(char *shaken, const char *b64)
{
    char bytes[CRYPTO_SHAKEBYTES];
    char to_encode[CRYPTO_SHAKEBYTES];

    Base64decode(bytes, b64);
    shake256Bytes(to_encode, bytes);
    Base64encode(shaken, (const char *)to_encode, CRYPTO_SHAKEBYTES);

    return 0;
}
