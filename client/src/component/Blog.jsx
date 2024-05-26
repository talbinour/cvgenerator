import React from 'react';
import styles from './Blog.module.css';

const blogPosts = [
  { title: "Comment créer un CV parfait ?", excerpt: "Découvrez nos astuces pour créer un CV qui se démarque." },
  { title: "Préparer un entretien d'embauche", excerpt: "Conseils pour réussir votre entretien d'embauche." },
  { title: "Les compétences les plus recherchées en 2024", excerpt: "Quelles compétences sont demandées cette année ?" },
];

const Blog = () => {
  return (
    <section className={styles.blog}>
      <h1 className={styles.h1Title}>Blog</h1>
      <div className={styles.blogList}>
        {blogPosts.map((post, index) => (
          <div key={index} className={styles.blogPost}>
            <h2 className={styles.blogTitle}>{post.title}</h2>
            <p className={styles.blogExcerpt}>{post.excerpt}</p>
            <button className={styles.readMoreButton}>Lire la suite</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blog;
