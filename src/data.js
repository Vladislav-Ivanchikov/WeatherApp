//const fetch = (url) => import('node-fetch').then(({default: fetch}) => fetch(url));
import "./styles/styles.css"
import {wrap, navWrap, searchBtn, themeBtn, createTemplate} from './modules/createTemplate'
import router from "./modules/router";
import createOptions from './modules/createOptions'

const API_KEY = '3a1c537e919545d1bf9114546212110';
let city = 'london';
let isDark = false;
const closeCross = 'https://cdn-icons.flaticon.com/png/512/656/premium/656958.png?token=exp=1635848007~hmac=ea047b966e3cefad02516927880ae3b5'

let favorites = document.getElementById('favorites')
const dataList = document.getElementById('city')
const input = document.getElementById('search-city')

export function init() {
    fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                createTemplate(data)
            }
        })
        .catch(() => {
            alert('Weather data not load')
            city = 'london'
        })
}

function filter(val, data) {
    return data.filter(i => i.name.toLowerCase().indexOf(val.toLowerCase()) !== -1)
}

function search() {
    city = input.value
    init()
}

window.onload = () => {
    class App {
        constructor(el) {
            this.el = el
            const citiesJson = localStorage.getItem('cities')
            let cities = []
            if (citiesJson) {
                cities = JSON.parse(citiesJson)
            }
            this.cities = cities.map(city => new City(city.name, this))
            this.render()
        }

        addCity(city) {
            this.cities.push(city)
            this.render()
            this.saveIntoStorage()
        }

        removeCity(city) {
            this.cities = this.cities.filter(item => {
                return item.name.match(/^\w+/)[0] !== city
            })
            this.render()
            this.saveIntoStorage()
        }

        render() {
            this.el.innerHTML = ''
            this.cities.map(city => city.render(this.el))
        }

        saveIntoStorage() {
            localStorage.setItem('cities', JSON.stringify(this.cities))
        }
    }

    class City {
        constructor(name) {
            this.name = name
        }

        async getWeather() {
            if (this.name) {
                const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${this.name}`)
                    .then(resp => resp.json())
                return res.current
            }
        }

        async render(favorWrap) {
            const data = await this.getWeather()
            if (data) {
                const cityCard = document.createElement('div')
                cityCard.classList.add('city-card')

                cityCard.innerHTML = `
           <div class="city-name">${this.name.match(/^\w+/)}</div>
        <div class="city-cond">
            <img src=${data.condition.icon} alt="icon">
        </div>
        <div class="city-temp">${Math.floor(data.temp_c)} °C</div> 
        <div>
            <img class="city-delete" src=${closeCross} data-value=${this.name.match(/^\w+/)} alt="x">
        </div>
        `
                favorWrap.appendChild(cityCard)

                const cityName = document.querySelectorAll('.city-name')
                cityName.forEach(c => {
                    c.addEventListener('click', e => {
                        city = e.target.innerText
                        init()
                        window.location.hash = '/'
                        showHome()
                    })
                })
            }
        }

        toJSON() {
            return {name: this.name}
        }
    }

    const app = new App(favorites)

    function addCity() {
        search()
        const favCity = new City(city, app)
        app.addCity(favCity)
        showHome()
        input.value = ''
    }

    input.oninput = () => {
        city = input.value
        if (city) {
            fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${city}`)
                .then(response => {
                    if (response.ok) {
                        let newOption
                        response.json()
                            .then(data => {
                                newOption = filter(input.value, data)
                                newOption.map(item => {
                                    if (item.name)
                                        createOptions(data)
                                })
                            })
                    }else {
                        alert('Weather data not load')
                    }
                })
        }
    }

    input.onchange = () => {
        while (dataList.firstChild) {
            dataList.removeChild(dataList.firstChild)
        }
    }

    function changeTheme() {
        if (document.body.className === 'dark') {
            themeBtn.innerText = 'Dark'
            isDark = false
        } else {
            themeBtn.innerText = 'Light'
            isDark = true
        }
        init()
    }

    searchBtn.addEventListener('click', () => {
        addCity()
    })

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addCity()
        }
    })

    themeBtn.addEventListener('click', changeTheme)

    favorites.addEventListener('click', (e) => {
        app.removeCity(e.target.dataset.value)
        init()
    })

    navWrap.addEventListener('click', (el) => {
        const location = el.target.dataset.href
        if (location) {
            router(location)
        }
    })
    const location = window.location.hash
    router(location)
}

function showFavorites() {
    favorites.classList.remove('hide')
    wrap.classList.add('hide')
}

function showHome() {
    favorites.classList.add('hide')
    wrap.classList.remove('hide')
}

export {API_KEY, city, dataList, isDark, input, showHome, showFavorites, filter}