// Importez votre fichier CSS
import './model3.css';
import React from 'react';
import avatar from '../assets/profile.png';
import '@fortawesome/fontawesome-free/css/all.css';
function Model() {
  return (
    <>
  <div className="print-area">
    <div className="container">
        <div className="top">
            <div className="profileText">
                <h3>Muhamad<br/>Irshad<br/><span>Creative Designer</span></h3>
            </div>
            <div className="imgBx">
                <div className="box">
                    <img src={avatar} alt="Profile" />
                </div>
            </div>
        </div>
        <div className="contentBox">
            <div className="leftSide">
                <h3>Contact Info</h3>
                <ul>
                    <li>
                        <span className="icon"><i className="fa fa-phone"></i></span>
                        <span className="text">+216 93 155 653</span>
                    </li>
                    <li>
                        <span className="icon"><i className="fa fa-envelope"></i></span>
                        <span className="text">john_doe@email.Com</span>
                    </li>
                    <li>
                        <span className="icon"><i className="fa fa-globe"></i></span>
                        <span className="text">www.mywebsite.com</span>
                    </li>
                    <li>
                        <span className="icon"><i className="fa fa-map-marker"></i></span>
                        <span className="text">Patna , Binar ,India</span>
                    </li>
                </ul>
                <h3>Education</h3>
                <ul className="education">
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
                <ul className="language">
                    <li>
                        <span className="text">English</span>
                        <span className="percent">
                            <div style={{ width: '90%' }}></div>
                        </span>
                    </li>
                    <li>
                        <span className="text">Spanish</span>
                        <span className="percent">
                            <div style={{ width: '48%' }}></div>
                        </span>
                    </li>
                    <li>
                        <span className="text">Hindi</span>
                        <span className="percent">
                            <div style={{ width: '85%' }}></div>
                        </span>
                    </li>
                </ul>
                <h3>Interest</h3>
                <ul className="interest">
                    <li><span className="icon"><i className="fa fa-gamepad"></i></span>Gaming</li>
                    <li><span className="icon"><i className="fa fa-microphone"></i></span>Singing</li>
                    <li><span className="icon"><i className="fa fa-book"></i></span>Reading</li>
                    <li><span className="icon"><i className="fa fa-cutlery"></i></span>Cooking</li>
                </ul>
            </div>
            <div className="rightSide">
                <div className="about">
                    <h3>Profile</h3>
                            <p>how to create cv in html css &amp; javascript | print button | how to create resume in html | am webtech
                    cv in html and css - how to create resume cv website using html and css || resume design || cv design.<br/>
                    how to create visual cv using html and css. how to create resume by html and css, resume using html and css.
                    Hi Friends, In this video i w&apos;ll show you How to create Your CV With Print Button Using HTML CSS &amp; JavaScript</p>
                </div>
                <div className="about">
                    <h3>Experiance</h3>
                  <div className="box">
                      <div className="year_compant">
                          <h5>2014-2016</h5>
                          <h5>Company Name</h5>
                      </div>
                      <div className="text">
                          <h4>Senior UX Designer</h4>
                          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil sapiente, libero numquam quibusdam delectus ipsam inventore, facere possimus iure dolores corrupti! Explicabo aspernatur hic labore modi repellendus beatae pariatur maiores.
                          </p>
                      </div>

                  </div>
                  <div className="box">
                      <div className="year_compant">
                          <h5>2016-2019</h5>
                          <h5>Company Name</h5>
                      </div>
                      <div className="text">
                          <h4>Senior UX Designer</h4>
                          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil sapiente, libero numquam quibusdam delectus ipsam inventore, facere possimus iure dolores corrupti! Explicabo aspernatur hic labore modi repellendus beatae pariatur maiores.
                          </p>
                      </div>

                  </div>
                  <div className="box">
                      <div className="year_compant">
                          <h5>2019-Present</h5>
                          <h5>Company Name</h5>
                      </div>
                      <div className="text">
                          <h4>Senior UX Designer</h4>
                          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil sapiente, libero numquam quibusdam delectus ipsam inventore, facere possimus iure dolores corrupti! Explicabo aspernatur hic labore modi repellendus beatae pariatur maiores.
                          </p>
                      </div>

                  </div>
                </div>
            </div>
        </div>
    </div>
</div>

    </>
  );
}

export default Model;
