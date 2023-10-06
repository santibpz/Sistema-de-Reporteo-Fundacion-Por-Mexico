import {useState, useEffect} from 'react'
import { RadioButtonGroupInput, SelectInput, SimpleForm, TextInput, useDataProvider } from "react-admin";
import { Categoria, Subcategoria } from '../types';

const ReporteForm = () => {
    // definir el dataProvider
    const dataProvider = useDataProvider()

    // crear el estado para la categoria seleccionada
    const [categoriaId, setCategoriaId] = useState<string>('')

    // crear estados para las categorias y subcategorias
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([])

    // obtener las categorias de la base de datos
    useEffect(() => {
        dataProvider.getList('categorias', {pagination: {page: 0, perPage: 0}, filter: {}, sort: {field: '', order: ''}})
            .then(({data}) => setCategorias(data))
            .catch(err => console.log(err))
    }, [dataProvider])

    // obtener las subcategorias de la base de datos dependiendo de la categoria seleccionada
    useEffect(() => {
        const fetchSubcategorias = async () => {

            const baseUrl = 'http://127.0.0.1:8081'
            categoriaId ? await fetch(`${baseUrl}/subcategorias/${categoriaId}`)
             .then(data => data.json())
             .then(data => setSubcategorias(data))
             .catch(err => console.log(err)) 
             : null
        }
        fetchSubcategorias()
    }, [categoriaId])


    // regresar el formulario
    return(
        <SimpleForm >   
            <TextInput source="titulo" required />
            <TextInput source="descripcion" required />
            <RadioButtonGroupInput source="prioridad" choices={[
                { id: 'alta', name: 'alta' },
                { id: 'media', name: 'media' },
                { id: 'baja', name: 'baja' },
             ]} required />
            <SelectInput 
              onChange={(e) => setCategoriaId(e.target.value)}
              source = "categoria" 
              choices = {categorias}
              optionText="nombre"
              optionValue="id"
              required/>  
              <SelectInput 
              source = "subcategoria" 
              choices = {subcategorias}
              optionText="nombre"
              optionValue="id"
              required
                />
        </SimpleForm>
    )
}

export default ReporteForm