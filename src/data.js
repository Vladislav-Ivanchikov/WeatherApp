import "./styles/styles.css"

const API_KEY = '3a1c537e919545d1bf9114546212110'
const closeCross = 'https://cdn-icons.flaticon.com/png/512/656/premium/656958.png?token=exp=1635848007~hmac=ea047b966e3cefad02516927880ae3b5'

let city = 'london'

const wrap = document.getElementById('wrap')
const navWrap = document.getElementById('nav')
let favorites = document.getElementById('favorites')
let input = document.getElementById('search-city')
const dataList = document.getElementById('city')
const themeBtn = document.getElementById('theme-btn')
const searchBtn = document.getElementById('btn')

function init () {
    fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`)
        .then(response => response.json())
        .then(data => {
            createTemplate(data)
        })
        .catch(() => {
            alert('Weather data not load')
            city = 'london'
        })
}

function createTemplate(data = []) {
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

    for (let i = 0; i < 3; i++){
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

    for (let i = 0; i < 5; i++){
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
    for (let i = 0; i < 3; i++){
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
}

function createOptions(data = []) {
    dataList.innerHTML = ''
    for (let i = 0; i < 3; i++){
        let option = document.createElement('option')
        option.value = data[i].name
        option.text = data[i].name
        dataList.appendChild(option)
    }
}

function filter(val, data) {
    return data.filter(i => i.name.toLowerCase().indexOf(val.toLowerCase()) !== -1)
}

function search() {
    city = input.value
    init()
}

themeBtn.addEventListener('click', changeTheme)

function changeTheme() {
    document.body.classList.toggle('dark')
    navWrap.classList.toggle('dark')
    document.querySelectorAll('.link').forEach(i => i.classList.toggle('dark'))
    input.classList.toggle('dark')
    searchBtn.classList.toggle('dark')
    themeBtn.classList.toggle('dark')
    document.querySelector('.city').classList.toggle('dark')
    document.querySelector('.temp').classList.toggle('dark')
    document.querySelector('.condition').classList.toggle('dark')
    document.querySelectorAll('.values').forEach(i => i.classList.toggle('dark'))
    document.querySelectorAll('.day').forEach(i => i.classList.toggle('dark'))
    document.querySelectorAll('.forecast-temp').forEach(i => i.classList.toggle('dark'))
    document.querySelectorAll('.city-name').forEach(i => i.classList.toggle('dark'))
    document.querySelectorAll('.city-temp').forEach(i => i.classList.toggle('dark'))
    if (themeBtn.className === 'dark'){
        themeBtn.textContent = 'Light'
    }else {
        themeBtn.textContent = 'Dark'
    }
}

input.oninput = () => {
    city = input.value
    fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${city}`)
        .then(response => {
                if (response.ok) {
                    response.json()
                        .then(data => {
                            let newOption = filter(input.value, data)
                            createOptions(newOption)
                        })
                } else {
                    alert('Data not load')
                }
            }
        )

}

input.onchange = () => {
    while (dataList.firstChild) {
        dataList.removeChild(dataList.firstChild)
    }
}

searchBtn.addEventListener('click', () => {
    search()
    const favCity = new City(city, app)
    app.addCity(favCity)
    input.value = ''
})

window.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
        search()
        const favCity = new City(city, app)
        app.addCity(favCity)
        input.value = ''
    }
})

class App {
    constructor(el) {
        this.el = el
        const JSONCities = localStorage.getItem('cities')
        let cities = []
        if (JSONCities) {
            cities = JSON.parse(JSONCities)
        }
        this.cities = cities.map(c => new City(c.name, this))
        this.render()
    }
    addCity (c) {
        this.cities.push(c)
        this.render()
        this.saveIntoStorage()
    }
    removeCity (c) {
        this.cities = this.cities.filter(item => item.name !== c.name)
        this.render()
        this.saveIntoStorage()
        console.log(this.cities);
    }

    render() {
        this.el.innerHTML = ''
        this.cities.forEach(city => city.render(this.el))
    }

    saveIntoStorage() {
        localStorage.setItem('cities', JSON.stringify(this.cities))
    }
}

class City {
    constructor(name, app) {
        this.name = name
        this.app = app
    }

    async getWeather () {
        const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${this.name}`)
            .then(resp => resp.json())
        return res.current
    }

    async render (ctr) {
        const data = await this.getWeather()
        const cityCard = document.createElement('div')
        cityCard.classList.add('city-card')
        cityCard.innerHTML = `
           <div class="city-name">${this.name}</div>
        <div class="city-cond">
            <img src=${data.condition.icon} alt="icon">
        </div>
        <div class="city-temp">${Math.floor(data.temp_c)}°C</div> 
        <div>
            <img class="city-delete" src=${closeCross} alt="x">
        </div>
        `
        ctr.appendChild(cityCard)
        const deleteBtn = document.querySelectorAll('.city-delete')

        const cityName = document.querySelectorAll('.city-name')
        cityName.forEach(c => {
            c.addEventListener('click', e => {
                city = e.target.innerText
                init()
                showFavorites()
            })
        })

        for (let i = 0; i < deleteBtn.length; i++){
            deleteBtn[i].addEventListener('click', () => {
                this.app.removeCity(this)
            })
        }
    }

    toJSON() {
        return {name: this.name}
    }
}

const app = new App(favorites)

function router (location) {
    const routerMap = {
        '#/' : init(),
        '#/favorites/' : showFavorites()
    }
    wrap.innerHTML = routerMap[location]
}

navWrap.addEventListener('click', (el) => {
    const location = el.target.dataset.href
    if (location) {
        router(location)
    }
})

function showFavorites() {
    favorites.classList.toggle('hide')
    wrap.classList.toggle('hide')
}
