// Middleware reutilizable para validar cualquier esquema
export const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        // Decidir qué parte del request validar (body, params, query)
        const dataToValidate = req[property];
        
        // Ejecutar validación con Joi
        const { error, value } = schema.validate(dataToValidate, {
            abortEarly: false,     // Mostrar TODOS los errores, no solo el primero
            stripUnknown: true     // Quitar campos que no están en el esquema
        });

        if (error) {
            // Si hay errores, formatear respuesta y rechazar
            const errorDetails = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context.value
            }));

            return res.status(400).json({
                success: false,
                message: 'Datos de entrada inválidos',
                errors: errorDetails
            });
        }

        // Si no hay errores, reemplazar los datos originales con los validados
        req[property] = value;
        next(); // Continuar al siguiente middleware o controlador
    };
};

// Middleware específico para validar parámetros
export const validateParams = (schema) => validate(schema, 'params');

// Middleware específico para validar body
export const validateBody = (schema) => validate(schema, 'body');

// Middleware específico para validar query parameters
export const validateQuery = (schema) => validate(schema, 'query');