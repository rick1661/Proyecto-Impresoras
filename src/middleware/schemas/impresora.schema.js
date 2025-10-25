import Joi from 'joi';

// Esquema para validar datos de creación de impresora
export const createImpresoraSchema = Joi.object({
    serie: Joi.string()
        .min(1)
        .max(50)
        .trim()
        .pattern(/^[a-zA-Z0-9\-_]+$/)  // Letras, números, guiones y guiones bajos
        .required()
        .messages({
            'string.empty': 'La serie no puede estar vacía',
            'string.min': 'La serie debe tener al menos 1 caracter',
            'string.max': 'La serie no puede tener más de 50 caracteres',
            'string.pattern.base': 'La serie solo puede contener letras, números, guiones y guiones bajos',
            'any.required': 'La serie es obligatoria'
        }),

    nombre: Joi.string()
        .min(1)
        .max(100)
        .trim()
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9\-_]+$/)  // Letras, números, espacios, guiones
        .required()
        .messages({
            'string.empty': 'El nombre no puede estar vacío',
            'string.min': 'El nombre debe tener al menos 1 caracter',
            'string.max': 'El nombre no puede tener más de 100 caracteres',
            'string.pattern.base': 'El nombre solo puede contener letras, números, espacios y guiones',
            'any.required': 'El nombre es obligatorio'
        }),

    marca: Joi.string()
        .min(1)
        .max(50)
        .trim()
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9]+$/)  // Letras, números y espacios
        .required()
        .messages({
            'string.empty': 'La marca no puede estar vacía',
            'string.min': 'La marca debe tener al menos 1 caracter',
            'string.max': 'La marca no puede tener más de 50 caracteres',
            'string.pattern.base': 'La marca solo puede contener letras, números y espacios',
            'any.required': 'La marca es obligatoria'
        }),

    modelo: Joi.string()
        .min(1)
        .max(50)
        .trim()
        .pattern(/^[a-zA-Z0-9\s\-_]+$/)  // Letras, números, espacios, guiones
        .required()
        .messages({
            'string.empty': 'El modelo no puede estar vacío',
            'string.min': 'El modelo debe tener al menos 1 caracter',
            'string.max': 'El modelo no puede tener más de 50 caracteres',
            'string.pattern.base': 'El modelo solo puede contener letras, números, espacios y guiones',
            'any.required': 'El modelo es obligatorio'
        }),

    direccionIp: Joi.string()
        .pattern(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::[0-9]{1,5})?$/)
        .required()
        .messages({
            'string.pattern.base': 'La dirección IP debe tener un formato válido (ej: 192.168.1.100 o 192.168.1.100:8080)',
            'any.required': 'La dirección IP es obligatoria'
        }),

    area: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID de área debe ser un número',
            'number.integer': 'El ID de área debe ser un número entero',
            'number.positive': 'El ID de área debe ser mayor a 0',
            'any.required': 'El ID de área es obligatorio'
        }),

    contrato: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID de contrato debe ser un número',
            'number.integer': 'El ID de contrato debe ser un número entero',
            'number.positive': 'El ID de contrato debe ser mayor a 0',
            'any.required': 'El ID de contrato es obligatorio'
        }),

    toner: Joi.string()
        .min(1)
        .max(100)
        .trim()
        .optional()  // El toner puede ser opcional en la creación
        .messages({
            'string.empty': 'El toner no puede estar vacío si se proporciona',
            'string.min': 'El toner debe tener al menos 1 caracter',
            'string.max': 'El toner no puede tener más de 100 caracteres'
        })
});

// Esquema para validar datos de actualización de impresora
export const updateImpresoraSchema = Joi.object({
    serie: Joi.string()
        .min(1)
        .max(50)
        .trim()
        .pattern(/^[a-zA-Z0-9\-_]+$/)
        .optional()
        .messages({
            'string.empty': 'La serie no puede estar vacía',
            'string.min': 'La serie debe tener al menos 1 caracter',
            'string.max': 'La serie no puede tener más de 50 caracteres',
            'string.pattern.base': 'La serie solo puede contener letras, números, guiones y guiones bajos'
        }),

    nombre: Joi.string()
        .min(1)
        .max(100)
        .trim()
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9\-_]+$/)
        .optional()
        .messages({
            'string.empty': 'El nombre no puede estar vacío',
            'string.min': 'El nombre debe tener al menos 1 caracter',
            'string.max': 'El nombre no puede tener más de 100 caracteres',
            'string.pattern.base': 'El nombre solo puede contener letras, números, espacios y guiones'
        }),

    marca: Joi.string()
        .min(1)
        .max(50)
        .trim()
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9]+$/)
        .optional()
        .messages({
            'string.empty': 'La marca no puede estar vacía',
            'string.min': 'La marca debe tener al menos 1 caracter',
            'string.max': 'La marca no puede tener más de 50 caracteres',
            'string.pattern.base': 'La marca solo puede contener letras, números y espacios'
        }),

    modelo: Joi.string()
        .min(1)
        .max(50)
        .trim()
        .pattern(/^[a-zA-Z0-9\s\-_]+$/)
        .optional()
        .messages({
            'string.empty': 'El modelo no puede estar vacío',
            'string.min': 'El modelo debe tener al menos 1 caracter',
            'string.max': 'El modelo no puede tener más de 50 caracteres',
            'string.pattern.base': 'El modelo solo puede contener letras, números, espacios y guiones'
        }),

    direccionIp: Joi.string()
        .pattern(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::[0-9]{1,5})?$/)
        .optional()
        .messages({
            'string.pattern.base': 'La dirección IP debe tener un formato válido (ej: 192.168.1.100 o 192.168.1.100:8080)'
        }),

    area: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID de área debe ser un número',
            'number.integer': 'El ID de área debe ser un número entero',
            'number.positive': 'El ID de área debe ser mayor a 0'
        }),

    contrato: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID de contrato debe ser un número',
            'number.integer': 'El ID de contrato debe ser un número entero',
            'number.positive': 'El ID de contrato debe ser mayor a 0'
        }),

    toner: Joi.string()
        .min(1)
        .max(100)
        .trim()
        .optional()
        .messages({
            'string.empty': 'El toner no puede estar vacío si se proporciona',
            'string.min': 'El toner debe tener al menos 1 caracter',
            'string.max': 'El toner no puede tener más de 100 caracteres'
        })
});

// Esquema para validar parámetros de URL (ID)
export const impresoraParamsSchema = Joi.object({
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