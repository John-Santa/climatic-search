const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
});

const buscarClima = (event) => {
    event.preventDefault();

    //validar campos
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === '') {
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    //Consultar API
    consultarAPI(ciudad, pais);

}

const consultarAPI = ( ciudad, pais ) => {
    const appId = 'ae31e941613f91b2feb1a5f72212c334';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    console.log(url);

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( datos => {
            limpiaHTML();
            if(datos.cod === "404") {
                mostrarError('Ciudad no encontrada');
                return;
            }
            //imprimir la respuesta
            mostrarClima(datos);
        }
    );
}

const mostrarClima = (datos) => {
    const { name, main: { temp, temp_max, temp_min } } = datos;

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${kelvinACentigrados(temp)} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${kelvinACentigrados(temp_max)} &#8451;`;
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${kelvinACentigrados(temp_min)} &#8451;`;
    tempMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
};

const kelvinACentigrados = (grados) => parseInt(grados - 273.15);

const mostrarError = (mensaje) => {
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta) {
        //crear alerta
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
        `;

        container.appendChild(alerta);

        //eliminar alerta
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

const limpiaHTML = () => {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}