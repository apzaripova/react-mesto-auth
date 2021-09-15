import React, { useState } from 'react';
import Header from './Header';

export default function Login(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleAddEmail(e) {
        setEmail(e.target.value);
    }

    function handleAddPassword(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.handleAuthorization({ password, email });
    }
    return (
        <>
        <Header headerText="Регистрация" link="/sign-up" />
        <div className="popup__auth">
            <form className="popup-form popup-form_auth" onSubmit={handleSubmit}>
                <h2 className="popup__profile popup__profile_auth">Вход</h2>
                <input className="popup__input popup__input_type_login" onChange={handleAddEmail} type="email" placeholder="Email" id="auth-email" required maxLength="40" minLength="1"></input>
                <span className="popup__input-error input-email-error"></span>
                <input className="popup__input popup__input_type_login" onChange={handleAddPassword} type="password" placeholder="Пароль" id="auth-password" required maxLength="40" minLength="2"></input>
                <span className="popup__input-error input-password-error"></span>
                <button className="popup__button popup__button_auth">Войти</button>
            </form>
        </div>
        </>
    )
}