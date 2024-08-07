FROM node:18-alpine AS builder
ENV NEXT_SHARP_PATH=/node_modules/sharp
WORKDIR /my-space

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ENV SECRET_LOGIN_KEY=$SECRET_LOGIN_KEY

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