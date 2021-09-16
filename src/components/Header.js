import React from 'react'
import logo from '../images/header__logo.svg'
import { Link, Route } from 'react-router-dom';

export default function Header({loggedIn, email, onSignOut}) {

  
  return (
    <header className="header"> 

      <img src={logo} alt="Логотип Место" className="header__logo" /> 
      <div className="header__login"> 
      {loggedIn && (
        <>
        <p className="header__text">{email}</p>
          <Route exact path="/">
            <Link
              to="/sign-in"
              className="header__button"
              onClick={onSignOut}
            >
              Выйти
            </Link>
          </Route>
          </>
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
  );
}