const puppeteer = require('puppeteer');
const async = require('async');
const _ = require('underscore');
const fs = require("fs");
const request = require("request");

const database = process.cwd() + '/database/';
const controllers = require(database + 'controllers');
const movies = controllers.movies;
const dates = controllers.dates;
const dateMovies = controllers.dateMovies;

let today = new Date();

// Массив для хранения дат за период (в данном случае - 28 дней)
let month28days = [today.toISOString().substring(0, 10)];

// Заполнение массива датами в виде строк формата yyyy-mm-dd
for (var i = 1; i < 28; i++) {
    let date = new Date();
    date.setDate(today.getDate() - i);
    month28days.push(date.toISOString().substring(0, 10));
}


// Функция для парсинга информации из таблицы рейтинга фильмов за 28 дней
let scrapeTopMonthMovies = () => {
    return new Promise((resolve, reject) => {
        let allmovies = [];

        // Создаем объект браузера
        const _browser = puppeteer.launch({
            headless: false,
            args: ['--start-maximized']
        });

        // Асинхронно проходимся по всем датам 
        async.each(month28days, (dayString, callback) => {
                // Вызываем функцию для парсинга таблицы с топ-250 фильмов за конкретный день
                scrapeMoviesTableByDate(_browser, dayString).then(movies => {
                    // Создаем поле с датой для каждого объекта-фильма
                    movies.forEach(movie => {
                        movie.date = dayString;
                    });
                    // Добавляем фильмы в общий список
                    allmovies = allmovies.concat(movies);
                    callback();
                }).catch(err => {
                    callback(err);
                });
            },
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    // Закрываем браузер
                    _browser.then(browser => browser.close());
                    resolve(allmovies);
                }
            });
    });
};

// Функция для парсинга таблицы с топ-250 фильмов за конкретный день
let scrapeMoviesTableByDate = (_browser, dayString) => {
    return new Promise((resolve, reject) => {
        try {
            let _page;
            _browser.then(browser => (_page = browser.newPage())) // Создаем новую страницу
                .then(page => page.goto(`https://www.kinopoisk.ru/top/day/${dayString}`, {
                    waitUntil: 'domcontentloaded'
                })) // Переходим по вкладке
                .then(() => _page)
                .then(page => page.$$eval( // Находим на странице все элементы, удовлетворяющие условию селектора
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
                    })
                )).then(movies => {
                    // Закрываем вкладку
                    _page.then(page => page.close());
                    resolve(movies);
                });
        } catch (err) {
            reject(err);
        }
    });
}

// Функция для парсинга описания на странице фильма и загрузки его в превью в папку public/previews
let scrapeMoviesInfo = (moviesArray) => {
    return new Promise((resolve, reject) => {
        let size = 5; //размер подмассива, чтобы КиноПоиск не выдал сообщение о превышении количества обращений
        let subarray = []; //массив в который будет выведен результат.
        for (let i = 0; i < Math.ceil(moviesArray.length / size); i++) {
            subarray[i] = moviesArray.slice((i * size), (i * size) + size);
        }

        // Открываем браузер
        const _browser = puppeteer.launch({
            headless: false,
            args: ['--start-maximized']
        });

        // Функция для открытия вкладок с фильмами
        let asyncFunc = (movies5Array) => {
            return new Promise((resolve, reject) => {
                async.each(movies5Array, (movie, callback) => {
                        // Вызов функции дял парсинга описания фильма и получения ссылки на его превью
                        scrapeMovieInfo(_browser, movie.link).then(movieInfo => {
                            try {
                                let imagePath = "/previews/preview" + '-' + Date.now() + ".jpg";
                                // Функция для сохранения превью фильма
                                downloadMoviePreview(movieInfo.imageUrl, "public" + imagePath);
                                movie.image = imagePath;
                                movie.description = movieInfo.description;
                                callback();
                            } catch (err) {
                                callback(err);
                            }
                        }).catch(err => {
                            callback(err);
                        });

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
            .then(() => resolve(_browser.then(browser => browser.close())))
            .catch(err => reject(err));
    });
};

// Функия для парсинга описания фильма и получения ссылки на его превью
let scrapeMovieInfo = (_browser, movieLink) => {
    return new Promise((resolve, reject) => {
        try {
            let _page;
            let _description = '';
            let _imageUrl = '';

            _browser.then(browser => (_page = browser.newPage())) // Открываем новую вкладку
                .then(page => page.goto(movieLink, { // Переходим на страницу фильма
                    waitUntil: 'domcontentloaded'
                }))
                .then(() => _page)
                .then(page => page.$eval( // Находим на странице элемент, удовлетворяющий условию селектора (элемент с описанием фильма)
                    ".film-synopsys",
                    element => {
                        return element.innerText;
                    }
                ))
                .then(description => {
                    _description = description;
                })
                .then(() => _page)
                .then(page => page.$eval( // Находим на странице элемент, удовлетворяющий условию селектора (элемент с превью фильма)
                    "a.popupBigImage > img",
                    element => {
                        return element.src; // Возвращаем ссылку на превью фильма
                    }
                ))
                .then(imageUrl => {
                    _imageUrl = imageUrl;
                })
                .then(() => _page)
                .then(page => {
                    page.close(); // закрываем вкладку
                    resolve({
                        description: _description,
                        imageUrl: _imageUrl
                    });
                });
        } catch (err) {
            reject(err);
        }
    });
}


// Функция для получения изображения по ссылке и его сохранения по указанному пути на локальном сервере
let downloadMoviePreview = (uri, filename) => {
    request.head(uri, (err, res, body) => {
        request(uri)
            .pipe(fs.createWriteStream(filename));
    });
}


scrapeTopMonthMovies().then((scrapedMovies) => {

    // Из списка всех фильмов выбираем только фильмы с уникальным названием
    var uniqueMovies = _.uniq(scrapedMovies, (movie) => {
        return movie.name;
    });

    // Сохраняем даты в БД
    dates.createDates(month28days).then((datesEntities) => {
        // Получаем информцию об описании фильмов и их превью
        scrapeMoviesInfo(uniqueMovies).then(() => {
            // Сохраняем записи с фильмами в БД
            movies.createMovies(uniqueMovies).then((moviesEntities) => {
                let movies = moviesEntities.map(movie => {
                    return movie.dataValues
                });
                let dates = datesEntities.map(date => {
                    return date.dataValues
                });

                dates.forEach((date) => {
                    // Находим все записи с фильмами за указанную дату
                    let topMoviesByDate = scrapedMovies.filter(movie => {
                        return movie.date.toString() === date.date.toString();
                    });

                    // Создаем записи для сохранения в БД позиций фильмов на указанную дату
                    let moviesWithPositionsByDate = topMoviesByDate.map(topMov => {
                        let currMovie = movies.find(movie => {
                            return topMov.name.toString() === movie.name.toString();
                        });
                        return {
                            dateId: date.id,
                            movieId: currMovie.id,
                            position: topMov.position
                        }
                    });

                    // Сохраняем данные с позициями фильмов и foreign key на записи с датами и фильмами из других таблиц
                    dateMovies.createDateMovies(moviesWithPositionsByDate).then((dateMoviesEntities) => {});
                });
            });
        });
    });
}).catch((err) => {
    console.log("Error: " + err.message);
});