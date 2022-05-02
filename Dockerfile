FROM node:14-slim as build
WORKDIR /app
COPY . /app

RUN npm ci
RUN npm run build

FROM node:14-slim AS runner
WORKDIR /app
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

EXPOSE 3000

CMD ["npm", "start"]