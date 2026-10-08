FROM composer:2.10.3@sha256:af98f42dfff7c68ba8d53c2164fd9fde1087b7d449514baa38c418b1f6bc4bac AS vendor
WORKDIR /app
COPY composer.json composer.lock symfony.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction
COPY . .
RUN composer dump-autoload --no-dev --classmap-authoritative

FROM php:8.5.11-apache-trixie@sha256:974e3a920309308e1690ed607e6cc3061d6906f90cc8d30fe519daa48bccf101
ARG APP_ENV
ARG DEFAULT_URI
ENV APACHE_RUN_DIR=/tmp/apache2 \
    APACHE_LOCK_DIR=/tmp/apache2 \
    APACHE_PID_FILE=/tmp/apache2/apache2.pid
WORKDIR /var/www/html

RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
 && sed -i 's/^expose_php = .*/expose_php = Off/' "$PHP_INI_DIR/php.ini" \
 && echo 'Listen ${API_PORT}' > /etc/apache2/ports.conf \
 && sed -i 's/^ServerTokens .*/ServerTokens Prod/; s/^ServerSignature .*/ServerSignature Off/' /etc/apache2/conf-available/security.conf
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf

COPY --from=vendor /app ./
RUN touch .env \
 && APP_ENV="$APP_ENV" DEFAULT_URI="$DEFAULT_URI" php bin/console cache:warmup \
 && chown -R www-data:www-data var

USER www-data
