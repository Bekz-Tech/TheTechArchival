import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import lorena from '../../images/Lorena.jpg';
import karen from '../../images/karen.jpg';
import ben from '../../images/ben.jpg';
import { Container, Typography, Card, CardContent, styled } from '@mui/material';
import bgImage from '../../images/testimonial.jpeg';
import { ArrowForwardIos } from '@mui/icons-material';

const StyledContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  background: `url(${bgImage}) no-repeat center center`,
  backgroundSize: 'cover',
  padding: theme.spacing(5),
  minWidth: '100vw',
  height: 'auto',
  display: 'flex',
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
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 0,
    pointerEvents: 'none',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(1), // Adjusted padding
  boxShadow: theme.shadows[3],
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '300px', // Reduced height
  justifyContent: 'center',
  '& img': {
    width: '50%',
    height: '50%',
    borderRadius: '50%',
    marginBottom: theme.spacing(1),
  },
}));

const ArrowIndicator = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: '5vh',
  right: '5vw',
  color: '#fff',
  borderRadius: '50%',
  padding: theme.spacing(1),
  cursor: 'pointer',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px', // Reduced font size
  animation: 'bounce 2s infinite',
  '@keyframes bounce': {
    '0%, 20%, 50%, 80%, 100%': {
      transform: 'translateX(0)',
    },
    '40%': {
      transform: 'translateX(-15px)',
    },
    '60%': {
      transform: 'translateX(-7px)',
    },
  },
  [theme.breakpoints.down('sm')]: {
    right: '5vw',
    bottom: '8vh', // Adjusted bottom position
  },
  [theme.breakpoints.down('xs')]: {
    right: '3vw',
    bottom: '10vh', // Further adjusted for extra small screens
    fontSize: '14px', // Further reduced font size for extra small screens
  },
}));

const Testimonials = () => {
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth <= 480) {
        setSlidesPerView(1);
      } else if (window.innerWidth <= 768) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    window.addEventListener('resize', updateSlidesPerView);
    updateSlidesPerView();

    return () => {
      window.removeEventListener('resize', updateSlidesPerView);
    };
  }, []);

  return (
    <StyledContainer id='services'>
      <Typography
        variant='h3'
        sx={{
          color: 'white',
          fontWeight: '700',
          paddingBottom:'20px',
          textAlign: 'justify', // Adjusted padding
          zIndex: '10',
          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2.5rem' }, // Responsive font size
        }}
      >
        What people say about us
      </Typography>
      <Swiper
        spaceBetween={30}
        slidesPerView={slidesPerView}
        style={{ width:'100%', maxWidth: '90%', marginBottom:'60px' }}
      >
        <SwiperSlide style={{ display: 'flex', justifyContent: 'center' }}>
          <StyledCard>
            <img src={ben} alt='Ben Kyle' />
            <CardContent>
              <Typography variant='h5' sx={{ fontSize: '1rem' }}>Ben Kyle</Typography>
              <Typography variant='body1' sx={{ fontSize: '0.9rem' }}>
                "Babtech transformed my career with their courses, equipping me with in-demand tech skills for today's market."
              </Typography>
            </CardContent>
          </StyledCard>
        </SwiperSlide>
        <SwiperSlide style={{ display: 'flex', justifyContent: 'center' }}>
          <StyledCard>
            <img src={karen} alt='Karen Zeni' />
            <CardContent>
              <Typography variant='h5' sx={{ fontSize: '1rem' }}>Karen Zeni</Typography>
              <Typography variant='body1' sx={{ fontSize: '0.9rem' }}>
                "Exceptional instructors, and a supportive community at Babtech made learning tech enjoyable and rewarding."
              </Typography>
            </CardContent>
          </StyledCard>
        </SwiperSlide>
        <SwiperSlide style={{ display: 'flex', justifyContent: 'center' }}>
          <StyledCard>
            <img src={lorena} alt='Lorena' />
            <CardContent>
              <Typography variant='h5' sx={{ fontSize: '1rem' }}>Lorena</Typography>
              <Typography variant='body1' sx={{ fontSize: '0.9rem' }}>
                "Babtech's hands-on approach and curriculum helped me land my dream job in the tech industry with confidence."
              </Typography>
            </CardContent>
          </StyledCard>
        </SwiperSlide>
      </Swiper>

      {/* Adjusted Arrow Indicator Position */}
      <ArrowIndicator>
        <Typography background='none'>Swipe left</Typography>
        <ArrowForwardIos />
      </ArrowIndicator>
    </StyledContainer>
  );
};

export default Testimonials;
