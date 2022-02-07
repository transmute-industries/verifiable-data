#ifndef _CLI_SIGN_H_
#define _CLI_SIGN_H_

#define DEFAULT_PROGNAME "dsign"
#define OPTSTR ":hk:m:"
#define USAGE_FMT  "Usage: %s\nSigns a message using crystals dilithium\n\nOptions: [-k private_key] [-m data_to_sign] [-h]"
#define ERR_FOPEN_INPUT  "Could not open specified input"
#define MAX_ARG_SIZE 16384

int signMessage(char* sm, const char* m, const char* sk);
int usage(void);

#endif
