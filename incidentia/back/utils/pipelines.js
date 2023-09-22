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
    // stage 3: proyectar la información que se enviará al cliente
    {$project: {
        id: "$_id",
        _id: 0,
        titulo: 1,
        descripcion: 1,
        categoria: {
            $getField: {                         
              field: 'nombre',
              input: { $arrayElemAt: [ "$categoria", 0 ] }
            }
          } ,
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

// function that specifies the pipelien
export const findOnePipeline = objectId => [
        // stage 1: match the document whose id is the argument 'id'
        {$match: {_id: objectId}},
        ...mainPipeline
    ]
