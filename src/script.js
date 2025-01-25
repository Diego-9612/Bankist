
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];


// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////

const formatMovementsDate = function (date) {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {

    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = `${date.getFullYear()}`;

    return `${day}/${month}/${year}`;

  }
};


//Formatear monedas con el API de internacionalizacion 

const formatCurrency = function(value, locale, currency){
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovsDates = acc.movements.map((mov, i) => (
    { movement: mov, 
      movementDate: acc.movementsDates.at(i),
    }));

    if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);


  combinedMovsDates.forEach(function (obj, index) {
    const {movement, movementDate} = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(movementDate);
    const displayDate = formatMovementsDate(date);

    const formattedMov = formatCurrency(movement, acc.locale, acc.currency);

    const html = ` 
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${index + 1}  ${type}</div>
      <div class="movements__date"> ${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};


/* Crear una variale que almacene el acumulado total de las transacciones 
  haciendo uso del metodo reduce y arrow function */

const calcDisplayBalance = function (acc) {

  acc.balance = acc.movements.reduce((acu, mov) => acu + mov, 0);

  labelBalance.textContent = formatCurrency(acc.balance, acc.locale, acc.currency);
};


/* Calcular todas las estadisticas de ingresos (despositos) y retiros (consignaciones) haciendo uso de map y reduce*/

const calcDisplaySummary = function (acc) {

  let income = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(income, acc.locale, acc.currency);

  let out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(Math.abs(out), acc.locale, acc.currency);
  
  let interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * 1.2) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(interest, acc.locale, acc.currency); ;

};

/*Generar un nuevo userName en base al owner para cada una de las cuenta registradas
  haciendo uso de el metodo map (este metodo crea una nueva matriz con los elementos trasformados), split, join. 
*/

const createUserName = function (accs) {
  accs.forEach(function (accs) {
    accs.userName = accs.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserName(accounts);

/* Implementacion de la logica para inicio de sesion haciendo uso de el metodo find */

const updateUI = function (acc) {
  //Mostrar los movimientos
  displayMovements(acc);

  //Mostrar Balance 
  calcDisplayBalance(acc);

  //Mostrar Summary 
  calcDisplaySummary(acc);
}

// Implementacion de logica para temporizador de cierre de sesion 

const startLogOutTime = function (){

  const tick = function(){

    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String (time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0){
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get Started';
      containerApp.style.opacity = 0;
    };

    time--;
  };

  let time = 100;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;

};

let currentAccount , timer;

btnLogin.addEventListener('click', function (e) {

  //previene que el form se envie 
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);

  if (currentAccount?.pin === +(inputLoginPin.value)) {

    //Mostrar mensaje de bienvenida y el contenido de la cuenta
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //Logica para generar fecha curret balance

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      weekday: 'short'
    } 

    const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

    //Vaciar los input 
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTime();

    updateUI(currentAccount);

  };
  inputLoginUsername.value = inputLoginPin.value = '';

});

//Implementacion de la logica de trasferencias de dinero 

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);

  if (amount > 0 && receiverAcc && currentAccount.balance > amount && receiverAcc?.userName !== currentAccount.userName) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTime();
  }

  inputTransferAmount.value = inputTransferTo.value = ' ';
});

/* Implementacion de la logica para solicitud de un prestamo
o con la condicion  al menos un deposito sea el 10% de lo solicitado*/

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    setTimeout(function(){
      currentAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogOutTime();
    }, 4000);

  };
  inputLoanAmount.value = ' ';
});

//Implementacion de la logica de eliminar una cuenta 

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.userName && Number(inputClosePin.value) === currentAccount.pin) {

    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  };

  inputCloseUsername.value = inputClosePin.value = ' ';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movementsDates, !sorted);
  sorted = !sorted;
});

// Implementacion logica para conteo de movimientos 

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ' '))
  );

  console.log(movementsUI);
});

//Obtener la suma de todos los movimientos del banco 

const bankDepositsSum = accounts.map(mov => mov.movements).flat().filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
console.log(bankDepositsSum);

// Obtener depositos superiores a 1000

const numDepositos1000 = accounts.flatMap(mov => mov.movements).filter(mov => mov >= 1000).length;
console.log(numDepositos1000);

// Obtener Objetos con las suma de depositos y retiros 

const sums = accounts.flatMap(mov => mov.movements).reduce((sums, cur) => {
  cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
  return sums;
},
  { deposits: 0, withdrawals: 0 }
);

console.log(sums);

/////////////////////////////////////////////////

/* Conversión y comprobación de números */
















