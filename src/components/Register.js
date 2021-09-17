import React from 'react';
import {Link, Route} from "react-router-dom";

export default function Register(props) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    function handleAddEmail(e) {
        setEmail(e.target.value);
    }

    function handleAddPassword(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.handleRegistration(email, password);
    }


    return (
        <div className="popup__auth">
            <form className="popup-form popup-form_auth" onSubmit={handleSubmit}>
                <h2 className="popup__profile popup__profile_auth">Регистрация</h2>
                <input className="popup__input popup__input_type_login" onChange={handleAddEmail} value={email} type="email" placeholder="Email" id="auth-email" required maxLength="40" minLength="1"></input>
                <input className="popup__input popup__input_type_login" onChange={handleAddPassword} value={password} type="password" placeholder="Пароль" id="auth-password" required maxLength="40" minLength="2"></input>
                <button className="popup__button popup__button_auth">Зарегистрироваться</button>
                <p className="popup__login-text">Уже зарегистрированы?
                <Route path="/sign-up">
                        <Link className="popup__text-link button" to="/sign-in">
                            {' '}Войти
                        </Link>
                </Route>
                </p>
            </form>
        </div>
    )
}