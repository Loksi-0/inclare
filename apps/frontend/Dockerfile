FROM node:20-alpine AS base




FROM base AS builder
WORKDIR /inclare

RUN corepack enable
COPY . .

RUN pnpm dlx turbo prune --scope=@inclare/frontend --docker




FROM base AS installer
WORKDIR /inclare

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /inclare/out/json/ .
COPY --from=builder /inclare/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=builder /inclare/out/full/ .

RUN pnpm --filter=@repo/db exec prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ARG API_URL
ARG NEXT_PUBLIC_API_URL
ARG IGNORE_BUILD_TYPE_ERRORS
ARG IMAGE_COMPRESSION
ARG UNOPTIMIZE_IMAGES

ENV API_URL=${API_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV IGNORE_BUILD_TYPE_ERRORS=${IGNORE_BUILD_TYPE_ERRORS}
ENV IMAGE_COMPRESSION=${IMAGE_COMPRESSION}
ENV UNOPTIMIZE_IMAGES=${UNOPTIMIZE_IMAGES}

RUN pnpm turbo run build --filter=@inclare/frontend...




FROM base AS runner
WORKDIR /inclare

ENV PORT=80

COPY --from=installer /inclare/apps/frontend/public ./apps/frontend/public
COPY --from=installer /inclare/apps/frontend/.next/standalone ./
COPY --from=installer /inclare/apps/frontend/.next/static ./apps/frontend/.next/static

EXPOSE 80

WORKDIR /inclare/apps/frontend

CMD ["node", "server.js"]