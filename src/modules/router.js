import {init, showHome, showFavorites} from "../data";

export default function router(location) {
    switch (location) {
        case '#/':
        case ''  :
            init()
            showHome()
            break
        case '#/favorites' :
            showFavorites()
            break
    }
}
