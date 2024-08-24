import React from 'react';
import { Box } from '@mui/material';

const StarRating = ({ rating }) => {
  const stars = Array(5).fill(false).map((_, index) => index < rating);

  return (
    <Box>
      {stars.map((filled, index) => (
        <span key={index} style={{ color: filled ? 'gold' : 'lightgray', fontSize: '20px' }}>
          &#9733; {/* Unicode character for star */}
        </span>
      ))}
    </Box>
  );
};

export default StarRating;
