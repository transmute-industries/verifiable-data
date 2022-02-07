// cli wrapper for the api
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>
#include <libgen.h>
#include <getopt.h>
#include <getopt.h>
#include <errno.h>

#include "keypair.h"
#include "cli.h"
#include "uapi.h"

static const char *TEST_MESSAGE = "TESTING SIGNATURES";

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wredundant-decls"
extern int errno;
static bool DEBUG;
static bool VERBOSE;
static bool VDEBUG;
#pragma GCC diagnostic pop

//  OPTSTR "Vdehgk:s:v:"
//  USAGE_FMT  "%s [-V verbose] [-d debug] [-e example] [-k keyfile] [-g generate] [-s sign] [-v verify] [-h]"

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wunused-parameter"
int main(int argc, char *argv[])
{
    int opt;

    VERBOSE = false;
    DEBUG = false;

    if (argc == 1)
    {
        return generateKeys();
    }

    while ((opt = getopt(argc, argv, OPTSTR)) != EOF)
        switch (opt)
        {
        case 'h':
            usage();
            exit(EXIT_FAILURE);
        case 'V':
            VERBOSE = true;
            VDEBUG = DEBUG && VERBOSE;
            break;
        case 'd':
            DEBUG = true;
            VDEBUG = DEBUG && VERBOSE;
            break;
        case 'e':
            return demo();
        case '?':
            fprintf(stderr, "invalid option: -%c\n", optopt);
            exit(EXIT_FAILURE);
        case 'g':
        default:
            return generateKeys();
            break;
        }
    return EXIT_SUCCESS;
}
#pragma GCC diagnostic pop

int generateKeys(void)
{
    struct Keypair keys;
    char keysString[CRYPTO_SECRETKEYBYTES_B64 + CRYPTO_PUBLICKEYBYTES_B64 + (CRYPTO_BYTES_B64 * 2) + 64];
    int generate_return = 0;

    generate_return = generate(&keys);
    keypairToString(keysString, keys);
    printf("%s", keysString);
    return generate_return;
}
int demo(void)
{
    printf("Running quick key generation and signing demo...\n");
    if (DEBUG)
        printf("Entering cli:main\n");
    printf("CRYPTO_BYTES: %d\n", CRYPTO_BYTES);
    printf("CRYPTO_BYTES_B64: %d\n", CRYPTO_BYTES_B64);
    printf("CRYPTO_PUBLICKEYBYTES: %d\n", CRYPTO_PUBLICKEYBYTES);
    printf("CRYPTO_PUBLICKEYBYTES_B64: %d\n", CRYPTO_PUBLICKEYBYTES_B64);
    printf("CRYPTO_SECRETKEYBYTES: %d\n", CRYPTO_SECRETKEYBYTES);
    printf("CRYPTO_SECRETKEYBYTES_B64: %d\n\n", CRYPTO_SECRETKEYBYTES_B64);

    struct Keypair keys;
    char keysString[CRYPTO_SECRETKEYBYTES_B64 + CRYPTO_PUBLICKEYBYTES_B64 + (CRYPTO_BYTES_B64 * 2) + 64];
    char signed_message[CRYPTO_BYTES_B64];
    int signed_return = 0;
    int verify_return = 0;

    if (VDEBUG)
        printf("\tcli:main::initialized\n");

    if (VDEBUG)
        printf("\tcli:main::generating\n");
    generate(&keys);
    if (VDEBUG)
    {
        printf("\tcli:main::keys\n");
        printf("%s\n\n", keys.xs);
        printf("%s\n\n", keys.ds);
        printf("%s\n\n", keys.x);
        printf("%s\n\n", keys.d);
    }
    if (VDEBUG)
        printf("\tcli:main::keystostring\n");
    keypairToString(keysString, keys);
    printf("Generated Keypair: %s\n", keysString);

    printf("\nSigning: 'TESTING SIGNATURES'\n");
    signed_return = sign(signed_message, TEST_MESSAGE, (const char *)keys.d);
    printf("\nSigned: 'TESTING SIGNATURES'\n");
    printf("Result: %d\n%s\n", signed_return, signed_message);

    verify_return = verify((const char *)signed_message, (const char *)TEST_MESSAGE, (const char *)keys.x);
    printf("\nVerification Result: %d\n", verify_return);

    return verify_return;
}

int usage(void)
{
    fprintf(stderr, USAGE_FMT, DEFAULT_PROGNAME);
    printf("\n");
    return EXIT_FAILURE;
}
