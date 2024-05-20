import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography, Link, Container, Card, CardContent } from '@mui/material';
import 'flag-icon-css/css/flag-icons.min.css';
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
        setTests(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    }

    fetchData();
  }, []);

  const getCountryCode = (test) => {
    if (test.countryCode) {
      return test.countryCode.toLowerCase();
    } else if (test.marker) {
      // Assumons que les codes de pays sont de 2 lettres
      const match = test.marker.match(/\b[A-Z]{2}\b/);
      if (match) {
        return match[0].toLowerCase();
      }
    }
    return null;
  };

  return (
    <Container className={styles.container}>
      <Typography variant="h4" className={styles.title}>Liste des tests de langue</Typography>
      <Grid container spacing={3} className={styles.grid}>
        {tests.map((test, index) => {
          const countryCode = getCountryCode(test);
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card className={styles.card}>
                {countryCode ? (
                  <div className={`flag-icon flag-icon-${countryCode} ${styles.flag}`} />
                ) : (
                  <div className={styles.noFlag}>Pas de drapeau</div>
                )}
                <CardContent>
                  <Typography variant="h6" component="div" className={styles.marker}>
                    {test.marker}
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
          );
        })}
      </Grid>
    </Container>
  );
}

export default Skills;
