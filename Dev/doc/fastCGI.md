# FastCGI
## Caddy config
### Template
    fastcgi path endpoint [preset] {
        ext    extension
        split  splitval
        index  indexfile
        env    key value
        except ignored_paths...
        pool   pool_size
    }

* **path** is the base path to match before the request will be forwarded
* **endpoint** is the address or Unix socket of the FastCGI server
* **preset** is an optional preset name (see below)
* **extension** specifies the extension which, if the request URL has it, would proxy the request to FastCGI
* **splitval** specifies how to split the URL; the split value becomes the end of the first part and anything in the URL after it becomes part of the PATH_INFO CGI variable
* **indexfile** specifies the default file to try if a file is not specified by the URL
* **key value** sets an environment variable named key with the given value; the env property can be used multiple times and values may use request placeholders
* **ignored_paths...** is a list of space-separated request paths to be excepted from fastcgi processing, even if it matches the base path
* **pool_size** is the number of persistent connections to reuse (can be good for performance on Windows); default is 0

