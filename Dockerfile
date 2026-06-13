FROM postgres:16-alpine
ENV POSTGRES_DB=burgers
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgrespassword
VOLUME /var/lib/postgresql/data

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000
EXPOSE 5432

ENTRYPOINT ["entrypoint.sh"]
