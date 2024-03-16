// Importez votre fichier CSS
import styles from './model.module.css';
import React from 'react';
import avatar from '../assets/profile.png';
import '@fortawesome/fontawesome-free/css/all.css';

function Model() {
  return (
    <>
      <div className={styles['print-area']}>
        <div className={styles.header}>
          <img src={avatar} alt="Profile" />
          <div className={styles['header-text']}>
            <h1>Isra Nasri</h1>
            <p>Graphic & Web Designer</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles['left-area']}>
            <div className={styles.contact}>
              <h4>CONTACT</h4>
              <h5>Phone</h5>
              <p>93-155-653</p>
              <h5>Email</h5>
              <p>isra.nasri2001@gmail.com</p>
              <h5>Home</h5>
              <p>AZZZERTYUIOL</p>
            </div>
            <div className={styles.skills}>
              <h1>skills</h1>
              <div className={styles.bars}>
                <div className={styles.bar}>
                  <p>Photoshop</p>
                  <span></span>
                </div>
                <div className={styles.bar}>
                  <p>Photoshop</p>
                  <span></span>
                </div>
                <div className={styles.bar}>
                  <p>HTMl/CSS</p>
                  <span></span>
                </div>
                <div className={styles.bar}>
                  <p>JavaScript</p>
                  <span></span>
                </div>
                <div className={styles.bar}>
                  <p>php</p>
                  <span></span>
                </div>
                <div className={styles.bar}>
                  <p>SQL</p>
                  <span></span>
                </div>
                <div className={styles.bar}>
                  <p>C++</p>
                  <span></span>
                </div>
              </div>
            </div>
            <div className={styles.languages}>
              <h1>Languages</h1>
              <ul>
                <li>
                  <strong>French:</strong> Fluent
                </li>
                <li>
                  <strong>English:</strong> Advanced
                </li>
                {/* Ajoutez d'autres langues si nécessaire */}
              </ul>
            </div>

            <div className={styles.follow}>
              <h1>FOLLOW ME</h1>
              <h4>Facebook</h4>
              <p>facebook.com/username</p>
              <h4>Instagram</h4>
              <p>Instagram.com/username</p>
              <h4>Twitter</h4>
              <p>Twitter.com/username</p>
              <h4>Youtube</h4>
              <p>Youtube.com/username</p>
            </div>
          </div>
          <div className={styles['right-area']}>
            <div className={styles.about}>
              <h1><span><i className="far fa-user"></i></span>ABOUT ME</h1>
              <p>how to create cv in html css &amp; javascript | print button | how to create resume in html | am webtech
                cv in html and css - how to create resume cv website using html and css || resume design || cv design.
                how to create visual cv using html and css. how to create resume by html and css, resume using html and css.
                Hi Friends, In this video i w&apos;ll show you How to create Your CV With Print Button Using HTML CSS &amp; JavaScript</p>
            </div>
            <div className={styles.work}>
              <h1><span><i className="fas fa-suitcase-rolling"></i></span> WORK EXPERINCE</h1>
              <div className={styles['work-group']}>
                <h3>LEAD WEB DESIGNER</h3>
                <h4>ETC College America</h4>
                <span>2014/2016</span>
                <p>how to create cv in html css &amp; javascript | print button | how to create resume in html | am webtech
                  cv in html and css - how to create resume cv website using html and css || resume design || cv design.
                  how to create visual cv using html and css. how to create resume by html and css, resume using html and css.
                  Hi Friends, In this video i w&apos;ll show you How to create Your CV With Print Button Using HTML CSS &amp; JavaScript</p>
              </div>
              <div className={styles['work-group']}>
                <h3>SENIOR WEB DESIGNER</h3>
                <h4>ETC College </h4>
                <span>2014/2016</span>
                <p>how to create cv in html css &amp; javascript | print button | how to create resume in html | am webtech
                  cv in html and css - how to create resume cv website using html and css || resume design || cv design.
                  how to create visual cv using html and css. how to create resume by html and css, resume using html and css.
                  Hi Friends, In this video i w&apos;ll show you How to create Your CV With Print Button Using HTML CSS &amp; JavaScript</p>
              </div>
              <div className={styles['work-group']}>
                <h3>UI/UX DESIGNER</h3>
                <h4>ETC College </h4>
                <span>2011/Present</span>
                <p>how to create cv in html css &amp; javascript | print button | how to create resume in html | am webtech
                  cv in html and css - how to create resume cv website using html and css || resume design || cv design.
                  how to create visual cv using html and css. how to create resume by html and css, resume using html and css.
                  Hi Friends, In this video i w&apos;ll show you How to create Your CV With Print Button Using HTML CSS &amp; JavaScript</p>
              </div>
            </div>
            <div className={styles.education}>
              <h1><span><i className="fas fa-book"></i></span>EDUCATION</h1>
              <div className={styles['edu-group']}>
                <h4>BABSON COLLEGE FRANKLIME W.OLTIN <br/>
                  GRADUATION SCHOOL OF BUSINESS</h4>
                <span>1992/1995</span>
                <p>MBA,Enterpreneurship Finance</p>
              </div>
              <div className={styles['edu-group']}>
                <h4>NORTHERN UNIVERST </h4>
                <span>1983/1988</span>
                <p>BS,College of Computer Science</p>
              </div>
              <div className={styles['edu-group']}>
                <h4>ST JOSPEH REGIONAL</h4>
                <span>1980/1983</span>
                <p>Computer Science</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Model;
