import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import lorena from '../../images/Lorena.jpg';
import karen from '../../images/karen.jpg';
import ben from '../../images/ben.jpg';
import { Container, Typography, Card, CardContent, styled } from '@mui/material';
import bgImage from '../../images/testimonial.jpeg'; // Ensure the correct path to your background image
import { ArrowForwardIos } from '@mui/icons-material'; // Import the arrow icon

const StyledContainer = styled(Container)(({ theme }) => ({
  position: 'relative', // Required for positioning the pseudo-element
  background: `url(${bgImage}) no-repeat center center`,
  backgroundSize: 'cover',
  padding: theme.spacing(5),
  minWidth: '100vw',
  height: '100vh',
  display: 'flex',
  cursor: 'pointer',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)', // Dark overlay with 50% opacity
    zIndex: 0, // Ensure the overlay is below the content but above the background image
    pointerEvents: 'none', // Allow interaction with content
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  boxShadow: theme.shadows[3],
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '370px',
  justifyContent: "center",
  '& img': {
    width: '50%',
    height: "50%",
    borderRadius: '50%',
    marginBottom: theme.spacing(0),
  },
}));

const ArrowIndicator = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: '5vh',
  right: '10vw',
  // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  borderRadius: '50%',
  padding: theme.spacing(1),
  cursor: 'pointer',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  animation: 'bounce 2s infinite',

  '@keyframes bounce': {
    '0%, 20%, 50%, 80%, 100%': {
      transform: 'translateX(0)',
    },
    '40%': {
      transform: 'translateX(-30px)',
    },
    '60%': {
      transform: 'translateX(-15px)',
    },
  },
}));

const Testimonials = () => {
  return (
    <StyledContainer id='services'>
      <Typography variant='h3' sx={{ color: 'white', fontWeight: '700', paddingBottom: "50px", zIndex: "10"}} >
        What people say about us
      </Typography>
      <Swiper
        spaceBetween={30}
        slidesPerView={3}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        style={{ width: '100%', maxWidth: '90%' }} // Limit max-width for Swiper
      >
        <SwiperSlide style={{ padding: '0 10px' }}>
          <StyledCard>
            <img src={ben} alt='Ben Kyle' />
            <CardContent>
              <Typography variant='h5'>Ben Kyle</Typography>
              <Typography variant='body1'>
                "Babtech transformed my career with their courses, equipping me with in-demand tech skills for today's market."
              </Typography>
            </CardContent>
          </StyledCard>
        </SwiperSlide>
        <SwiperSlide style={{ padding: '0 10px' }}>
          <StyledCard>
            <img src={karen} alt='Karen Zeni' />
            <CardContent>
              <Typography variant='h5'>Karen Zeni</Typography>
              <Typography variant='body1'>
                "Exceptional instructors, and a supportive community at Babtech made learning tech enjoyable and rewarding."
              </Typography>
            </CardContent>
          </StyledCard>
        </SwiperSlide>
        <SwiperSlide style={{ padding: '0 10px' }}>
          <StyledCard>
            <img src={lorena} alt='Lorena' />
            <CardContent>
              <Typography variant='h5'>Lorena</Typography>
              <Typography variant='body1'>
                "Babtech's hands-on approach and curriculum helped me land my dream job in the tech industry with confidence."
              </Typography>
            </CardContent>
          </StyledCard>
        </SwiperSlide>
        <SwiperSlide style={{ padding: '0 10px' }}>
          <StyledCard>
            <img src={ben} alt='Ben Kyle' />
            <CardContent>
              <Typography variant='h5'>Ben Kyle</Typography>
              <Typography variant='body1'>
                "Babtech transformed my career with their courses, equipping me with in-demand tech skills for today's market."
              </Typography>
            </CardContent>
          </StyledCard>
        </SwiperSlide>
        <SwiperSlide style={{ padding: '0 15px' }}>
          <StyledCard>
            <img src={karen} alt='Karen Zeni' />
            <CardContent>
              <Typography variant='h5'>Karen Zeni</Typography>
              <Typography variant='body1'>
                "Exceptional instructors, and a supportive community at Babtech made learning tech enjoyable and rewarding."
              </Typography>
            </CardContent>
          </StyledCard>
        </SwiperSlide>
        <SwiperSlide style={{ padding: '0 15px' }}>
          <StyledCard>
            <img src={lorena} alt='Lorena' />
            <CardContent>
              <Typography variant='h5'>Lorena</Typography>
              <Typography variant='body1'>
                "Babtech's hands-on approach and curriculum helped me land my dream job in the tech industry with confidence."
              </Typography>
            </CardContent>
          </StyledCard>
        </SwiperSlide>
      </Swiper>

      <ArrowIndicator>
      <Typography background= "none">Swipe screen left</Typography>
        <ArrowForwardIos />
      </ArrowIndicator>
    </StyledContainer>
  );
};

export default Testimonials;
