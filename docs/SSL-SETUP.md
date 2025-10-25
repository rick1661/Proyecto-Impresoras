# 🔐 Configuración de Certificados SSL

Este proyecto requiere certificados SSL para funcionar en modo HTTPS. Los certificados **NO** deben incluirse en el repositorio por razones de seguridad.

## 🚀 Configuración Rápida para Desarrollo

### Opción 1: Script Automático (Recomendado)

#### En Windows (PowerShell):
```powershell
.\scripts\generate-dev-certs.ps1
```

#### En Linux/Mac (Bash):
```bash
chmod +x scripts/generate-dev-certs.sh
./scripts/generate-dev-certs.sh
```

### Opción 2: Manual

#### 1. Crear directorio para certificados (fuera del proyecto):
```bash
mkdir ../secure-certs/development
```

#### 2. Generar certificados autofirmados:
```bash
openssl req -x509 -newkey rsa:4096 -keyout ../secure-certs/development/key.pem -out ../secure-certs/development/cert.pem -days 365 -nodes -subj "/C=MX/ST=Estado/L=Ciudad/O=Desarrollo/OU=IT/CN=localhost"
```

#### 3. Configurar variables de entorno:
Crea/edita tu archivo `.env` y agrega:
```bash
SSL_KEY_PATH=../secure-certs/development/key.pem
SSL_CERT_PATH=../secure-certs/development/cert.pem
```

## 🏭 Configuración para Producción

### 1. Obtener certificados válidos
- **Let's Encrypt** (gratuito): Usar certbot
- **Compra certificados** de una CA confiable
- **Certificados corporativos** de tu organización

### 2. Ubicación segura
Colocar certificados en una ubicación segura del servidor:
```bash
# Ejemplo en Linux:
/etc/ssl/private/app-key.pem
/etc/ssl/certs/app-cert.pem
```

### 3. Variables de entorno de producción
```bash
SSL_KEY_PATH=/etc/ssl/private/app-key.pem
SSL_CERT_PATH=/etc/ssl/certs/app-cert.pem
NODE_ENV=production
```

### 4. Permisos adecuados
```bash
sudo chown root:ssl-cert /etc/ssl/private/app-key.pem
sudo chmod 640 /etc/ssl/private/app-key.pem
```

## 🔧 Solución de Problemas

### Error: "Archivo de clave SSL no encontrado"
1. Verificar que el archivo existe en la ruta especificada
2. Verificar permisos de lectura
3. Verificar que la variable de entorno esté configurada correctamente

### Error: "El archivo de clave no parece ser una clave privada válida"
1. Verificar que el archivo no esté corrupto
2. Verificar que sea un archivo PEM válido
3. Regenerar certificados si es necesario

### Advertencia del navegador sobre certificado
**Normal para certificados autofirmados en desarrollo.**
- En Chrome/Edge: Hacer clic en "Avanzado" → "Continuar a localhost"
- En Firefox: "Avanzado" → "Aceptar el riesgo y continuar"

### El servidor inicia en HTTP en lugar de HTTPS
Esto ocurre cuando:
1. No se encuentran los certificados
2. Los certificados son inválidos
3. Solo en modo desarrollo (fallback automático)

## 📁 Estructura de Directorios Recomendada

```
proyecto-impresoras/          # Tu proyecto (en Git)
├── src/
├── package.json
├── .env                     # Configuración local (NO en Git)
└── scripts/

secure-certs/               # Certificados (FUERA de Git)
├── development/
│   ├── key.pem
│   └── cert.pem
├── staging/
│   ├── key.pem
│   └── cert.pem
└── production/
    ├── key.pem
    └── cert.pem
```

## ⚠️ Importantes de Seguridad

1. **NUNCA** subir certificados o claves privadas a Git
2. **NUNCA** usar certificados de desarrollo en producción
3. **SIEMPRE** usar certificados válidos en producción
4. **ROTAR** certificados regularmente
5. **RESTRINGIR** acceso a las claves privadas

## 🆘 Comandos Útiles

### Verificar validez de certificado:
```bash
openssl x509 -in cert.pem -text -noout
```

### Verificar que la clave coincide con el certificado:
```bash
openssl rsa -noout -modulus -in key.pem | openssl md5
openssl x509 -noout -modulus -in cert.pem | openssl md5
```

### Verificar expiración:
```bash
openssl x509 -in cert.pem -noout -dates
```