FROM node:18-alpine AS builder
ENV NEXT_SHARP_PATH=/node_modules/sharp
WORKDIR /my-space

ENV API_URL=$API_URL
ENV URL=$URL

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build:next

FROM node:18-alpine AS runner
WORKDIR /my-space
COPY --from=builder /my-space/package.json .
COPY --from=builder /my-space/package-lock.json .
COPY --from=builder /my-space/next.config.js ./
COPY --from=builder /my-space/public ./public
COPY --from=builder /my-space/.next/standalone ./
COPY --from=builder /my-space/.next/static ./.next/static
EXPOSE 3000
ENTRYPOINT ["npm", "start"]