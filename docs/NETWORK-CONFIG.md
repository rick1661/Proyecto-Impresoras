# 🌐 Configuración de Red - SIMNSA Hospital

## 📋 VLANs Configuradas

### **VLAN 192.168.85.x - Red de Equipos Médicos**
- **Propósito**: Impresoras, equipos médicos, dispositivos IoT
- **Acceso**: Solo consulta SNMP y gestión de impresoras
- **Ejemplos**:
  - `192.168.85.227` - MFP E52645 Hospitalizacion
  - `192.168.85.34` - MFP E47528 ADM HSI Color
  - `192.168.85.113` - 408dn Atencion a Clientes

### **VLAN 192.168.80.x - Red Administrativa**
- **Propósito**: Estaciones de trabajo, computadoras del personal
- **Acceso**: Gestión completa del sistema de impresoras
- **Ejemplos**:
  - `192.168.80.1` - Gateway/Router administrativo
  - `192.168.80.10-50` - Estaciones administrativas
  - `192.168.80.100+` - Puestos de trabajo

## 🔒 Configuración de Seguridad CORS

### **Origins Permitidos por Entorno:**

#### **Development**
```javascript
'https://localhost:5500-5504'
'http://localhost:3000'
```

#### **Testing**
```javascript
'https://192.168.85.1:5500'  // VLAN equipos
'https://192.168.80.1:5500'  // VLAN administrativa
```

#### **Production**
```javascript
'https://simnsa.local'
'https://impresoras.simnsa.local'
'https://192.168.85.1'       // Gateway equipos
'https://192.168.80.1'       // Gateway administrativo
```

## 🛡️ Content Security Policy

### **connectSrc (Conexiones permitidas):**
```javascript
"'self'"                     // Mismo origen
"https://192.168.85.*"       // VLAN equipos médicos
"https://192.168.80.*"       // VLAN administrativa
```

## ⚙️ Configuración en .env

```bash
# Configurar orígenes específicos por IP
CORS_ORIGINS=https://simnsa.local,https://192.168.85.1,https://192.168.80.1,https://localhost:5501

# Para permitir rangos completos (usar configuración por defecto en código)
# NODE_ENV=production
```

## 🚨 Consideraciones de Seguridad

### **Separación de Redes**
- **VLAN 85**: Solo consulta SNMP, sin gestión administrativa
- **VLAN 80**: Acceso completo para administradores IT

### **Rate Limiting por Red**
- **Equipos (85.x)**: Límites más estrictos para proteger hardware
- **Admin (80.x)**: Límites permisivos para operaciones normales

### **Firewall Recomendado**
```bash
# Permitir solo HTTPS desde VLAN administrativa
iptables -A INPUT -s 192.168.80.0/24 -p tcp --dport 5500-5504 -j ACCEPT

# Permitir solo consulta SNMP desde VLAN equipos
iptables -A INPUT -s 192.168.85.0/24 -p tcp --dport 5500-5504 -j ACCEPT

# Bloquear todo lo demás
iptables -A INPUT -p tcp --dport 5500-5504 -j DROP
```

## 📊 Monitoreo de Acceso

### **Logs de CORS en Consola**
```
✅ CORS: Permitiendo origin https://192.168.80.10:5500
✅ CORS: Permitiendo origin https://192.168.85.1:5500
❌ CORS: Origen https://192.168.90.1:5500 no está permitido
```

### **Testing de Conectividad**
```bash
# Desde VLAN administrativa (80.x)
curl -k https://192.168.85.1:5500/api/impresoras

# Desde VLAN equipos (85.x)  
curl -k https://192.168.85.1:5500/api/toner/192.168.85.227
```

## 🔧 Troubleshooting

### **Error CORS común:**
```
Access to fetch at 'https://192.168.85.1:5500/api/impresoras' 
from origin 'https://192.168.80.10:5500' has been blocked by CORS policy
```

**Solución:**
1. Verificar que la IP esté en `getAllowedOrigins()`
2. Comprobar que el protocolo sea HTTPS
3. Validar el puerto configurado

### **Error CSP:**
```
Refused to connect to 'https://192.168.85.227' because it violates 
the document's Content Security Policy
```

**Solución:**
1. Verificar `connectSrc` en configuración de Helmet
2. Asegurar que la VLAN esté permitida en CSP

## 📈 Próximos Pasos

1. **Implementar autenticación**: AD/LDAP para control de acceso
2. **Logging centralizado**: Registrar todos los accesos por VLAN
3. **Métricas de red**: Monitorear uso por departamento/VLAN
4. **Backup de configuración**: Automatizar respaldos de configuración de red

---
**Última actualización**: Octubre 2025  
**Contacto IT**: admin@simnsa.local