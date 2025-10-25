# Script PowerShell para generar certificados SSL de desarrollo
# Ejecutar desde la raíz del proyecto: .\scripts\generate-dev-certs.ps1

Write-Host "🔐 Generando certificados SSL para desarrollo..." -ForegroundColor Green

# Crear directorio para certificados de desarrollo fuera del proyecto
$CertDir = "..\secure-certs\development"
New-Item -ItemType Directory -Force -Path $CertDir | Out-Null

Write-Host "📁 Creando certificados en: $CertDir" -ForegroundColor Blue

# Verificar si OpenSSL está disponible
try {
    $null = Get-Command openssl -ErrorAction Stop
    $OpenSSLAvailable = $true
} catch {
    $OpenSSLAvailable = $false
}

if ($OpenSSLAvailable) {
    # Usar OpenSSL si está disponible
    Write-Host "🔧 Usando OpenSSL..." -ForegroundColor Yellow
    
    $keyPath = Join-Path $CertDir "key.pem"
    $certPath = Join-Path $CertDir "cert.pem"
    
    & openssl req -x509 -newkey rsa:4096 -keyout $keyPath -out $certPath -days 365 -nodes -subj "/C=MX/ST=Estado/L=Ciudad/O=Desarrollo/OU=IT/CN=localhost"
    
} else {
    # Usar PowerShell nativo (Windows 10+)
    Write-Host "🔧 Usando PowerShell (método nativo de Windows)..." -ForegroundColor Yellow
    
    # Crear certificado autofirmado usando PowerShell
    $cert = New-SelfSignedCertificate -DnsName "localhost", "127.0.0.1" -CertStoreLocation "cert:\LocalMachine\My" -NotAfter (Get-Date).AddDays(365) -KeyAlgorithm RSA -KeyLength 4096
    
    # Exportar certificado y clave privada
    $certPath = Join-Path $CertDir "cert.pem"
    $keyPath = Join-Path $CertDir "key.pem"
    
    # Exportar certificado
    $certBytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
    $certPem = [System.Convert]::ToBase64String($certBytes, [System.Base64FormattingOptions]::InsertLineBreaks)
    $certPemFormatted = "-----BEGIN CERTIFICATE-----`n$certPem`n-----END CERTIFICATE-----"
    Set-Content -Path $certPath -Value $certPemFormatted
    
    # Para la clave privada, necesitamos exportar con contraseña y luego convertir
    $pfxPath = Join-Path $CertDir "temp.pfx"
    $password = ConvertTo-SecureString -String "temp" -Force -AsPlainText
    Export-PfxCertificate -Cert $cert -FilePath $pfxPath -Password $password | Out-Null
    
    # Convertir PFX a PEM (requiere OpenSSL o herramienta similar)
    Write-Host "⚠️  Para extraer la clave privada, ejecuta manualmente:" -ForegroundColor Red
    Write-Host "   openssl pkcs12 -in $pfxPath -nocerts -out $keyPath -nodes -passin pass:temp" -ForegroundColor Gray
    
    # Limpiar certificado del store
    Remove-Item "cert:\LocalMachine\My\$($cert.Thumbprint)" -Force
}

# Verificar que se crearon correctamente
$keyPath = Join-Path $CertDir "key.pem"
$certPath = Join-Path $CertDir "cert.pem"

if ((Test-Path $keyPath) -and (Test-Path $certPath)) {
    Write-Host "✅ Certificados generados exitosamente:" -ForegroundColor Green
    Write-Host "   🔑 Clave privada: $keyPath" -ForegroundColor White
    Write-Host "   📜 Certificado: $certPath" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Configuración requerida:" -ForegroundColor Blue
    Write-Host "   Agrega estas líneas a tu archivo .env:" -ForegroundColor Blue
    Write-Host ""
    Write-Host "   SSL_KEY_PATH=$(Resolve-Path $keyPath)" -ForegroundColor Gray
    Write-Host "   SSL_CERT_PATH=$(Resolve-Path $certPath)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
    Write-Host "   - Estos certificados son SOLO para desarrollo" -ForegroundColor Red
    Write-Host "   - NO usar en producción" -ForegroundColor Red
    Write-Host "   - El navegador mostrará advertencia de seguridad (normal para certificados autofirmados)" -ForegroundColor Yellow
} else {
    Write-Host "❌ Error: No se pudieron generar los certificados" -ForegroundColor Red
    if (-not $OpenSSLAvailable) {
        Write-Host "💡 Instala OpenSSL para generar certificados automáticamente:" -ForegroundColor Blue
        Write-Host "   - Desde chocolatey: choco install openssl" -ForegroundColor Gray
        Write-Host "   - Desde scoop: scoop install openssl" -ForegroundColor Gray
        Write-Host "   - O descarga desde: https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Gray
    }
    exit 1
}