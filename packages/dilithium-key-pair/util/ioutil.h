#ifndef __IOUTIL_H__
#define __IOUTIL_H__

int getFile(char **buffer, FILE *f, bool close);
int trimmable(char c);
int get_first_position(char const *str);
int get_str_len(char const *str);
int get_last_position(char const *str);
int get_trim_len(char const *str);
char *strtrim(char const *str);
#endif