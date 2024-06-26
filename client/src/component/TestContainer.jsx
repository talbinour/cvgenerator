import React from 'react';
import { Grid, Typography, Link, Card, CardContent, CardMedia } from '@mui/material';
import PropTypes from 'prop-types';
import styles from './TestContainer.module.css';

const TestContainer = ({ tests }) => {
  const getCountryCode = (test) => {
    switch (test.description) {
      case 'EN':
        return 'us';
      case 'ES':
        return 'es';
      case 'PT':
        return 'pt';
      default:
        return 'fr';
    }
  };

  return (
    <div className={styles.container}>
      <Grid container spacing={2} className={styles.grid}>
        {tests.map((test, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={styles.card}>
              <CardMedia
                component="img"
                image={`/flags/${getCountryCode(test)}.png`}
                alt={`Drapeau de ${test.marker}`}
                className={styles.flagImage}
                onError={(e) => { e.target.onerror = null; e.target.src = '/flags/default.png'; }}
              />
              <CardContent>
                <Typography variant="h6" component="div" className={styles.marker}>
                  {test.marker || 'Test de langue'}
                </Typography>
                <Typography variant="body2" color="textSecondary" className={styles.description}>
                  {test.description}
                </Typography>
                <Link href={test.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Lien vers le test
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

TestContainer.propTypes = {
  tests: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      marker: PropTypes.string,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TestContainer;
