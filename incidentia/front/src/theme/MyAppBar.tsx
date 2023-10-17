import { AppBar, TitlePortal } from 'react-admin';
import image from '../images/FXM_B_sinFondo.png';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#69B035' : '#1C8D41',
}));

export const MyAppBar = () => {
        return (
        <StyledAppBar>
            <Box flex="2" />
            <img src={image} alt="logo" style={{ height: 60, padding: '0.5 rem', marginLeft:'-8.125rem'}} />
            <Box flex="1" />
        </StyledAppBar>
  );
};