#!/usr/bin/env sh
# setup.sh — prepara el entorno del proyecto HiHive v2.
# Instala mise si no está disponible, asegura bun y deja el repo listo para `bun run build`.
# Idempotente: se puede ejecutar en local y en el server sin romper nada.
set -eu

# ── helpers ───────────────────────────────────────────────────────
info()  { printf '\033[1;34m→\033[0m %s\n' "$1"; }
ok()    { printf '\033[1;32m✓\033[0m %s\n' "$1"; }
warn()  { printf '\033[1;33m!\033[0m %s\n' "$1"; }
die()   { printf '\033[1;31m✗\033[0m %s\n' "$1" >&2; exit 1; }

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

# ── 1. mise ───────────────────────────────────────────────────────
# mise gestiona bun (y cualquier otra tool del .mise.toml) sin tocar el SO.
MISE_BIN="${MISE_BIN:-$HOME/.local/bin/mise}"

if command -v mise >/dev/null 2>&1; then
  ok "mise ya instalado: $(mise --version | head -1)"
elif [ -x "$MISE_BIN" ]; then
  info "mise encontrado en $MISE_BIN (no está en PATH)"
  export PATH="$HOME/.local/bin:$PATH"
  ok "mise disponible: $(mise --version | head -1)"
else
  info "Instalando mise…"
  curl -fsSL https://mise.run | sh
  export PATH="$HOME/.local/bin:$PATH"
  command -v mise >/dev/null 2>&1 || die "mise se instaló pero no está en PATH. Abre un shell nuevo o añade $HOME/.local/bin al PATH."
  ok "mise instalado: $(mise --version | head -1)"

  # Activa mise en los rc del usuario para sesiones futuras (best-effort).
  for rc in "$HOME/.zshrc" "$HOME/.bashrc"; do
    [ -f "$rc" ] || continue
    if ! grep -q 'mise activate' "$rc" 2>/dev/null; then
      printf '\n# mise\n. "$HOME/.local/bin/mise activate" %s\n' "$(basename "$SHELL" 2>/dev/null || echo bash)" >> "$rc"
      warn "Añadido 'mise activate' a $rc. Recarga el shell la próxima vez."
    fi
  done
fi

# ── 2. .mise.toml ──────────────────────────────────────────────────
# Lo gestiona el repo; si no existe lo creamos con bun. Si existe lo respetamos.
if [ ! -f "$REPO_ROOT/.mise.toml" ]; then
  info "Creando .mise.toml con bun…"
  cat > "$REPO_ROOT/.mise.toml" <<'TOML'
[tools]
bun = "1.2"

[env]
# Asegura que el binario del proyecto esté en PATH durante scripts de mise.
PATH = "{{ env.HOME }}/.local/share/mise/shims:{{ env.PATH }}"
TOML
  ok ".mise.toml creado"
else
  ok ".mise.toml ya existe (se respeta)"
fi

# ── 3. instalar tools declaradas ──────────────────────────────────
# mise pide confiar explícitamente en el .mise.toml del repo (seguridad).
info "mise trust…"
mise trust -y >/dev/null 2>&1 || mise trust >/dev/null 2>&1 || warn "mise trust falló (quizá ya confiado). Continuando…"
info "mise install…"
mise install
ok "tools listas"

# ── 4. verificar bun ──────────────────────────────────────────────
BUN="$(mise which bun 2>/dev/null || true)"
if [ -z "$BUN" ]; then
  die "bun no disponible tras mise install. Revisa .mise.toml."
fi
ok "bun: $($BUN --version)"

# ── 5. deps del proyecto (si ya hay package.json) ─────────────────
if [ -f "$REPO_ROOT/package.json" ]; then
  info "Instalando dependencias del proyecto…"
  mise exec -- bun install
  ok "node_modules listo"
else
  warn "Sin package.json todavía — salta 'bun install'. Vuelve a ejecutar setup.sh tras scaffold."
fi

printf '\n\033[1;32mSetup completo.\033[0m Ejecuta \033[1m`bun run dev`\033[0m o \033[1m`bun run build`\033[0m.\n'