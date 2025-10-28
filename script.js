function openfeature() {
  let all_Elements = document.querySelectorAll(".elem");
  let all_fullElemPage = document.querySelectorAll(".fullElem");
  let all_fullElembackbtn = document.querySelectorAll(".fullElem .back");

  all_Elements.forEach(function (elem) {
    elem.addEventListener("click", function () {
      all_fullElemPage[elem.id].style.display = "block";
    });
  });

  all_fullElembackbtn.forEach(function (backbtn) {
    backbtn.addEventListener("click", function () {
      all_fullElemPage[backbtn.id].style.display = "none";
    });
  });
}
openfeature();

function todo_List() {
  let form = document.querySelector(".addtask form");
  let form_input = document.querySelector(".addtask form #input-task");
  let task_detail = document.querySelector(".addtask form textarea");
  let task_checkbox = document.querySelector(".addtask form #check ");
  let current_task = [];

  if (localStorage.getItem("current_task")) {
    current_task = JSON.parse(localStorage.getItem("current_task"));
  } else {
    console.log("is empty");
  }

  function RenderTask() {
    localStorage.setItem("current_task", JSON.stringify(current_task));
    let alltask = document.querySelector(".alltask");
    let sum = "";
    current_task.forEach(function (elem, idx) {
      if (elem === " ") {
        elem.textContent = "please enter task";
      } else {
        sum =
          sum +
          `<div class="task">
              <h5>${elem.task} <span class="${elem.imp}"> imp</span></h5>
              <button id=${idx}> Mark As Completed</button>
            </div>`;
      }
    });

    alltask.innerHTML = sum;
    let markCompleted = document.querySelectorAll(".task button");

    markCompleted.forEach(function (btn) {
      btn.addEventListener("click", function () {
        current_task.splice(btn.id, 1);
        RenderTask();
      });
    });
  }
  RenderTask();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    current_task.push({
      task: form_input.value,
      detail: task_detail.value,
      imp: task_checkbox.checked,
    });
    RenderTask();

    form_input.value = "";
    task_detail.value = "";
    task_checkbox.value = false;
  });

  // localStorage.clear();
}
todo_List();

