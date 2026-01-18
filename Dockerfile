FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /work
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

RUN apt-get update \
  && apt-get install -y default-jre \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
RUN chown -R pwuser:pwuser /work
RUN chmod +x ./scripts/docker-entrypoint.sh

USER pwuser
EXPOSE 5050

ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
