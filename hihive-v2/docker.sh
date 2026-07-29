#!/usr/bin/env bash
# docker.sh — Arranca un contenedor PostgreSQL para desarrollo local.
# Lee las credenciales de .env (ver .env.example).
#
# Uso:
#   ./docker.sh up       # crea y arranca el contenedor (detached)
#   ./docker.sh down     # para y borra el contenedor (mantiene el volumen)
#   ./docker.sh stop     # pausa el contenedor sin borrarlo
#   ./docker.sh start    # reanuda el contenedor pausado
#   ./docker.sh logs     # sigue los logs
#   ./docker.sh psql     # abre psql dentro del contenedor
#   ./docker.sh reset    # borra contenedor Y volumen (destructivo)
#   ./docker.sh status   # estado del contenedor
set -euo pipefail

cd "$(dirname "$0")"

ENV_FILE=".env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "✗ No existe $ENV_FILE. Copia .env.example a .env y ajusta las credenciales."
  exit 1
fi

# Cargar .env (solo líneas KEY=VALUE, ignora comentarios y líneas vacías)
set -a
# shellcheck disable=SC1091
source <(grep -E '^[A-Za-z_][A-Za-z0-9_]*=' "$ENV_FILE")
set +a

: "${POSTGRES_USER:?Falta POSTGRES_USER en $ENV_FILE}"
: "${POSTGRES_PASSWORD:?Falta POSTGRES_PASSWORD en $ENV_FILE}"
: "${POSTGRES_DB:?Falta POSTGRES_DB en $ENV_FILE}"
: "${POSTGRES_PORT:=5432}"
: "${POSTGRES_CONTAINER:=hihive-pg}"
: "${POSTGRES_IMAGE:=postgres:17-alpine}"
: "${POSTGRES_DATA_DIR:=./.pgdata}"

VOLUME_NAME="${POSTGRES_CONTAINER}-data"

cmd="${1:-up}"

case "$cmd" in
  up)
    # Si ya está corriendo, no hacer nada
    if docker ps --format '{{.Names}}' | grep -qx "$POSTGRES_CONTAINER"; then
      echo "✓ $POSTGRES_CONTAINER ya está corriendo"
      exit 0
    fi
    # Crear volumen si no existe
    docker volume create "$VOLUME_NAME" >/dev/null 2>&1 || true
    docker run -d \
      --name "$POSTGRES_CONTAINER" \
      -e POSTGRES_USER="$POSTGRES_USER" \
      -e POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
      -e POSTGRES_DB="$POSTGRES_DB" \
      -p "${POSTGRES_PORT}:5432" \
      -v "${VOLUME_NAME}:/var/lib/postgresql/data" \
      --restart unless-stopped \
      "$POSTGRES_IMAGE"
    echo "✓ PostgreSQL en postgres://$POSTGRES_USER:***@localhost:$POSTGRES_PORT/$POSTGRES_DB"
    echo "  Contenedor: $POSTGRES_CONTAINER  Volumen: $VOLUME_NAME"
    ;;

  down)
    docker rm -f "$POSTGRES_CONTAINER" >/dev/null 2>&1 && echo "✓ Contenedor $POSTGRES_CONTAINER eliminado (volumen conservado)" || echo "· El contenedor no existía"
    ;;

  stop)
    docker stop "$POSTGRES_CONTAINER" >/dev/null 2>&1 && echo "✓ $POSTGRES_CONTAINER pausado" || echo "· El contenedor no existía"
    ;;

  start)
    docker start "$POSTGRES_CONTAINER" >/dev/null 2>&1 && echo "✓ $POSTGRES_CONTAINER reanudado" || echo "· El contenedor no existía"
    ;;

  logs)
    docker logs -f "$POSTGRES_CONTAINER"
    ;;

  psql)
    docker exec -it "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
    ;;

  reset)
    docker rm -f "$POSTGRES_CONTAINER" >/dev/null 2>&1 || true
    docker volume rm "$VOLUME_NAME" >/dev/null 2>&1 && echo "✓ Contenedor y volumen borrados" || echo "· No había nada que borrar"
    ;;

  status)
    docker ps -a --filter "name=$POSTGRES_CONTAINER" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    ;;

  *)
    echo "Uso: $0 {up|down|stop|start|logs|psql|reset|status}"
    exit 1
    ;;
esac
