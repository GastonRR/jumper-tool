export const SHELL_FUNCTION_INIT = `
jump() {
  echo "Saltando a repositorio $1..."
  TARGET_PATH=$(jumper to "$1" 2>&1)
  EXIT_CODE=$?
  
  if [ $EXIT_CODE -ne 0 ]; then
    echo "$TARGET_PATH"
    return 1
  fi

  echo "Cambiando de directorio..."
  cd "$TARGET_PATH" || return
}
`;
