#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include "ioutil.h"

int getFile(char **buffer, FILE *f, bool close)
{
    long length = 0; // this really doesn't need to be too big for our ref purposes here, likely could get by with an int

    if (f)
    {
        fseek(f, 0, SEEK_END);
        length = ftell(f);
        fseek(f, 0, SEEK_SET);
        *buffer = malloc(length + 1);
        if (*buffer)
        {
            fread(*buffer, 1, length, f);
        }
        if (close)
        {
            fclose(f);
        }
    } else {
        return -1;
    }
    if (*buffer)
    {
        buffer[length] = '\0';
        return length+1;
    } else {
        return -2;
    }
}

int trimmable(char c) {
    return (c == ' ' || c == '\t' || c == '\n');
}
int get_first_position(char const *str) {
    int i = 0;
    while (trimmable(str[i])) {
        i += 1;
    }
    return (i);
}
int get_str_len(char const *str) {
    int len = 0;
    while (str[len] != '\0') {
        len += 1;
    }
    return (len);
}
int get_last_position(char const *str) {
    int i = get_str_len(str) - 1;
    while (trimmable(str[i])) {
        i -= 1;
    }
    return (i);
}
int get_trim_len(char const *str) {
    return (get_last_position(str) - get_first_position(str));
}
char *strtrim(char const *str) {
    char *trim = NULL;
    int i, len, start;
    if (str != NULL) {
        i = 0;
        len = get_trim_len(str) + 1;
        trim = (char *)malloc(len);
        start = get_first_position(str);
        while (i < len) {
            trim[i] = str[start];
            i += 1;
            start += 1;
        }
        trim[i] = '\0';
    }
    return (trim);
}
