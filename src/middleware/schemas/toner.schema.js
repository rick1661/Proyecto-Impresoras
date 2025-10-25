import Joi from 'joi';

// Esquema básico para validar direcciones IP (con o sin puerto)
export const tonerIpParamsSchema = Joi.object({
    ip: Joi.string()
        .pattern(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{0,3}))?$/)
        .required()
        .messages({
            'string.pattern.base': 'Debe ser una dirección IP válida con puerto válido (1-65535) (ej: 192.168.1.100 o 192.168.1.100:8080)',
            'any.required': 'La dirección IP es obligatoria'
        })
});

// Esquema alternativo para IPs sin puerto (más estricto para SNMP)
export const tonerIpStrictParamsSchema = Joi.object({
    ip: Joi.string()
        .pattern(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
        .required()
        .messages({
            'string.pattern.base': 'Debe ser una dirección IP válida sin puerto (ej: 192.168.1.100)',
            'any.required': 'La dirección IP es obligatoria'
        })
});

// Función helper para validar el rango de puertos cuando se especifica
export const isValidPort = (port) => {
    const portNum = parseInt(port);
    return portNum >= 1 && portNum <= 65535;
};