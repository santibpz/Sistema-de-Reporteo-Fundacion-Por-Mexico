import { List, Datagrid, TextField } from 'react-admin';

export const CoordinadoresList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="nombreCompleto" />
            <TextField source="matricula" />
            <TextField source="rol" />
        </Datagrid>
    </List>
);