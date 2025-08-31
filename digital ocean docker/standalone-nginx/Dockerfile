# Use the official nginx image
FROM nginx:alpine

# Copy our custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for SSL certificates
RUN mkdir -p /etc/letsencrypt/live

# Expose ports 80 and 443
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
