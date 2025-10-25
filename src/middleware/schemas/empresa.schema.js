import Joi from 'joi';

// Esquema para validar datos de creación de empresa
export const createEmpresaSchema = Joi.object({
    nombre: Joi.string()
        .min(1)                    // Mínimo 1 caracter (no vacío)
        .max(150)                  // Máximo 150 caracteres (empresas pueden tener nombres largos)
        .trim()                    // Quita espacios al inicio/final
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9\-_\.\,\&]+$/)  // Letras, números, espacios y caracteres comunes de empresas
        .required()                // Campo obligatorio
        .messages({
            'string.empty': 'El nombre de la empresa no puede estar vacío',
            'string.min': 'El nombre de la empresa debe tener al menos 1 caracter',
            'string.max': 'El nombre de la empresa no puede tener más de 150 caracteres',
            'string.pattern.base': 'El nombre de la empresa solo puede contener letras, números, espacios y caracteres especiales comunes (-, _, ., ,, &)',
            'any.required': 'El nombre de la empresa es obligatorio'
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

// Esquema para validar datos de actualización de empresa
export const updateEmpresaSchema = Joi.object({
    nombre: Joi.string()
        .min(1)
        .max(150)
        .trim()
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9\-_\.\,\&]+$/)
        .required()
        .messages({
            'string.empty': 'El nombre de la empresa no puede estar vacío',
            'string.min': 'El nombre de la empresa debe tener al menos 1 caracter',
            'string.max': 'El nombre de la empresa no puede tener más de 150 caracteres',
            'string.pattern.base': 'El nombre de la empresa solo puede contener letras, números, espacios y caracteres especiales comunes (-, _, ., ,, &)',
            'any.required': 'El nombre de la empresa es obligatorio'
        })
});

// Esquema para validar parámetros de URL (ID)
export const empresaParamsSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID de la empresa debe ser un número',
            'number.integer': 'El ID de la empresa debe ser un número entero',
            'number.positive': 'El ID de la empresa debe ser mayor a 0',
            'any.required': 'El ID de la empresa es obligatorio'
        })
});