import simpleRestProvider from "ra-data-simple-rest";
import { fetchUtils } from 'ra-core';

const httpClient = fetchUtils.fetchJson

const apiUrl = import.meta.env.VITE_SIMPLE_REST_URL 



const fetchJsonUtil = (url: any, options:any={}) => {
  if (!options.headers) { 
      options.headers = new Headers({ Accept: 'application/json' });
  }
  // add your own headers here
  options.headers.set('Authorization', localStorage.getItem('auth'));
  return fetchUtils.fetchJson(url, options);
}

const baseDataProvider = simpleRestProvider(apiUrl, fetchJsonUtil);  

export const dataProvider = {
  ...baseDataProvider,
  getComentarios: (resource:string, params:{id:string}) => fetchJsonUtil(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: json
  })),
  // CSFM 04/10/23 - integracion de datos por get - start
  getChart: (resource:string) => fetchJsonUtil(`${apiUrl}/${resource}`).then(({ json }) => ({
    data: json
})),
// CSFM 04/10/23 - integracion de datos por get - end

}