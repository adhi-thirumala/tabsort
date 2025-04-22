FROM --platform=linux/arm64 node:23.9-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY src/package.json src/package-lock.json* ./


RUN rm -rf node_modules
# before your main `npm install`
RUN npm install --save-optional \
    lightningcss-linux-arm64-musl \
    @tailwindcss/oxide-linux-arm64-musl

# then install everything (including optional deps)

RUN npm ci --platform=linux/arch64 --arch=arm64 --include=optional

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Copy src directory and ensure public directory is properly copied
COPY src .
COPY src/public ./public

# Next.js collects anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm i lightningcss-linux-arm64-gnu --legacy-peer-deps --omit=dev
RUN npm install --platform=linux --arch=arm64 @tailwindcss/postcss

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public directory from src
COPY --from=builder /app/public ./public
RUN chown nextjs:nodejs ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
