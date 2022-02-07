#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>
#include <libgen.h>
#include <getopt.h>
#include <errno.h>

#include "common.h"
#include "ioutil.h"
#include "keypair.h"
#include "uapi.h"
#include "cli_sign.h"

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wunused-parameter"
int main(int argc, char *argv[])
{
    int opt;
    int signRet = 0;
    char signature[CRYPTO_BYTES_B64];
    char keyPath[MAX_ARG_SIZE];
    char messagePath[MAX_ARG_SIZE];
    char key[CRYPTO_SECRETKEYBYTES_B64];
    char *message;
    FILE *keyStream;
    FILE *messageStream;
    
    while ((opt = getopt(argc, argv, OPTSTR)) != -1)
    {
        switch (opt)
        {
        case 'h':
            return usage();
        case 'k':
            strncpy (keyPath, optarg, sizeof (keyPath));
            keyPath[sizeof (keyPath) - 1] = '\0';
            break;
        case 'm':
            strncpy (messagePath, optarg, sizeof (messagePath));
            messagePath[sizeof (messagePath) - 1] = '\0';
            break;
        case '?':
            printf("Unknown option: %c\n", optopt);
            return usage();
        default:
            return usage();
        }
    }

    //if file at Keypath is CRYPTO_SECRETKEYBYTES_B64 use as is, otherwise check for json (later)
    keyStream = fopen(keyPath, "rb");
    if (keyStream == NULL)
    {
        //try arg as a key itself
        memcpy(key, keyPath, CRYPTO_SECRETKEYBYTES_B64);
    }
    else
    {
        char *keyBuffer;

        int fileRet = getFile(&keyBuffer, keyStream, true);
        if (fileRet < 0) {
            return fileRet;
        } 
        //locking this as a key for now
        memcpy(key, keyBuffer, CRYPTO_SECRETKEYBYTES_B64);
    }

    //if message is a file path, load and sign file, otherwise sign string
    messageStream = fopen(messagePath, "rb");
    if (messageStream == NULL)
    {
        //try arg as a key itself
        message = malloc(sizeof(messagePath));
        strcpy(message, messagePath);
    }
    else
    {
        char *messageBuffer;
        long length = 0;

        length = getFile(&messageBuffer, messageStream, true);
        if (length < 0) {
            return length;
        } 
        message = malloc(length);
        memcpy(message, messageBuffer, length);
    }

    signRet = signMessage(signature, message, key);
    if (signRet < 0) {
        return signRet;
    }
    printf("%s\n", signature);
    return EXIT_SUCCESS;
}
#pragma GCC diagnostic pop

int signMessage(char *sm, const char *m, const char *sk)
{
    return sign(sm, m, sk);
}

int usage(void)
{
    fprintf(stderr, USAGE_FMT, DEFAULT_PROGNAME);
    printf("\n");
    return EXIT_FAILURE;
}
