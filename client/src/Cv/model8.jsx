import React from 'react';
import styles from './model8.module.css'; // Assurez-vous d'avoir le fichier model8.module.css dans votre projet
import '@fortawesome/fontawesome-free/css/all.css';
import avatar from '../assets/cvprofile.jpeg';

const Profile = () => {
    return (
        <div className="container">
            <div className="row">
                {/* Colonne de gauche */}
                <div className="col-lg-4 col-xl-4">
                    {/* Carte de profil */}
                    <div className={`card-box text-center ${styles['print-area']} ${styles.resume}`}>
                        <img src={avatar} alt="Profile" className={`rounded-circle avatar-xl img-thumbnail ${styles.avatar}`} />
                        <h4 className="mb-0">Soeng Souy</h4>
                        <p className="text-muted">@soengsouy</p>
                        {/* Boutons Follow et Message supprimés */}
                        <div className="text-left mt-3">
                            <h4 className="font-13 text-uppercase">About Me :</h4>
                            <p className={`text-muted font-13 mb-3 ${styles.aboutMe}`}>
                                Hi I&apos;m Soeng Souy,has been the industry&apos;s standard dummy text ever since the
                                1500s, when an unknown printer took a galley of type.
                            </p>
                            <p className="text-muted mb-2 font-13"><strong>Full Name :</strong> <span className="ml-2">Soeng Souy</span></p>
                            <p className="text-muted mb-2 font-13">
                                <strong>Mobile :</strong>
                                <span className="ml-2">(+885)966686371</span>
                            </p>
                            <p className="text-muted mb-2 font-13">
                                <strong>Email :</strong>
                                <span className="ml-2">soengsouy@email.com</span>
                            </p>
                            <p className="text-muted mb-1 font-13">
                                <strong>Location :</strong>
                                <span className="ml-2">Phnom Penh</span>
                            </p>
                        </div>
                        <ul className={`social-list list-inline mt-3 mb-0 ${styles.socialList}`}>
                            <li className="list-inline-item">
                                <a href="facebook.com/soengsouy" className="social-list-item border-purple text-purple"><i className="fab fa-facebook"></i></a>
                            </li>
                            <li className="list-inline-item">
                                <a href="javascript:void(0);" className="social-list-item border-danger text-danger"><i className="fab fa-google"></i></a>
                            </li>
                            <li className="list-inline-item">
                                <a href="javascript:void(0);" className="social-list-item border-info text-info"><i className="fab fa-twitter"></i></a>
                            </li>
                            <li className="list-inline-item">
                                <a href="javascript:void(0);" className="social-list-item border-secondary text-secondary"><i className="fab fa-github"></i></a>
                            </li>
                        </ul>
                    </div>
                    {/* Fin de la carte de profil */}
                    {/* Carte des compétences */}
                    <div className={`card-box text-center ${styles['print-area']} ${styles.resume}`}>
                        <h4 className="header-title">Skills</h4>
                        <p className="mb-3">Everyone realizes why a new common language would be desirable</p>
                        <div className="pt-1">
                            <h6 className="text-uppercase mt-0">HTML5 <span className="float-right">90%</span></h6>
                            <div className="progress progress-sm m-0">
                                <div className="progress-bar bg-purple" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style={{ width: '90%' }}></div>
                            </div>
                        </div>
                        <div className="mt-2 pt-1">
                            <h6 className="text-uppercase">PHP <span className="float-right">67%</span></h6>
                            <div className="progress progress-sm m-0">
                                <div className="progress-bar bg-purple" role="progressbar" aria-valuenow="67" aria-valuemin="0" aria-valuemax="100" style={{ width: '67%' }}></div>
                            </div>
                        </div>
                        <div className="mt-2 pt-1">
                            <h6 className="text-uppercase">WordPress <span className="float-right">10%</span></h6>
                            <div className="progress progress-sm m-0">
                                <div className="progress-bar bg-purple" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" style={{ width: '10%' }}></div>
                            </div>
                        </div>
                        <div className="mt-2 pt-1">
                            <h6 className="text-uppercase">Laravel <span className="float-right">95%</span></h6>
                            <div className="progress progress-sm m-0">
                                <div className="progress-bar bg-purple" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style={{ width: '95%' }}></div>
                            </div>
                        </div>
                        <div className="mt-2 pt-1">
                            <h6 className="text-uppercase">ReactJs <span className="float-right">72%</span></h6>
                            <div className="progress progress-sm m-0">
                                <div className="progress-bar bg-purple" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100" style={{ width: '72%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Fin de la carte des compétences */}
                </div>
                <div className="col-lg-8 col-xl-8">
                    <div className={`card-box ${styles.cardBox}`}>
                        <ul className="nav nav-pills navtab-bg">
                            {/* Suppression des onglets About Me et Settings Reset */}
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane show active" id="about-me">
                                <h5 className="mb-4 text-uppercase"><i className="mdi mdi-briefcase mr-1"></i>Experience</h5>
                                <ul className="list-unstyled timeline-sm">
                                    {/* Expérience ajoutée */}
                                    <li className="timeline-sm-item">
                                        <span className="timeline-sm-date">2018 - 19</span>
                                        <h5 className="mt-0 mb-1">Web Designer</h5>
                                        <p>Software Inc.</p>
                                        <p className="text-muted mt-2">If several languages coalesce, the grammar of the resulting language 
                                            is more simple and more regular than that of the individual languages. 
                                            The new common language will be more simple and more regular than the e
                                            xisting European languages.
                                        </p>
                                    </li>
                                    {/* Expérience ajoutée */}
                                    <li className="timeline-sm-item">
                                        <span className="timeline-sm-date">2016 - 18</span>
                                        <h5 className="mt-0 mb-1">Graphic Designer</h5>
                                        <p>DDD KH</p>
                                        <p className="text-muted mt-2 mb-0">The European languages are members of
                                            the same family. Their separate existence is a myth. For science
                                            music sport etc, Europe uses the same vocabulary. The languages
                                            only differ in their grammar their pronunciation.</p>
                                    </li>
                                </ul>
                                {/* Ajoutez d'autres sections comme les projets ici */}
                            </div>
                            {/* Pas de contenu pour l'onglet Settings */}
                        </div> 
                        {/* end tab-content */}
                    </div> 
                    {/* end card-box*/}
                </div> 
                {/* end col */}
            </div>
        </div>
    );
}

export default Profile;
