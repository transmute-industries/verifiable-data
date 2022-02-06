#include "keypair.h"
#include <stdio.h>

int keypairToString(char *keypairString, struct Keypair keypair)
{
    sprintf(keypairString,
            "{\n"
                "\t\"kty\": \"%s\",\n"
                "\t\"alg\": \"%s\",\n"
                "\t\"pset\": \"%s\",\n"
                "\t\"xs\":\"%s\",\n"
                "\t\"ds\":\"%s\",\n"
                "\t\"x\":\"%s\",\n"
                "\t\"d\":\"%s\"\n}"
            "\n",
            keypair.kty, keypair.alg, keypair.pset,
            keypair.xs, keypair.ds,
            keypair.x, keypair.d);
    return 0;
}
