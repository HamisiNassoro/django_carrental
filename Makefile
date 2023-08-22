##if block where we can load .env file
ifneq (,$(wildcard ./.env))
include .env
export
ENV_FILE_PARAM = --env-file .env

endif

##declaring tasks
build:
	docker-compose up --build -d --remove-orphans

up:
	docker-compose up -d

down:
	docker-compose down

show-logs:
	docker-compose logs

migrate:
	docker-compose exec api python3 manage.py migrate

makemigrations:
	docker-compose exec api python3 manage.py makemigrations

superuser:
	docker-compose exec api python3 manage.py createsuperuser

collectstatic:
	docker-compose exec api python3 manage.py collectstatic --no-input --clear

# bring down containers and remove any associated volumes
down-v:
	docker-compose down -v

# Inspect my postgress volume
volume:
	docker volume inspect django_carrental_postgres_data

# Inspect the postgres database
carrental-db:
	docker-compose exec postgres-db psql --username=postgres --dbname=carrental

test:
	docker-compose exec api pytest -p no:warnings --cov=.

##test to generate html report
test-html:
	docker-compose exec api pytest -p no:warnings --cov=. --cov-report html

flake8:
	docker-compose exec api flake8 .

black-check:
	docker-compose exec api black --check --exclude=migrations .

black-diff:
	docker-compose exec api black --diff --exclude=migrations .

black:
	docker-compose exec api black --exclude=migrations .

isort-check:
	docker-compose exec api isort . --check-only --skip venv --skip migrations

isort-diff:
	docker-compose exec api isort . --diff --skip venv --skip migrations

isort:
	docker-compose exec api isort . --skip venv --skip migrations


