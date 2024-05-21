import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography, Link, Container, Card, CardContent, CardMedia } from '@mui/material';
import styles from './Skills.module.css';

const Skills = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:8080/api/tests-langue');
        if (response.status !== 200) {
          throw new Error('Erreur lors de la récupération des données');
        }
        console.log(response.data); // Ajouté pour déboguer
        const updatedTests = response.data.map(test => ({
          ...test,
          countryCode: getCountryCode(test)
        }));
        setTests(updatedTests);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    }

    fetchData();
  }, []);

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
    <Container className={styles.container}>
      <Typography variant="h4" className={styles.title}>Liste des tests de langue</Typography>
      <Grid container spacing={2} className={styles.grid}>
        {tests.map((test, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={styles.card}>
              <CardMedia
                component="img"
                image={`/flags/${test.countryCode}.png`}
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
    </Container>
  );
}

export default Skills;
