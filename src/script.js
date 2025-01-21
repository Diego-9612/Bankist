
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const displayMovements = function (movements, sort = false){
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b)=> a - b): movements;


  movs.forEach( function(mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = ` 
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1}  ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};


/* Crear una variale que almacene el acumulado total de las transacciones 
  haciendo uso del metodo reduce y arrow function */

  const calcDisplayBalance = function (acc){

    acc.balance = acc.movements.reduce( (acu, mov) => acu + mov, 0);

    labelBalance.textContent = `${acc.balance} €`;
  };


  /* Calcular todas las estadisticas de ingresos (despositos) y retiros (consignaciones) haciendo uso de map y reduce*/
  
  const calcDisplaySummary = function(acc){

    let income = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${income}€`;

    let out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out)}€`; 

    let interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * 1.2) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${interest}€`;

  };

/*Generar un nuevo userName en base al owner para cada una de las cuenta registradas
  haciendo uso de el metodo map (este metodo crea una nueva matriz con los elementos trasformados), split, join. 
*/

const createUserName = function (accs) {
  accs.forEach(function(accs){
    accs.userName = accs.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
  });
};
createUserName(accounts);

/* Implementacion de la logica para inicio de sesion haciendo uso de el metodo find */

const updateUI = function(acc){
   //Mostrar los movimientos
  displayMovements(acc.movements);

   //Mostrar Balance 
  calcDisplayBalance(acc);

   //Mostrar Summary 
  calcDisplaySummary(acc);
}

let currentAccount; 

btnLogin.addEventListener('click', function(e){

  //previene que el form se envie 
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);

  if (currentAccount?.pin === Number(inputLoginPin.value)){

    //Mostrar mensaje de bienvenida y el contenido de la cuenta
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //Vaciar los input 

    //inputLoginUsername.value = inputLoginPin.value = ' ';
    //inputLoginPin.blur();

    updateUI(currentAccount);


  };

});

//Implementacion de la logica de trasferencias de dinero 

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);

  if(amount > 0 && receiverAcc && currentAccount.balance > amount && receiverAcc?.userName !== currentAccount.userName){
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }

  inputTransferAmount.value = inputTransferTo.value = ' ';
});

/* Implementacion de la logica para solicitud de un prestamo
o con la condicion  al menos un deposito sea el 10% de lo solicitado*/

btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value); 

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){

    currentAccount.movements.push(amount);

    updateUI(currentAccount);

    inputLoanAmount.value = ' ';

  };
});

//Implementacion de la logica de eliminar una cuenta 

btnClose.addEventListener('click', function(e){
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.userName && Number(inputClosePin.value) === currentAccount.pin){

    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  };

  inputCloseUsername.value = inputClosePin.value = ' ';
});

let sorted = false;

btnSort.addEventListener('click', function(e){
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})






