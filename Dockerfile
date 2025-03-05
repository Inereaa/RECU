
# Uso una imagen base de Apache
FROM httpd:2.4

# Instalo Node.js y json-server
RUN apt-get update && \
    apt-get install -y npm nodejs

# Habilito mod_userdir para el espacio de usuarios y más necesarios
RUN sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/#LoadModule ssl_module/LoadModule ssl_module/' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/#LoadModule headers_module/LoadModule headers_module/' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/#LoadModule include_module/LoadModule include_module/' /usr/local/apache2/conf/httpd.conf

# PARA DIRECTORIO POR DEFECTO Y SITIOS VIRTUALES
RUN mkdir -p /var/www/neikap /var/www/test /var/www/neikap/docs /var/www/neikap/css /var/www/neikap/js /var/www/neikap/db /var/www/neikap/errores

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
COPY ./index.html /var/www/test

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
