#!/bin/bash

# Script para generar certificados SSL de desarrollo
# Este script debe ejecutarse desde la raíz del proyecto

echo "🔐 Generando certificados SSL para desarrollo..."

# Crear directorio para certificados de desarrollo fuera del proyecto
CERT_DIR="../secure-certs/development"
mkdir -p "$CERT_DIR"

echo "📁 Creando certificados en: $CERT_DIR"

# Generar certificados autofirmados
openssl req -x509 -newkey rsa:4096 -keyout "$CERT_DIR/key.pem" -out "$CERT_DIR/cert.pem" -days 365 -nodes -subj "/C=MX/ST=Estado/L=Ciudad/O=Desarrollo/OU=IT/CN=localhost"

# Verificar que se crearon correctamente
if [ -f "$CERT_DIR/key.pem" ] && [ -f "$CERT_DIR/cert.pem" ]; then
    echo "✅ Certificados generados exitosamente:"
    echo "   🔑 Clave privada: $CERT_DIR/key.pem"
    echo "   📜 Certificado: $CERT_DIR/cert.pem"
    echo ""
    echo "🔧 Configuración requerida:"
    echo "   Agrega estas líneas a tu archivo .env:"
    echo ""
    echo "   SSL_KEY_PATH=$(realpath "$CERT_DIR/key.pem")"
    echo "   SSL_CERT_PATH=$(realpath "$CERT_DIR/cert.pem")"
    echo ""
    echo "⚠️  IMPORTANTE:"
    echo "   - Estos certificados son SOLO para desarrollo"
    echo "   - NO usar en producción"
    echo "   - El navegador mostrará advertencia de seguridad (normal para certificados autofirmados)"
else
    echo "❌ Error: No se pudieron generar los certificados"
    exit 1
fi