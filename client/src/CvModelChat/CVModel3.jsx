import React, { useState } from 'react';
import Chat from "../chatbot";
//import styles from '../Cv/model7.module.css'; // Assurez-vous d'avoir le fichier model5.module.css dans votre projet
import styles from './CVModel3.module.css'; // Assurez-vous d'avoir le fichier model5.module.css dans votre projet
import '@fortawesome/fontawesome-free/css/all.css';
import avatar from '../assets/cvprofile.jpeg';
function CVModel3() {
  const [ setCvContent] = useState(""); // État pour stocker le contenu du CV

  // Fonction pour mettre à jour le contenu du CV en fonction de la réponse de l'utilisateur
  const updateCvContent = (response) => {
    setCvContent(response); // Mettez à jour le contenu du CV avec la réponse de l'utilisateur
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.leftPanel}>
      <Chat updateCvContent={updateCvContent} /> 
      </div>   
      <div className={styles.rightPanel}>
      <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.profileText}>
              <h3>Muhamad<br />Irshad<br /><span>Creative Designer</span></h3>
            </div>
            <div className={styles.imgBx}>
              <div className={styles.box}>
                <img src={avatar} alt="Profile" />
              </div>
            </div>
          </div>
          <div className={styles.contentBox}>
            <div className={styles.leftSide}>
              <h3>Contact Info</h3>
              <ul>
                <li>
                  <span className={styles.icon}><i className="fa fa-phone"></i></span>
                  <span className={styles.text}>+216 93 155 653</span>
                </li>
                <li>
                  <span className={styles.icon}><i className="fa fa-envelope"></i></span>
                  <span className={styles.text}>john_doe@email.Com</span>
                </li>
                <li>
                  <span className={styles.icon}><i className="fa fa-globe"></i></span>
                  <span className={styles.text}>www.mywebsite.com</span>
                </li>
                <li>
                  <span className={styles.icon}><i className="fa fa-map-marker"></i></span>
                  <span className={styles.text}>Patna , Binar ,India</span>
                </li>
              </ul>
              <h3>Education</h3>
              <ul className={styles.education}>
                <li>
                  <h5>2010 -2013</h5>
                  <h4>Master Degree in Computer Science</h4>
                  <h6>University Name</h6>
                </li>
                <li>
                  <h5>2007 -2010</h5>
                  <h4>Bachelor Degree in Computer Science</h4>
                  <h6>University Name</h6>
                </li>
                <li>
                  <h5>1997 -2007</h5>
                  <h4>Matriculation</h4>
                  <h6>University Name</h6>
                </li>
              </ul>
              <h3>Language</h3>
              <ul className={styles.language}>
                <li>
                  <span className={styles.text}>English</span>
                  <span className={styles.percent}>
                    <div style={{ width: '90%' }}></div>
                  </span>
                </li>
                <li>
                  <span className={styles.text}>Spanish</span>
                  <span className={styles.percent}>
                    <div style={{ width: '48%' }}></div>
                  </span>
                </li>
                <li>
                  <span className={styles.text}>Hindi</span>
                  <span className={styles.percent}>
                    <div style={{ width: '85%' }}></div>
                  </span>
                </li>
              </ul>
              <h3>Interest</h3>
              <ul className={styles.interest}>
                <li><span className={styles.icon}><i className="fa fa-gamepad"></i></span>Gaming</li>
                <li><span className={styles.icon}><i className="fa fa-microphone"></i></span>Singing</li>
                <li><span className={styles.icon}><i className="fa fa-book"></i></span>Reading</li>
                <li><span className={styles.icon}><i className="fa fa-cutlery"></i></span>Cooking</li>
              </ul>
            </div>
            <div className={styles.rightSide}>
              <div className={styles.about}>
                <h3>Profile</h3>
                <p>how to create cv in html css &amp; javascript | print button | how to create resume in html | am webtech
                  cv in html and css - how to create resume cv website using html and css || resume design || cv design.<br />
                  how to create visual cv using html and css. how to create resume by html and css, resume using html and css.
                  Hi Friends, In this video i w&apos;ll show you How to create Your CV With Print Button Using HTML CSS &amp; JavaScript</p>
              </div>
              <div className={styles.about}>
                <h3>Experiance</h3>
                <div className={styles.box}>
                  <div className={styles.year_company}>
                    <h5>2014-2016</h5>
                    <h5>Company Name</h5>
                  </div>
                  <div className={styles.text}>
                    <h4>Senior UX Designer</h4>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil sapiente, libero numquam quibusdam delectus ipsam inventore, facere possimus iure dolores corrupti! Explicabo aspernatur hic labore modi repellendus beatae pariatur maiores.
                    </p>
                  </div>
                </div>
                <div className={styles.box}>
                  <div className={styles.year_company}>
                    <h5>2016-2019</h5>
                    <h5>Company Name</h5>
                  </div>
                  <div className={styles.text}>
                    <h4>Senior UX Designer</h4>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil sapiente, libero numquam quibusdam delectus ipsam inventore, facere possimus iure dolores corrupti! Explicabo aspernatur hic labore modi repellendus beatae pariatur maiores.
                    </p>
                  </div>
                </div>
                <div className={styles.box}>
                  <div className={styles.year_company}>
                    <h5>2019-Present</h5>
                    <h5>Company Name</h5>
                  </div>
                  <div className={styles.text}>
                    <h4>Senior UX Designer</h4>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil sapiente, libero numquam quibusdam delectus ipsam inventore, facere possimus iure dolores corrupti! Explicabo aspernatur hic labore modi repellendus beatae pariatur maiores.
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.about_skills}>
                <h3>Professional Skills</h3>
                <div className={styles.box}>
                  <h4>Html</h4>
                  <span className={styles.percent}>
                  <div style={{ width: '95%' }}></div>
                  </span>
                </div>
                <div className={styles.box}>
                  <h4>CSS</h4>
                  <span className={styles.percent}>
                  <div style={{ width: '85%' }}></div>
                  </span>
                </div>
                <div className={styles.box}>
                  <h4>Javascript</h4>
                  <span className={styles.percent}>
                  <div style={{ width: '70%' }}></div>
                  </span>
                </div>
                <div className={styles.box}>
                  <h4>Photoshop</h4>
                  <span className={styles.percent}>
                  <div style={{ width: '90%' }}></div>
                  </span>
                </div>
                <div className={styles.box}>
                  <h4>Illustrator</h4>
                  <span className={styles.percent}>
                  <div style={{ width: '75%' }}></div>
                  </span>
                </div>
                <div className={styles.box}>
                  <h4>Adobe XD</h4>
                  <span className={styles.percent}>
                  <div style={{ width: '98%' }}></div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CVModel3;
