import React from 'react'
import logo from '../images/header__logo.svg'
import { Link, Route } from 'react-router-dom';

export default function Header({loggedIn, email, handleSignOut}) {

    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="Логотип" />
            <div className="header__login">
                {loggedIn && (
                    <Route exact path="/">
                    <p className="header__text">{email}</p>
                    <Link
                      to="/sign-in"
                      className="header__button-logout"
                      onClick={handleSignOut}
                    >
                      Выйти
                    </Link>
                  </Route>
                )}
                <Route path="/sign-in">
                  <Link to="/sign-up" className="header__link">
                    Регистрация
                  </Link>
                </Route>
                <Route path="/sign-up">
                  <Link to="/sign-in" className="header__link">
                    Вход
                  </Link>
                </Route>
            </div>
        </header>
    )
}