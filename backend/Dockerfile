FROM node:20 AS build
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
RUN npm install
RUN npm install -g typescript
COPY . .
RUN tsc -b
RUN npx prisma generate

FROM node:20 AS final
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
EXPOSE 8080
CMD ["node", "dist/index.js"]