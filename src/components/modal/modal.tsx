import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ModalOverlay } from './modal-overlay';

import styles from './modal.module.css';

const modalRoot = document.getElementById('modals');

type TModalProps = {
  children: React.JSX.Element;
  title?: string;
  onClose: () => void;
};

export const Modal = ({ children, title, onClose }: TModalProps): React.JSX.Element => {
  useEffect((): (() => void) => {
    const handleEsc = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);

    return (): void => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <>
      <ModalOverlay onClose={onClose} />

      <div className={styles.modal}>
        <div>
          {title && <h2 className="text text_type_main-large">{title}</h2>}

          <button className={styles.close} onClick={onClose} type="button">
            <CloseIcon type="primary" />
          </button>
        </div>

        {children}
      </div>
    </>,
    modalRoot!
  );
};
