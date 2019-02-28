import puppeteer from 'puppeteer';
import async from 'async';
import _ from 'underscore';
import fs from "fs";
import request from "request";

import controllers from './database/controllers';

const movies = controllers.movies;
const dates = controllers.dates;
const dateMovies = controllers.dateMovies;

let today = new Date();

// Массив для хранения дат за период (в данном случае - 28 дней)
let month28days = [today.toISOString().substring(0, 10)];

// Заполнение массива датами в виде строк формата yyyy-mm-dd
for (let i = 1; i < 28; i++) {
    let date = new Date();
    date.setDate(today.getDate() - i);
    month28days.push(date.toISOString().substring(0, 10));
}

// Функция для парсинга информации из таблицы рейтинга фильмов за 28 дней
let scrapeTopMonthMovies = () => {
    return new Promise(async (resolve, reject) => {
        let allmovies = [];

        // Создаем объект браузера
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--start-maximized']
        });

        // Асинхронно проходимся по всем датам 
        async.each(month28days, async (dayString, callback) => {
                try {
                    // Вызываем функцию для парсинга таблицы с топ-250 фильмов за конкретный день
                    let movies = await scrapeMoviesTableByDate(browser, dayString);
                    // Создаем поле с датой для каждого объекта-фильма
                    movies.forEach(movie => {
                        movie.date = dayString;
                    });
                    // Добавляем фильмы в общий список
                    allmovies = allmovies.concat(movies);
                    callback();
                } catch (err) {
                    callback(err);
                }
            },
            async function (err) {
                if (err) {
                    reject(err);
                } else {
                    // Закрываем браузер
                    await browser.close();
                    resolve(allmovies);
                }
            });
    });
};

// Функция для парсинга таблицы с топ-250 фильмов за конкретный день
let scrapeMoviesTableByDate = async (browser, dayString) => {
    const page = await browser.newPage();
    await page.goto(`https://www.kinopoisk.ru/top/day/${dayString}`, {
        waitUntil: 'domcontentloaded'
    });

    let movies = await page.$$eval( // Находим на странице все элементы, удовлетворяющие условию селектора
        "[id^='top250_place_']",
        nodes =>
        nodes.map(element => {
            // Получаем данные из элементов на странице
            let position = element.querySelector("td:nth-child(1) > a").getAttribute("name");
            let fullName = element.querySelector("td:nth-child(2) > a") ? element.querySelector("td:nth-child(2) > a").innerText : null;
            let rate = element.querySelector("td:nth-child(3) > div a") ? parseFloat(element.querySelector("td:nth-child(3) > div a").innerText) : null;
            let originName = element.querySelector("td:nth-child(2) > span") !== null ? element.querySelector("td:nth-child(2) > span").innerText : null;
            let link = element.querySelector("td:nth-child(2) > a").href;

            // Возвращаем новый объект с данными о фильме
            return {
                position: position,
                name: fullName.substring(0, fullName.length - 7),
                origin_name: originName ? originName : fullName.substring(0, fullName.length - 7),
                rate: rate,
                year: fullName.substring(fullName.length - 5, fullName.length - 1),
                link: link
            };
        }));

    await page.close();
    return movies;
}

// Функция для парсинга описания на странице фильма и загрузки его в превью в папку public/previews
let scrapeMoviesInfo = (moviesArray) => {
    return new Promise(async (resolve, reject) => {
        let size = 5; //размер подмассива, чтобы КиноПоиск не выдал сообщение о превышении количества обращений
        let subarray = []; //массив в который будет выведен результат.
        for (let i = 0; i < Math.ceil(moviesArray.length / size); i++) {
            subarray[i] = moviesArray.slice((i * size), (i * size) + size);
        }

        // Открываем браузер
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--start-maximized']
        });

        // Функция для открытия вкладок с фильмами
        let asyncFunc = (movies5Array) => {
            return new Promise((resolve, reject) => {
                async.each(movies5Array, async (movie, callback) => {
                        try {
                            // Вызов функции дял парсинга описания фильма и получения ссылки на его превью
                            let movieInfo = await scrapeMovieInfo(browser, movie.link);
                            let imagePath = "/previews/preview" + '-' + Date.now() + ".jpg";
                            // Функция для сохранения превью фильма
                            downloadMoviePreview(movieInfo.imageUrl, "public" + imagePath);
                            movie.image = imagePath;
                            movie.description = movieInfo.description;
                            callback();
                        } catch (err) {
                            callback(err);
                        }
                    },
                    function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
            });
        }

        // Функция для последовательного вызова promises
        let promisesQueue = (arrayArrayMovies) => {
            return arrayArrayMovies.reduce((promise, movieArray) => {
                return promise
                    .then((result) => {
                        return asyncFunc(movieArray).then(result => {});
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            }, Promise.resolve());
        }

        promisesQueue(subarray)
            .then(() => resolve(browser.close()))
            .catch(err => reject(err));
    });
};

// Функия для парсинга описания фильма и получения ссылки на его превью
let scrapeMovieInfo = async (browser, movieLink) => {
    const page = await browser.newPage();
    await page.goto(movieLink, { // Переходим на страницу фильма
        waitUntil: 'domcontentloaded'
    });

    let description = await page.$eval( // Находим на странице элемент, удовлетворяющий условию селектора (элемент с описанием фильма)
        ".film-synopsys",
        element => {
            return element.innerText;
        }
    );

    let imageUrl = await page.$eval( // Находим на странице элемент, удовлетворяющий условию селектора (элемент с превью фильма)
        "a.popupBigImage > img",
        element => {
            return element.src; // Возвращаем ссылку на превью фильма
        }
    );

    await page.close(); // закрываем вкладку

    return {
        description: description,
        imageUrl: imageUrl
    }
}


// Функция для получения изображения по ссылке и его сохранения по указанному пути на локальном сервере
let downloadMoviePreview = (uri, filename) => {
    request.head(uri, (err, res, body) => {
        request(uri)
            .pipe(fs.createWriteStream(filename));
    });
}

(async () => {
    try {
        // Парсим с сайта таблицы с топ-250 фильмов за указанный период (28 дней)
        let scrapedMovies = await scrapeTopMonthMovies();

        // Из списка всех фильмов выбираем только фильмы с уникальным названием
        var uniqueMovies = _.uniq(scrapedMovies, (movie) => {
            return movie.name;
        });

        await scrapeMoviesInfo(uniqueMovies);

        // Сохраняем записи с фильмами в БД
        let moviesEntities = await movies.createMovies(uniqueMovies);
        let moviesValues = moviesEntities.map(movie => {
            return movie.dataValues
        });

        // Сохраняем даты в БД
        let datesEntities = await dates.createDates(month28days);
        let datesValues = datesEntities.map(date => {
            return date.dataValues
        });

        datesValues.forEach(async (date) => {
            // Находим все записи с фильмами за указанную дату
            let topMoviesByDate = scrapedMovies.filter(movie => {
                return movie.date.toString() === date.date.toString();
            });

            // Создаем записи для сохранения в БД позиций фильмов на указанную дату
            let moviesWithPositionsByDate = topMoviesByDate.map(topMov => {
                let currMovie = moviesValues.find(movie => {
                    return topMov.name.toString() === movie.name.toString();
                });
                return {
                    dateId: date.id,
                    movieId: currMovie.id,
                    position: topMov.position
                }
            });

            // Сохраняем данные с позициями фильмов и foreign key на записи с датами и фильмами из других таблиц
            await dateMovies.createDateMovies(moviesWithPositionsByDate);
        });
    } catch (err) {
        console.log("Error: " + err.message);
    }
})();