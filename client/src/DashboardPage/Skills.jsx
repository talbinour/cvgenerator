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
        return 'us'; // Utilisation de 'us' pour le drapeau des États-Unis
      case 'ES':
        return 'es'; // Utilisation de 'es' pour le drapeau de l'Espagne
      case 'PT':
        return 'pt'; // Utilisation de 'pt' pour le drapeau du Portugal
      default:
        return 'fr'; // Utilisation de 'fr' pour les autres descriptions (drapeau de la France)
    }
  };

  return (
    <Container className={styles.container}>
      <Typography variant="h4" className={styles.title}>Liste des tests de langue</Typography>
      <Grid container spacing={3} className={styles.grid}>
        {tests.map((test, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={styles.card}>
              <CardMedia
                component="img"
                height="140"
                image={`/flags/${test.countryCode}.png`}
                alt={`Drapeau de ${test.marker}`}
                onError={(e) => { e.target.onerror = null; e.target.src = '/flags/default.png'; }} // Afficher une image par défaut en cas d'erreur
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
