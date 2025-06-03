## Bankist App

Bankist es una aplicación web de banca minimalista desarrollada con JavaScript, centrada en el manejo de datos mediante Arrays. Este proyecto forma parte de una sección de aprendizaje práctico y didáctico, ideal para entrenar habilidades en manipulación del DOM, estructuras de datos y lógica de negocio en aplicaciones web.

![Captura de pantalla 2025-06-03 182623](https://github.com/user-attachments/assets/89852b9b-0398-4813-bca7-206f5c6276b8)


### Usuarios de prueba:

* Usuario: `js`

* PIN: `1111`

* Usuario: `jd`

* PIN: `2222`

---

## ✨ Características Principales

* Interfaz de banca online minimalista.
* Visualización de movimientos financieros.
* Cálculo de saldo total y resumen financiero.
* Transferencias entre usuarios.
* Solicitud de préstamos con aprobación simulada.
* Cierre de cuenta.
* Ordenamiento de movimientos.
* Localización y formato de moneda según el usuario (ej: EUR vs USD).
* Temporizador de cierre de sesión (próxima sección).

---

## 📄 Estructura del Proyecto

* **HTML**: Archivo `index.html` con una estructura más compleja y rica para simular una app bancaria real.
* **CSS**: Estilos personalizados con más de 300 líneas para ofrecer una experiencia atractiva y profesional.
* **JavaScript**: Uso extensivo de Arrays y objetos para manejar usuarios, movimientos, lógica de negocio y renderizado.
* **Flujo de Usuario**: Definido en un **diagrama de flujo** que representa todas las acciones posibles dentro de la aplicación, como iniciar sesión, transferir, solicitar préstamo, etc.
* 
---

## 📊 Datos de Usuario (Mocked)

Los datos simulados de usuarios están definidos como objetos:

```js
const account1 = {
  owner: 'Diego Guerrero',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const accounts = [account1, account2, ...];
```

Los datos se organizan en una **array de objetos**, imitando la estructura que recibiríamos desde una API REST, lo que le da un enfoque realista al proyecto.

---

## 📝 Objetivos de Aprendizaje

* Práctica intensiva con **arrays** y sus métodos (`map`, `filter`, `reduce`, `find`, `sort`, etc.).
* Manipulación del DOM avanzada.
* Planificación de aplicaciones usando diagramas de flujo.
* Separación entre lógica de negocio y presentación.
* Introducción al manejo de fechas, localización e internacionalización (i18n).

---

## 📊 Diagrama de Flujo

Incluye un **diagrama de flujo** que representa el comportamiento completo de la aplicación, desde el login hasta las diferentes acciones posibles. Este sirve como una hoja de ruta durante el desarrollo.

![Bankist-flowchart](https://github.com/user-attachments/assets/135248fb-f369-4127-ab7b-ddf88da238cf)


---

## ⚖️ Stack Tecnológico

* HTML5
* CSS3
* JavaScript (ES6+)

---

> "Una aplicación minimalista pero poderosa, ideal para dominar Arrays y lógica de negocio en el frontend."


