import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Link, Container } from '@mui/material';
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
        setTests(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <Container className={styles.container}>
      <Typography variant="h4" className={styles.title}>Liste des tests de langue</Typography>
      <List className={styles.list}>
        {tests.map((test, index) => (
          <ListItem key={index} className={styles.listItem}>
            <ListItemText
              primary={`Marker: ${test.marker}`}
              secondary={`Description: ${test.description}`}
            />
            <Link href={test.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
              Lien
            </Link>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Skills;
