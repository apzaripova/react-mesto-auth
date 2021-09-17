import React, { useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import Main from './Main'
import PopupWithForm from'./PopupWithForm'
import api from '../utils/api'
import * as auth from '../utils/auth';
import ImagePopup from './ImagePopup'
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { Route, Switch, useHistory, Redirect } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
    const [cards, setCards] = React.useState([]);
    const [currentUser, setCurrentUser] = React.useState({});
    const [selectedCard, setSelectedCard] = React.useState({
        link: '',
        name: ''
      });
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [email, setEmail] = useState('');
    const [isSuccessSignUp, setIsSuccesSignUp] = React.useState(false);
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
    const history = useHistory();

    React.useEffect(() => {
        Promise.all([api.getUserInfo(), api.getCards()])
          .then(([info, initialCards]) => {
            setCurrentUser(info)
            setCards(initialCards)
          })
          .catch((err) => {
            console.log(err);
          })
        }, []);

    function handleCheckToken () {
        const token = localStorage.getItem('jwt');
        if (token) {
          auth.checkToken(token)
          .then((res) => {
            if(res.data.email) {
              setEmail(res.data.email)
              setLoggedIn(true)
              history.push('/')
            }
          })
          .catch((err) => {
            console.log(err)
          });
        }
      }

  
    React.useEffect(() => {
      handleCheckToken();
    }, []);

   

    const handleEditProfileClick = () => {
        setIsEditProfilePopupOpen(true);
    };
    const handleEditAvatarClick = () => {
        setIsEditAvatarPopupOpen(true);
    };
    const handleAddPlaceClick = () => {
        setIsAddPlacePopupOpen(true);
    };

    function handleCardClick(card) {
      setSelectedCard(card);
      setIsImagePopupOpen(!isImagePopupOpen);
    }

    function handleInfoTooltipPopupOpen() {
      setIsInfoTooltipOpen(!isInfoTooltipOpen);
    }

    function handleLikeCard(card) {
      // Снова проверяем, есть ли уже лайк на этой карточке
      const isLiked = card.likes.some(i => i._id === currentUser._id);
      
      // Отправляем запрос в API и получаем обновлённые данные карточки
      api.setLike(card._id, !isLiked).then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(`Ошибка лайка: ${err}`);
      })
  }

  
  function handleDeleteClick(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards(cards.filter(item => item._id !== card._id));
      })
      .catch(err => console.log(err));
  }

  const handleUpdateUser = (item) => {
    api.setUserInfo(item)
    .then((newProfile) => {
      setCurrentUser(newProfile);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка обновления профиля: ${err}`);
    })
  }

  const handleUpdateAvatar = (item) => {
    api.setUserAvatar(item)
    .then((newAvatar) => {
      setCurrentUser(newAvatar);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка создания карточки: ${err}`);
    })
  }

  const handleAddPlace = (item) => {
    api.postCard(item)
    .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка создания карточки: ${err}`);
    })
  }
  

  //регистрация
  function handleRegistration(email, password) {
    auth.register(email, password)
    .then((res) => {
      if (res.data) {
        setIsSuccesSignUp(true)
        handleInfoTooltipPopupOpen();
        history.push('/sign-in')
      }
    })
    .catch((err) => {
      console.log(err)
      setIsSuccesSignUp(false);
      handleInfoTooltipPopupOpen();
    });
  }


  //авторизация
  function handleAuthorization({email, password}) {
    auth.authorize({email, password})
    .then((res) => {
      if (res.token) {
        setEmail(email)
        setLoggedIn(true);
        setIsSuccesSignUp(true)
        localStorage.setItem('jwt', res.token)
        history.push('/')
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }


  //выход из учетной записи
  function handleSignOut() {
    localStorage.removeItem('jwt');
    setEmail('');
    setLoggedIn(false);
    history.push('/sign-in');
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({
        link: '',
        name: ''
      })
  };


  
  return (
    <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
        <Header email={email} loggedIn={loggedIn} onSignOut={handleSignOut} /> 
        <Switch>
          <ProtectedRoute
                exact path="/" 
                component={Main}
                onEditProfile={handleEditProfileClick} 
                onAddPlace={handleAddPlaceClick} 
                onEditAvatar={handleEditAvatarClick} 
                onCardClick={handleCardClick} 
                cards={cards}
                onCardLike={handleLikeCard}
                onCardDelete={handleDeleteClick}
                loggedIn={loggedIn}
                logout={handleSignOut}
                />
          <Route path="/sign-up">
            <Register handleRegistration={handleRegistration} />
          </Route>
          <Route path="/sign-in">
            <Login handleAuthorization={handleAuthorization}
                  onCheckToken={handleCheckToken} />
          </Route>
          <Route path="/">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
        <Footer />
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace}/>
        <PopupWithForm  title="Вы уверены?" name="confirmPopup" submitButtonText="Да" isOpen={false} onClose={closeAllPopups} />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
          isOpen={isImagePopupOpen}
        />
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          isSuccess={isSuccessSignUp}
      />
    </div>
    </CurrentUserContext.Provider>
  );
}


export default App;
