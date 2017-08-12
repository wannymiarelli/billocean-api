FROM node:6.9.2
EXPOSE 8081
COPY . .
CMD npm run build
CMD npm run install
CMD node ./lib/index.js