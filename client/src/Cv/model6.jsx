import React from 'react';
import styles from './model6.module.css'; // Assurez-vous d'avoir le fichier model5.module.css dans votre projet
import '@fortawesome/fontawesome-free/css/all.css';
import avatar from '../assets/cvprofile.jpeg';
import { Link } from 'react-router-dom'; // Importez Link depuis react-router-dom

function CvOrResume() {
  return (
    <div className={`${styles['print-area']} ${styles.resume}`}>
      
      <div className={styles.container}> 
        <div className={styles.left_Side}>
          <div className={styles.profileText}>
            <div className={styles.imgBx}>
              <img src={avatar} alt="Profile" />  
            </div>
            <h2>Emaan Bari<br /><span>Computer Scientist</span></h2>
          </div>
          <div className={styles.contactInfo}>
            <h3 className={styles.title}>INFORMATIONS DE CONTACT</h3>
            <ul>
              <li>
                <span className={styles.icon}><i className="fa fa-phone" aria-hidden="true"></i></span>
                <span className={styles.text}>0900 786 01</span>
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-envelope" aria-hidden="true"></i></span>
                <span className={styles.text}>emmi@gmail.com</span>
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-globe" aria-hidden="true"></i></span>
                <span className={styles.text}>mywebsite.com</span>
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-linkedin" aria-hidden="true"></i></span>
                <span className={styles.text}>www.linkedin.com</span>
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-map-marker" aria-hidden="true"></i></span>
                <span className={styles.text}>56th street, california</span>
              </li>
            </ul>
          </div>
          <div className={`${styles.contactInfo} ${styles.education}`}>
            <h3 className={styles.title}>ÉDUCATION</h3>
            <ul>
              <li>
                <h5>2017 - 2019</h5>
                <h4>Matric in Science</h4>
                <h4>School Name</h4>
              </li>
              <li>
                <h5>2019 - 2021</h5>
                <h4>Intermediate in Maths</h4>
                <h4>College Name</h4>
              </li>
              <li>
                <h5>2021 - Now</h5>
                <h4>Undergraduate in Computer Science</h4>
                <h4>University Name</h4>
              </li>
            </ul>
          </div>
          <div className={styles.contactInfo}>
            <h3 className={styles.title}>LANGUES</h3>
            <ul>
              <li>
                <span className={styles.text}>English</span>
                <div className={styles.percentContainer}>
                  <div className={styles.percentBar} style={{ width: '90%' }}></div>
                </div>
              </li>
              <li>
                <span className={styles.text}>Urdu</span>
                <div className={styles.percentContainer}>
                  <div className={styles.percentBar} style={{ width: '80%' }}></div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.right_Side}>
          <div className={styles.about}>
            <h2 className={styles.title2}>PROFIL</h2>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt,<br /> tenetur architecto omnis maxime delectus quae quo reprehenderit quas laudantium.Itaque sequi commodi vero suscipit reiciendis ea aspernatur cum.Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt,tenetur architecto omnis maxime delectus quae quo reprehenderit quas laudantium. <br />Itaque sequi commodi vero suscipit reiciendis ea aspernatur cum.</p>
          </div>
          <div className={styles.about}>
            <h2 className={styles.title2}>Experience</h2>
            <div className={styles.box}>
              <div className={styles.year_company}>
                <h5>2019 - 2021</h5>
                <h5>Company Name</h5>
              </div>
              <div className={styles.text}>
                <h4>Senior Web Developer</h4>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt, tenetur architecto omnis </p>
              </div>
            </div>
            <div className={styles.box}>
              <div className={styles.year_company}>
                <h5>2021 - present</h5>
                <h5>Company Name</h5>
              </div>
              <div className={styles.text}>
                <h4>Data Analyst</h4>
                <p>Lorem ipsum,dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt,tenetur architecto omnis </p>
              </div>
            </div>
          </div>
          <div className={`${styles.about} ${styles.skills}`}>
            <h2 className={styles.title2}>COMPÉTENCES PROFESSIONNELLES</h2>
            <div className={styles.box}>
              <h4>Html</h4>
              <div className={styles.percent}>
                <div style={{ width: '95%' }}></div>
              </div>
            </div>
            <div className={styles.box}>
              <h4>CSS</h4>
              <div className={styles.percent}>
                <div style={{ width: '70%' }}></div>
              </div>
            </div>
            <div className={styles.box}>
              <h4>JAVASCRIPT</h4>
              <div className={styles.percent}>
                <div style={{ width: '95%' }}></div>
              </div>
            </div>
            <div className={styles.box}>
              <h4>PYTHON</h4>
              <div className={styles.percent}>
                <div style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
          <div className={styles.AboutInterest}>
            <h2 className={styles.title2}>CENTRES D&lsquo;INTÉRÊT</h2>
            <ul>
              <li><i className="fa fa-bar-chart" aria-hidden="true"></i>Trading</li>
              <li><i className="fa fa-laptop" aria-hidden="true"></i>Developing</li>
              <li><i className="fa fa-gamepad" aria-hidden="true"></i>Gaming</li>
              <li><i className="fa fa-briefcase" aria-hidden="true"></i>Business</li>
            </ul>
          </div>
        </div>
        <div className={styles.editButton}>
          <Link to="/edit6-cv"><i className="fas fa-edit"></i></Link>
      </div>
      </div>
    </div>
  );
}

export default CvOrResume;
