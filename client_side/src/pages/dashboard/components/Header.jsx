import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box pb="30px"
    sx={{color: theme.palette.mode === "light" ? colors.grey[100]: colors.greenAccent[400],
    }}
    >
      <Typography
        variant="h2"
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
