FROM node:18.16


WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

# Install Puppeteer dependencies and Google Chrome
RUN apt-get update && \
    apt-get install -yq --no-install-recommends \
    libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 \
    libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 \
    libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 \
    libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 \
    libxtst6 libnss3 wget ca-certificates \
    && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install


RUN npm install --legacy-peer-deps
# If you are building your code for production
# RUN npm install --only=production
RUN npm install -g @nestjs/cli@9.4.0
RUN npm install pm2 -g


# Bundle app source
COPY . .
RUN npm run build

# Show current folder structure in logs
RUN ls -al -R

EXPOSE 2000

CMD [ "pm2-runtime", "pm2.json" ]
# CMD ["npm", "run", "start:prod"]