const app  = require('../app.js')

test('Test de creacion de reporte', async () => {
    const response = await request(app)
        .post('/reportes')
        .send({
        "nombre": "Reporte de prueba",
        "descripcion": "Reporte de prueba",
        "categoria": "Reporte de prueba",
        "subcategoria": "Reporte de prueba",
        "estatus": "pendiente",
        "fecha": new Date(),
        });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('nombre');
    expect(response.body).toHaveProperty('descripcion');
    expect(response.body).toHaveProperty('categoria');
    expect(response.body).toHaveProperty('subcategoria');
    expect(response.body).toHaveProperty('estatus');
    expect(response.body).toHaveProperty('fecha');
    });