FROM node:18-alpine as build

WORKDIR /wisiex_test

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

# Fix the path to match your build output directory
# This should match wherever your build system outputs files
COPY --from=build /wisiex_test/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 1234

CMD ["nginx", "-g", "daemon off;"]