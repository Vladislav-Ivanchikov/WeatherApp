import {dataList} from "./data";

export default function createOptions(data) {
    dataList.innerHTML = ''
    if (data) {
        for (let i = 0; i < 3; i++) {
            if (data.length > 0){
                console.log(data.length)
                let option = document.createElement('option')
                if (data[i].name !== undefined){
                    option.value = data[i].name
                    option.text = data[i].name
                    dataList.appendChild(option)
                }

            }
        }
    }
}