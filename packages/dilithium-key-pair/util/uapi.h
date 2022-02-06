#ifndef _UAPI_H
#define _UAPI_H

#define API_VERSION 1

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wunused-variable"
static bool DEBUG;
static bool VERBOSE;
static bool VDEBUG;
#pragma GCC diagnostic pop

int version(void);
int generate(struct Keypair *keypair);
int sign(char *sm, const char *m, const char *sk);
int verify(const char *sig, const char *m, const char *pk);
int shake256Bytes(char *shaken, const char *bytes);
int shake256B64Bytes(char *shaken, const char *b64);

#endif
