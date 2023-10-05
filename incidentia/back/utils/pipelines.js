export const mainPipeline = [
    // stage 1: obtener las referencias a los objetos con valor "ObjectId" de categoria
    {$lookup: {
        from: 'categorias',
        localField: 'categoria',
        foreignField: '_id',
        as: 'categoria'
    }
    },
    // stage 2: obtener las referencias a los objetos con valor "ObjectId" de subcategoria
    {$lookup: {
        from: 'subcategorias',
        localField: 'subcategoria',
        foreignField: '_id',
        as: 'subcategoria'
    }
    },
    {$lookup: {
      from: 'comentarios',
      localField: 'comentarios',
      foreignField: '_id',
      as: 'comentarios'
    }},
    {$lookup: {
      from: 'coordinadores',
      localField: 'coordinador',
      foreignField: '_id',
      as: 'coordinador'
    }},
    {$unwind: "$coordinador"},
    // stage 3: proyectar la información que se enviará al cliente
    {$project: {
        id: "$_id",
        _id: 0,
        coordinador: "$coordinador.nombreCompleto",
        titulo: 1,
        descripcion: 1,
        categoria: {
            $getField: {                         
              field: 'nombre',
              input: { $arrayElemAt: [ "$categoria", 0 ] }
            }
          },
        subcategoria:{
            $getField: {
              field: 'nombre',
              input: { $arrayElemAt: [ "$subcategoria", 0 ] }
            }
          },
        estatus: 1,
        prioridad: 1,
        fecha: 1
    }}
]

// función para obtener la información de un reporte con id igual a objectId
export const findOnePipeline = objectId => [
        // stage 1: hacemos match del documento con id igual a objectId
        {$match: {_id: objectId}},
        ...mainPipeline
    ]

// función para obtener los comentarios tiene relacionados el id del reporte que se pasa como parámetro
export const comentariosPipeline = objectId => [
  // stage 1: hacemos match de los comentarios que corresponden al id del reporte que se recibe de los parámetros de la solicitud
  {$match: {reporte: objectId}},

  // stage 2: hacemos el lookup para obtener información del usuario que publicó el comentario
  {$lookup:  {
      from: 'coordinadores',
      localField: 'publicadoPor',
      foreignField: '_id',
      as: 'publicadoPor'
    }}, 

  // stage 3: deconstruimos el arreglo del field 'publicadoPor'
  {$unwind: "$publicadoPor"},

  // stage 4: proyectamos la información a enviar al cliente
  {$project: {
      id: "$_id",
      _id: 0,
      comentario: 1,
      fecha: 1,
      publicadoPor:"$publicadoPor.nombreCompleto"
  }}
]
