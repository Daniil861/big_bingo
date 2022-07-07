(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function addLoadedClass() {
        window.addEventListener("load", (function() {
            if (document.querySelector("body")) setTimeout((function() {
                document.querySelector("body").classList.add("_loaded");
            }), 200);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    if (sessionStorage.getItem("preloader")) {
        if (document.querySelector(".preloader")) document.querySelector(".preloader").classList.add("_hide");
        document.querySelector(".wrapper").classList.add("_visible");
    }
    if (sessionStorage.getItem("money")) {
        if (document.querySelector(".check")) document.querySelectorAll(".check").forEach((el => {
            el.textContent = sessionStorage.getItem("money");
        }));
    } else {
        sessionStorage.setItem("money", 3e4);
        if (document.querySelector(".check")) document.querySelectorAll(".check").forEach((el => {
            el.textContent = sessionStorage.getItem("money");
        }));
    }
    if (document.querySelector(".game")) {
        if (+sessionStorage.getItem("money") >= 10) {
            sessionStorage.setItem("current-bet", 10);
            document.querySelectorAll(".table-bet__count").forEach(((item, index) => {
                if (0 == index) item.classList.add("_active");
            }));
        }
    } else sessionStorage.setItem("current-bet", 0);
    const preloader = document.querySelector(".preloader");
    const wrapper = document.querySelector(".wrapper");
    document.documentElement.clientWidth;
    document.documentElement.clientHeight;
    function deleteMoney(count, block) {
        let money = +sessionStorage.getItem("money");
        sessionStorage.setItem("money", money - count);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.add("_delete-money")));
            document.querySelectorAll(block).forEach((el => el.textContent = sessionStorage.getItem("money")));
        }), 500);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_delete-money")));
        }), 1500);
    }
    function checkRemoveAddClass(block, className, item) {
        document.querySelectorAll(block).forEach((item => item.classList.remove(className)));
        item.classList.add(className);
    }
    function noMoney(block) {
        document.querySelectorAll(block).forEach((el => el.classList.add("_no-money")));
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_no-money")));
        }), 1e3);
    }
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    function addMoney(count, block, delay, delay_off) {
        let money = Math.floor(+sessionStorage.getItem("money") + count);
        setTimeout((() => {
            sessionStorage.setItem("money", money);
            document.querySelectorAll(block).forEach((el => el.textContent = sessionStorage.getItem("money")));
            document.querySelectorAll(block).forEach((el => el.classList.add("_anim-add-money")));
        }), delay);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_anim-add-money")));
        }), delay_off);
    }
    function get_random_num_arr(mn, mx, length) {
        function get_rand(mn, mx) {
            return Math.floor(Math.random() * (mx - mn) + mn);
        }
        let arr = [];
        let count = 0;
        return function back() {
            if (count == length) return arr;
            if (0 == arr.length) {
                let num1 = get_rand(mn, mx);
                arr.push(num1);
                count++;
            }
            if (arr.length == count) {
                let num = get_rand(mn, mx);
                if (true == arr.includes(num)) return back(mn, mx);
                arr.push(num);
                count++;
                return back(mn, mx);
            }
        };
    }
    let anim_items = document.querySelectorAll(".icon-anim img");
    function getRandomAnimate() {
        let number = getRandom(0, 3);
        let arr = [ "jump", "scale", "rotate" ];
        let random_item = getRandom(0, anim_items.length);
        anim_items.forEach((el => {
            if (el.classList.contains("_anim-icon-jump")) el.classList.remove("_anim-icon-jump"); else if (el.classList.contains("_anim-icon-scale")) el.classList.remove("_anim-icon-scale"); else if (el.classList.contains("_anim-icon-rotate")) el.classList.remove("_anim-icon-rotate");
        }));
        setTimeout((() => {
            anim_items[random_item].classList.add(`_anim-icon-${arr[number]}`);
        }), 100);
    }
    if (document.querySelector(".icon-anim img")) setInterval((() => {
        getRandomAnimate();
    }), 2e4);
    if (document.querySelector(".main") && document.querySelector(".preloader").classList.contains("_hide")) {
        document.querySelector(".main").classList.add("_active");
        document.querySelector(".man_main").classList.add("_active");
    }
    const prices = {
        ticket_2: 500,
        ticket_3: 500,
        ticket_4: 500,
        count_ball: 10
    };
    const config_game = {
        numbers: [],
        bonus_numbers: [],
        bonus_count: 0,
        delete_number: 0,
        state: 0,
        tickets: 1,
        current_win: 0
    };
    if (document.querySelector(".game") && document.querySelector(".preloader").classList.contains("_hide")) {
        drawPrices();
        createTicket(1);
        hideBalls();
    }
    function drawPrices() {
        document.querySelector(".ticket__button_2 p").textContent = `Buy ${prices.ticket_2}`;
        document.querySelector(".ticket__button_3 p").textContent = `Buy ${prices.ticket_3}`;
        document.querySelector(".ticket__button_4 p").textContent = `Buy ${prices.ticket_4}`;
    }
    function hideBalls() {
        let balls_left = document.querySelectorAll(".balls_left .balls__ball");
        let balls_right = document.querySelectorAll(".balls_right .balls__ball");
        balls_left.forEach((item => item.classList.add("_hide-left")));
        balls_right.forEach((item => item.classList.add("_hide-right")));
    }
    function createTicket(number) {
        removeItemChilds(number);
        let arrNumbers = createArrTicket();
        let blank = document.createElement("div");
        blank.classList.add("ticket__blank");
        blank.classList.add("blank");
        for (let i = 0; i < 15; i++) {
            let block = document.createElement("div");
            block.classList.add("blank__number");
            block.textContent = arrNumbers[i];
            block.setAttribute("data-number", arrNumbers[i]);
            blank.append(block);
        }
        document.querySelector(`.ticket__inner_${number}`).append(blank);
    }
    function removeItemChilds(number) {
        let item = document.querySelector(`.ticket__inner_${number}`);
        while (item.firstChild) item.removeChild(item.firstChild);
    }
    function startGame() {
        document.querySelector(".buttons__start").classList.add("_hold");
        document.querySelector(".buttons__bet").classList.add("_hold");
        getStartNumbers();
        hideButtons();
        drawValueBalls();
        if (0 == config_game.state) getBet();
        setTimeout((() => {
            checkShowNumbers();
            checkCollisions();
        }), 2e3);
        setTimeout((() => {
            document.querySelector(".bug__body").classList.add("_active");
            document.querySelector(".bonus-game").classList.add("_active");
        }), 3e3);
    }
    function getStartNumbers() {
        let random_arr = get_random_num_arr(1, 100, 42);
        config_game.numbers = random_arr();
        createGameNumbers();
    }
    function createGameNumbers() {
        let arr = config_game.numbers;
        config_game.bonus_numbers = arr.filter(((item, index) => {
            if (index >= 30) return true;
        }));
        let new_arr = arr.filter(((item, index) => {
            if (index < 30) return true;
        }));
        config_game.numbers = new_arr;
    }
    function drawValueBalls() {
        let balls = document.querySelectorAll(".balls__ball");
        for (let i = 0; i < balls.length; i++) {
            balls[i].querySelector("p").textContent = config_game.numbers[i];
            let color_class = getRandomClassBall();
            balls[i].classList.add(color_class);
        }
    }
    function getRandomClassBall() {
        let classes = [ "balls__ball_red", "balls__ball_yellow", "balls__ball_green", "balls__ball_blue", "balls__ball_purple" ];
        return classes[getRandom(0, 5)];
    }
    function checkShowNumbers() {
        let blank_numbers = document.querySelectorAll(".blank__number");
        blank_numbers.forEach((item => {
            if (config_game.numbers.includes(+item.dataset.number)) item.classList.add("_checked");
        }));
    }
    function checkShowNumbersBug() {
        let blank_numbers = document.querySelectorAll(".blank__number");
        blank_numbers.forEach((item => {
            if (+item.dataset.number == config_game.delete_number) {
                item.classList.add("_checked");
                item.classList.add("_checked_bonus");
            }
        }));
    }
    function getBet() {
        if (0 == config_game.state) {
            deleteMoney(+sessionStorage.getItem("current-bet") * config_game.tickets, ".check");
            config_game.state++;
        }
    }
    function checkWin() {
        let tickets = document.querySelectorAll(".blank__number");
        let collisions = 0;
        let number = 0;
        tickets.forEach((item => {
            if (item.classList.contains("_collision")) number++;
        }));
        if (number > 0) {
            collisions = number / 5;
            if (1 == collisions) config_game.current_win = 15 * +sessionStorage.getItem("current-bet"); else if (2 == collisions) config_game.current_win = 30 * +sessionStorage.getItem("current-bet"); else if (3 == collisions) config_game.current_win = 50 * +sessionStorage.getItem("current-bet"); else if (4 == collisions) config_game.current_win = 70 * +sessionStorage.getItem("current-bet"); else if (collisions > 4) config_game.current_win = 100 * +sessionStorage.getItem("current-bet");
            document.querySelector(".win__sub-text").textContent = "You win!";
            document.querySelector(".win__text").textContent = config_game.current_win;
            addMoney(config_game.current_win, ".check", 1e3, 2e3);
            setTimeout((() => {
                document.querySelector(".win").classList.add("_active");
            }), 1e3);
        } else {
            document.querySelector(".win__sub-text").textContent = "You loose!";
            document.querySelector(".win").classList.add("_loose");
            setTimeout((() => {
                document.querySelector(".win").classList.add("_active");
            }), 1e3);
        }
    }
    function checkCollisions() {
        let collection_1 = document.querySelectorAll(".ticket__inner_1 .blank__number");
        let collection_2, collection_3, collection_4;
        if (document.querySelector(".ticket__inner_2 .blank__number")) collection_2 = document.querySelectorAll(".ticket__inner_2 .blank__number");
        if (document.querySelector(".ticket__inner_3 .blank__number")) collection_3 = document.querySelectorAll(".ticket__inner_3 .blank__number");
        if (document.querySelector(".ticket__inner_4 .blank__number")) collection_4 = document.querySelectorAll(".ticket__inner_4 .blank__number");
        pinItemCollision(collection_1);
        if (collection_2) pinItemCollision(collection_2);
        if (collection_3) pinItemCollision(collection_3);
        if (collection_4) pinItemCollision(collection_4);
    }
    function pinItemCollision(collection) {
        if (collection[0].classList.contains("_checked") && collection[1].classList.contains("_checked") && collection[2].classList.contains("_checked") && collection[3].classList.contains("_checked") && collection[4].classList.contains("_checked")) collection.forEach(((item, index) => {
            if (index >= 0 && index <= 4) item.classList.add("_collision");
        }));
        if (collection[5].classList.contains("_checked") && collection[6].classList.contains("_checked") && collection[7].classList.contains("_checked") && collection[8].classList.contains("_checked") && collection[9].classList.contains("_checked")) collection.forEach(((item, index) => {
            if (index >= 5 && index <= 9) item.classList.add("_collision");
        }));
        if (collection[10].classList.contains("_checked") && collection[11].classList.contains("_checked") && collection[12].classList.contains("_checked") && collection[13].classList.contains("_checked") && collection[14].classList.contains("_checked")) collection.forEach(((item, index) => {
            if (index >= 10 && index <= 14) item.classList.add("_collision");
        }));
    }
    function hideButtons() {
        document.querySelectorAll(".ticket__button").forEach((item => item.classList.add("_hide")));
    }
    function resetGame() {
        config_game.numbers = [];
        config_game.bonus_numbers = [];
        config_game.bonus_count = 0;
        config_game.state = 0;
        removeActiveClasses();
        resetBugNumbers();
        if (!document.querySelector(".ticket__button_2")) {
            removeItemChilds(2);
            createButtonTicket(2);
        }
        if (!document.querySelector(".ticket__button_3")) {
            removeItemChilds(3);
            createButtonTicket(3);
        }
        if (!document.querySelector(".ticket__button_4")) {
            removeItemChilds(4);
            createButtonTicket(4);
        }
        createTicket(1);
        setTimeout((() => {
            document.querySelector(".win").classList.remove("_active");
        }), 500);
        setTimeout((() => {
            if (document.querySelector(".win").classList.contains("_loose")) document.querySelector(".win").classList.remove("_loose");
        }), 1e3);
    }
    function createButtonTicket(number) {
        let ticket_button = document.createElement("div");
        ticket_button.classList.add("ticket__button-box");
        let span = document.createElement("span");
        let btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.classList.add("ticket__button");
        btn.classList.add("button");
        btn.classList.add("button_game");
        btn.classList.add(`ticket__button_${number}`);
        let btn_image = document.createElement("img");
        btn_image.setAttribute("src", "img/icons/money.svg");
        btn_image.setAttribute("alt", "Icon");
        let text = document.createElement("p");
        if (2 == number) text.textContent = `Buy ${prices.ticket_2}`; else if (3 == number) text.textContent = `Buy ${prices.ticket_3}`; else if (4 == number) text.textContent = `Buy ${prices.ticket_4}`;
        btn.append(btn_image, text);
        ticket_button.append(span, btn);
        document.querySelector(`.ticket__inner_${number}`).append(ticket_button);
    }
    function removeActiveClasses() {
        document.querySelector(".bonus-game").classList.remove("_active");
        document.querySelectorAll(".balls__ball ").forEach((item => item.classList.remove("_active")));
        document.querySelector(".buttons__start").classList.remove("_hold");
        document.querySelector(".buttons__bet").classList.remove("_hold");
        document.querySelector(".bug__body").classList.remove("_active");
        document.querySelectorAll(".ticket__button").forEach((item => {
            if (item.classList.contains("_hide")) item.classList.remove("_hide");
        }));
    }
    function resetBugNumbers() {
        document.querySelectorAll(".bug__ball").forEach((item => {
            item.textContent = "";
            if (item.classList.contains("_opened")) item.classList.remove("_opened");
        }));
        document.querySelector(".bug__circle").textContent = "";
    }
    function getBugNumber() {
        let current_number = config_game.bonus_numbers[config_game.bonus_numbers.length - 1];
        document.querySelector(".bug__lighting").classList.add("_anim");
        document.querySelector(".bug__circle").textContent = "";
        setTimeout((() => {
            document.querySelector(".bug__lighting").classList.remove("_anim");
        }), 2e3);
        setTimeout((() => {
            document.querySelector(".bug__circle").textContent = current_number;
            document.querySelectorAll(".bug__ball").forEach((item => {
                if (item.dataset.number == config_game.bonus_count + 1) {
                    item.textContent = current_number;
                    item.classList.add("_opened");
                }
            }));
            config_game.delete_number = config_game.bonus_numbers.pop();
            config_game.bonus_count++;
        }), 2e3);
        setTimeout((() => {
            if (config_game.bonus_numbers.length <= 0) checkWin();
        }), 4e3);
    }
    function holdButtonsBug() {
        document.querySelector(".bonus-game__buttons").classList.add("_hold");
        setTimeout((() => {
            document.querySelector(".bonus-game__buttons").classList.remove("_hold");
        }), 2e3);
    }
    function useBugBonus() {
        getBugNumber();
        setTimeout((() => {
            checkShowNumbersBug();
            checkCollisions();
        }), 2e3);
    }
    function createArrTicket() {
        let random_arr = get_random_num_arr(1, 100, 15);
        let new_rand_arr = random_arr();
        return new_rand_arr;
    }
    function checkValueBet() {
        if (config_game.tickets * +sessionStorage.getItem("current-bet") > +sessionStorage.getItem("money")) {
            sessionStorage.setItem("current-bet", 10);
            return false;
        } else return true;
    }
    const audio_main = new Audio;
    audio_main.preload = "auto";
    audio_main.src = "files/audio_bg.mp3";
    audio_main.loop = [ true ];
    audio_main.volume = [ .3 ];
    document.addEventListener("click", (e => {
        let targetElement = e.target;
        if (targetElement.closest(".volume")) {
            if (targetElement.closest(".volume") && !targetElement.closest(".volume").classList.contains("_hide")) audio_main.pause(); else if (targetElement.closest(".volume") && targetElement.closest(".volume").classList.contains("_hide")) audio_main.play();
            targetElement.closest(".volume").classList.toggle("_hide");
        }
    }));
    document.addEventListener("click", (e => {
        let targetElement = e.target;
        let bank = +sessionStorage.getItem("money");
        if (targetElement.closest(".preloader__button")) {
            sessionStorage.setItem("preloader", true);
            preloader.classList.add("_hide");
            wrapper.classList.add("_visible");
            if (document.querySelector(".main") && document.querySelector(".preloader").classList.contains("_hide")) {
                document.querySelector(".main").classList.add("_active");
                document.querySelector(".man_main").classList.add("_active");
            }
        }
        if (targetElement.closest(".ticket__button_2") && bank >= prices.ticket_2) {
            deleteMoney(prices.ticket_2, ".check");
            createTicket(2);
            config_game.tickets = config_game.tickets + 1;
        }
        if (targetElement.closest(".ticket__button_3") && bank >= prices.ticket_3) {
            deleteMoney(prices.ticket_3, ".check");
            createTicket(3);
            config_game.tickets = config_game.tickets + 1;
        }
        if (targetElement.closest(".ticket__button_4") && bank >= prices.ticket_4) {
            deleteMoney(prices.ticket_4, ".check");
            createTicket(4);
            config_game.tickets = config_game.tickets + 1;
        }
        if (targetElement.closest(".buttons__start")) {
            let status_bet = checkValueBet();
            if (status_bet) {
                startGame();
                setTimeout((() => {
                    document.querySelectorAll(".balls__ball").forEach((item => item.classList.add("_active")));
                }), 500);
            } else if (!status_bet && !document.querySelector(".table-bet").classList.contains("_active")) {
                checkRemoveAddClass(".table-bet__count", "_active", document.querySelectorAll(".table-bet__count")[0]);
                document.querySelector(".table-bet").classList.add("_active");
            }
        }
        if (targetElement.closest(".buttons__bet")) document.querySelector(".table-bet").classList.toggle("_active");
        if (document.querySelector(".table-bet") && !targetElement.closest(".buttons__start") && !targetElement.closest(".buttons__bet") && !targetElement.closest(".table-bet") && document.querySelector(".table-bet").classList.contains("_active")) document.querySelector(".table-bet").classList.remove("_active");
        if (targetElement.closest(".table-bet__count")) {
            let val = +targetElement.closest(".table-bet__count").dataset.val;
            if (bank >= val * config_game.tickets) {
                sessionStorage.setItem("current-bet", val);
                checkRemoveAddClass(".table-bet__count", "_active", targetElement.closest(".table-bet__count"));
            } else noMoney(".check");
        }
        if (targetElement.closest(".bonus-game__button_1")) {
            deleteMoney(prices.count_ball, ".check");
            useBugBonus();
            holdButtonsBug();
        }
        if (targetElement.closest(".bonus-game__button_2")) checkWin();
        if (targetElement.closest(".win__button_play")) resetGame();
    }));
    window["FLS"] = true;
    isWebp();
    addLoadedClass();
})();