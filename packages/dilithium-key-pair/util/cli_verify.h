#ifndef __CLI_VERIFY_H__
#define __CLI_VERIFY_H__

#define DEFAULT_PROGNAME "dverify"
#define OPTSTR ":hk:m:s:"
#define USAGE_FMT  "Usage: %s\nSigns a message using crystals dilithium\n\nOptions: [-k public_key] [-m message] [-s signature] [-h]"
#define ERR_FOPEN_INPUT  "Could not open specified input"
#define MAX_ARG_SIZE 16384

int verfiyMessage(char* sm, const char* m, const char* pk);
int usage(void);

#endif
