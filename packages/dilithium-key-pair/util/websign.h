#ifndef WEBSIGN_H
#define WEBSIGN_H

int dilithiumVersion(void);
char* dilithiumGenerate(void);
char* dilithiumSign(const char *m, const char *sk);
int dilithiumVerify(const char *sig, const char *m, const char *pk);

#endif
