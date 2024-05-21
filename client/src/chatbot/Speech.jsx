import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Importez PropTypes pour valider les props
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons'; // Importez les icônes du microphone
import '@fortawesome/fontawesome-free/css/all.css';

const SpeechRecognitionComponent = ({ onTranscriptChange }) => {
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false); // Ajoutez un état pour gérer l'état d'écoute

  useEffect(() => {
    // Vérifier la compatibilité du navigateur avec l'API
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    // Créer une instance de SpeechRecognition
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();

    // Configurer les options de reconnaissance
    recognition.lang = "fr-FR"; // Langue française

    // Gérer les événements de reconnaissance
    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      onTranscriptChange(currentTranscript);
    };

    setRecognition(recognition);

    // Nettoyer la reconnaissance lors du démontage
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTranscriptChange]);

  const toggleRecognition = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsListening(!isListening);
    }
  };

  return (
    <div>
      <button onClick={toggleRecognition}>
        {isListening ? 
          <FontAwesomeIcon icon={faMicrophoneSlash} /> :
          <FontAwesomeIcon icon={faMicrophone} />
        }
      </button>
    </div>
  );
};

// Valider les props
SpeechRecognitionComponent.propTypes = {
  onTranscriptChange: PropTypes.func.isRequired,
};

const AudioCaptureComponent = () => {
  const [transcript, setTranscript] = useState("");

  const handleTranscriptChange = (newTranscript) => {
    setTranscript(newTranscript);
  };

  return (
    <div>
      <h2>Audio Capture</h2>
      <SpeechRecognitionComponent onTranscriptChange={handleTranscriptChange} />
      <input type="text" value={transcript} onChange={(e) => setTranscript(e.target.value)} />
    </div>
  );
};

export default AudioCaptureComponent;
