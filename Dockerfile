FROM postgres:16-alpine
ENV POSTGRES_DB=burgers
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgrespassword
VOLUME /var/lib/postgresql/data
EXPOSE 5432
