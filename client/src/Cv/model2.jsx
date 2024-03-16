// Importez votre fichier CSS
import styles from './model2.module.css';
import React from 'react';
import avatar from '../assets/profile.png';
import '@fortawesome/fontawesome-free/css/all.css';

function Model() {
  return (
    <>
      <div className={styles['print-area']}>
        <div className={styles.container}>
          <div className={styles.left_Side}>
            <div className={styles.profilText}>
              <div className={styles.imgBx}>
                <img src={avatar} alt="Profile" />
              </div>
              <h2>Nasri Isra <br/><span>Web Developer</span></h2>
            </div>

            <div className={styles.contactInfo}>
              <h3 className={styles.title}>Contact Info</h3>
              <ul>
                <li>
                  <span className={styles.icon}><i className="fa fa-phone"></i></span>
                  <span className={styles.text}>+216 93 155 653</span>
                </li>
              </ul>
              <ul>
                <li>
                  <span className={styles.icon}><i className="fa fa-envelope"></i></span>
                  <span className={styles.text}>john_doe@gmail.com</span>
                </li>
              </ul>
              <ul>
                <li>
                  <span className={styles.icon}><i className="fa fa-globe"></i></span>
                  <span className={styles.text}>www.mywebsite.com</span>
                </li>
              </ul>
              <ul>
                <li>
                  <span className={styles.icon}><i className="fa fa-linkedin"></i></span>
                  <span className={styles.text}>www.linkedin.com/me</span>
                </li>
              </ul>
              <ul>
                <li>
                  <span className={styles.icon}><i className="fa fa-map-marker"></i></span>
                  <span className={styles.text}>patna,bihar,india</span>
                </li>
              </ul>
            </div>

            <div className={`${styles.contactInfo} ${styles.education}`}>
              <h3 className={styles.title}>Education</h3>
              <ul>
                <li>
                  <h5>2010-2013</h5>
                  <h4>Master Degree Computer Science</h4>
                  <h4>University Name</h4>
                </li>
                <li>
                  <h5>2007-2010</h5>
                  <h4>Bachelor Degree Computer Science</h4>
                  <h4>University Name</h4>
                </li>
                <li>
                  <h5>2997-2007</h5>
                  <h4>Matriculation</h4>
                  <h4>University Name</h4>
                </li>
              </ul>
            </div>

            <div className={`${styles.contactInfo} ${styles.languages}`}>
              <h3 className={styles.title}>Languages</h3>
              <ul>
                <li>
                  <span className={styles.text}>English</span>
                  <span className={styles.percent}>
                    <div style={{ width: '90%' }}></div>
                  </span>
                </li>
                <li>
                  <span className={styles.text}>Spanish</span>
                  <span className={styles.percent}>
                    <div style={{ width: '45%' }}></div>
                  </span>
                </li>
                <li>
                  <span className={styles.text}>Hindi</span>
                  <span className={styles.percent}>
                    <div style={{ width: '85%' }}></div>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.right_Side}>
            <div className={styles.about}>
              <h2 className={styles.title2}>Profile</h2>
              <p>how to create cv in html css &amp; javascript | print button | how to create resume in html | am webtech
                cv in html and css - how to create resume cv website using html and css || resume design || cv design.
                how to create visual cv using html and css. how to create resume by html and css, resume using html and css.
                Hi Friends, In this video i w&apos;ll show you How to create Your CV With Print Button Using HTML CSS &amp; JavaScript</p>
            </div>
            <div className={styles.about}>
              <h2 className={styles.title2}>Experience</h2>
              <div className={styles.box}>
                <div className={styles.year_company}>
                  <h5>2019-Present</h5>
                  <h5>Company Name</h5>
                </div>
                <div className={styles.text}>
                  <h4>Senior UX Designer</h4>
                  <p>how to create cv in html css &amp; javascript | print button | how to create resume in html | am webtech
                    cv in html and css - how to create resume cv website using html and css || resume design || cv design.</p>
                </div>
              </div>
              <div className={styles.box}>
                <div className={styles.year_company}>
                  <h5>2016-2019</h5>
                  <h5>Company Name</h5>
                </div>
                <div className={styles.text}>
                  <h4> UX/UI Designer</h4>
                  <p>how to create cv in html css &amp; javascript | print button | how to create resume in html | am webtech
                    cv in html and css - how to create resume cv website using html and css || resume design || cv design.</p>
                </div>
              </div>
              <div className={styles.box}>
                <div className={styles.year_company}>
                  <h5>2014-2016</h5>
                  <h5>Company Name</h5>
                </div>
                <div className={styles.text}>
                  <h4> Junior Designer</h4>
                  <p>how to create cv in html css &amp; javascript | print button | how to create resume in html | am webtech
                    cv in html and css - how to create resume cv website using html and css || resume design || cv design.</p>
                </div>
              </div>
            </div>

            <div className={`${styles.about} ${styles.skills}`}>
              <h2 className={styles.title2}>Professional skills</h2>
              <div className={styles.box}>
                <h4>Html</h4>
                <div className={styles.precent}>
                  <div style={{ width: '95%' }}></div>
                </div>
              </div>
              <div className={styles.box}>
                <h4>SCC</h4>
                <div className={styles.precent}>
                  <div style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className={styles.box}>
                <h4>Javascript</h4>
                <div className={styles.precent}>
                  <div style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className={styles.box}>
                <h4>Photoshop</h4>
                <div className={styles.precent}>
                  <div style={{ width: '90%' }}></div>
                </div>
              </div>
              <div className={styles.box}>
                <h4>Illustrator</h4>
                <div className={styles.precent}>
                  <div style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className={styles.box}>
                <h4>Adobe XD</h4>
                <div className={styles.precent}><div style={{ width: '98%' }}></div></div>
              </div>
            </div>

            <div className={`${styles.about} ${styles.interest}`}>
              <h2 className={styles.title2}>Interest</h2>
              <ul>
                <li><i className="fa fa-gamepad"></i>Gaming</li>
                <li><i className="fa fa-microphone"></i>Singing</li>
                <li><i className="fa fa-book"></i>Reading</li>
                <li><i className="fa fa-cutlery"></i>Cooking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Model;
