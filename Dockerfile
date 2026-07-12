# syntax=docker/dockerfile:1

# Base image pinned to the EXACT Playwright version in package-lock.json
# (@playwright/test ^1.61.1). This image bundles Chromium, Firefox and WebKit at the
# matching revision, Node 24 (matching .nvmrc), and every OS dependency — so
# `npx playwright install` is unnecessary and is deliberately omitted (re-running it
# would redownload identical binaries and can mask a version mismatch). Distro `-noble`
# (Ubuntu 24.04) matches the ubuntu-latest CI runners. Keep this tag in lockstep with
# @playwright/test — Dependabot's docker ecosystem (.github/dependabot.yml) bumps it.
FROM mcr.microsoft.com/playwright:v1.61.1-noble

# CI=true  -> mirrors the process.env.CI branches in playwright.config.ts (2 retries,
#             github+html reporters, forbidOnly, and html reporter open:never so a
#             --rm container never hangs trying to launch a browser). Override: `-e CI=`.
# HUSKY=0  -> skips husky's `prepare` git-hook install during `npm ci`; the hooks are
#             meaningless in the image (.git is excluded via .dockerignore).
# NODE_ENV is intentionally left UNSET: every dependency here is a devDependency
# (including @playwright/test), so NODE_ENV=production would make `npm ci` install nothing.
ENV CI=true \
    HUSKY=0

WORKDIR /app

# Copy the manifest + lockfile first so the slow `npm ci` layer is cached until
# dependencies change, not on every source edit. `npm ci` requires the committed
# package-lock.json (matched by the glob) and installs devDependencies (NODE_ENV unset).
COPY package*.json ./
RUN npm ci

# .dockerignore keeps node_modules, .env, .auth/, reports and .git out of this layer,
# so the freshly installed node_modules is never clobbered by host files.
COPY . .

# Runs the full suite: setup projects log in per browser+role and write .auth/, then
# chromium/firefox/webkit tests run. Stays root (the image default) so runtime writes to
# .auth/, playwright-report/ and test-results/ under /app need no chown.
CMD ["npm", "test"]
