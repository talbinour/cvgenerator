import React, { useState } from 'react';
import Chat from "../chatbot";
//import styles from '../Cv/model7.module.css'; // Assurez-vous d'avoir le fichier model5.module.css dans votre projet
import styles from './CVModel5.module.css'; // Assurez-vous d'avoir le fichier model5.module.css dans votre projet
import '@fortawesome/fontawesome-free/css/all.css';
import avatar from '../assets/cvprofile.jpeg';

function CVModel5() {
  const [ setCvContent] = useState(""); // État pour stocker le contenu du CV

  // Fonction pour mettre à jour le contenu du CV en fonction de la réponse de l'utilisateur
  const updateCvContent = (response) => {
    setCvContent(response); // Mettez à jour le contenu du CV avec la réponse de l'utilisateur
  };

  return (
    <div className={styles.pageWrapper} >
      <div className={styles.leftPanel}>
      <Chat updateCvContent={updateCvContent} /> 
      </div> 
      <div className={styles.rightPanel}>
      <div className={`${styles['print-area']} ${styles.resume}`}>
      <div className={styles.resume_left}>
        <div className={styles.resume_profile}>
          <img src={avatar} alt="Profile" />  
        </div>
        <div className={styles.resume_content}>
          <div className={`${styles.resume_item} ${styles.resume_info}`}>
            <div className={styles.title}>
              <p className={styles.bold}>stephen colbert</p>
              <p className={styles.regular}>Designer</p>
            </div>
            <ul>
              <li>
                <div className={styles.icon}>
                  <i className="fas fa-map-signs"></i>
                </div>
                <div className={styles.data}>
                  21 Street, Texas <br /> USA
                </div>
              </li>
              <li>
                <div className={styles.icon}>
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <div className={styles.data}>
                  +324 4445678
                </div>
              </li>
              <li>
                <div className={styles.icon}>
                  <i className="fas fa-envelope"></i>
                </div>
                <div className={styles.data}>
                  stephen@gmail.com
                </div>
              </li>
              <li>
                <div className={styles.icon}>
                  <i className="fab fa-weebly"></i>
                </div>
                <div className={styles.data}>
                  www.stephen.com
                </div>
              </li>
            </ul>
          </div>
          <div className={`${styles.resume_item} ${styles.resume_skills}`}>
            <div className={styles.title}>
              <p className={styles.bold}>skill&apos;s</p>
            </div>
            <ul>
              <li>
                <div className={styles.skill_name}>
                  HTML
                </div>
                <div className={styles.skill_progress}>
                  <span style={{ width: '80%' }}></span>
                </div>
                <div className={styles.skill_per}>80%</div>
              </li>
              <li>
                <div className={styles.skill_name}>
                  CSS
                </div>
                <div className={styles.skill_progress}>
                  <span style={{ width: '70%' }}></span>
                </div>
                <div className={styles.skill_per}>70%</div>
              </li>
              <li>
                <div className={styles.skill_name}>
                  SASS
                </div>
                <div className={styles.skill_progress}>
                  <span style={{ width: '90%' }}></span>
                </div>
                <div className={styles.skill_per}>90%</div>
              </li>
              <li>
                <div className={styles.skill_name}>
                  JS
                </div>
                <div className={styles.skill_progress}>
                  <span style={{ width: '60%' }}></span>
                </div>
                <div className={styles.skill_per}>60%</div>
              </li>
              <li>
                <div className={styles.skill_name}>
                  JQUERY
                </div>
                <div className={styles.skill_progress}>
                  <span style={{ width: '88%' }}></span>
                </div>
                <div className={styles.skill_per}>88%</div>
              </li>
            </ul>
          </div>
          <div className={`${styles.resume_item} ${styles.resume_social}`}>
            <div className={styles.title}>
              <p className={styles.bold}>Social</p>
            </div>
            <ul>
              <li>
                <div className={styles.icon}>
                  <i className="fab fa-facebook-square"></i>
                </div>
                <div className={styles.data}>
                  <p className={styles['semi-bold']}>Facebook</p>
                  <p>Stephen@facebook</p>
                </div>
              </li>
              <li>
                <div className={styles.icon}>
                  <i className="fab fa-instagram-square"></i>
                </div>
                <div className={styles.data}>
                  <p className={styles['semi-bold']}>Instagram</p>
                  <p>Stephen@Instagram</p>
                </div>
              </li>
              <li>
             <div className={styles.icon}>
               <i className="fab fa-twitter-square"></i>
             </div>
             <div className={styles.data}>
               <p className={styles['semi-bold']}>Twitter</p>
               <p>Stephen@twitter</p>
             </div>
           </li>
           <li>
             <div className={styles.icon}>
               <i className="fab fa-youtube"></i>
             </div>
             <div className={styles.data}>
               <p className={styles['semi-bold']}>Youtube</p>
               <p>Stephen@youtube</p>
             </div>
           </li>
           <li>
             <div className={styles.icon}>
               <i className="fab fa-linkedin"></i>
             </div>
             <div className={styles.data}>
               <p className={styles['semi-bold']}>Linkedin</p>
               <p>Stephen@linkedin</p>
             </div>
           </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.resume_right}>
        <div className={`${styles.resume_item} ${styles.resume_about}`}>
          <div className={styles.title}>
            <p className={styles.bold}>About us</p>
          </div>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perspiciatis illo fugit officiis distinctio culpa officia totam atque exercitationem inventore repudiandae?</p>
        </div>
        <div className={`${styles.resume_item} ${styles.resume_work}`}>
          <div className={styles.title}>
            <p className={styles.bold}>Work Experience</p>
          </div>
          <ul>
            <li>
              <div className={styles.date}>2013 - 2015</div>
              <div className={styles.info}>
                <p className={styles['semi-bold']}>Lorem ipsum dolor sit amet.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, voluptatibus!</p>
              </div>
            </li>
            <li>
              <div className={styles.date}>2015 - 2017</div>
              <div className={styles.info}>
                     <p className={styles['semi-bold']}>Lorem ipsum dolor sit amet.</p> 
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, voluptatibus!</p>
                </div>
            </li>
            <li>
              <div className={styles.date}>2017 - Present</div>
              <div className={styles.info}>
                     <p className={styles['semi-bold']}>Lorem ipsum dolor sit amet.</p> 
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, voluptatibus!</p>
                </div>
            </li>
          </ul>
        </div>
        <div className={`${styles.resume_item} ${styles.resume_education}`}>
          <div className={styles.title}>
            <p className={styles.bold}>Education</p>
          </div>
          <ul>
            <li>
              <div className={styles.date}>2010 - 2013</div>
              <div className={styles.info}>
                <p className={styles['semi-bold']}>Web Designing (Texas University)</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, voluptatibus!</p>
              </div>
            </li>
            <li>
              <div className={styles.date}>2000 - 2010</div>
              <div  className={styles.info}>
                     <p className={styles['semi-bold']}>Texas International School</p> 
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, voluptatibus!</p>
                </div>
            </li>
          </ul>
        </div>
        <div className={`${styles.resume_item} ${styles.resume_hobby}`}>
          <div className={styles.title}>
            <p className={styles.bold}>Hobby</p>
          </div>
          <ul>
            <li><i className="fas fa-book"></i></li>
            <li><i className="fas fa-gamepad"></i></li>
            <li><i className="fas fa-music"></i></li>
           <li><i className="fab fa-pagelines"></i></li>
          </ul>
        </div>
      </div>
      </div>
        </div>  
     
    </div>
  );
}

export default CVModel5;
