import React from 'react';
import { AppBar, TitlePortal } from 'react-admin';
import image from '../images/FXM_AB_SF.png';
import { Box, FormControl, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { styled } from '@mui/system';
import Tooltip from '@mui/material/Tooltip';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import InvertColorsOffIcon from '@mui/icons-material/InvertColorsOff';
import { useDisableColors } from './DisableColorContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#69B035' : '#1C8D41',
    color: 'white',
}));

export const MyAppBar = () => {
    const { disableColors, toggleDisableColors } = useDisableColors();

    return (
        <StyledAppBar>
            <img src={image} alt="logo" style={{ height: 35, padding: '0.5 rem', marginRight: '10rem'}} />
            <Box flex="1" />
            <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                    <Tooltip title="Colores" placement="top">
                        <FormControlLabel
                            value="start"
                            control={
                                disableColors ? <InvertColorsOffIcon /> : <InvertColorsIcon />
                            }
                            onClick={toggleDisableColors}
                            labelPlacement="start"
                        />
                    </Tooltip>
                </FormGroup>
            </FormControl>
            <Box style={{ marginRight: '1rem' }} />
        </StyledAppBar>
    );
};
