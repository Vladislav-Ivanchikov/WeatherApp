import "./styles/styles.css"
import { wrap, input, navWrap, searchBtn, themeBtn, createTemplate } from './createTemplate'
import createOptions from "./createOptions";
import router from "./router";
export {API_KEY, city, dataList, isDark, showHome, showFavorites}

const API_KEY = '3a1c537e919545d1bf9114546212110';
let city = 'gomel';
let isDark = false;
const closeCross = 'https://cdn-icons.flaticon.com/png/512/656/premium/656958.png?token=exp=1635848007~hmac=ea047b966e3cefad02516927880ae3b5'

let favorites = document.getElementById('favorites')
const dataList = document.getElementById('city')

export function init() {
    fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`)
        .then(response => response.json())
        .then(data => {
            if(data){
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

function addCity () {
    search()
    const favCity = new City(city, app)
    app.addCity(favCity)
    showHome()
    input.value = ''
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
        console.log(city)
    }

    removeCity(city) {
        this.cities = this.cities.filter(item => {
            console.log(item.name)
            console.log(city.name)
            return item.name !== city.name
        })
        // const indexToDel = this.cities.findIndex(item => {
        //     return item.name === city.name
        // })
        // this.cities.splice(indexToDel, 1)
        this.render()
        this.saveIntoStorage()
        console.log(this.cities);
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
    constructor(name, app) {
        this.name = name
        this.app = app
    }

    async getWeather() {
        if (this.name){
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
           <div class="city-name">${this.name}</div>
        <div class="city-cond">
            <img src=${data.condition.icon} alt="icon">
        </div>
        <div class="city-temp">${Math.floor(data.temp_c)}°C</div> 
        <div>
            <img class="city-delete" src=${closeCross} alt="x">
        </div>
        `
            favorWrap.appendChild(cityCard)
            const deleteBtn = document.querySelectorAll('.city-delete')
            deleteBtn.forEach(item => item.addEventListener('click', () => {
                this.app.removeCity(this)
                init()
            }))

            const cityName = document.querySelectorAll('.city-name')
            cityName.forEach(c => {
                c.addEventListener('click', e => {
                    city = e.target.innerText
                    init()
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

function showFavorites() {
    favorites.classList.remove('hide')
    wrap.classList.add('hide')
}

function showHome() {
    favorites.classList.add('hide')
    wrap.classList.remove('hide')
}

window.addEventListener('load', () => {
    const location = window.location.hash
    router(location)
})

navWrap.addEventListener('click', (el) => {
    const location = el.target.dataset.href
    if (location) {
        router(location)
    }
})