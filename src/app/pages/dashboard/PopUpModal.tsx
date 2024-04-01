import React, {useEffect} from 'react';
import './PopUpModal.css'; // Make sure to have your CSS file for styling
import { toAbsoluteUrl } from '../../../_metronic/helpers'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnswer: (answer: string) => void;
}

const PopUpModal: React.FC<ModalProps> = ({ isOpen, onClose, onAnswer }) => {
    useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          if (target.classList.contains('modal-outside')) {
            onClose();
          }
        };
    
        document.addEventListener('click', closeOnOutsideClick);
    
        // Cleanup function to remove the event listener
        return () => document.removeEventListener('click', closeOnOutsideClick);
      }, [onClose]); // Removed isOpen from dependency array as it's not used inside effect.
    
    // The early return is moved here, after all hooks have been called
    if (!isOpen) return null;
    
    return (
        <div className="modal show modal-outside " style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog">
            <div className="modal-dialog custom-modal-size custom-modal-dialog-centered">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Title</h5>
                    <button type="button" className="closeButton" aria-label="Close" onClick={onClose}>
                    &times; {/* Stylish X symbol for close */}
                    </button>

                </div>
                <div className="modal-body">
                    <div className="row">
                        <div className="col-6">
                        <img src= {toAbsoluteUrl('/media/custom/resource1.png')} width="100%" alt="Modal" className="img-fluid" />
                        </div>
                        <div className="col-6 d-flex flex-column align-items-center justify-content-center">
                        <h1>Let's Help You!</h1>
                        <h6>What type of LighthouseAI userS are you</h6>
                        <div className="d-flex flex-column align-items-stretch buttons-container">
                            <button className="btn btn-primary mb-2 button">Just an Individual</button>
                            <button className="btn btn-primary mb-2 button">Real Estate Broker (Agent/Agency)</button>
                            <button className="btn btn-primary button">Real Estate Developer Member</button>
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
