import Joi from 'joi';

// Esquema para validar datos de creación de contrato
export const createContratoSchema = Joi.object({
    nombre: Joi.string()
        .min(1)                    // Mínimo 1 caracter (no vacío)
        .max(100)                  // Máximo 100 caracteres
        .trim()                    // Quita espacios al inicio/final
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9\-_\.]+$/)  // Letras, números, espacios y caracteres comunes de contratos
        .required()                // Campo obligatorio
        .messages({
            'string.empty': 'El nombre del contrato no puede estar vacío',
            'string.min': 'El nombre del contrato debe tener al menos 1 caracter',
            'string.max': 'El nombre del contrato no puede tener más de 100 caracteres',
            'string.pattern.base': 'El nombre del contrato solo puede contener letras, números, espacios, guiones y puntos',
            'any.required': 'El nombre del contrato es obligatorio'
        }),
    
    empresaID: Joi.number()
        .integer()                 // Solo números enteros
        .positive()                // Solo números positivos (> 0)
        .required()                // Campo obligatorio
        .messages({
            'number.base': 'El ID de empresa debe ser un número',
            'number.integer': 'El ID de empresa debe ser un número entero',
            'number.positive': 'El ID de empresa debe ser mayor a 0',
            'any.required': 'El ID de empresa es obligatorio'
        })
});

// Esquema para validar datos de actualización de contrato
export const updateContratoSchema = Joi.object({
    nombre: Joi.string()
        .min(1)
        .max(100)
        .trim()
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9\-_\.]+$/)
        .required()
        .messages({
            'string.empty': 'El nombre del contrato no puede estar vacío',
            'string.min': 'El nombre del contrato debe tener al menos 1 caracter',
            'string.max': 'El nombre del contrato no puede tener más de 100 caracteres',
            'string.pattern.base': 'El nombre del contrato solo puede contener letras, números, espacios, guiones y puntos',
            'any.required': 'El nombre del contrato es obligatorio'
        }),
    
    empresaID: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID de empresa debe ser un número',
            'number.integer': 'El ID de empresa debe ser un número entero',
            'number.positive': 'El ID de empresa debe ser mayor a 0',
            'any.required': 'El ID de empresa es obligatorio'
        })
});

// Esquema para validar parámetros de URL (ID)
export const contratoParamsSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del contrato debe ser un número',
            'number.integer': 'El ID del contrato debe ser un número entero',
            'number.positive': 'El ID del contrato debe ser mayor a 0',
            'any.required': 'El ID del contrato es obligatorio'
        })
});