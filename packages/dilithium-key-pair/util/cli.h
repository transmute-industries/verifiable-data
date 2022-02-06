#ifndef CLI_H
#define CLI_H

#define DEFAULT_PROGNAME "dilithium"
#define OPTSTR ":Vdehg"
#define USAGE_FMT  "Usage: %s\nGenerates a dilithium keypair\n\nOptions: [-V verbose] [-d debug] [-e example] [-g generate] [-h]"
#define ERR_FOPEN_INPUT  "Could not open specified input"

int generateKeys(void);
int demo(void);
int usage(void);

#endif
