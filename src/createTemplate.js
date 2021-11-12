import {API_KEY, city, isDark} from './data'

const wrap = document.getElementById('wrap')
const input = document.getElementById('search-city')
const navWrap = document.getElementById('nav')
const searchBtn = document.getElementById('btn')
const themeBtn = document.getElementById('theme-btn')


function createTemplate(data) {
    while (wrap.firstChild) {
        wrap.removeChild(wrap.firstChild)
    }

    let homeWrap = document.createElement('div')
    homeWrap.classList.add('home')
    let weatherWrap = document.createElement('div')
    weatherWrap.classList.add('weather-wrap')

    let cityWrap = document.createElement('div')
    let tempWrap = document.createElement('div')
    let condWrap = document.createElement('div')
    cityWrap.classList.add('city')
    tempWrap.classList.add('temp')
    condWrap.classList.add('condition')

    for (let i = 0; i < 3; i++) {
        let weatherItem = document.createElement('div')
        weatherItem.classList.add('weather-item')
        weatherItem.id = `${i}`
        weatherWrap.appendChild(weatherItem)
    }

    wrap.appendChild(homeWrap)
    homeWrap.appendChild(weatherWrap)

    document.getElementById('0').appendChild(cityWrap)
    document.getElementById('0').appendChild(tempWrap)
    document.getElementById('0').appendChild(condWrap)

    let icon = document.createElement('img')
    icon.classList.add('w_icon')
    document.getElementById('1').appendChild(icon)

    for (let i = 0; i < 5; i++) {
        let values = document.createElement('div')
        values.classList.add('values')
        values.id = `val-${i}`
        document.getElementById('2').appendChild(values)
    }

    cityWrap.textContent = data.location.name
    tempWrap.textContent = `${Math.floor(data.current.temp_c)} °C`
    condWrap.textContent = data.current.condition.text
    icon.src = data.current.condition.icon
    document.getElementById('val-0').textContent = `Local time: ${data.location.localtime.slice(-5)}`
    document.getElementById('val-1').textContent = `Feels like: ${Math.floor(data.current.feelslike_c)} °C`
    document.getElementById('val-2').textContent = `Wind speed: ${Math.floor(data.current.wind_kph)} kpH`
    document.getElementById('val-3').textContent = `Humidity: ${data.current.humidity} %`
    document.getElementById('val-4').textContent = `Visibility: ${data.current.vis_km} km`

    let forecastWrap = document.createElement('div')
    forecastWrap.classList.add('forecast-wrap')
    homeWrap.appendChild(forecastWrap)
    for (let i = 0; i < 3; i++) {
        let forecastItem = document.createElement('div')
        forecastItem.classList.add('forecast-item')
        forecastItem.id = `forecast-${i}`
        forecastWrap.appendChild(forecastItem)
    }
    document.querySelectorAll('.forecast-item').forEach(i => {
        let forDay = document.createElement('div')
        let forCond = document.createElement('div')
        let forIcon = document.createElement('img')
        let forTemp = document.createElement('div')
        forDay.classList.add('day')
        forCond.classList.add('icon')
        forTemp.classList.add('forecast-temp')
        forIcon.classList.add('f_icon')
        forCond.appendChild(forIcon)
        i.appendChild(forDay)
        i.appendChild(forCond)
        i.appendChild(forTemp)
    })
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`)
        .then(resp => resp.json())
        .then(data => {
            document.querySelectorAll('.day').forEach((i, index) => {
                let date = data.forecast.forecastday[index].date.slice(5).split('-');
                [date[0], date[1]] = [date[1], date[0]]
                i.textContent = date.join('.')
            })
            document.querySelectorAll('.f_icon').forEach((i, index) => {
                i.src = data.forecast.forecastday[index].day.condition.icon
            })
            document.querySelectorAll('.forecast-temp').forEach((i, index) => {
                i.textContent = `from ${Math.floor(data.forecast.forecastday[index].day.mintemp_c)} to ${Math.floor(data.forecast.forecastday[index].day.maxtemp_c)} °C`
            })
        })

    if (isDark) {
        document.body.classList.add('dark')
        navWrap.classList.add('dark')
        document.querySelectorAll('.link').forEach(i => i.classList.add('dark'))
        input.classList.add('dark')
        searchBtn.classList.add('dark')
        themeBtn.classList.add('dark')
        document.querySelector('.city').classList.add('dark')
        document.querySelector('.temp').classList.add('dark')
        document.querySelector('.condition').classList.add('dark')
        document.querySelectorAll('.values').forEach(i => i.classList.add('dark'))
        document.querySelectorAll('.day').forEach(i => i.classList.add('dark'))
        document.querySelectorAll('.forecast-temp').forEach(i => i.classList.add('dark'))
        document.querySelectorAll('.city-name').forEach(i => i.classList.add('dark'))
        document.querySelectorAll('.city-temp').forEach(i => i.classList.add('dark'))
    }else {
        document.body.classList.remove('dark')
        navWrap.classList.remove('dark')
        document.querySelectorAll('.link').forEach(i => i.classList.remove('dark'))
        input.classList.remove('dark')
        searchBtn.classList.remove('dark')
        themeBtn.classList.remove('dark')
        document.querySelector('.city').classList.remove('dark')
        document.querySelector('.temp').classList.remove('dark')
        document.querySelector('.condition').classList.remove('dark')
        document.querySelectorAll('.values').forEach(i => i.classList.remove('dark'))
        document.querySelectorAll('.day').forEach(i => i.classList.remove('dark'))
        document.querySelectorAll('.forecast-temp').forEach(i => i.classList.remove('dark'))
        document.querySelectorAll('.city-name').forEach(i => i.classList.remove('dark'))
        document.querySelectorAll('.city-temp').forEach(i => i.classList.remove('dark'))
    }
}


export { API_KEY, city, wrap, input, navWrap, searchBtn, themeBtn, isDark, createTemplate }