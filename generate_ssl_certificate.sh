openssl req -new -sha256 -newkey rsa:2048 -nodes \
-subj "/C=NA/ST=NA/L=NA/O=NA" \
-keyout server.key -x509 -days 7 \
-out server.crt
