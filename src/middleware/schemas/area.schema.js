import Joi from 'joi';

// Esquema para validar datos de creación de area
export const createAreaSchema = Joi.object({
    nombre: Joi.string()
        .min(1)                    // Mínimo 1 caracter (no vacío)
        .max(100)                  // Máximo 100 caracteres
        .trim()                    // Quita espacios al inicio/final
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9]+$/)  // Letras, números y espacios
        .required()                // Campo obligatorio
        .messages({
            'string.empty': 'El nombre no puede estar vacío',
            'string.min': 'El nombre debe tener al menos 1 caracter',
            'string.max': 'El nombre no puede tener más de 100 caracteres',
            'string.pattern.base': 'El nombre solo puede contener letras, números y espacios',
            'any.required': 'El nombre es obligatorio'
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

// Esquema para validar datos de actualización de area
export const updateAreaSchema = Joi.object({
    nombre: Joi.string()
        .min(1)
        .max(100)
        .trim()
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9]+$/)
        .required()
        .messages({
            'string.empty': 'El nombre no puede estar vacío',
            'string.min': 'El nombre debe tener al menos 1 caracter',
            'string.max': 'El nombre no puede tener más de 100 caracteres',
            'string.pattern.base': 'El nombre solo puede contener letras, números y espacios',
            'any.required': 'El nombre es obligatorio'
        })
});

// Esquema para validar parámetros de URL (ID)
export const areaParamsSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID debe ser un número',
            'number.integer': 'El ID debe ser un número entero',
            'number.positive': 'El ID debe ser mayor a 0',
            'any.required': 'El ID es obligatorio'
        })
});