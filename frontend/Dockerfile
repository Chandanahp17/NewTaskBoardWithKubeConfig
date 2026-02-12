FROM nginx:alpine

# Install envsubst
RUN apk add --no-cache gettext

# Copy static files
COPY . /usr/share/nginx/html

EXPOSE 80

# Replace environment variable at container startup
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/script.js > /usr/share/nginx/html/script.tmp.js && mv /usr/share/nginx/html/script.tmp.js /usr/share/nginx/html/script.js && nginx -g 'daemon off;'"]
