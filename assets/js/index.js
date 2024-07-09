const formulario = document.querySelector("#formulario")
const obtenerData = async (moneda) => {
    try {
        const data = await fetch(`https://mindicador.cl/api/${moneda}`)
        const res = await data.json()
        return res
    } catch (e) {
        const errorSpan = document.querySelector("#errorspan")
        errorSpan.innerHTML = `Algo salió mal! Error: ${e.message}`
    }
}

const crearGrafico = async (series) => {
    const data = series.map((serie) => serie.valor)
    const fechas = series.map((serie) => serie.fecha)
    const ctx = document.getElementById('myChart');

    let fechaFormat = []
    for (let i = 0; i < fechas.length; i++) {
        let fecha = fechas[i]
        let fechaTransform = new Date(fecha).toLocaleDateString()
        fechaFormat.push(fechaTransform)

        let grafico = Chart.getChart("myChart")

        if (grafico !== undefined) {
            grafico.destroy()
        }

        new Chart(ctx, {

            type: 'line',
            data: {
                labels: fechaFormat.slice(0, 10).reverse(),
                datasets: [{
                    label: `Variación de ${moneda.value}`,
                    data: data.slice(0, 10).reverse(),
                    borderWidth: 1
                },
                ],
            },
        });
    }
}


formulario.addEventListener("submit", async (event) => {
    event.preventDefault()

    const clp = document.querySelector("#clp").value
    const moneda = document.querySelector("#moneda").value
    const result = await obtenerData(moneda)

    let calculo = clp / result.serie[0].valor

    let calculoSinDecimales = Number(calculo).toFixed(2)

    let calculoFormateado = new Intl.NumberFormat("en-IN").format(calculoSinDecimales)

    crearGrafico(result.serie)

    let calculoFinal = document.querySelector("#html")

    let html = ""

    html += `<h3>Resultado: $${calculoFormateado}</h3>`

    calculoFinal.innerHTML = html

})

