# Build stage
FROM node:20 AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies using clean install
RUN npm ci

# Copy all files
COPY . .

# Build the project
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
