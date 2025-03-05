
# Uso una imagen base de Apache
FROM httpd:2.4

# Instalo Node.js y json-server
RUN apt-get update && \
    apt-get install -y npm nodejs
    # apt-get install apache2 libapache2-mod-wsgi

# RUN a2enmod wsgi

# Habilito mod_userdir para el espacio de usuarios y más necesarios
RUN sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/#LoadModule ssl_module/LoadModule ssl_module/' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/#LoadModule headers_module/LoadModule headers_module/' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/#LoadModule include_module/LoadModule include_module/' /usr/local/apache2/conf/httpd.conf

# PARA DIRECTORIO POR DEFECTO Y SITIOS VIRTUALES
RUN mkdir -p /var/www/neikap /var/www/host1/public_html /var/www/host2/public_html /var/www/neikap/docs /var/www/neikap/css /var/www/neikap/js /var/www/neikap/db /var/www/neikap/errores

# Copio los archivos de la página web
# CAMBIADO DIRECTORIO POR DEFECTO
COPY ./index.es.html /var/www/neikap/index.html
COPY ./docs/ /var/www/neikap/docs/
COPY ./css/ /var/www/neikap/css/
COPY ./js/ /var/www/neikap/js/
COPY ./db/ /var/www/neikap/db/

# PÁGINAS DE ERRORES PERSONALIZADAS
COPY ./tf/404.html /var/www/neikap/errores
COPY ./tf/500.html /var/www/neikap/errores

# SITIOS VIRTUALES
COPY ./index.html /var/www/host1/public_html
COPY ./index.html /var/www/host2/public_html
# RUN sh -c echo "127.0.0.1 www.host1.com >> /etc/hosts"
# RUN sh -c echo "127.0.0.1 www.host2.com >> /etc/hosts"
# RUN a2ensite host1.conf
# RUN a2ensite host2.conf
# RUN a2dissite 000-default.conf

# Copio los certificados SSL
COPY ./tf/certificate.crt /usr/local/apache2/conf/
COPY ./tf/ca_bundle.crt /usr/local/apache2/conf/
COPY ./tf/private.key /usr/local/apache2/conf/

# Configuración SSL personalizada
COPY ./tf/httpd-ssl.conf /usr/local/apache2/conf/extra/

# Habilito SSL
RUN apt-get install -y ssl-cert && \
    sed -i 's/#LoadModule ssl_module/LoadModule ssl_module/' /usr/local/apache2/conf/httpd.conf && \
    echo "Include /usr/local/apache2/conf/extra/httpd-ssl.conf" >> /usr/local/apache2/conf/httpd.conf

# Exponer puertos
EXPOSE 443 80

# Instrucción por defecto
CMD ["httpd-foreground"]
