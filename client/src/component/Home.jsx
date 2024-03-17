import React, { useState, useEffect } from "react";
import styles from './Home.module.css';

const Home = () => {
  const [cvList, setCVList] = useState([]);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await fetch('http://localhost:8080/getCVs');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCVList(data);
      } catch (error) {
        console.error("Failed to fetch CVs:", error);
      }
    };

    fetchCVs();
  }, []);

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 style={{ color: '#132043' }}>Créez votre CV professionnel</h1>
        <p>Remplissez le formulaire, choisissez un modèle et téléchargez votre CV en quelques minutes.</p>
        <button className={styles.createButton} style={{ backgroundColor: '#F1B4BB', color: '#FDF0F0' }}>Créer un CV</button>
      </section>

      <section className={styles.models}>
        <h2 style={{ color: '#132043' }}>Modèles de CV</h2>
        <div className={styles.cvListHorizontal}>
          {cvList.map((cv) => (
            <div key={cv._id} className={styles.cvItem}>
              <img src={cv.imageURL} alt={cv.title} className={styles.cvImage} />
              <p className={styles.cvTitle}>{cv.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.howItWorks}>
        <h2 style={{ color: '#132043' }}>Comment ça marche ?</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span>1</span>
            <p>Remplissez vos infos</p>
          </div>
          <div className={styles.step}>
            <span>2</span>
            <p>Choisissez un modèle</p>
          </div>
          <div className={styles.step}>
            <span>3</span>
            <p>Télécharger le CV</p>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2 style={{ color: '#132043' }}>Fonctionnalités</h2>
        <div className={styles.featureList}>
          <div className={styles.featureItem}>
            <i className="fa fa-file-text-o"></i>
            <p style={{ color: '#1F4172' }}>Créez de manière illimitée de nouveaux CV et modifiez-les à tout moment.</p>
          </div>
          {/* Ajoutez d'autres fonctionnalités ici */}
        </div>
      </section>

      <section className={styles.testimonials}>
        <h2 style={{ color: '#132043' }}>Évaluations</h2>
        <div className={styles.testimonialList}>
          {/* Exemple de témoignage */}
          <div className={styles.testimonialItem} style={{ backgroundColor: '#F1B4BB' }}>
            <p>4,4 / 5</p>
            <blockquote>
              &quot;Une solution simple pour préparer un bon CV de manière professionnelle. Ont recommandé aux amis et à la famille!&quot;
            </blockquote>
            <cite>Jérôme - Chef de projet</cite>
          </div>
          {/* Ajoutez d'autres témoignages ici */}
        </div>
      </section>

      <section className={styles.faqs}>
        <h2 style={{ color: '#132043' }}>Foire aux questions</h2>
        <div className={styles.faqList}>
          {/* Exemple de question/réponse */}
          <div className={styles.faqItem}>
            <h3 style={{ color: '#1F4172' }}>Qu&apos;est-ce qu&apos;un CV ?</h3>
            <p>Un CV est un document qui résume votre expérience professionnelle, vos compétences et vos qualifications.</p>
          </div>
          {/* Ajoutez d'autres questions/réponses ici */}
        </div>
      </section>

      <footer className={styles.footer}>
        <p >Vous avez des questions sur notre site Web ? Consultez notre FAQ</p>
        <button className={styles.downloadButton}>Faire un CV en ligne</button>
      </footer>
    </div>
  );
};

export default Home;
