FROM postgres:10
ENV POSTGRES_DB metamac_portal_bd
ENV POSTGRES_USER metamac_portal_bd
# password: QW4UCBf/CnMKaPMMJ4WeGNyrLgQHzBeYkHsev3263eg=
ENV POSTGRES_PASSWORD metamac_portal_bd 
ADD db/portal/postgresql/01-create /docker-entrypoint-initdb.d/