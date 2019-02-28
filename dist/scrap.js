'use strict';

var _puppeteer = require('puppeteer');

var _puppeteer2 = _interopRequireDefault(_puppeteer);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var controllers = require('./database/controllers');

var movies = controllers.movies;
var dates = controllers.dates;
var dateMovies = controllers.dateMovies;

var today = new Date();

// Массив для хранения дат за период (в данном случае - 28 дней)
var month28days = [today.toISOString().substring(0, 10)];

// Заполнение массива датами в виде строк формата yyyy-mm-dd
for (var i = 1; i < 28; i++) {
    var date = new Date();
    date.setDate(today.getDate() - i);
    month28days.push(date.toISOString().substring(0, 10));
}

// Функция для парсинга информации из таблицы рейтинга фильмов за 28 дней
var scrapeTopMonthMovies = function scrapeTopMonthMovies() {
    return new Promise(function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(resolve, reject) {
            var allmovies, browser;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            allmovies = [];

                            // Создаем объект браузера

                            _context3.next = 3;
                            return _puppeteer2.default.launch({
                                headless: false,
                                args: ['--start-maximized']
                            });

                        case 3:
                            browser = _context3.sent;


                            // Асинхронно проходимся по всем датам 
                            _async2.default.each(month28days, function () {
                                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dayString, callback) {
                                    var _movies;

                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    _context.prev = 0;
                                                    _context.next = 3;
                                                    return scrapeMoviesTableByDate(browser, dayString);

                                                case 3:
                                                    _movies = _context.sent;

                                                    // Создаем поле с датой для каждого объекта-фильма
                                                    _movies.forEach(function (movie) {
                                                        movie.date = dayString;
                                                    });
                                                    // Добавляем фильмы в общий список
                                                    allmovies = allmovies.concat(_movies);
                                                    callback();
                                                    _context.next = 12;
                                                    break;

                                                case 9:
                                                    _context.prev = 9;
                                                    _context.t0 = _context['catch'](0);

                                                    callback(_context.t0);

                                                case 12:
                                                case 'end':
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, undefined, [[0, 9]]);
                                }));

                                return function (_x3, _x4) {
                                    return _ref2.apply(this, arguments);
                                };
                            }(), function () {
                                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(err) {
                                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                        while (1) {
                                            switch (_context2.prev = _context2.next) {
                                                case 0:
                                                    if (!err) {
                                                        _context2.next = 4;
                                                        break;
                                                    }

                                                    reject(err);
                                                    _context2.next = 7;
                                                    break;

                                                case 4:
                                                    _context2.next = 6;
                                                    return browser.close();

                                                case 6:
                                                    resolve(allmovies);

                                                case 7:
                                                case 'end':
                                                    return _context2.stop();
                                            }
                                        }
                                    }, _callee2, this);
                                }));

                                return function (_x5) {
                                    return _ref3.apply(this, arguments);
                                };
                            }());

                        case 5:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }());
};

// Функция для парсинга таблицы с топ-250 фильмов за конкретный день
var scrapeMoviesTableByDate = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(browser, dayString) {
        var page, movies;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return browser.newPage();

                    case 2:
                        page = _context4.sent;
                        _context4.next = 5;
                        return page.goto('https://www.kinopoisk.ru/top/day/' + dayString, {
                            waitUntil: 'domcontentloaded'
                        });

                    case 5:
                        _context4.next = 7;
                        return page.$$eval( // Находим на странице все элементы, удовлетворяющие условию селектора
                        "[id^='top250_place_']", function (nodes) {
                            return nodes.map(function (element) {
                                // Получаем данные из элементов на странице
                                var position = element.querySelector("td:nth-child(1) > a").getAttribute("name");
                                var fullName = element.querySelector("td:nth-child(2) > a") ? element.querySelector("td:nth-child(2) > a").innerText : null;
                                var rate = element.querySelector("td:nth-child(3) > div a") ? parseFloat(element.querySelector("td:nth-child(3) > div a").innerText) : null;
                                var originName = element.querySelector("td:nth-child(2) > span") !== null ? element.querySelector("td:nth-child(2) > span").innerText : null;
                                var link = element.querySelector("td:nth-child(2) > a").href;

                                // Возвращаем новый объект с данными о фильме
                                return {
                                    position: position,
                                    name: fullName.substring(0, fullName.length - 7),
                                    origin_name: originName ? originName : fullName.substring(0, fullName.length - 7),
                                    rate: rate,
                                    year: fullName.substring(fullName.length - 5, fullName.length - 1),
                                    link: link
                                };
                            });
                        });

                    case 7:
                        movies = _context4.sent;
                        _context4.next = 10;
                        return page.close();

                    case 10:
                        return _context4.abrupt('return', movies);

                    case 11:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function scrapeMoviesTableByDate(_x6, _x7) {
        return _ref4.apply(this, arguments);
    };
}();

