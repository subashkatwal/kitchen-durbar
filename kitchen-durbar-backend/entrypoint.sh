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
# WhiteNoise's post-collectstatic compression pass compresses the collected
# files across a thread pool, which can occasionally throw a transient
# FileNotFoundError under container filesystem I/O timing (same class of
# flakiness already noted for local dev in settings.py's STORAGES comment -
# turns out prod isn't immune either). Retrying without --clear costs
# nothing: every file the second run needs is already on disk from the first
# (failed) attempt, so it isn't racing fresh writes and reliably succeeds -
# this just survives the flake instead of crash-looping the container.
python manage.py collectstatic --noinput --clear || python manage.py collectstatic --noinput
# Static placeholder catalog seeding is off for now - add real products via
# the admin dashboard. Run `python manage.py seed_products` manually if you
# want the sample catalog back.
python manage.py createsuperuser_if_missing

exec "$@"