function Daily_Planner() {
  let planner_object = JSON.parse(localStorage.getItem("planner_object")) || {};

  var day_planner = document.querySelector(".day-planner");
  var hours = Array.from(
    { length: 18 },
    (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`
  );

  let wholeDay_sum = "";

  hours.forEach(function (elem, idx) {
    let saved_data = planner_object[idx] || "";

    wholeDay_sum =
      wholeDay_sum +
      `<div class="day-planner-time">
            <p>${elem}</p>
            <input id=${idx}  type="text" placeholder="..."  value=${saved_data}>
          </div>`;
  });

  day_planner.innerHTML = wholeDay_sum;
  let DayPlannerInput = document.querySelectorAll(".day-planner input");

  DayPlannerInput.forEach(function (elem) {
    elem.addEventListener("input", function () {
      planner_object[elem.id] = elem.value;
      localStorage.setItem("planner_object", JSON.stringify(planner_object));
    });
  });
}
Daily_Planner();

function Motivational_Quote() {
  var Motivation_Quote = document.querySelector(".motivation-2 h1");
  var Motivation_Author = document.querySelector(".motivation-3 h1");

  async function fetch_quote() {
    let response = await fetch(
      "https://motivational-spark-api.vercel.app/api/quotes/random"
    );
    let data = await response.json();
    Motivation_Quote.innerHTML = data.quote;
    Motivation_Author.innerHTML = ` ~ ${data.author}`;
  }
  fetch_quote();
}
Motivational_Quote();

function PomodoroTimer() {
  var timerInterval = null;
  var timer = document.querySelector(".pomo-timer h1");
  var StartBtn = document.querySelector(".pomo-timer .class-timer");
  var PauseBtn = document.querySelector(".pomo-timer .pause-timer");
  var ResetBtn = document.querySelector(".pomo-timer .reset-timer");
  var Session = document.querySelector(".pomodoro-fullpage .session");
  var isWorkSession = true;
  var total_seconds = 1500;
  var isPaused = false;

  function upDateTimer() {
    let minutes = Math.floor(total_seconds / 60);
    let seconds = total_seconds % 60;
    timer.innerHTML = `${String(minutes).padStart("2", "0")} : ${String(
      seconds
    ).padStart("2", "0")}`;
  }

  function StartTimer() {
    clearInterval(timerInterval);
    if (isWorkSession) {
      Session.innerHTML = "Work Session";
      Session.style.backgroundColor = "var(--blue)";
      timerInterval = setInterval(function () {
        if (total_seconds > 0) {
          total_seconds--;
          upDateTimer();
        } else {
          isWorkSession = false;
          clearInterval(timerInterval);
          timer.innerHTML = `05:00`;
          Session.innerHTML = "Take Break";
          Session.style.backgroundColor = "var(--orange)";
          total_seconds = 5 * 60;
        }
      }, 1000);
    } else {
      timerInterval = setInterval(function () {
        if (total_seconds > 0) {
          total_seconds--;
          upDateTimer();
        } else {
          Session.innerHTML = "Work Session";
          Session.style.backgroundColor = "var(--blue)";
          isWorkSession = true;
          clearInterval(timerInterval);
          timer.innerHTML = `25:00`;
          total_seconds = 25 * 60;
        }
      }, 1000);
    }
  }
  function PauseTimer() {
    clearInterval(timerInterval);
  }
  function ResetTimer() {
    clearInterval(timerInterval);
    total_seconds = 1500;
    upDateTimer();
  }
  StartBtn.addEventListener("click", StartTimer);
  PauseBtn.addEventListener("click", PauseTimer);
  ResetBtn.addEventListener("click", ResetTimer);
}

PomodoroTimer();

//  const api_key = 'bc5ce72b10ab40d1b81173421252710';
function Weather_app() {
  var city = "srinagar";
  var api_data = null;
  var HeaderTime = document.querySelector(".header-1 h1");
  var HeaderDate = document.querySelector(".header-1 h2");
  var HeaderTemp = document.querySelector(".header-2 h2");
  var HeaderCondition = document.querySelector(".header-2 h4");
  var precipitation = document.querySelector(".header-2 .precipitation");
  var humidity = document.querySelector(".header-2 .humidity");
  var wind = document.querySelector(".header-2 .wind");
  var headerCity = document.querySelector(".header-1 h4");

  async function weather_api_call() {
    const api_key = "bc5ce72b10ab40d1b81173421252710";

    let api_response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${city}`
    );
    var api_data = await api_response.json();
    console.log(api_data.current.temp_c);

    HeaderTemp.innerHTML = `${api_data.current.temp_c}°C`;
    HeaderCondition.innerHTML = `${api_data.current.condition.text}`;
    wind.innerHTML = `wind: ${api_data.current.wind_kph}km/h`;
    humidity.innerHTML = `Humidity: ${api_data.current.humidity}%`;
    precipitation.innerHTML = `Heat-Index: ${api_data.current.heatindex_c}%`;
    headerCity.innerHTML = ` ${city}`;
  }

  weather_api_call();
  var date = null;

  function TimeDate() {
    const TotaldaysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thrusday",
      "Friday",
      "Saturday",
    ];
    const TotalMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    date = new Date();
    var DayOfWeek = TotaldaysOfWeek[date.getDay()];
    var day_hours = date.getHours();
    var day_minutes = date.getMinutes();
    var day_seconds = date.getSeconds();
    var header_date = date.getDate();
    var header_month = TotalMonths[date.getMonth()];
    var header_year = date.getFullYear();

    HeaderDate.innerHTML = `${header_date}  ${header_month}  ${header_year}`;
    if (day_hours > 12) {
      HeaderTime.innerHTML = `${DayOfWeek} ${day_hours - 12}:${String(
        day_minutes
      ).padStart("2", "0")}:${String(day_seconds).padStart("2", "0")} PM`;
    } else {
      HeaderTime.innerHTML = `${DayOfWeek} ${day_hours}:${String(
        day_minutes
      ).padStart("2", "0")}:${String(day_seconds).padStart("2", "0")} AM`;
    }
  }

  setInterval(() => {
    TimeDate();
  }, 1000);
}
Weather_app();
