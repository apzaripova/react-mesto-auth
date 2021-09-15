import React from 'react';
import success from '../images/success.svg';
import failed from '../images/failed.svg';

export default function InfoTooltip({ isOpen, onClose, isRegSuccess}) {
    return (
        <>
      <div className={isOpen ? 'popup popup_active' : 'popup'}>
        <div className="popup__container popup__container_status">
          <button type="button"
                  className="popup__close-button"
                  onClick={onClose}
          />
          <img className="popup__image-status"
               src={`${isRegSuccess === "success" ? success : failed}`}
               alt={`${
                isRegSuccess === "success"
                  ? "Успешная регистрация"
                  : "Что-то пошло не так"
              }`}
          />
          <h2 className="popup__profile popup__profile_status">
          {`${
          isRegSuccess === "success"
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте еще раз."
        }`}
          </h2>
        </div>
      </div>
    </>
    )
}