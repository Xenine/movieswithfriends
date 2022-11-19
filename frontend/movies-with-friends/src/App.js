
function App() {
  return (
    <div className="wrapper clear">
      <header className="d-flex justify-between p-25">
        <div className="d-flex align-center ml-20">
          <img width={54} hight={44} src="/img/logo.svg" alt="logo"/>
          <div className="ml-20">
            <h3 className="text-uppercase">Фильмы с друзьями</h3>
            <p>Смотри, оценивай, делись!</p>
          </div>
        </div>
        <ul className="headerRight d-flex align-center">
          <li className="p-20">Login</li>
          <li><img width={61} hight={61} src="/img/account.svg" alt="account"/></li>
        </ul>

      </header>
      <div className="content">
        <div className="suggestions d-flex justify-center">
          <div className="suggestions-card m-30"></div>
        </div>
        <div className="cards d-flex justify-center">
          <div className="card d-flex">
            <div className="cardLeft">
              <ul className="d-flex align-center ml-10 mt-10">
                <li className="mr-10">
                  <img width={80} hight={80} src="/img/avatar1.jpg" alt="ava"/>
                </li>
                <li>
                  <img width={24} hight={24} src="/img/star_full.svg" alt="star_full"/>
                </li>
                <li>
                  <img width={24} hight={24} src="/img/star_full.svg" alt="star_full"/>
                </li>
                <li>
                  <img width={24} hight={24} src="/img/star_full.svg" alt="star_full"/>
                </li>
                <li>
                  <img width={24} hight={24} src="/img/star_half.svg" alt="star_half"/>
                </li>
                <li>
                  <img width={24} hight={24} src="/img/star_empty.svg" alt="star_empty"/>
                </li>
              </ul>
              <div className="cardLeftBottom m-10">
                <p>
                Фильм такая себе шляпа, не особо советую. Хотя, если вы помешаны на теме Марвел, то модет быть вам это понравится. 
                Но я в этом не уверен. Смотрите на свой страх и риск 
                </p>
              </div>
            </div>
            <div className="cardRight">
              <img width={112} hight={168} src="/img/poster1.jpg" alt="poster" className="mt-10 mr-10"/>
              <h4 className="text-center">Мстители: Финал</h4>
            </div>
          </div>
          <div className="card"></div>
        </div>
      </div>

    </div>
  );
}

export default App;
