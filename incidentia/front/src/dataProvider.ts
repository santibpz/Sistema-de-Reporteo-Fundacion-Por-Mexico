import simpleRestProvider from "ra-data-simple-rest";
import { fetchUtils } from 'ra-core';

const httpClient = fetchUtils.fetchJson

const apiUrl = import.meta.env.VITE_SIMPLE_REST_URL 


const baseDataProvider = simpleRestProvider(apiUrl);  

export const dataProvider = {
  ...baseDataProvider,
  getComentarios: (resource:string, params:{id:string}) => httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: json
  })),
  
}