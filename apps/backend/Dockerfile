FROM node:20-alpine AS base



FROM base AS builder
WORKDIR /inclare

RUN corepack enable
COPY . .

RUN pnpm dlx turbo prune --scope=@inclare/backend --docker




FROM base AS installer
WORKDIR /inclare

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /inclare/out/json/ .
COPY --from=builder /inclare/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=builder /inclare/out/full/ .

RUN pnpm --filter=@repo/db exec prisma generate




FROM base AS runner
WORKDIR /inclare

RUN apk add --no-cache tini exiftool perl
RUN corepack enable && corepack prepare pnpm@latest --activate

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

COPY --from=builder /inclare/out/full/ .
COPY --from=installer /inclare .

WORKDIR /inclare/apps/backend

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["pnpm", "tsx", "src/index.ts"]
