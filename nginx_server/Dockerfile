# Use the official NGINX image
FROM nginx:alpine

# # Remove default NGINX configuration
# RUN rm /etc/nginx/conf.d/default.conf

# # Copy custom NGINX config (assuming nginx.conf is in nginx_server directory)
# COPY ./nginx_server/nginx.conf /etc/nginx/nginx.conf

# Copy built frontend static files (from dist directory in the root directory)
COPY ./client_side/dist/index.html /usr/share/nginx/html

# Expose port 80 (default HTTP port)
EXPOSE 80
