import Joi from 'joi';

// Esquema para validar datos de creación de consumible
export const createConsumibleSchema = Joi.object({
    tipo: Joi.alternatives()
        .try(
            Joi.string().valid('Toner', 'Tambor'),  // Si viene como string
            Joi.number().valid(1, 2)               // Si viene como número (1=Toner, 2=Tambor)
        )
        .required()
        .messages({
            'alternatives.match': 'El tipo debe ser "Toner", "Tambor", 1 o 2',
            'any.required': 'El tipo es obligatorio'
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

    tij: Joi.string()
        .min(1)
        .max(20)
        .trim()
        .pattern(/^TIJ[a-zA-Z0-9]+$/)  // Debe empezar con TIJ seguido de letras/números
        .required()
        .messages({
            'string.empty': 'El TIJ no puede estar vacío',
            'string.min': 'El TIJ debe tener al menos 1 caracter',
            'string.max': 'El TIJ no puede tener más de 20 caracteres',
            'string.pattern.base': 'El TIJ debe empezar con "TIJ" seguido de números/letras',
            'any.required': 'El TIJ es obligatorio'
        }),

    impresoraID: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID de impresora debe ser un número',
            'number.integer': 'El ID de impresora debe ser un número entero',
            'number.positive': 'El ID de impresora debe ser mayor a 0',
            'any.required': 'El ID de impresora es obligatorio'
        }),

    // Fecha opcional ya que puede generarse automáticamente en el servidor
    fecha: Joi.date()
        .optional()
        .messages({
            'date.base': 'La fecha debe tener un formato válido'
        })
});

// Esquema para validar datos de actualización de consumible
export const updateConsumibleSchema = Joi.object({
    tipo: Joi.alternatives()
        .try(
            Joi.string().valid('Toner', 'Tambor'),
            Joi.number().valid(1, 2)
        )
        .optional()
        .messages({
            'alternatives.match': 'El tipo debe ser "Toner", "Tambor", 1 o 2'
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

    tij: Joi.string()
        .min(1)
        .max(20)
        .trim()
        .pattern(/^TIJ[a-zA-Z0-9]+$/)
        .optional()
        .messages({
            'string.empty': 'El TIJ no puede estar vacío',
            'string.min': 'El TIJ debe tener al menos 1 caracter',
            'string.max': 'El TIJ no puede tener más de 20 caracteres',
            'string.pattern.base': 'El TIJ debe empezar con "TIJ" seguido de números/letras'
        }),

    impresoraID: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID de impresora debe ser un número',
            'number.integer': 'El ID de impresora debe ser un número entero',
            'number.positive': 'El ID de impresora debe ser mayor a 0'
        }),

    fecha: Joi.date()
        .optional()
        .messages({
            'date.base': 'La fecha debe tener un formato válido'
        })
});

// Esquema para validar parámetros de URL (ID)
export const consumibleParamsSchema = Joi.object({
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

// Esquema especial para validar parámetros de serie (para obtener consumibles por serie de impresora)
export const consumibleSerieParamsSchema = Joi.object({
    id: Joi.string()
        .min(1)
        .max(50)
        .trim()
        .pattern(/^[a-zA-Z0-9\-_]+$/)
        .required()
        .messages({
            'string.empty': 'La serie no puede estar vacía',
            'string.min': 'La serie debe tener al menos 1 caracter',
            'string.max': 'La serie no puede tener más de 50 caracteres',
            'string.pattern.base': 'La serie solo puede contener letras, números, guiones y guiones bajos',
            'any.required': 'La serie es obligatoria'
        })
});