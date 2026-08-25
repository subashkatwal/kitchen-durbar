#!/bin/sh
set -e

POSTGRES_HOST="${POSTGRES_HOST:-db}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"

echo "Waiting for database at ${POSTGRES_HOST}:${POSTGRES_PORT}..."
until nc -z "${POSTGRES_HOST}" "${POSTGRES_PORT}"; do
  sleep 1
done
echo "Database is up."

python manage.py migrate --noinput
python manage.py collectstatic --noinput --clear
# Static placeholder catalog seeding is off for now - add real products via
# the admin dashboard. Run `python manage.py seed_products` manually if you
# want the sample catalog back.
python manage.py createsuperuser_if_missing

exec "$@"
