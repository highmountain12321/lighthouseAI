import React, { useEffect, useState } from 'react';
import './PopUpModal.css';
import { toAbsoluteUrl } from '../../../_metronic/helpers';
import axios from 'axios'; // Make sure to install axios for HTTP requests
import apiEndpoints from 'app/axios/jwtDefaultConfig'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnswer: (answer: string) => void;
}

const PopUpModal: React.FC<ModalProps> = ({ isOpen, onClose, onAnswer }) => {
    const [shouldDisplayModal, setShouldDisplayModal] = useState(isOpen);

    useEffect(() => {
        // Fetch user attributes on component mount
        
        axios.get(apiEndpoints.userAttrs)
            .then(response => {
                // If the response is not 'none', set shouldDisplayModal to true
                if(response.data !== 'none') {
                    setShouldDisplayModal(true);
                } else {
                    setShouldDisplayModal(false);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the user attributes:', error);
                setShouldDisplayModal(false);
            });

        const closeOnOutsideClick = (event: MouseEvent) => {  
            const target = event.target as HTMLElement;
            if (target.classList.contains('modal-outside')) {
                onClose();
            }
            
        };

        document.addEventListener('click', closeOnOutsideClick);

        return () => document.removeEventListener('click', closeOnOutsideClick);
    }, [onClose]);

    // Function to handle button clicks
    const handleButtonClick = (user_type: string) => {
        axios.post(apiEndpoints.claims, { user_type })
            .then(response => {
                console.log('Post request successful', response);
                // Call onAnswer or onClose here if needed, for example:
                // onAnswer(userType);
                onClose(); // Close the modal after successful post request
            })
            .catch(error => {
                console.error('There was an error with the post request:', error);
            });
    };

    if (!shouldDisplayModal) return null;

    return (
        <div className="modal show modal-outside" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog">
            <div className="modal-dialog custom-modal-size custom-modal-dialog-centered">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Title</h5>
                    <button type="button" className="closeButton" aria-label="Close" onClick={onClose}>
                    &times;
                    </button>
                </div>
                <div className="modal-body">
                    <div className="row">
                        <div className="col-6">
                        <img src={toAbsoluteUrl('/media/custom/resource1.png')} width="100%" alt="Modal" className="img-fluid" />
                        </div>
                        <div className="col-6 d-flex flex-column align-items-center justify-content-center">
                        <h1>Let's Help You!</h1>
                        <h6>What type of LighthouseAI userS are you</h6>
                        <div className="d-flex flex-column align-items-stretch buttons-container">
                            <button className="btn btn-primary mb-2 button" onClick={() => handleButtonClick('individual')}>Just an Individual</button>
                            <button className="btn btn-primary mb-2 button" onClick={() => handleButtonClick('broker')}>Real Estate Broker (Agent/Agency)</button>
                            <button className="btn btn-primary button" onClick={() => handleButtonClick('developer')}>Real Estate Developer Member</button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopUpModal;