// Функция для парсинга описания на странице фильма и загрузки его в превью в папку public/previews
var scrapeMoviesInfo = function scrapeMoviesInfo(moviesArray) {
    return new Promise(function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(resolve, reject) {
            var size, subarray, _i, _browser, asyncFunc, promisesQueue;

            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            size = 5; //размер подмассива, чтобы КиноПоиск не выдал сообщение о превышении количества обращений

                            subarray = []; //массив в который будет выведен результат.

                            for (_i = 0; _i < Math.ceil(moviesArray.length / size); _i++) {
                                subarray[_i] = moviesArray.slice(_i * size, _i * size + size);
                            }

                            // Открываем браузер
                            _context6.next = 5;
                            return _puppeteer2.default.launch({
                                headless: false,
                                args: ['--start-maximized']
                            });

                        case 5:
                            _browser = _context6.sent;

                            // Функция для открытия вкладок с фильмами
                            asyncFunc = function asyncFunc(movies5Array) {
                                return new Promise(function (resolve, reject) {
                                    _async2.default.each(movies5Array, function () {
                                        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(movie, callback) {
                                            var movieInfo, imagePath;
                                            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                                while (1) {
                                                    switch (_context5.prev = _context5.next) {
                                                        case 0:
                                                            _context5.prev = 0;
                                                            _context5.next = 3;
                                                            return scrapeMovieInfo(browser, movie.link);

                                                        case 3:
                                                            movieInfo = _context5.sent;
                                                            imagePath = "/previews/preview" + '-' + Date.now() + ".jpg";
                                                            // Функция для сохранения превью фильма

                                                            downloadMoviePreview(movieInfo.imageUrl, "public" + imagePath);
                                                            movie.image = imagePath;
                                                            movie.description = movieInfo.description;
                                                            callback();
                                                            _context5.next = 14;
                                                            break;

                                                        case 11:
                                                            _context5.prev = 11;
                                                            _context5.t0 = _context5['catch'](0);

                                                            callback(_context5.t0);

                                                        case 14:
                                                        case 'end':
                                                            return _context5.stop();
                                                    }
                                                }
                                            }, _callee5, undefined, [[0, 11]]);
                                        }));

                                        return function (_x10, _x11) {
                                            return _ref6.apply(this, arguments);
                                        };
                                    }(), function (err) {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve();
                                        }
                                    });
                                });
                            };

                            // Функция для последовательного вызова promises


                            promisesQueue = function promisesQueue(arrayArrayMovies) {
                                return arrayArrayMovies.reduce(function (promise, movieArray) {
                                    return promise.then(function (result) {
                                        return asyncFunc(movieArray).then(function (result) {});
                                    }).catch(function (err) {
                                        console.log(err.message);
                                    });
                                }, Promise.resolve());
                            };

                            promisesQueue(subarray).then(function () {
                                return resolve(_browser.then(function (browser) {
                                    return browser.close();
                                }));
                            }).catch(function (err) {
                                return reject(err);
                            });

                        case 9:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, undefined);
        }));

        return function (_x8, _x9) {
            return _ref5.apply(this, arguments);
        };
    }());
};

