#!/bin/bash

# Variables
REPO="GastonRR/jumper-tool"
TAG="latest"

# Determinar la arquitectura de la máquina
if [ "$(uname -m)" == "arm64" ]; then
    ARCH="arm64"
else
    ARCH="x64"
fi

# Obtener la URL de la última release
ASSET_NAME="jumper-${ARCH}.tar.gz"
RELEASE_URL=$(curl -s https://api.github.com/repos/$REPO/releases/$TAG | grep "browser_download_url.*$ASSET_NAME" | cut -d '"' -f 4)

echo "Detected architecture: $ARCH"
echo "Downloading from: $RELEASE_URL"

# Descargar el archivo de la release
curl -L -o $ASSET_NAME $RELEASE_URL

# Extraer el archivo
tar -xzf $ASSET_NAME

# Crear ~/.local/bin si no existe
mkdir -p ~/.local/bin

# Mover el binario a ~/.local/bin
mv jumper ~/.local/bin/

# Añadir ~/.local/bin al PATH temporalmente
export PATH="$HOME/.local/bin:$PATH"

# Detectar archivo de configuración del shell
if [ -f "$HOME/.zshrc" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
else
    echo "Warning: Could not find a .zshrc or .bashrc file."
    echo "You may need to add ~/.local/bin to your PATH manually."
    SHELL_CONFIG=""
fi

# Añadir comando export al archivo de configuración del shell
if [ -n "$SHELL_CONFIG" ]; then
    if grep -q "export PATH=\"\$HOME/.local/bin:\$PATH\"" "$SHELL_CONFIG"; then
        echo "The export command already exists in $SHELL_CONFIG."
    else
        echo "Adding the export command to $SHELL_CONFIG..."
        echo "export PATH=\"\$HOME/.local/bin:\$PATH\"" >> "$SHELL_CONFIG"
    fi
fi

# Limpiar archivos temporales
rm $ASSET_NAME

echo "Installation complete. Verifying installation..."

# Verificar instalación
which jumper > /dev/null
if [ $? -eq 0 ]; then
    echo "Binary 'jumper' successfully installed and available in PATH."
else
    echo "Binary 'jumper' not found in PATH. You may need to add ~/.local/bin to your PATH."
fi