// Функия для парсинга описания фильма и получения ссылки на его превью
var scrapeMovieInfo = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(browser, movieLink) {
        var page, description, imageUrl;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return browser.newPage();

                    case 2:
                        page = _context7.sent;
                        _context7.next = 5;
                        return page.goto(movieLink, { // Переходим на страницу фильма
                            waitUntil: 'domcontentloaded'
                        });

                    case 5:
                        _context7.next = 7;
                        return page.$eval( // Находим на странице элемент, удовлетворяющий условию селектора (элемент с описанием фильма)
                        ".film-synopsys", function (element) {
                            return element.innerText;
                        });

                    case 7:
                        description = _context7.sent;
                        _context7.next = 10;
                        return page.$eval( // Находим на странице элемент, удовлетворяющий условию селектора (элемент с превью фильма)
                        "a.popupBigImage > img", function (element) {
                            return element.src; // Возвращаем ссылку на превью фильма
                        });

                    case 10:
                        imageUrl = _context7.sent;
                        _context7.next = 13;
                        return page.close();

                    case 13:
                        return _context7.abrupt('return', {
                            description: description,
                            imageUrl: imageUrl
                        });

                    case 14:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function scrapeMovieInfo(_x12, _x13) {
        return _ref7.apply(this, arguments);
    };
}();

// Функция для получения изображения по ссылке и его сохранения по указанному пути на локальном сервере
var downloadMoviePreview = function downloadMoviePreview(uri, filename) {
    _request2.default.head(uri, function (err, res, body) {
        (0, _request2.default)(uri).pipe(_fs2.default.createWriteStream(filename));
    });
};

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var scrapedMovies, uniqueMovies, moviesEntities, moviesValues, datesEntities, datesValues;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
            switch (_context9.prev = _context9.next) {
                case 0:
                    _context9.prev = 0;
                    _context9.next = 3;
                    return scrapeTopMonthMovies();

                case 3:
                    scrapedMovies = _context9.sent;


                    // Из списка всех фильмов выбираем только фильмы с уникальным названием
                    uniqueMovies = _underscore2.default.uniq(scrapedMovies, function (movie) {
                        return movie.name;
                    });
                    _context9.next = 7;
                    return scrapeMoviesInfo(uniqueMovies);

                case 7:
                    _context9.next = 9;
                    return movies.createMovies(uniqueMovies);

                case 9:
                    moviesEntities = _context9.sent;
                    moviesValues = moviesEntities.map(function (movie) {
                        return movie.dataValues;
                    });

                    // Сохраняем даты в БД

                    _context9.next = 13;
                    return dates.createDates(month28days);

                case 13:
                    datesEntities = _context9.sent;
                    datesValues = datesEntities.map(function (date) {
                        return date.dataValues;
                    });


                    datesValues.forEach(function () {
                        var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(date) {
                            var topMoviesByDate, moviesWithPositionsByDate;
                            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                                while (1) {
                                    switch (_context8.prev = _context8.next) {
                                        case 0:
                                            // Находим все записи с фильмами за указанную дату
                                            topMoviesByDate = scrapedMovies.filter(function (movie) {
                                                return movie.date.toString() === date.date.toString();
                                            });

                                            // Создаем записи для сохранения в БД позиций фильмов на указанную дату

                                            moviesWithPositionsByDate = topMoviesByDate.map(function (topMov) {
                                                var currMovie = moviesValues.find(function (movie) {
                                                    return topMov.name.toString() === movie.name.toString();
                                                });
                                                return {
                                                    dateId: date.id,
                                                    movieId: currMovie.id,
                                                    position: topMov.position
                                                };
                                            });

                                            // Сохраняем данные с позициями фильмов и foreign key на записи с датами и фильмами из других таблиц

                                            _context8.next = 4;
                                            return dateMovies.createDateMovies(moviesWithPositionsByDate);

                                        case 4:
                                        case 'end':
                                            return _context8.stop();
                                    }
                                }
                            }, _callee8, undefined);
                        }));

                        return function (_x14) {
                            return _ref9.apply(this, arguments);
                        };
                    }());
                    _context9.next = 21;
                    break;

                case 18:
                    _context9.prev = 18;
                    _context9.t0 = _context9['catch'](0);

                    console.log("Error: " + _context9.t0.message);

                case 21:
                case 'end':
                    return _context9.stop();
            }
        }
    }, _callee9, undefined, [[0, 18]]);
}))();